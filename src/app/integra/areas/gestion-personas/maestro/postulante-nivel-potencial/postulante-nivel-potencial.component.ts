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



interface PostulanteNivelPotencial {
  id: number;
  nombre: string;
}
/**
 * @module GestionPersonas
 * @description Componente PostulanteNivelPotencial
 * @author Marco Jose Villanueva Torres
 * @version 1.2.0
 * @history
 * * 02/05/2024 Implementacion de componente
 **/
@Component({
  selector: 'app-postulante-nivel-potencial',
  templateUrl: './postulante-nivel-potencial.component.html',
  styleUrls: ['./postulante-nivel-potencial.component.scss']
})
export class PostulanteNivelPotencialComponent implements OnInit {

  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _modalService: NgbModal
  ) { }

  
  private _dataItemTemp: PostulanteNivelPotencial;
  private _modalRef: NgbModalRef;
  private _subscriptions$ = new Subscription();
  gridPostulanteNivelPotencial =
    new KendoGrid<PostulanteNivelPotencial>();
  enProcesoSolicitud: boolean = false;
  isNew: boolean = false;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  nombre = new FormControl(null, [
    Validators.required,
    Validators.maxLength(50),
  ]);
  ngOnInit(): void {
    this.obtenerPostulanteNivelPotencial();
  }
  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
  /**
   * Obtiene todos los registros de PostulanteNivelPotencial
   */
  obtenerPostulanteNivelPotencial() {
    this.gridPostulanteNivelPotencial.loading = true;
    let sub$ = this._integraService
      .getJsonResponse(
        constApiGestionPersonal.PostulanteNivelPotencialObtener
      )
      .subscribe({
        next: (resp: HttpResponse<PostulanteNivelPotencial[]>) => {
          this.gridPostulanteNivelPotencial.data = resp.body;
          this.gridPostulanteNivelPotencial.loading = false;
        },
        error: (error) => {
          this.gridPostulanteNivelPotencial.loading = false;
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
   * Abre el modal de PostulanteNivelPotencial
   * @param modalPostulanteNivelPotencial
   * @param dataItem
   */
  openModalPostulanteNivelPotencial(
    modalPostulanteNivelPotencial: any,
    dataItem?: PostulanteNivelPotencial
  ) {
    this.isNew = dataItem === null || dataItem === undefined;
    this.nombre.reset();
    this.enProcesoSolicitud = false;
    if (!this.isNew) {
      this._dataItemTemp = dataItem;
      this.nombre.setValue(dataItem.nombre);
    } else {
      this._dataItemTemp = null;
    }
    this._modalRef = this._modalService.open(modalPostulanteNivelPotencial, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });
  }
  /**
   * Valida el formulario de PostulanteNivelPotencial
   * @returns
   */
  validarErrorControl() {
    if (this.nombre.invalid) {
      return true;
    }
    if (this.nombre.value.trim() == '') {
      return true;
    }
    if (this.nombre.value.trim().length > 50) {
      return true;
    }
    return false;
  }
  /**
   * Insertar un registro de PostulanteNivelPotencial
   * @returns
   */
  insertarPostulanteNivelPotencial() {
    if (this.validarErrorControl()) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Ingrese un nombre valido!',
        })
        .then(() => {
          this.nombre.markAllAsTouched();
        });
      return;
    }
    let obj: PostulanteNivelPotencial = {
      id: 0,
      nombre: this.nombre.value,
    };
    this.enProcesoSolicitud = true;
    this.nombre.disable();
    let sub$ = this._integraService
      .postJsonResponse(
        constApiGestionPersonal.PostulanteNivelPotencialInsertar,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<PostulanteNivelPotencial>) => {
          this.enProcesoSolicitud = false;
          this.nombre.enable();
          this.obtenerPostulanteNivelPotencial();
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
          this.nombre.enable();
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
   * Actualiza un registro de PostulanteNivelPotencial
   * @returns
   */
  actualizarPostulanteNivelPotencial() {
    if (this.validarErrorControl()) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Ingrese un nombre valido!',
        })
        .then(() => {
          this.nombre.markAllAsTouched();
        });
      return;
    }
    let obj: PostulanteNivelPotencial = {
      id: this._dataItemTemp.id,
      nombre: this.nombre.value,
    };
    this.enProcesoSolicitud = true;
    this.nombre.disable();
    let sub$ = this._integraService
      .putJsonResponse(
        constApiGestionPersonal.PostulanteNivelPotencialActualizar,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<PostulanteNivelPotencial>) => {
          this.enProcesoSolicitud = false;
          this.nombre.enable();
          this.obtenerPostulanteNivelPotencial();
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
          this.nombre.enable();
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
   *Elimina un registro de PostulanteNivelPotencial
   * @param idPostulanteNivelPotencial
   */
  eliminarPostulanteNivelPotencial(idPostulanteNivelPotencial: number) {
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
          this.gridPostulanteNivelPotencial.loading = true;
          let sub$ = this._integraService
            .deleteJsonResponse(
              `${constApiGestionPersonal.PostulanteNivelPotencialEliminar}/${idPostulanteNivelPotencial}`
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridPostulanteNivelPotencial.loading = false;
                this.obtenerPostulanteNivelPotencial();
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
                this.gridPostulanteNivelPotencial.loading = false;
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
