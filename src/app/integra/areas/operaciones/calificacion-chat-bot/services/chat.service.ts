import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ChatbotHiloChatPorAlumnoDTO,
  ChatbotHiloChatPorSegmentoDTO,
  AlumnoAgrupado,
  NoAlumnoAgrupado,
  ChatbotMensajeDTO,
  ChatbotWhatsAppMensajeDTO,
  PagedResponse,
  HiloChatPaginadoDTO,
  AlumnoListadoDTO,
  SegmentoListadoDTO,
  SolicitudPorHiloDTO
} from '../models/models';
import { IntegraService } from '@shared/services/integra.service';
import { constApiOperaciones } from 'src/environments/constApi';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends IntegraService {
  private readonly alumnosAgrupadosSubject = new BehaviorSubject<AlumnoAgrupado[]>([]);
  private readonly noAlumnosAgrupadosSubject = new BehaviorSubject<NoAlumnoAgrupado[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly alumnosListadoSubject = new BehaviorSubject<AlumnoListadoDTO[]>([]);
  private readonly totalAlumnosSubject = new BehaviorSubject<number>(0);
  private readonly segmentosListadoSubject = new BehaviorSubject<SegmentoListadoDTO[]>([]);
  private readonly totalSegmentosSubject = new BehaviorSubject<number>(0);

  // Almacenamiento temporal de mensajes por hilo
  private mensajesCache: Map<number, ChatbotMensajeDTO[]> = new Map();

  readonly alumnosAgrupados$ = this.alumnosAgrupadosSubject.asObservable();
  readonly noAlumnosAgrupados$ = this.noAlumnosAgrupadosSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly alumnosListado$ = this.alumnosListadoSubject.asObservable();
  readonly totalAlumnos$ = this.totalAlumnosSubject.asObservable();
  readonly segmentosListado$ = this.segmentosListadoSubject.asObservable();
  readonly totalSegmentos$ = this.totalSegmentosSubject.asObservable();

  loadStudents(fechaCorte?: Date): void {
    this.loadingSubject.next(true);

    const corte = fechaCorte ?? new Date(new Date().getFullYear(), 0, 1);

    this.obtenerPorFiltro(constApiOperaciones.ObtenerHilosChatConAlumnos, { fechaCorte: corte })
      .subscribe({
        next: (alumnos) => {
          const response = alumnos.body as { items: ChatbotHiloChatPorAlumnoDTO[] } | null;
          const alumnosAgrupados = this.agruparAlumnos(response?.items || []);
          this.alumnosAgrupadosSubject.next(alumnosAgrupados);
        },
        error: (error) => {
          console.error('Error cargando alumnos:', error);
        }
      });

    this.obtenerPorFiltro(constApiOperaciones.ObtenerHilosChatPorSegmento, {})
      .subscribe({
        next: (segmentos) => {
          const noAlumnosAgrupados = this.agruparNoAlumnos(segmentos.body || []);
          this.noAlumnosAgrupadosSubject.next(noAlumnosAgrupados);
        },
        error: (error) => {
          console.error('Error cargando segmentos:', error);
        },
        complete: () => {
          this.loadingSubject.next(false);
        }
      });
  }

  loadNoAlumnos(): void {
    this.obtenerPorFiltro(constApiOperaciones.ObtenerHilosChatPorSegmento, {})
      .subscribe({
        next: (segmentos) => {
          const noAlumnosAgrupados = this.agruparNoAlumnos(segmentos.body || []);
          this.noAlumnosAgrupadosSubject.next(noAlumnosAgrupados);
        },
        error: (error) => {
          console.error('Error cargando segmentos:', error);
        }
      });
  }

  loadAlumnosPaginados(
    pageNumber:       number,
    pageSize:         number,
    fechaInicio?:     Date | null,
    fechaFin?:        Date | null,
    codigoMatricula?: string,
    intervencionBot:  number = 0
  ): void {
    this.loadingSubject.next(true);

    const payload: Record<string, unknown> = { pageNumber, pageSize, intervencionBot };

    if (fechaInicio) {
      payload['fechaInicio'] = fechaInicio;
      // fechaFin siempre presente cuando hay fechaInicio — default: hoy
      payload['fechaFin'] = fechaFin ? this.toEndOfDay(fechaFin) : new Date();
    }

    if (codigoMatricula) {
      payload['codigoMatricula'] = codigoMatricula;
    }

    this.obtenerPorFiltro(constApiOperaciones.ObtenerHilosChatConAlumnos, payload)
      .subscribe({
        next: (response) => {
          const paged = response.body as { items: AlumnoListadoDTO[]; totalCount: number } | null;
          this.alumnosListadoSubject.next(paged?.items || []);
          this.totalAlumnosSubject.next(paged?.totalCount || 0);
          this.loadingSubject.next(false);
        },
        error: (error) => {
          console.error('Error cargando alumnos paginados:', error);
          this.loadingSubject.next(false);
        }
      });
  }

  loadSegmentosPaginados(
    pageNumber:      number,
    pageSize:        number,
    fechaInicio?:    Date | null,
    fechaFin?:       Date | null,
    intervencionBot: number = 0
  ): void {
    this.loadingSubject.next(true);

    const payload: Record<string, unknown> = {
      pageNumber,
      pageSize,
      intervencionBot,
      fechaInicio: fechaInicio ?? null,
      fechaFin:    fechaInicio ? (fechaFin ? this.toEndOfDay(fechaFin) : new Date()) : null
    };

    this.obtenerPorFiltro(constApiOperaciones.ObtenerHilosChatPorSegmentoPaginado, payload)
      .subscribe({
        next: (response) => {
          const paged = response.body as { items: SegmentoListadoDTO[]; totalCount: number } | null;
          this.segmentosListadoSubject.next(paged?.items || []);
          this.totalSegmentosSubject.next(paged?.totalCount || 0);
          this.loadingSubject.next(false);
        },
        error: (error) => {
          console.error('Error cargando segmentos paginados:', error);
          this.loadingSubject.next(false);
        }
      });
  }

  private agruparAlumnos(hilos: ChatbotHiloChatPorAlumnoDTO[]): AlumnoAgrupado[] {
    const agrupadoMap = new Map<number, AlumnoAgrupado>();

    hilos.forEach(hilo => {
      const key = hilo.idAlumno || 0;
      
      if (!agrupadoMap.has(key)) {
        agrupadoMap.set(key, {
          idAlumno: hilo.idAlumno,
          nombreAlumno: hilo.nombreAlumno,
          email: hilo.email || '',
          codigoMatricula: hilo.codigoMatricula,
          estadoMatricula: hilo.estadoMatricula,
          codigoAreaDerivacion: hilo.codigoAreaDerivacion,
          derivado: hilo.derivado,
          totalChats: 0,
          fechaCreacion: hilo.fechaCreacion,
          hilos: []
        });
      }

      const alumno = agrupadoMap.get(key)!;
      alumno.hilos.push(hilo);
      alumno.totalChats = alumno.hilos.length;
      
      // Mantener la fecha de creación más antigua
      if (new Date(hilo.fechaCreacion) < new Date(alumno.fechaCreacion)) {
        alumno.fechaCreacion = hilo.fechaCreacion;
      }
    });

    return Array.from(agrupadoMap.values());
  }

  private agruparNoAlumnos(hilos: ChatbotHiloChatPorSegmentoDTO[]): NoAlumnoAgrupado[] {
    const agrupadoMap = new Map<string, NoAlumnoAgrupado>();

    hilos.forEach(hilo => {
      const key = hilo.idContactoPortalSegmento;
      
      if (!agrupadoMap.has(key)) {
        agrupadoMap.set(key, {
          idContactoPortalSegmento: hilo.idContactoPortalSegmento,
          codigoAreaDerivacion: hilo.codigoAreaDerivacion,
          derivado: hilo.derivado,
          totalChats: 0,
          fechaCreacion: hilo.fechaCreacion,
          hilos: []
        });
      }

      const noAlumno = agrupadoMap.get(key)!;
      noAlumno.hilos.push(hilo);
      noAlumno.totalChats = noAlumno.hilos.length;
    });

    return Array.from(agrupadoMap.values());
  }

  /**
   * Obtiene los mensajes de chat de un alumno específico
   * Los mensajes vienen agrupados por hilos
   * @param idAlumno - ID del alumno
   * @returns Observable con todos los mensajes del alumno
   */
  obtenerMensajesPorAlumno$(idAlumno: number): Observable<HttpResponse<ChatbotMensajeDTO[]>> {
    return this.postJsonResponse(
      constApiOperaciones.ObtenerChatBotPorAlumno,
      JSON.stringify({ idAlumno })
    );
  }

  obtenerMensajesWhatsAppPorAlumno$(idAlumno: number): Observable<HttpResponse<ChatbotWhatsAppMensajeDTO[]>> {
    return this.postJsonResponse(
      constApiOperaciones.ObtenerChatBotWhatsAppAtcPorAlumno,
      JSON.stringify({ idAlumno })
    );
  }

  /**
   * Obtiene los mensajes de chat de un segmento específico
   * Los mensajes vienen agrupados por hilos
   * @param idContactoPortalSegmento - ID del contacto portal segmento
   * @returns Observable con todos los mensajes del segmento
   */
  obtenerMensajesPorSegmento$(idContactoPortalSegmento: string): Observable<HttpResponse<ChatbotMensajeDTO[]>> {
    return this.postJsonResponse(
      constApiOperaciones.ObtenerChatBotPorPortalSegmento,
      JSON.stringify({ idContactoPortalSegmento })
    );
  }

  /**
   * Almacena mensajes en caché agrupados por hilo
   * @param mensajes - Array de mensajes a cachear
   */
  cachearMensajes(mensajes: ChatbotMensajeDTO[]): void {
    this.mensajesCache.clear();
    
    mensajes.forEach(mensaje => {
      const idHilo = mensaje.idChatbotPortalHiloChat;
      
      if (!this.mensajesCache.has(idHilo)) {
        this.mensajesCache.set(idHilo, []);
      }
      
      this.mensajesCache.get(idHilo)!.push(mensaje);
    });
  }

  /**
   * Obtiene mensajes de un hilo desde el caché
   * @param idHilo - ID del hilo
   * @returns Array de mensajes del hilo
   */
  obtenerMensajesDeCache(idHilo: number): ChatbotMensajeDTO[] {
    return this.mensajesCache.get(idHilo) || [];
  }

  /**
   * Limpia el caché de mensajes
   */
  limpiarCacheMensajes(): void {
    this.mensajesCache.clear();
  }

  /**
   * Obtiene los tipos de entrada activos para el formulario
   * @returns Observable con los tipos de entrada
   */
  obtenerTiposEntradaActivos$(): Observable<HttpResponse<any>> {
    return this.obtenerPorFiltro(constApiOperaciones.ObtenerTiposEntradaActivos, {});
  }

  /**
   * Obtiene las versiones de formulario activas
   * @returns Observable con las versiones de formulario
   */
  obtenerVersionesFormularioActivas$(): Observable<HttpResponse<any>> {
    return this.obtenerPorFiltro(constApiOperaciones.ObtenerVersionesFormularioActivas, {});
  }

  /**
   * Obtiene las preguntas con respuestas de una versión específica del formulario
   * @param idVersionFormulario - ID de la versión del formulario
   * @returns Observable con las preguntas y respuestas
   */
  obtenerPreguntasConRespuestas$(idVersionFormularioEvaluacionChatbot: number): Observable<HttpResponse<any>> {
    return this.postJsonResponse(
      constApiOperaciones.ObtenerPreguntasConRespuestas,
      JSON.stringify({ idVersionFormularioEvaluacionChatbot })
    );
  }

  /**
   * Inserta la evaluación completa del chat
   * @param evaluacion - Datos de la evaluación completa
   * @returns Observable con la respuesta del servidor
   */
  insertarEvaluacionCompleta$(evaluacion: any): Observable<HttpResponse<any>> {
    return this.postJsonResponse(
      constApiOperaciones.InsertarRespuestaEvaluacionCompleta,
      JSON.stringify(evaluacion)
    );
  }

  /**
   * Obtiene las respuestas de un formulario ya aplicado (Portal Web)
   * @param idChatbotPortalHiloChat - ID del hilo de chat
   */
  obtenerRespuestasFormularioAplicado$(IdChatbotPortalHiloChat: number): Observable<HttpResponse<any>> {
    return this.postJsonResponse(
      constApiOperaciones.ObtenerRespuestasUsuarioPorFormularioAplicado,
      JSON.stringify({ IdChatbotPortalHiloChat })
    );
  }

  /**
   * Obtiene las respuestas de un formulario ya aplicado (WhatsApp)
   * @param idChatbotWhatsAppHiloChat - ID del hilo de WhatsApp
   */
  obtenerRespuestasFormularioAplicadoWhatsapp$(idChatbotWhatsAppHiloChat: number): Observable<HttpResponse<any>> {
    return this.postJsonResponse(
      constApiOperaciones.ObtenerRespuestasUsuarioPorFormularioAplicadoWhatsapp,
      JSON.stringify({ idChatbotWhatsAppHiloChat })
    );
  }

  /**
   * Obtiene hilos de un alumno paginados (Portal Web + WhatsApp) con esCalificado precalculado.
   * Reemplaza el patrón 2+N llamadas HTTP anterior.
   */
  obtenerHilosPaginados$(
    idAlumno:    number,
    fechaInicio: Date,
    pageNumber:  number,
    pageSize:    number,
    fechaFin?:   Date | null
  ): Observable<HttpResponse<PagedResponse<HiloChatPaginadoDTO>>> {
    const payload: Record<string, unknown> = {
      idAlumno,
      fechaInicio,
      fechaFin: fechaFin ? this.toEndOfDay(fechaFin) : new Date(),
      pageNumber,
      pageSize
    };
    return this.postJsonResponse(
      constApiOperaciones.ObtenerHilosPaginadosPorAlumno,
      JSON.stringify(payload)
    );
  }

  obtenerHilosPaginadosPorSegmento$(
    idContactoPortalSegmento: string,
    fechaInicio: Date,
    pageNumber:  number,
    pageSize:    number,
    fechaFin?:   Date | null
  ): Observable<HttpResponse<PagedResponse<HiloChatPaginadoDTO>>> {
    const payload: Record<string, unknown> = {
      idContactoPortalSegmento,
      fechaInicio,
      fechaFin: fechaFin ? this.toEndOfDay(fechaFin) : new Date(),
      pageNumber,
      pageSize
    };
    // El backend devuelve items mezclados (Portal y WhatsApp) discriminados por `origen`.
    // - WhatsApp: contrato intacto -> trae `idHilo` e `idOrigen`.
    // - Portal:   campos renombrados -> trae `idChatbotPortalHiloChat` (= idHilo) e
    //                                    `idMedioComunicacion_Origen` (= idOrigen).
    // Normalizamos los items de Portal al contrato interno comun (`idHilo` / `idOrigen`).
    return this.postJsonResponse(
      constApiOperaciones.ObtenerHilosPaginadosPorSegmento,
      JSON.stringify(payload)
    ).pipe(
      map((response: HttpResponse<PagedResponse<HiloChatPaginadoDTO>>) => {
        if (!response.body) return response;
        const items = (response.body.items || []).map(h => {
          const raw = h as unknown as {
            idChatbotPortalHiloChat?: number;
            idMedioComunicacion_Origen?: number;
          };
          return {
            ...h,
            idHilo:   h.idHilo   ?? raw.idChatbotPortalHiloChat   ?? 0,
            idOrigen: h.idOrigen ?? raw.idMedioComunicacion_Origen ?? 0
          };
        });
        return response.clone({ body: { ...response.body, items } });
      })
    );
  }

  /**
   * Inserta la evaluación completa del chat para WhatsApp
   * @param evaluacion - Datos de la evaluación completa
   */
  /**
   * Obtiene las solicitudes vinculadas a un hilo de chat
   * @param idHiloChat - ID del hilo
   * @param idChatbotTipo - 1 = WhatsApp ATC | 2 = Portal Web
   */
  obtenerSolicitudesPorHilo$(idHiloChat: number, idChatbotTipo: number): Observable<HttpResponse<SolicitudPorHiloDTO[]>> {
    return this.postJsonResponse(
      constApiOperaciones.ObtenerSolicitudesPorHiloChat,
      JSON.stringify({ idHiloChat, idChatbotTipo })
    );
  }

  insertarEvaluacionCompletaWhatsapp$(evaluacion: any): Observable<HttpResponse<any>> {
    return this.postJsonResponse(
      constApiOperaciones.InsertarRespuestaEvaluacionCompletaWhatsapp,
      JSON.stringify(evaluacion)
    );
  }

  private toEndOfDay(fecha: Date): Date {
    const f = new Date(fecha);
    return new Date(f.getFullYear(), f.getMonth(), f.getDate(), 23, 59, 59, 999);
  }

}
