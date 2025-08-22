import { CriterioEvaluacionProceso, CriterioEvaluacionProcesoExamen } from './../../models/criterioEvaluacionProceso';
import { TipoFormacion } from './../../models/tipoFormacion';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { constApiGestionPersonal } from '@environments/constApi';
import Swal from 'sweetalert2';
import { PageSizeItem } from '@progress/kendo-angular-grid';

interface formCriterioEvaluacionProceso {
  id: number;
  nombre: string;
  relacionado:boolean;
}

/**
 * @module  CriterioEvaluacionModule
 * @description Componente de Criterio Evaluacion
 * @author Marco Jose Villanueva Torres
 * @version 1.0.0
 * @history
   30/04/2024 Implementacion del modulo  Criterio Evaluacion
 */

@Component({
  selector: 'app-criterio-evaluacion-proceso',
  templateUrl: './criterio-evaluacion-proceso.component.html',
  styleUrls: ['./criterio-evaluacion-proceso.component.scss'],
})
export class CriterioEvaluacionProcesoComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) {}


  gridCriterioEvaluacionProceso = new KendoGrid<CriterioEvaluacionProceso>();
  enProcesoSolicitud: boolean = false;
  modalRef: NgbModalRef = null;
  isNew: boolean = false;
  dataItemTemp: CriterioEvaluacionProceso;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  formCriterioEvaluacionProceso: FormGroup = this._formBuilder.group({
    nombre: [null, Validators.required],
    relacionado:false,
  });

  ngOnInit(): void {
    this.obtener();
    this.configurarGrid();
  }

  /**
   * Obtiene  los criterios de evaluación procesos desde el servicio y los carga en la grilla
   */
  obtener() {
    this.gridCriterioEvaluacionProceso.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.CriterioEvaluacionProcesoObtener)
      .subscribe({
        next: (resp: HttpResponse<CriterioEvaluacionProcesoExamen[]>) => {
          this.gridCriterioEvaluacionProceso.data = resp.body;
          this.gridCriterioEvaluacionProceso.loading = false;
        },
        error: (error) => {
          this.gridCriterioEvaluacionProceso.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  /* ---------------- Abrir Modal--------------------- */

  /**
   * abrirModal  agrega o edita un registro a partir del modal  
   * @param context 
   * @param isNew 
   * @param dataItem 
   */
  abrirModal(
    context: any,
    isNew: boolean,
    dataItem?: CriterioEvaluacionProcesoExamen
  ) {
    this.isNew = isNew;
    this.formCriterioEvaluacionProceso.reset();
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
  get CriterioEvaluacionProcesoForm(): formCriterioEvaluacionProceso {
    return this.formCriterioEvaluacionProceso.getRawValue() as formCriterioEvaluacionProceso;
  }
  /* ---------------------------Asignar Vaalores  ------------------------------------*/
  asignarValoresToForm(dataItem: CriterioEvaluacionProcesoExamen) {
    this.formCriterioEvaluacionProceso.get('nombre').setValue(dataItem.nombre);
    this.formCriterioEvaluacionProceso.get('relacionado').setValue(dataItem.relacionado);
  }
  /*   ------------------------------------------------------------------- */

  /* --------------------------------Procesar Categoria Pregunta ------------------------------ */
/**
 * procesarCriterioEvaluacionProceso  
 * Procesa la solicitud de Agregar/Editar Criterios Evaluación Procesos Exámenes 
 * @returns 
 */
  procesarCriterioEvaluacionProceso(): CriterioEvaluacionProceso {
    let CriterioEvaluacionProcesoD: CriterioEvaluacionProceso = {
      id: this.isNew ? 0 : this.dataItemTemp.id,
      nombre: this.CriterioEvaluacionProcesoForm.nombre,

    };
    return CriterioEvaluacionProcesoD;
  }
  /* -------------------------------------------------------------------------------- */
  configurarGrid() {
    this.gridCriterioEvaluacionProceso.habilitarEstadoNewRow = true;
  }

/**
 * guardar NuevoRegistro  
 * Guarda el nuevo registro del Formulario en el servicio de Conexión y actualiza los datos de la grilla
 * @param $event Objeto con el evento de pulsación sobre el botón de Guardar
 */
  guardar() {
    console.log(this.formCriterioEvaluacionProceso.value);
    if (this.formCriterioEvaluacionProceso.valid) {
      let jsonEnvio = this.procesarCriterioEvaluacionProceso();
      this.gridCriterioEvaluacionProceso.loading = true;

      this.enProcesoSolicitud = true;
      this._integraService
        .postJsonResponse(
          constApiGestionPersonal.CriterioEvaluacionProcesoInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<CriterioEvaluacionProcesoExamen>) => {
            this.gridCriterioEvaluacionProceso.loading = false;

            this.enProcesoSolicitud = false;
            this.gridCriterioEvaluacionProceso.data.unshift(resp.body);
            this.gridCriterioEvaluacionProceso.loadData();
            this.obtener();
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.gridCriterioEvaluacionProceso.loading = false;
            this.enProcesoSolicitud = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Dato',
            });
          },
        });
    } else {
      this.formCriterioEvaluacionProceso.markAllAsTouched();
      this.gridCriterioEvaluacionProceso.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }


/* -----------------------------------Actualizar ------------------------- */

  // Metodo se encarga de Actualizar la data de las tablas
  actualizar() {
    if (this.formCriterioEvaluacionProceso.valid) {
      this.enProcesoSolicitud = true;

      const materialAccion = this.procesarCriterioEvaluacionProceso();

      this.gridCriterioEvaluacionProceso.loading = true;

      this._integraService
        .putJsonResponse(
          constApiGestionPersonal.CriterioEvaluacionProcesoActualizar,
          JSON.stringify(materialAccion)
        )
        .subscribe({
          next: (resp: HttpResponse<CriterioEvaluacionProceso>) => {
            /*  this.dataItemTemp.estado = resp.body.estado; */
            this.gridCriterioEvaluacionProceso.loading = false;
            this.modalRef.close();
            this.obtener();
            this.gridCriterioEvaluacionProceso.loadData();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            console.log(error);
            this.gridCriterioEvaluacionProceso.loading = false;
            this.enProcesoSolicitud = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formCriterioEvaluacionProceso.markAllAsTouched();
      this.gridCriterioEvaluacionProceso.loading = false;
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
    title: '¿Estás seguro de eliminar el Criterio Evaluacion?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, Eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      let index = this.gridCriterioEvaluacionProceso.data.findIndex(
        (x) => x.id === id
      );
      if (index != -1) {
      }
      this.gridCriterioEvaluacionProceso.loading = true;
      this._integraService
        .deleteJsonResponse(
          `${constApiGestionPersonal.CriterioEvaluacionProcesoEliminar}/${id}`
        )
        .subscribe({
          next: (response: HttpResponse<boolean>) => {
            this.gridCriterioEvaluacionProceso.loading = false;
            if (response.body === true) {
              this.gridCriterioEvaluacionProceso.data.splice(index, 1);
              this.gridCriterioEvaluacionProceso.loadView();
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
            this.gridCriterioEvaluacionProceso.loading = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    }
  });
}







}
