import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { constApiGestionPersonal } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-treelist';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Subscription } from 'rxjs';

interface PerfilPuestoTrabajoEstadoSolicitud {
  id: number;
  nombre: string;
}

/**
 * @module GestionPersonas
 * @description Componente PerfilPuestoTrabajoEstadoSolicitud
 * @author Flavio R. Mamani Fabian
 * @version 1.2.0
 * @history
 * * 30/04/2024 Implementacion de componente
 **/
@Component({
  selector: 'app-perfil-puesto-trabajo-estado-solicitud',
  templateUrl: './perfil-puesto-trabajo-estado-solicitud.component.html',
  styleUrls: ['./perfil-puesto-trabajo-estado-solicitud.component.scss'],
})
export class PerfilPuestoTrabajoEstadoSolicitudComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _modalService: NgbModal
  ) {}

  private _dataItemTemp: PerfilPuestoTrabajoEstadoSolicitud;
  private _modalRef: NgbModalRef;
  private _subscriptions$ = new Subscription();
  gridPerfilPuestoTrabajoEstadoSolicitud =
    new KendoGrid<PerfilPuestoTrabajoEstadoSolicitud>();
  enProcesoSolicitud: boolean = false;
  isNew: boolean = false;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  nombrePerfilPuestoTrabajoEstadoSolicitud = new FormControl(null, [
    Validators.required,
    Validators.maxLength(50),
  ]);
  ngOnInit(): void {
    this.obtenerPerfilPuestoTrabajoEstadoSolicitud();
  }
  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
  /**
   * Obtiene todos los registros de PerfilPuestoTrabajoEstadoSolicitud
   */
  obtenerPerfilPuestoTrabajoEstadoSolicitud() {
    this.gridPerfilPuestoTrabajoEstadoSolicitud.loading = true;
    let sub$ = this._integraService
      .getJsonResponse(
        constApiGestionPersonal.PerfilPuestoTrabajoEstadoSolicitudObtener
      )
      .subscribe({
        next: (resp: HttpResponse<PerfilPuestoTrabajoEstadoSolicitud[]>) => {
          this.gridPerfilPuestoTrabajoEstadoSolicitud.data = resp.body;
          this.gridPerfilPuestoTrabajoEstadoSolicitud.loading = false;
        },
        error: (error) => {
          this.gridPerfilPuestoTrabajoEstadoSolicitud.loading = false;
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
   * Abre el modal de PerfilPuestoTrabajoEstadoSolicitud
   * @param modalPerfilPuestoTrabajoEstadoSolicitud
   * @param dataItem
   */
  openModalPerfilPuestoTrabajoEstadoSolicitud(
    modalPerfilPuestoTrabajoEstadoSolicitud: any,
    dataItem?: PerfilPuestoTrabajoEstadoSolicitud
  ) {
    this.isNew = dataItem === null || dataItem === undefined;
    this.nombrePerfilPuestoTrabajoEstadoSolicitud.reset();
    this.enProcesoSolicitud = false;
    if (!this.isNew) {
      this._dataItemTemp = dataItem;
      this.nombrePerfilPuestoTrabajoEstadoSolicitud.setValue(dataItem.nombre);
    } else {
      this._dataItemTemp = null;
    }
    this._modalRef = this._modalService.open(modalPerfilPuestoTrabajoEstadoSolicitud, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });
  }
  /**
   * Valida el formulario de PerfilPuestoTrabajoEstadoSolicitud
   * @returns
   */
  validarErrorControl() {
    if (this.nombrePerfilPuestoTrabajoEstadoSolicitud.invalid) {
      return true;
    }
    if (this.nombrePerfilPuestoTrabajoEstadoSolicitud.value.trim() == '') {
      return true;
    }
    if (this.nombrePerfilPuestoTrabajoEstadoSolicitud.value.trim().length > 50) {
      return true;
    }
    return false;
  }
  /**
   * Insertar un registro de PerfilPuestoTrabajoEstadoSolicitud
   * @returns
   */
  insertarPerfilPuestoTrabajoEstadoSolicitud() {
    if (this.validarErrorControl()) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Ingrese un nombre valido!',
        })
        .then(() => {
          this.nombrePerfilPuestoTrabajoEstadoSolicitud.markAllAsTouched();
        });
      return;
    }
    let obj: PerfilPuestoTrabajoEstadoSolicitud = {
      id: 0,
      nombre: this.nombrePerfilPuestoTrabajoEstadoSolicitud.value,
    };
    this.enProcesoSolicitud = true;
    this.nombrePerfilPuestoTrabajoEstadoSolicitud.disable();
    let sub$ = this._integraService
      .postJsonResponse(
        constApiGestionPersonal.PerfilPuestoTrabajoEstadoSolicitudInsertar,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<PerfilPuestoTrabajoEstadoSolicitud>) => {
          this.enProcesoSolicitud = false;
          this.nombrePerfilPuestoTrabajoEstadoSolicitud.enable();
          this.obtenerPerfilPuestoTrabajoEstadoSolicitud();
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
          this.nombrePerfilPuestoTrabajoEstadoSolicitud.enable();
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
   * Actualiza un registro de PerfilPuestoTrabajoEstadoSolicitud
   * @returns
   */
  actualizarPerfilPuestoTrabajoEstadoSolicitud() {
    if (this.validarErrorControl()) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Ingrese un nombre valido!',
        })
        .then(() => {
          this.nombrePerfilPuestoTrabajoEstadoSolicitud.markAllAsTouched();
        });
      return;
    }
    let obj: PerfilPuestoTrabajoEstadoSolicitud = {
      id: this._dataItemTemp.id,
      nombre: this.nombrePerfilPuestoTrabajoEstadoSolicitud.value,
    };
    this.enProcesoSolicitud = true;
    this.nombrePerfilPuestoTrabajoEstadoSolicitud.disable();
    let sub$ = this._integraService
      .putJsonResponse(
        constApiGestionPersonal.PerfilPuestoTrabajoEstadoSolicitudActualizar,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<PerfilPuestoTrabajoEstadoSolicitud>) => {
          this.enProcesoSolicitud = false;
          this.nombrePerfilPuestoTrabajoEstadoSolicitud.enable();
          this.obtenerPerfilPuestoTrabajoEstadoSolicitud();
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
          this.nombrePerfilPuestoTrabajoEstadoSolicitud.enable();
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
   *Elimina un registro de PerfilPuestoTrabajoEstadoSolicitud
   * @param idPerfilPuestoTrabajoEstadoSolicitud
   */
  eliminarPerfilPuestoTrabajoEstadoSolicitud(idPerfilPuestoTrabajoEstadoSolicitud: number) {
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
          this.gridPerfilPuestoTrabajoEstadoSolicitud.loading = true;
          let sub$ = this._integraService
            .deleteJsonResponse(
              `${constApiGestionPersonal.PerfilPuestoTrabajoEstadoSolicitudEliminar}/${idPerfilPuestoTrabajoEstadoSolicitud}`
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridPerfilPuestoTrabajoEstadoSolicitud.loading = false;
                this.obtenerPerfilPuestoTrabajoEstadoSolicitud();
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
                this.gridPerfilPuestoTrabajoEstadoSolicitud.loading = false;
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
