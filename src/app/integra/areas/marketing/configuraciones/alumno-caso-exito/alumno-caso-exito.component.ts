/**
 * @module MarketingModule
 * @description CRUD de Alumnos Casos de Éxito para el Portal Web. Gestión de tarjetas
 *              con foto de perfil, testimonio, país y control de visibilidad/posición.
 * @author Miguel Valdivia
 * @version 1.0.0
 * @history
 * * 27/05/2026 Implementación inicial
*/

import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { MessageService } from '@progress/kendo-angular-l10n';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { constApiMarketing, constApiGlobal } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import {
  IAlumnoCasoExito,
  IPaisComboAce,
} from '@marketing/models/interfaces/alumno-caso-exito';
import { KendoGridMessagesEs } from '@shared/services/kendo-grid-messages-es.service';
import Swal from 'sweetalert2';

const COLOR_CONFIRMAR = '#094D82';

@Component({
  selector: 'app-alumno-caso-exito',
  templateUrl: './alumno-caso-exito.component.html',
  styleUrls: ['./alumno-caso-exito.component.scss'],
  providers: [{ provide: MessageService, useClass: KendoGridMessagesEs }],
})
export class AlumnoCasoExitoComponent implements OnInit {

  @ViewChild('grid', { static: false }) grid: any;

  casos: IAlumnoCasoExito[] = [];
  paisesCombo: IPaisComboAce[] = [];

  kpiTotal = 0;
  kpiVisibles = 0;

  metricasVisibles = true;
  cargandoGrilla = true;
  procesandoVisibilidad = false;
  modoReordenar = false;
  casosOrdenables: IAlumnoCasoExito[] = [];

