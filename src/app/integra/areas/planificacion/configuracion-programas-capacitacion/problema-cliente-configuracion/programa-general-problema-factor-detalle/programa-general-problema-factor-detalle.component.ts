import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { PageSizeItem, DataItem } from '@progress/kendo-angular-grid';
import { ProgramaGeneralProblemaFactorDetalle } from '@planificacion/models/interfaces/ProgramaGeneralProblemaFactor';
import { constApiPlanificacion } from '@environments/constApi';

interface formProgramaGeneralProblemaFactorDetalle {
  id: number;
  nombre: string;
  titulo: string;
}

@Component({
  selector: 'app-programa-general-problema-factor-detalle',
  templateUrl: './programa-general-problema-factor-detalle.component.html',
  styleUrls: ['./programa-general-problema-factor-detalle.component.scss']
})
export class ProgramaGeneralProblemaFactorDetalleComponent implements OnInit {

  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) {}

  griProblemaFactorDetalle: KendoGrid = new KendoGrid();
  enProcesoSolicitud: boolean = false;
  modalRef: NgbModalRef = null;
  isNew: boolean = false;
  dataItemTemp: ProgramaGeneralProblemaFactorDetalle;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  formProblemaFactorDetalle: FormGroup = this._formBuilder.group({
    nombre: [null, Validators.required],
    titulo: [null],
  });

  ngOnInit(): void {
    this.obtener();
    this.configurarGrid();
  }
  obtener() {
    this.griProblemaFactorDetalle.loading = true;
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.ProgramageneralproblemaFactorDetalleObtener
      )
      .subscribe({
        next: (resp: HttpResponse<ProgramaGeneralProblemaFactorDetalle[]>) => {
          this.griProblemaFactorDetalle.data = resp.body;
          this.griProblemaFactorDetalle.loading = false;
        },
        error: (error) => {
          this.griProblemaFactorDetalle.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  /* ---------------- Abrir Modal--------------------- */

  abrirModal(
    context: any,
    isNew: boolean,
    dataItem?: ProgramaGeneralProblemaFactorDetalle
  ) {
    this.isNew = isNew;
    this.formProblemaFactorDetalle.reset();
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
  get ProblemaDetalleForm(): formProgramaGeneralProblemaFactorDetalle {
    return this.formProblemaFactorDetalle.getRawValue() as formProgramaGeneralProblemaFactorDetalle;
  }
  /* ---------------------------Asignar Vaalores  ------------------------------------*/
  asignarValoresToForm(dataItem: ProgramaGeneralProblemaFactorDetalle) {
    this.formProblemaFactorDetalle.get('nombre')!.setValue(dataItem.nombre);
    this.formProblemaFactorDetalle.get('titulo')!.setValue(dataItem.titulo);
  }
  /* --------------------------------Procesar Categoria Pregunta ------------------------------ */

  procesarTipoFormacion(): ProgramaGeneralProblemaFactorDetalle {
    let problemadetalle: ProgramaGeneralProblemaFactorDetalle = {
      id: this.isNew ? 0 : this.dataItemTemp.id,
      nombre: this.ProblemaDetalleForm.nombre,
      titulo: this.ProblemaDetalleForm.titulo,
    };
    return problemadetalle;
  }
  /* -------------------------------------------------------------------------------- */
  configurarGrid() {
    this.griProblemaFactorDetalle.habilitarEstadoNewRow = true;
  }

  /* ---------------Guardar Nuevo Categoria Pregunta ------------------------*/
  guardar() {
    console.log(this.formProblemaFactorDetalle.value);
    if (this.formProblemaFactorDetalle.valid) {
      let jsonEnvio = this.procesarTipoFormacion();
      this.griProblemaFactorDetalle.loading = true;

      this.enProcesoSolicitud = true;
      this._integraService
        .postJsonResponse(
          constApiPlanificacion.ProgramageneralproblemaFactorDetalleInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<ProgramaGeneralProblemaFactorDetalle>) => {
            this.griProblemaFactorDetalle.loading = false;

            this.enProcesoSolicitud = false;
            this.griProblemaFactorDetalle.data.unshift(resp.body);
            this.griProblemaFactorDetalle.loadData();
            this.obtener();
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.griProblemaFactorDetalle.loading = false;
            this.enProcesoSolicitud = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Dato',
            });
          },
        });
    } else {
      this.formProblemaFactorDetalle.markAllAsTouched();
      this.griProblemaFactorDetalle.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }

  /* -----------------------------------Actualizar ------------------------- */

  // Metodo se encarga de Actualizar la data de las tablas
  actualizar() {
    if (this.formProblemaFactorDetalle.valid) {
      this.enProcesoSolicitud = true;

      const materialAccion = this.procesarTipoFormacion();

      this.griProblemaFactorDetalle.loading = true;

      this._integraService
        .putJsonResponse(
          constApiPlanificacion.ProgramageneralproblemaFactorDetalleActualizar,
          JSON.stringify(materialAccion)
        )
        .subscribe({
          next: (resp: HttpResponse<ProgramaGeneralProblemaFactorDetalle>) => {
            /*  this.dataItemTemp.estado = resp.body.estado; */
            this.griProblemaFactorDetalle.loading = false;
            this.modalRef.close();
            this.obtener();
            this.griProblemaFactorDetalle.loadData();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            console.log(error);
            this.griProblemaFactorDetalle.loading = false;
            this.enProcesoSolicitud = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formProblemaFactorDetalle.markAllAsTouched();
      this.griProblemaFactorDetalle.loading = false;
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
        let index = this.griProblemaFactorDetalle.data.findIndex(
          (x) => x.id === id
        );
        if (index != -1) {
        }
        this.griProblemaFactorDetalle.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.ProgramageneralproblemaFactorDetalleEliminar}/${id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.griProblemaFactorDetalle.loading = false;
              if (response.body === true) {
                this.griProblemaFactorDetalle.data.splice(index, 1);
                this.griProblemaFactorDetalle.loadView();
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
              this.griProblemaFactorDetalle.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }
}
