import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { ConfiguracionVideo, ConfiguracionVideoPrincipal } from '../video-evaluaciones-estructura-programa.component';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { constApiPlanificacion } from '@environments/constApi';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-modal-configuracion-proyecto',
  templateUrl: './modal-configuracion-proyecto.component.html'
})
export class ModalConfiguracionProyectoComponent implements OnInit {
  public listaTipoEvaluacion: IComboBase1[];
  public configuracionVideoPrincipal: ConfiguracionVideoPrincipal;
  public configuracionVideo: ConfiguracionVideo[];
  public modalContext: NgbModalRef;

  formConfiguracioneProyecto: FormGroup = this._formBuilder.group({
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

  mostrarConfiguracionProyecto: boolean = false;
  
  gridConfiguracionSecuenciaProyecto: KendoGrid = new KendoGrid();

  listaInstrucciones: IComboBase1[];
  listaPreguntas: IComboBase1[];

  loaderModal: boolean = false;
  loaderModalDetalle: boolean = false;
  esBtnNuevo: boolean = false;
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
    this.obtenerConfiguracionProyecto();
  }
  ngOnDestroy() {
    this.gridConfiguracionSecuenciaProyecto.data = [];
    this.mostrarConfiguracionProyecto = false;
    this.formConfiguracioneProyecto.reset();
    this.listaTipoEvaluacion = [];
    this.listaInstrucciones = [];
    this.listaPreguntas = [];
  }
  obtenerConfiguracionProyecto(): void {
    if (this.configuracionVideo != null) {
      this.gridConfiguracionSecuenciaProyecto.data = this.configuracionVideo;
      this.gridConfiguracionSecuenciaProyecto.loading = false;
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
  prepararActualConfiguracionSecuenciaProyecto(
    dataSource: any
  ): void {
    this.loaderModalDetalle = true;
    this.mostrarConfiguracionProyecto = true;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ConfigurarEvaluacionTrabajoObtenerPorConfiguracion}/${dataSource.id}`
      ).subscribe({
        next: (response: HttpResponse<IComboBase1[]>) => {
          this.loaderModalDetalle = false;
          if (response.body != null && response.body.length != 0)
            this.listaPreguntas = response.body;
        },
        complete: () => {
          this.formConfiguracioneProyecto.setValue({
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
  prepararNuevaConfiguracionSecuenciaProyecto(): void {
    this.mostrarConfiguracionProyecto = true;
    this.formConfiguracioneProyecto.setValue({
      orden: '',
      tipoEvaluacion: 2,
      nombreEvaluacion: '',
      descripcionEvaluacion: '',
      habilitarInstruccion: false,
      habilitarArchivo: false,
      habilitarPreguntas: false,
      instruccion: '',
      descripcionArchivo: '',
      descripcionPregunta: '',
      preguntas: [],
      id: 0,
    });
    this.esBtnNuevo = true;
  }
  insertarConfiguracionSecuenciaProyecto(): void {
    this.loaderModal = true;
    let dataEnviada: any = this.formatearObjeto();
    this._integraService
      .postJsonResponse(
        constApiPlanificacion.ConfigurarEvaluacionTrabajoInsertar,
        dataEnviada
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.mostrarConfiguracionProyecto = false;
          this.formConfiguracioneProyecto.reset();
          this.loaderModal = true;
        },
        error: (err) => {
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
          this.loaderModal = true;
        },
      });
  }
  actualizarConfiguracionSecuenciaEvaluacion(): void {
    this.loaderModal = true;
    let dataEnviada: any = this.formatearObjeto();
    this._integraService
      .postJsonResponse(constApiPlanificacion.ConfigurarEvaluacionTrabajoActualizar, dataEnviada)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.mostrarConfiguracionProyecto = false;
          this.formConfiguracioneProyecto.reset();
          this.loaderModal = true;
        },
        error: (err) => {
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
          this.loaderModal = true;
        },
      });
  }
  eliminarConfiguracionSecuenciaProyecto(
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
                this.gridConfiguracionSecuenciaProyecto.data.indexOf(
                  dataSource
                );
              this.gridConfiguracionSecuenciaProyecto.data.slice(
                indice,
                1
              );
              this.loaderModal = true;
            },
            error: (err) => {
              Swal.fire(
                'Surgio un error',
                'Ha ocurrido un error en la eliminacion',
                'error'
              );
              this.loaderModal = true;
            },
          });
      }
    });
  }
  formatearObjeto(): any {
    let dataForm = this.formConfiguracioneProyecto.getRawValue();
    return {
      listaPreguntas: dataForm.preguntas,
      id: dataForm.id,
      idTipoEvaluacionTrabajo: dataForm.tipoEvaluacion,
      nombre: dataForm.nombreEvaluacion,
      descripcion: dataForm.descripcionEvaluacion,
      idDocumentoPw: dataForm.instruccion,
      archivoNombre: dataForm.orden,
      archivoCarpeta: dataForm.descripcionArchivo,
      descripcionPregunta: dataForm.descripcionPregunta,
      habilitarInstrucciones: dataForm.habilitarInstruccion,
      habilitarArchivo: dataForm.habilitarArchivo,
      habilitarPreguntas: dataForm.habilitarPreguntas,
      idPgeneral: this.configuracionVideoPrincipal.idPgeneral,
      ordenCapitulo: 1,
      idSeccion: 1,
      fila: 1,
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
