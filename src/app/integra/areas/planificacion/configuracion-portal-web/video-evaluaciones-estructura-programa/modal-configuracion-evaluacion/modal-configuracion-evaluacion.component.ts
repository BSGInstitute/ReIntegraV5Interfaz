import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import {
  ConfiguracionVideo,
  ConfiguracionVideoPrincipal,
} from '../video-evaluaciones-estructura-programa.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
interface ConfiguracionEvaluacion {
  idPgeneral: number;
  idDocumentoSeccionPw: number;
  nombre: string;
  capitulo: string;
  sesion: string;
  subSesion: string;
  ordenFila: number;
  ordenCapitulo: number;
  ordenSeccion: number;
  totalSegundos: number;
}
@Component({
  selector: 'app-modal-configuracion-evaluacion',
  templateUrl: './modal-configuracion-evaluacion.component.html',
})
export class ModalConfiguracionEvaluacionComponent implements OnInit {
  public listaTipoEvaluacion: IComboBase1[];
  public configuracionVideoPrincipal: ConfiguracionVideoPrincipal;
  public configuracionVideo: ConfiguracionVideo[];
  public modalContext: NgbModalRef;

  formConfiguracioneEvaluacion: FormGroup = this._formBuilder.group({
    orden: [''],
    tipoEvaluacion: [0],
    nombreEvaluacion: [''],
    descripcionEvaluacion: [''],
    habilitarInstruccion: [false],
    habilitarArchivo: [false],
    habilitarPreguntas: [false],
    instruccion: [0],
    descripcionArchivo: [''],
    descripcionPregunta: [''],
    preguntas: [[]],
    id: [0],
  });

  mostrarConfiguracionEvaluacion: boolean = false;
  mostrarConfiguracionEvaluacionDetalle: boolean = false;

  gridConfiguracionSecuenciaEvaluacion: KendoGrid = new KendoGrid();
  gridConfiguracionSecuenciaEvaluacionDetalle: KendoGrid = new KendoGrid();

  listaInstrucciones: IComboBase1[];
  listaPreguntas: IComboBase1[];

