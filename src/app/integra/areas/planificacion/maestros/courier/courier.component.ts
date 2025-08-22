import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { constApiGlobal } from '@environments/constApi';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Subscription } from 'rxjs';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { FormService } from '@shared/services/form.service';

interface CourierDetalle {
  id: number;
  idCourier: number;
  idPais?: number;
  idCiudad?: number;
  direccion?: string;
  telefono?: string;
  tiempoEnvio?: number; // editor="numeric"
  pais?: string;
  ciudad?: string;
}
interface Courier {
  id: number;
  nombre?: string;
  idPais?: number;
  idCiudad?: number;
  direccion?: string;
  telefono?: string;
  url?: string;
  pais?: string;
  ciudad?: string;
}
//CiudadObtenerCombo: '/Ciudad/ObtenerCombo',
interface CombosCiudad {
  id: number;
  codigo: number;
  nombre: string;
  idPais: number;
}
//PaisObtenerCombo
interface CombosPais {
  id: number;
  // codigoPais: number;
  nombre: string;
}
/**
 * @module PlanificacionModule
 * @description Componente de Courier
 * @author Gretel Canasa
 * @version 1.0.0
 * @history
 * * 05/02/2023 Implementacion de Crud de Courier
 **/

@Component({
  selector: 'app-courier',
  templateUrl: './courier.component.html',
  styleUrls: ['./courier.component.scss'],
})
export class CourierComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formService: FormService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  comboPais: CombosPais[] = [];
  comboCiudad: CombosCiudad[];
  comboCiudadDetalle: CombosCiudad[];
  private _ciudades: CombosCiudad[];
  isNew: boolean = false;
  isNewCourier: boolean = false;
  loaderModal: boolean = false;
  modalRef: any;
  modalRefDetalle: any;
  gridCourier = new KendoGrid();
  gridCourierDetalle = new KendoGrid();
  subscription$: Subscription = new Subscription();

  formCourier: FormGroup = this.formBuilder.group({
    nombre: [null, Validators.required],
    idPais: [null, Validators.required],
    idCiudad: [null],
    direccion: [null, Validators.required],
    telefono: [null, Validators.pattern('[0-9]{1,15}')],
    url: [null, Validators.required],
  });

  formCourierDetalle: FormGroup = this.formBuilder.group({
    idPais: [null, Validators.required],
    idCiudad: [null],
    direccion: [null, Validators.required],
    telefono: [null, [Validators.required, Validators.pattern('[0-9]{1,15}')]],
    tiempoEnvio: [null, Validators.required],
  });

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  ngOnInit(): void {
    this.formService.erroMsj = {
      idPais: {
        required: 'Ingrese un Pais',
      },
      idCiudad: {
        required: 'Ingrese un Ciudad',
      },
      direccion: {
        required: 'Ingrese un direccion',
      },
      telefono: {
        required: 'Ingrese un telefono',
      },
      tiempoEnvio: {
        required: 'Ingrese un tiempoEnvior',
      },
    };
    this.configurarGrid();
    this.obtener();
    this.obtenerComboPais();
    this.obtenerComboCiudad();
  }

  ngOnDestroy(): void {}

  cargarCiudades(idPais: number, esDetalle: boolean): void {
    if (esDetalle) {
      if (idPais != null) {
        this.comboCiudadDetalle = this._ciudades.filter(
          (e) => e.idPais == idPais
        );
        this.formCourierDetalle.get('idCiudad').enable();
        this.formCourierDetalle.get('idCiudad').setValue(null);
      } else {
        this.comboCiudadDetalle = [];
        this.formCourierDetalle.get('idCiudad').disable();
      }
    } else {
      if (idPais != null) {
        this.comboCiudad = this._ciudades.filter((e) => e.idPais == idPais);
        this.formCourier.get('idCiudad').enable();
        this.formCourier.get('idCiudad').setValue(null);
      } else {
        this.comboCiudad = [];
        this.formCourier.get('idCiudad').disable();
      }
    }
  }

  procesarCourier(): Courier {
    let data = this.formCourier.getRawValue();

    let courier: Courier = {
      id: this.isNewCourier ? 0 : this.gridCourier.dataItemEditTemp.id,
      nombre: data.nombre,
      idPais: data.idPais,
      idCiudad: data.idCiudad,
      direccion: data.direccion,
      telefono: data.telefono,
      url: data.url,
    };
    return courier;
  }

  procesarCourierDetalle(): CourierDetalle {
    let data = this.formCourierDetalle.getRawValue();

    let courierDetalle: CourierDetalle = {
      id: 0,
      idCourier: this.gridCourier.dataItemEditTemp.id,
      idPais: data.idPais,
      idCiudad: data.idCiudad,
      direccion: data.direccion,
      telefono: data.telefono,
      tiempoEnvio: data.tiempoEnvio,
    };
    return courierDetalle;
  }
  obtener() {
    // this.gridCourier.data = [];
    this.gridCourier.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.CourierObtener)
      .subscribe({
        next: (resp: HttpResponse<Courier[]>) => {
          this.gridCourier.loading = false;
          console.log(resp.body);
          console.log(this.gridCourier.data);
          // this.gridCourier.data = resp.body;
          this.gridCourier.data$.next(resp.body);
        },
        error: (error) => {
          console.log(error);
          this.gridCourier.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerDetallePorIdCourier(id: number, context: any) {
    this.gridCourierDetalle.data = [];
    this.gridCourierDetalle.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.CourierDetalleObtenerPorIdCourier}/${id}`
      )
      .subscribe({
        next: (resp: HttpResponse<CourierDetalle[]>) => {
          this.gridCourierDetalle.loading = false;
          console.log(resp.body);
          console.log(this.gridCourierDetalle.data);
          this.gridCourierDetalle.data = resp.body;
          this.modalRef = this.modalService.open(context, {
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
          });
        },
        error: (error) => {
          console.log(error);
          this.gridCourierDetalle.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerDetalleCourier() {
    this.gridCourierDetalle.data = [];
    this.gridCourierDetalle.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.CourierDetalleObtenerPorIdCourier}/${this.gridCourier.dataItemEditTemp.id}`
      )
      .subscribe({
        next: (resp: HttpResponse<CourierDetalle[]>) => {
          this.gridCourierDetalle.loading = false;
          this.gridCourierDetalle.data = resp.body;
        },
        error: (error) => {
          this.gridCourierDetalle.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerComboPais() {
    this.integraService
      .getJsonResponse(constApiGlobal.PaisObtenerCombo)
      .subscribe({
        next: (resp: HttpResponse<CombosPais[]>) => {
          this.comboPais = resp.body;
        },
        error: (error) => {
          console.log(error);
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerComboCiudad() {
    this.integraService
      .getJsonResponse(constApiGlobal.CiudadObtenerCombo)
      .subscribe({
        next: (resp: HttpResponse<CombosCiudad[]>) => {
          this._ciudades = resp.body;
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  insertarCourier() {
    if (this.formCourier.valid) {
      console.log('ENTRO IF', this.formCourier);
      let jsonEnvio = this.procesarCourier();
      this.gridCourier.loading = true;
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.CourierInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<Courier>) => {
            this.gridCourier.loading = false;
            this.loaderModal = false;
            resp.body.ciudad = this._ciudades.find(
              (x) => x.id == resp.body.idCiudad
            ).nombre;
            resp.body.pais = this.comboPais.find(
              (x) => x.id == resp.body.idPais
            ).nombre;
            //this.gridCourier.data.unshift(resp.body);//NO FUNCIONA
            //this.gridCourier.data = [...this.gridCourier.data]; NO FUNCIONA
            this.gridCourier.loadData();
            this.modalRef.close();
            this.alertaService.mensajeExitoso();
            this.obtener();
          },
          error: (error) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Courier, revise que el Id no se repita.',
            });
            this.gridCourier.loading = false;
          },
        });
    } else {
      this.formCourier.markAllAsTouched();
    }
  }
  insertarCourierDetalle() {
    if (this.formCourierDetalle.valid) {
      let jsonEnvio = this.procesarCourierDetalle();
      this.gridCourierDetalle.loading = true;
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.CourierDetalleInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<CourierDetalle>) => {
            this.gridCourierDetalle.loading = false;
            this.loaderModal = false;
            resp.body.ciudad = this._ciudades.find(
              (x) => x.id == resp.body.idCiudad
            ).nombre;
            resp.body.pais = this.comboPais.find(
              (x) => x.id == resp.body.idPais
            ).nombre;
            this.gridCourierDetalle.data.unshift(resp.body);
            this.gridCourierDetalle.loadData();
            this.modalRefDetalle.close();
            this.alertaService.mensajeExitoso();
            //this.obtenerDetallePorIdCourier(resp.body.idCourier);
          },
          error: (error) => {
            this.loaderModal = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo guardar Detalles del Courier.',
              text: mensaje,
            });
            this.gridCourierDetalle.loading = false;
          },
        });
    } else {
      this.formCourierDetalle.markAllAsTouched();
    }
  }

  abrirModalCourier(context: any, dataItem?: Courier) {
    this.comboCiudad = [];
    this.comboCiudadDetalle = [];
    this.isNewCourier = true;
    this.formCourier.reset();
    if (dataItem != null) {
      this.isNewCourier = false;
      this.gridCourier.dataItemEditTemp = dataItem;
      this.formCourier.get('nombre').setValue(dataItem.nombre);
      this.formCourier.get('telefono').setValue(dataItem.telefono);
      this.formCourier.get('idPais').setValue(dataItem.idPais);
      this.cargarCiudades(dataItem.idPais, false);
      this.formCourier.get('idCiudad').setValue(dataItem.idCiudad);
      this.formCourier.get('direccion').setValue(dataItem.direccion);
      this.formCourier.get('url').setValue(dataItem.url);
      this.obtenerDetallePorIdCourier(dataItem.id, context);
    } else {
      // this.cargarCiudades(51, false);
      this.modalRef = this.modalService.open(context, {
        size: 'xl',
        backdrop: 'static',
        keyboard: false,
      });
    }
  }
  abrirModalCourierDetalle(context: any) {
    this.formCourierDetalle.reset();
    this.comboCiudadDetalle = [];
    // this.formCourierDetalle.get("idCiudad").disable();
    this.modalRefDetalle = this.modalService.open(context, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });
  }
  actualizarCourier() {
    if (this.formCourier.valid) {
      let jsonEnvio = this.procesarCourier();
      this.gridCourier.loading = true;
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(
          constApiPlanificacion.CourierActualizar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<Courier>) => {
            this.gridCourier.loading = false;

            resp.body.ciudad = this._ciudades.find(
              (x) => x.id == resp.body.idCiudad
            ).nombre;
            resp.body.pais = this.comboPais.find(
              (x) => x.id == resp.body.idPais
            ).nombre;
            this.gridCourier.assignValues(
              this.gridCourier.dataItemEditTemp,
              resp.body
            );
            this.gridCourier.loadData();
            this.modalRef.close();
            this.loaderModal = false;
            this.alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.modalRef.close();
            this.loaderModal = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo actualizar el Courier',
              text: mensaje,
            });
            this.gridCourier.loading = false;
          },
        });
    } else {
      this.formCourier.markAllAsTouched();
    }
  }

  eliminar(id: number, index: number) {
    this.gridCourier.loading = true;
    this.integraService
      .deleteJsonResponse(`${constApiPlanificacion.CourierEliminar}/${id}`)
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          console.log(resp.body);
          this.gridCourier.loading = false;
          if (resp.body) {
            this.gridCourier.data.splice(index, 1);
            this.gridCourier.loadView();
            this.alertaService.mensajeIcon(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
            this.obtener();
          }
        },
        error: (error) => {
          console.log(error);
          this.gridCourier.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  eliminarDetalle(id: number, index: number) {
    this.gridCourierDetalle.loading = true;
    this.integraService
      .deleteJsonResponse(
        `${constApiPlanificacion.CourierDetalleEliminar}/${id}`
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          console.log(resp.body);
          this.gridCourierDetalle.loading = false;
          if (resp.body) {
            this.gridCourierDetalle.data.splice(index, 1);
            this.gridCourierDetalle.loadView();
            this.alertaService.mensajeIcon(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
          }
        },
        error: (error) => {
          console.log(error);
          this.gridCourierDetalle.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  configurarGrid() {
    this.gridCourier.getRemoveEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminar(resp.dataItem.id, resp.index);
          }
        });
      },
    });
    this.gridCourierDetalle.getRemoveEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminarDetalle(resp.dataItem.id, resp.index);
            this.gridCourierDetalle.data.splice(resp.index, 1);
            this.gridCourierDetalle.data = [...this.gridCourierDetalle.data];
          }
        });
      },
    });
  }
  getErrorMessage(controlName: string): string {
    return this.formService.errorMessage(
      this.formCourier.get(controlName) as FormControl,
      controlName
    );
  }
  getErrorDetalleMessage(controlName: string): string {
    return this.formService.errorMessage(
      this.formCourierDetalle.get(controlName) as FormControl,
      controlName
    );
  }
}
