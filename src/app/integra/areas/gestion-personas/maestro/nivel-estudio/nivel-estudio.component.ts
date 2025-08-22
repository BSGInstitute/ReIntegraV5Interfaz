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

interface NivelEstudio {
  id: number;
  nombre: string;
  idTipoFormacion: number;
}
interface NivelEstudioCombo {
  id: number;
  nombre: string;
  idTipoFormacion: number;
  tipoFormacion: string;
}
/**
 * @module GestionPersonas
 * @description Componente Nivel Estudio
 * @author Marco Jose Villanueva Torres
 * @version 1.0.0
 * @history
 * * 02/05/2024 Implementacion de componente
 **/

@Component({
  selector: 'app-nivel-estudio',
  templateUrl: './nivel-estudio.component.html',
  styleUrls: ['./nivel-estudio.component.scss'],
})
export class NivelEstudioComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _modalService: NgbModal
  ) {}

  private _dataItemTemp: NivelEstudio;
  private _modalRef: NgbModalRef;
  private _subscriptions$ = new Subscription();
  gridNivelEstudio = new KendoGrid<NivelEstudio>();
  enProcesoSolicitud: boolean = false;
  isNew: boolean = false;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  formNivelEstudio = new FormGroup({
    nombre: new FormControl(null,[Validators.required,Validators.maxLength(50)] ),
    idTipoFormacion: new FormControl(null, Validators.required),
  });

  TipoFormacionData: IComboBase1[] = [];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  ngOnInit(): void {
    this.obtenerNivelEstudio();
  }
  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
  /**
   * Obtiene todos los registros de NivelEstudio
   */
  ObtenerTipoFormacion() {
    let sub$ = this._integraService
      .getJsonResponse(constApiGestionPersonal.NivelEstudioObtenerFormacion)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.TipoFormacionData = resp.body;
        },
        error: (error) => {
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al obtener los Tipo Formacion!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
    this._subscriptions$.add(sub$);
  }
  /**
   * Obtiene todos los registros de NivelEstudio
   */
  obtenerNivelEstudio() {
    this.gridNivelEstudio.loading = true;
    let sub$ = this._integraService
      .getJsonResponse(constApiGestionPersonal.NivelEstudioObtener)
      .subscribe({
        next: (resp: HttpResponse<NivelEstudioCombo[]>) => {
          this.gridNivelEstudio.data = resp.body;
          this.gridNivelEstudio.loading = false;
        },
        error: (error) => {
          this.gridNivelEstudio.loading = false;
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
   * Abre el modal de NivelEstudio
   * @param modalNivelEstudio
   * @param dataItem
   */
  openModalNivelEstudio(modalNivelEstudio: any, dataItem?: NivelEstudio) {
    this.ObtenerTipoFormacion();
    this.isNew = dataItem === null || dataItem === undefined;
    this.formNivelEstudio.reset();
    this.enProcesoSolicitud = false;
    if (!this.isNew) {
      this._dataItemTemp = dataItem;
      this.formNivelEstudio.get('nombre').setValue(dataItem.nombre);
      this.formNivelEstudio
        .get('idTipoFormacion')
        .setValue(dataItem.idTipoFormacion);
    } else {
      this._dataItemTemp = null;
    }
    this._modalRef = this._modalService.open(modalNivelEstudio, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });
  }
  /**
   * Valida el formulario de NivelEstudio
   * @returns
   */
  validarErrorControl() {
    if (!this.formNivelEstudio.get('nombre').value) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Ingrese un Nombre valido!',
        })
        .then(() => {
          this.formNivelEstudio.markAllAsTouched();
        });
      return true;
    }
    if (this.formNivelEstudio.get('nombre').value.trim() == '') {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Ingrese un Nombre valido!',
        })
        .then(() => {
          this.formNivelEstudio.markAllAsTouched();
        });
      return true;
    }
    if (!this.formNivelEstudio.get('idTipoFormacion').value) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Tipo Formacion no Seleccionado!',
        })
        .then(() => {
          this.formNivelEstudio.markAllAsTouched();
        });
      return true;
    }
    if (this.formNivelEstudio.get('nombre').value.trim().length > 50) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: 'El nombre contiene mas de 50 caracteres!',
        })
        .then(() => {
          this.formNivelEstudio.markAllAsTouched();
        });
      return true;
    }
    if (this.formNivelEstudio.invalid) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Llene correctamente el formulario!',
        })
        .then(() => {
          this.formNivelEstudio.markAllAsTouched();
        });
      return true;
    }
    return false;
  }
  /**
   * Insertar un registro de NivelEstudio
   * @returns
   */
  insertarNivelEstudio() {
    if (this.validarErrorControl()) {
      return;
    }
    let obj: NivelEstudio = {
      id: 0,
      nombre: this.formNivelEstudio.get('nombre').value,
      idTipoFormacion: this.formNivelEstudio.get('idTipoFormacion').value,
    };
    this.enProcesoSolicitud = true;
    this.formNivelEstudio.disable();
    let sub$ = this._integraService
      .postJsonResponse(
        constApiGestionPersonal.NivelEstudioInsertar,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<NivelEstudio>) => {
          this.enProcesoSolicitud = false;
          this.obtenerNivelEstudio();
          this._alertaService
            .swalFireOptions({
              icon: 'success',
              title: '¡Registro exitoso!',
            })
            .then(() => {
              this.formNivelEstudio.enable();
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
              this.formNivelEstudio.enable();
            });
        },
      });
    this._subscriptions$.add(sub$);
  }
  /**
   * Actualiza un registro de NivelEstudio
   * @returns
   */
  actualizarNivelEstudio() {
    if (this.validarErrorControl()) {
      return;
    }
    let obj: NivelEstudio = {
      id: this._dataItemTemp.id,
      nombre: this.formNivelEstudio.get('nombre').value,
      idTipoFormacion: this.formNivelEstudio.get('idTipoFormacion').value,
    };
    this.enProcesoSolicitud = true;
    this.formNivelEstudio.disable();
    let sub$ = this._integraService
      .putJsonResponse(
        constApiGestionPersonal.NivelEstudioActualizar,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<NivelEstudio>) => {
          this.enProcesoSolicitud = false;
          this.formNivelEstudio.enable();
          this.obtenerNivelEstudio();
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
          this.formNivelEstudio.enable();
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
   *Elimina un registro de NivelEstudio
   * @param idNivelEstudio
   */
  eliminarNivelEstudio(idNivelEstudio: number) {
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
          this.gridNivelEstudio.loading = true;
          let sub$ = this._integraService
            .deleteJsonResponse(
              `${constApiGestionPersonal.NivelEstudioEliminar}/${idNivelEstudio}`
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridNivelEstudio.loading = false;
                this.obtenerNivelEstudio();
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
                this.gridNivelEstudio.loading = false;
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
