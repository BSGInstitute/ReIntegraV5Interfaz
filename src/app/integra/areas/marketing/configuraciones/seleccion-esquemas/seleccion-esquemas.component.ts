import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiMarketing } from '@environments/constApi';
import Swal from 'sweetalert2';

// ─── Interfaces ──────────────────────────────────────────────

export interface CatalogoItem {
  id: number;
  nombre: string;
}

export interface ActividadBotIA {
  id: number;
  nombre: string;
  numeros: string[];
  idChatbotEsquema: number;
  nombreEsquema: string;
  idMedioComunicacion: number;
  nombreMedioComunicacion: string;
  estado: boolean;
}

export interface MedioComunicacionItem {
  idMedioComunicacion: number;
  nombreMedioComunicacion: string;
}

// DTOs tal como llegan del backend (campos con nombre específico)
interface FaseBackendDTO {
  idChatbotEsquemaAsignacionFase: number;
  nombreFase: string;
}
interface MensajeExactoBackendDTO {
  idChatbotEsquemaAsignacionMensajeExacto: number;
  nombreMensajeExacto: string;
}
interface PerfilBackendDTO {
  idChatbotEsquemaAsignacionPerfil: number;
  nombrePerfil: string;
}


export interface SubcategoriaItem {
  nombre: string;
  fasMaximaValores: string[];
  perfilValores: string[];
}

export interface InterpretarInformacionItem {
  id: number;
  nombre: string;
  clasificaciones: string[];
  subcategorias: SubcategoriaItem[];
}

export interface LecturaMensajeItem {
  clasificacion: string;
  mensajesExactos: string[];
  promptLectura: string;
}

export interface EsquemaRespuestaItem {
  clasificacion: string;
  mostrarClasificacion: boolean;
  subcategoria: string;
  parametrosRespuesta: string;
}

export interface EsquemaConfiguracion {
  id: number;
  nombre: string;
  lecturasMensajes: LecturaMensajeItem[];
  interpretarInformacion: InterpretarInformacionItem[];
  esquemasRespuesta: EsquemaRespuestaItem[];
  restricciones: string;
  totalLecturas?: number;
  totalInterpretaciones?: number;
}

// DTO que retorna el listado completo (para grid + edición)
interface EsquemaListadoBackendDTO {
  idChatbotEsquema: number;
  nombre: string;
  restricciones: string;
  totalLecturas: number;
  totalInterpretaciones: number;
  lecturasMensajes: { clasificacion: string; promptLectura: string; mensajesExactos: string[]; }[];
  interpretarInformacion: {
    nombre: string;
    clasificaciones: string[];
    subcategorias: { nombre: string; fasMaximaValores: string[]; perfilValores: string[]; }[];
  }[];
  esquemasRespuesta: { clasificacion: string; subcategoria: string; parametrosRespuesta: string; }[];
}

/**
 * @module MarketingModule
 * @description Componente de Selección de Esquemas - BOT IA
 * @version 1.0.0
 */
@Component({
  selector: 'app-seleccion-esquemas',
  templateUrl: './seleccion-esquemas.component.html',
  styleUrls: ['./seleccion-esquemas.component.scss'],
})
export class SeleccionEsquemasComponent implements OnInit {
  @ViewChild('modalActividadBotIA') modalActividadBotIA: any;
  @ViewChild('modalConfiguracionBotIA') modalConfiguracionBotIA: any;
  @ViewChild('modalLecturaMensaje') modalLecturaMensaje: any;
  @ViewChild('modalInterpretarInformacion') modalInterpretarInformacion: any;

  usuario = JSON.parse(localStorage.getItem('userData'));
  selectedTabIndex = 0;

  // ─── Listas del backend ──────────────────────────────
  listaMensajesExactos: string[] = [];
  listaNumeros: string[] = [];
  listaFaseMaxima: CatalogoItem[] = [];
  listaPerfil: CatalogoItem[] = [];
  listaMediosComunicacion: MedioComunicacionItem[] = [];

