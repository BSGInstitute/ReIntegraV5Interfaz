/**
 * @module MarketingModule
 * @description CRUD manual de testimonios de LinkedIn y configuración de la cuenta única para BSG Institute.
 * @author Max Mantilla
 * @version 1.0.0
 * @history
 * * 21/04/2026 Implementación inicial
*/

import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { MessageService } from '@progress/kendo-angular-l10n';
import { constApiMarketing } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import {
  ILinkedinResena,
  IPaisLinkedinCombo,
  ICiudadLinkedinCombo,
  ILinkedinResenaFiltro,
  IMarcarVisibilidadLinkedinRequest,
  ILinkedinConfiguracion,
} from '@marketing/models/interfaces/resena-linkedin';
import { KendoGridMessagesEs } from '@shared/services/kendo-grid-messages-es.service';
import Swal from 'sweetalert2';

const TAMANO_PAGINA_TODOS = 10000;
const TAMANO_PAGINA_DEFECTO = 20;
const COLOR_CONFIRMAR = '#094D82';

@Component({
  selector: 'app-resena-linkedin',
  templateUrl: './resena-linkedin.component.html',
  styleUrls: ['./resena-linkedin.component.scss'],
  providers: [{ provide: MessageService, useClass: KendoGridMessagesEs }],
})
export class ResenaLinkedinComponent implements OnInit {

  @ViewChild('grid', { static: false }) grid: any;

  testimonios: ILinkedinResena[] = [];
  paisesCombo: IPaisLinkedinCombo[] = [];
  ciudadesCombo: ICiudadLinkedinCombo[] = [];

  kpiTotal = 0;
  kpiVisibles = 0;
  kpiPaises = 0;

  private kpisCargados = false;
  private idConfiguracion = 0;

  seleccionados = new Set<number>();
  get todosSeleccionados(): boolean {
    return this.testimonios.length > 0 && this.seleccionados.size === this.testimonios.length;
  }
  get haySeleccionParcial(): boolean {
    return this.seleccionados.size > 0 && !this.todosSeleccionados;
  }

  filtro: ILinkedinResenaFiltro = {
    esVisible:    null,
    idsPais:      [],
    fechaInicio:  null,
    fechaFin:     null,
    pagina:       1,
    tamanoPagina: TAMANO_PAGINA_TODOS,
  };

  filtroVisibilidad: boolean | null = null;
  filtroPaises: number[] = [];
  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;

  metricasVisibles = true;
  filtrosAbiertos = true;
  pagerConfig: any = { buttonCount: 5, pageSizes: [20, 50, 'All'] };
  cargandoGrilla = true;
  procesandoMostrar = false;
  procesandoOcultar = false;

