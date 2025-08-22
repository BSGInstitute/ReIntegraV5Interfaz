import { ListaEsquemaDetalle } from './../../models/interfaces/maestro_esquema-evaluación';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormService } from '@shared/services/form.service';

import {
  EsquemaEvaluacion,
  EsquemaEvaluacionDetalle,
} from '@planificacion/models/interfaces/maestro_esquema-evaluación';
import { constApiPlanificacion } from '@environments/constApi';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import {
  GridDataResult,
  DataStateChangeEvent,
} from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  process,
  State,
} from '@progress/kendo-data-query';
import { constApi } from '@environments/constApi';

import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

interface formEsquemaEvaluacion1 {
  nombre: string;
  idFormaCalculoEvaluacion: number;
  idModalidadCurso: number;
}
interface CriterioEvaluacionModalidadCurso {
  id: number;
  nombre: string;
  idModalidadCurso: number;
}
interface GridEEDetalle {
  idCriterioEvaluacion: number;
  ponderacion: string;
}

@Component({
  selector: 'app-esquema-ponderacion-evaluacion',
  templateUrl: './esquema-ponderacion-evaluacion.component.html',
  styleUrls: ['./esquema-ponderacion-evaluacion.component.scss'],
})
export class EsquemaPonderacionEvaluacionComponent
  implements OnInit, OnDestroy
{
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private formService: FormService
  ) {}
  /* -------------------------Variables ---------------------------- */
  isNew: boolean = false;
  enProcesoSolicitud: boolean = false;
  dataItemTemp: EsquemaEvaluacion;
  valorBandera: any;
  idModalidadCurso = new FormControl(null, Validators.required);
  idCriterioEvaluacion = new FormControl(null, Validators.required);
  dataItemTemp2: EsquemaEvaluacionDetalle;
  gridEsquemaEvaluacion: KendoGrid = new KendoGrid();
  gridCriterioEvaluacion: KendoGrid = new KendoGrid();
  DataFormaCalculoEvaluacion: IComboBase1[] = [];
  DataCriterioEvaluacion: CriterioEvaluacionModalidadCurso[] = [];
  DataModalidadCurso: IComboBase1[] = [];
  gridEsquemaEvaluacionDetalle: KendoGrid = new KendoGrid();
  modalRef: NgbModalRef = null;
  formEsquemaEvaluacion: FormGroup = this._formBuilder.group({
    nombre: [null, Validators.required],
    idFormaCalculoEvaluacion: [null, Validators.required],
    idModalidadCurso: [null, Validators.required],
  });
  formEsquemaEvaluciacionDetalle: FormGroup = this._formBuilder.group({
    idCriterioEvaluacion: [null],
    idEsquemaEvaluacion: [null],
    ponderacion: [null],
  });

  subscriptions: Subscription = new Subscription();
  /* ----------------------------------------------------------------- */
  ngOnInit(): void {
    // this.obtener();
    this.configurarGrid();
    this.obtenerCriterioEvaluacionModalidadCurso();
    this.obtenerModalidadCurso();
    this.obtenerFormaCalculoEvaluacion();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  // In your component class
  public isGridDisabled: boolean = true; // Initialize it as disabled by default

  /* -----------------ObtenerDatosdel Grid General de EsquemaEvalucion */
  obtener() {
    this.gridEsquemaEvaluacion.loading = true;
    this._integraService
      .getJsonResponse(constApiPlanificacion.EsquemaEvaluacionObtener)
      .subscribe({
        next: (resp: HttpResponse<EsquemaEvaluacion[]>) => {
          this.gridEsquemaEvaluacion.data = resp.body;
          this.gridEsquemaEvaluacion.data.forEach((element: any) => {
            element.FormaCalculoEvaluacion =
              this.getNombreFormaCalculoEvaluacion(
                element.idFormaCalculoEvaluacion
              );
          });
          this.gridEsquemaEvaluacion.loading = false;
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridEsquemaEvaluacion.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  /* -----------------ObtenerDatos para el dropdownList de ModalidaCurso----------- */
  obtenerModalidadCurso() {
    this._integraService
      .getJsonResponse(constApi.ProgramaGeneralModalidadCursoObtenerCombo)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.DataModalidadCurso = resp.body;
        },
        error: (error) => {
          console.log('aqui entro error');
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  /* -----------------ObtenerDatos para el dropdownList de FormaCalculoEvaluacion----------- */
  obtenerFormaCalculoEvaluacion() {
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.EsquemaEvaluacionObtenerFormaCalculoEvaluacion
      )
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.DataFormaCalculoEvaluacion = resp.body;
          this.obtener();
        },
        error: (error) => {
          console.log('aqui entro error');
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  getNombreFormaCalculoEvaluacion(id: number): string {
    const formaCalculo = this.DataFormaCalculoEvaluacion.find(
      (item) => item.id === id
    );
    return formaCalculo ? formaCalculo.nombre : 'Desconocido';
  }
  /* -----------------ObtenerDatos para el dropdownList de CriterioEvaluacionModalidadCurso----------- */
  obtenerCriterioEvaluacionModalidadCurso() {
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.CriterioEvaluacionModalidadCursoObtenerCombosCriteriosEvaluacionModalidad
      )
      .subscribe({
        next: (resp: HttpResponse<CriterioEvaluacionModalidadCurso[]>) => {
          this.DataCriterioEvaluacion = resp.body;
          console.log('Criterios', this.DataCriterioEvaluacion);
        },
        error: (error) => {
          console.log('aqui entro error');
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  /* -----------------ObtenerDatos para el grid de ListadoDetalle----------- */
  obtenerListadoDetalle() {
    console.log(this.dataItemTemp.id);
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.EsquemaEvaluacionDetalleObtenerporId +
          '/' +
          this.dataItemTemp.id
      )
      .subscribe({
        next: (resp: HttpResponse<EsquemaEvaluacionDetalle[]>) => {
          this.gridEsquemaEvaluacionDetalle.data = resp.body;
        },

        error: (error) => {
          console.log('aqui entro error');
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  /* --------------------------    Abrir Modal ----------------------------- */
  abrirModalNuevo(context: any, isNew: boolean, dataItem?: EsquemaEvaluacion) {
    this.isNew = isNew;
    this.formEsquemaEvaluacion.reset();
    this.gridEsquemaEvaluacionDetalle.data = [];
    this.gridCriterioEvaluacion.data = [];
    this.enProcesoSolicitud = false;
    this.valorBandera = null;
   
    if (!isNew) {
      this.dataItemTemp = dataItem;
      this.asignarValoresToFormEE(dataItem);

      /* this.asignarValoresToEED(dataItem2); */
      this.obtenerListadoDetalle();
    } else {
      this.dataItemTemp = null;
    }
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
  closeModal(){
    this._modalService.dismissAll();
  }
  /* --------------------------    Asignar Valores para el Form ----------------------------- */
  asignarValoresToFormEE(dataItem: EsquemaEvaluacion) {
    this.formEsquemaEvaluacion.get('nombre').setValue(dataItem.nombre);
    this.formEsquemaEvaluacion
      .get('idFormaCalculoEvaluacion')
      .setValue(dataItem.idFormaCalculoEvaluacion);
    this.formEsquemaEvaluacion
      .get('idModalidadCurso')
      .setValue(dataItem.idModalidadCurso);
      this.cambiarCriteriosPorModalidad(dataItem.idModalidadCurso);
  }
  asignarValoresToEED(dataItem: EsquemaEvaluacionDetalle) {
    this.formEsquemaEvaluciacionDetalle
      .get('ponderacion')
      .setValue(dataItem.ponderacion);
  }

  /* ------------------------Metodo Guardar ------------------------- */
  guardar() {
    
    if (this.formEsquemaEvaluacion.valid) {
      let jsonEnvio = this.procesarEsquemaEvaluacion();
      this.gridEsquemaEvaluacion.loading = true;

      this.enProcesoSolicitud = true;
      this._integraService
        .postJsonResponse(
          constApiPlanificacion.EsquemaEvaluacionInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<EsquemaEvaluacion>) => {
            this.gridEsquemaEvaluacion.loading = false;
            this.enProcesoSolicitud = false;
            let aux: any = resp.body;
            aux.FormaCalculoEvaluacion = this.getNombreFormaCalculoEvaluacion(
              aux.idFormaCalculoEvaluacion
            );
            this.gridEsquemaEvaluacion.data.unshift(resp.body);

            this.modalRef.close();
            this._alertaService.mensajeExitoso();
            this.gridEsquemaEvaluacion.loadData();
          },
          error: (error) => {
            
            this.enProcesoSolicitud = false;
            this.gridEsquemaEvaluacion.loading = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Certificado',
            });
            
          },
        });
    } else {
      this.formEsquemaEvaluacion.markAllAsTouched();
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }

  get EsquemaForm(): formEsquemaEvaluacion1 {
    return this.formEsquemaEvaluacion.getRawValue() as formEsquemaEvaluacion1;
  }
  /* ------------------------Procesar Esquema Evaluacion ------------------------- */
  procesarEsquemaEvaluacion(): EsquemaEvaluacion {
    let esquemaEvaluacion: EsquemaEvaluacion = {
      id: this.isNew ? 0 : this.dataItemTemp.id, // Usa this.dataItemPartnerTmp.id si no es un nuevo registro
      nombre: this.EsquemaForm.nombre,
      idFormaCalculoEvaluacion: this.EsquemaForm.idFormaCalculoEvaluacion,
      idModalidadCurso: this.EsquemaForm.idModalidadCurso,
      EsquemaEvaluacionDetalles: this.gridEsquemaEvaluacionDetalle.data,
    };
    return esquemaEvaluacion;
  }

  ObtenerNombreCriterioEvaluacion(id: number) {
    let busqueda = this.filteredCriterioEvaluacion.find((x: any) => x.id == id);
    if (busqueda != null) {
      return busqueda.nombre;
    } else {
      return 'No encontro';
    }
  }

  /* --------------------- Configurar las grillas  --------------------------------*/
  configurarGrid() {
    this.gridEsquemaEvaluacion.habilitarEstadoNewRow = true;
    this.gridEsquemaEvaluacionDetalle.habilitarEstadoNewRow = true;
    this.gridEsquemaEvaluacionDetalle.formGroup = this._formBuilder.group({
      idCriterioEvaluacion: [null],
      ponderacion: [null],
    });
    this.gridEsquemaEvaluacionDetalle.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridEsquemaEvaluacion.getUpdateEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.actualizar(resp.dataForm.nombre);
      },
    });

    this.gridEsquemaEvaluacionDetalle.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridEsquemaEvaluacionDetalle.data.splice(resp.index, 1);
          this.gridEsquemaEvaluacionDetalle.data = [
            ...this.gridEsquemaEvaluacionDetalle.data,
          ];
        }
      });
    });
    this.gridEsquemaEvaluacionDetalle.getUpdateEvent$().subscribe({
      next: (resp) => {
        console.log('Update event received:', resp);
        let valorForm = resp.formGroup.getRawValue() as {
          idCriterioEvaluacion: number;
          ponderacion: string;
        };
        const index = this.gridEsquemaEvaluacionDetalle.data.findIndex(
          (detalles) => detalles.id === resp.dataItem.id
        );
        if (index !== -1) {
          this.gridEsquemaEvaluacionDetalle.data[index].idCriterioEvaluacion =
            valorForm.idCriterioEvaluacion;
          this.gridEsquemaEvaluacionDetalle.data[index].ponderacion =
            valorForm.ponderacion;
        }
        console.log(this.gridEsquemaEvaluacionDetalle.data);
      },
    });

    this.gridEsquemaEvaluacionDetalle.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as GridEEDetalle;
      let item: EsquemaEvaluacionDetalle = {
        id: 0,
        idEsquemaEvaluacion: this.isNew ? 0 : this.dataItemTemp.id,
        idCriterioEvaluacion: valorForm.idCriterioEvaluacion,
        ponderacion: valorForm.ponderacion,
      };
      this.gridEsquemaEvaluacionDetalle.data = [
        item,
        ...this.gridEsquemaEvaluacionDetalle.data,
      ];
    });
  }
  filteredCriterioEvaluacion: CriterioEvaluacionModalidadCurso[] = [];
  filtrarCriterioPorModalidad(idModalidadSeleccionada: number) {
    if (idModalidadSeleccionada != null) {
      this.filteredCriterioEvaluacion = this.DataCriterioEvaluacion.filter(
        (item) => item.idModalidadCurso === idModalidadSeleccionada
      );
      if (this.filteredCriterioEvaluacion.length == 0) {
        this.gridEsquemaEvaluacionDetalle.data = [];
      } else {
        let idsCriteriosEvaluacion = this.filteredCriterioEvaluacion.map(
          (x) => x.id
        );
        let data = this.gridEsquemaEvaluacionDetalle
          .data as EsquemaEvaluacionDetalle[];
        this.gridEsquemaEvaluacionDetalle.data = data.filter((x) =>
          idsCriteriosEvaluacion.includes(x.idCriterioEvaluacion)
        );
      }
    } else {
      this.filteredCriterioEvaluacion = [];
      this.gridEsquemaEvaluacionDetalle.data = [];
    }
    console.log('DATA GRID ', this.gridCriterioEvaluacion.data);
  }

  cambiarCriteriosPorModalidad(idModalidadSeleccionada: number) {
    idModalidadSeleccionada = idModalidadSeleccionada;
    this.valorBandera =
      this.formEsquemaEvaluacion.get('idModalidadCurso').value;

    this.filtrarCriterioPorModalidad(idModalidadSeleccionada);
  }

  /* --------------------------Actualizar --------------------------------------------- */
  actualizar(nuevoNombre?: string) {
    this.enProcesoSolicitud = true;
    const materialAccion = this.procesarEsquemaEvaluacion();
    this.gridEsquemaEvaluacion.loading = true;
    if (this.formEsquemaEvaluacion.valid) {
    this._integraService
      .putJsonResponse(
        constApiPlanificacion.EsquemaEvaluacionActualizar,
        JSON.stringify(materialAccion)
      )
      .subscribe({
        next: (resp: HttpResponse<EsquemaEvaluacion>) => {
          console.log(resp.body);

          // Actualiza el objeto dataItem con la respuesta del servidor.
          this.dataItemTemp.nombre = resp.body.nombre;
          this.dataItemTemp.idFormaCalculoEvaluacion =
            resp.body.idFormaCalculoEvaluacion;
          this.dataItemTemp.idModalidadCurso = resp.body.idModalidadCurso;

          this.gridEsquemaEvaluacion.loading = false;
          this.modalRef.close();
          this._alertaService.mensajeExitoso();
          this.enProcesoSolicitud = false;
        },
        error: (error) => {
          console.log(error);
          this.gridEsquemaEvaluacion.loading = false;
          this.enProcesoSolicitud=false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    }else{
      this.formEsquemaEvaluacion.markAllAsTouched();
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
      this.enProcesoSolicitud=false;
    }
  }

  /*   ------------------------------------Metodo Eliminar --------------------------- */
  eliminar(id: number) {
    // Usar SweetAlert para mostrar un mensaje de confirmación
    this.enProcesoSolicitud = true;
    Swal.fire({
      title: '¿Estás seguro de eliminar el Registro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let index = this.gridEsquemaEvaluacion.data.findIndex(
          (x) => x.id === id
        );
        if (index != -1) {
        }
        this.gridEsquemaEvaluacion.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.EsquemaEvaluacionEliminar}/${id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.gridEsquemaEvaluacion.loading = false;
              if (response.body === true) {
                this.gridEsquemaEvaluacion.data.splice(index, 1);
                this.gridEsquemaEvaluacion.loadView();
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
              this.gridEsquemaEvaluacion.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }
}
