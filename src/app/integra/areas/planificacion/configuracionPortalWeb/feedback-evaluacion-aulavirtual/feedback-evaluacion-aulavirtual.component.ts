import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import {
  DetallesConfig,
  FeedBackConfig,
  FeedBackConfigV,
  FeedbackConfigurarDetalle,
} from '@planificacion/models/interfaces/feedbackevaluacion';
import { constApiPlanificacion } from '@environments/constApi';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

interface formFeedbackConfigurar {
  id: number;
  idFeedbackTipo: number;
  nombre: string;
}
interface GridFeedDetalle {
  idFeedbackConfigurar: number;
  idSexo: number;
  puntaje: number;
  nombreVideo: string;
}

@Component({
  selector: 'app-feedback-evaluacion-aulavirtual',
  templateUrl: './feedback-evaluacion-aulavirtual.component.html',
  styleUrls: ['./feedback-evaluacion-aulavirtual.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackEvaluacionAulavirtualComponent implements OnInit , OnDestroy{
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    
  ) {}

  gridFeedBackConfigurar: KendoGrid = new KendoGrid();
  isNew: boolean = false;
  enProcesoSolicitud: boolean = false;
  modalRef: any;
  dataItemTemp: FeedBackConfig;
  DataFeedTipos: IComboBase1[] = [];
  DataSexo: IComboBase1[] = [];
  gridFeedbackDetalle: KendoGrid = new KendoGrid();
  subscriptions: Subscription = new Subscription();
  ngOnInit(): void {
    this.obtener();
    this.ObtenerFeedbackTipo();
    this.ObtenerSexo();
    this.configurarGrid();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  formDatosdeFeedbackConfigurar: FormGroup = this._formBuilder.group({
    nombre: [null, Validators.required],
    idFeedbackTipo: null,
  });
  formFeedbackDetalles: FormGroup = this._formBuilder.group({
    puntaje: new FormControl(null),
  });
  /* -----------------ObtenerDatosdel Grid General de FeedbackConfigurar----------- */
  obtener() {
    this.gridFeedBackConfigurar.loading = true;
    this._integraService
      .getJsonResponse(constApiPlanificacion.FeedBackConfigObtener)
      .subscribe({
        next: (resp: HttpResponse<FeedBackConfigV[]>) => {
          this.gridFeedBackConfigurar.data = resp.body;
          this.gridFeedBackConfigurar.loading = false;
        },
        error: (error) => {
          this.gridFeedBackConfigurar.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  /* -----------------Obtener Datos para el dropdownList FeedbackTipo----------- */
  ObtenerFeedbackTipo() {
    this._integraService
      .getJsonResponse(constApiPlanificacion.FeedbackTipoObtener)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.DataFeedTipos = resp.body;
        },
        error: (error) => {
          this.gridFeedBackConfigurar.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  /* -----------------ObtenerDatos para el dropdownList de Sexo----------- */
  ObtenerSexo() {
    this._integraService
      .getJsonResponse(constApiPlanificacion.FeedBackConfigObtenerComboSexo)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.DataSexo = resp.body;
        },
        error: (error) => {
          this.gridFeedBackConfigurar.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  getSexoName(idSexo: number): string {
    const selectedSexo = this.DataSexo.find((sexo) => sexo.id === idSexo);
    return selectedSexo ? selectedSexo.nombre : '';
  }

  /* --------------------------    Abrir Modal ----------------------------- */
  abrirModal(context: any, isNew: boolean, dataItem?: FeedBackConfig) {
    this.isNew = isNew;
    this.formDatosdeFeedbackConfigurar.reset();
    this.gridFeedbackDetalle.data = [];
    this.enProcesoSolicitud = false;
    if (!isNew) {
      this.dataItemTemp = dataItem;
      this.asignarValoresToForm(dataItem);
      this.ObtenerDetalles();
    } else {
      this.dataItemTemp = null;
    }
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
  /* --------------------------    Asignar Valores para el Form ----------------------*/
  asignarValoresToForm(dataItem: FeedBackConfig) {
    this.formDatosdeFeedbackConfigurar.get('nombre').setValue(dataItem.nombre);
    this.formDatosdeFeedbackConfigurar
      .get('idFeedbackTipo')
      .setValue(dataItem.idFeedbackTipo);
  }
  /* ------------------------Metodo Guardar ------------------------- */
  guardar() {
    console.log(this.formDatosdeFeedbackConfigurar.value);
    if (this.formDatosdeFeedbackConfigurar.valid) {
      let jsonEnvio = this.procesarFeedbackConfigurar();
      this.gridFeedBackConfigurar.loading = true;

      this.enProcesoSolicitud = true;
      this._integraService
        .postJsonResponse(
          constApiPlanificacion.FeedBackConfigInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<FeedBackConfig>) => {
            this.gridFeedBackConfigurar.loading = false;
            this.enProcesoSolicitud = false;
            this.gridFeedBackConfigurar.data.unshift(resp.body);
            this.modalRef.close();
            this.obtener();
            this._alertaService.mensajeExitoso();
            this.gridFeedBackConfigurar.loadData();
          },
          error: (error) => {
            this.modalRef.close();
            this.enProcesoSolicitud = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Certificado',
            });
            this.gridFeedBackConfigurar.loading = false;
          },
        });
    } else {
      this.formDatosdeFeedbackConfigurar.markAllAsTouched();
      this.gridFeedBackConfigurar.loadData();
    }
  }

  get feedbackConfigForm(): formFeedbackConfigurar {
    return this.formDatosdeFeedbackConfigurar.getRawValue() as formFeedbackConfigurar;
  }
  /* ------------------------Procesar FeedbackConfigurar ------------------------- */
  procesarFeedbackConfigurar(): FeedBackConfig {
    let feedbackConfig: FeedBackConfig = {
      id: this.isNew ? 0 : this.dataItemTemp.id, // Usa this.dataItemPartnerTmp.id si no es un nuevo registro
      nombre: this.feedbackConfigForm.nombre,
      idFeedbackTipo: this.feedbackConfigForm.idFeedbackTipo,
      feedbackConfigurarDetalles: this.gridFeedbackDetalle.data,
    };
    return feedbackConfig;
  }

  /* --------------------- Configurar las grillas  --------------------------------*/
  configurarGrid() {
    this.gridFeedbackDetalle.habilitarEstadoNewRow = true;
    this.gridFeedBackConfigurar.habilitarEstadoNewRow = true;
    this.gridFeedbackDetalle.formGroup = this._formBuilder.group({
      puntaje: [null],
      nombreVideo: [null, Validators.required],
      idSexo: [null],
    });
    this.gridFeedbackDetalle.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridFeedbackDetalle.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridFeedbackDetalle.data.splice(resp.index, 1);
          this.gridFeedbackDetalle.data = [...this.gridFeedbackDetalle.data];
        }
      });
    });
    this.gridFeedBackConfigurar.getUpdateEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.actualizar(resp.dataForm.nombre);
      },
    });

    this.gridFeedbackDetalle.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          puntaje: number;
          idSexo: number;
          nombreVideo: string;
        };
        const index = this.gridFeedbackDetalle.data.findIndex(
          (feeddetalle) => feeddetalle.id === resp.dataItem.id
        );
        if (index !== -1) {
          this.gridFeedbackDetalle.data[index].puntaje = valorForm.puntaje;
          this.gridFeedbackDetalle.data[index].idSexo = valorForm.idSexo;
          this.gridFeedbackDetalle.data[index].nombreVideo =
            valorForm.nombreVideo;
        }
      },
    });
    this.gridFeedbackDetalle.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as GridFeedDetalle;
      let item: FeedbackConfigurarDetalle = {
        id: 0,
        idFeedbackConfigurar: this.isNew ? 0 : this.dataItemTemp.id,
        idSexo: valorForm.idSexo,
        puntaje: valorForm.puntaje,
        nombreVideo: valorForm.nombreVideo,
      };
      this.gridFeedbackDetalle.data = [item, ...this.gridFeedbackDetalle.data];
    });
  }

  /* ---------------------------ObtenerDetalles dependiedo el id del Padre-------------------------- */
  ObtenerDetalles() {
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.FeedBackConfigDetalleObtener +
          '/' +
          this.dataItemTemp.id
      )
      .subscribe({
        next: (resp: HttpResponse<DetallesConfig[]>) => {
          this.gridFeedbackDetalle.data = resp.body;
        },

        error: (error) => {
          console.log('aqui entro error');
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  /* --------------------------Actualizar --------------------------------------------- */
  actualizar(nuevoNombre?: string) {
    this.enProcesoSolicitud = true;
    const materialAccion = this.procesarFeedbackConfigurar();
    this.gridFeedBackConfigurar.loading = true;

    this._integraService
      .putJsonResponse(
        constApiPlanificacion.FeedBackConfigActualizar,
        JSON.stringify(materialAccion)
      )
      .subscribe({
        next: (resp: HttpResponse<FeedBackConfig>) => {
          console.log(resp.body);

          // Actualiza el objeto dataItem con la respuesta del servidor.
          this.dataItemTemp.nombre = resp.body.nombre;
          this.dataItemTemp.idFeedbackTipo = resp.body.idFeedbackTipo;
          this.gridFeedBackConfigurar.loading = false;
          this.modalRef.close();
          this._alertaService.mensajeExitoso();
          this.enProcesoSolicitud = false;
        },
        error: (error) => {
          console.log(error);
          this.gridFeedBackConfigurar.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
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
        let index = this.gridFeedBackConfigurar.data.findIndex(
          (x) => x.id === id
        );
        if (index != -1) {
        }
        this.gridFeedBackConfigurar.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.FeedBackConfigEliminar}/${id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.gridFeedBackConfigurar.loading = false;
              if (response.body === true) {
                this.gridFeedBackConfigurar.data.splice(index, 1);
                this.gridFeedBackConfigurar.loadView();
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
              this.gridFeedBackConfigurar.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }
}
