import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { constApiGestionPersonal } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Subscription } from 'rxjs';

interface EstadoEtapaProcesoSeleccion {
  id: number;
  nombre: string;
}
/**
 * @module GestionPersonas
 * @description Componente EstadoEtapaProcesoSeleccion
 * @author Flavio R. Mamani Fabian
 * @version 1.2.0
 * @history
 * * 30/04/2024 Implementacion de componente
 **/
@Component({
  selector: 'app-estado-etapa-proceso-seleccion',
  templateUrl: './estado-etapa-proceso-seleccion.component.html',
  styleUrls: ['./estado-etapa-proceso-seleccion.component.scss'],
})
export class EstadoEtapaProcesoSeleccionComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _modalService: NgbModal
  ) {}

  private _dataItemTemp: EstadoEtapaProcesoSeleccion;
  private _modalRef: NgbModalRef;
  private _subscriptions$ = new Subscription();
  gridEstadoEtapaProcesoSeleccion =
    new KendoGrid<EstadoEtapaProcesoSeleccion>();
  enProcesoSolicitud: boolean = false;
  isNew: boolean = false;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  nombreEstadoEtapaProcesoSeleccion = new FormControl(null, [
    Validators.required,
    Validators.maxLength(50),
  ]);
  ngOnInit(): void {
    this.obtenerEstadoEtapaProcesoSeleccion();
  }
  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
  /**
   * Obtiene todos los registros de EstadoEtapaProcesoSeleccion
   */
  obtenerEstadoEtapaProcesoSeleccion() {
    this.gridEstadoEtapaProcesoSeleccion.loading = true;
    let sub$ = this._integraService
      .getJsonResponse(
        constApiGestionPersonal.EstadoEtapaProcesoSeleccionObtener
      )
      .subscribe({
        next: (resp: HttpResponse<EstadoEtapaProcesoSeleccion[]>) => {
          this.gridEstadoEtapaProcesoSeleccion.data = resp.body;
          this.gridEstadoEtapaProcesoSeleccion.loading = false;
        },
        error: (error) => {
          this.gridEstadoEtapaProcesoSeleccion.loading = false;
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
   * Abre el modal de EstadoEtapaProcesoSeleccion
   * @param modalEstadoEtapaProcesoSeleccion
   * @param dataItem
   */
  openModalEstadoEtapaProcesoSeleccion(
    modalEstadoEtapaProcesoSeleccion: any,
    dataItem?: EstadoEtapaProcesoSeleccion
  ) {
    this.isNew = dataItem === null || dataItem === undefined;
    this.nombreEstadoEtapaProcesoSeleccion.reset();
    this.enProcesoSolicitud = false;
    if (!this.isNew) {
      this._dataItemTemp = dataItem;
      this.nombreEstadoEtapaProcesoSeleccion.setValue(dataItem.nombre);
    } else {
      this._dataItemTemp = null;
    }
    this._modalRef = this._modalService.open(modalEstadoEtapaProcesoSeleccion, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });
  }
  /**
   * Valida el formulario de EstadoEtapaProcesoSeleccion
   * @returns
   */
  validarErrorControl() {
    if (this.nombreEstadoEtapaProcesoSeleccion.invalid) {
      return true;
    }
    if (this.nombreEstadoEtapaProcesoSeleccion.value.trim() == '') {
      return true;
    }
    if (this.nombreEstadoEtapaProcesoSeleccion.value.trim().length > 50) {
      return true;
    }
    return false;
  }
  /**
   * Insertar un registro de EstadoEtapaProcesoSeleccion
   * @returns
   */
  insertarEstadoEtapaProcesoSeleccion() {
    if (this.validarErrorControl()) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Ingrese un nombre valido!',
        })
        .then(() => {
          this.nombreEstadoEtapaProcesoSeleccion.markAllAsTouched();
        });
      return;
    }
    let obj: EstadoEtapaProcesoSeleccion = {
      id: 0,
      nombre: this.nombreEstadoEtapaProcesoSeleccion.value,
    };
    this.enProcesoSolicitud = true;
    this.nombreEstadoEtapaProcesoSeleccion.disable();
    let sub$ = this._integraService
      .postJsonResponse(
        constApiGestionPersonal.EstadoEtapaProcesoSeleccionInsertar,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<EstadoEtapaProcesoSeleccion>) => {
          this.enProcesoSolicitud = false;
          this.nombreEstadoEtapaProcesoSeleccion.enable();
          this.obtenerEstadoEtapaProcesoSeleccion();
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
          this.nombreEstadoEtapaProcesoSeleccion.enable();
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
   * Actualiza un registro de EstadoEtapaProcesoSeleccion
   * @returns
   */
  actualizarEstadoEtapaProcesoSeleccion() {
    if (this.validarErrorControl()) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Ingrese un nombre valido!',
        })
        .then(() => {
          this.nombreEstadoEtapaProcesoSeleccion.markAllAsTouched();
        });
      return;
    }
    let obj: EstadoEtapaProcesoSeleccion = {
      id: this._dataItemTemp.id,
      nombre: this.nombreEstadoEtapaProcesoSeleccion.value,
    };
    this.enProcesoSolicitud = true;
    this.nombreEstadoEtapaProcesoSeleccion.disable();
    let sub$ = this._integraService
      .putJsonResponse(
        constApiGestionPersonal.EstadoEtapaProcesoSeleccionActualizar,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<EstadoEtapaProcesoSeleccion>) => {
          this.enProcesoSolicitud = false;
          this.nombreEstadoEtapaProcesoSeleccion.enable();
          this.obtenerEstadoEtapaProcesoSeleccion();
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
          this.nombreEstadoEtapaProcesoSeleccion.enable();
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
   *Elimina un registro de EstadoEtapaProcesoSeleccion
   * @param idEstadoEtapaProcesoSeleccion
   */
  eliminarEstadoEtapaProcesoSeleccion(idEstadoEtapaProcesoSeleccion: number) {
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
          this.gridEstadoEtapaProcesoSeleccion.loading = true;
          let sub$ = this._integraService
            .deleteJsonResponse(
              `${constApiGestionPersonal.EstadoEtapaProcesoSeleccionEliminar}/${idEstadoEtapaProcesoSeleccion}`
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridEstadoEtapaProcesoSeleccion.loading = false;
                this.obtenerEstadoEtapaProcesoSeleccion();
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
                this.gridEstadoEtapaProcesoSeleccion.loading = false;
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
