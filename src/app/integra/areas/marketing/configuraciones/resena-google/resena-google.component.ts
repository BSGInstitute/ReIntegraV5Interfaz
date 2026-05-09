/**
 * @module MarketingModule
 * @description Gestión de reseñas de Google Places y administración de sedes para BSG Institute.
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
  IGoogleResena,
  ISedeGoogle,
  ISedeGoogleCombo,
  IGoogleResenaFiltro,
  IMarcarVisibilidadGoogleRequest,
  IGooglePlacesConfiguracion,
} from '@marketing/models/interfaces/resena-google';
import { KendoGridMessagesEs } from '@shared/services/kendo-grid-messages-es.service';
import Swal from 'sweetalert2';

const TAMANO_PAGINA_TODOS = 10000;
const TAMANO_PAGINA_DEFECTO = 20;
const COLOR_CONFIRMAR = '#094D82';

@Component({
  selector: 'app-resena-google',
  templateUrl: './resena-google.component.html',
  styleUrls: ['./resena-google.component.scss'],
  providers: [{ provide: MessageService, useClass: KendoGridMessagesEs }],
})
export class ResenaGoogleComponent implements OnInit {

  @ViewChild('grid', { static: false }) grid: any;

  resenas: IGoogleResena[] = [];
  sedesGoogle: ISedeGoogle[] = [];
  sedesCombo: ISedeGoogleCombo[] = [];

  get sedesConResenas(): ISedeGoogle[] {
    return this.sedesGoogle
      .filter(sede => sede.totalResenas > 0)
      .sort((a, b) => a.idGooglePlacesConfiguracion - b.idGooglePlacesConfiguracion);
  }

  get promedioRating(): number {
    const activas = this.sedesConResenas;
    if (!activas.length) return 0;
    const suma = activas.reduce((acum, sede) => acum + Number(sede.promedioValoracion ?? 0), 0);
    return Math.round((suma / activas.length) * 10) / 10;
  }

  get totalResenas(): number {
    return this.sedesConResenas.reduce((acum, sede) => acum + sede.totalResenas, 0);
  }

  seleccionados = new Set<number>();

  get todosSeleccionados(): boolean {
    return this.resenas.length > 0 && this.seleccionados.size === this.resenas.length;
  }

  get haySeleccionParcial(): boolean {
    return this.seleccionados.size > 0 && !this.todosSeleccionados;
  }

  filtro: IGoogleResenaFiltro = {
    idsSede:         [],
    esVisible:       null,
    valoracion:      null,
    fechaInicio:     null,
    fechaFin:        null,
    pagina:          1,
    tamanoPagina:    TAMANO_PAGINA_TODOS,
  };

  filtroVisibilidad: boolean | null = null;
  filtroRating: number | null = null;
  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;

  opcionesRating = [
    { label: 'Todos', valor: null },
    { label: '5 ★',   valor: 5 },
    { label: '4 ★',  valor: 4 },
    { label: '3 ★',  valor: 3 },
    { label: '2 ★',  valor: 2 },
    { label: '1 ★',  valor: 1 },
  ];

  metricasVisibles = true;
  filtrosAbiertos = true;
  pagerConfig: any = { buttonCount: 5, pageSizes: [20, 50, 'All'] };

  cargandoGrilla = true;
  procesandoMostrar = false;
  procesandoOcultar = false;
  procesandoSincronizacion = false;

  private get usuarioActual(): string {
    try { return JSON.parse(localStorage.getItem('userData') || '{}')?.userName ?? ''; }
    catch { return ''; }
  }
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
  ) {}

  ngOnInit(): void {
    this.cargarSedesGoogle();
    this.cargarSedesCombo();
    this.consultarResenas();
  }

  /** Carga las sedes Google con estadísticas agregadas para los KPI cards. */
  cargarSedesGoogle(): void {
    this.integraService
      .getJsonResponse(constApiMarketing.GoogleResenaObtenerSedes)
      .subscribe({
        next: (resp: HttpResponse<any>) => { this.sedesGoogle = resp.body ?? []; },
        error: () => {},
      });
  }

  /** Carga las sedes Google disponibles para el multiselect del filtro. */
  cargarSedesCombo(): void {
    this.integraService
      .getJsonResponse(constApiMarketing.GoogleResenaObtenerSedesCombo)
      .subscribe({
        next: (resp: HttpResponse<any>) => { this.sedesCombo = resp.body ?? []; },
        error: () => {},
      });
  }

  /** Sincroniza los filtros de la UI con el DTO y consulta la grilla. */
  buscar(): void {
    this.filtro.esVisible   = this.filtroVisibilidad;
    this.filtro.valoracion  = this.filtroRating;
    this.filtro.fechaInicio = this.fechaDesde ? this._formatearFechaLocal(this.fechaDesde) : null;
    this.filtro.fechaFin    = this.fechaHasta ? this._formatearFechaLocal(this.fechaHasta, true) : null;
    this.consultarResenas();
  }

  /** Ejecuta el POST a ObtenerGrilla y refresca la grilla con la respuesta. */
  private consultarResenas(): void {
    this.cargandoGrilla = true;
    this.seleccionados.clear();
    this.integraService
      .postJsonResponse(constApiMarketing.GoogleResenaObtenerGrilla, this.filtro)
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          const cuerpo = resp.body;
          this.resenas = Array.isArray(cuerpo) ? cuerpo : (cuerpo?.data ?? []);
          this.cargandoGrilla = false;
          this._resetearEstadoGrilla();
        },
        error: () => {
          this.alertaService.notificationError('Error al obtener las reseñas.');
          this.cargandoGrilla = false;
        },
      });
  }

  /** Atajo de fecha: desde el día 1 del mes actual hasta hoy. */
  seleccionarEsteMes(): void {
    const hoy = new Date();
    this.fechaDesde = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.fechaHasta = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  }

  /** Atajo de fecha: desde el 1 de enero del año actual hasta hoy. */
  seleccionarEsteAnio(): void {
    const hoy = new Date();
    this.fechaDesde = new Date(hoy.getFullYear(), 0, 1);
    this.fechaHasta = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  }

  /** Atajo de fecha: año anterior completo (1 ene – 31 dic). */
  seleccionarAnioAnterior(): void {
    const anio = new Date().getFullYear() - 1;
    this.fechaDesde = new Date(anio, 0, 1);
    this.fechaHasta = new Date(anio, 11, 31);
  }

  /** Reinicia todos los filtros y recarga la grilla. */
  limpiarFiltros(): void {
    this.filtro.idsSede    = [];
    this.fechaDesde        = null;
    this.fechaHasta        = null;
    this.filtroVisibilidad = null;
    this.filtroRating      = null;
    this.buscar();
  }

  /** Marca o desmarca todas las reseñas visibles en la grilla. */
  alternarSeleccionTodos(seleccionar: boolean): void {
    if (seleccionar) this.resenas.forEach(r => this.seleccionados.add(r.idGoogleResena));
    else this.seleccionados.clear();
  }

  /** Alterna la selección de una reseña individual por Id. */
  alternarSeleccionResena(id: number, seleccionar: boolean): void {
    seleccionar ? this.seleccionados.add(id) : this.seleccionados.delete(id);
  }

  /** Indica si el Id está en el conjunto de seleccionados. */
  estaSeleccionada(id: number): boolean {
    return this.seleccionados.has(id);
  }

  /** Publica en el sitio web las reseñas seleccionadas, previa confirmación. */
  marcarComoVisibles(): void {
    if (!this._validarSeleccion()) return;
    const cantidad = this.seleccionados.size;
    Swal.fire({
      title: '¿Marcar como visibles?',
      html: `Se marcarán <b>${cantidad} reseña(s)</b> como visibles en el sitio web.`,
      icon: 'question', showCancelButton: true,
      confirmButtonText: 'Sí, mostrar', cancelButtonText: 'Cancelar',
      confirmButtonColor: '#17b76a',
    }).then(r => {
      if (!r.isConfirmed) return;
      const payload = this._crearPayloadVisibilidad();
      this.procesandoMostrar = true;
      this.integraService
        .postJsonResponse(constApiMarketing.GoogleResenaMarcarResenaVisible, payload)
        .subscribe({
          next: () => { this.procesandoMostrar = false; },
          error: () => { this.alertaService.notificationError('Error al mostrar.'); this.procesandoMostrar = false; },
          complete: () => {
            this.procesandoMostrar = false;
            Swal.fire({ icon: 'success', title: 'Reseñas visibles', html: `<b>${cantidad}</b> reseña(s) marcadas como visibles.`, confirmButtonColor: COLOR_CONFIRMAR });
            this._refrescarDatos();
          },
        });
    });
  }

  /** Oculta del sitio web las reseñas seleccionadas, previa confirmación. */
  marcarComoOcultas(): void {
    if (!this._validarSeleccion()) return;
    const cantidad = this.seleccionados.size;
    Swal.fire({
      title: '¿Ocultar reseñas?',
      html: `Se ocultarán <b>${cantidad} reseña(s)</b> del sitio web.`,
      icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Sí, ocultar', cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e8923a',
    }).then(r => {
      if (!r.isConfirmed) return;
      const payload = this._crearPayloadVisibilidad();
      this.procesandoOcultar = true;
      this.integraService
        .postJsonResponse(constApiMarketing.GoogleResenaMarcarResenaOculta, payload)
        .subscribe({
          next: () => { this.procesandoOcultar = false; },
          error: () => { this.alertaService.notificationError('Error al ocultar.'); this.procesandoOcultar = false; },
          complete: () => {
            this.procesandoOcultar = false;
            Swal.fire({ icon: 'success', title: 'Reseñas ocultadas', html: `<b>${cantidad}</b> reseña(s) ocultadas del sitio web.`, confirmButtonColor: COLOR_CONFIRMAR });
            this._refrescarDatos();
          },
        });
    });
  }

  /** Lanza la sincronización con la Google Places API; el resumen se envía por correo. */
  sincronizarDesdeGoogle(): void {
    Swal.fire({
      title: '¿Sincronizar reseñas desde Google?',
      html: `Se consultará la <b>Google Places API</b> para actualizar todas las reseñas de las sedes configuradas.<br><br>
             <span style="color:#555">Este proceso puede tardar varios minutos.
             Al finalizar, recibirás un <b>correo electrónico</b> con el resumen del procesamiento.</span>`,
      icon: 'info', showCancelButton: true,
      confirmButtonText: 'Iniciar sincronización', cancelButtonText: 'Cancelar',
      confirmButtonColor: COLOR_CONFIRMAR,
    }).then(r => {
      if (!r.isConfirmed) return;
      this.procesandoSincronizacion = true;
      this.alertaService.notificationSuccess('Sincronización iniciada. Recibirás un correo cuando finalice.');
      this.integraService
        .postJsonResponse(constApiMarketing.GoogleResenaSincronizar, {})
        .subscribe({
          next: () => { this.procesandoSincronizacion = false; },
          error: () => { this.procesandoSincronizacion = false; this.alertaService.notificationError('Error al sincronizar.'); },
          complete: () => {
            this.procesandoSincronizacion = false;
            Swal.fire({ icon: 'success', title: 'Sincronización completada', html: 'Reseñas actualizadas correctamente.<br><span style="color:#555">Revisa tu correo para el resumen.</span>', confirmButtonColor: COLOR_CONFIRMAR });
            this._refrescarDatos();
          },
        });
    });
  }

  /** Devuelve el color del rating: verde (≥4), naranja (≥3), rojo (<3). */
  colorRating(rating: number): string {
    if (rating >= 4) return '#17b76a';
    if (rating >= 3) return '#e8923a';
    return '#ef4444';
  }

  /** Representa el rating como cadena de 5 caracteres (★ llenas, ☆ vacías). */
  estrellas(rating: number): string {
    const llenas = Math.round(rating);
    return '★'.repeat(llenas) + '☆'.repeat(5 - llenas);
  }

  /** Formatea el rating numérico con un decimal (ej: 4.666 → "4.7"). */
  formatearRating(rating: number): string {
    return (Math.round(rating * 10) / 10).toFixed(1);
  }

  /** Verifica que haya al menos un registro seleccionado; muestra un error si no. */
  private _validarSeleccion(): boolean {
    if (this.seleccionados.size === 0) {
      this.alertaService.notificationError('Seleccione al menos una reseña.');
      return false;
    }
    return true;
  }

  /** Construye el payload con los Ids seleccionados y el usuario que ejecuta la acción. */
  private _crearPayloadVisibilidad(): IMarcarVisibilidadGoogleRequest {
    return { idsGoogleResena: Array.from(this.seleccionados), usuario: this.usuarioActual };
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
    this.cargarSedesGoogle();
    this.buscar();
  }

  // Administración de sedes Google (GooglePlacesConfiguracion)

  /** Abre el modal de administración de sedes Google con su resumen y tabla CRUD. */
  abrirConfiguraciones(): void {
    this.integraService.getJsonResponse(constApiMarketing.GooglePlacesConfiguracionObtenerTodos)
      .subscribe({
        next: (r: HttpResponse<any>) => this._mostrarListaSedes(r.body ?? []),
        error: () => this._mostrarListaSedes([]),
      });
  }

  /** Renderiza el modal principal con la lista de sedes y sus acciones CRUD. */
  private _mostrarListaSedes(sedes: IGooglePlacesConfiguracion[]): void {
    Swal.fire({
      title: 'Sedes de Google',
      html: this._construirHtmlListaSedes(sedes),
      width: 820,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      customClass: { popup: 'google-modal', htmlContainer: 'google-modal__cuerpo' },
      showCloseButton: true,
      allowOutsideClick: false,
      didOpen: () => this._enlazarAccionesSedes(sedes),
    });
  }

  /** Genera el HTML del modal de administración: resumen + tabla CRUD de sedes. */
  private _construirHtmlListaSedes(sedes: IGooglePlacesConfiguracion[]): string {
    const esc = (v?: string) => (v || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const visibles = sedes.filter(s => s.mostrar);
    const totalRes = visibles.reduce((a, s) => a + (s.resenaTotal ?? 0), 0);
    const promedio = visibles.length
      ? visibles.reduce((a, s) => a + Number(s.valoracion ?? 0), 0) / visibles.length
      : 0;

    const resumen = `
      <div class="google-sedes-resumen">
        <div class="google-sedes-resumen__nota">
          <span class="material-icons">info</span>
          <span>Este resumen refleja las sedes con visibilidad activa — se muestra en el <b>Portal Web</b> de BSG Institute.</span>
        </div>
        <div class="google-sedes-resumen__metricas">
          <div class="google-sedes-resumen__metrica">
            <span class="google-sedes-resumen__valor">${promedio.toFixed(1)} ★</span>
            <span class="google-sedes-resumen__etiqueta">Promedio de valoración</span>
          </div>
          <div class="google-sedes-resumen__metrica">
            <span class="google-sedes-resumen__valor">${totalRes.toLocaleString('es-PE')}</span>
            <span class="google-sedes-resumen__etiqueta">Total reseñas</span>
          </div>
          <div class="google-sedes-resumen__metrica">
            <span class="google-sedes-resumen__valor">${visibles.length} / ${sedes.length}</span>
            <span class="google-sedes-resumen__etiqueta">Sedes visibles</span>
          </div>
        </div>
      </div>`;

    const filas = sedes.length
      ? sedes.map(s => `
        <tr data-id="${s.id}">
          <td>${esc(s.nombreSede)}</td>
          <td><span class="google-sedes-tabla__id">${esc(s.identificadorCuenta)}</span></td>
          <td class="google-sedes-tabla__num">${Number(s.valoracion ?? 0).toFixed(1)} ★</td>
          <td class="google-sedes-tabla__num">${s.resenaTotal ?? 0}</td>
          <td class="google-sedes-tabla__centro">
            <span class="material-icons google-sedes-ojo ${s.mostrar ? 'google-sedes-ojo--activo' : 'google-sedes-ojo--inactivo'}" title="${s.mostrar ? 'Visible' : 'Oculto'}">${s.mostrar ? 'visibility' : 'visibility_off'}</span>
          </td>
          <td class="google-sedes-tabla__acciones">
            <button class="google-sedes-icono google-sedes-icono--editar" data-editar="${s.id}" title="Editar">
              <span class="material-icons">edit</span>
            </button>
            <button class="google-sedes-icono google-sedes-icono--eliminar" data-eliminar="${s.id}" title="Eliminar">
              <span class="material-icons">delete</span>
            </button>
          </td>
        </tr>
      `).join('')
      : `<tr><td colspan="6" class="google-sedes-tabla__vacio">Sin sedes registradas.</td></tr>`;

    return `
      ${resumen}
      <div class="google-sedes-barra">
        <button id="gg-cfg-agregar" class="google-sedes-boton google-sedes-boton--agregar">+ Agregar sede</button>
      </div>
      <div class="google-sedes-tabla-wrap">
        <table class="google-sedes-tabla">
          <thead>
            <tr>
              <th>Nombre sede</th>
              <th>Identificador cuenta</th>
              <th class="google-sedes-tabla__num">Valoración</th>
              <th class="google-sedes-tabla__num">Reseñas</th>
              <th class="google-sedes-tabla__centro">Mostrar</th>
              <th class="google-sedes-tabla__centro">Acciones</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>`;
  }

  /** Conecta los handlers de los botones Agregar/Editar/Eliminar en la lista de sedes. */
  private _enlazarAccionesSedes(sedes: IGooglePlacesConfiguracion[]): void {
    document.getElementById('gg-cfg-agregar')?.addEventListener('click', () => {
      Swal.close();
      this._mostrarModalSede(null);
    });

    document.querySelectorAll<HTMLButtonElement>('[data-editar]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset['editar']);
        const existente = sedes.find(s => s.id === id) ?? null;
        Swal.close();
        this._mostrarModalSede(existente);
      });
    });

    document.querySelectorAll<HTMLButtonElement>('[data-eliminar]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset['eliminar']);
        const existente = sedes.find(s => s.id === id);
        if (!existente) return;
        this._confirmarEliminarSede(existente);
      });
    });
  }

  /** Abre el submodal de creación o edición de una sede. */
  private _mostrarModalSede(existente: IGooglePlacesConfiguracion | null): void {
    const esActualizacion = !!existente?.id;
    Swal.fire({
      title: esActualizacion ? 'Editar sede Google' : 'Nueva sede Google',
      html: this._construirHtmlFormularioSede(existente),
      width: 640,
      showCancelButton: true,
      confirmButtonText: esActualizacion ? 'Actualizar' : 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: COLOR_CONFIRMAR,
      customClass: { popup: 'google-modal', htmlContainer: 'google-modal__cuerpo' },
      showCloseButton: true,
      allowOutsideClick: false,
      didOpen: () => this._enlazarFormularioSede(),
      preConfirm: () => this._extraerDatosSede(existente),
    }).then(result => {
      if (!result.isConfirmed || !result.value) { this.abrirConfiguraciones(); return; }
      const payload: IGooglePlacesConfiguracion = result.value;
      const req = esActualizacion
        ? this.integraService.putJsonResponse(constApiMarketing.GooglePlacesConfiguracionActualizar, payload)
        : this.integraService.postJsonResponse(constApiMarketing.GooglePlacesConfiguracionInsertar, payload);
      req.subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: esActualizacion ? 'Sede actualizada' : 'Sede creada',
            confirmButtonColor: COLOR_CONFIRMAR,
          }).then(() => { this._refrescarDatos(); this.abrirConfiguraciones(); });
        },
        error: () => this.alertaService.notificationError('Error al guardar la sede.'),
      });
    });
  }

  /** Genera el HTML del formulario SweetAlert2 para crear o editar una sede. */
  private _construirHtmlFormularioSede(s: IGooglePlacesConfiguracion | null): string {
    const esc = (v?: string) => (v || '').replace(/"/g, '&quot;');
    const mostrarInicial = s?.mostrar !== false;
    return `
    <div class="google-formulario">
      <div class="google-formulario__campo">
        <label class="google-formulario__etiqueta">Nombre sede *</label>
        <input id="gg-cfg-nombre" class="google-formulario__input" value="${esc(s?.nombreSede)}" placeholder="Ej: BSG Institute Lima Centro">
      </div>
      <div class="google-formulario__campo">
        <label class="google-formulario__etiqueta">Identificador cuenta (Place ID) *</label>
        <input id="gg-cfg-identificador" class="google-formulario__input" value="${esc(s?.identificadorCuenta)}" placeholder="Ej: ChIJxxxxxxxxxxxxxxxxxxxxxxx">
      </div>
      <div class="google-formulario__fila">
        <div class="google-formulario__campo">
          <label class="google-formulario__etiqueta">Valoración (0 - 5)</label>
          <input id="gg-cfg-valoracion" type="number" step="0.1" min="0" max="5" class="google-formulario__input" value="${s?.valoracion ?? 0}" placeholder="Ej: 4.8">
        </div>
        <div class="google-formulario__campo">
          <label class="google-formulario__etiqueta">Total reseñas</label>
          <input id="gg-cfg-total" type="number" min="0" class="google-formulario__input" value="${s?.resenaTotal ?? 0}" placeholder="Ej: 250">
        </div>
        <div class="google-formulario__campo google-formulario__campo--toggle">
          <label class="google-formulario__etiqueta">Mostrar en sitio</label>
          <label class="google-sedes-toggle google-sedes-toggle--inline ${mostrarInicial ? 'google-sedes-toggle--activo' : ''}" id="gg-cfg-mostrar-wrap">
            <input id="gg-cfg-mostrar" type="checkbox" ${mostrarInicial ? 'checked' : ''}>
            <span class="google-sedes-toggle__slider"></span>
          </label>
        </div>
      </div>
    </div>`;
  }

  /** Conecta los listeners del formulario de sede (toggle mostrar). */
  private _enlazarFormularioSede(): void {
    // Sincroniza la clase visual del toggle; SweetAlert2 aísla su DOM y `:checked +` no siempre se recalcula.
    const mostrarInput = document.getElementById('gg-cfg-mostrar')      as HTMLInputElement;
    const mostrarWrap  = document.getElementById('gg-cfg-mostrar-wrap') as HTMLLabelElement;
    mostrarInput?.addEventListener('change', () => {
      mostrarWrap?.classList.toggle('google-sedes-toggle--activo', mostrarInput.checked);
    });
  }

  /** Extrae y valida los datos de la sede; devuelve false si la validación falla. */
  private _extraerDatosSede(existente: IGooglePlacesConfiguracion | null): IGooglePlacesConfiguracion | false {
    const val = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value?.trim() ?? '';
    const chk = (id: string) => (document.getElementById(id) as HTMLInputElement)?.checked ?? false;

    const nombreSede          = val('gg-cfg-nombre');
    const identificadorCuenta = val('gg-cfg-identificador');
    if (!nombreSede)          { Swal.showValidationMessage('El nombre de la sede es obligatorio.'); return false; }
    if (!identificadorCuenta) { Swal.showValidationMessage('El identificador de cuenta (Place ID) es obligatorio.'); return false; }

    const valoracionRaw = parseFloat(val('gg-cfg-valoracion'));
    const valoracion = isNaN(valoracionRaw) ? 0 : Math.round(valoracionRaw * 10) / 10;
    if (valoracion < 0 || valoracion > 5) { Swal.showValidationMessage('La valoración debe estar entre 0 y 5.'); return false; }

    return {
      ...(existente?.id ? { id: existente.id } : {}),
      nombreSede,
      identificadorCuenta,
      valoracion,
      resenaTotal: parseInt(val('gg-cfg-total'), 10) || 0,
      mostrar:     chk('gg-cfg-mostrar'),
    };
  }

  /** Pide confirmación y ejecuta el borrado lógico de la sede en el backend. */
  private _confirmarEliminarSede(s: IGooglePlacesConfiguracion): void {
    Swal.fire({
      title: '¿Eliminar sede?',
      html: `Se eliminará la sede <b>${s.nombreSede}</b>.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
    }).then(r => {
      if (!r.isConfirmed) { this.abrirConfiguraciones(); return; }
      this.integraService.deleteJsonResponse(constApiMarketing.GooglePlacesConfiguracionEliminar + '/' + s.id)
        .subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Sede eliminada', confirmButtonColor: COLOR_CONFIRMAR })
              .then(() => { this._refrescarDatos(); this.abrirConfiguraciones(); });
          },
          error: () => this.alertaService.notificationError('Error al eliminar la sede.'),
        });
    });
  }
}
