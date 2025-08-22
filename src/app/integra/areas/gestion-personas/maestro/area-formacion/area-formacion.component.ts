import { Component, OnDestroy, OnInit } from '@angular/core';
import { constApiGestionPersonal } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { FormService } from '@shared/services/form.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
interface AreaFormacion {
  id: number;
  nombre: string;
}

/**
 * @module AreaFormacionModule
 * @description Componente de Area Formacion
 * @author Marco Jose Villanueva Torres
 * @version 1.0.0
 * @history
   15/01/2024 Implementacion del modulo de Area Formacion
 */
@Component({
  selector: 'app-area-formacion',
  templateUrl: './area-formacion.component.html',
  styleUrls: ['./area-formacion.component.scss'],
})
export class AreaFormacionComponent implements OnInit, OnDestroy {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private formService: FormService
  ) {}

  formAreaFormacion: FormGroup = this._formBuilder.group({
    nombre: [null, Validators.required],
  });

  subscriptions: Subscription = new Subscription();
  isNew: boolean = false;
  gridAreaFormacion: KendoGrid = new KendoGrid();
  enProcesoSolicitud: boolean = false;
  modalRef: NgbModalRef = null;
  dataItemTemp: AreaFormacion;

  ngOnInit(): void {
    this.obtener();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  obtener() {
    this.gridAreaFormacion.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.AreaFormacionObtener)
      .subscribe({
        next: (resp: HttpResponse<AreaFormacion[]>) => {
          this.gridAreaFormacion.data = resp.body;
          this.gridAreaFormacion.loading = false;
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridAreaFormacion.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  asignarValoresToForm(dataItem: AreaFormacion) {
    this.formAreaFormacion.get('nombre').setValue(dataItem.nombre);
  }
  /* ---------------- Abrir Modal--------------------- */

  abrirModal(context: any, dataItem?: AreaFormacion) {
    this.isNew = false;
    this.formAreaFormacion.reset();
    this.enProcesoSolicitud = false;
    if (dataItem != null) {
      this.dataItemTemp = dataItem;

      this.asignarValoresToForm(dataItem);
    } else {
      this.dataItemTemp = null;
      this.isNew = true;
    }
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  get AreaFormacionForm(): {
    nombre: string;
    descripcion: string;
    codigo: string;
  } {
    return this.formAreaFormacion.getRawValue() as {
      nombre: string;
      descripcion: string;
      codigo: string;
    };
  }

  procesarAreaFormacion(): AreaFormacion {
    let PerAreaFormacion: AreaFormacion = {
      id: this.isNew ? 0 : this.dataItemTemp.id,
      nombre: this.AreaFormacionForm.nombre,
    };
    return PerAreaFormacion;
  }

  /* ---------------Guardar Nuevo Categoria Pregunta ------------------------*/
  guardar() {
    console.log(this.formAreaFormacion.value);
    if (this.formAreaFormacion.valid) {
      let jsonEnvio = this.procesarAreaFormacion();
      this.gridAreaFormacion.loading = true;

      this.enProcesoSolicitud = true;
      this._integraService
        .postJsonResponse(
          constApiGestionPersonal.AreaFormacionInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<AreaFormacion>) => {
            this.gridAreaFormacion.loading = false;

            this.enProcesoSolicitud = false;
            this.gridAreaFormacion.data.unshift(resp.body);
            this.gridAreaFormacion.loadData();
            this.obtener();
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.gridAreaFormacion.loading = false;
            this.enProcesoSolicitud = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Dato',
            });
          },
        });
    } else {
      this.formAreaFormacion.markAllAsTouched();
      this.gridAreaFormacion.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }

  /* -----------------------------------Actualizar ------------------------- */

  // Metodo se encarga de Actualizar la data de las tablas
  actualizar() {
    if (this.formAreaFormacion.valid) {
      this.enProcesoSolicitud = true;

      const materialAccion = this.procesarAreaFormacion();

      this.gridAreaFormacion.loading = true;

      this._integraService
        .putJsonResponse(
          constApiGestionPersonal.AreaFormacionActualizar,
          JSON.stringify(materialAccion)
        )
        .subscribe({
          next: (resp: HttpResponse<AreaFormacion>) => {
            /*  this.dataItemTemp.estado = resp.body.estado; */
            this.gridAreaFormacion.loading = false;
            this.modalRef.close();
            this.obtener();
            this.gridAreaFormacion.loadData();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            console.log(error);
            this.gridAreaFormacion.loading = false;
            this.enProcesoSolicitud = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formAreaFormacion.markAllAsTouched();
      this.gridAreaFormacion.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }


  
  /* ------------------------------Eliminar ----------------------------------------- */
  
  eliminar(id: number) {
    this.enProcesoSolicitud = true;
    Swal.fire({
      title: '¿Estás seguro de eliminar el Registro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let index = this.gridAreaFormacion.data.findIndex(
          (x) => x.id === id
        );
        if (index != -1) {
        }
        this.gridAreaFormacion.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiGestionPersonal.AreaFormacionEliminar}/${id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.gridAreaFormacion.loading = false;
              if (response.body === true) {
                this.gridAreaFormacion.data.splice(index, 1);
                this.gridAreaFormacion.loadView();
                this._alertaService.mensajeIcon(
                  '¡Eliminado!',
                  'El registro ha sido eliminado.',
                  'success'
                );
                this.obtener();
                this.enProcesoSolicitud = false;
              } else {
                this._alertaService.mensajeIcon(
                  'Error!',
                  'Ocurrió un problema al eliminar.',
                  'warning'
                );
              }
            },
            error: (error) => {
              console.log(error);
              this.gridAreaFormacion.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }
  
}