  pagerConfig: any = { buttonCount: 5, pageSizes: [20, 50, 'All'] };

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
    this.consultarCasos();
  }

  /** Carga el combo de países para el formulario. */
  cargarPaisesCombo(): void {
    this.integraService.getJsonResponse(constApiGlobal.PaisObtenerCombo)
      .subscribe({
        next: (r: HttpResponse<any>) => { this.paisesCombo = r.body ?? []; },
        error: () => {},
      });
  }

  /** Consulta todos los casos de éxito ordenados por posición. */
  consultarCasos(): void {
    this.cargandoGrilla = true;
    this.integraService.getJsonResponse(constApiMarketing.AlumnoCasoExitoObtener)
      .subscribe({
        next: (r: HttpResponse<any>) => {
          this.casos = Array.isArray(r.body) ? r.body : (r.body?.data ?? []);
          this._actualizarKPIs(this.casos);
          this.cargandoGrilla = false;
          this._resetearGrilla();
        },
        error: () => {
          this.alertaService.notificationError('Error al obtener los casos de éxito.');
          this.cargandoGrilla = false;
        },
      });
  }

  /** Calcula los KPIs de total y visibles. */
  private _actualizarKPIs(datos: IAlumnoCasoExito[]): void {
    this.kpiTotal    = datos.length;
    this.kpiVisibles = datos.filter(t => t.estadoVisibilidad).length;
  }

  /** Abre el modal de creación de un caso de éxito. */
  nuevoCaso(): void {
    Swal.fire({
      title: 'Nuevo Caso de Éxito',
      html: this._construirHtmlFormulario(),
      width: 680,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: COLOR_CONFIRMAR,
      customClass: { popup: 'ace-modal', htmlContainer: 'ace-modal__cuerpo' },
      showCloseButton: true,
      allowOutsideClick: false,
      preConfirm: () => this._extraerFormData(),
    }).then(result => {
      if (!result.isConfirmed || !result.value) return;
      const fd: FormData = result.value;
      this.integraService.postFormDataResponse(constApiMarketing.AlumnoCasoExitoInsertarConArchivo, fd)
        .subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Caso de éxito creado', confirmButtonColor: COLOR_CONFIRMAR });
            this._refrescarDatos();
          },
          error: () => this.alertaService.notificationError('Error al crear el caso de éxito.'),
        });
    });
  }

  /** Abre el modal de edición de un caso de éxito existente. */
  editarCaso(t: IAlumnoCasoExito): void {
    Swal.fire({
      title: 'Editar Caso de Éxito',
      html: this._construirHtmlFormulario(t),
      width: 680,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: COLOR_CONFIRMAR,
      customClass: { popup: 'ace-modal', htmlContainer: 'ace-modal__cuerpo' },
      showCloseButton: true,
      allowOutsideClick: false,
      preConfirm: () => this._extraerFormData(t),
    }).then(result => {
      if (!result.isConfirmed || !result.value) return;
      const fd: FormData = result.value;
      this.integraService.putFormDataResponse(constApiMarketing.AlumnoCasoExitoActualizarConArchivo, fd)
        .subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Caso de éxito actualizado', confirmButtonColor: COLOR_CONFIRMAR });
            this._refrescarDatos();
          },
          error: () => this.alertaService.notificationError('Error al actualizar el caso de éxito.'),
        });
    });
  }

  /** Elimina un caso de éxito con confirmación previa. */
  eliminarCaso(t: IAlumnoCasoExito): void {
    Swal.fire({
      title: '¿Eliminar caso de éxito?',
      html: `Se eliminará el registro de <b>${t.nombreAlumno}</b> permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
    }).then(r => {
      if (!r.isConfirmed) return;
      this.integraService.deleteJsonResponse(constApiMarketing.AlumnoCasoExitoEliminar + '/' + t.id)
        .subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Eliminado', confirmButtonColor: COLOR_CONFIRMAR });
            this._refrescarDatos();
          },
          error: () => this.alertaService.notificationError('Error al eliminar.'),
        });
    });
  }

  /** Alterna la visibilidad de un caso de éxito en el portal web. */
  toggleVisibilidad(t: IAlumnoCasoExito): void {
    if (this.procesandoVisibilidad) return;
    this.procesandoVisibilidad = true;
    const payload = { id: t.id, estadoVisibilidad: !t.estadoVisibilidad };
    this.integraService.putJsonResponse(constApiMarketing.AlumnoCasoExitoActualizarVisibilidad, payload)
      .subscribe({
        next: () => {
          this.procesandoVisibilidad = false;
          this._refrescarDatos();
        },
        error: () => {
          this.procesandoVisibilidad = false;
          this.alertaService.notificationError('Error al cambiar la visibilidad.');
        },
      });
  }

  /** Activa el modo de reordenamiento y copia los casos para drag-drop. */
  toggleModoReordenar(): void {
    this.modoReordenar = !this.modoReordenar;
    if (this.modoReordenar) {
      this.casosOrdenables = [...this.casos];
    }
  }

  /** Maneja el evento de soltar un elemento en el drag-drop. */
  dropCaso(event: CdkDragDrop<IAlumnoCasoExito[]>): void {
    moveItemInArray(this.casosOrdenables, event.previousIndex, event.currentIndex);
  }

  /** Guarda el nuevo orden de posiciones en el backend. */
  guardarOrden(): void {
    const posiciones = this.casosOrdenables.map((c, i) => ({ id: c.id, posicion: i + 1 }));
    this.integraService.putJsonResponse(constApiMarketing.AlumnoCasoExitoActualizarPosiciones, posiciones)
      .subscribe({
        next: () => {
          Swal.fire({ icon: 'success', title: 'Orden guardado', confirmButtonColor: COLOR_CONFIRMAR });
          this.modoReordenar = false;
          this.consultarCasos();
        },
        error: () => this.alertaService.notificationError('Error al guardar el orden.'),
      });
  }

  /** Cancela el modo de reordenamiento sin guardar. */
  cancelarReorden(): void {
    this.modoReordenar = false;
  }

  /** Genera el HTML del formulario SweetAlert2 para crear o editar un caso de éxito. */
  private _construirHtmlFormulario(t?: IAlumnoCasoExito): string {
    const esc    = (v?: string | null) => (v || '').replace(/"/g, '&quot;');
    const escTxt = (v?: string | null) => (v || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const paisOpts = this.paisesCombo
      .map(p => `<option value="${p.id}" ${t?.idPais === p.id ? 'selected' : ''}>${p.nombre}</option>`)
      .join('');

    const fotoSection = t?.urlFotoPerfil
      ? `<div class="ace-formulario__campo">
           <label class="ace-formulario__etiqueta">Foto actual</label>
           <img src="${esc(t.urlFotoPerfil)}" alt="Foto de perfil" class="ace-formulario__preview">
         </div>
         <div class="ace-formulario__campo">
           <label class="ace-formulario__etiqueta">Cambiar foto (opcional — PNG, JPG, GIF, WEBP)</label>
           <input id="swal-foto" type="file" accept="image/png,image/jpeg,image/gif,image/webp" class="ace-formulario__input">
         </div>`
      : `<div class="ace-formulario__campo">
           <label class="ace-formulario__etiqueta">Foto de perfil (opcional — PNG, JPG, GIF, WEBP)</label>
           <input id="swal-foto" type="file" accept="image/png,image/jpeg,image/gif,image/webp" class="ace-formulario__input">
         </div>`;

    return `
    <div class="ace-formulario">
      <div class="ace-formulario__fila">
        <div class="ace-formulario__campo">
          <label class="ace-formulario__etiqueta">Nombre del alumno *</label>
          <input id="swal-nombre-alumno" class="ace-formulario__input" value="${esc(t?.nombreAlumno)}" placeholder="Ej: Juan Pérez">
        </div>
        <div class="ace-formulario__campo">
          <label class="ace-formulario__etiqueta">Nombre del programa *</label>
          <input id="swal-nombre-programa" class="ace-formulario__input" value="${esc(t?.nombrePrograma)}" placeholder="Ej: MBA Ejecutivo">
        </div>
      </div>
      <div class="ace-formulario__campo">
        <label class="ace-formulario__etiqueta">Testimonio</label>
        <textarea id="swal-testimonio" class="ace-formulario__textarea" placeholder="Comparte la experiencia del alumno...">${escTxt(t?.testimonio)}</textarea>
      </div>
      <div class="ace-formulario__fila">
        <div class="ace-formulario__campo">
          <label class="ace-formulario__etiqueta">País</label>
          <select id="swal-pais" class="ace-formulario__select">
            <option value="">— Seleccionar país —</option>
            ${paisOpts}
          </select>
        </div>
        <div class="ace-formulario__campo" style="display:flex;align-items:center;gap:8px;padding-top:20px;">
          <input id="swal-visibilidad" type="checkbox" ${t?.estadoVisibilidad ? 'checked' : ''} style="width:16px;height:16px;cursor:pointer;accent-color:#094D82;">
          <label for="swal-visibilidad" class="ace-formulario__etiqueta" style="cursor:pointer;text-transform:none;font-size:13px;">Visible en el portal web</label>
        </div>
      </div>
      ${fotoSection}
    </div>`;
  }

  /** Extrae y valida los datos del formulario Swal; devuelve FormData o false. */
  private _extraerFormData(t?: IAlumnoCasoExito): FormData | false {
    const val = (id: string) => (document.getElementById(id) as HTMLInputElement)?.value?.trim() ?? '';

    const nombreAlumno   = val('swal-nombre-alumno');
    const nombrePrograma = val('swal-nombre-programa');
    const testimonio     = val('swal-testimonio');
    const idPais         = (document.getElementById('swal-pais') as HTMLSelectElement)?.value ?? '';
    const estadoVisibilidad = (document.getElementById('swal-visibilidad') as HTMLInputElement)?.checked ?? false;

    if (!nombreAlumno) {
      Swal.showValidationMessage('El nombre del alumno es obligatorio.');
      return false;
    }
    if (!nombrePrograma) {
      Swal.showValidationMessage('El nombre del programa es obligatorio.');
      return false;
    }

    const archivoInput = document.getElementById('swal-foto') as HTMLInputElement;
    const archivo = archivoInput?.files?.[0];
    if (archivo) {
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!tiposPermitidos.includes(archivo.type)) {
        Swal.showValidationMessage('Solo se permiten imágenes PNG, JPG, GIF o WEBP.');
        return false;
      }
    }

    const fd = new FormData();
    fd.append('Id', t ? String(t.id) : '0');
    fd.append('NombreAlumno', nombreAlumno);
    fd.append('NombrePrograma', nombrePrograma);
    fd.append('Testimonio', testimonio || '');
    fd.append('IdPais', idPais || '0');
    fd.append('Posicion', t ? String(t.posicion) : String(this.casos.length + 1));
    fd.append('EstadoVisibilidad', estadoVisibilidad ? 'true' : 'false');
    if (archivo) fd.append('ArchivoFotoPerfil', archivo);
    return fd;
  }

  /** Reinicia paginación y filtros de la grilla Kendo. */
  private _resetearGrilla(): void {
    if (!this.grid) return;
    this.grid.skip = 0;
    this.grid.pageSize = 20;
    this.grid.filter = { filters: [], logic: 'and' };
    this.grid.sort = [];
  }

  /** Recarga los datos tras operaciones CRUD. */
  private _refrescarDatos(): void {
    this.consultarCasos();
  }
}
