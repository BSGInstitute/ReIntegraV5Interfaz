import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  constApiGestionPersonal,
} from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { FormService } from '@shared/services/form.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { PageSizeItem } from '@progress/kendo-angular-grid';

interface PersonalAreaTrabajo {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
}

/**
 * @module PersonalAreaTrabajoModule
 * @description Componente de Personal Area Trabajo
 * @author Marco Jose Villanueva Torres
 * @version 1.0.0
 * @history
   15/01/2024 Implementacion del modulo de Personal Area Trabajo
 */
@Component({
  selector: 'app-personal-area-trabajo',
  templateUrl: './personal-area-trabajo.component.html',
  styleUrls: ['./personal-area-trabajo.component.scss'],
})
export class PersonalAreaTrabajoComponent implements OnInit, OnDestroy {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private formService: FormService
  ) {}

  formAreaTrabajo: FormGroup = this._formBuilder.group({
    nombre: [null, [Validators.required,Validators.maxLength(50)]],
    codigo: [null, [Validators.required,Validators.maxLength(3)]],
    descripcion: [null, Validators.required]
  });

  subscriptions: Subscription = new Subscription();
  isNew: boolean = false;
  gridPersonalAreaTrabajo: KendoGrid = new KendoGrid();
  enProcesoSolicitud: boolean = false;
  modalRef: NgbModalRef = null;
  dataItemTemp: PersonalAreaTrabajo;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  ngOnInit(): void {
    this.obtener();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  obtener() {
    this.gridPersonalAreaTrabajo.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.PersonalAreaTrabajoObtener)
      .subscribe({
        next: (resp: HttpResponse<PersonalAreaTrabajo[]>) => {
          this.gridPersonalAreaTrabajo.data = resp.body;
          this.gridPersonalAreaTrabajo.loading = false;
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridPersonalAreaTrabajo.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  asignarValoresToForm(dataItem: PersonalAreaTrabajo) {
    this.formAreaTrabajo.get('nombre').setValue(dataItem.nombre);
    this.formAreaTrabajo.get('codigo').setValue(dataItem.codigo);
    this.formAreaTrabajo.get('descripcion').setValue(dataItem.descripcion);
  }
  /* ---------------- Abrir Modal--------------------- */

  abrirModal(context: any, dataItem?: PersonalAreaTrabajo) {
    this.isNew = false;
    this.formAreaTrabajo.reset();
    this.enProcesoSolicitud = false;
    if (dataItem != null) {
      this.dataItemTemp = dataItem;

      this.asignarValoresToForm(dataItem);
    } else {
      this.dataItemTemp = null;
      this.isNew = true;
    }
    this.modalRef = this._modalService.open(context, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });
  }

  get PersonalAreaTrabajoForm(): {
    nombre: string;
    descripcion: string;
    codigo: string;
  } {
    return this.formAreaTrabajo.getRawValue() as {
      nombre: string;
      descripcion: string;
      codigo: string;
    };
  }

  procesarAreaTrabajo(): PersonalAreaTrabajo {
    let PerAreaTrabajo: PersonalAreaTrabajo = {
      id: this.isNew ? 0 : this.dataItemTemp.id, // Usa this.dataItemPartnerTmp.id si no es un nuevo registro
      nombre: this.PersonalAreaTrabajoForm.nombre,
      codigo: this.PersonalAreaTrabajoForm.codigo,
      descripcion: this.PersonalAreaTrabajoForm.descripcion,
    };
    return PerAreaTrabajo;
  }

/**
   * Valida el formulario de MensajeTiempoInactivo
   * @returns
   */
validarErrorControl() {
  if (!this.formAreaTrabajo.get('nombre').value || !this.formAreaTrabajo.get('codigo').value || !this.formAreaTrabajo.get('descripcion').value) {
    this._alertaService
      .swalFireOptions({
        icon: 'info',
        title: '¡Completar el Formulario, por favor!',
      })
      .then(() => {
        this.formAreaTrabajo.markAllAsTouched();
      });
    return true;
  }
  if (this.formAreaTrabajo.get('nombre').value.trim() == '') {
    this._alertaService
      .swalFireOptions({
        icon: 'info',
        title: '¡Ingrese un Nombre valido!',
      })
      .then(() => {
        this.formAreaTrabajo.markAllAsTouched();
      });
    return true;
  }

  if (this.formAreaTrabajo.get('nombre').value.trim().length > 50) {
    this._alertaService
      .swalFireOptions({
        icon: 'info',
        title: 'El Mensaje contiene mas de 50 caracteres!',
      })
      .then(() => {
        this.formAreaTrabajo.markAllAsTouched();
      });
    return true;
  }
  if (this.formAreaTrabajo.get('codigo').value.trim().length == '') {
    this._alertaService
      .swalFireOptions({
        icon: 'info',
        title: '¡Ingrese un Código valido!',
      })
      .then(() => {
        this.formAreaTrabajo.markAllAsTouched();
      });
    return true;
  }
  if (this.formAreaTrabajo.get('codigo').value.trim().length > 3) {
    this._alertaService
      .swalFireOptions({
        icon: 'info',
        title: 'El Código contiene mas de 3 caracteres!',
      })
      .then(() => {
        this.formAreaTrabajo.markAllAsTouched();
      });
    return true;
  }
  return false;
}

  //Metodo Insertar
  insertar() {
    if (this.validarErrorControl()) {
      return;
    }
    this.enProcesoSolicitud = true;
    if (this.formAreaTrabajo.valid) {
      let jsonEnvio = this.procesarAreaTrabajo();
      this.gridPersonalAreaTrabajo.loading = true;
      this._integraService
        .postJsonResponse(
          constApiGestionPersonal.PersonalAreaTrabajoInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<PersonalAreaTrabajo>) => {
            this.gridPersonalAreaTrabajo.loading = false;
            this.enProcesoSolicitud = false;
            this.gridPersonalAreaTrabajo.data.unshift(resp.body);
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
            this.gridPersonalAreaTrabajo.loadData();
          },
          error: (error) => {
            this.gridPersonalAreaTrabajo.loading = false;
            this.enProcesoSolicitud = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Area de Trabajo',
            });
            this.gridPersonalAreaTrabajo.loading = false;
          },
        });
    } else {
      this.formAreaTrabajo.markAllAsTouched();
      this.gridPersonalAreaTrabajo.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }
  actualizar() {
    if (this.validarErrorControl()) {
      return;
    }
    if (this.formAreaTrabajo.valid) {
      this.enProcesoSolicitud = true;
      const materialAccion = this.procesarAreaTrabajo();
      this.gridPersonalAreaTrabajo.loading = true;
      this._integraService
        .putJsonResponse(
          constApiGestionPersonal.PersonalAreaTrabajoActualizar,
          JSON.stringify(materialAccion)
        )
        .subscribe({
          next: (resp: HttpResponse<PersonalAreaTrabajo>) => {
            this.dataItemTemp.codigo = resp.body.codigo;
            this.dataItemTemp.nombre = resp.body.nombre;
            this.dataItemTemp.codigo = resp.body.codigo;
            this.dataItemTemp.descripcion = resp.body.descripcion;
            /*  this.dataItemTemp.estado = resp.body.estado; */
            this.gridPersonalAreaTrabajo.loading = false;
            this.modalRef.close();
            this.gridPersonalAreaTrabajo.loadData();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            console.log(error);
            this.gridPersonalAreaTrabajo.loading = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formAreaTrabajo.markAllAsTouched();
      this.gridPersonalAreaTrabajo.loading = false;
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
      title: '¿Estás seguro de eliminar el Area?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let index = this.gridPersonalAreaTrabajo.data.findIndex(
          (x) => x.id === id
        );
        if (index != -1) {
        }
        this.gridPersonalAreaTrabajo.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiGestionPersonal.PersonalAreaTrabajoEliminar}/${id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.gridPersonalAreaTrabajo.loading = false;
              if (response.body === true) {
                this.gridPersonalAreaTrabajo.data.splice(index, 1);
                this.gridPersonalAreaTrabajo.loadView();
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
              this.gridPersonalAreaTrabajo.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }
}