  // ─── Tab 1: Actividades BOT IA ───────────────────────
  listaActividadesBotIA: ActividadBotIA[] = [];
  loaderGridActividades = false;
  isNewActividad = false;
  actividadActual: ActividadBotIA = this.nuevaActividad();
  modalRefActividad: any;

  // ─── Tab 3: Configuración BOT IA ─────────────────────
  listaConfiguracionBotIA: EsquemaConfiguracion[] = [];
  loaderGridConfiguracion = false;
  loaderModalConfiguracion = false;
  isNewConfiguracion = false;
  modalRefConfiguracion: any;
  configuracionActual: EsquemaConfiguracion = this.nuevaConfiguracion();

  // ─── Sub-modal: Lectura de mensajes ──────────────────
  modalRefLecturaMensaje: any;
  isNewLectura = false;
  lecturaMensajeActual: LecturaMensajeItem = this.nuevaLectura();
  lecturaMensajeIndexEdit: number | null = null;

  // ─── Sub-modal: Interpretar información ──────────────
  modalRefInterpretarInformacion: any;
  isNewInterpretarInformacion = false;
  interpretarInformacionActual: InterpretarInformacionItem = this.nuevoInterpretarInformacion();
  interpretarInformacionIndexEdit: number | null = null;
  interpretarInformacionContador = 0;

  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.obtenerActividadesBotIA();
    this.obtenerConfiguracionBotIA();
    this.cargarListaMensajesExactos();
    this.cargarListaNumeros();
    this.cargarListaFaseMaxima();
    this.cargarListaPerfil();
    this.cargarListaMediosComunicacion();
  }

  // ─── Clasificaciones disponibles (computed) ──────────

  get clasificacionesDisponibles(): string[] {
    return this.configuracionActual.lecturasMensajes
      .map(l => l.clasificacion)
      .filter(c => c?.trim());
  }

  // ─── Carga de listas del backend ─────────────────────

  cargarListaMensajesExactos(): void {
    this.integraService
      .getJsonResponse(constApiMarketing.SeleccionEsquemasMensajeExactoObtenerLista)
      .subscribe({
        next: (resp: HttpResponse<MensajeExactoBackendDTO[]>) => {
          // Mapeamos a string[] para compatibilidad con allowCustom del multiselect
          this.listaMensajesExactos = (resp.body ?? []).map(x => x.nombreMensajeExacto);
        },
        error: () => { this.listaMensajesExactos = []; }
      });
  }

  cargarListaNumeros(): void {
    this.integraService
      .getJsonResponse(constApiMarketing.SeleccionEsquemasActividadesNumerosObtenerLista)
      .subscribe({
        next: (resp: HttpResponse<{ numeroAsociado: string }[]>) => {
          this.listaNumeros = (resp.body ?? []).map(x => x.numeroAsociado);
        },
        error: () => { this.listaNumeros = []; }
      });
  }

  cargarListaFaseMaxima(): void {
    this.integraService
      .getJsonResponse(constApiMarketing.SeleccionEsquemasFaseMaximaObtenerLista)
      .subscribe({
        next: (resp: HttpResponse<FaseBackendDTO[]>) => {
          this.listaFaseMaxima = (resp.body ?? []).map(x => ({ id: x.idChatbotEsquemaAsignacionFase, nombre: x.nombreFase }));
        },
        error: () => { this.listaFaseMaxima = []; }
      });
  }

  cargarListaPerfil(): void {
    this.integraService
      .getJsonResponse(constApiMarketing.SeleccionEsquemasPerfilObtenerLista)
      .subscribe({
        next: (resp: HttpResponse<PerfilBackendDTO[]>) => {
          this.listaPerfil = (resp.body ?? []).map(x => ({ id: x.idChatbotEsquemaAsignacionPerfil, nombre: x.nombrePerfil }));
        },
        error: () => { this.listaPerfil = []; }
      });
  }

  cargarListaMediosComunicacion(): void {
    this.integraService
      .getJsonResponse(constApiMarketing.SeleccionEsquemasActividadesMedioComunicacionObtenerLista)
      .subscribe({
        next: (resp: HttpResponse<MedioComunicacionItem[]>) => {
          this.listaMediosComunicacion = resp.body ?? [];
        },
        error: () => { this.listaMediosComunicacion = []; }
      });
  }

  // =============================================
  // TAB 1 — Actividades BOT IA
  // =============================================

  obtenerActividadesBotIA(): void {
    this.loaderGridActividades = true;
    this.integraService
      .getJsonResponse(constApiMarketing.SeleccionEsquemasActividadesObtenerListado)
      .subscribe({
        next: (resp: HttpResponse<any[]>) => {
          this.listaActividadesBotIA = (resp.body ?? []).map(x => ({
            id:                     x.idChatbotActividad,
            nombre:                 x.nombreChatbotActividad,
            numeros:                x.numeros ?? [],
            idChatbotEsquema:       x.idChatbotEsquema,
            nombreEsquema:          x.nombreChatbotEsquema,
            idMedioComunicacion:    x.idMedioComunicacion,
            nombreMedioComunicacion: x.nombreMedioComunicacion,
            estado:                 x.estado,
          } as ActividadBotIA));
          this.loaderGridActividades = false;
        },
        error: () => { this.loaderGridActividades = false; }
      });
  }

  gridEventsActividades(evento: string, isNew: boolean, dataItem: any, rowIndex: any): void {
    switch (evento) {
      case 'add':
        this.isNewActividad = true;
        this.actividadActual = this.nuevaActividad();
        this.modalRefActividad = this.modalService.open(this.modalActividadBotIA, { size: 'md' });
        break;
      case 'edit':
        this.isNewActividad = false;
        this.actividadActual = JSON.parse(JSON.stringify(dataItem));
        this.modalRefActividad = this.modalService.open(this.modalActividadBotIA, { size: 'md' });
        break;
      case 'remove':
        this.eliminarActividad(dataItem.id);
        break;
      case 'reload':
        this.obtenerActividadesBotIA();
        break;
    }
  }

  guardarActividad(): void {
    if (!this.actividadActual.nombre?.trim()) {
      this.alertaService.notificationWarning('Ingrese el nombre de la actividad');
      return;
    }
    if (!this.actividadActual.idMedioComunicacion) {
      this.alertaService.notificationWarning('Seleccione un medio de comunicación');
      return;
    }
    if (this.actividadActual.idMedioComunicacion === 1 && (!this.actividadActual.numeros || this.actividadActual.numeros.length === 0)) {
      this.alertaService.notificationWarning('Ingrese al menos un número');
      return;
    }
    if (!this.actividadActual.idChatbotEsquema) {
      this.alertaService.notificationWarning('Seleccione un esquema');
      return;
    }

    const payload = {
      nombre:              this.actividadActual.nombre.trim(),
      numeros:             this.actividadActual.idMedioComunicacion === 1 ? this.actividadActual.numeros : [],
      idChatbotEsquema:    this.actividadActual.idChatbotEsquema,
      idMedioComunicacion: this.actividadActual.idMedioComunicacion,
      estado:              this.actividadActual.estado,
      ...(this.isNewActividad ? {} : { id: this.actividadActual.id }),
    };

    const endpoint = this.isNewActividad
      ? constApiMarketing.SeleccionEsquemasActividadesInsertar
      : constApiMarketing.SeleccionEsquemasActividadesActualizar;

    this.integraService.postJsonResponse(endpoint, payload).subscribe({
      next: () => {
        this.modalRefActividad.close();
        this.obtenerActividadesBotIA();
        this.mostrarMensajeExitoso();
      },
      error: () => {
        this.alertaService.notificationError('Error al guardar la actividad');
      }
    });
  }

  eliminarActividad(id: number): void {
    Swal.fire({
      title: '¿Está seguro de eliminar la actividad?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((r) => {
      if (!r.isConfirmed) return;
      this.integraService.postJsonResponse(constApiMarketing.SeleccionEsquemasActividadesEliminar, { id }).subscribe({
        next: () => {
          this.obtenerActividadesBotIA();
          Swal.fire('¡Eliminado!', 'La actividad ha sido eliminada.', 'success');
        },
        error: () => {
          this.alertaService.notificationError('Error al eliminar la actividad');
        }
      });
    });
  }

  // =============================================
  // TAB 3 — Configuración BOT IA
  // =============================================

  obtenerConfiguracionBotIA(): void {
    this.loaderGridConfiguracion = true;
    this.integraService
      .getJsonResponse(constApiMarketing.SeleccionEsquemasObtenerListado)
      .subscribe({
        next: (resp: HttpResponse<EsquemaListadoBackendDTO[]>) => {
          this.listaConfiguracionBotIA = (resp.body ?? []).map(dto => {
            const clasificacionesVistas: string[] = [];
            return {
              id:             dto.idChatbotEsquema,
              nombre:  dto.nombre,
              restricciones:  dto.restricciones ?? '',
              totalLecturas:  dto.totalLecturas,
              totalInterpretaciones: dto.totalInterpretaciones,
              lecturasMensajes: (dto.lecturasMensajes ?? []).map(l => ({
                clasificacion:   l.clasificacion,
                promptLectura:   l.promptLectura,
                mensajesExactos: l.mensajesExactos ?? [],
              })),
              interpretarInformacion: (dto.interpretarInformacion ?? []).map((ii, idx) => ({
                id:              idx + 1,
                nombre:          ii.nombre,
                clasificaciones: ii.clasificaciones ?? [],
                subcategorias:   (ii.subcategorias ?? []).map(sub => ({
                  nombre:           sub.nombre,
                  fasMaximaValores: sub.fasMaximaValores ?? [],
                  perfilValores:    sub.perfilValores ?? [],
                })),
              })),
              esquemasRespuesta: (dto.esquemasRespuesta ?? []).map(r => {
                const mostrar = !clasificacionesVistas.includes(r.clasificacion);
                if (mostrar) clasificacionesVistas.push(r.clasificacion);
                return {
                  clasificacion:       r.clasificacion,
                  mostrarClasificacion: mostrar,
                  subcategoria:        r.subcategoria ?? '',
                  parametrosRespuesta: r.parametrosRespuesta ?? '',
                };
              }),
            } as EsquemaConfiguracion;
          });
          this.loaderGridConfiguracion = false;
        },
        error: () => { this.loaderGridConfiguracion = false; }
      });
  }

  gridEventsConfiguracion(evento: string, isNew: boolean, dataItem: any, rowIndex: any): void {
    switch (evento) {
      case 'add':
        this.isNewConfiguracion = true;
        this.configuracionActual = this.nuevaConfiguracion();
        this.modalRefConfiguracion = this.modalService.open(this.modalConfiguracionBotIA, { size: 'lg', scrollable: true });
        break;
      case 'edit':
        this.isNewConfiguracion = false;
        this.configuracionActual = JSON.parse(JSON.stringify(dataItem));
        this.interpretarInformacionContador = this.configuracionActual.interpretarInformacion.length;
        this.modalRefConfiguracion = this.modalService.open(this.modalConfiguracionBotIA, { size: 'lg', scrollable: true });
        break;
      case 'remove':
        this.eliminarConfiguracion(dataItem.id);
        break;
      case 'reload':
        this.obtenerConfiguracionBotIA();
        break;
    }
  }

  guardarConfiguracion(): void {
    const errorValidacion = this.validarConfiguracion();
    if (errorValidacion) {
      this.alertaService.notificationWarning(errorValidacion);
      return;
    }
    this.loaderModalConfiguracion = true;

    // Detectar mensajes exactos nuevos (no existen en la lista del backend)
    const nuevosMensajes: string[] = [];
    this.configuracionActual.lecturasMensajes.forEach(lectura => {
      lectura.mensajesExactos.forEach(msg => {
        if (!this.listaMensajesExactos.includes(msg) && !nuevosMensajes.includes(msg)) {
          nuevosMensajes.push(msg);
        }
      });
    });

    // Payload limpio con la estructura que espera el backend
    const lecturas = this.configuracionActual.lecturasMensajes.map(l => ({
      clasificacion:   l.clasificacion,
      promptLectura:   l.promptLectura,
      mensajesExactos: l.mensajesExactos,
    }));

    const interpretarInformacion = this.configuracionActual.interpretarInformacion.map(info => ({
      nombre:          info.nombre,
      clasificaciones: info.clasificaciones,
      subcategorias:   info.subcategorias.map(sub => ({
        nombre:           sub.nombre,
        fasMaximaValores: sub.fasMaximaValores,
        perfilValores:    sub.perfilValores,
      })),
    }));

    const esquemasRespuesta = this.configuracionActual.esquemasRespuesta.map(r => ({
      clasificacion:       r.clasificacion,
      subcategoria:        r.subcategoria,
      parametrosRespuesta: r.parametrosRespuesta,
    }));

    const basePayload = {
      nombre:         this.configuracionActual.nombre,
      restricciones:         this.configuracionActual.restricciones,
      nuevosMensajesExactos: nuevosMensajes,
      lecturasMensajes:      lecturas,
      interpretarInformacion,
      esquemasRespuesta,
    };

    const payload = this.isNewConfiguracion
      ? basePayload
      : { ...basePayload, idChatbotEsquema: this.configuracionActual.id };

    const endpoint = this.isNewConfiguracion
      ? constApiMarketing.SeleccionEsquemasInsertar
      : constApiMarketing.SeleccionEsquemasActualizar;

    this.integraService.postJsonResponse(endpoint, payload).subscribe({
      next: () => {
        if (nuevosMensajes.length > 0) {
          this.listaMensajesExactos = [...this.listaMensajesExactos, ...nuevosMensajes];
        }
        this.loaderModalConfiguracion = false;
        this.modalRefConfiguracion.close();
        this.obtenerConfiguracionBotIA();
        this.mostrarMensajeExitoso();
      },
      error: () => {
        this.loaderModalConfiguracion = false;
        this.alertaService.notificationError('Error al guardar el esquema');
      }
    });
  }

  eliminarConfiguracion(id: number): void {
    Swal.fire({
      title: '¿Está seguro de eliminar el esquema?',
      text: 'Se eliminará el esquema y toda su configuración asociada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((r) => {
      if (!r.isConfirmed) return;
      this.integraService.postJsonResponse(constApiMarketing.SeleccionEsquemasEliminar, id).subscribe({
        next: () => {
          this.obtenerConfiguracionBotIA();
          Swal.fire('¡Eliminado!', 'El esquema ha sido eliminado.', 'success');
        },
        error: () => {
          this.alertaService.notificationError('Error al eliminar el esquema');
        }
      });
    });
  }

  // ─── Sub-modal: Lectura de mensajes ─────────────────

  abrirModalLecturaMensaje(isNew: boolean, index?: number): void {
    this.isNewLectura = isNew;
    if (isNew) {
      this.lecturaMensajeActual = this.nuevaLectura();
      this.lecturaMensajeIndexEdit = null;
    } else {
      this.lecturaMensajeActual = JSON.parse(JSON.stringify(this.configuracionActual.lecturasMensajes[index]));
      this.lecturaMensajeIndexEdit = index;
    }
    this.modalRefLecturaMensaje = this.modalService.open(this.modalLecturaMensaje, { size: 'md' });
  }

  guardarLecturaMensaje(): void {
    if (!this.lecturaMensajeActual.clasificacion?.trim()) {
      this.alertaService.notificationWarning('Ingrese la clasificación del tipo de mensaje');
      return;
    }
    if (this.lecturaMensajeActual.mensajesExactos.length === 0) {
      this.alertaService.notificationWarning('Agregue al menos un mensaje exacto');
      return;
    }
    if (!this.lecturaMensajeActual.promptLectura?.trim()) {
      this.alertaService.notificationWarning('Ingrese el prompt de lectura');
      return;
    }
    // Verificar que la clasificación no esté ya usada en otra lectura (al agregar nueva)
    if (this.isNewLectura) {
      const yaExiste = this.configuracionActual.lecturasMensajes.some(
        l => l.clasificacion.trim().toLowerCase() === this.lecturaMensajeActual.clasificacion.trim().toLowerCase()
      );
      if (yaExiste) {
        this.alertaService.notificationWarning('Ya existe una lectura con esa clasificación en este esquema');
        return;
      }
    }
    if (this.isNewLectura) {
      this.configuracionActual.lecturasMensajes.push({ ...this.lecturaMensajeActual });
    } else {
      this.configuracionActual.lecturasMensajes[this.lecturaMensajeIndexEdit] = { ...this.lecturaMensajeActual };
    }
    this.recalcularEsquemasRespuesta();
    this.modalRefLecturaMensaje.close();
  }

  eliminarLecturaMensaje(index: number): void {
    const clasificacion = this.configuracionActual.lecturasMensajes[index].clasificacion;

    const infoAfectados = this.configuracionActual.interpretarInformacion.filter(
      info => info.clasificaciones.includes(clasificacion)
    );
    const infoQueQuedaranSinClasif = infoAfectados.filter(
      info => info.clasificaciones.length === 1
    );

    let html = `La lectura "<b>${clasificacion}</b>" será eliminada.`;
    if (infoAfectados.length > 0) {
      html += `<br><br>Impacto adicional:`;
      if (infoAfectados.length > infoQueQuedaranSinClasif.length) {
        const parciales = infoAfectados.length - infoQueQuedaranSinClasif.length;
        html += `<br>• <b>${parciales}</b> interpretación(es) perderán esta clasificación pero seguirán activas.`;
      }
      if (infoQueQuedaranSinClasif.length > 0) {
        const nombres = infoQueQuedaranSinClasif.map(i => `"${i.nombre}"`).join(', ');
        html += `<br>• <b>${infoQueQuedaranSinClasif.length}</b> interpretación(es) quedarán sin clasificaciones y serán eliminadas: ${nombres}.`;
      }
      html += `<br><br>Las filas correspondientes del esquema de respuestas también desaparecerán.`;
    }

    Swal.fire({
      title: '¿Eliminar lectura de mensajes?',
      html,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((r) => {
      if (!r.isConfirmed) return;

      // 1. Quitar la clasificación de todos los InterpretarInfo asociados
      this.configuracionActual.interpretarInformacion.forEach(info => {
        info.clasificaciones = info.clasificaciones.filter(c => c !== clasificacion);
      });

      // 2. Eliminar los InterpretarInfo que quedaron sin ninguna clasificación
      this.configuracionActual.interpretarInformacion = this.configuracionActual.interpretarInformacion.filter(
        info => info.clasificaciones.length > 0
      );

      // 3. Eliminar la lectura
      this.configuracionActual.lecturasMensajes.splice(index, 1);

      // 4. Recalcular esquema de respuestas
      this.recalcularEsquemasRespuesta();
    });
  }

  // ─── Sub-modal: Interpretar información ──────────────

  abrirModalInterpretarInformacion(isNew: boolean, index?: number): void {
    this.isNewInterpretarInformacion = isNew;
    if (isNew) {
      this.interpretarInformacionActual = this.nuevoInterpretarInformacion();
      this.interpretarInformacionIndexEdit = null;
    } else {
      this.interpretarInformacionActual = JSON.parse(JSON.stringify(this.configuracionActual.interpretarInformacion[index]));
      this.interpretarInformacionIndexEdit = index;
    }
    this.modalRefInterpretarInformacion = this.modalService.open(this.modalInterpretarInformacion, { size: 'lg', scrollable: true });
  }

  guardarInterpretarInformacion(): void {
    if (!this.interpretarInformacionActual.nombre?.trim()) {
      this.alertaService.notificationWarning('Ingrese el nombre');
      return;
    }
    if (this.interpretarInformacionActual.clasificaciones.length === 0) {
      this.alertaService.notificationWarning('Seleccione al menos una clasificación');
      return;
    }
    // Validar que cada subcategoría tenga al menos 1 fase o 1 perfil
    for (let i = 0; i < this.interpretarInformacionActual.subcategorias.length; i++) {
      const sub = this.interpretarInformacionActual.subcategorias[i];
      if (!sub.nombre?.trim()) {
        this.alertaService.notificationWarning(`Ingrese el nombre de la subcategoría ${i + 1}`);
        return;
      }
      if (sub.fasMaximaValores.length === 0 && sub.perfilValores.length === 0) {
        this.alertaService.notificationWarning(
          `La subcategoría "${sub.nombre || i + 1}" debe tener al menos una Fase Máxima o un Perfil`
        );
        return;
      }
    }
    this.interpretarInformacionContador++;
    const item: InterpretarInformacionItem = {
      ...this.interpretarInformacionActual,
      id: this.isNewInterpretarInformacion ? this.interpretarInformacionContador : this.interpretarInformacionActual.id,
    };
    if (this.isNewInterpretarInformacion) {
      this.configuracionActual.interpretarInformacion.push(item);
    } else {
      this.configuracionActual.interpretarInformacion[this.interpretarInformacionIndexEdit] = item;
    }
    this.recalcularEsquemasRespuesta();
    this.modalRefInterpretarInformacion.close();
  }

  eliminarInterpretarInformacion(index: number): void {
    this.confirmarEliminar(() => {
      this.configuracionActual.interpretarInformacion.splice(index, 1);
      this.recalcularEsquemasRespuesta();
    });
  }

  agregarSubcategoria(): void {
    this.interpretarInformacionActual.subcategorias.push({ nombre: '', fasMaximaValores: [], perfilValores: [] });
  }

  eliminarSubcategoria(i: number): void {
    this.interpretarInformacionActual.subcategorias.splice(i, 1);
  }

  // ─── Esquema de respuestas (auto-calculado) ───────────

  recalcularEsquemasRespuesta(): void {
    const existentes = this.configuracionActual.esquemasRespuesta;
    const nuevos: EsquemaRespuestaItem[] = [];

    this.configuracionActual.lecturasMensajes.forEach(lectura => {
      if (!lectura.clasificacion?.trim()) return;

      // InterpretarInfo que tienen esta clasificación asignada
      const infoConEstaClasif = this.configuracionActual.interpretarInformacion.filter(
        info => info.clasificaciones.includes(lectura.clasificacion)
      );

      // Recopilar subcategorías únicas de esos InterpretarInfo
      const subcats: string[] = [];
      infoConEstaClasif.forEach(info => {
        info.subcategorias.forEach(sub => {
          if (sub.nombre?.trim() && !subcats.includes(sub.nombre.trim())) {
            subcats.push(sub.nombre.trim());
          }
        });
      });

      if (subcats.length === 0) {
        const prev = existentes.find(e => e.clasificacion === lectura.clasificacion && e.subcategoria === '—');
        nuevos.push({ clasificacion: lectura.clasificacion, mostrarClasificacion: true, subcategoria: '—', parametrosRespuesta: prev?.parametrosRespuesta ?? '' });
      } else {
        subcats.forEach((subNombre, idx) => {
          const prev = existentes.find(e => e.clasificacion === lectura.clasificacion && e.subcategoria === subNombre);
          nuevos.push({
            clasificacion: lectura.clasificacion,
            mostrarClasificacion: idx === 0,
            subcategoria: subNombre,
            parametrosRespuesta: prev?.parametrosRespuesta ?? ''
          });
        });
      }
    });

    this.configuracionActual.esquemasRespuesta = nuevos;
  }

  // ─── Utilidades ──────────────────────────────────────

  private validarConfiguracion(): string | null {
    const cfg = this.configuracionActual;

    if (!cfg.nombre?.trim()) {
      return 'Ingrese el nombre del esquema';
    }
    if (cfg.lecturasMensajes.length === 0) {
      return 'Configure al menos una Lectura de mensajes';
    }
    for (let i = 0; i < cfg.lecturasMensajes.length; i++) {
      const l = cfg.lecturasMensajes[i];
      if (!l.clasificacion?.trim()) {
        return `Lectura ${i + 1}: ingrese la clasificación del tipo de mensaje`;
      }
      if (l.mensajesExactos.length === 0) {
        return `Lectura "${l.clasificacion}": agregue al menos un mensaje exacto`;
      }
      if (!l.promptLectura?.trim()) {
        return `Lectura "${l.clasificacion}": ingrese el prompt de lectura`;
      }
    }
    for (let i = 0; i < cfg.interpretarInformacion.length; i++) {
      const info = cfg.interpretarInformacion[i];
      if (!info.nombre?.trim()) {
        return `Interpretación ${i + 1}: ingrese el nombre`;
      }
      if (info.clasificaciones.length === 0) {
        return `Interpretación "${info.nombre}": seleccione al menos una clasificación`;
      }
      for (let si = 0; si < info.subcategorias.length; si++) {
        const sub = info.subcategorias[si];
        if (!sub.nombre?.trim()) {
          return `Interpretación "${info.nombre}" - subcategoría ${si + 1}: ingrese el nombre`;
        }
        if (sub.fasMaximaValores.length === 0 && sub.perfilValores.length === 0) {
          return `Subcategoría "${sub.nombre}": debe tener al menos una Fase Máxima o un Perfil`;
        }
      }
    }
    return null;
  }

  private confirmarEliminar(accion: () => void): void {
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, elimínalo!',
      cancelButtonText: 'Cancelar',
    }).then((r) => {
      if (r.isConfirmed) {
        accion();
        Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
      }
    });
  }

  private nuevaActividad(): ActividadBotIA {
    return { id: 0, nombre: '', numeros: [], idChatbotEsquema: null, nombreEsquema: '', idMedioComunicacion: null, nombreMedioComunicacion: '', estado: true };
  }

  private nuevaConfiguracion(): EsquemaConfiguracion {
    return { id: 0, nombre: '', lecturasMensajes: [], interpretarInformacion: [], esquemasRespuesta: [], restricciones: '' };
  }

  private nuevaLectura(): LecturaMensajeItem {
    return { clasificacion: '', mensajesExactos: [], promptLectura: '' };
  }

  private nuevoInterpretarInformacion(): InterpretarInformacionItem {
    return { id: 0, nombre: '', clasificaciones: [], subcategorias: [] };
  }

  mostrarMensajeExitoso(): void {
    const Toast = Swal.mixin({
      toast: true, target: '#content-drawer-component',
      customClass: { container: 'position-absolute' },
      position: 'top-right', showConfirmButton: false, timer: 1600, timerProgressBar: false,
      didOpen: (t) => { t.addEventListener('mouseenter', Swal.stopTimer); t.addEventListener('mouseleave', Swal.resumeTimer); },
    });
    Toast.fire({ icon: 'success', title: 'Guardado con éxito' });
  }
}
