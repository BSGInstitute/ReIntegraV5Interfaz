import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { constApiGestionPersonal } from '@environments/constApi';
import { CategoriaEvaluacion } from '@gestionPersonas/models/categoriaEvaluacion';
import Swal from 'sweetalert2';
import { PageSizeItem, RowClassArgs } from '@progress/kendo-angular-grid';

interface formCategoriaEvaluacion {
  id: number;
  nombre: string;
}
/**
 * @module CategoriaEvaluacionModule
 * @description Componente de Categoria Evaluacion
 * @author Marco Jose Villanueva Torres
 * @version 1.0.0
 * @history
   30/04/2024 Implementacion del modulo Categoria Evaluacion
 */
@Component({
  selector: 'app-categoria-evaluacion',
  templateUrl: './categoria-evaluacion.component.html',
  styleUrls: ['./categoria-evaluacion.component.scss'],
})
export class CategoriaEvaluacionComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) {}
  gridCategoriaEvaluacion: KendoGrid = new KendoGrid();
  enProcesoSolicitud: boolean = false;
  modalRef: NgbModalRef = null;
  isNew: boolean = false;
  dataItemTemp: CategoriaEvaluacion;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  formCategoriaEvaluacion: FormGroup = this._formBuilder.group({
    nombre: [null, [Validators.required, Validators.maxLength(50)]],
  });

  ngOnInit(): void {
    this.obtener();
    this.configurarGrid();
  }

  /**
   * Obtiene todas las Categorias Evaluaciones
   */
  obtener() {
    this.gridCategoriaEvaluacion.loading = true;
    // Llama al '_integraService' para obtener datos desde el punto final de la API especificado
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerCategoriaEvaluacion)
      .subscribe({
        next: (resp: HttpResponse<CategoriaEvaluacion[]>) => {
          // Llena la propiedad 'data' de 'gridCategoriaEvaluacion' con los datos obtenidos.
          this.gridCategoriaEvaluacion.data = resp.body;

          // Establece el estado de carga nuevamente en 'false' ya que se completó la obtención de datos.
          this.gridCategoriaEvaluacion.loading = false;
        },
        error: (error) => {
          // Registra un mensaje de error si ocurre un error durante la obtención de datos.

          // Establece el estado de carga nuevamente en 'false' para manejar el estado de error.
          this.gridCategoriaEvaluacion.loading = false;

          // Obtiene y muestra un mensaje de error utilizando el servicio '_alertaService'.
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  /* ---------------- Abrir Modal--------------------- */
/**
 * Modal para Insertar Nuevo y Editar (Actualizar)
 * @param context 
 * @param isNew 
 * @param dataItem 
 */
  abrirModal(context: any, isNew: boolean, dataItem?: CategoriaEvaluacion) {
    this.isNew = isNew;
    this.formCategoriaEvaluacion.reset();
    this.enProcesoSolicitud = false;
    if (!isNew) {
      this.dataItemTemp = dataItem;
      this.asignarValoresToForm(dataItem);
    } else {
      this.dataItemTemp = null;
    }
    this.modalRef = this._modalService.open(context, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });
  }

  /*   ------------------------------------------------------------------- */
  get CategoriaEvaluacionForm(): formCategoriaEvaluacion {
    return this.formCategoriaEvaluacion.getRawValue() as formCategoriaEvaluacion;
  }

  /* ---------------------------Asignar Vaalores  ------------------------------------*/
  asignarValoresToForm(dataItem: CategoriaEvaluacion) {
    this.formCategoriaEvaluacion.get('nombre').setValue(dataItem.nombre);
  }
  /*   ------------------------------------------------------------------- */
  configurarGrid() {
    this.gridCategoriaEvaluacion.habilitarEstadoNewRow = true;
  }
  /* --------------------------------Procesar CategoriaEvaluacion ------------------------------ */

  procesarCategoriaEvaluacion(): CategoriaEvaluacion {
    let categoriaEvaluacionD: CategoriaEvaluacion = {
      id: this.isNew ? 0 : this.dataItemTemp.id,
      nombre: this.CategoriaEvaluacionForm.nombre,
    };
    return categoriaEvaluacionD;
  }

  /* ------------------------------------------------------------------------- */
   /**
   * Valida el formulario de MensajeTiempoInactivo
   * @returns
   */
   validarErrorControl() {
    if (!this.formCategoriaEvaluacion.get('nombre').value) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Completar el Formulario, por favor!',
        })
        .then(() => {
          this.formCategoriaEvaluacion.markAllAsTouched();
        });
      return true;
    }
    if (this.formCategoriaEvaluacion.get('nombre').value.trim() == '') {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Ingrese un Nombre valido!',
        })
        .then(() => {
          this.formCategoriaEvaluacion.markAllAsTouched();
        });
      return true;
    }

    if (this.formCategoriaEvaluacion.get('nombre').value.trim().length > 50) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: 'El Mensaje contiene mas de 50 caracteres!',
        })
        .then(() => {
          this.formCategoriaEvaluacion.markAllAsTouched();
        });
      return true;
    }
    return false;
  }
  /* ---------------Guardar Nuevo Categoria Evaluacion ------------------------*/
  guardar() {
    if (this.validarErrorControl()) {
      return;
    }
    console.log(this.formCategoriaEvaluacion.value);
    if (this.formCategoriaEvaluacion.valid) {
      let jsonEnvio = this.procesarCategoriaEvaluacion();
      this.gridCategoriaEvaluacion.loading = true;

      this.enProcesoSolicitud = true;
      this._integraService
        .postJsonResponse(
          constApiGestionPersonal.InsertarCategoriaEvaluacion,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<CategoriaEvaluacion>) => {
            this.gridCategoriaEvaluacion.loading = false;

            this.enProcesoSolicitud = false;
            this.gridCategoriaEvaluacion.data.unshift(resp.body);
            this.gridCategoriaEvaluacion.loadData();
            this.obtener();
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.gridCategoriaEvaluacion.loading = false;
            this.enProcesoSolicitud = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Dato',
            });
          },
        });
    } else {
      this.formCategoriaEvaluacion.markAllAsTouched();
      this.gridCategoriaEvaluacion.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }
  /* -----------------------------------Actualizar ------------------------- */

  // Metodo se encarga de Actualizar la data de las tablas
  actualizar() {
    if (this.validarErrorControl()) {
      return;
    }
    if (this.formCategoriaEvaluacion.valid) {
      this.enProcesoSolicitud = true;

      const materialAccion = this.procesarCategoriaEvaluacion();

      this.gridCategoriaEvaluacion.loading = true;

      this._integraService
        .putJsonResponse(
          constApiGestionPersonal.ActualizarCategoriaEvaluacion,
          JSON.stringify(materialAccion)
        )
        .subscribe({
          next: (resp: HttpResponse<CategoriaEvaluacion>) => {
            /*  this.dataItemTemp.estado = resp.body.estado; */
            this.gridCategoriaEvaluacion.loading = false;
            this.modalRef.close();
            this.obtener();
            this.gridCategoriaEvaluacion.loadData();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            console.log(error);
            this.gridCategoriaEvaluacion.loading = false;
            this.enProcesoSolicitud = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formCategoriaEvaluacion.markAllAsTouched();
      this.gridCategoriaEvaluacion.loading = false;
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
      title: '¿Estás seguro de eliminar la Categoria Evaluacion?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí,Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let index = this.gridCategoriaEvaluacion.data.findIndex(
          (x) => x.id === id
        );
        if (index != -1) {
        }
        this.gridCategoriaEvaluacion.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiGestionPersonal.EliminarCategoriaEvaluacion}/${id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.gridCategoriaEvaluacion.loading = false;
              if (response.body === true) {
                this.gridCategoriaEvaluacion.data.splice(index, 1);
                this.gridCategoriaEvaluacion.loadView();
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
              this.gridCategoriaEvaluacion.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }


}
