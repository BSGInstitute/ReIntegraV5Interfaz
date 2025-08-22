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

interface PersonalRelacionExterna {
  id: number;
  nombre: string;
  idPersonalAreaTrabajo: number;
}
interface PersonalRelacionExternaCombo {
  id: number;
  nombre: string;
  idTipoFormacion: number;
  personalAreaTrabajo: string;
}

@Component({
  selector: 'app-personal-relacion-externa',
  templateUrl: './personal-relacion-externa.component.html',
  styleUrls: ['./personal-relacion-externa.component.scss'],
})
export class PersonalRelacionExternaComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _modalService: NgbModal
  ) {}

  private _dataItemTemp: PersonalRelacionExterna;
  private _modalRef: NgbModalRef;
  private _subscriptions$ = new Subscription();
  gridPersonalRelacionExterna = new KendoGrid<PersonalRelacionExterna>();
  enProcesoSolicitud: boolean = false;
  isNew: boolean = false;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  formPersonalRelacionExterna = new FormGroup({
    nombre: new FormControl(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
    idPersonalAreaTrabajo: new FormControl(null, Validators.required),
  });

  PersonalAreaTrabajoData: IComboBase1[] = [];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  ngOnInit(): void {
    this.obtenerPersonalRelacionExterna();
  }
  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
  /**
   * Obtiene todos los registros de PersonalRelacionExterna
   */
  obtenerAreaTrabajo() {
    let sub$ = this._integraService
      .getJsonResponse(
        constApiGestionPersonal.PersonalRelacionExternaObtenerAreaTrabajo
      )
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.PersonalAreaTrabajoData = resp.body;
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
   * Obtiene todos los registros de PersonalRelacionExterna
   */
  obtenerPersonalRelacionExterna() {
    this.gridPersonalRelacionExterna.loading = true;
    let sub$ = this._integraService
      .getJsonResponse(constApiGestionPersonal.PersonalRelacionExternaObtener)
      .subscribe({
        next: (resp: HttpResponse<PersonalRelacionExterna[]>) => {
          this.gridPersonalRelacionExterna.data = resp.body;
          this.gridPersonalRelacionExterna.loading = false;
        },
        error: (error) => {
          this.gridPersonalRelacionExterna.loading = false;
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
   * Abre el modal de PersonalRelacionExterna
   * @param modalPersonalRelacionExterna
   * @param dataItem
   */
  openModalPersonalRelacionExterna(
    modalPersonalRelacionExterna: any,
    dataItem?: PersonalRelacionExterna
  ) {
    this.obtenerAreaTrabajo();
    this.isNew = dataItem === null || dataItem === undefined;
    this.formPersonalRelacionExterna.reset();
    this.enProcesoSolicitud = false;
    if (!this.isNew) {
      this._dataItemTemp = dataItem;
      this.formPersonalRelacionExterna.get('nombre').setValue(dataItem.nombre);
      this.formPersonalRelacionExterna
        .get('idPersonalAreaTrabajo')
        .setValue(dataItem.idPersonalAreaTrabajo);
    } else {
      this._dataItemTemp = null;
    }
    this._modalRef = this._modalService.open(modalPersonalRelacionExterna, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });
  }
  /**
   * Valida el formulario de PersonalRelacionExterna
   * @returns
   */
  validarErrorControl() {
    if (this.formPersonalRelacionExterna.invalid) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Completar el Formulario, por favor!',
        })
        .then(() => {
          this.formPersonalRelacionExterna.markAllAsTouched();
        });
      return true;
    }
    if (!this.formPersonalRelacionExterna.get('nombre').value ) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Ingrese un Nombre valido!',
        })
        .then(() => {
          this.formPersonalRelacionExterna.markAllAsTouched();
        });
      return true;
    }
    if (this.formPersonalRelacionExterna.get('nombre').value.trim() == ''  ) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Ingrese un Nombre valido!',
        })
        .then(() => {
          this.formPersonalRelacionExterna.markAllAsTouched();
        });
      return true;
    }
   
    if (
      this.formPersonalRelacionExterna.get('nombre').value.trim().length > 50
    ) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡El nombre excede los 50 caracteres!',
        })
        .then(() => {
          this.formPersonalRelacionExterna.markAllAsTouched();
        });
      return true;
    }
    if (!this.formPersonalRelacionExterna.get('idPersonalAreaTrabajo').value) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Seleccione una Area de Trabajo!',
        })
        .then(() => {
          this.formPersonalRelacionExterna.markAllAsTouched();
        });
      return true;
    }
    
    return false;
  }
  /**
   * Insertar un registro de PersonalRelacionExterna
   * @returns
   */
  insertarPersonalRelacionExterna() {
    if (this.validarErrorControl()) {
      return
    }
      let obj: PersonalRelacionExterna = {
        id: 0,
        nombre: this.formPersonalRelacionExterna.get('nombre').value,
        idPersonalAreaTrabajo: this.formPersonalRelacionExterna.get(
          'idPersonalAreaTrabajo'
        ).value,
      };
      this.enProcesoSolicitud = true;
      this.formPersonalRelacionExterna.disable();
      let sub$ = this._integraService
        .postJsonResponse(
          constApiGestionPersonal.PersonalRelacionExternaInsertar,
          JSON.stringify(obj)
        )
        .subscribe({
          next: (resp: HttpResponse<PersonalRelacionExterna>) => {
            this.enProcesoSolicitud = false;
            this.obtenerPersonalRelacionExterna();
            this._alertaService
              .swalFireOptions({
                icon: 'success',
                title: '¡Registro exitoso!',
              })
              .then(() => {
                this.formPersonalRelacionExterna.enable();
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
                this.formPersonalRelacionExterna.enable();
              });
          },
        });
      this._subscriptions$.add(sub$);
    
  }
  /**
   * Actualiza un registro de PersonalRelacionExterna
   * @returns
   */
  actualizarPersonalRelacionExterna() {
    if (this.validarErrorControl()) {
     return
    }
    let obj: PersonalRelacionExterna = {
      id: this._dataItemTemp.id,
      nombre: this.formPersonalRelacionExterna.get('nombre').value,
      idPersonalAreaTrabajo: this.formPersonalRelacionExterna.get(
        'idPersonalAreaTrabajo'
      ).value,
    };
    this.enProcesoSolicitud = true;
    this.formPersonalRelacionExterna.disable();
    let sub$ = this._integraService
      .putJsonResponse(
        constApiGestionPersonal.PersonalRelacionExternaActualizar,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<PersonalRelacionExterna>) => {
          this.enProcesoSolicitud = false;
          this.formPersonalRelacionExterna.enable();
          this.obtenerPersonalRelacionExterna();
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
          this.formPersonalRelacionExterna.enable();
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
   *Elimina un registro de PersonalRelacionExterna
   * @param idPersonalRelacionExterna
   */
  eliminarPersonalRelacionExterna(idPersonalRelacionExterna: number) {
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
          this.gridPersonalRelacionExterna.loading = true;
          let sub$ = this._integraService
            .deleteJsonResponse(
              `${constApiGestionPersonal.PersonalRelacionExternaEliminar}/${idPersonalRelacionExterna}`
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridPersonalRelacionExterna.loading = false;
                this.obtenerPersonalRelacionExterna();
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
                this.gridPersonalRelacionExterna.loading = false;
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
