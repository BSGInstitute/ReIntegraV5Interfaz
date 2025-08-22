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
import { ContratoEstado } from '@gestionPersonas/models/contratoEstado';

interface formContratoEstado {
  id: number;
  nombre: string;
}
/**
 * @module ContratoEstadoModule
 * @description Componente de Contrato Estado
 * @author Marco Jose Villanueva Torres
 * @version 1.0.0
 * @history
   15/01/2024 Implementacion del modulo de Contrato Estado
 */
@Component({
  selector: 'app-contrato-estado',
  templateUrl: './contrato-estado.component.html',
  styleUrls: ['./contrato-estado.component.scss'],
})
export class ContratoEstadoComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) {}

  gridContratoEstado: KendoGrid = new KendoGrid();
  enProcesoSolicitud: boolean = false;
  modalRef: NgbModalRef = null;
  isNew: boolean = false;
  dataItemTemp: ContratoEstado;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  formContratoEstado: FormGroup = this._formBuilder.group({
    nombre: [null, Validators.required],
  });

  ngOnInit(): void {
    this.obtener();
    this.configurarGrid();
  }
/**
 * Obtener los Estados de Contrato
 */
  obtener() {
    this.gridContratoEstado.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerContratoEstado)
      .subscribe({
        next: (resp: HttpResponse<ContratoEstado[]>) => {
          this.gridContratoEstado.data = resp.body;
          this.gridContratoEstado.loading = false;
        },
        error: (error) => {
          this.gridContratoEstado.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  /* ---------------- Abrir Modal--------------------- */
  /**
   * Abrir Modal para Insertar y Actualizar
   * @param context 
   * @param isNew 
   * @param dataItem 
   */
  abrirModal(context: any, isNew: boolean, dataItem?: ContratoEstado) {
    this.isNew = isNew;
    this.formContratoEstado.reset();
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
  get ContratoEstadoForm(): formContratoEstado {
    return this.formContratoEstado.getRawValue() as formContratoEstado;
  }
  /* ---------------------------Asignar Vaalores  ------------------------------------*/
  /**
   * Asigna los valores para cuando se abra el modal para actualizar
   * @param dataItem 
   */
  asignarValoresToForm(dataItem: ContratoEstado) {
    this.formContratoEstado.get('nombre').setValue(dataItem.nombre);
  }
  /*   ------------------------------------------------------------------- */
  /* --------------------------------Procesar Categoria Pregunta ------------------------------ */

  procesarCategoriaPregunta(): ContratoEstado {
    let categoriaPreguntaD: ContratoEstado = {
      id: this.isNew ? 0 : this.dataItemTemp.id,
      nombre: this.ContratoEstadoForm.nombre,
    };
    return categoriaPreguntaD;
  }
  /* -------------------------------------------------------------------------------- */
  configurarGrid() {
    this.gridContratoEstado.habilitarEstadoNewRow = true;
  }
/* ---------------Guardar Nuevo Categoria Pregunta ------------------------*/
/**
 * Guarda el Nuevo Contrato Estado
 */
guardar() {
  console.log(this.formContratoEstado.value);
  if (this.formContratoEstado.valid) {
    let jsonEnvio = this.procesarCategoriaPregunta();
    this.gridContratoEstado.loading = true;

    this.enProcesoSolicitud = true;
    this._integraService
      .postJsonResponse(
        constApiGestionPersonal.InsertarContratoEstado,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<ContratoEstado>) => {
          this.gridContratoEstado.loading = false;

          this.enProcesoSolicitud = false;
          this.gridContratoEstado.data.unshift(resp.body);
          this.gridContratoEstado.loadData();
          this.obtener();
          this.modalRef.close();
          this._alertaService.mensajeExitoso();
        },
        error: (error) => {
          this.gridContratoEstado.loading = false;
          this.enProcesoSolicitud = false;
          this._alertaService.notificationWarning(error.message);
          this._alertaService.swalFireOptions({
            icon: 'error',
            text: 'No se pudo guardar el Dato',
          });
        },
      });
  } else {
    this.formContratoEstado.markAllAsTouched();
    this.gridContratoEstado.loading = false;
    this.enProcesoSolicitud = false;
    this._alertaService.mensajeIcon(
      'Complete por favor los campos obligatorios!'
    );
  }
}

 /* -----------------------------------Actualizar ------------------------- */


 /**
  *  Metodo se encarga de Actualizar la data de las tablas
  */
 
  actualizar() {
    if (this.formContratoEstado.valid) {
      this.enProcesoSolicitud = true;

      const materialAccion = this.procesarCategoriaPregunta();

      this.gridContratoEstado.loading = true;

      this._integraService
        .putJsonResponse(
          constApiGestionPersonal.ActualizarContratoEstado,
          JSON.stringify(materialAccion)
        )
        .subscribe({
          next: (resp: HttpResponse<ContratoEstado>) => {
            /*  this.dataItemTemp.estado = resp.body.estado; */
            this.gridContratoEstado.loading = false;
            this.modalRef.close();
            this.obtener();
            this.gridContratoEstado.loadData();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            console.log(error);
            this.gridContratoEstado.loading = false;
            this.enProcesoSolicitud = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formContratoEstado.markAllAsTouched();
      this.gridContratoEstado.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }

 /* ------------------------------Eliminar ----------------------------------------- */

 /**
  * Elimina el dato Seleccionado Estado Contrato
  * @param id 
  */
 eliminar(id: number) {
  // Usar SweetAlert para mostrar un mensaje de confirmación
  this.enProcesoSolicitud = true;
  Swal.fire({
    title: '¿Estás seguro de eliminar el Contrato Estado?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, Eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      let index = this.gridContratoEstado.data.findIndex(
        (x) => x.id === id
      );
      if (index != -1) {
      }
      this.gridContratoEstado.loading = true;
      this._integraService
        .deleteJsonResponse(
          `${constApiGestionPersonal.EliminarContratoEstado}/${id}`
        )
        .subscribe({
          next: (response: HttpResponse<boolean>) => {
            this.gridContratoEstado.loading = false;
            if (response.body === true) {
              this.gridContratoEstado.data.splice(index, 1);
              this.gridContratoEstado.loadView();
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
            this.gridContratoEstado.loading = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    }
  });
}


}
