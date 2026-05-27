import { HttpResponse } from '@angular/common/http';

import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import { Workbook } from 'exceljs';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';
interface ComboPespecifico {
  id: number;
  nombre: string;
  idProgramaGeneral: number;
}
interface PreguntaTipoRespuesta {
  id: number;
  nombre: string;
  tipoRespuesta: string;
  idTipoRespuesta: number;
}
interface ColeccionCombos {
  pEspecificos: ComboPespecifico[];
  pGenerals: IComboBase1[];
  preguntaTipoRespuestas: PreguntaTipoRespuesta[];
  tipoMarcadors: IComboBase1[];
  tipoRespuestaCalificacions: IComboBase1[];
}
interface ConfiguracionRespuesta {
  id: number;
  idPreguntaProgramaCapacitacion: number;
  respuestaCorrecta: boolean;
  nroOrdenRespuesta: number;
  nroOrden: number;
  enunciadoRespuesta: string;
  puntaje: number;
  feedbackPositivo: string;
  feedbackNegativo: string;
}
interface ConfiguracionIntento {
  id: number;
  idPreguntaIntento: number;
  porcentajeCalificacion: number;
}
interface PreguntaInteractiva {
  activarFeedBackRespuestaCorrecta: boolean;
  activarFeedBackRespuestaIncorrecta: boolean;
  activarFeedbackMaximoIntento: boolean;
  enunciado: string;
  factorRespuesta: any;
  grupoPregunta: string;
  id: number;
  idCapitulo: number;
  idPEspecifico: number;
  idPGeneral: number;
  idPreguntaIntento: number;
  idPreguntaTipo: number;
  idSesion: number;
  idTipoMarcador: number;
  idTipoRespuesta: number;
  idTipoRespuestaCalificacion: number;
  mensajeFeedbackIntento: string;
  minutosPorPregunta: number;
  mostrarFeedbackInmediato: boolean;
  mostrarFeedbackPorPregunta: boolean;
  numeroMaximoIntento: number;
  ordenPreguntaGrupo: number;
  pGeneral: string;
  respuestaAleatoria: boolean;
  valorMarcador: number;
}
interface CapituloSesionesPgeneral {
  idPGeneral: number;
  idCapituloProgramaCapacitacion: number;
  capituloProgramaCapacitacion: string;
  listaSesionesProgramaCapacitacion: SesionProgramaCapacitacion[];
}
interface SesionProgramaCapacitacion {
  idSesionProgramaCapacitacion: number;
  sesionProgramaCapacitacion: string;
  listaSubSeccionProgramaCapacitacion?: SubsesionProgramaCapacitacion[];
}
interface SubsesionProgramaCapacitacion {
  idSesionProgramaCapacitacion: number;
  subSeccionProgramaCapacitacion: string;
}
interface ReportePreguntasExportar {
  id: number;
  idPGeneral: number;
  idPEspecifico: number;
  ordenFilaCapitulo: number;
  sesion: string;
  subSesion: string;
  grupoPregunta: string;
  idTipoMarcador: number;
  valorMarcador: number;
  ordenPreguntaGrupo: number;
  idTipoRespuesta: number;
  idPreguntaTipo: number;
  enunciadoPregunta: string;
  minutosPorPregunta: number;
  respuestaAleatoria: boolean;
  activarFeedBackRespuestaCorrecta: boolean;
  activarFeedBackRespuestaIncorrecta: boolean;
  mostrarFeedbackInmediato: boolean;
  mostrarFeedbackPorPregunta: boolean;
  numeroMaximoIntento: number;
  activarFeedbackMaximoIntento: boolean;
  mensajeFeedback: string;
  idTipoRespuestaCalificacion: number;
  factorRespuesta: number;
  respuestaCorrecta: boolean;
  nroOrden: number;
  enunciadoRespuesta: string;
  puntaje: number;
  feedbackPositivo: string;
  feedbackNegativo: string;
  porcentajeCalificacion: number;
}
interface EstadoCascadaCombo {
  pespecificos: boolean;
  capitulos: boolean;
  sesiones: boolean;
  subsesiones: boolean;
}
@Component({
  selector: 'app-preguntas-interactivas-portal-web',
  templateUrl: './preguntas-interactivas-portal-web.component.html',
  styleUrls: ['./preguntas-interactivas-portal-web.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PreguntasInteractivasPortalWebComponent implements OnInit {
  @ViewChild('modalConfiguracionRespuesta') modalConfiguracionRespuesta: any;
  @ViewChild('modalConfiguracionImportar') modalConfiguracionImportar: any;
  @ViewChild('modalConfiguracionDificultad') modalConfiguracionDificultad: any;
  @ViewChild('calificacionAutomatica', { static: false }) calificacionAutomatica: ElementRef<HTMLInputElement>;
  @ViewChild('calificacionManual', { static: false }) calificacionManual: ElementRef<HTMLInputElement>;

  gridPreguntasInteractivas: KendoGrid = new KendoGrid();
  gridCantidadIntentos: KendoGrid = new KendoGrid();
  gridConfiguracionRespuesta: KendoGrid = new KendoGrid();

  nuevoRegistro: boolean = false;
  loaderReport: boolean = false;
  loaderModal: boolean = false;
  loaderImport: boolean = false;

  mostrarResultadoImportacion: boolean = false;
  preguntasInteractivasSeleccionadas: number[] = [];

  listaCombos: ColeccionCombos;
  listaPespecifico: ComboPespecifico[];
  listaPgeneral: IComboBase1[];
  listaPreguntaTipoRespuesta: PreguntaTipoRespuesta[];
  listaPreguntaCerradaRespuesta: PreguntaTipoRespuesta[];
  listaPreguntaAbiertaRespuesta: PreguntaTipoRespuesta[];
  listaTipoMarcador: IComboBase1[];
  listaTipoRespuestaCalificacion: IComboBase1[];
  listaCapitulo: CapituloSesionesPgeneral[];
  listaSesion: SesionProgramaCapacitacion[];
  listaSubSesion:
    | SubsesionProgramaCapacitacion[]
    | SesionProgramaCapacitacion[];
  listaComboCapitulo: CapituloSesionesPgeneral[];

  dataReporteExportar: ReportePreguntasExportar[];
  estadoCascada: EstadoCascadaCombo = {
    pespecificos: true,
    capitulos: true,
    sesiones: true,
    subsesiones: true,
  };

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  modalRefEditar: NgbModalRef = null;
  modalRefImportar: NgbModalRef = null;
  modalRefDificultad: NgbModalRef = null;
  loaderModalDificultad: boolean = false;
  loaderGuardarDificultad: boolean = false;
  listaDificultades: any[] = [];
  idDificultadSeleccionada: number | null = null;
  preguntaSeleccionadaDificultad: PreguntaInteractiva | null = null;
  get dificultadSeleccionadaColor(): string | null {
    const dif = this.listaDificultades.find(d => d.id === this.idDificultadSeleccionada);
    return dif?.colorHexadecimal ?? null;
  }

  archivoImportado = new FormControl(null);
  formConfiguracionPreguntas: FormGroup = this._formBuilder.group({
    id: [0],
    idPGeneral: [0, [Validators.required]],
    idPespecifico: [0, [Validators.required]],
    idCapitulo: [0, [Validators.required]],
    idSesion: [0, [Validators.required]],
    idSubsesion: [0],
    grupoPregunta: [
      '',
      [
        Validators.required,
        TextValidator.noEndSpace,
        TextValidator.noStartSpace,
      ],
    ],
    idTipoMarcador: [0, [Validators.required]],
    valorMarcador: [0, [Validators.required]],
    ordenPreguntaGrupo: [0, [Validators.required]],
    //TAB: General
    habilitarConfiguracion: [0, [Validators.required]],
    configuracionAutomatica: [0],
    configuracionManual: [0],
    //TAB: Pregunta
    enunciadoPregunta: [
      '',
      [
        Validators.required,
        TextValidator.noEndSpace,
        TextValidator.noStartSpace,
      ],
    ],
    calificacionRespuesta: [0, [Validators.required]],
    factorRespuesta: [0],
    tiempoMinutos: [0, [Validators.required]],
    habilitarAleatorio: [false],
    //TAB: Feedback
    feedRespuestaCorrecta: [false],
    feedRespuestaIncorrecta: [false],
    feedManeraInmediata: [false],
    feedResponderPregunta: [false],
    //TAB: Intentos
    numeroIntentoMaximo: [0, [Validators.required]],
    habilitarFeedbackMaxIntentos: [false],
    mensajeFeedbackIntento: [''],
  });

  constructor(
    private _integraService: IntegraService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _alertaService: AlertaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtener();
    this.obtenerFiltros();
    this.obtenerReporte();
    this.obtenerDificultades();
    this.cargarConfiguracionGridCantidadIntentos();
    this.cargarConfiguracionGridConfiguracionRespuesta();
  }
  obtener(): void {
    this.gridPreguntasInteractivas.loading = true;
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.MaestroPreguntaProgramaCapacitacionObtener
      )
      .subscribe({
        next: (res: HttpResponse<PreguntaInteractiva[]>) => {
          this.gridPreguntasInteractivas.data = res.body.sort(
            (a, b) => b.id - a.id
          );
          this.gridPreguntasInteractivas.loading = false;
        },
        error: (err) => {
          this.gridPreguntasInteractivas.loading = false;
        },
      });
  }
  obtenerReporte(): void {
    this.loaderReport = true;
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.MaestroPreguntaProgramaCapacitacionObtenerReportePreguntasInteractivasExportacionExcel
      )
      .subscribe({
        next: (res: HttpResponse<ReportePreguntasExportar[]>) => {
          this.dataReporteExportar = res.body;
          this.loaderReport = false;
          this._alertaService.notificationSuccessBotom(
            `La Exportacion ya se encuentra disponible`
          );
        },
        error: (err) => {
          this.loaderReport = false;
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
        },
      });
  }
  obtenerDificultades(): void {
    this._integraService.getJsonResponse(constApiPlanificacion.MaestroPreguntaProgramaCapacitacionObtenerDificultades).subscribe({
      next: (data: any) => {
        this.listaDificultades = data.body;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los niveles de dificultad', 'error');
      }
    });
  }
  obtenerFiltros(): void {
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.MaestroPreguntaProgramaCapacitacionObtenerCombosModulo
      )
      .subscribe({
        next: (res: HttpResponse<ColeccionCombos>) => {
          this.listaCombos = res.body;
          this.listaPespecifico = res.body.pEspecificos;
          this.listaPgeneral = res.body.pGenerals;
          this.listaPreguntaTipoRespuesta = res.body.preguntaTipoRespuestas;
          this.listaTipoMarcador = res.body.tipoMarcadors;
          this.listaTipoRespuestaCalificacion =
            res.body.tipoRespuestaCalificacions;
          this.listaPreguntaCerradaRespuesta =
            res.body.preguntaTipoRespuestas.filter(
              (x) => x.idTipoRespuesta == 1
            );
          this.listaPreguntaAbiertaRespuesta =
            res.body.preguntaTipoRespuestas.filter(
              (x) => x.idTipoRespuesta == 2
            );
        },
      });
  }
  abrirModalImportar(): void {
    this.modalRefImportar = this._modalService.open(
      this.modalConfiguracionImportar,
      { size: 'md', backdrop: 'static' }
    );
  }
  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formConfiguracionPreguntas.reset();
    this.formConfiguracionPreguntas.setValue({
      id: 0,
      idPGeneral: null,
      idPespecifico: null,
      idCapitulo: null,
      idSesion: null,
      idSubsesion: 0,
      grupoPregunta: '',
      idTipoMarcador: null,
      valorMarcador: null,
      ordenPreguntaGrupo: null,
      //TAB: General
      habilitarConfiguracion: null,
      configuracionAutomatica: 0,
      configuracionManual: 0,
      //TAB: Pregunta
      enunciadoPregunta: '',
      calificacionRespuesta: null,
      factorRespuesta: 0,
      tiempoMinutos: null,
      habilitarAleatorio: false,
      //TAB: Feedback
      feedRespuestaCorrecta: false,
      feedRespuestaIncorrecta: false,
      feedManeraInmediata: false,
      feedResponderPregunta: false,
      //TAB: Intentos
      numeroIntentoMaximo: null,
      habilitarFeedbackMaxIntentos: false,
      mensajeFeedbackIntento: '',
    });
    this.resetearEstadoCascada();
    this.gridCantidadIntentos.data = [];
    this.gridConfiguracionRespuesta.data = [];
    this.modalRefEditar = this._modalService.open(
      this.modalConfiguracionRespuesta,
      { size: 'xxl', backdrop: 'static' }
    );
  }
  abrirModalDetalleActualizar(dataSource: PreguntaInteractiva): void {
    this.obtenerFiltros();
    console.log(dataSource)
    this.nuevoRegistro = false;
    // this.filtrarPespecificosPorPgeneral(dataSource.idPGeneral);
  /*   this.nuevoRegistro = false;
    this.loaderModal = true; */
    // if (dataSource.idPGeneral != null) {
    //   this.listaPespecifico = this.listaCombos.pEspecificos.filter(
    //     (x) => x.idProgramaGeneral == dataSource.idPGeneral
    //   );
      if (this.listaPespecifico.length > 0) {
       
        this.formConfiguracionPreguntas
          .get('idPespecifico')
          .setValue(dataSource.idPEspecifico);
        
        this.estadoCascada.pespecificos = false;
      }
      
    //   this.loaderModal = true;
      this._integraService
        .getJsonResponse(
          `${constApiPlanificacion.MaestroPreguntaProgramaCapacitacionObtenerCapituloSesionesPGeneral}/${dataSource.idPGeneral}`
        )
        .subscribe({
          next: (res: HttpResponse<CapituloSesionesPgeneral[]>) => {
            this.listaCapitulo = res.body;
          },
          complete: () => {
            this.estadoCascada.capitulos = false;
            if (dataSource.idCapitulo != null) {
              this.estadoCascada.sesiones = false;
              this.formConfiguracionPreguntas
                .get('idCapitulo')
                .setValue(dataSource.idCapitulo);
              let sesiones = this.listaCapitulo.filter(
                (x) => x.idCapituloProgramaCapacitacion == dataSource.idCapitulo
              );
              let subsesiones =
                sesiones[0].listaSesionesProgramaCapacitacion.filter(
                  (x) => x.idSesionProgramaCapacitacion == dataSource.idSesion
                );
              let idSesionTemporal = dataSource.idSesion;
              if (subsesiones.length == 0) {
                sesiones[0].listaSesionesProgramaCapacitacion.forEach((x) => {
                  const temp = x.listaSubSeccionProgramaCapacitacion.filter(
                    (y) => y.idSesionProgramaCapacitacion == dataSource.idSesion
                  );
                  if (temp.length > 0)
                    idSesionTemporal = x.idSesionProgramaCapacitacion;
                });
              }
              this.formConfiguracionPreguntas.patchValue({
                habilitarConfiguracion: dataSource.idTipoRespuesta
              });
              subsesiones =
                sesiones[0].listaSesionesProgramaCapacitacion.filter(
                  (x) => x.idSesionProgramaCapacitacion == idSesionTemporal
                );
              this.listaSesion = sesiones[0].listaSesionesProgramaCapacitacion;
              if (dataSource.idSesion != null && sesiones.length > 0) {
                this.formConfiguracionPreguntas
                  .get('idSesion')
                  .setValue(idSesionTemporal);
                if (
                  subsesiones.length > 0 &&
                  !(
                    subsesiones[0].listaSubSeccionProgramaCapacitacion.length ==
                      1 &&
                    subsesiones[0].listaSubSeccionProgramaCapacitacion[0]
                      .subSeccionProgramaCapacitacion == ''
                  )
                ) {
                  this.estadoCascada.subsesiones = false;
                  this.formConfiguracionPreguntas
                    .get('idSubsesion')
                    .setValue(dataSource.idSesion);
                  this.listaSubSesion =
                    subsesiones[0].listaSubSeccionProgramaCapacitacion;
                }
              }
              this.loaderModal = false;
            }
          },
        });
    // }
    this.formConfiguracionPreguntas.patchValue({
      id: dataSource.id,
      idPGeneral: dataSource.idPGeneral,
      idCapitulo: dataSource.idCapitulo,
      idSubsesion: dataSource.idSesion,
      grupoPregunta: dataSource.grupoPregunta,
      idTipoMarcador: dataSource.idTipoMarcador,
      valorMarcador: dataSource.valorMarcador,
      ordenPreguntaGrupo: dataSource.ordenPreguntaGrupo,
      //TAB: General
      habilitarConfiguracion: dataSource.idTipoRespuesta,
      //TAB: Pregunta
      enunciadoPregunta: dataSource.enunciado,
      calificacionRespuesta: dataSource.idTipoRespuestaCalificacion,
      factorRespuesta: dataSource.factorRespuesta,
      tiempoMinutos: dataSource.minutosPorPregunta,
      idTipoRespuesta:dataSource.idTipoRespuesta,
      habilitarAleatorio: dataSource.respuestaAleatoria
        ? dataSource.respuestaAleatoria
        : false,
      //TAB: Feedback
      feedRespuestaCorrecta: !dataSource.activarFeedBackRespuestaCorrecta
        ? false
        : dataSource.activarFeedBackRespuestaCorrecta,
      feedRespuestaIncorrecta: !dataSource.activarFeedBackRespuestaIncorrecta
        ? false
        : dataSource.activarFeedBackRespuestaIncorrecta,
      feedManeraInmediata: !dataSource.mostrarFeedbackInmediato
        ? false
        : dataSource.mostrarFeedbackInmediato,
      feedResponderPregunta: !dataSource.mostrarFeedbackPorPregunta
        ? false
        : dataSource.mostrarFeedbackPorPregunta,
      //TAB: Intentos
      numeroIntentoMaximo: dataSource.numeroMaximoIntento,
      habilitarFeedbackMaxIntentos: !dataSource.activarFeedbackMaximoIntento
        ? false
        : dataSource.activarFeedbackMaximoIntento,
      mensajeFeedbackIntento: dataSource.mensajeFeedbackIntento,
    });
    
    let nombreFormControl =
      dataSource.idTipoRespuesta == 1
        ? 'configuracionAutomatica'
        : 'configuracionManual';
     this.formConfiguracionPreguntas
       .get(nombreFormControl)
       .setValue(dataSource.idPreguntaTipo);
     
    // this.gridCantidadIntentos.loading = true;
    // this.loaderModal = true;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.MaestroPreguntaProgramaCapacitacionObtenerIntentosPregunta}/${dataSource.idPreguntaIntento}`
      )
      .subscribe({
        next: (res: HttpResponse<ConfiguracionIntento[]>) => {
          this.gridCantidadIntentos.data = res.body;
          this.gridCantidadIntentos.loading = false;
          this.loaderModal = false;
        },
        error: (err) => {
          this.gridCantidadIntentos.loading = false;
          this.loaderModal = false;
        },
      });
    // this.gridConfiguracionRespuesta.loading = true;
    // this.loaderModal = true;
     this._integraService
      .getJsonResponse(
       `${constApiPlanificacion.MaestroPreguntaProgramaCapacitacionObtenerRespuestasPregunta}/${dataSource.id}`
      )
      .subscribe({
        next: (res: HttpResponse<ConfiguracionRespuesta[]>) => {
          this.gridConfiguracionRespuesta.data = res.body;
          this.gridConfiguracionRespuesta.loading = false;
          this.loaderModal = false;
        },
        error: (err) => {
          this.gridConfiguracionRespuesta.loading = false;
          this.loaderModal = false;
        },
      });
     this.modalRefEditar = this._modalService.open(
       this.modalConfiguracionRespuesta,
      {
        size: 'lg',
        backdrop: 'static',
      }
    );
  }



  insertar(): void {
    if (
      this.formConfiguracionPreguntas.valid &&
      (this.formConfiguracionPreguntas.get('habilitarConfiguracion').value == 1 ||
        this.formConfiguracionPreguntas.get('habilitarConfiguracion').value == 2)
    ) {
      this.loaderModal = true;
      let dataEnviada = this.formatearObjeto();
      this._integraService
        .postJsonResponse(
          constApiPlanificacion.MaestroPreguntaProgramaCapacitacionInsertar,
          dataEnviada
        )
        .subscribe({
          next: (res: HttpResponse<boolean>) => {
            this.resetearModalPrincipal();
            this.loaderModal = false;
            this.obtener();
            Swal.fire(
              '¡Registrado!',
              'El registro ha sido creado correctamente.',
              'success'
            );
          },
          error: (err) => {
            this.loaderModal = false;
          },
        });
    } else {
      this.formConfiguracionPreguntas.markAllAsTouched();
      this.loaderModal = false;
      Swal.fire('Campos obligatorios vacios', 'Verifique los campos, revise el tipo de calificacion', 'info');
    }
  }
  actualizar(): void {
    let form = this.formConfiguracionPreguntas;
    if (
      form.valid &&
      (
        form.get('habilitarConfiguracion').value == 1 && form.get('configuracionAutomatica').value != null ||
        form.get('habilitarConfiguracion').value == 2 && form.get('configuracionManual').value != null
      )
    ) {
      this.loaderModal = true;
      let dataEnviada = this.formatearObjeto();
      this._integraService
        .putJsonResponse(
          constApiPlanificacion.MaestroPreguntaProgramaCapacitacionActualizar,
          dataEnviada
        )
        .subscribe({
          next: (res: HttpResponse<boolean>) => {
            this.resetearModalPrincipal();
            this.loaderModal = false;
            this.obtener();
            Swal.fire(
              'Actualizado!',
              'El registro ha sido actualizado correctamente.',
              'success'
            );
          },
          error: (err) => {
            this.loaderModal = false;
            this._alertaService.notificationWarning(`Surgio un error: ${err}`);
          },
        });
    } else {
      this.formConfiguracionPreguntas.markAllAsTouched();
      this.loaderModal = false;
      Swal.fire('Campos obligatorios vacios', 'Verifique los campos, revise el tipo de calificacion', 'info');
    }
  }
  eliminarMultiple(): void {
    Swal.fire({
      title: `¿Está seguro de eliminar las (${this.preguntasInteractivasSeleccionadas.length})preguntas seleccionadas?`,
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminar(this.preguntasInteractivasSeleccionadas);
      }
    });
  }
  eliminarUnitario(dataSource: PreguntaInteractiva): void {
    Swal.fire({
      title: '¿Está seguro de eliminar la pregunta?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) this.eliminar(dataSource.id);
    });
  }
  eliminar(ids: number | number[]): void {
    this.gridPreguntasInteractivas.loading = true;
    this._integraService
      .deleteJsonResponse(
        `${constApiPlanificacion.MaestroPreguntaProgramaCapacitacionEliminar}/${ids}`
      )
      .subscribe({
        next: (res: HttpResponse<boolean>) => {
          this.gridPreguntasInteractivas.loading = false;
          this._alertaService.notificationSuccessBotom(
            `Se elimino de manera exitosa`
          );
          this.obtener();
        },
        error: (err) => {
          this.gridPreguntasInteractivas.loading = false;
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
        },
      });
  }
  exportarExcel(): void {
    try {
      let dia = new Date();
      let fechaActual = `${dia.getFullYear()}-${
        dia.getMonth() + 1
      }-${dia.getDate()}`;
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet(fechaActual);
      worksheet.addRow(
        Object.values([
          'IdPGeneral',
          'IdPespecifico',
          'OrdenFilaCapitulo',
          'Sesion',
          'SubSesion',
          'GrupoPregunta',
          'IdTipoMarcador',
          'ValorMarcador',
          'OrdenPreguntaGrupo',
          'IdTipoRespuesta',
          'IdPreguntaTipo',
          'EnunciadoPregunta',
          'MinutosPorPregunta',
          'RespuestaAleatoria',
          'ActivarFeedBackRespuestaCorrecta',
          'ActivarFeedBackRespuestaIncorrecta',
          'MostrarFeedbackInmediato',
          'MostrarFeedbackPorPregunta',
          'NumeroMaximoIntento',
          'ActivarFeedbackMaximoIntento',
          'MensajeFeedback',
          'IdTipoRespuestaCalificacion',
          'FactorRespuesta',
          'RespuestaCorrecta',
          'NroOrden',
          'EnunciadoRespuesta',
          'Puntaje',
          'FeedbackPositivo',
          'FeedbackNegativo',
          'PorcentajeCalificacion',
        ])
      );
      const contenidoFila = this.dataReporteExportar.filter(
        (x: ReportePreguntasExportar) =>
          this.preguntasInteractivasSeleccionadas.includes(x.id)
      );
      contenidoFila.forEach((e: ReportePreguntasExportar) => {
        worksheet.addRow(
          Object.values({
            IdPGeneral: e.idPGeneral,
            IdPEspecifico: e.idPEspecifico,
            OrdenFilaCapitulo: e.ordenFilaCapitulo,
            Sesion: e.sesion,
            SubSesion: e.subSesion,
            GrupoPregunta: e.grupoPregunta,
            IdTipoMarcador: e.idTipoMarcador,
            ValorMarcador: e.valorMarcador,
            OrdenPreguntaGrupo: e.ordenPreguntaGrupo,
            IdTipoRespuesta: e.idTipoRespuesta,
            IdPreguntaTipo: e.idPreguntaTipo,
            EnunciadoPregunta: e.enunciadoPregunta,
            MinutosPorPregunta: e.minutosPorPregunta,
            RespuestaAleatoria: e.respuestaAleatoria,
            ActivarFeedBackRespuestaCorrecta:
              e.activarFeedBackRespuestaCorrecta,
            ActivarFeedBackRespuestaIncorrecta:
              e.activarFeedBackRespuestaIncorrecta,
            MostrarFeedbackInmediato: e.mostrarFeedbackInmediato,
            MostrarFeedbackPorPregunta: e.mostrarFeedbackPorPregunta,
            NumeroMaximoIntento: e.numeroMaximoIntento,
            ActivarFeedbackMaximoIntento: e.activarFeedbackMaximoIntento,
            MensajeFeedback: e.mensajeFeedback,
            IdTipoRespuestaCalificacion: e.idTipoRespuestaCalificacion,
            FactorRespuesta: e.factorRespuesta,
            RespuestaCorrecta: e.respuestaCorrecta,
            NroOrden: e.nroOrden,
            EnunciadoRespuesta: e.enunciadoRespuesta,
            Puntaje: e.puntaje,
            FeedbackPositivo: e.feedbackPositivo,
            FeedbackNegativo: e.feedbackNegativo,
            PorcentajeCalificacion: e.porcentajeCalificacion,
          })
        );
      });
      worksheet.columns.forEach((c) => {
        const long = c.values.map((v) => v.toString().length);
        const maxLong = Math.max(...long.filter((v) => typeof v == 'number'));
        c.width = maxLong;
      });
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        FileSaver.saveAs(
          blob,
          `ReportePreguntasInteractivas_${fechaActual}.xlsx`
        );
      });
      this._alertaService.notificationSuccessBotom(
        `Se esta descargando el archivo`
      );
    } catch (err) {
      this._alertaService.notificationWarning(
        `Aun se esta procesando los registros`
      );
    }
  }
  importarExcel(): void {
    this.loaderImport = true;
    let dataEnviada: FormData = new FormData();
    let archivo = this.archivoImportado.value.files[0].rawFile;
    dataEnviada.append('files', archivo);
    this._integraService
      .postJsonResponse(
        constApiPlanificacion.MaestroPreguntaProgramaCapacitacionImportarExcel,
        dataEnviada
      )
      .subscribe({
        next: (res: HttpResponse<any>) => {
          this._alertaService.notificationSuccessBotom(
            `Se Importo el archivo de manera exitosa!`
          );
          this.obtenerReporte();
          this.obtener();
          this.loaderImport = false;
        },
        error: (err) => {
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
          this.loaderImport = false;
        },
      });
  }
  cargarConfiguracionGridCantidadIntentos(): void {
    this.gridCantidadIntentos.getCellCloseEvent$().subscribe({
      next: (rpta) => {
        let form = rpta.formGroup.getRawValue();
        rpta.dataItem.porcentajeCalificacion = rpta.formGroupValue.porcentaje;
      },
    });
    this.gridCantidadIntentos.getCellClickEvent$().subscribe({
      next: (rpta) => {
        this.gridCantidadIntentos.formGroup.setValue({
          porcentaje: rpta.dataItem.porcentajeCalificacion,
        });
      },
    });
    this,this.gridCantidadIntentos.getRemoveEvent$().subscribe(
      resp=>{
        this.gridCantidadIntentos.data.splice(resp.index, 1);
        this.gridCantidadIntentos.loadData();
        this.formConfiguracionPreguntas.get('numeroIntentoMaximo').setValue(this.gridCantidadIntentos.data.length);
      }
    )
    this.gridCantidadIntentos.formGroup = this._formBuilder.group({
      porcentaje: [0, [Validators.required]],
    });
  }
  cargarConfiguracionGridConfiguracionRespuesta(): void {
    this.gridConfiguracionRespuesta.getCellCloseEvent$().subscribe({
      next: (rpta) => {
        let form = rpta.formGroup.getRawValue();
        rpta.dataItem.respuestaCorrecta = form.respuestaCorrecta;
        rpta.dataItem.nroOrdenRespuesta = form.respuestaNroOrdenRespuesta;
        rpta.dataItem.nroOrden = form.respuestaNroOrden;
        rpta.dataItem.enunciadoRespuesta = form.respuestaEnunciadoRespuesta;
        rpta.dataItem.puntaje = form.respuestaPuntaje;
        rpta.dataItem.feedbackPositivo = form.respuestaFeedbackPositivo;
        rpta.dataItem.feedbackNegativo = form.respuestaFeedbackNegativo;
      },
    });
    this.gridConfiguracionRespuesta.getCellClickEvent$().subscribe({
      next: (rpta) => {
        this.gridConfiguracionRespuesta.formGroup.setValue({
          respuestaCorrecta: rpta.dataItem.respuestaCorrecta,
          respuestaNroOrdenRespuesta: rpta.dataItem.nroOrdenRespuesta,
          respuestaNroOrden: rpta.dataItem.nroOrden,
          respuestaEnunciadoRespuesta: rpta.dataItem.enunciadoRespuesta,
          respuestaPuntaje: rpta.dataItem.puntaje,
          respuestaFeedbackPositivo: rpta.dataItem.feedbackPositivo,
          respuestaFeedbackNegativo: rpta.dataItem.feedbackNegativo,
        });
      },
    });
    this.gridConfiguracionRespuesta.formGroup = this._formBuilder.group({
      respuestaCorrecta: [false],
      respuestaNroOrdenRespuesta: [0],
      respuestaNroOrden: [0],
      respuestaEnunciadoRespuesta: [''],
      respuestaPuntaje: [0],
      respuestaFeedbackPositivo: [''],
      respuestaFeedbackNegativo: [''],
    });
  }
  capturarIntentosMaximos(intentos: number): void {
    if (intentos != null && intentos > 0 && intentos<10) {
      if (intentos < this.gridCantidadIntentos.data.length) {
        let sobrantes = this.gridCantidadIntentos.data.length - intentos;
        this.gridCantidadIntentos.data.splice(-sobrantes, sobrantes);
      } else {
        let existentes = intentos - this.gridCantidadIntentos.data.length;
        let nuevosRegistros = new Array<ConfiguracionIntento>(existentes).fill({
          id: 0,
          idPreguntaIntento: 0,
          porcentajeCalificacion: 0,
        });
        this.gridCantidadIntentos.data =
          this.gridCantidadIntentos.data.concat(nuevosRegistros);
      }
    } else {
      this.gridCantidadIntentos.data = [];
    }
    this.gridCantidadIntentos.loadData();
  }
 /*  eliminarIntentosMaximos(dataItem: ConfiguracionIntento): void {
    let idIndice = this.gridCantidadIntentos.data.indexOf(dataItem);
    this.gridCantidadIntentos.data.splice(idIndice, 1);
    if (this.gridCantidadIntentos.data.length == 0)
      this.gridCantidadIntentos.data = [];
   
   
    this.gridCantidadIntentos.loadData();
    const valorActual = this.intentoMaximo.value;

    // Reducir el valor en 1
  const nuevoValor = parseInt(valorActual, 10) - 1;

    // Establecer el nuevo valor en el input
  this.intentoMaximo.value = nuevoValor.toString();

  } */

  agregarConfiguracionRespuesta(): void {
    this.gridConfiguracionRespuesta.data.push({
      id: 0,
      enunciadoRespuesta: '',
      feedbackNegativo: '',
      feedbackPositivo: '',
      nroOrden: 0,
      nroOrdenRespuesta: 0,
      puntaje: 0,
      respuestaCorrecta: false,
      idPreguntaProgramaCapacitacion: null,
      mostrarFeedBack: null,
      puntajeTipoRespuesta: null,
    });
    this.gridConfiguracionRespuesta.loadData();
  }
  eliminarConfiguracionRespuesta(dataItem: ConfiguracionRespuesta): void {
    let idIndice = this.gridConfiguracionRespuesta.data.indexOf(dataItem);
    this.gridConfiguracionRespuesta.data.splice(idIndice, 1);
    if (this.gridConfiguracionRespuesta.data.length == 0)
      this.gridConfiguracionRespuesta.data = [];
    this.gridConfiguracionRespuesta.loadData();
  }
  seleccionarAlmacenarArchivo(data: any): void {
    this.archivoImportado.setValue(data);
  }
  deseleccionarAlmacenarArchivo(): void {
    this.archivoImportado.setValue(null);
  }
  formatearObjeto(): any {
    let form = this.formConfiguracionPreguntas.getRawValue();
    let objetoEnviado = {
      preguntaProgramaCapacitacion: {
        id: form.id,
        idPgeneral: form.idPGeneral,
        idPespecifico: form.idPespecifico,
        ordenFilaCapitulo: form.idCapitulo,
        ordenFilaSesion: form.idSesion,
        grupoPregunta: form.grupoPregunta,
        idTipoMarcador: form.idTipoMarcador,
        valorMarcador: form.valorMarcador,
        ordenPreguntaGrupo: form.ordenPreguntaGrupo,
        idTipoRespuesta: form.habilitarConfiguracion,
        idPreguntaTipo:
          form.habilitarConfiguracion == 1
            ? form.configuracionAutomatica
            : form.configuracionManual,
        enunciadoPregunta: form.enunciadoPregunta,
        minutosPorPregunta: form.tiempoMinutos,
        respuestaAleatoria: form.habilitarAleatorio,
        activarFeedBackRespuestaCorrecta: form.feedRespuestaCorrecta,
        activarFeedBackRespuestaIncorrecta: form.feedRespuestaIncorrecta,
        mostrarFeedbackInmediato: form.feedManeraInmediata,
        mostrarFeedbackPorPregunta: form.feedResponderPregunta,
        idTipoRespuestaCalificacion: form.calificacionRespuesta,
        factorRespuesta: form.factorRespuesta,
        idPreguntaEscalaValor: 0,
        requiereTiempo: false,
        idPreguntaIntento: 0,
      },
      preguntaIntento: {
        id: 0,
        numeroMaximoIntento: form.numeroIntentoMaximo,
        activarFeedbackMaximoIntento: form.habilitarFeedbackMaxIntentos,
        mensajeFeedback: form.mensajeFeedbackIntento,
        preguntaIntentoDetalles: this.gridCantidadIntentos.data,
      },
      respuestaPreguntaProgramaCapacitacions:
        this.gridConfiguracionRespuesta.data,
    };
    if (form.idSubsesion > 0)
      objetoEnviado.preguntaProgramaCapacitacion.ordenFilaSesion =
        form.idSubsesion;
    return objetoEnviado;
  }
  resetearModalPrincipal(): void {
    if (this.modalRefEditar != null) {
      this.modalRefEditar.close();
      this.modalRefEditar = null;
    }
    this.formConfiguracionPreguntas.reset();
    this.gridConfiguracionRespuesta.data = [];
    this.gridCantidadIntentos.data = [];
    this.resetearEstadoCascada();
    this.loaderModal = false;
  }
  resetearModalImportar(): void {
    if (this.modalRefImportar != null) {
      this.modalRefImportar.close();
      this.modalRefImportar = null;
    }
    this.archivoImportado.reset();
    this.loaderModal = false;
  }
  resetearEstadoCascada(): void {
    this.estadoCascada = {
      pespecificos: true,
      capitulos: true,
      sesiones: true,
      subsesiones: true,
    };
  }
  //Funciones de filtrado en cascada para el filtro
  filtrarPgeneralBusqueda(value: string): void {
    if (value.length >= 1) {
      this.listaPgeneral = this.listaCombos.pGenerals.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.listaPgeneral = this.listaCombos.pGenerals;
    }
  }
  filtrarPespecificosPorPgeneral(idPgeneral: number): void {
    this.listaSesion = [];
    this.listaSubSesion = [];
    
    this.formConfiguracionPreguntas.get("idPespecifico").setValue(null);
    this.formConfiguracionPreguntas.get("idCapitulo").setValue(null);
    this.formConfiguracionPreguntas.get("idSesion").setValue(null);
    this.formConfiguracionPreguntas.get("idSubsesion").setValue(null);
    
    this.estadoCascada.sesiones = true;
    this.estadoCascada.subsesiones = true;
    const contentListaPespecifico = this.listaCombos.pEspecificos.filter(
      (x) => x.idProgramaGeneral == idPgeneral
    );
    if (idPgeneral > 0) {
      if (contentListaPespecifico.length > 0) {
        this.estadoCascada.pespecificos = false;
        this.listaPespecifico = contentListaPespecifico;
      }
      this._integraService
        .getJsonResponse(
          `${constApiPlanificacion.MaestroPreguntaProgramaCapacitacionObtenerCapituloSesionesPGeneral}/${idPgeneral}`
        )
        .subscribe({
          next: (res: HttpResponse<CapituloSesionesPgeneral[]>) => {
            this.estadoCascada.capitulos = false;
            this.listaCapitulo = res.body;
            this.listaComboCapitulo = res.body;
          },
          complete: () => {
            this.formConfiguracionPreguntas.patchValue({
              idPespecifico: 0,
              idCapitulo: 0,
              idSesion: 0,
              idSubsesion: 0,
            });
            this.estadoCascada.capitulos = false;
          },
        });
    } else {
      this.estadoCascada = {
        pespecificos: true,
        capitulos: true,
        sesiones: true,
        subsesiones: true,
      };
      this.listaPespecifico = [];
      this.listaCapitulo = [];
      this.listaSesion = [];
      this.listaSubSesion = [];
    }
  }
  filtrarPespecificoBusqueda(value: string): void {
    
    if (value.length >= 1) {
      this.listaPespecifico = this.listaCombos.pEspecificos.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.listaPespecifico = this.listaCombos.pEspecificos;
    }
  }
  filtrarCapituloBusqueda(value: string): void {
    if (value.length >= 1) {
      this.listaCapitulo = this.listaComboCapitulo.filter(
        (s) =>
          s.capituloProgramaCapacitacion
            .toLowerCase()
            .indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.listaCapitulo = this.listaComboCapitulo;
    }
  }
  filtrarSesionesPorCapitulo(idCapitulo: number): void {
    this.estadoCascada.subsesiones = true;
    this.listaSubSesion = [];
    this.formConfiguracionPreguntas.get("idSesion").setValue(null);
    this.formConfiguracionPreguntas.get("idSubsesion").setValue(null);
    if (idCapitulo > 0) {
      let listaSesionTemp = this.listaCapitulo.filter(
        (x) => x.idCapituloProgramaCapacitacion == idCapitulo
      );
      if (listaSesionTemp.length > 0)
        this.listaSesion = listaSesionTemp[0].listaSesionesProgramaCapacitacion;
      this.formConfiguracionPreguntas.get('idSesion').setValue(0);
      this.estadoCascada.sesiones = false;
    } else {
      this.listaSesion = [];
      this.estadoCascada.sesiones = true;
    }
  }
  filtrarSesionBusqueda(value: string): void {
    let idCapitulo = this.formConfiguracionPreguntas.get('idCapitulo').value;
    let item = this.listaCapitulo.find(
      (x) => x.idCapituloProgramaCapacitacion == idCapitulo
    );
    let indice = this.listaCapitulo.indexOf(item);
    if (value.length >= 1) {
      this.listaSesion = this.listaCapitulo[
        indice
      ].listaSesionesProgramaCapacitacion.filter(
        (s) =>
          s.sesionProgramaCapacitacion
            .toLowerCase()
            .indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.listaSesion =
        this.listaCapitulo[indice].listaSesionesProgramaCapacitacion;
    }
  }
  filtrarSubSesionesPorSesion(idSesion: number): void {
    this.formConfiguracionPreguntas.get("idSubsesion").setValue(null);
    if (idSesion > 0) {
      let idCapitulo = this.formConfiguracionPreguntas.get('idCapitulo').value;
      let itemCapitulo = this.listaCapitulo.find(
        (x) => x.idCapituloProgramaCapacitacion == idCapitulo
      );
      let indiceCapitulo = this.listaCapitulo.indexOf(itemCapitulo);
      let listaSubsesionTemp = this.listaCapitulo[
        indiceCapitulo
      ].listaSesionesProgramaCapacitacion.filter(
        (x) => x.idSesionProgramaCapacitacion == idSesion
      );
      if (
        listaSubsesionTemp.length > 0 &&
        !(
          listaSubsesionTemp[0].listaSubSeccionProgramaCapacitacion.length ==
            1 &&
          listaSubsesionTemp[0].listaSubSeccionProgramaCapacitacion[0]
            .subSeccionProgramaCapacitacion == ''
        )
      ) {
        this.formConfiguracionPreguntas.get('idSubsesion').setValue(0);
        this.listaSubSesion =
          listaSubsesionTemp[0].listaSubSeccionProgramaCapacitacion;
        this.estadoCascada.subsesiones = false;
      } else {
        this.listaSubSesion = [];
        this.estadoCascada.subsesiones = true;
      }
    } else {
      this.listaSubSesion = [];
      this.estadoCascada.subsesiones = false;
    }
  }
  filtrarSubSesionBusqueda(value: string): void {
    let idCapitulo = this.formConfiguracionPreguntas.get('idCapitulo').value;
    let itemCapitulo = this.listaCapitulo.find(
      (x) => x.idCapituloProgramaCapacitacion == idCapitulo
    );
    let indiceCapitulo = this.listaCapitulo.indexOf(itemCapitulo);

    let idSesion = this.formConfiguracionPreguntas.get('idSesion').value;
    let itemSesion = this.listaCapitulo[
      indiceCapitulo
    ].listaSesionesProgramaCapacitacion.find(
      (x) => x.idSesionProgramaCapacitacion == idSesion
    );
    let indiceSesion =
      this.listaCapitulo[
        indiceCapitulo
      ].listaSesionesProgramaCapacitacion.indexOf(itemSesion);
    if (value.length >= 1) {
      this.listaSubSesion = this.listaCapitulo[
        indiceCapitulo
      ].listaSesionesProgramaCapacitacion[
        indiceCapitulo
      ].listaSubSeccionProgramaCapacitacion.filter(
        (s) =>
          s.subSeccionProgramaCapacitacion
            .toLowerCase()
            .indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.listaSubSesion =
        this.listaCapitulo[indiceCapitulo].listaSesionesProgramaCapacitacion[
          indiceCapitulo
        ].listaSubSeccionProgramaCapacitacion;
    }
  }

  abrirModalDificultad(dataSource: PreguntaInteractiva): void {
    this.preguntaSeleccionadaDificultad = dataSource;
    this.idDificultadSeleccionada = null;
    this.loaderModalDificultad = true;
    this.modalRefDificultad = this._modalService.open(this.modalConfiguracionDificultad, {
      size: 'md',
      centered: true,
      backdrop: 'static'
    });
    this._integraService.getJsonResponse(`${constApiPlanificacion.MaestroPreguntaProgramaCapacitacionObtenerDificultadPorIdPregunta}/${dataSource.id}`).subscribe({
      next: (dificultadActual: any) => {
        this.idDificultadSeleccionada = dificultadActual.body?.idPreguntaProgramaCapacitacionDificultad ?? null;
        this.loaderModalDificultad = false;
      },
      error: () => {
        this.loaderModalDificultad = false;
        Swal.fire('Error', 'No se pudo cargar la dificultad de la pregunta', 'error');
      }
    });
  }

  guardarDificultad(): void {
    if (this.idDificultadSeleccionada === null) return;
    this.loaderGuardarDificultad = true;
    const body = {
      id: this.preguntaSeleccionadaDificultad.id,
      idPreguntaProgramaCapacitacionDificultad: this.idDificultadSeleccionada
    };
    this._integraService
      .putJsonResponse(constApiPlanificacion.MaestroPreguntaProgramaCapacitacionActualizarDificultad, body)
      .subscribe({
        next: () => {
          this.loaderGuardarDificultad = false;
          this.resetearModalDificultad();
          Swal.fire({ icon: 'success', title: 'Dificultad actualizada', timer: 1500, showConfirmButton: false });
          this.obtener();
        },
        error: (err: any) => {
          this.loaderGuardarDificultad = false;
          Swal.fire('Error', err?.error || 'No se pudo actualizar la dificultad', 'error');
        }
      });
  }

  resetearModalDificultad(): void {
    if (this.modalRefDificultad) {
      this.modalRefDificultad.close();
      this.modalRefDificultad = null;
    }
    this.preguntaSeleccionadaDificultad = null;
    this.idDificultadSeleccionada = null;
    this.loaderGuardarDificultad = false;
    this.loaderModalDificultad = false;
  }
}