  private get usuarioActual(): string {
    try { return JSON.parse(localStorage.getItem('userData') || '{}')?.userName ?? ''; }
    catch { return ''; }
  }
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
  ) {}

  ngOnInit(): void {
    this.cargarPaisesCombo();
    this.cargarIdConfiguracion();
    this.consultarTestimonios();
  }

  /** Recalcula KPIs globales desde el backend (sin filtros). Se invoca tras operaciones CRUD. */
  cargarKPIs(): void {
    const filtroVacio: ILinkedinResenaFiltro = {
      esVisible: null, idsPais: [], fechaInicio: null, fechaFin: null, pagina: 1, tamanoPagina: 10000,
    };
    this.integraService.postJsonResponse(constApiMarketing.LinkedinResenaObtenerGrilla, filtroVacio)
      .subscribe({
        next: (r: HttpResponse<any>) => {
          const body = r.body;
          this._calcularKPIs(Array.isArray(body) ? body : (body?.data ?? []));
        },
        error: () => {},
      });
  }

  /** Calcula los totales (total, visibles, países) a partir del listado recibido. */
  private _calcularKPIs(datos: ILinkedinResena[]): void {
    this.kpiTotal    = datos.length;
    this.kpiVisibles = datos.filter(t => t.mostrar).length;
    this.kpiPaises   = new Set(datos.map(t => t.nombrePais).filter(Boolean)).size;
  }

  /** Carga los países disponibles para el multiselect del filtro. */
  cargarPaisesCombo(): void {
    this.integraService.getJsonResponse(constApiMarketing.LinkedinResenaObtenerPaisesCombo)
      .subscribe({ next: (r: HttpResponse<any>) => { this.paisesCombo = r.body ?? []; }, error: () => {} });
  }

  /** Obtiene el Id de la única configuración LinkedIn para usarlo como FK en los testimonios. */
  cargarIdConfiguracion(): void {
    this.integraService.getJsonResponse(constApiMarketing.LinkedinConfiguracionObtener)
      .subscribe({
        next: (r: HttpResponse<any>) => { this.idConfiguracion = r.body?.id ?? 0; },
        error: () => {},
      });
  }

  /** Sincroniza los filtros de la UI con el DTO y consulta la grilla. */
  buscar(): void {
    this.filtro.esVisible   = this.filtroVisibilidad;
    this.filtro.idsPais     = this.filtroPaises;
    this.filtro.fechaInicio = this.fechaDesde ? this._formatearFechaLocal(this.fechaDesde) : null;
    this.filtro.fechaFin    = this.fechaHasta ? this._formatearFechaLocal(this.fechaHasta, true) : null;
    this.consultarTestimonios();
  }

  /** Ejecuta el POST a ObtenerGrilla y refresca la grilla de testimonios. */
  private consultarTestimonios(): void {
    this.cargandoGrilla = true;
    this.seleccionados.clear();
    this.integraService.postJsonResponse(constApiMarketing.LinkedinResenaObtenerGrilla, this.filtro)
      .subscribe({
        next: (r: HttpResponse<any>) => {
          const body = r.body;
          this.testimonios = Array.isArray(body) ? body : (body?.data ?? []);
          if (!this.kpisCargados) {
            this._calcularKPIs(this.testimonios);
            this.kpisCargados = true;
          }
          this.cargandoGrilla = false;
          this._resetearEstadoGrilla();
        },
        error: () => { this.alertaService.notificationError('Error al obtener los testimonios.'); this.cargandoGrilla = false; },
      });
  }

  /** Atajo de fecha: desde el día 1 del mes actual hasta hoy. */
  seleccionarEsteMes(): void {
    const h = new Date();
    this.fechaDesde = new Date(h.getFullYear(), h.getMonth(), 1);
    this.fechaHasta = new Date(h.getFullYear(), h.getMonth(), h.getDate());
  }
  /** Atajo de fecha: desde el 1 de enero del año actual hasta hoy. */
  seleccionarEsteAnio(): void {
    const h = new Date();
    this.fechaDesde = new Date(h.getFullYear(), 0, 1);
    this.fechaHasta = new Date(h.getFullYear(), h.getMonth(), h.getDate());
  }
  /** Atajo de fecha: año anterior completo (1 ene – 31 dic). */
  seleccionarAnioAnterior(): void {
    const a = new Date().getFullYear() - 1;
    this.fechaDesde = new Date(a, 0, 1);
    this.fechaHasta = new Date(a, 11, 31);
  }
  /** Reinicia todos los filtros y recarga la grilla. */
  limpiarFiltros(): void {
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.filtroVisibilidad = null;
    this.filtroPaises = [];
    this.buscar();
  }

  /** Marca o desmarca todos los testimonios visibles en la grilla. */
  alternarSeleccionTodos(s: boolean): void {
    s ? this.testimonios.forEach(t => this.seleccionados.add(t.idLinkedinResena)) : this.seleccionados.clear();
  }
  /** Alterna la selección de un testimonio individual por Id. */
  alternarSeleccionTestimonio(id: number, s: boolean): void { s ? this.seleccionados.add(id) : this.seleccionados.delete(id); }
  /** Indica si el Id está en el conjunto de seleccionados. */
  estaSeleccionado(id: number): boolean { return this.seleccionados.has(id); }

  /** Publica en el sitio web los testimonios seleccionados, previa confirmación. */
  marcarComoVisibles(): void {
    if (!this._validarSeleccion()) return;
    const n = this.seleccionados.size;
    Swal.fire({ title: '¿Marcar como visibles?', html: `<b>${n}</b> testimonio(s) serán visibles.`, icon: 'question', showCancelButton: true, confirmButtonText: 'Sí, mostrar', confirmButtonColor: '#17b76a' })
      .then(r => { if (!r.isConfirmed) return; this._ejecutarVisibilidad(constApiMarketing.LinkedinResenaMarcarResenaVisible, n, 'visibles'); });
  }

  /** Oculta del sitio web los testimonios seleccionados, previa confirmación. */
  marcarComoOcultas(): void {
    if (!this._validarSeleccion()) return;
    const n = this.seleccionados.size;
    Swal.fire({ title: '¿Ocultar testimonios?', html: `<b>${n}</b> testimonio(s) serán ocultados.`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, ocultar', confirmButtonColor: '#e8923a' })
      .then(r => { if (!r.isConfirmed) return; this._ejecutarVisibilidad(constApiMarketing.LinkedinResenaMarcarResenaOculta, n, 'ocultados'); });
  }

  /** Alterna la visibilidad de un testimonio desde la propia fila de la grilla. */
  alternarVisibilidadIndividual(t: ILinkedinResena): void {
    const endpoint = t.mostrar ? constApiMarketing.LinkedinResenaMarcarResenaOculta : constApiMarketing.LinkedinResenaMarcarResenaVisible;
    const payload: IMarcarVisibilidadLinkedinRequest = { idsLinkedinResena: [t.idLinkedinResena], usuario: this.usuarioActual };
    this.integraService.postJsonResponse(endpoint, payload).subscribe({
      complete: () => { this.alertaService.notificationSuccess(t.mostrar ? 'Testimonio ocultado.' : 'Testimonio visible.'); this._refrescarDatos(); },
      error: () => this.alertaService.notificationError('Error al cambiar visibilidad.'),
    });
  }

  /** Ejecuta la acción de visibilidad (mostrar/ocultar) sobre la selección actual. */
  private _ejecutarVisibilidad(endpoint: string, n: number, accion: string): void {
    const payload = this._crearPayloadVisibilidad();
    this.integraService.postJsonResponse(endpoint, payload).subscribe({
      complete: () => { Swal.fire({ icon: 'success', title: `${n} testimonio(s) ${accion}.`, confirmButtonColor: COLOR_CONFIRMAR }); this._refrescarDatos(); },
      error: () => this.alertaService.notificationError('Error en la operación.'),
    });
  }

  /** Abre el modal de creación de un testimonio LinkedIn. */
  nuevoTestimonio(): void {
    this.ciudadesCombo = [];
    Swal.fire({
      title: 'Nuevo Testimonio',
      html: this._construirHtmlFormulario(),
      width: 660,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: COLOR_CONFIRMAR,
      customClass: { popup: 'linkedin-modal', htmlContainer: 'linkedin-modal__cuerpo' },
      showCloseButton: true,
      allowOutsideClick: false,
      didOpen: () => this._enlazarCambioPais(),
      preConfirm: () => this._extraerDatosFormulario(),
    }).then(result => {
      if (!result.isConfirmed || !result.value) return;
      const payload = { ...result.value, idLinkedinConfiguracion: this.idConfiguracion, usuarioCreacion: this.usuarioActual, mostrar: false };
      this.integraService.postJsonResponse(constApiMarketing.LinkedinResenaInsertar, payload).subscribe({
        next: () => { Swal.fire({ icon: 'success', title: 'Testimonio creado', confirmButtonColor: COLOR_CONFIRMAR }); this._refrescarDatos(); },
        error: () => this.alertaService.notificationError('Error al crear.'),
      });
    });
  }

  /** Carga las ciudades del país del testimonio antes de abrir el modal de edición. */
  editarTestimonio(t: ILinkedinResena): void {
    this.ciudadesCombo = [];
    const abrirModal = () => {
      Swal.fire({
        title: 'Editar Testimonio',
        html: this._construirHtmlFormulario(t),
        width: 660,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: COLOR_CONFIRMAR,
        customClass: { popup: 'linkedin-modal', htmlContainer: 'linkedin-modal__cuerpo' },
        showCloseButton: true,
        allowOutsideClick: false,
        didOpen: () => this._enlazarCambioPais(),
        preConfirm: () => this._extraerDatosFormulario(),
      }).then(result => {
        if (!result.isConfirmed || !result.value) return;
        const payload = { ...result.value, id: t.idLinkedinResena, idLinkedinConfiguracion: this.idConfiguracion, usuarioModificacion: this.usuarioActual };
        this.integraService.putJsonResponse(constApiMarketing.LinkedinResenaActualizar, payload).subscribe({
          next: () => { Swal.fire({ icon: 'success', title: 'Testimonio actualizado', confirmButtonColor: COLOR_CONFIRMAR }); this._refrescarDatos(); },
          error: () => this.alertaService.notificationError('Error al actualizar.'),
        });
      });
    };

    if (t.idPais) {
      this.integraService.getJsonResponse(constApiMarketing.LinkedinResenaObtenerCiudadesCombo + '/' + t.idPais)
        .subscribe({
          next: (r: HttpResponse<any>) => { this.ciudadesCombo = r.body ?? []; abrirModal(); },
          error: () => abrirModal(),
        });
    } else {
      abrirModal();
    }
  }

  /** Elimina lógicamente un testimonio individual, previa confirmación. */
  eliminarTestimonio(t: ILinkedinResena): void {
    Swal.fire({
      title: '¿Eliminar testimonio?',
      html: `Se eliminará el testimonio de <b>${t.nombreAutor}</b>.`,
      icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Sí, eliminar', confirmButtonColor: '#ef4444',
    }).then(r => {
      if (!r.isConfirmed) return;
      this.integraService.deleteJsonResponse(constApiMarketing.LinkedinResenaEliminar + '/' + t.idLinkedinResena)
        .subscribe({
          next: () => { Swal.fire({ icon: 'success', title: 'Eliminado', confirmButtonColor: COLOR_CONFIRMAR }); this._refrescarDatos(); },
          error: () => this.alertaService.notificationError('Error al eliminar.'),
        });
    });
  }

  /** Elimina lógicamente en bloque los testimonios seleccionados, previa confirmación. */
  eliminarSeleccionados(): void {
    if (!this._validarSeleccion()) return;
    const n = this.seleccionados.size;
    Swal.fire({
      title: '¿Eliminar testimonios?',
      html: `Se eliminarán <b>${n}</b> testimonio(s) permanentemente.`,
      icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Sí, eliminar todos', confirmButtonColor: '#ef4444',
    }).then(r => {
      if (!r.isConfirmed) return;
      this.integraService.deleteJsonResponse(constApiMarketing.LinkedinResenaEliminarListado, Array.from(this.seleccionados))
        .subscribe({
          next: () => { Swal.fire({ icon: 'success', title: `${n} eliminados`, confirmButtonColor: COLOR_CONFIRMAR }); this._refrescarDatos(); },
          error: () => this.alertaService.notificationError('Error al eliminar.'),
        });
    });
  }

  /** Verifica que haya al menos un registro seleccionado; muestra un error si no. */
  private _validarSeleccion(): boolean {
    if (this.seleccionados.size === 0) { this.alertaService.notificationError('Seleccione al menos un testimonio.'); return false; }
    return true;
  }

  /** Construye el payload con los Ids seleccionados y el usuario que ejecuta la acción. */
  private _crearPayloadVisibilidad(): IMarcarVisibilidadLinkedinRequest {
    return { idsLinkedinResena: Array.from(this.seleccionados), usuario: this.usuarioActual };
  }

  /** Formatea una fecha a string local sin conversión UTC, evitando desfases de zona horaria. */
  private _formatearFechaLocal(fecha: Date, finDeDia = false): string {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return finDeDia ? `${y}-${m}-${d}T23:59:59` : `${y}-${m}-${d}T00:00:00`;
  }

  /** Reinicia paginación, filtros de cabecera y orden de la grilla Kendo. */
  private _resetearEstadoGrilla(): void {
    if (!this.grid) return;
    this.grid.skip = 0;
    this.grid.pageSize = TAMANO_PAGINA_DEFECTO;
    this.grid.filter = { filters: [], logic: 'and' };
    this.grid.sort = [];
  }

  /** Recarga los KPIs y vuelve a consultar la grilla tras una operación CRUD. */
  private _refrescarDatos(): void {
    this.cargarKPIs();
    this.buscar();
  }

  /** Genera el HTML del formulario SweetAlert2 para crear o editar un registro. */
  private _construirHtmlFormulario(t?: ILinkedinResena): string {
    const esc = (v?: string) => (v || '').replace(/"/g, '&quot;');
    const escTxt = (v?: string) => (v || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const paisOpts = this.paisesCombo
      .map(p => `<option value="${p.idPais}" ${t?.idPais === p.idPais ? 'selected' : ''}>${p.nombrePais}</option>`)
      .join('');

    const ciudadOpts = this.ciudadesCombo
      .map(c => `<option value="${c.idCiudad}" ${t?.idCiudad === c.idCiudad ? 'selected' : ''}>${c.nombreCiudad}</option>`)
      .join('');

    return `
    <div class="linkedin-formulario">
      <div class="linkedin-formulario__fila">
        <div class="linkedin-formulario__campo">
          <label class="linkedin-formulario__etiqueta">Nombre completo *</label>
          <input id="swal-nombre" class="linkedin-formulario__input" value="${esc(t?.nombreAutor)}" placeholder="Nombre y apellido">
        </div>
        <div class="linkedin-formulario__campo">
          <label class="linkedin-formulario__etiqueta">Cargo</label>
          <input id="swal-cargo" class="linkedin-formulario__input" value="${esc(t?.cargo)}" placeholder="Ej: Project Manager">
        </div>
      </div>
      <div class="linkedin-formulario__fila">
        <div class="linkedin-formulario__campo">
          <label class="linkedin-formulario__etiqueta">Empresa</label>
          <input id="swal-empresa" class="linkedin-formulario__input" value="${esc(t?.empresa)}" placeholder="Nombre de la empresa">
        </div>
        <div class="linkedin-formulario__campo">
          <label class="linkedin-formulario__etiqueta">Certificación</label>
          <input id="swal-cert" class="linkedin-formulario__input" value="${esc(t?.certificacion)}" placeholder="Ej: PMP, BIM Manager">
        </div>
      </div>
      <div class="linkedin-formulario__fila">
        <div class="linkedin-formulario__campo">
          <label class="linkedin-formulario__etiqueta">País</label>
          <select id="swal-pais" class="linkedin-formulario__select">
            <option value="">— Seleccionar país —</option>
            ${paisOpts}
          </select>
        </div>
        <div class="linkedin-formulario__campo">
          <label class="linkedin-formulario__etiqueta">Ciudad</label>
          <select id="swal-ciudad" class="linkedin-formulario__select" ${!t?.idPais ? 'disabled' : ''}>
            <option value="">— Seleccionar ciudad —</option>
            ${ciudadOpts}
          </select>
        </div>
      </div>
      <div class="linkedin-formulario__fila">
        <div class="linkedin-formulario__campo">
          <label class="linkedin-formulario__etiqueta">URL publicación LinkedIn</label>
          <input id="swal-url" class="linkedin-formulario__input" value="${esc(t?.urlPublicacion)}" placeholder="https://linkedin.com/...">
        </div>
        <div class="linkedin-formulario__campo">
          <label class="linkedin-formulario__etiqueta">Fecha</label>
          <input id="swal-fecha" type="date" class="linkedin-formulario__input" value="${t?.fechaResena ? new Date(t.fechaResena).toISOString().split('T')[0] : ''}">
        </div>
      </div>
      <div class="linkedin-formulario__campo">
        <label class="linkedin-formulario__etiqueta">URL foto de perfil</label>
        <input id="swal-foto" class="linkedin-formulario__input" value="${esc(t?.fotoAutor)}" placeholder="https://...">
      </div>
      <div class="linkedin-formulario__campo">
        <label class="linkedin-formulario__etiqueta">Testimonio *</label>
        <textarea id="swal-texto" class="linkedin-formulario__textarea" placeholder="Texto del testimonio...">${escTxt(t?.textoResena)}</textarea>
      </div>
    </div>`;
  }

  /** Carga dinámicamente el combo de ciudades cada vez que cambia el país seleccionado. */
  private _enlazarCambioPais(): void {
    const paisEl = document.getElementById('swal-pais') as HTMLSelectElement;
    const ciudadEl = document.getElementById('swal-ciudad') as HTMLSelectElement;
    if (!paisEl || !ciudadEl) return;

    paisEl.addEventListener('change', () => {
      const idPais = parseInt(paisEl.value, 10);
      ciudadEl.innerHTML = '<option value="">Cargando...</option>';
      ciudadEl.disabled = true;

      if (!idPais) {
        ciudadEl.innerHTML = '<option value="">— Seleccionar ciudad —</option>';
        return;
      }

      this.integraService.getJsonResponse(constApiMarketing.LinkedinResenaObtenerCiudadesCombo + '/' + idPais)
        .subscribe({
          next: (r: HttpResponse<any>) => {
            const ciudades: ICiudadLinkedinCombo[] = r.body ?? [];
            ciudadEl.innerHTML = '<option value="">— Seleccionar ciudad —</option>'
              + ciudades.map(c => `<option value="${c.idCiudad}">${c.nombreCiudad}</option>`).join('');
            ciudadEl.disabled = false;
          },
          error: () => { ciudadEl.innerHTML = '<option value="">— Sin ciudades —</option>'; ciudadEl.disabled = true; },
        });
    });
  }

  /** Extrae y valida los datos del formulario; devuelve false si la validación falla. */
  private _extraerDatosFormulario(): any {
    const val    = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value?.trim() ?? '';
    const selVal = (id: string) => (document.getElementById(id) as HTMLSelectElement)?.value ?? '';

    const nombre = val('swal-nombre');
    const texto  = val('swal-texto');
    if (!nombre) { Swal.showValidationMessage('El nombre es obligatorio.'); return false; }
    if (!texto)  { Swal.showValidationMessage('El testimonio es obligatorio.'); return false; }

    const idPais   = parseInt(selVal('swal-pais'),   10) || null;
    const idCiudad = parseInt(selVal('swal-ciudad'), 10) || null;
    const fecha = val('swal-fecha');
    return {
      nombreAutor:     nombre,
      cargo:           val('swal-cargo'),
      empresa:         val('swal-empresa'),
      certificacion:   val('swal-cert'),
      idPais,
      idCiudad,
      urlPublicacion:  val('swal-url'),
      fotoAutor:       val('swal-foto'),
      textoResena:     texto,
      fechaResena:     fecha ? new Date(fecha).toISOString() : null,
    };
  }

  // Configuración de cuenta LinkedIn (única — LinkedinConfiguracion)

  /** Abre el modal para crear o editar la configuración única de LinkedIn. */
  abrirConfiguracion(): void {
    this.integraService.getJsonResponse(constApiMarketing.LinkedinConfiguracionObtener)
      .subscribe({
        next: (r: HttpResponse<any>) => { this._mostrarModalConfig(r.body ?? null); },
        error: () => { this._mostrarModalConfig(null); },
      });
  }

  /** Abre el submodal de creación o edición de la configuración. */
  private _mostrarModalConfig(existente: ILinkedinConfiguracion | null): void {
    const esActualizacion = !!(existente && existente.id);
    Swal.fire({
      title: esActualizacion ? 'Editar configuración — LinkedIn' : 'Nueva configuración — LinkedIn',
      html: this._construirHtmlConfiguracion(existente),
      width: 640,
      showCancelButton: true,
      confirmButtonText: esActualizacion ? 'Actualizar' : 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: COLOR_CONFIRMAR,
      customClass: { popup: 'linkedin-modal', htmlContainer: 'linkedin-modal__cuerpo' },
      showCloseButton: true,
      allowOutsideClick: false,
      preConfirm: () => this._extraerDatosConfiguracion(existente),
    }).then(result => {
      if (!result.isConfirmed || !result.value) return;
      const payload: ILinkedinConfiguracion = result.value;
      const peticion = esActualizacion
        ? this.integraService.putJsonResponse(constApiMarketing.LinkedinConfiguracionActualizar, payload)
        : this.integraService.postJsonResponse(constApiMarketing.LinkedinConfiguracionInsertar, payload);

      peticion.subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: esActualizacion ? 'Configuración actualizada' : 'Configuración creada',
            confirmButtonColor: COLOR_CONFIRMAR,
          });
          this.cargarIdConfiguracion();
        },
        error: () => this.alertaService.notificationError('Error al guardar la configuración.'),
      });
    });
  }

  /** Genera el HTML del formulario SweetAlert2 para la configuración de la cuenta. */
  private _construirHtmlConfiguracion(c: ILinkedinConfiguracion | null): string {
    const esc = (v?: string) => (v || '').replace(/"/g, '&quot;');
    return `
    <div class="linkedin-formulario">
      <div class="linkedin-formulario__campo">
        <label class="linkedin-formulario__etiqueta">Nombre de la página *</label>
        <input id="cfg-nombre" class="linkedin-formulario__input" value="${esc(c?.nombre)}" placeholder="Ej: BSG Institute">
      </div>
      <div class="linkedin-formulario__campo">
        <label class="linkedin-formulario__etiqueta">Enlace de la página *</label>
        <input id="cfg-enlace" class="linkedin-formulario__input" value="${esc(c?.enlacePagina)}" placeholder="https://www.linkedin.com/company/bsg-institute">
      </div>
      <div class="linkedin-formulario__campo">
        <label class="linkedin-formulario__etiqueta">Total opiniones</label>
        <input id="cfg-total" type="number" min="0" class="linkedin-formulario__input" value="${c?.resenaTotal ?? 0}" placeholder="Ej: 320">
      </div>
    </div>`;
  }

  /** Extrae y valida los datos de la configuración; devuelve false si la validación falla. */
  private _extraerDatosConfiguracion(existente: ILinkedinConfiguracion | null): ILinkedinConfiguracion | false {
    const val = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value?.trim() || '';
    const nombre = val('cfg-nombre');
    const enlace = val('cfg-enlace');
    if (!nombre) { Swal.showValidationMessage('El nombre de la página es obligatorio.'); return false; }
    if (!enlace) { Swal.showValidationMessage('El enlace de la página es obligatorio.'); return false; }

    return {
      ...(existente?.id ? { id: existente.id } : {}),
      nombre,
      enlacePagina: enlace,
      resenaTotal: parseInt(val('cfg-total'), 10) || 0,
    };
  }
}
