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
import { CategoriaPregunta } from '@gestionPersonas/models/categoriaPregunta';


interface formCategoriaPregunta {
  id: number;
  nombre: string;
}
/**
 * @module Categoria PreguntaModule
 * @description Componente de Categoria Pregunta
 * @author Marco Jose Villanueva Torres
 * @version 1.0.0
 * @history
   30/04/2024 Implementacion del modulo Categoria Pregunta
 */
@Component({
  selector: 'app-categoria-pregunta',
  templateUrl: './categoria-pregunta.component.html',
  styleUrls: ['./categoria-pregunta.component.scss'],
})
export class CategoriaPreguntaComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) {}

  gridCategoriaPregunta: KendoGrid = new KendoGrid();
  enProcesoSolicitud: boolean = false;
  modalRef: NgbModalRef = null;
  isNew: boolean = false;
  dataItemTemp: CategoriaPregunta;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  formCategoriaPregunta: FormGroup = this._formBuilder.group({
    nombre: [null, [Validators.required, Validators.maxLength(50)]],
  });

  ngOnInit(): void {
    this.obtener();
    this.configurarGrid();
  }

  /**
   * Obtiene todos las Categorias Preguntas registradas en la base de datos
   */
  obtener() {
    this.gridCategoriaPregunta.loading = true;
    // Llama al '_integraService' para obtener datos desde el punto final de la API especificado
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerCategoriaPregunta)
      .subscribe({
        next: (resp: HttpResponse<CategoriaPregunta[]>) => {
          // Llena la propiedad 'data' de 'gridCategoriaPregunta' con los datos obtenidos.
          this.gridCategoriaPregunta.data = resp.body;

          // Establece el estado de carga nuevamente en 'false' ya que se completó la obtención de datos.
          this.gridCategoriaPregunta.loading = false;
        },
        error: (error) => {
          // Registra un mensaje de error si ocurre un error durante la obtención de datos.

          // Establece el estado de carga nuevamente en 'false' para manejar el estado de error.
          this.gridCategoriaPregunta.loading = false;

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
  abrirModal(context: any, isNew: boolean, dataItem?: CategoriaPregunta) {
    this.isNew = isNew;
    this.formCategoriaPregunta.reset();
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
  get CategoriaPreguntaForm(): formCategoriaPregunta {
    return this.formCategoriaPregunta.getRawValue() as formCategoriaPregunta;
  }
  /* ---------------------------Asignar Vaalores  ------------------------------------*/
  asignarValoresToForm(dataItem: CategoriaPregunta) {
    this.formCategoriaPregunta.get('nombre').setValue(dataItem.nombre);
  }
  /*   ------------------------------------------------------------------- */

   /* --------------------------------Procesar Categoria Pregunta ------------------------------ */

   procesarCategoriaPregunta(): CategoriaPregunta {
    let categoriaPreguntaD: CategoriaPregunta = {
      id: this.isNew ? 0 : this.dataItemTemp.id,
      nombre: this.CategoriaPreguntaForm.nombre,
    };
    return categoriaPreguntaD;
  }
  /* -------------------------------------------------------------------------------- */
  configurarGrid() {
    this.gridCategoriaPregunta.habilitarEstadoNewRow = true;
  }
   /* ------------------------------------------------------------------------- */
   /**
   * Valida el formulario de MensajeTiempoInactivo
   * @returns
   */
   validarErrorControl() {
    if (!this.formCategoriaPregunta.get('nombre').value) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Completar el Formulario, por favor!',
        })
        .then(() => {
          this.formCategoriaPregunta.markAllAsTouched();
        });
      return true;
    }
    if (this.formCategoriaPregunta.get('nombre').value.trim() == '') {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Ingrese un Nombre valido!',
        })
        .then(() => {
          this.formCategoriaPregunta.markAllAsTouched();
        });
      return true;
    }

    if (this.formCategoriaPregunta.get('nombre').value.trim().length > 50) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: 'El Mensaje contiene mas de 50 caracteres!',
        })
        .then(() => {
          this.formCategoriaPregunta.markAllAsTouched();
        });
      return true;
    }
    return false;
  }
 /* ---------------Guardar Nuevo Categoria Pregunta ------------------------*/
  guardar() {
    if (this.validarErrorControl()) {
      return;
    }

    if (this.formCategoriaPregunta.valid) {
      let jsonEnvio = this.procesarCategoriaPregunta();
      this.gridCategoriaPregunta.loading = true;

      this.enProcesoSolicitud = true;
      this._integraService
        .postJsonResponse(
          constApiGestionPersonal.InsertarCategoriaPregunta,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<CategoriaPregunta>) => {
            this.gridCategoriaPregunta.loading = false;

            this.enProcesoSolicitud = false;
            this.gridCategoriaPregunta.data.unshift(resp.body);
            this.gridCategoriaPregunta.loadData();
            this.obtener();
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.gridCategoriaPregunta.loading = false;
            this.enProcesoSolicitud = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Dato',
            });
          },
        });
    } else {
      this.formCategoriaPregunta.markAllAsTouched();
      this.gridCategoriaPregunta.loading = false;
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
    if (this.formCategoriaPregunta.valid) {
      this.enProcesoSolicitud = true;

      const materialAccion = this.procesarCategoriaPregunta();

      this.gridCategoriaPregunta.loading = true;

      this._integraService
        .putJsonResponse(
          constApiGestionPersonal.ActualizarCategoriaPregunta,
          JSON.stringify(materialAccion)
        )
        .subscribe({
          next: (resp: HttpResponse<CategoriaPregunta>) => {
            /*  this.dataItemTemp.estado = resp.body.estado; */
            this.gridCategoriaPregunta.loading = false;
            this.modalRef.close();
            this.obtener();
            this.gridCategoriaPregunta.loadData();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            console.log(error);
            this.gridCategoriaPregunta.loading = false;
            this.enProcesoSolicitud = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formCategoriaPregunta.markAllAsTouched();
      this.gridCategoriaPregunta.loading = false;
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
      title: '¿Estás seguro de eliminar la Categoria Pregunta?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let index = this.gridCategoriaPregunta.data.findIndex(
          (x) => x.id === id
        );
        if (index != -1) {
        }
        this.gridCategoriaPregunta.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiGestionPersonal.EliminarCategoriaPregunta}/${id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.gridCategoriaPregunta.loading = false;
              if (response.body === true) {
                this.gridCategoriaPregunta.data.splice(index, 1);
                this.gridCategoriaPregunta.loadView();
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
              this.gridCategoriaPregunta.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }







}
