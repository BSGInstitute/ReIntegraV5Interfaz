/**
 * @module MarketingModule
 * @description Gestión de reseñas de Facebook y administración de cuentas (páginas) para BSG Institute.
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
  IFacebookResena,
  IPaginaFacebook,
  ICuentaFacebookCombo,
  IFacebookResenaFiltro,
  IMarcarVisibilidadRequest,
  IFacebookConfiguracion,
} from '@marketing/models/interfaces/resena-facebook';
import { KendoGridMessagesEs } from '@shared/services/kendo-grid-messages-es.service';
import Swal from 'sweetalert2';

const TAMANO_PAGINA_TODOS = 10000;
const TAMANO_PAGINA_DEFECTO = 20;
const COLOR_CONFIRMAR = '#094D82';

@Component({
  selector: 'app-resena-facebook',
  templateUrl: './resena-facebook.component.html',
  styleUrls: ['./resena-facebook.component.scss'],
  providers: [{ provide: MessageService, useClass: KendoGridMessagesEs }],
})
export class ResenaFacebookComponent implements OnInit {

  @ViewChild('grid', { static: false }) grid: any;

  resenas: IFacebookResena[] = [];
  paginasFacebook: IPaginaFacebook[] = [];
  cuentasFacebook: ICuentaFacebookCombo[] = [];

  get paginasConOpiniones(): IPaginaFacebook[] {
    return this.paginasFacebook
      .filter(pagina => pagina.totalOpiniones > 0)
      .sort((a, b) => a.id - b.id);
  }

  get promedioRecomendacion(): number {
    const activas = this.paginasConOpiniones;
    if (!activas.length) return 0;
    const sumaTotal = activas.reduce((acum, pagina) => acum + pagina.porcentajeRecomendacion, 0);
    return Math.round(sumaTotal / activas.length);
  }

  get totalOpiniones(): number {
    return this.paginasConOpiniones.reduce((acum, pagina) => acum + pagina.totalOpiniones, 0);
  }

  seleccionados = new Set<number>();

  get todosSeleccionados(): boolean {
    return this.resenas.length > 0 && this.seleccionados.size === this.resenas.length;
  }

  get haySeleccionParcial(): boolean {
    return this.seleccionados.size > 0 && !this.todosSeleccionados;
  }

  filtro: IFacebookResenaFiltro = {
    idsPaginasFacebook: [],
    fechaInicio:        null,
    fechaFin:           null,
    esVisible:          null,
    tamanoPagina:       TAMANO_PAGINA_TODOS,
  };

  filtroVisibilidad: boolean | null = null;
  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;

  metricasVisibles = true;
  filtrosAbiertos = true;
  pagerConfig: any = { buttonCount: 5, pageSizes: [20, 50, 'All'] };

  cargandoGrilla = true;
  procesandoMostrar = false;
  procesandoOcultar = false;
  procesandoSincronizacion = false;

  private get usuarioActual(): string {
    try {
      return JSON.parse(localStorage.getItem('userData') || '{}')?.userName ?? '';
    } catch {
      return '';
    }
  }
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
  ) {}

  ngOnInit(): void {
    this.cargarPaginasFacebook();
    this.cargarCuentasCombo();
    this.consultarResenas();
  }

  /** Carga las páginas Facebook con estadísticas agregadas para los KPI cards. */
  cargarPaginasFacebook(): void {
    this.integraService
      .getJsonResponse(constApiMarketing.FacebookResenaObtenerPaginas)
      .subscribe({
        next: (respuesta: HttpResponse<any>) => {
          this.paginasFacebook = respuesta.body ?? [];
        },
        error: () => {},
      });
  }

  /** Carga las cuentas Facebook disponibles para el multiselect del filtro. */
  cargarCuentasCombo(): void {
    this.integraService
      .getJsonResponse(constApiMarketing.FacebookResenaObtenerCuentasCombo)
      .subscribe({
        next: (respuesta: HttpResponse<any>) => {
          this.cuentasFacebook = respuesta.body ?? [];
        },
        error: () => {},
      });
  }

  /** Sincroniza los filtros de la UI con el DTO y consulta la grilla. */
  buscar(): void {
    this.filtro.esVisible   = this.filtroVisibilidad;
    this.filtro.fechaInicio = this.fechaDesde ? this._formatearFechaLocal(this.fechaDesde) : null;
    this.filtro.fechaFin    = this.fechaHasta ? this._formatearFechaLocal(this.fechaHasta, true) : null;
    this.consultarResenas();
  }

  /** Ejecuta el POST a ObtenerGrilla y refresca la grilla con la respuesta. */
  private consultarResenas(): void {
    this.cargandoGrilla = true;
    this.seleccionados.clear();

    this.integraService
      .postJsonResponse(constApiMarketing.FacebookResenaObtenerGrilla, this.filtro)
      .subscribe({
        next: (respuesta: HttpResponse<any>) => {
          const cuerpo = respuesta.body;
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
    const anioAnterior = new Date().getFullYear() - 1;
    this.fechaDesde = new Date(anioAnterior, 0, 1);
    this.fechaHasta = new Date(anioAnterior, 11, 31);
  }

  /** Reinicia todos los filtros y recarga la grilla. */
  limpiarFiltros(): void {
    this.filtro.idsPaginasFacebook = [];
    this.fechaDesde        = null;
    this.fechaHasta        = null;
    this.filtroVisibilidad = null;
    this.buscar();
  }

  /** Marca o desmarca todas las reseñas visibles en la grilla. */
  alternarSeleccionTodos(seleccionar: boolean): void {
    if (seleccionar) {
      this.resenas.forEach(resena => this.seleccionados.add(resena.idFacebookResena));
    } else {
      this.seleccionados.clear();
    }
  }

  /** Alterna la selección de una reseña individual por Id. */
  alternarSeleccionResena(idResena: number, seleccionar: boolean): void {
    seleccionar ? this.seleccionados.add(idResena) : this.seleccionados.delete(idResena);
  }

  /** Indica si el Id está en el conjunto de seleccionados. */
  estaSeleccionada(idResena: number): boolean {
    return this.seleccionados.has(idResena);
  }

  /** Publica en el sitio web las reseñas seleccionadas, previa confirmación del usuario. */
  marcarComoVisibles(): void {
    if (!this._validarSeleccion()) return;
    const cantidad = this.seleccionados.size;

    Swal.fire({
      title: '¿Marcar como visibles?',
      html: `Se marcarán <b>${cantidad} reseña(s)</b> como visibles en el sitio web.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, mostrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#17b76a',
    }).then(resultado => {
      if (!resultado.isConfirmed) return;

      const payload = this._crearPayloadVisibilidad();
      this.procesandoMostrar = true;

      this.integraService
        .postJsonResponse(constApiMarketing.FacebookResenaMarcarResenaVisible, payload)
        .subscribe({
          next: () => { this.procesandoMostrar = false; },
          error: () => {
            this.alertaService.notificationError('Error al mostrar las reseñas.');
            this.procesandoMostrar = false;
          },
          complete: () => {
            this.procesandoMostrar = false;
            Swal.fire({
              icon: 'success',
              title: 'Reseñas visibles',
              html: `<b>${cantidad}</b> reseña(s) fueron marcadas como visibles en el sitio web.`,
              confirmButtonColor: COLOR_CONFIRMAR,
            });
            this._refrescarDatos();
          },
        });
    });
  }

  /** Oculta del sitio web las reseñas seleccionadas, previa confirmación del usuario. */
  marcarComoOcultas(): void {
    if (!this._validarSeleccion()) return;
    const cantidad = this.seleccionados.size;

    Swal.fire({
      title: '¿Ocultar reseñas?',
      html: `Se ocultarán <b>${cantidad} reseña(s)</b> del sitio web.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, ocultar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e8923a',
    }).then(resultado => {
      if (!resultado.isConfirmed) return;

      const payload = this._crearPayloadVisibilidad();
      this.procesandoOcultar = true;

      this.integraService
        .postJsonResponse(constApiMarketing.FacebookResenaMarcarResenaOculta, payload)
        .subscribe({
          next: () => { this.procesandoOcultar = false; },
          error: () => {
            this.alertaService.notificationError('Error al ocultar las reseñas.');
            this.procesandoOcultar = false;
          },
          complete: () => {
            this.procesandoOcultar = false;
            Swal.fire({
              icon: 'success',
              title: 'Reseñas ocultadas',
              html: `<b>${cantidad}</b> reseña(s) fueron ocultadas del sitio web.`,
              confirmButtonColor: COLOR_CONFIRMAR,
            });
            this._refrescarDatos();
          },
        });
    });
  }

  /** Lanza la sincronización con la Graph API de Facebook; el resumen se envía por correo. */
  sincronizarDesdeFacebook(): void {
    Swal.fire({
      title: '¿Sincronizar reseñas desde Facebook?',
      html: `Se consultará la <b>Graph API de Facebook</b> para actualizar todas las reseñas
             de las páginas configuradas.<br><br>
             <span style="color:#555">Este proceso puede tardar varios minutos dependiendo del volumen de datos.
             Al finalizar, recibirás un <b>correo electrónico</b> con el resumen del procesamiento.</span>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Iniciar sincronización',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: COLOR_CONFIRMAR,
    }).then(resultado => {
      if (!resultado.isConfirmed) return;

      this.procesandoSincronizacion = true;
      this.alertaService.notificationSuccess('Sincronización iniciada. Recibirás un correo cuando finalice.');

      this.integraService
        .postJsonResponse(constApiMarketing.FacebookResenaSincronizar, {})
        .subscribe({
          next: () => { this.procesandoSincronizacion = false; },
          error: () => {
            this.procesandoSincronizacion = false;
            this.alertaService.notificationError('Error al sincronizar.');
          },
          complete: () => {
            this.procesandoSincronizacion = false;
            Swal.fire({
              icon: 'success',
              title: 'Sincronización completada',
              html: 'Las reseñas han sido actualizadas correctamente.<br><span style="color:#555">Revisa tu correo para ver el resumen detallado.</span>',
              confirmButtonColor: COLOR_CONFIRMAR,
            });
            this._refrescarDatos();
          },
        });
    });
  }

  /** Devuelve el color del indicador según el porcentaje: verde (≥90), naranja (≥70), rojo (<70). */
  colorPorcentaje(porcentaje: number): string {
    if (porcentaje >= 90) return '#17b76a';
    if (porcentaje >= 70) return '#e8923a';
    return '#ef4444';
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
  private _crearPayloadVisibilidad(): IMarcarVisibilidadRequest {
    return {
      idsFacebookResena: Array.from(this.seleccionados),
      usuario: this.usuarioActual,
    };
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
    this.cargarPaginasFacebook();
    this.buscar();
  }

  // Administración de cuentas Facebook (FacebookConfiguracion)

  /** Abre el modal de administración de cuentas/páginas de Facebook con su resumen y tabla CRUD. */
  abrirConfiguraciones(): void {
    this.integraService.getJsonResponse(constApiMarketing.FacebookConfiguracionObtenerTodos)
      .subscribe({
        next: (r: HttpResponse<any>) => this._mostrarListaCuentas(r.body ?? []),
        error: () => this._mostrarListaCuentas([]),
      });
  }

  /** Renderiza el modal principal con la lista de cuentas y sus acciones CRUD. */
  private _mostrarListaCuentas(cuentas: IFacebookConfiguracion[]): void {
    Swal.fire({
      title: 'Cuentas de Facebook',
      html: this._construirHtmlListaCuentas(cuentas),
      width: 820,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      customClass: { popup: 'facebook-modal', htmlContainer: 'facebook-modal__cuerpo' },
      showCloseButton: true,
      allowOutsideClick: false,
      didOpen: () => this._enlazarAccionesCuentas(cuentas),
    });
  }

  /** Genera el HTML del modal de administración: resumen + tabla CRUD de cuentas. */
  private _construirHtmlListaCuentas(cuentas: IFacebookConfiguracion[]): string {
    const esc = (v?: string) => (v || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const visibles = cuentas.filter(c => c.mostrar);
    const totalOp  = visibles.reduce((a, c) => a + (c.resenaTotal ?? 0), 0);
    const promedio = visibles.length
      ? visibles.reduce((a, c) => a + (c.valoracion ?? 0), 0) / visibles.length
      : 0;

    const resumen = `
      <div class="facebook-cuentas-resumen">
        <div class="facebook-cuentas-resumen__nota">
          <span class="material-icons">info</span>
          <span>Este resumen refleja las cuentas con visibilidad activa — se muestra en el <b>Portal Web</b> de BSG Institute.</span>
        </div>
        <div class="facebook-cuentas-resumen__metricas">
          <div class="facebook-cuentas-resumen__metrica">
            <span class="facebook-cuentas-resumen__valor">${promedio.toFixed(2)}%</span>
            <span class="facebook-cuentas-resumen__etiqueta">Promedio de valoración</span>
          </div>
          <div class="facebook-cuentas-resumen__metrica">
            <span class="facebook-cuentas-resumen__valor">${totalOp.toLocaleString('es-PE')}</span>
            <span class="facebook-cuentas-resumen__etiqueta">Total opiniones</span>
          </div>
          <div class="facebook-cuentas-resumen__metrica">
            <span class="facebook-cuentas-resumen__valor">${visibles.length} / ${cuentas.length}</span>
            <span class="facebook-cuentas-resumen__etiqueta">Cuentas visibles</span>
          </div>
        </div>
      </div>`;

    const filas = cuentas.length
      ? cuentas.map(c => `
        <tr data-id="${c.id}">
          <td>${esc(c.nombre)}</td>
          <td><span class="facebook-cuentas-tabla__id">${esc(c.identificadorPagina)}</span></td>
          <td class="facebook-cuentas-tabla__num">${(c.valoracion ?? 0).toFixed(2)}%</td>
          <td class="facebook-cuentas-tabla__num">${c.resenaTotal ?? 0}</td>
          <td class="facebook-cuentas-tabla__centro">
            <span class="material-icons facebook-cuentas-ojo ${c.mostrar ? 'facebook-cuentas-ojo--activo' : 'facebook-cuentas-ojo--inactivo'}" title="${c.mostrar ? 'Visible' : 'Oculto'}">${c.mostrar ? 'visibility' : 'visibility_off'}</span>
          </td>
          <td class="facebook-cuentas-tabla__acciones">
            <button class="facebook-cuentas-icono facebook-cuentas-icono--editar" data-editar="${c.id}" title="Editar">
              <span class="material-icons">edit</span>
            </button>
            <button class="facebook-cuentas-icono facebook-cuentas-icono--eliminar" data-eliminar="${c.id}" title="Eliminar">
              <span class="material-icons">delete</span>
            </button>
          </td>
        </tr>
      `).join('')
      : `<tr><td colspan="6" class="facebook-cuentas-tabla__vacio">Sin cuentas registradas.</td></tr>`;

    return `
      ${resumen}
      <div class="facebook-cuentas-barra">
        <button id="fb-cfg-agregar" class="facebook-cuentas-boton facebook-cuentas-boton--agregar">+ Agregar cuenta</button>
      </div>
      <div class="facebook-cuentas-tabla-wrap">
        <table class="facebook-cuentas-tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Identificador</th>
              <th class="facebook-cuentas-tabla__num">Valoración</th>
              <th class="facebook-cuentas-tabla__num">Opiniones</th>
              <th class="facebook-cuentas-tabla__centro">Mostrar</th>
              <th class="facebook-cuentas-tabla__centro">Acciones</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>`;
  }

  /** Conecta los handlers de los botones Agregar/Editar/Eliminar en la lista de cuentas. */
  private _enlazarAccionesCuentas(cuentas: IFacebookConfiguracion[]): void {
    document.getElementById('fb-cfg-agregar')?.addEventListener('click', () => {
      Swal.close();
      this._mostrarModalCuenta(null);
    });

    document.querySelectorAll<HTMLButtonElement>('[data-editar]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset['editar']);
        const existente = cuentas.find(c => c.id === id) ?? null;
        Swal.close();
        this._mostrarModalCuenta(existente);
      });
    });

    document.querySelectorAll<HTMLButtonElement>('[data-eliminar]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset['eliminar']);
        const existente = cuentas.find(c => c.id === id);
        if (!existente) return;
        this._confirmarEliminarCuenta(existente);
      });
    });
  }

  /** Abre el submodal de creación o edición de una cuenta. */
  private _mostrarModalCuenta(existente: IFacebookConfiguracion | null): void {
    const esActualizacion = !!existente?.id;
    Swal.fire({
      title: esActualizacion ? 'Editar cuenta Facebook' : 'Nueva cuenta Facebook',
      html: this._construirHtmlFormularioCuenta(existente),
      width: 640,
      showCancelButton: true,
      confirmButtonText: esActualizacion ? 'Actualizar' : 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: COLOR_CONFIRMAR,
      customClass: { popup: 'facebook-modal', htmlContainer: 'facebook-modal__cuerpo' },
      showCloseButton: true,
      allowOutsideClick: false,
      didOpen: () => this._enlazarFormularioCuenta(),
      preConfirm: () => this._extraerDatosCuenta(existente),
    }).then(result => {
      if (!result.isConfirmed || !result.value) { this.abrirConfiguraciones(); return; }
      const payload: IFacebookConfiguracion = result.value;
      const req = esActualizacion
        ? this.integraService.putJsonResponse(constApiMarketing.FacebookConfiguracionActualizar, payload)
        : this.integraService.postJsonResponse(constApiMarketing.FacebookConfiguracionInsertar, payload);
      req.subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: esActualizacion ? 'Cuenta actualizada' : 'Cuenta creada',
            confirmButtonColor: COLOR_CONFIRMAR,
          }).then(() => { this._refrescarDatos(); this.abrirConfiguraciones(); });
        },
        error: () => this.alertaService.notificationError('Error al guardar la cuenta.'),
      });
    });
  }

  /** Genera el HTML del formulario SweetAlert2 para crear o editar una cuenta. */
  private _construirHtmlFormularioCuenta(c: IFacebookConfiguracion | null): string {
    const esc = (v?: string) => (v || '').replace(/"/g, '&quot;');
    const mostrarInicial = c?.mostrar !== false;
    return `
    <div class="facebook-formulario">
      <div class="facebook-formulario__fila">
        <div class="facebook-formulario__campo facebook-formulario__campo--expandir">
          <label class="facebook-formulario__etiqueta">Nombre *</label>
          <input id="fb-cfg-nombre" class="facebook-formulario__input" value="${esc(c?.nombre)}" placeholder="Ej: BSG Institute Perú">
        </div>
        <div class="facebook-formulario__campo">
          <label class="facebook-formulario__etiqueta">Identificador página *</label>
          <input id="fb-cfg-identificador" class="facebook-formulario__input" value="${esc(c?.identificadorPagina)}" placeholder="Ej: 123456789012345">
        </div>
      </div>
      <div class="facebook-formulario__campo">
        <label class="facebook-formulario__etiqueta">Token de acceso página *</label>
        <input id="fb-cfg-token" type="password" autocomplete="off" spellcheck="false"
               class="facebook-formulario__input facebook-formulario__input--token"
               value="${esc(c?.tokenAccesoPagina)}"
               placeholder="Pegue aquí el token de acceso de la página">
        <span class="facebook-formulario__ayuda">Por seguridad, el token no se puede copiar ni visualizar.</span>
      </div>
      <div class="facebook-formulario__fila">
        <div class="facebook-formulario__campo">
          <label class="facebook-formulario__etiqueta">Valoración % (0 - 100)</label>
          <input id="fb-cfg-valoracion" type="number" step="0.01" min="0" max="100" class="facebook-formulario__input" value="${c?.valoracion ?? 0}" placeholder="Ej: 95.50">
        </div>
        <div class="facebook-formulario__campo">
          <label class="facebook-formulario__etiqueta">Total opiniones</label>
          <input id="fb-cfg-total" type="number" min="0" class="facebook-formulario__input" value="${c?.resenaTotal ?? 0}" placeholder="Ej: 250">
        </div>
        <div class="facebook-formulario__campo facebook-formulario__campo--toggle">
          <label class="facebook-formulario__etiqueta">Mostrar en sitio</label>
          <label class="facebook-cuentas-toggle facebook-cuentas-toggle--inline ${mostrarInicial ? 'facebook-cuentas-toggle--activo' : ''}" id="fb-cfg-mostrar-wrap">
            <input id="fb-cfg-mostrar" type="checkbox" ${mostrarInicial ? 'checked' : ''}>
            <span class="facebook-cuentas-toggle__slider"></span>
          </label>
        </div>
      </div>
    </div>`;
  }

  /** Conecta los listeners del formulario de cuenta (bloqueo del token y toggle mostrar). */
  private _enlazarFormularioCuenta(): void {
    // Bloqueo de copy/cut/context-menu/drag sobre el token para evitar exfiltración del valor.
    const tokenInput = document.getElementById('fb-cfg-token') as HTMLInputElement;
    const bloquear = (e: Event) => e.preventDefault();
    ['copy', 'cut', 'contextmenu', 'dragstart'].forEach(ev => tokenInput?.addEventListener(ev, bloquear));

    // Sincroniza la clase visual del toggle; SweetAlert2 aísla su DOM y `:checked +` no siempre se recalcula.
    const mostrarInput = document.getElementById('fb-cfg-mostrar')      as HTMLInputElement;
    const mostrarWrap  = document.getElementById('fb-cfg-mostrar-wrap') as HTMLLabelElement;
    mostrarInput?.addEventListener('change', () => {
      mostrarWrap?.classList.toggle('facebook-cuentas-toggle--activo', mostrarInput.checked);
    });
  }

  /** Extrae y valida los datos de la cuenta; devuelve false si la validación falla. */
  private _extraerDatosCuenta(existente: IFacebookConfiguracion | null): IFacebookConfiguracion | false {
    const val = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value?.trim() ?? '';
    const chk = (id: string) => (document.getElementById(id) as HTMLInputElement)?.checked ?? false;

    const nombre              = val('fb-cfg-nombre');
    const identificadorPagina = val('fb-cfg-identificador');
    const tokenAccesoPagina   = val('fb-cfg-token');
    if (!nombre)              { Swal.showValidationMessage('El nombre es obligatorio.'); return false; }
    if (!identificadorPagina) { Swal.showValidationMessage('El identificador de página es obligatorio.'); return false; }
    if (!tokenAccesoPagina)   { Swal.showValidationMessage('El token de acceso es obligatorio.'); return false; }

    const valoracionRaw = parseFloat(val('fb-cfg-valoracion'));
    const valoracion = isNaN(valoracionRaw) ? 0 : Math.round(valoracionRaw * 100) / 100;
    if (valoracion < 0 || valoracion > 100) { Swal.showValidationMessage('La valoración debe estar entre 0% y 100%.'); return false; }

    return {
      ...(existente?.id ? { id: existente.id } : {}),
      nombre,
      identificadorPagina,
      tokenAccesoPagina,
      valoracion,
      resenaTotal: parseInt(val('fb-cfg-total'), 10) || 0,
      mostrar:      chk('fb-cfg-mostrar'),
    };
  }

  /** Pide confirmación y ejecuta el borrado lógico de la cuenta en el backend. */
  private _confirmarEliminarCuenta(c: IFacebookConfiguracion): void {
    Swal.fire({
      title: '¿Eliminar cuenta?',
      html: `Se eliminará la cuenta <b>${c.nombre}</b>.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
    }).then(r => {
      if (!r.isConfirmed) { this.abrirConfiguraciones(); return; }
      this.integraService.deleteJsonResponse(constApiMarketing.FacebookConfiguracionEliminar + '/' + c.id)
        .subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Cuenta eliminada', confirmButtonColor: COLOR_CONFIRMAR })
              .then(() => { this._refrescarDatos(); this.abrirConfiguraciones(); });
          },
          error: () => this.alertaService.notificationError('Error al eliminar la cuenta.'),
        });
    });
  }
}