  loaderModal: boolean = false;
  loaderModalDetalle: boolean = false;
  esBtnNuevo: boolean = false;
  dataFilaEvaluacion: ConfiguracionEvaluacion;
  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  
  constructor(
    private _integraService: IntegraService,
    private _formBuilder: FormBuilder,
    private _alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.obtenerConfiguracionEvaluacion();
  }
  ngOnDestroy() {
    this.gridConfiguracionSecuenciaEvaluacionDetalle.data = [];
    this.gridConfiguracionSecuenciaEvaluacion.data = [];
    this.mostrarConfiguracionEvaluacionDetalle = false;
    this.mostrarConfiguracionEvaluacion = false;
    this.formConfiguracioneEvaluacion.reset();
    this.listaTipoEvaluacion = [];
    this.listaInstrucciones = [];
    this.listaPreguntas = [];
  }
  obtenerConfiguracionEvaluacion(): void {
    if (this.configuracionVideo != null) {
      this.gridConfiguracionSecuenciaEvaluacion.data = this.configuracionVideo;
      this.gridConfiguracionSecuenciaEvaluacion.loading = false;
      this._integraService
        .getJsonResponse(
          `${constApiPlanificacion.ConfigurarVideoProgramaObtenerEnunciadoPregunta}/${this.configuracionVideoPrincipal.idPgeneral}`
        )
        .subscribe({
          next: (response: HttpResponse<IComboBase1[]>) => {
            this.listaPreguntas = response.body;
          },
        });
      this._integraService
        .getJsonResponse(
          `${constApiPlanificacion.ConfigurarVideoProgramaObtenerDocumentoProgramaGeneral}/${this.configuracionVideoPrincipal.idPgeneral}`
        )
        .subscribe({
          next: (response: HttpResponse<IComboBase1[]>) => {
            this.listaInstrucciones = response.body;
          },
        });
    }
  }
  obtenerConfiguracionEvaluacionDetalle(dataRow: any): void {
    if (dataRow.selectedRows.length < 2) {
      this.dataFilaEvaluacion = dataRow.selectedRows[0].dataItem;
      this.gridConfiguracionSecuenciaEvaluacionDetalle.data = [];
      this.gridConfiguracionSecuenciaEvaluacionDetalle.loading = true;
      this.mostrarConfiguracionEvaluacion = true;
      this.mostrarConfiguracionEvaluacionDetalle = false;
      this._integraService
        .getJsonResponse(
          `${constApiPlanificacion.ConfigurarVideoProgramaObtenerConfigurarEvaluacionTrabajoPorConfiguracion}/${this.dataFilaEvaluacion.idPgeneral}/${this.dataFilaEvaluacion.ordenSeccion}/${this.dataFilaEvaluacion.ordenFila}`
        )
        .subscribe({
          next: (res: HttpResponse<any[]>) => {
            this.gridConfiguracionSecuenciaEvaluacionDetalle.data = res.body;
            this.gridConfiguracionSecuenciaEvaluacionDetalle.loading = false;
            this.formConfiguracioneEvaluacion.reset();
          },
        });
    }
  }
  prepararActualConfiguracionSecuenciaEvaluacion(
    dataSource: any
  ): void {
    this.loaderModalDetalle = true;
    this.mostrarConfiguracionEvaluacionDetalle = true;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ConfigurarEvaluacionTrabajoObtenerPorConfiguracion}/${dataSource.id}`
      )
      .subscribe({
        next: (response: HttpResponse<IComboBase1[]>) => {
          this.loaderModalDetalle = false;
          if (response.body != null && response.body.length != 0)
            this.listaPreguntas = response.body;
        },
        error: (err) => {
          this.loaderModalDetalle = false;
        },
        complete: () => {
          this.loaderModalDetalle = false;
          this.formConfiguracioneEvaluacion.setValue({
            orden: dataSource.archivoNombre,
            tipoEvaluacion: dataSource.idTipoEvaluacionTrabajo,
            nombreEvaluacion: dataSource.nombre,
            descripcionEvaluacion: dataSource.descripcion,
            habilitarInstruccion: dataSource.habilitarInstrucciones,
            habilitarArchivo: dataSource.habilitarArchivo,
            habilitarPreguntas: dataSource.habilitarPreguntas,
            instruccion: dataSource.idDocumentoPw,
            descripcionArchivo: dataSource.archivoCarpeta,
            descripcionPregunta: dataSource.descripcionPregunta,
            preguntas: [],
            id: dataSource.id,
          });
          this.esBtnNuevo = false;
        },
      });
  }
  prepararNuevaConfiguracionSecuenciaEvaluacion(): void {
    this.mostrarConfiguracionEvaluacionDetalle = true;
    this.formConfiguracioneEvaluacion.setValue({
      orden: '',
      tipoEvaluacion: 0,
      nombreEvaluacion: '',
      descripcionEvaluacion: '',
      habilitarInstruccion: false,
      habilitarArchivo: false,
      habilitarPreguntas: false,
      instruccion: 0,
      descripcionArchivo: '',
      descripcionPregunta: '',
      preguntas: [],
      id: 0,
    });
    this.esBtnNuevo = true;
  }
  insertarConfiguracionSecuenciaEvaluacion(): void {
    this.loaderModal = true;
    let dataEnviada: any = this.formatearObjeto();
    this._integraService
      .postJsonResponse(constApiPlanificacion.ConfigurarEvaluacionTrabajoInsertar, dataEnviada)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if(response.body) {
            this.mostrarConfiguracionEvaluacionDetalle = false;
            this.formConfiguracioneEvaluacion.reset();
          } else {
            this._alertaService.notificationWarning(`Surgio al realizar la actualizacion`);
          }
          this.loaderModal = false;
        },
        error: (err) => {
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
          this.loaderModal = false;
        },
      });
  }
  actualizarConfiguracionSecuenciaEvaluacion(): void {
    this.loaderModal = true;
    let dataEnviada: any = this.formatearObjeto();
    this._integraService
      .putJsonResponse(constApiPlanificacion.ConfigurarEvaluacionTrabajoActualizar, dataEnviada)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if(response.body) {
            this.mostrarConfiguracionEvaluacionDetalle = false;
            this.formConfiguracioneEvaluacion.reset();
          } else {
            this._alertaService.notificationWarning(`Surgio al realizar la actualizacion`);
          }
          this.loaderModal = false;
        },
        error: (err) => {
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
          this.loaderModal = false;
        },
      });
  }
  eliminarConfiguracionSecuenciaEvaluacion(
    dataSource: any
  ): void {
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loaderModal = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.ConfigurarEvaluacionTrabajoEliminar}/${dataSource.id}`
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              Swal.fire(
                'Eliminado!',
                'Se ha Eliminado correctamente',
                'success'
              );
              let indice: number =
                this.gridConfiguracionSecuenciaEvaluacionDetalle.data.indexOf(
                  dataSource
                );
              this.gridConfiguracionSecuenciaEvaluacionDetalle.data.slice(
                indice,
                1
              );
              this.loaderModal = false;
            },
            error: (err) => {
              Swal.fire(
                'Surgio un error',
                'Ha ocurrido un error en la eliminacion',
                'error'
              );
              this.loaderModal = false;
            },
          });
      }
    });
  }
  formatearObjeto(): any {
    let dataForm = this.formConfiguracioneEvaluacion.getRawValue();
    return {
      id: dataForm.id,
      idTipoEvaluacionTrabajo: dataForm.tipoEvaluacion,
      nombre: dataForm.nombreEvaluacion,
      descripcion: dataForm.descripcionEvaluacion,
      idDocumentoPw: dataForm.instruccion,
      archivoNombre: String(dataForm.orden),
      archivoCarpeta: dataForm.descripcionArchivo,
      descripcionPregunta: dataForm.descripcionPregunta,
      habilitarInstrucciones: dataForm.habilitarInstruccion,
      habilitarArchivo: dataForm.habilitarArchivo,
      habilitarPreguntas: dataForm.habilitarPreguntas,
      idPgeneral: this.dataFilaEvaluacion.idPgeneral,
      idSeccion: this.dataFilaEvaluacion.ordenSeccion,
      fila: this.dataFilaEvaluacion.ordenFila,
      ordenCapitulo: this.dataFilaEvaluacion.ordenCapitulo,
      ordenEvaluacion: null,
      preguntaEvaluacionTrabajos: dataForm.preguntas.map((x: IComboBase1) => {
        return {
          id: 0,
          idConfigurarEvaluacionTrabajo: 0,
          idPregunta: x.id
        }
      }),
    };
  }
}
