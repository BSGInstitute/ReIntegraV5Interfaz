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

interface GrupoComparacionProcesoSeleccion {
  id: number;
  nombre: string;
  idsPuestoTrabajo: number[];
  idsSedeTrabajo: number[];
  idsPostulante: number[];
}
/**
 * @module GestionPersonas
 * @description Componente GrupoComparacionProcesoSeleccion
 * @author Flavio R. Mamani Fabian
 * @version 1.2.0
 * @history
 * * 30/04/2024 Implementacion de componente
 **/
@Component({
  selector: 'app-grupo-comparacion-proceso-seleccion',
  templateUrl: './grupo-comparacion-proceso-seleccion.component.html',
  styleUrls: ['./grupo-comparacion-proceso-seleccion.component.scss'],
})
export class GrupoComparacionProcesoSeleccionComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _modalService: NgbModal
  ) {}

  private _dataItemTemp: GrupoComparacionProcesoSeleccion;
  private _modalRef: NgbModalRef;
  private _subscriptions$ = new Subscription();
  gridGrupoComparacionProcesoSeleccion =
    new KendoGrid<GrupoComparacionProcesoSeleccion>();
  enProcesoSolicitud: boolean = false;
  isNew: boolean = false;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  formGrupoComparacionProcesoSeleccion = new FormGroup({
    nombre: new FormControl(null, Validators.required),
    idsPuestoTrabajo: new FormControl(null),
    idsSedeTrabajo: new FormControl(null),
    idsPostulante: new FormControl(null),
  });
  puestosTrabajo: IComboBase1[] = [];
  sedesTrabajo: IComboBase1[] = [];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  ngOnInit(): void {
    this.obtenerCombosModulo();
    this.obtenerGrupoComparacionProcesoSeleccion();
  }
  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
  /**
   * Obtiene todos los registros de GrupoComparacionProcesoSeleccion
   */
  obtenerCombosModulo() {
    this.gridGrupoComparacionProcesoSeleccion.loading = true;
    let sub$ = this._integraService
      .getJsonResponse(
        constApiGestionPersonal.GrupoComparacionProcesoSeleccionObtenerCombosModulo
      )
      .subscribe({
        next: (
          resp: HttpResponse<{
            puestosTrabajo: IComboBase1[];
            sedesTrabajo: IComboBase1[];
          }>
        ) => {
          this.puestosTrabajo = resp.body.puestosTrabajo;
          this.sedesTrabajo = resp.body.sedesTrabajo;
        },
        error: (error) => {
          this.gridGrupoComparacionProcesoSeleccion.loading = false;
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al obtener los combos!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
    this._subscriptions$.add(sub$);
  }
  /**
   * Obtiene todos los registros de GrupoComparacionProcesoSeleccion
   */
  obtenerGrupoComparacionProcesoSeleccion() {
    this.gridGrupoComparacionProcesoSeleccion.loading = true;
    let sub$ = this._integraService
      .getJsonResponse(
        constApiGestionPersonal.GrupoComparacionProcesoSeleccionObtener
      )
      .subscribe({
        next: (resp: HttpResponse<GrupoComparacionProcesoSeleccion[]>) => {
          this.gridGrupoComparacionProcesoSeleccion.data = resp.body;
          this.gridGrupoComparacionProcesoSeleccion.loading = false;
        },
        error: (error) => {
          this.gridGrupoComparacionProcesoSeleccion.loading = false;
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
   * Abre el modal de GrupoComparacionProcesoSeleccion
   * @param modalGrupoComparacionProcesoSeleccion
   * @param dataItem
   */
  openModalGrupoComparacionProcesoSeleccion(
    modalGrupoComparacionProcesoSeleccion: any,
    dataItem?: GrupoComparacionProcesoSeleccion
  ) {
    this.isNew = dataItem === null || dataItem === undefined;
    this.formGrupoComparacionProcesoSeleccion.reset();
    this.enProcesoSolicitud = false;
    if (!this.isNew) {
      this._dataItemTemp = dataItem;
      this.formGrupoComparacionProcesoSeleccion
        .get('nombre')
        .setValue(dataItem.nombre);
      this.formGrupoComparacionProcesoSeleccion
        .get('idsPuestoTrabajo')
        .setValue(dataItem.idsPuestoTrabajo);
      this.formGrupoComparacionProcesoSeleccion
        .get('idsSedeTrabajo')
        .setValue(dataItem.idsSedeTrabajo);
      this.formGrupoComparacionProcesoSeleccion
        .get('idsPostulante')
        .setValue(dataItem.idsPostulante);
    } else {
      this._dataItemTemp = null;
    }
    this._modalRef = this._modalService.open(
      modalGrupoComparacionProcesoSeleccion,
      {
        size: 'md',
        backdrop: 'static',
        keyboard: false,
      }
    );
  }
  /**
   * Valida el formulario de GrupoComparacionProcesoSeleccion
   * @returns
   */
  validarErrorControl() {
    if (this.formGrupoComparacionProcesoSeleccion.invalid) {
      return true;
    }
    if (
      this.formGrupoComparacionProcesoSeleccion.get('nombre').value.trim() == ''
    ) {
      return true;
    }
    if (
      this.formGrupoComparacionProcesoSeleccion.get('nombre').value.trim()
        .length > 0
    ) {
      return true;
    }
    return false;
  }
  /**
   * Insertar un registro de GrupoComparacionProcesoSeleccion
   * @returns
   */
  insertarGrupoComparacionProcesoSeleccion() {
    if (this.validarErrorControl()) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Ingrese un nombre valido!',
        })
        .then(() => {
          this.formGrupoComparacionProcesoSeleccion.markAllAsTouched();
        });
      return;
    }
    let obj: GrupoComparacionProcesoSeleccion = {
      id: 0,
      nombre: this.formGrupoComparacionProcesoSeleccion.get('nombre').value,
      idsPuestoTrabajo:
        this.formGrupoComparacionProcesoSeleccion.get('idsPuestoTrabajo')
          .value ?? [],
      idsSedeTrabajo:
        this.formGrupoComparacionProcesoSeleccion.get('idsSedeTrabajo').value ??
        [],
      idsPostulante:
        this.formGrupoComparacionProcesoSeleccion.get('idsPostulante').value ??
        [],
    };
    this.enProcesoSolicitud = true;
    this.formGrupoComparacionProcesoSeleccion.disable();
    let sub$ = this._integraService
      .postJsonResponse(
        constApiGestionPersonal.GrupoComparacionProcesoSeleccionInsertar,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<GrupoComparacionProcesoSeleccion>) => {
          this.enProcesoSolicitud = false;
          this.formGrupoComparacionProcesoSeleccion.enable();
          this.obtenerGrupoComparacionProcesoSeleccion();
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
          this.formGrupoComparacionProcesoSeleccion.enable();
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
   * Actualiza un registro de GrupoComparacionProcesoSeleccion
   * @returns
   */
  actualizarGrupoComparacionProcesoSeleccion() {
    if (this.validarErrorControl()) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Ingrese un nombre valido!',
        })
        .then(() => {
          this.formGrupoComparacionProcesoSeleccion.markAllAsTouched();
        });
      return;
    }
    let obj: GrupoComparacionProcesoSeleccion = {
      id: this._dataItemTemp.id,
      nombre: this.formGrupoComparacionProcesoSeleccion.get('nombre').value,
      idsPuestoTrabajo:
        this.formGrupoComparacionProcesoSeleccion.get('idsPuestoTrabajo')
          .value ?? [],
      idsSedeTrabajo:
        this.formGrupoComparacionProcesoSeleccion.get('idsSedeTrabajo').value ??
        [],
      idsPostulante:
        this.formGrupoComparacionProcesoSeleccion.get('idsPostulante').value ??
        [],
    };
    this.enProcesoSolicitud = true;
    this.formGrupoComparacionProcesoSeleccion.disable();
    let sub$ = this._integraService
      .putJsonResponse(
        constApiGestionPersonal.GrupoComparacionProcesoSeleccionActualizar,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<GrupoComparacionProcesoSeleccion>) => {
          this.enProcesoSolicitud = false;
          this.formGrupoComparacionProcesoSeleccion.enable();
          this.obtenerGrupoComparacionProcesoSeleccion();
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
          this.formGrupoComparacionProcesoSeleccion.enable();
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
   *Elimina un registro de GrupoComparacionProcesoSeleccion
   * @param idGrupoComparacionProcesoSeleccion
   */
  eliminarGrupoComparacionProcesoSeleccion(
    idGrupoComparacionProcesoSeleccion: number
  ) {
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
          this.gridGrupoComparacionProcesoSeleccion.loading = true;
          let sub$ = this._integraService
            .deleteJsonResponse(
              `${constApiGestionPersonal.GrupoComparacionProcesoSeleccionEliminar}/${idGrupoComparacionProcesoSeleccion}`
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridGrupoComparacionProcesoSeleccion.loading = false;
                this.obtenerGrupoComparacionProcesoSeleccion();
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
                this.gridGrupoComparacionProcesoSeleccion.loading = false;
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
