import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { Parametro } from '@shared/models/parametro';
import { HttpResponse } from '@angular/common/http';
import { GridTipoEncuesta, GridSubTipoEncuesta, GridTipoSubTipoEncuesta } from './grid-tipo-subtipo-encuesta';
import Swal from 'sweetalert2';

/**
 * @module PlanificacionModule
 * @description Componente maestro de Tipo y SubTipo de Encuesta
 * @author [Tu nombre]
 * @version 1.0.0
 * @history
 * * 2026-05-28 Primera implementacion
 */

@Component({
  selector: 'app-tipo-subtipo-encuesta',
  templateUrl: './tipo-subtipo-encuesta.component.html',
  styleUrls: ['./tipo-subtipo-encuesta.component.scss'],
})
export class TipoSubTipoEncuestaComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  /* ---- Grids ---- */
  gridTipo = new GridTipoEncuesta();
  gridSubTipo = new GridSubTipoEncuesta();
  gridAsociacion = new GridTipoSubTipoEncuesta();

  /* ---- Datos ---- */
  listaTipo: any[] = [];
  listaSubTipo: any[] = [];
  listaAsociacion: any[] = [];
  comboTipoEncuesta: { id: number; nombre: string }[] = [];
  comboSubTipoEncuesta: { id: number; nombre: string }[] = [];

  /* ---- Estado UI ---- */
  loader = false;
  loaderTipo = false;
  loaderModal = false;
  loaderAsociacion = false;
  modalRef: any;
  btnModalNombre = '';
  nombreModal = '';

  /* ---- Formularios ---- */
  formTipo: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', Validators.required],
  });

  formSubTipo: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', Validators.required],
  });

  formAsociacion: FormGroup = this.formBuilder.group({
    idTipoEncuesta:    [null, Validators.required],
    idSubTipoEncuesta: [null, Validators.required],
  });

  @ViewChild('modalTipo') modalTipo: any;
  @ViewChild('modalSubTipo') modalSubTipo: any;
  @ViewChild('modalAsociacion') modalAsociacion: any;

  ngOnInit(): void {
    this.getTipos();
    this.getSubTipos();
    this.getAsociaciones();
    this.cargarComboTipo();
    this.cargarComboSubTipo();
  }

  /* ================================================================
   * CARGA DE DATOS
   * ============================================================== */
  getTipos(): void {
    this.loaderTipo = true;
    this.integraService.obtenerTodo(constApiPlanificacion.ObtenerTodoTipoEncuesta).subscribe({
      next: (response: any) => { this.listaTipo = response.body; this.loaderTipo = false; },
      error: (error) => { this.loaderTipo = false; this.mostrarError(error); },
    });
  }

  getSubTipos(): void {
    this.loader = true;
    this.integraService.obtenerTodo(constApiPlanificacion.ObtenerSubTipoEncuesta).subscribe({
      next: (response: any) => { this.listaSubTipo = response.body; this.loader = false; },
      error: (error) => { this.loader = false; this.mostrarError(error); },
    });
  }

  getAsociaciones(): void {
    this.loaderAsociacion = true;
    this.integraService.obtenerTodo(constApiPlanificacion.ObtenerTipoSubTipoEncuesta).subscribe({
      next: (response: any) => { this.listaAsociacion = response.body; this.loaderAsociacion = false; },
      error: (error) => { this.loaderAsociacion = false; this.mostrarError(error); },
    });
  }

  cargarComboTipo(): void {
    this.integraService.getJsonResponse(constApiPlanificacion.ObtenerTipoEncuesta).subscribe({
      next: (resp: HttpResponse<any[]>) => {
        if (resp.body) this.comboTipoEncuesta = resp.body.map(i => ({ id: i.id, nombre: i.nombre }));
      },
      error: (e) => console.error(e),
    });
  }

  cargarComboSubTipo(): void {
    this.integraService.getJsonResponse(constApiPlanificacion.ObtenerComboSubTipoEncuesta).subscribe({
      next: (resp: HttpResponse<any[]>) => {
        if (resp.body) this.comboSubTipoEncuesta = resp.body.map(i => ({ id: i.id, nombre: i.nombre }));
      },
      error: (e) => console.error(e),
    });
  }

  /* ================================================================
   * CRUD TIPO ENCUESTA
   * ============================================================== */
  openModalTipo(isNew: boolean, data?: any): void {
    if (isNew) {
      this.nombreModal = 'Nuevo Tipo Encuesta';
      this.btnModalNombre = 'Nuevo';
      this.formTipo.reset({ id: 0 });
    } else {
      this.nombreModal = 'Editar Tipo Encuesta';
      this.btnModalNombre = 'Actualizar';
      this.formTipo.patchValue(data);
    }
    this.modalRef = this.modalService.open(this.modalTipo);
  }

  actionModalTipo(): void {
    if (this.btnModalNombre === 'Nuevo') this.insertTipo();
    else this.updateTipo();
  }

  insertTipo(): void {
    if (this.formTipo.invalid) { this.formTipo.markAllAsTouched(); return; }
    this.loaderModal = true;
    const payload = {
      nombre:  this.formTipo.value.nombre,
      usuario: this.userService.userData.userName,
    };
    this.integraService.insertar(constApiPlanificacion.InsertarTipoEncuesta, payload).subscribe({
      next: () => { this.getTipos(); this.cargarComboTipo(); },
      error: (e) => { this.mostrarError(e); this.loaderModal = false; },
      complete: () => { this.loaderModal = false; this.modalService.dismissAll(); this.mostrarExito(); },
    });
  }

  updateTipo(): void {
    if (this.formTipo.invalid) { this.formTipo.markAllAsTouched(); return; }
    this.loaderModal = true;
    const payload = {
      id:      this.formTipo.value.id,
      nombre:  this.formTipo.value.nombre,
      usuario: this.userService.userData.userName,
    };
    this.integraService.actualizar(constApiPlanificacion.ActualizarTipoEncuesta, payload).subscribe({
      next: () => { this.getTipos(); this.cargarComboTipo(); },
      error: (e) => { this.mostrarError(e); this.loaderModal = false; },
      complete: () => { this.loaderModal = false; this.modalService.dismissAll(); this.mostrarExito(); },
    });
  }

  msgEliminarTipo(dataItem: any, index: number): void {
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.ContarAsociacionesPorTipo}/${dataItem.id}`)
      .subscribe({
        next: (resp: any) => {
          const count: number = resp.body ?? 0;
          const asociacionesMsg = count > 0
            ? `<br><br><span class="text-danger fw-bold">⚠️ También se desactivarán <u>${count} asociación${count > 1 ? 'es' : ''}</u> vinculada${count > 1 ? 's' : ''} a este tipo.</span>`
            : `<br><br><span class="text-muted">Este tipo no tiene asociaciones activas.</span>`;

          Swal.fire({
            title: `¿Eliminar "${dataItem.nombre}"?`,
            html: `Esta acción desactivará el tipo de encuesta.${asociacionesMsg}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
          }).then((result) => { if (result.isConfirmed) this.deleteTipo(dataItem, index); });
        },
        error: () => {
          Swal.fire({
            title: `¿Eliminar "${dataItem.nombre}"?`,
            text: 'Esta acción desactivará el tipo de encuesta y sus asociaciones.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
          }).then((result) => { if (result.isConfirmed) this.deleteTipo(dataItem, index); });
        },
      });
  }

  deleteTipo(dataItem: any, index: number): void {
    this.loaderTipo = true;
    const params: Parametro[] = [
      { clave: 'id',      valor: dataItem.id },
      { clave: 'usuario', valor: this.userService.userData.userName },
    ];
    this.integraService.eliminarPorPathParams(constApiPlanificacion.EliminarTipoEncuesta, params).subscribe({
      next: (response: any) => {
        if (response.body === true) {
          this.listaTipo.splice(index, 1);
          this.cargarComboTipo();
          this.getAsociaciones();
          Swal.fire('Eliminado', 'El registro fue desactivado.', 'success');
        } else {
          Swal.fire('Error', 'No se pudo eliminar.', 'warning');
        }
        this.loaderTipo = false;
      },
      error: (e) => { this.loaderTipo = false; this.mostrarError(e); },
    });
  }

  gridEventsTipo(e: any): void {
    switch (e.action) {
      case 'add':    this.openModalTipo(true); break;
      case 'edit':   this.openModalTipo(false, e.dataItem); break;
      case 'remove': this.msgEliminarTipo(e.dataItem, e.index); break;
      case 'reload': this.getTipos(); break;
    }
  }

  /* ================================================================
   * CRUD SUBTIPO
   * ============================================================== */
  openModalSubTipo(isNew: boolean, data?: any): void {
    if (isNew) {
      this.nombreModal = 'Nuevo SubTipo Encuesta';
      this.btnModalNombre = 'Nuevo';
      this.formSubTipo.reset({ id: 0 });
    } else {
      this.nombreModal = 'Editar SubTipo Encuesta';
      this.btnModalNombre = 'Actualizar';
      this.formSubTipo.patchValue(data);
    }
    this.modalRef = this.modalService.open(this.modalSubTipo);
  }

  actionModalSubTipo(): void {
    if (this.btnModalNombre === 'Nuevo') this.insertSubTipo();
    else this.updateSubTipo();
  }

  insertSubTipo(): void {
    if (this.formSubTipo.invalid) { this.formSubTipo.markAllAsTouched(); return; }
    this.loaderModal = true;
    const payload = {
      nombre:  this.formSubTipo.value.nombre,
      usuario: this.userService.userData.userName,
    };
    this.integraService.insertar(constApiPlanificacion.InsertarSubTipoEncuesta, payload).subscribe({
      next: () => { this.getSubTipos(); this.cargarComboSubTipo(); },
      error: (e) => { this.mostrarError(e); this.loaderModal = false; },
      complete: () => { this.loaderModal = false; this.modalService.dismissAll(); this.mostrarExito(); },
    });
  }

  updateSubTipo(): void {
    if (this.formSubTipo.invalid) { this.formSubTipo.markAllAsTouched(); return; }
    this.loaderModal = true;
    const payload = {
      id:      this.formSubTipo.value.id,
      nombre:  this.formSubTipo.value.nombre,
      usuario: this.userService.userData.userName,
    };
    this.integraService.actualizar(constApiPlanificacion.ActualizarSubTipoEncuesta, payload).subscribe({
      next: () => { this.getSubTipos(); this.cargarComboSubTipo(); },
      error: (e) => { this.mostrarError(e); this.loaderModal = false; },
      complete: () => { this.loaderModal = false; this.modalService.dismissAll(); this.mostrarExito(); },
    });
  }

  msgEliminarSubTipo(dataItem: any, index: number): void {
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.ContarAsociacionesPorSubTipo}/${dataItem.id}`)
      .subscribe({
        next: (resp: any) => {
          const count: number = resp.body ?? 0;
          const asociacionesMsg = count > 0
            ? `<br><br><span class="text-danger fw-bold">⚠️ También se desactivarán <u>${count} asociación${count > 1 ? 'es' : ''}</u> vinculada${count > 1 ? 's' : ''} a este subtipo.</span>`
            : `<br><br><span class="text-muted">Este subtipo no tiene asociaciones activas.</span>`;

          Swal.fire({
            title: `¿Eliminar "${dataItem.nombre}"?`,
            html: `Esta acción desactivará el subtipo de encuesta.${asociacionesMsg}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
          }).then((result) => { if (result.isConfirmed) this.deleteSubTipo(dataItem, index); });
        },
        error: () => {
          Swal.fire({
            title: `¿Eliminar "${dataItem.nombre}"?`,
            text: 'Esta acción desactivará el subtipo de encuesta y sus asociaciones.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
          }).then((result) => { if (result.isConfirmed) this.deleteSubTipo(dataItem, index); });
        },
      });
  }

  deleteSubTipo(dataItem: any, index: number): void {
    this.loader = true;
    const params: Parametro[] = [
      { clave: 'id',      valor: dataItem.id },
      { clave: 'usuario', valor: this.userService.userData.userName },
    ];
    this.integraService.eliminarPorPathParams(constApiPlanificacion.EliminarSubTipoEncuesta, params).subscribe({
      next: (response: any) => {
        if (response.body === true) {
          this.listaSubTipo.splice(index, 1);
          this.cargarComboSubTipo();
          this.getAsociaciones();
          Swal.fire('Eliminado', 'El registro fue desactivado.', 'success');
        } else {
          Swal.fire('Error', 'No se pudo eliminar.', 'warning');
        }
        this.loader = false;
      },
      error: (e) => { this.loader = false; this.mostrarError(e); },
    });
  }

  gridEventsSubTipo(e: any): void {
    switch (e.action) {
      case 'add':    this.openModalSubTipo(true); break;
      case 'edit':   this.openModalSubTipo(false, e.dataItem); break;
      case 'remove': this.msgEliminarSubTipo(e.dataItem, e.index); break;
      case 'reload': this.getSubTipos(); break;
    }
  }

  /* ================================================================
   * ASOCIACIONES TIPO-SUBTIPO
   * ============================================================== */
  openModalAsociacion(): void {
    this.formAsociacion.reset();
    this.modalRef = this.modalService.open(this.modalAsociacion);
  }

  insertAsociacion(): void {
    if (this.formAsociacion.invalid) { this.formAsociacion.markAllAsTouched(); return; }
    this.loaderModal = true;
    const payload = {
      idTipoEncuesta:    this.formAsociacion.value.idTipoEncuesta,
      idSubTipoEncuesta: this.formAsociacion.value.idSubTipoEncuesta,
      usuario:           this.userService.userData.userName,
    };
    this.integraService.insertar(constApiPlanificacion.InsertarTipoSubTipoEncuesta, payload).subscribe({
      next: () => { this.getAsociaciones(); },
      error: (e) => {
        this.loaderModal = false;
        const msg = e.error ?? e.message ?? 'Error al asociar';
        Swal.fire('Error', msg, 'error');
      },
      complete: () => { this.loaderModal = false; this.modalService.dismissAll(); this.mostrarExito(); },
    });
  }

  msgEliminarAsociacion(dataItem: any, index: number): void {
    Swal.fire({
      title: '¿Quitar asociación?',
      text: `¿Desactivar "${dataItem.nombreTipoEncuesta} → ${dataItem.nombreSubTipoEncuesta}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar',
    }).then((result) => { if (result.isConfirmed) this.deleteAsociacion(dataItem, index); });
  }

  deleteAsociacion(dataItem: any, index: number): void {
    this.loaderAsociacion = true;
    const params: Parametro[] = [
      { clave: 'id',      valor: dataItem.id },
      { clave: 'usuario', valor: this.userService.userData.userName },
    ];
    this.integraService.eliminarPorPathParams(constApiPlanificacion.EliminarTipoSubTipoEncuesta, params).subscribe({
      next: (response: any) => {
        if (response.body === true) {
          this.listaAsociacion.splice(index, 1);
          Swal.fire('Eliminado', 'La asociación fue desactivada.', 'success');
        } else {
          Swal.fire('Error', 'No se pudo eliminar.', 'warning');
        }
        this.loaderAsociacion = false;
      },
      error: (e) => { this.loaderAsociacion = false; this.mostrarError(e); },
    });
  }

  gridEventsAsociacion(e: any): void {
    switch (e.action) {
      case 'remove': this.msgEliminarAsociacion(e.dataItem, e.index); break;
      case 'reload': this.getAsociaciones(); break;
    }
  }

  /* ================================================================
   * HELPERS
   * ============================================================== */
  mostrarError(error: any): void {
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error ?? ''}</p>
             <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false,
    });
  }

  mostrarExito(): void {
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: { container: 'position-absolute' },
      position: 'top-right',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({ icon: 'success', title: 'Guardado con éxito' });
  }
}
