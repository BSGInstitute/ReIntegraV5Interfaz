import { Subscription } from 'rxjs';
import { constApiGestionPersonal } from '@environments/constApi';
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-treelist';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { FormService } from '@shared/services/form.service';
import Swal from 'sweetalert2';

interface PuestoTrabajoNivel {
  id: number;
  nombre: string;
  descripcion: string;
}

/**
 * @module GestionPersonasModule
 * @description Componente de Nivel De Puestos de Trabajo
 * @author Marco Jose Villanueva Torres
 * @version 1.0.0
 * @history
   26/12/2022 Implementacion del modulo de Nivel de Puestos de Trabajo
 */
@Component({
  selector: 'app-nivel-puesto-trabajo',
  templateUrl: './nivel-puesto-trabajo.component.html',
  styleUrls: ['./nivel-puesto-trabajo.component.scss'],
})
export class NivelPuestoTrabajoComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private formService: FormService
  ) {}

  formPuestos: FormGroup = this._formBuilder.group({
    nombre: [null, [Validators.required, Validators.maxLength(50)]],
    descripcion: null,
    usuario: null,
  });
  subscriptions: Subscription = new Subscription();
  isNew: boolean = false;
  dataItemTemp: PuestoTrabajoNivel;
  modalRef: NgbModalRef = null;
  enProcesoSolicitud: boolean = false;
  gridNivelPuestoTrabajo: KendoGrid = new KendoGrid();
  loaderModal: boolean = false;
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
    this.gridNivelPuestoTrabajo.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerMaestroPuestoNivelTRabajo)
      .subscribe({
        next: (resp: HttpResponse<PuestoTrabajoNivel[]>) => {
          this.gridNivelPuestoTrabajo.data = resp.body;
          this.gridNivelPuestoTrabajo.loading = false;
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridNivelPuestoTrabajo.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  asignarValoresToForm(dataItem: PuestoTrabajoNivel) {
    this.formPuestos.get('nombre').setValue(dataItem.nombre);
    this.formPuestos.get('descripcion').setValue(dataItem.descripcion);
  }
  /* ---------------- Abrir Modal--------------------- */

  abrirModal(context: any, dataItem?: PuestoTrabajoNivel) {
    this.isNew = false;
    this.formPuestos.reset();
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

  /**
   * Valida el formulario de MensajeTiempoInactivo
   * @returns
   */
  validarErrorControl() {
    if (!this.formPuestos.get('nombre').value) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Completar el Formulario, por favor!',
        })
        .then(() => {
          this.formPuestos.markAllAsTouched();
        });
      return true;
    }
    if (this.formPuestos.get('nombre').value.trim() == '') {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: '¡Ingrese un Nombre valido!',
        })
        .then(() => {
          this.formPuestos.markAllAsTouched();
        });
      return true;
    }

    if (this.formPuestos.get('nombre').value.trim().length > 50) {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: 'El Mensaje contiene mas de 50 caracteres!',
        })
        .then(() => {
          this.formPuestos.markAllAsTouched();
        });
      return true;
    }
    return false;
  }
  /* ---------------Guardar Nuevo Nivel Puesto Trabajo ------------------------*/
  guardar() {
    if (this.validarErrorControl()) {
      return;
    }
    if (this.formPuestos.valid) {
      let jsonEnvio = this.procesarPuesto();
      this.gridNivelPuestoTrabajo.loading = true;
      this.enProcesoSolicitud = true;
      this._integraService
        .postJsonResponse(
          constApiGestionPersonal.InsertarMaestroPuestoNivelTRabajo,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<PuestoTrabajoNivel>) => {
            this.gridNivelPuestoTrabajo.loading = false;
            this.obtener();
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.gridNivelPuestoTrabajo.loading = false;
            this.enProcesoSolicitud = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Puesto de trabajo',
            });
          },
        });
    } else {
      this.formPuestos.markAllAsTouched();
      this.gridNivelPuestoTrabajo.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }

  get PuestoTrabajoNivelForm(): {
    nombre: string;
    descripcion: string;
    usuario: string;
  } {
    return this.formPuestos.getRawValue() as {
      nombre: string;
      descripcion: string;
      usuario: string;
    };
  }

  procesarPuesto(): PuestoTrabajoNivel {
    let certPuestoNivel: PuestoTrabajoNivel = {
      id: this.isNew ? 0 : this.dataItemTemp.id, // Usa this.dataItemPartnerTmp.id si no es un nuevo registro
      nombre: this.PuestoTrabajoNivelForm.nombre,
      descripcion: this.PuestoTrabajoNivelForm.descripcion,
    };
    return certPuestoNivel;
  }
  /* -----------------------------------Actualizar ------------------------- */

  // Metodo se encarga de Actualizar la data de las tablas
  actualizar() {
    if (this.validarErrorControl()) {
      return;
    }
    const materialAccion = this.procesarPuesto();
    if (this.formPuestos.valid) {
      this.gridNivelPuestoTrabajo.loading = true;
      this.enProcesoSolicitud = true;
      let sub1$ = this._integraService
        .putJsonResponse(
          constApiGestionPersonal.ActualizarMaestroPuestoNivelTRabajo,
          JSON.stringify(materialAccion)
        )
        .subscribe({
          next: (resp: HttpResponse<PuestoTrabajoNivel>) => {
            this.dataItemTemp.nombre = resp.body.nombre;
            this.dataItemTemp.descripcion = resp.body.descripcion;
            this.gridNivelPuestoTrabajo.loading = false;
            this.modalRef.close();
            this.gridNivelPuestoTrabajo.loadData();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            console.log(error);
            this.gridNivelPuestoTrabajo.loading = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
          complete: () => {
            this.enProcesoSolicitud = false; // Asegúra el restablecer la bandera en ambos casos (éxito o error)
          },
        });

      this.subscriptions.add(sub1$);
    } else {
      this.formPuestos.markAllAsTouched();
      this.gridNivelPuestoTrabajo.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }

  //   ------------------------------------Metodo Eliminar --------------------------- /
  eliminar(id: number) {
    // Usar SweetAlert para mostrar un mensaje de confirmación
    this.enProcesoSolicitud = true;
    Swal.fire({
      title: '¿Estás seguro de eliminar el Registro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.gridNivelPuestoTrabajo.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiGestionPersonal.EliminarMaestroPuestoNivelTRabajo}/${id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.gridNivelPuestoTrabajo.loading = false;
              if (response.body === true) {
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
              this.gridNivelPuestoTrabajo.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }
}
