
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { ProgramaGeneralProblemaFactor } from '@planificacion/models/interfaces/ProgramaGeneralProblemaFactor';
import { constApiPlanificacion } from '@environments/constApi';


interface formProgramaGeneralProblemaFactor {
  id: number;
  nombre: string;
}
@Component({
  selector: 'app-programa-general-problema-factor',
  templateUrl: './programa-general-problema-factor.component.html',
  styleUrls: ['./programa-general-problema-factor.component.scss']
})
export class ProgramaGeneralProblemaFactorComponent  implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) {}

  griProblemaFactor: KendoGrid = new KendoGrid();
  enProcesoSolicitud: boolean = false;
  modalRef: NgbModalRef = null;
  isNew: boolean = false;
  dataItemTemp: ProgramaGeneralProblemaFactor;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  formProblemaFactor: FormGroup = this._formBuilder.group({
    nombre: [null, Validators.required],
  });

  ngOnInit(): void {
    this.obtener();
    this.configurarGrid();
  }
  obtener() {
    this.griProblemaFactor.loading = true;
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.ProgramaGeneralProblemaFactorObtener
      )
      .subscribe({
        next: (resp: HttpResponse<ProgramaGeneralProblemaFactor[]>) => {
          this.griProblemaFactor.data = resp.body;
          this.griProblemaFactor.loading = false;
        },
        error: (error) => {
          this.griProblemaFactor.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  /* ---------------- Abrir Modal--------------------- */

  abrirModal(
    context: any,
    isNew: boolean,
    dataItem?: ProgramaGeneralProblemaFactor
  ) {
    this.isNew = isNew;
    this.formProblemaFactor.reset();
    this.enProcesoSolicitud = false;
    if (!isNew) {
      this.dataItemTemp = dataItem;
      this.asignarValoresToForm(dataItem);
    } else {
      this.dataItemTemp = null;
    }
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
  /*   ------------------------------------------------------------------- */
  get TipoFormacionForm(): formProgramaGeneralProblemaFactor {
    return this.formProblemaFactor.getRawValue() as formProgramaGeneralProblemaFactor;
  }
  /* ---------------------------Asignar Vaalores  ------------------------------------*/
  asignarValoresToForm(dataItem: ProgramaGeneralProblemaFactor) {
    this.formProblemaFactor.get('nombre').setValue(dataItem.nombre);
  }
  /* --------------------------------Procesar Categoria Pregunta ------------------------------ */

  procesarTipoFormacion(): ProgramaGeneralProblemaFactor {
    let tipoFormacionD: ProgramaGeneralProblemaFactor = {
      id: this.isNew ? 0 : this.dataItemTemp.id,
      nombre: this.TipoFormacionForm.nombre,
    };
    return tipoFormacionD;
  }
  /* -------------------------------------------------------------------------------- */
  configurarGrid() {
    this.griProblemaFactor.habilitarEstadoNewRow = true;
  }




  /* ---------------Guardar Nuevo Categoria Pregunta ------------------------*/
    guardar() {
      console.log(this.formProblemaFactor.value);
      if (this.formProblemaFactor.valid) {
        let jsonEnvio = this.procesarTipoFormacion();
        this.griProblemaFactor.loading = true;
  
        this.enProcesoSolicitud = true;
        this._integraService
          .postJsonResponse(
            constApiPlanificacion.ProgramaGeneralProblemaFactorInsertar,
            JSON.stringify(jsonEnvio)
          )
          .subscribe({
            next: (resp: HttpResponse<ProgramaGeneralProblemaFactor>) => {
              this.griProblemaFactor.loading = false;
  
              this.enProcesoSolicitud = false;
              this.griProblemaFactor.data.unshift(resp.body);
              this.griProblemaFactor.loadData();
              this.obtener();
              this.modalRef.close();
              this._alertaService.mensajeExitoso();
            },
            error: (error) => {
              this.griProblemaFactor.loading = false;
              this.enProcesoSolicitud = false;
              this._alertaService.notificationWarning(error.message);
              this._alertaService.swalFireOptions({
                icon: 'error',
                text: 'No se pudo guardar el Dato',
              });
            },
          });
      } else {
        this.formProblemaFactor.markAllAsTouched();
        this.griProblemaFactor.loading = false;
        this.enProcesoSolicitud = false;
        this._alertaService.mensajeIcon(
          'Complete por favor los campos obligatorios!'
        );
      }
    }
  
  
     /* -----------------------------------Actualizar ------------------------- */
  
    // Metodo se encarga de Actualizar la data de las tablas
    actualizar() {
      if (this.formProblemaFactor.valid) {
        this.enProcesoSolicitud = true;
  
        const materialAccion = this.procesarTipoFormacion();
  
        this.griProblemaFactor.loading = true;
  
        this._integraService
          .putJsonResponse(
            constApiPlanificacion.ProgramaGeneralProblemaFactorActualizar,
            JSON.stringify(materialAccion)
          )
          .subscribe({
            next: (resp: HttpResponse<ProgramaGeneralProblemaFactor>) => {
              /*  this.dataItemTemp.estado = resp.body.estado; */
              this.griProblemaFactor.loading = false;
              this.modalRef.close();
              this.obtener();
              this.griProblemaFactor.loadData();
              this._alertaService.mensajeExitoso();
              this.enProcesoSolicitud = false;
            },
            error: (error) => {
              console.log(error);
              this.griProblemaFactor.loading = false;
              this.enProcesoSolicitud = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      } else {
        this.formProblemaFactor.markAllAsTouched();
        this.griProblemaFactor.loading = false;
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
      title: '¿Estás seguro de eliminar la Tipo Formacion?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let index = this.griProblemaFactor.data.findIndex(
          (x) => x.id === id
        );
        if (index != -1) {
        }
        this.griProblemaFactor.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.ProgramaGeneralProblemaFactorEliminar}/${id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.griProblemaFactor.loading = false;
              if (response.body === true) {
                this.griProblemaFactor.data.splice(index, 1);
                this.griProblemaFactor.loadView();
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
              this.griProblemaFactor.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }
  
  
  
}
