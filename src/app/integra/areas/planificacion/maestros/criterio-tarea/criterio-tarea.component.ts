import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

export interface CriterioTarea {
  id: number;
  nombre: string;
  descripcion: string;
  escala: number;
  activo: boolean;
}

export interface SubCriterioTarea {
  id: number;
  nombre: string;
  descripcion: string;
  escala: number;
  activo: boolean;
}

@Component({
  selector: 'app-criterio-tarea',
  templateUrl: './criterio-tarea.component.html',
  styleUrls: ['./criterio-tarea.component.scss'],
})
export class CriterioTareaComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) {}

  gridCriterio = new KendoGrid<CriterioTarea>();
  enProceso = false;
  modalRef: NgbModalRef = null;
  isNew = false;
  dataItemTemp: CriterioTarea = null;

  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  formCriterio: FormGroup = this._formBuilder.group({
    nombre: [null, Validators.required],
    descripcion: [null, Validators.required],
    escala: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
  });

  // --- Gestión de subcriterios ---
  criterioSeleccionado: CriterioTarea = null;
  gridSubCriteriosAsignados = new KendoGrid<SubCriterioTarea>();
  todosLosSubCriterios: SubCriterioTarea[] = [];
  subCriterioSeleccionado: SubCriterioTarea = null;
  enProcesoSubCriterio = false;
  modalSubCriteriosRef: NgbModalRef = null;

  ngOnInit(): void {
    this.obtener();
  }

  // ===================== CRUD CRITERIO =====================

  obtener(): void {
    this.gridCriterio.loading = true;
    this._integraService
      .getJsonResponse(constApiPlanificacion.CriterioTareaListar)
      .subscribe({
        next: (resp: HttpResponse<CriterioTarea[]>) => {
          this.gridCriterio.data = resp.body;
          this.gridCriterio.loading = false;
        },
        error: (error) => {
          this.gridCriterio.loading = false;
          this._alertaService.notificationWarning(
            this._alertaService.getMessageErrorService(error)
          );
        },
      });
  }

  abrirModal(context: any, isNew: boolean, dataItem?: CriterioTarea): void {
    this.isNew = isNew;
    this.enProceso = false;
    this.formCriterio.reset();
    if (!isNew) {
      this.dataItemTemp = dataItem;
      this.formCriterio.patchValue({
        nombre: dataItem.nombre,
        descripcion: dataItem.descripcion,
        escala: dataItem.escala,
      });
    } else {
      this.dataItemTemp = null;
    }
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  guardar(): void {
    if (this.formCriterio.valid) {
      this.enProceso = true;
      const payload = {
        nombre: this.formCriterio.get('nombre').value,
        descripcion: this.formCriterio.get('descripcion').value,
        escala: this.formCriterio.get('escala').value,
      };
      this._integraService
        .postJsonResponse(
          constApiPlanificacion.CriterioTareaInsertar,
          JSON.stringify(payload)
        )
        .subscribe({
          next: () => {
            this.enProceso = false;
            this.modalRef.close();
            this.obtener();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.enProceso = false;
            this._alertaService.notificationWarning(
              this._alertaService.getMessageErrorService(error)
            );
          },
        });
    } else {
      this.formCriterio.markAllAsTouched();
      this._alertaService.mensajeIcon('Complete por favor los campos obligatorios!');
    }
  }

  actualizar(): void {
    if (this.formCriterio.valid) {
      this.enProceso = true;
      const payload = {
        id: this.dataItemTemp.id,
        nombre: this.formCriterio.get('nombre').value,
        descripcion: this.formCriterio.get('descripcion').value,
        escala: this.formCriterio.get('escala').value,
      };
      this._integraService
        .putJsonResponse(
          constApiPlanificacion.CriterioTareaActualizar,
          JSON.stringify(payload)
        )
        .subscribe({
          next: () => {
            this.enProceso = false;
            this.modalRef.close();
            this.obtener();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.enProceso = false;
            this._alertaService.notificationWarning(
              this._alertaService.getMessageErrorService(error)
            );
          },
        });
    } else {
      this.formCriterio.markAllAsTouched();
      this._alertaService.mensajeIcon('Complete por favor los campos obligatorios!');
    }
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Estás seguro de eliminar el criterio?',
      text: 'Esta acción realizará una baja lógica del registro.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.gridCriterio.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.CriterioTareaEliminar}/${id}`
          )
          .subscribe({
            next: (resp: HttpResponse<boolean>) => {
              this.gridCriterio.loading = false;
              if (resp.body === true) {
                this._alertaService.mensajeIcon(
                  '¡Eliminado!',
                  'El registro ha sido eliminado.',
                  'success'
                );
                this.obtener();
              } else {
                this._alertaService.mensajeIcon(
                  'Error!',
                  'Ocurrió un problema al eliminar.',
                  'warning'
                );
              }
            },
            error: (error) => {
              this.gridCriterio.loading = false;
              this._alertaService.notificationWarning(
                this._alertaService.getMessageErrorService(error)
              );
            },
          });
      }
    });
  }

  // ===================== GESTIÓN SUBCRITERIOS =====================

  abrirModalSubCriterios(context: any, criterio: CriterioTarea): void {
    this.criterioSeleccionado = criterio;
    this.subCriterioSeleccionado = null;
    this.enProcesoSubCriterio = false;
    this.cargarSubCriteriosAsignados();
    this.cargarTodosLosSubCriterios();
    this.modalSubCriteriosRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  cargarSubCriteriosAsignados(): void {
    this.gridSubCriteriosAsignados.loading = true;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.CriterioTareaListarSubCriteriosPorCriterio}/${this.criterioSeleccionado.id}`
      )
      .subscribe({
        next: (resp: HttpResponse<SubCriterioTarea[]>) => {
          this.gridSubCriteriosAsignados.data = resp.body ?? [];
          this.gridSubCriteriosAsignados.loading = false;
        },
        error: (error) => {
          this.gridSubCriteriosAsignados.loading = false;
          this._alertaService.notificationWarning(
            this._alertaService.getMessageErrorService(error)
          );
        },
      });
  }

  cargarTodosLosSubCriterios(): void {
    this._integraService
      .getJsonResponse(constApiPlanificacion.CriterioSubTareaListar)
      .subscribe({
        next: (resp: HttpResponse<SubCriterioTarea[]>) => {
          this.todosLosSubCriterios = resp.body ?? [];
        },
        error: (error) => {
          this._alertaService.notificationWarning(
            this._alertaService.getMessageErrorService(error)
          );
        },
      });
  }

  asignarSubCriterio(): void {
    if (!this.subCriterioSeleccionado) {
      this._alertaService.mensajeIcon('Seleccione un subcriterio para asignar.');
      return;
    }
    this.enProcesoSubCriterio = true;
    const payload = {
      idCriterio: this.criterioSeleccionado.id,
      idSubCriterio: this.subCriterioSeleccionado.id,
    };
    this._integraService
      .postJsonResponse(
        constApiPlanificacion.CriterioTareaAsignarSubCriterio,
        JSON.stringify(payload)
      )
      .subscribe({
        next: () => {
          this.enProcesoSubCriterio = false;
          this.subCriterioSeleccionado = null;
          this.cargarSubCriteriosAsignados();
          this._alertaService.mensajeExitoso();
        },
        error: (error) => {
          this.enProcesoSubCriterio = false;
          this._alertaService.notificationWarning(
            this._alertaService.getMessageErrorService(error)
          );
        },
      });
  }

  desasignarSubCriterio(idSubCriterio: number): void {
    Swal.fire({
      title: '¿Desasignar subcriterio?',
      text: 'Se eliminará la relación entre el criterio y el subcriterio.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desasignar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.gridSubCriteriosAsignados.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.CriterioTareaDesasignarSubCriterio}/${this.criterioSeleccionado.id}/${idSubCriterio}`
          )
          .subscribe({
            next: () => {
              this.cargarSubCriteriosAsignados();
              this._alertaService.mensajeIcon(
                '¡Desasignado!',
                'El subcriterio fue removido del criterio.',
                'success'
              );
            },
            error: (error) => {
              this.gridSubCriteriosAsignados.loading = false;
              this._alertaService.notificationWarning(
                this._alertaService.getMessageErrorService(error)
              );
            },
          });
      }
    });
  }
}
