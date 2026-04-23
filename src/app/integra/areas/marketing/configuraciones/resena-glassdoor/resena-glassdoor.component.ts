/**
 * @module MarketingModule
 * @description CRUD manual de reseñas de Glassdoor y configuración de la cuenta única para BSG Institute.
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
  IGlassdoorResena,
  IPaisGlassdoorCombo,
  ICiudadGlassdoorCombo,
  IGlassdoorResenaFiltro,
  IGlassdoorConfiguracion,
} from '@marketing/models/interfaces/resena-glassdoor';
import { KendoGridMessagesEs } from '@shared/services/kendo-grid-messages-es.service';
import Swal from 'sweetalert2';

const TAMANO_PAGINA_TODOS = 10000;
const TAMANO_PAGINA_DEFECTO = 20;
const COLOR_CONFIRMAR = '#094D82';

@Component({
  selector: 'app-resena-glassdoor',
  templateUrl: './resena-glassdoor.component.html',
  styleUrls: ['./resena-glassdoor.component.scss'],
  providers: [{ provide: MessageService, useClass: KendoGridMessagesEs }],
})
export class ResenaGlassdoorComponent implements OnInit {

  @ViewChild('grid', { static: false }) grid: any;

  resenas: IGlassdoorResena[] = [];
  paisesCombo: IPaisGlassdoorCombo[] = [];
  ciudadesCombo: ICiudadGlassdoorCombo[] = [];

  // KPIs globales (no cambian con filtros)
  kpiTotal = 0;
  kpiVisibles = 0;
  kpiPaises = 0;

  private kpisCargados = false;
  private idConfiguracion = 0;

  seleccionados = new Set<number>();
  get todosSeleccionados(): boolean {
    return this.resenas.length > 0 && this.seleccionados.size === this.resenas.length;
  }
  get haySeleccionParcial(): boolean {
    return this.seleccionados.size > 0 && !this.todosSeleccionados;
  }

  filtro: IGlassdoorResenaFiltro = {
    mostrar:      null,
    idPaisLista:  [],
    tipoEmpleado: '',
    fechaInicio:  null,
    fechaFin:     null,
    pagina:       1,
    tamanoPagina: TAMANO_PAGINA_TODOS,
  };

  filtroVisibilidad: boolean | null = null;
  filtroPaises: number[] = [];
  filtroTipoEmpleado: string | null = null;
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
    this.consultarResenas();
  }

  /** Recalcula KPIs globales desde el backend (sin filtros) — solo tras operaciones CRUD */
  cargarKPIs(): void {
    const filtroVacio: IGlassdoorResenaFiltro = {
      mostrar: null, idPaisLista: [], tipoEmpleado: '', fechaInicio: null, fechaFin: null, pagina: 1, tamanoPagina: 10000,
    };
    this.integraService.postJsonResponse(constApiMarketing.GlassdoorResenaObtenerGrilla, filtroVacio)
      .subscribe({
        next: (r: HttpResponse<any>) => {
          const body = r.body;
          this._calcularKPIs(Array.isArray(body) ? body : (body?.data ?? []));
        },
        error: () => {},
      });
  }

  /** Calcula los totales (total, visibles, países) a partir del listado recibido. */
  private _calcularKPIs(datos: IGlassdoorResena[]): void {
    this.kpiTotal    = datos.length;
    this.kpiVisibles = datos.filter(t => t.mostrar).length;
    this.kpiPaises   = new Set(datos.map(t => t.nombrePais).filter(Boolean)).size;
  }

  /** Carga los países disponibles para el multiselect del filtro. */
  cargarPaisesCombo(): void {
    this.integraService.getJsonResponse(constApiMarketing.GlassdoorResenaObtenerPaisesCombo)
      .subscribe({ next: (r: HttpResponse<any>) => { this.paisesCombo = r.body ?? []; }, error: () => {} });
  }

  /** Obtiene el Id de la única configuración Glassdoor para usarlo como FK en las reseñas. */
  cargarIdConfiguracion(): void {
    this.integraService.getJsonResponse(constApiMarketing.GlassdoorConfiguracionObtener)
      .subscribe({
        next: (r: HttpResponse<any>) => { this.idConfiguracion = r.body?.id ?? 0; },
        error: () => {},
      });
  }

  /** Sincroniza los filtros de la UI con el DTO y consulta la grilla. */
  buscar(): void {
    this.filtro.mostrar      = this.filtroVisibilidad;
    this.filtro.idPaisLista  = this.filtroPaises;
    this.filtro.tipoEmpleado = this.filtroTipoEmpleado ?? '';
    this.filtro.fechaInicio  = this.fechaDesde ? this._formatearFechaLocal(this.fechaDesde) : null;
    this.filtro.fechaFin     = this.fechaHasta ? this._formatearFechaLocal(this.fechaHasta, true) : null;
    this.consultarResenas();
  }

  /** Ejecuta el POST a ObtenerGrilla y refresca la grilla con la respuesta. */
  private consultarResenas(): void {
    this.cargandoGrilla = true;
    this.seleccionados.clear();
    this.integraService.postJsonResponse(constApiMarketing.GlassdoorResenaObtenerGrilla, this.filtro)
      .subscribe({
        next: (r: HttpResponse<any>) => {
          const body = r.body;
          this.resenas = Array.isArray(body) ? body : (body?.data ?? []);
          if (!this.kpisCargados) {
            this._calcularKPIs(this.resenas);
            this.kpisCargados = true;
          }
          this.cargandoGrilla = false;
          this._resetearEstadoGrilla();
        },
        error: () => { this.alertaService.notificationError('Error al obtener las reseñas.'); this.cargandoGrilla = false; },
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
    this.filtroTipoEmpleado = null;
    this.buscar();
  }

  /** Marca o desmarca todas las reseñas visibles en la grilla. */
  alternarSeleccionTodos(s: boolean): void {
    s ? this.resenas.forEach(t => this.seleccionados.add(t.idGlassdoorResena)) : this.seleccionados.clear();
  }
  /** Alterna la selección de una reseña individual por Id. */
  alternarSeleccionResena(id: number, s: boolean): void { s ? this.seleccionados.add(id) : this.seleccionados.delete(id); }
  /** Indica si el Id está en el conjunto de seleccionados. */
  estaSeleccionado(id: number): boolean { return this.seleccionados.has(id); }

  /** Representa la valoración como cadena de 5 caracteres (★ llenas, ☆ vacías). */
  estrellas(rating: number): string {
    const n = Math.max(0, Math.min(5, Math.round(rating || 0)));
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  /** Publica en el sitio web las reseñas seleccionadas, previa confirmación. */
  marcarComoVisibles(): void {
    if (!this._validarSeleccion()) return;
    const n = this.seleccionados.size;
    Swal.fire({ title: '¿Marcar como visibles?', html: `<b>${n}</b> reseña(s) serán visibles.`, icon: 'question', showCancelButton: true, confirmButtonText: 'Sí, mostrar', confirmButtonColor: '#17b76a' })
      .then(r => { if (!r.isConfirmed) return; this._ejecutarVisibilidad(constApiMarketing.GlassdoorResenaMarcarResenaVisible, n, 'visibles'); });
  }

  /** Oculta del sitio web las reseñas seleccionadas, previa confirmación. */
  marcarComoOcultas(): void {
    if (!this._validarSeleccion()) return;
    const n = this.seleccionados.size;
    Swal.fire({ title: '¿Ocultar reseñas?', html: `<b>${n}</b> reseña(s) serán ocultadas.`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, ocultar', confirmButtonColor: '#e8923a' })
      .then(r => { if (!r.isConfirmed) return; this._ejecutarVisibilidad(constApiMarketing.GlassdoorResenaMarcarResenaOculta, n, 'ocultadas'); });
  }

  /** Ejecuta la acción de visibilidad (mostrar/ocultar) sobre la selección actual. */
  private _ejecutarVisibilidad(endpoint: string, n: number, accion: string): void {
    const payload = { idsGlassdoorResena: Array.from(this.seleccionados) };
    this.integraService.postJsonResponse(endpoint, payload).subscribe({
      complete: () => { Swal.fire({ icon: 'success', title: `${n} reseña(s) ${accion}.`, confirmButtonColor: COLOR_CONFIRMAR }); this._refrescarDatos(); },
      error: () => this.alertaService.notificationError('Error en la operación.'),
    });
  }

  /** Abre el modal de creación de una reseña Glassdoor. */
  nuevaResena(): void {
    this.ciudadesCombo = [];
    Swal.fire({
      title: 'Nueva Reseña',
      html: this._construirHtmlFormulario(),
      width: 720,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: COLOR_CONFIRMAR,
      customClass: { popup: 'glassdoor-modal', htmlContainer: 'glassdoor-modal__cuerpo' },
      showCloseButton: true,
      allowOutsideClick: false,
      didOpen: () => this._enlazarCambioPais(),
      preConfirm: () => this._extraerDatosFormulario(),
    }).then(result => {
      if (!result.isConfirmed || !result.value) return;
      const payload = { ...result.value, idGlassdoorConfiguracion: this.idConfiguracion, usuarioCreacion: this.usuarioActual, mostrar: false };
      this.integraService.postJsonResponse(constApiMarketing.GlassdoorResenaInsertar, payload).subscribe({
        next: () => { Swal.fire({ icon: 'success', title: 'Reseña creada', confirmButtonColor: COLOR_CONFIRMAR }); this._refrescarDatos(); },
        error: () => this.alertaService.notificationError('Error al crear.'),
      });
    });
  }

  /** Carga las ciudades del país de la reseña antes de abrir el modal de edición. */
  editarResena(t: IGlassdoorResena): void {
    this.ciudadesCombo = [];
    const abrirModal = () => {
      Swal.fire({
        title: 'Editar Reseña',
        html: this._construirHtmlFormulario(t),
        width: 720,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: COLOR_CONFIRMAR,
        customClass: { popup: 'glassdoor-modal', htmlContainer: 'glassdoor-modal__cuerpo' },
        showCloseButton: true,
        allowOutsideClick: false,
        didOpen: () => this._enlazarCambioPais(),
        preConfirm: () => this._extraerDatosFormulario(),
      }).then(result => {
        if (!result.isConfirmed || !result.value) return;
        const payload = { ...result.value, id: t.idGlassdoorResena, idGlassdoorConfiguracion: t.idGlassdoorConfiguracion, usuarioModificacion: this.usuarioActual };
        this.integraService.putJsonResponse(constApiMarketing.GlassdoorResenaActualizar, payload).subscribe({
          next: () => { Swal.fire({ icon: 'success', title: 'Reseña actualizada', confirmButtonColor: COLOR_CONFIRMAR }); this._refrescarDatos(); },
          error: () => this.alertaService.notificationError('Error al actualizar.'),
        });
      });
    };

    if (t.idPais) {
      this.integraService.getJsonResponse(constApiMarketing.GlassdoorResenaObtenerCiudadesCombo + '/' + t.idPais)
        .subscribe({
          next: (r: HttpResponse<any>) => { this.ciudadesCombo = r.body ?? []; abrirModal(); },
          error: () => abrirModal(),
        });
    } else {
      abrirModal();
    }
  }

  /** Elimina lógicamente una reseña individual, previa confirmación. */
  eliminarResena(t: IGlassdoorResena): void {
    Swal.fire({
      title: '¿Eliminar reseña?',
      html: `Se eliminará la reseña seleccionada permanentemente.`,
      icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Sí, eliminar', confirmButtonColor: '#ef4444',
    }).then(r => {
      if (!r.isConfirmed) return;
      this.integraService.deleteJsonResponse(constApiMarketing.GlassdoorResenaEliminar + '/' + t.idGlassdoorResena)
        .subscribe({
          next: () => { Swal.fire({ icon: 'success', title: 'Eliminado', confirmButtonColor: COLOR_CONFIRMAR }); this._refrescarDatos(); },
          error: () => this.alertaService.notificationError('Error al eliminar.'),
        });
    });
  }

  /** Elimina lógicamente en bloque las reseñas seleccionadas, previa confirmación. */
  eliminarSeleccionados(): void {
    if (!this._validarSeleccion()) return;
    const n = this.seleccionados.size;
    Swal.fire({
      title: '¿Eliminar reseñas?',
      html: `Se eliminarán <b>${n}</b> reseña(s) permanentemente.`,
      icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Sí, eliminar todos', confirmButtonColor: '#ef4444',
    }).then(r => {
      if (!r.isConfirmed) return;
      this.integraService.deleteJsonResponse(constApiMarketing.GlassdoorResenaEliminarListado, Array.from(this.seleccionados))
        .subscribe({
          next: () => { Swal.fire({ icon: 'success', title: `${n} eliminados`, confirmButtonColor: COLOR_CONFIRMAR }); this._refrescarDatos(); },
          error: () => this.alertaService.notificationError('Error al eliminar.'),
        });
    });
  }

  /** Verifica que haya al menos un registro seleccionado; muestra un error si no. */
  private _validarSeleccion(): boolean {
    if (this.seleccionados.size === 0) { this.alertaService.notificationError('Seleccione al menos una reseña.'); return false; }
    return true;
  }

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
  private _construirHtmlFormulario(t?: IGlassdoorResena): string {
    const esc    = (v?: string) => (v || '').replace(/"/g, '&quot;');
    const escTxt = (v?: string) => (v || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const paisOpts = this.paisesCombo
      .map(p => `<option value="${p.idPais}" ${t?.idPais === p.idPais ? 'selected' : ''}>${p.nombrePais}</option>`)
      .join('');

    const ciudadOpts = this.ciudadesCombo
      .map(c => `<option value="${c.idCiudad}" ${t?.idCiudad === c.idCiudad ? 'selected' : ''}>${c.nombreCiudad}</option>`)
      .join('');

    const valActual = t?.valoracion ?? 5;
    const valoracionOpts = [1, 2, 3, 4, 5]
      .map(r => `<option value="${r}" ${valActual === r ? 'selected' : ''}>${r} ${'★'.repeat(r)}${'☆'.repeat(5 - r)}</option>`)
      .join('');

    const tipo = t?.tipoEmpleado || 'Actual';

    return `
    <div class="glassdoor-formulario">
      <div class="glassdoor-formulario__campo">
        <label class="glassdoor-formulario__etiqueta">Título *</label>
        <input id="swal-titulo" class="glassdoor-formulario__input" value="${esc(t?.titulo)}" placeholder="Resumen corto de la reseña">
      </div>
      <div class="glassdoor-formulario__campo">
        <label class="glassdoor-formulario__etiqueta">Reseña *</label>
        <textarea id="swal-contenido" class="glassdoor-formulario__textarea glassdoor-formulario__textarea--resena" placeholder="Contenido de la reseña...">${escTxt(t?.contenido)}</textarea>
      </div>
      <div class="glassdoor-formulario__fila">
        <div class="glassdoor-formulario__campo">
          <label class="glassdoor-formulario__etiqueta">Cargo</label>
          <input id="swal-cargo" class="glassdoor-formulario__input" value="${esc(t?.cargo)}" placeholder="Ej: Analista, Consultor">
        </div>
        <div class="glassdoor-formulario__campo">
          <label class="glassdoor-formulario__etiqueta">Tipo empleado</label>
          <select id="swal-tipo" class="glassdoor-formulario__select">
            <option value="Actual"   ${tipo === 'Actual'   ? 'selected' : ''}>Actual</option>
            <option value="Anterior" ${tipo === 'Anterior' ? 'selected' : ''}>Anterior</option>
          </select>
        </div>
        <div class="glassdoor-formulario__campo">
          <label class="glassdoor-formulario__etiqueta">Valoración</label>
          <select id="swal-valoracion" class="glassdoor-formulario__select">
            ${valoracionOpts}
          </select>
        </div>
      </div>
      <div class="glassdoor-formulario__campo">
        <label class="glassdoor-formulario__etiqueta">Ventaja</label>
        <textarea id="swal-ventaja" class="glassdoor-formulario__textarea" placeholder="Aspectos positivos...">${escTxt(t?.ventaja)}</textarea>
      </div>
      <div class="glassdoor-formulario__campo">
        <label class="glassdoor-formulario__etiqueta">Desventaja</label>
        <textarea id="swal-desventaja" class="glassdoor-formulario__textarea" placeholder="Aspectos negativos...">${escTxt(t?.desventaja)}</textarea>
      </div>
      <div class="glassdoor-formulario__fila">
        <div class="glassdoor-formulario__campo">
          <label class="glassdoor-formulario__etiqueta">País</label>
          <select id="swal-pais" class="glassdoor-formulario__select">
            <option value="">— Seleccionar país —</option>
            ${paisOpts}
          </select>
        </div>
        <div class="glassdoor-formulario__campo">
          <label class="glassdoor-formulario__etiqueta">Ciudad</label>
          <select id="swal-ciudad" class="glassdoor-formulario__select" ${!t?.idPais ? 'disabled' : ''}>
            <option value="">— Seleccionar ciudad —</option>
            ${ciudadOpts}
          </select>
        </div>
        <div class="glassdoor-formulario__campo">
          <label class="glassdoor-formulario__etiqueta">Fecha reseña</label>
          <input id="swal-fecha" type="date" class="glassdoor-formulario__input" value="${t?.fechaResena ? new Date(t.fechaResena).toISOString().split('T')[0] : ''}">
        </div>
      </div>
    </div>`;
  }

  /** Conecta el evento de cambio de país para recargar el combo de ciudades en el modal. */
  private _enlazarCambioPais(): void {
    const paisEl   = document.getElementById('swal-pais')   as HTMLSelectElement;
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

      this.integraService.getJsonResponse(constApiMarketing.GlassdoorResenaObtenerCiudadesCombo + '/' + idPais)
        .subscribe({
          next: (r: HttpResponse<any>) => {
            const ciudades: ICiudadGlassdoorCombo[] = r.body ?? [];
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

    const titulo     = val('swal-titulo');
    const contenido  = val('swal-contenido');
    const ventaja    = val('swal-ventaja');
    const desventaja = val('swal-desventaja');
    if (!titulo)    { Swal.showValidationMessage('El título es obligatorio.'); return false; }
    if (!contenido) { Swal.showValidationMessage('El contenido es obligatorio.'); return false; }
    if (!ventaja && !desventaja) { Swal.showValidationMessage('Ingrese al menos Ventaja o Desventaja.'); return false; }

    const tipoEmpleado = selVal('swal-tipo') || 'Actual';
    const idCiudad = parseInt(selVal('swal-ciudad'), 10) || null;
    const valoracion = parseInt(selVal('swal-valoracion'), 10) || 5;
    const fecha = val('swal-fecha');

    return {
      titulo,
      contenido,
      cargo:        val('swal-cargo'),
      tipoEmpleado,
      valoracion,
      ventaja,
      desventaja,
      idCiudad,
      fechaResena:  fecha ? new Date(fecha).toISOString() : null,
    };
  }

  /** Abre el modal para crear o editar la configuración única de Glassdoor. */
  abrirConfiguracion(): void {
    this.integraService.getJsonResponse(constApiMarketing.GlassdoorConfiguracionObtener)
      .subscribe({
        next: (r: HttpResponse<any>) => { this._mostrarModalConfig(r.body ?? null); },
        error: () => { this._mostrarModalConfig(null); },
      });
  }

  /** Abre el submodal de creación o edición de la configuración. */
  private _mostrarModalConfig(existente: IGlassdoorConfiguracion | null): void {
    const esActualizacion = !!(existente && existente.id);
    Swal.fire({
      title: esActualizacion ? 'Editar configuración — Glassdoor' : 'Nueva configuración — Glassdoor',
      html: this._construirHtmlConfiguracion(existente),
      width: 640,
      showCancelButton: true,
      confirmButtonText: esActualizacion ? 'Actualizar' : 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: COLOR_CONFIRMAR,
      customClass: { popup: 'glassdoor-modal', htmlContainer: 'glassdoor-modal__cuerpo' },
      showCloseButton: true,
      allowOutsideClick: false,
      preConfirm: () => this._extraerDatosConfiguracion(existente),
    }).then(result => {
      if (!result.isConfirmed || !result.value) return;
      const payload: IGlassdoorConfiguracion = result.value;
      const peticion = esActualizacion
        ? this.integraService.putJsonResponse(constApiMarketing.GlassdoorConfiguracionActualizar, payload)
        : this.integraService.postJsonResponse(constApiMarketing.GlassdoorConfiguracionInsertar, payload);

      peticion.subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: esActualizacion ? 'Configuración actualizada' : 'Configuración creada',
            confirmButtonColor: COLOR_CONFIRMAR,
          });
        },
        error: () => this.alertaService.notificationError('Error al guardar la configuración.'),
      });
    });
  }

  /** Genera el HTML del formulario SweetAlert2 para la configuración de la cuenta. */
  private _construirHtmlConfiguracion(c: IGlassdoorConfiguracion | null): string {
    const esc = (v?: string) => (v || '').replace(/"/g, '&quot;');
    const fechaVal = c?.fechaSincronizacion
      ? new Date(c.fechaSincronizacion).toISOString().split('T')[0] : '';
    return `
    <div class="glassdoor-formulario">
      <div class="glassdoor-formulario__fila">
        <div class="glassdoor-formulario__campo glassdoor-formulario__campo--expandir">
          <label class="glassdoor-formulario__etiqueta">Nombre empresa *</label>
          <input id="cfg-nombre" class="glassdoor-formulario__input" value="${esc(c?.nombreEmpresa)}" placeholder="Ej: BSG Institute">
        </div>
        <div class="glassdoor-formulario__campo glassdoor-formulario__campo--fecha">
          <label class="glassdoor-formulario__etiqueta">Fecha sincronización</label>
          <input id="cfg-fecha" type="date" class="glassdoor-formulario__input" value="${fechaVal}">
        </div>
      </div>
      <div class="glassdoor-formulario__fila">
        <div class="glassdoor-formulario__campo">
          <label class="glassdoor-formulario__etiqueta">Identificador cuenta</label>
          <input id="cfg-identificador" class="glassdoor-formulario__input" value="${esc(c?.identificadorCuenta)}" placeholder="Ej: E12345">
        </div>
        <div class="glassdoor-formulario__campo">
          <label class="glassdoor-formulario__etiqueta">Valoración (0 - 5) *</label>
          <input id="cfg-valoracion" type="number" step="0.1" min="0" max="5" class="glassdoor-formulario__input" value="${c?.valoracion ?? ''}" placeholder="Ej: 4.5">
        </div>
        <div class="glassdoor-formulario__campo">
          <label class="glassdoor-formulario__etiqueta">Total evaluaciones</label>
          <input id="cfg-total" type="number" min="0" class="glassdoor-formulario__input" value="${c?.resenaTotal ?? ''}" placeholder="Ej: 120">
        </div>
      </div>
      <div class="glassdoor-formulario__campo">
        <label class="glassdoor-formulario__etiqueta">URL perfil Glassdoor</label>
        <input id="cfg-url" class="glassdoor-formulario__input" value="${esc(c?.urlPerfil)}" placeholder="https://www.glassdoor.com/Overview/...">
      </div>
    </div>`;
  }

  /** Extrae y valida los datos de la configuración; devuelve false si la validación falla. */
  private _extraerDatosConfiguracion(existente: IGlassdoorConfiguracion | null): IGlassdoorConfiguracion | false {
    const val = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value?.trim() || '';
    const nombre = val('cfg-nombre');
    if (!nombre) { Swal.showValidationMessage('El nombre de la empresa es obligatorio.'); return false; }

    const valStr = val('cfg-valoracion');
    const valoracion = parseFloat(valStr);
    if (valStr === '' || isNaN(valoracion)) {
      Swal.showValidationMessage('La valoración es obligatoria.'); return false;
    }
    if (valoracion < 0 || valoracion > 5) {
      Swal.showValidationMessage('La valoración debe estar entre 0 y 5.'); return false;
    }

    const fecha = val('cfg-fecha');
    return {
      ...(existente?.id ? { id: existente.id } : {}),
      nombreEmpresa:        nombre,
      identificadorCuenta:  val('cfg-identificador'),
      valoracion,
      resenaTotal:                parseInt(val('cfg-total'), 10) || 0,
      urlPerfil:            val('cfg-url'),
      fechaSincronizacion:  fecha ? new Date(fecha).toISOString() : null,
    };
  }
}
