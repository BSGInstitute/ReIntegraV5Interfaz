import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { 
  Student, 
  Chat, 
  Evaluation, 
  FilterOptions, 
  ChatbotHiloChatPorAlumnoDTO, 
  ChatbotHiloChatPorSegmentoDTO,
  AlumnoAgrupado,
  NoAlumnoAgrupado,
  ChatbotMensajeDTO
} from '../models/models';
import { IntegraService } from '@shared/services/integra.service';
import { constApiOperaciones } from 'src/environments/constApi';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends IntegraService {
  private readonly alumnosAgrupadosSubject = new BehaviorSubject<AlumnoAgrupado[]>([]);
  private readonly noAlumnosAgrupadosSubject = new BehaviorSubject<NoAlumnoAgrupado[]>([]);
  private readonly studentsSubject = new BehaviorSubject<Student[]>([]);
  private readonly chatsSubject = new BehaviorSubject<Chat[]>([]);
  private readonly filtersSubject = new BehaviorSubject<FilterOptions>({});
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  // Almacenamiento temporal de mensajes por hilo
  private mensajesCache: Map<number, ChatbotMensajeDTO[]> = new Map();

  readonly alumnosAgrupados$ = this.alumnosAgrupadosSubject.asObservable();
  readonly noAlumnosAgrupados$ = this.noAlumnosAgrupadosSubject.asObservable();
  readonly students$ = this.studentsSubject.asObservable();
  readonly chats$ = this.chatsSubject.asObservable();
  readonly filters$ = this.filtersSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();

  loadStudents(): void {
    this.loadingSubject.next(true);
    
    forkJoin({
      alumnos: this.obtenerPorFiltro(constApiOperaciones.ObtenerHilosChatConAlumnos, {}),
      segmentos: this.obtenerPorFiltro(constApiOperaciones.ObtenerHilosChatPorSegmento, {})
    }).subscribe({
      next: ({ alumnos, segmentos }) => {
        const alumnosAgrupados = this.agruparAlumnos(alumnos.body || []);
        const noAlumnosAgrupados = this.agruparNoAlumnos(segmentos.body || []);
        
        this.alumnosAgrupadosSubject.next(alumnosAgrupados);
        this.noAlumnosAgrupadosSubject.next(noAlumnosAgrupados);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        console.error('Error cargando datos:', error);
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
   * Obtiene las respuestas de un formulario ya aplicado
   * @param idChatbotPortalHiloChat - ID del hilo de chat
   * @returns Observable con las respuestas guardadas
   */
  obtenerRespuestasFormularioAplicado$(IdChatbotPortalHiloChat: number): Observable<HttpResponse<any>> {
    return this.postJsonResponse(
      constApiOperaciones.ObtenerRespuestasUsuarioPorFormularioAplicado,
      JSON.stringify({ IdChatbotPortalHiloChat })
    );
  }

  // Métodos legacy - Mantener para compatibilidad
  loadStudentChats(studentId: string): void {
    // Deprecated: use obtenerMensajesPorAlumno$ instead
  }

  submitEvaluation(evaluation: Evaluation): Observable<HttpResponse<any>> {
    return this.postJsonResponse(
      constApiOperaciones.InsertarRespuestaEvaluacionCompleta,
      JSON.stringify(evaluation)
      );
  }

  updateFilters(filters: FilterOptions): void {
    this.filtersSubject.next(filters);
  }

  getStudents(): Observable<Student[]> {
    return this.students$;
  }

  clearChats(): void {
    this.chatsSubject.next([]);
  }
}
