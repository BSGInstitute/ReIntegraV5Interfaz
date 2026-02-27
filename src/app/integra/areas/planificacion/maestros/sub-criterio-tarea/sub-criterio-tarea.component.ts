import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import Swal from 'sweetalert2';

export interface CriterioSubTarea {
  id: number;
  nombre: string;
  descripcion: string;
  escala: number;
  activo: boolean;
}

@Component({
  selector: 'app-sub-criterio-tarea',
  templateUrl: './sub-criterio-tarea.component.html',
  styleUrls: ['./sub-criterio-tarea.component.scss'],
})
export class SubCriterioTareaComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) {}

  gridCriterioTarea = new KendoGrid<CriterioSubTarea>();
  enProcesoSolicitud: boolean = false;
  modalRef: NgbModalRef = null;
  isNew: boolean = false;
  dataItemTemp: CriterioSubTarea;

  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  formCriterioTarea: FormGroup = this._formBuilder.group({
    nombre: [null, Validators.required],
    descripcion: [null, Validators.required],
    escala: [null, [Validators.required, Validators.min(1), Validators.max(10)]],
  });

  ngOnInit(): void {
    this.obtener();
  }

  obtener(): void {
    this.gridCriterioTarea.loading = true;
    this._integraService
      .getJsonResponse(constApiPlanificacion.CriterioSubTareaListar)
      .subscribe({
        next: (resp: HttpResponse<CriterioSubTarea[]>) => {
          this.gridCriterioTarea.data = resp.body;
          this.gridCriterioTarea.loading = false;
        },
        error: (error) => {
          this.gridCriterioTarea.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  abrirModal(context: any, isNew: boolean, dataItem?: CriterioSubTarea): void {
    this.isNew = isNew;
    this.formCriterioTarea.reset();
    this.enProcesoSolicitud = false;
    if (!isNew) {
      this.dataItemTemp = dataItem;
      this.asignarValoresToForm(dataItem);
    } else {
      this.dataItemTemp = null;
    }
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  asignarValoresToForm(dataItem: CriterioSubTarea): void {
    this.formCriterioTarea.patchValue({
      nombre: dataItem.nombre,
      descripcion: dataItem.descripcion,
      escala: dataItem.escala,
    });
  }

  guardar(): void {
    if (this.formCriterioTarea.valid) {
      this.enProcesoSolicitud = true;
      const payload = {
        nombre: this.formCriterioTarea.get('nombre').value,
        descripcion: this.formCriterioTarea.get('descripcion').value,
        escala: this.formCriterioTarea.get('escala').value,
      };
      this._integraService
        .postJsonResponse(
          constApiPlanificacion.CriterioSubTareaInsertar,
          JSON.stringify(payload)
        )
        .subscribe({
          next: (resp: HttpResponse<boolean>) => {
            this.enProcesoSolicitud = false;
            this.modalRef.close();
            this.obtener();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.enProcesoSolicitud = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formCriterioTarea.markAllAsTouched();
      this._alertaService.mensajeIcon('Complete por favor los campos obligatorios!');
    }
  }

  actualizar(): void {
    if (this.formCriterioTarea.valid) {
      this.enProcesoSolicitud = true;
      const payload = {
        id: this.dataItemTemp.id,
        nombre: this.formCriterioTarea.get('nombre').value,
        descripcion: this.formCriterioTarea.get('descripcion').value,
        escala: this.formCriterioTarea.get('escala').value,
      };
      this._integraService
        .putJsonResponse(
          constApiPlanificacion.CriterioSubTareaActualizar,
          JSON.stringify(payload)
        )
        .subscribe({
          next: (resp: HttpResponse<boolean>) => {
            this.enProcesoSolicitud = false;
            this.modalRef.close();
            this.obtener();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.enProcesoSolicitud = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formCriterioTarea.markAllAsTouched();
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
        this.gridCriterioTarea.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.CriterioSubTareaEliminar}/${id}`
          )
          .subscribe({
            next: (resp: HttpResponse<boolean>) => {
              this.gridCriterioTarea.loading = false;
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
              this.gridCriterioTarea.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }
}
