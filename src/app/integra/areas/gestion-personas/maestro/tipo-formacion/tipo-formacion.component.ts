import { TipoFormacion } from './../../models/tipoFormacion';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { constApiGestionPersonal } from '@environments/constApi';
import Swal from 'sweetalert2';
import { PageSizeItem } from '@progress/kendo-angular-grid';
interface formTipoFormacion {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-tipo-formacion',
  templateUrl: './tipo-formacion.component.html',
  styleUrls: ['./tipo-formacion.component.scss'],
})
export class TipoFormacionComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) {}

  gridTipoFormacion: KendoGrid = new KendoGrid();
  enProcesoSolicitud: boolean = false;
  modalRef: NgbModalRef = null;
  isNew: boolean = false;
  dataItemTemp: TipoFormacion;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  formTipoFormacion: FormGroup = this._formBuilder.group({
    nombre: [null, Validators.required],
  });

  ngOnInit(): void {
    this.obtener();
    this.configurarGrid();
  }

  obtener() {
    this.gridTipoFormacion.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerTipoFormacion)
      .subscribe({
        next: (resp: HttpResponse<TipoFormacion[]>) => {
          this.gridTipoFormacion.data = resp.body;
          this.gridTipoFormacion.loading = false;
        },
        error: (error) => {
          this.gridTipoFormacion.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  /* ---------------- Abrir Modal--------------------- */

  abrirModal(context: any, isNew: boolean, dataItem?: TipoFormacion) {
    this.isNew = isNew;
    this.formTipoFormacion.reset();
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
  /*   ------------------------------------------------------------------- */
  get TipoFormacionForm(): formTipoFormacion {
    return this.formTipoFormacion.getRawValue() as formTipoFormacion;
  }
  /* ---------------------------Asignar Vaalores  ------------------------------------*/
  asignarValoresToForm(dataItem: TipoFormacion) {
    this.formTipoFormacion.get('nombre').setValue(dataItem.nombre);
  }
  /*   ------------------------------------------------------------------- */

  /* --------------------------------Procesar Categoria Pregunta ------------------------------ */

  procesarTipoFormacion(): TipoFormacion {
    let tipoFormacionD: TipoFormacion = {
      id: this.isNew ? 0 : this.dataItemTemp.id,
      nombre: this.TipoFormacionForm.nombre,
    };
    return tipoFormacionD;
  }
  /* -------------------------------------------------------------------------------- */
  configurarGrid() {
    this.gridTipoFormacion.habilitarEstadoNewRow = true;
  }

/* ---------------Guardar Nuevo Categoria Pregunta ------------------------*/
  guardar() {
    console.log(this.formTipoFormacion.value);
    if (this.formTipoFormacion.valid) {
      let jsonEnvio = this.procesarTipoFormacion();
      this.gridTipoFormacion.loading = true;

      this.enProcesoSolicitud = true;
      this._integraService
        .postJsonResponse(
          constApiGestionPersonal.InsertarTipoFormacion,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<TipoFormacion>) => {
            this.gridTipoFormacion.loading = false;

            this.enProcesoSolicitud = false;
            this.gridTipoFormacion.data.unshift(resp.body);
            this.gridTipoFormacion.loadData();
            this.obtener();
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.gridTipoFormacion.loading = false;
            this.enProcesoSolicitud = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Dato',
            });
          },
        });
    } else {
      this.formTipoFormacion.markAllAsTouched();
      this.gridTipoFormacion.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }


   /* -----------------------------------Actualizar ------------------------- */

  // Metodo se encarga de Actualizar la data de las tablas
  actualizar() {
    if (this.formTipoFormacion.valid) {
      this.enProcesoSolicitud = true;

      const materialAccion = this.procesarTipoFormacion();

      this.gridTipoFormacion.loading = true;

      this._integraService
        .putJsonResponse(
          constApiGestionPersonal.ActualizarTipoFormacion,
          JSON.stringify(materialAccion)
        )
        .subscribe({
          next: (resp: HttpResponse<TipoFormacion>) => {
            /*  this.dataItemTemp.estado = resp.body.estado; */
            this.gridTipoFormacion.loading = false;
            this.modalRef.close();
            this.obtener();
            this.gridTipoFormacion.loadData();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            console.log(error);
            this.gridTipoFormacion.loading = false;
            this.enProcesoSolicitud = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formTipoFormacion.markAllAsTouched();
      this.gridTipoFormacion.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }

/* ------------------------------Eliminar ----------------------------------------- */

eliminar(id: number) {
  // Usar SweetAlert para mostrar un mensaje de confirmación
  this.enProcesoSolicitud = true;
  Swal.fire({
    title: '¿Estás seguro de eliminar la Tipo Formacion?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      let index = this.gridTipoFormacion.data.findIndex(
        (x) => x.id === id
      );
      if (index != -1) {
      }
      this.gridTipoFormacion.loading = true;
      this._integraService
        .deleteJsonResponse(
          `${constApiGestionPersonal.EliminarTipoFormacion}/${id}`
        )
        .subscribe({
          next: (response: HttpResponse<boolean>) => {
            this.gridTipoFormacion.loading = false;
            if (response.body === true) {
              this.gridTipoFormacion.data.splice(index, 1);
              this.gridTipoFormacion.loadView();
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
            this.gridTipoFormacion.loading = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    }
  });
}







}
