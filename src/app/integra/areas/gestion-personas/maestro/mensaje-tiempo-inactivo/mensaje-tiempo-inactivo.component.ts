import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { constApiGestionPersonal } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageSizeItem } from '@progress/kendo-angular-treelist';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Subscription } from 'rxjs';
interface MensajeTiempoInactivo {
  id: number;
  mensaje: string;
  minutoInactivo: number;
}
/**
 * @module GestionPersonas
 * @description Componente MensajeTiempoInactivo
 * @author Marco Jose Villanueva Torres
 * @version 1.2.0
 * @history
 * * 02/05/2024 Implementacion de componente
 **/
@Component({
  selector: 'app-mensaje-tiempo-inactivo',
  templateUrl: './mensaje-tiempo-inactivo.component.html',
  styleUrls: ['./mensaje-tiempo-inactivo.component.scss'],
})
export class MensajeTiempoInactivoComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _modalService: NgbModal
  ) {}

  private _dataItemTemp: MensajeTiempoInactivo;
  private _modalRef: NgbModalRef;
  private _subscriptions$ = new Subscription();
  gridMensajeTiempoInactivo = new KendoGrid<MensajeTiempoInactivo>();
  enProcesoSolicitud: boolean = false;
  isNew: boolean = false;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  formMensajeTiempoInactivo = new FormGroup({
    mensaje: new FormControl(null, [Validators.required,Validators.maxLength(200)]),
    minutoInactivo: new FormControl(null),
  });
  ngOnInit(): void {
    this.obtenerMensajeTiempoInactivo();
  }
  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
  /**
   * Obtiene todos los registros de MensajeTiempoInactivo
   */
  obtenerMensajeTiempoInactivo() {
    this.gridMensajeTiempoInactivo.loading = true;
    let sub$ = this._integraService
      .getJsonResponse(constApiGestionPersonal.MensajeTiempoInactivoObtener)
      .subscribe({
        next: (resp: HttpResponse<MensajeTiempoInactivo[]>) => {
          this.gridMensajeTiempoInactivo.data = resp.body;
          this.gridMensajeTiempoInactivo.loading = false;
        },
        error: (error) => {
          this.gridMensajeTiempoInactivo.loading = false;
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
   * Abre el modal de MensajeTiempoInactivo
   * @param modalMensajeTiempoInactivo
   * @param dataItem
   */
  openModalMensajeTiempoInactivo(
    modalMensajeTiempoInactivo: any,
    dataItem?: MensajeTiempoInactivo
  ) {
    this.isNew = dataItem === null || dataItem === undefined;
    this.formMensajeTiempoInactivo.reset();
    this.enProcesoSolicitud = false;
    if (!this.isNew) {
      this._dataItemTemp = dataItem;
      this.formMensajeTiempoInactivo.get('mensaje').setValue(dataItem.mensaje);
      this.formMensajeTiempoInactivo
        .get('minutoInactivo')
        .setValue(dataItem.minutoInactivo);
    } else {
      this._dataItemTemp = null;
    }
    this._modalRef = this._modalService.open(modalMensajeTiempoInactivo, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });
  }
  /**
   * Valida el formulario de MensajeTiempoInactivo
   * @returns
   */
  validarErrorControl() {
    if (this.formMensajeTiempoInactivo.invalid) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Ingrese un Mensaje valido!',
        })
        .then(() => {
          this.formMensajeTiempoInactivo.markAllAsTouched();
        });
      return true;
    }

    if (this.formMensajeTiempoInactivo.get('mensaje').value.trim().length > 200) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: 'El Mensaje contiene mas de 50 caracteres!',
        })
        .then(() => {
          this.formMensajeTiempoInactivo.markAllAsTouched();
        });
      return true;
    }
    return false;
  }
  /**
   * Insertar un registro de MensajeTiempoInactivo
   * @returns
   */
  insertarMensajeTiempoInactivo() {
    if (this.validarErrorControl()) {
      return;
    }
    let obj: MensajeTiempoInactivo = {
      id: 0,
      mensaje: this.formMensajeTiempoInactivo.get('mensaje').value,
      minutoInactivo:
        this.formMensajeTiempoInactivo.get('minutoInactivo').value,
    };
    this.enProcesoSolicitud = true;
    this.formMensajeTiempoInactivo.disable();
    let sub$ = this._integraService
      .postJsonResponse(
        constApiGestionPersonal.MensajeTiempoInactivoInsertar,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<MensajeTiempoInactivo>) => {
          this.enProcesoSolicitud = false;
          this.obtenerMensajeTiempoInactivo();
          this._alertaService
            .swalFireOptions({
              icon: 'success',
              title: '¡Registro exitoso!',
            })
            .then(() => {
              this.formMensajeTiempoInactivo.enable();
              this._modalRef.close();
            });
        },
        error: (error) => {
          this.enProcesoSolicitud = false;
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService
            .swalFireOptions({
              icon: 'error',
              title: '¡Ocurrio un problema al crear el registro!',
              text: `${resp.titulo}: ${resp.mensaje}`,
            })
            .then(() => {
              this.formMensajeTiempoInactivo.enable();
            });
        },
      });
    this._subscriptions$.add(sub$);
  }
  /**
   * Actualiza un registro de MensajeTiempoInactivo
   * @returns
   */
  actualizarMensajeTiempoInactivo() {
    if (this.validarErrorControl()) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Ingrese un nombre valido!',
        })
        .then(() => {
          this.formMensajeTiempoInactivo.markAllAsTouched();
        });
      return;
    }
    let obj: MensajeTiempoInactivo = {
      id: this._dataItemTemp.id,
      mensaje: this.formMensajeTiempoInactivo.get('mensaje').value,
      minutoInactivo:
        this.formMensajeTiempoInactivo.get('minutoInactivo').value,
    };
    this.enProcesoSolicitud = true;
    this.formMensajeTiempoInactivo.disable();
    let sub$ = this._integraService
      .putJsonResponse(
        constApiGestionPersonal.MensajeTiempoInactivoActualizar,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<MensajeTiempoInactivo>) => {
          this.enProcesoSolicitud = false;
          this.formMensajeTiempoInactivo.enable();
          this.obtenerMensajeTiempoInactivo();
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
          this.formMensajeTiempoInactivo.enable();
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
   *Elimina un registro de MensajeTiempoInactivo
   * @param idMensajeTiempoInactivo
   */
  eliminarMensajeTiempoInactivo(idMensajeTiempoInactivo: number) {
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
          this.gridMensajeTiempoInactivo.loading = true;
          let sub$ = this._integraService
            .deleteJsonResponse(
              `${constApiGestionPersonal.MensajeTiempoInactivoEliminar}/${idMensajeTiempoInactivo}`
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridMensajeTiempoInactivo.loading = false;
                this.obtenerMensajeTiempoInactivo();
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
                this.gridMensajeTiempoInactivo.loading = false;
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
