import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiGestionPersonal } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-treelist';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Subscription } from 'rxjs';

interface ExamenFeedback {
  id: number;
  nombre: string;
  url: string;
}
/**
 * @module GestionPersonas
 * @description Componente ExamenFeedback
 * @author Flavio R. Mamani Fabian
 * @version 1.2.0
 * @history
 * * 30/04/2024 Implementacion de componente
 **/
@Component({
  selector: 'app-examen-feedback',
  templateUrl: './examen-feedback.component.html',
  styleUrls: ['./examen-feedback.component.scss'],
})
export class ExamenFeedbackComponent implements OnInit {
  
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _modalService: NgbModal
  ) {}

  private _dataItemTemp: ExamenFeedback;
  private _modalRef: NgbModalRef;
  private _subscriptions$ = new Subscription();
  gridExamenFeedback = new KendoGrid<ExamenFeedback>();
  enProcesoSolicitud: boolean = false;
  isNew: boolean = false;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  formExamenFeedback = new FormGroup({
    nombre: new FormControl(null, Validators.required),
    url: new FormControl(null, Validators.maxLength(50)),
  });
  ngOnInit(): void {
    this.obtenerExamenFeedback();
  }
  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
  /**
   * Obtiene todos los registros de ExamenFeedback
   */
  obtenerExamenFeedback() {
    this.gridExamenFeedback.loading = true;
    let sub$ = this._integraService
      .getJsonResponse(constApiGestionPersonal.ExamenFeedbackObtener)
      .subscribe({
        next: (resp: HttpResponse<ExamenFeedback[]>) => {
          this.gridExamenFeedback.data = resp.body;
          this.gridExamenFeedback.loading = false;
        },
        error: (error) => {
          this.gridExamenFeedback.loading = false;
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al obtener los registros!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
    this._subscriptions$.add(sub$);
  }
  /**
   * Abre el modal de ExamenFeedback
   * @param modalExamenFeedback
   * @param dataItem
   */
  openModalExamenFeedback(modalExamenFeedback: any, dataItem?: ExamenFeedback) {
    this.isNew = dataItem === null || dataItem === undefined;
    this.formExamenFeedback.reset();
    this.enProcesoSolicitud = false;
    if (!this.isNew) {
      this._dataItemTemp = dataItem;
      this.formExamenFeedback.get('nombre').setValue(dataItem.nombre);
      this.formExamenFeedback.get('url').setValue(dataItem.url);
    } else {
      this._dataItemTemp = null;
    }
    this._modalRef = this._modalService.open(modalExamenFeedback, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });
  }
  /**
   * Valida el formulario de ExamenFeedback
   * @returns
   */
  validarErrorControl() {
    if (this.formExamenFeedback.invalid) {
      this._alertaService
      .swalFireOptions({
        icon: 'info',
        title: '¡Revise los campos del formulario!',
      })
      .then(() => {
        this.formExamenFeedback.markAllAsTouched();
      });
      return true;
    }
    if (this.formExamenFeedback.get('nombre').value.trim() == '') {
      this._alertaService
      .swalFireOptions({
        icon: 'info',
        title: '¡El nombre no es valido!',
      })
      .then(() => {
        this.formExamenFeedback.markAllAsTouched();
      });
      return true;
    }
    if (this.formExamenFeedback.get('nombre').value.trim().length > 50) {
      this._alertaService
      .swalFireOptions({
        icon: 'info',
        title: '¡El nombre debe tener como maximo 50 caracteres!',
      })
      .then(() => {
        this.formExamenFeedback.markAllAsTouched();
      });
      return true;
    }
    return false;
  }
  /**
   * Insertar un registro de ExamenFeedback
   * @returns
   */
  insertarExamenFeedback() {
    if (this.validarErrorControl()) {
      return;
    }
    let obj: ExamenFeedback = {
      id: 0,
      nombre: this.formExamenFeedback.get('nombre').value,
      url: this.formExamenFeedback.get('url').value,
    };
    this.enProcesoSolicitud = true;
    this.formExamenFeedback.disable();
    let sub$ = this._integraService
      .postJsonResponse(
        constApiGestionPersonal.ExamenFeedbackInsertar,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<ExamenFeedback>) => {
          this.enProcesoSolicitud = false;
          this.formExamenFeedback.enable();
          this.obtenerExamenFeedback();
          this._alertaService
            .swalFireOptions({
              icon: 'success',
              title: '¡Registro exitoso!',
            })
            .then(() => {
              this._modalRef.close();
            });
        },
        error: (error) => {
          this.enProcesoSolicitud = false;
          this.formExamenFeedback.enable();
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al crear el registro!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
    this._subscriptions$.add(sub$);
  }
  /**
   * Actualiza un registro de ExamenFeedback
   * @returns
   */
  actualizarExamenFeedback() {
    if (this.validarErrorControl()) {
      return;
    }
    let obj: ExamenFeedback = {
      id: this._dataItemTemp.id,
      nombre: this.formExamenFeedback.get('nombre').value,
      url: this.formExamenFeedback.get('url').value,
    };
    this.enProcesoSolicitud = true;
    this.formExamenFeedback.disable();
    let sub$ = this._integraService
      .putJsonResponse(
        constApiGestionPersonal.ExamenFeedbackActualizar,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<ExamenFeedback>) => {
          this.enProcesoSolicitud = false;
          this.formExamenFeedback.enable();
          this.obtenerExamenFeedback();
          this._alertaService
            .swalFireOptions({
              icon: 'success',
              title: '¡Registro actualizado!',
            })
            .then(() => {
              this._modalRef.close();
            });
        },
        error: (error) => {
          this.enProcesoSolicitud = false;
          this.formExamenFeedback.enable();
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al actualizar el registro!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
    this._subscriptions$.add(sub$);
  }
  /**
   *Elimina un registro de ExamenFeedback
   * @param idExamenFeedback
   */
  eliminarExamenFeedback(idExamenFeedback: number) {
    this.enProcesoSolicitud = true;
    this._alertaService
      .swalFireOptions({
        title: '¿Estás seguro de eliminar el registro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, Eliminar',
        cancelButtonText: 'No, Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.gridExamenFeedback.loading = true;
          let sub$ = this._integraService
            .deleteJsonResponse(
              `${constApiGestionPersonal.ExamenFeedbackEliminar}/${idExamenFeedback}`
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridExamenFeedback.loading = false;
                this.obtenerExamenFeedback();
                if (response.body === true) {
                  this._alertaService
                    .swalFireOptions({
                      icon: 'success',
                      title: '¡Registro eliminado!',
                    })
                    .then(() => {});
                  this.enProcesoSolicitud = false;
                } else {
                  this._alertaService
                    .swalFireOptions({
                      icon: 'info',
                      title: '¡No se pudo eliminar el registro!',
                    })
                    .then(() => {});
                }
              },
              error: (error) => {
                this.gridExamenFeedback.loading = false;
                let resp = this._alertaService.getErrorResponse(error);
                this._alertaService.swalFireOptions({
                  icon: 'error',
                  title: '¡Ocurrio un problema al eliminar el registro!',
                  text: `${resp.titulo}: ${resp.mensaje}`,
                });
              },
            });
          this._subscriptions$.add(sub$);
        }
      });
  }
}
