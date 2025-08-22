import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
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
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@environments/environment';
import * as FileSaver from 'file-saver';
interface SecuenciaPregunta {
  idPgeneral: number;
  idTipoVista: number;
  segundos: number;
  grupoPregunta: string;
}
interface GrupoFilas {
  cantidadCorrecto: number;
  cantidadIncorrecto: number;
}
@Component({
  selector: 'app-modal-configuracion-video',
  templateUrl: './modal-configuracion-video.component.html',
})
export class ModalConfiguracionVideoComponent implements OnInit {
  @ViewChild('modalConfiguracionVideoImportar') modalConfiguracionVideoImportar: any;
  public listaTipoVista: Array<IComboBase1>;
  public listaTipoMarcador: Array<IComboBase1>;
  public configuracionVideoPrincipal: ConfiguracionVideoPrincipal;
  public configuracionVideo: ConfiguracionVideo[];
  public modalContext: NgbModalRef;

  gridConfiguracionSecuenciaVideo: KendoGrid = new KendoGrid();
  gridConfiguracionSecuenciaVideoDetalle: KendoGrid = new KendoGrid();
  
  gridConfiguracionSecuenciaPreguntaDetalle: KendoGrid = new KendoGrid();
  gridConfiguracionSecuenciaPreguntaDetalleRegistro: KendoGrid = new KendoGrid();

  loaderModal: boolean = false;
  loaderModalDetalle: boolean = false;
  loaderModalImportacion: boolean = false;

  grupoCantidadFilas: GrupoFilas;
  flagImportar: number = 0;
  dataRowConfiguracionVideo: any = null;
  modalRefImportar: NgbModalRef = null;
  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  
  mostrarConfiguracionVideo: boolean = false;
  mostrarConfiguracionRespuesta: boolean = false;
  mostrarResultadoImportacion: boolean = false;
  
  archivoImportado = new FormControl(null);
  formConfiguracionVideo: FormGroup = this._formBuilder.group({
    id: [0],
    idPgeneral: [0],
    videoId: [''],
    configurado: [false],
    idDocumentoSeccionPw: [0],
    totalMinutos: [0],
    archivo: [''],
    nroDiapositivas: [0],
    conImagenVideo: [false],
    conImagenDiapositiva: [false],
    numeroFila: [0],
    videoIdBrightcove: [''],
    imagenVideoNombre: [''],
    imagenVideoAncho: [0],
    imagenVideoAlto: [0],
    imagenVideoPosicionX: [0],
    imagenVideoPosicionY: [0],
    imagenDiapositivaNombre: [''],
    imagenDiapositivaAncho: [],
    imagenDiapositivaAlto: [],
    imagenDiapositivaPosicionX: [],
    imagenDiapositivaPosicionY: []
  });

  urlBase = environment.urlServicioAPI;
  constructor(
    private _integraService: IntegraService,
    private _formBuilder: FormBuilder,
    private _alertaService: AlertaService,
    private _modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.obtenerConfiguracionVideo();
    this.cargarConfiguracionGridSecuensiaVideo();
    this.cargarConfiguracionGridSecuenciaPregunta();
  }
  ngOnDestroy(): void {
    this.gridConfiguracionSecuenciaVideo.data = [];
    this.gridConfiguracionSecuenciaVideoDetalle.data = [];
    this.gridConfiguracionSecuenciaPreguntaDetalle.data = [];
    this.gridConfiguracionSecuenciaPreguntaDetalleRegistro.data = [];
    this.mostrarConfiguracionRespuesta = false;
    this.mostrarResultadoImportacion = false;
    this.mostrarConfiguracionVideo = false;
    this.formConfiguracionVideo.reset();
    this.archivoImportado.reset();
    this.flagImportar = 0;
  }
  obtenerConfiguracionVideo(): void {
    if(this.configuracionVideo != null) {
      this.gridConfiguracionSecuenciaVideo.data = this.configuracionVideo;
      this.gridConfiguracionSecuenciaVideo.loading = false;
    }
  }
  obtenerDetalleConfigurarVideo(dataRow: any): void {
    if (dataRow.selectedRows.length < 2) {
      if (this.dataRowConfiguracionVideo == null) {
        this.dataRowConfiguracionVideo = dataRow;
      }
      let data = dataRow.selectedRows[0].dataItem;
      this.loaderModalDetalle = true;
      this.mostrarConfiguracionVideo = true;
      this._integraService
        .getJsonResponse(
          `${constApiPlanificacion.ConfigurarVideoProgramaObtenerConfiguracionSesionPrograma}/${data.idPgeneral}/${data.ordenSeccion}/${data.ordenFila}`
        )
        .subscribe({
          next: (res: HttpResponse<any>) => {
            if (res.body != null) {
              this.mostrarConfiguracionRespuesta = false;
              this.loaderModalDetalle = false;
              this.formConfiguracionVideo.setValue({
                idPgeneral:           res != null ? res.body.idPgeneral : 0,
                idDocumentoSeccionPw: res != null ? res.body.idDocumentoSeccionPw : 0,
                configurado:          res != null ? res.body.configurado : 0,
                videoId:              res != null ? String(res.body.videoId) : 0,
                id:                   res != null ? Number(res.body.id) : 0,
                totalMinutos:         res != null ? Number(res.body.totalMinutos) : 0,
                archivo:              res != null ? res.body.archivo : '',
                nroDiapositivas:      res != null ? Number(res.body.nroDiapositivas) : 0,
                conImagenVideo:       res != null ? res.body.conImagenVideo : false,
                conImagenDiapositiva: res != null ? res.body.conImagenDiapositiva : false,
                numeroFila:           res != null ? res.body.numeroFila : 0,
                videoIdBrightcove:    res != null ? res.body.videoIdBrightcove : '',
                imagenDiapositivaNombre:    res != null ? res.body.imagenDiapositivaNombre : '',
                imagenDiapositivaAncho:     res != null ? Number(res.body.imagenDiapositivaAncho) : 0,
                imagenDiapositivaAlto:      res != null ? Number(res.body.imagenDiapositivaAlto) : 0,
                imagenDiapositivaPosicionX: res != null ? Number(res.body.imagenDiapositivaPosicionX) : 0,
                imagenDiapositivaPosicionY: res != null ? Number(res.body.imagenDiapositivaPosicionY) : 0,
                imagenVideoNombre:    res != null ? res.body.imagenVideoNombre : '',
                imagenVideoAncho:     res != null ? Number(res.body.imagenDiapositivaAncho) : 0,
                imagenVideoAlto:      res != null ? Number(res.body.imagenDiapositivaAlto) : 0,
                imagenVideoPosicionX: res != null ? Number(res.body.imagenDiapositivaPosicionX) : 0,
                imagenVideoPosicionY: res != null ? Number(res.body.imagenDiapositivaPosicionY) : 0,
              });
              
              this.gridConfiguracionSecuenciaVideoDetalle.data = (res != null) ? res.body.sesionConfigurarVideos : [];
            }
          },
        });
      this._integraService
        .getJsonResponse(
          `${constApiPlanificacion.ConfigurarVideoProgramaObtenerConfiguracionPreguntasEstructura}/${data.idPgeneral}/${data.ordenCapitulo}/${data.ordenFila}`
        )
        .subscribe({
          next: (response: HttpResponse<any[]>) => {
            this.loaderModalDetalle = false;
            this.gridConfiguracionSecuenciaPreguntaDetalle.data =
              (response.body != null) ? response.body.map((x) => {
                return {
                  nombreMarcador: this.listaTipoMarcador.find((y) => y.id == x.idTipoVista).nombre,
                  ...x,
                };
              }) : [];
          },
        });
    }
  }
  obtenerDetalleConfigurarPregunta(idPgeneral: number, pregunta: string): void {
    this.mostrarConfiguracionRespuesta = true;
    this.gridConfiguracionSecuenciaPreguntaDetalleRegistro.loading = true;
    this.gridConfiguracionSecuenciaPreguntaDetalleRegistro.data = [];
    this.gridConfiguracionSecuenciaPreguntaDetalleRegistro.loadData();
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.MaestroPreguntaProgramaCapacitacionObtenerPorEstructura}/${idPgeneral}/${pregunta}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridConfiguracionSecuenciaPreguntaDetalleRegistro.data = response.body;
          this.gridConfiguracionSecuenciaPreguntaDetalleRegistro.loading = false;
        },
      });
  }
  insertarActualizarConfiguracionSecuenciaVideoDetalle(): void {
    let dataEnviada = this.formatearObjeto();
    this.loaderModalDetalle = true;
    let tipoVistaValido: boolean = this.gridConfiguracionSecuenciaVideoDetalle.data.find(x => x.idTipoVista == 0);
    if(!tipoVistaValido) {
      this._integraService
        .putJsonResponse(
          `${constApiPlanificacion.ConfigurarVideoProgramaActualizar}`,
          dataEnviada
        )
        .subscribe({
          next: (response: HttpResponse<boolean>) => {
            if(response.body) {
              Swal.fire(
                '¡Regularizado!',
                'El registro ha sido regularizado correctamente.',
                'success'
              );
              this.loaderModalDetalle = false;
            }
          },
          error: (err) => {
            this._alertaService.notificationWarning(
              `Surgio un error al querer guardar los datos`
            );
            this.loaderModalDetalle = false;
          },
        });
      } else {
        this._alertaService.notificationWarning(
          `Completar los Tipo de vista faltantes`
        );
      }
  }
  descargarConfiguracionSecuenciaVideoDetallePlantilla(tipoConfiguracion: number): void {
    this.loaderModal = true;
    let idPgeneral = this.configuracionVideoPrincipal.idPgeneral;
    let endpoint =
    (tipoConfiguracion == 1) ? constApiPlanificacion.ConfigurarVideoProgramaDescargarPlantillaExcel : constApiPlanificacion.ConfigurarVideoProgramaDescargarPlantillaExcelConfigurarSecuenciaVideo;
    this._integraService.getExcelResponse(`${endpoint}/${idPgeneral}`)
      .subscribe({
        next: (res: HttpResponse<any>) => {
          window.location.href = `${this.urlBase}${endpoint}/${idPgeneral}`
          this._alertaService.notificationSuccess(`Se ha descargado la plantilla correctamente`);
          this.loaderModal = false;
        },
        error: (err) => {
          this.loaderModal = false;
          this._alertaService.notificationWarning(`Ha ocurrido un error en la descarga de plantilla`);
        }
      });
  }
  seleccionarAlmacenarArchivo(dataFilte:any): void {
    this.archivoImportado.setValue(dataFilte)
  }
  deseleccionarAlmacenarArchivo(): void {
    this.archivoImportado.setValue(null);
  }
  importarConfiguracionSecuenciaVideoDetallePlantilla(): void {
    this.loaderModalImportacion = true;
    let dataEnviada: FormData = new FormData();
    let endpoint = (this.flagImportar == 1)
      ? `${constApiPlanificacion.ConfigurarVideoProgramaImportarExcelConfigurarSecuenciaVideo}`
      : `${constApiPlanificacion.ConfigurarVideoProgramaImportarExcel}`;
    let archivo = this.archivoImportado.value.files[0].rawFile;
    dataEnviada.append("ArchivoExcel", archivo)
    this._integraService
      .postFormDataResponse(`${endpoint}`, dataEnviada)
      .subscribe({
        next: (response: any) => {
          this._alertaService.notificationSuccess(
            `Se subio exitosamente el archivo`
          );
          if(this.flagImportar != 1) {
            response.cantidadCorrecto = response.cantidadCorrecta;
            response.cantidadIncorrecto = response.cantidadIncorrecta;
          }
          this.grupoCantidadFilas = response;
          this.mostrarResultadoImportacion = true;
          this.loaderModalImportacion = false;
          this.obtenerDetalleConfigurarVideo(this.dataRowConfiguracionVideo);
        },
        error: (err) => {
          this.loaderModalImportacion = false;
          this._alertaService.notificationWarning(
            `No se ha subido un archivo de Excel`
          );
        },
      });
  }
  eliminarConfiguracionSecuenciaVideo(): void {
    Swal.fire({
      icon: 'question',
      title: 'Confirmar eliminación?',
      text: `¿Desea eliminar la configuración del video o de todo el programa?`,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Del Video',
      confirmButtonColor: '#189',
      denyButtonText: `Del Programa`,
      denyButtonColor: '#189',
      cancelButtonText: `Cancelar`,
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        let videoId = this.formConfiguracionVideo.get('videoId').value;
        this._integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.ConfigurarVideoProgramaEliminarSesionConfigurarVideo}/${videoId}`
          ).subscribe({
            next: (response: HttpResponse<any>) => {
              Swal.fire('Eliminado!', 'Se ha Eliminado correctamente', 'success');
              this.obtenerDetalleConfigurarVideo(this.dataRowConfiguracionVideo);
            },
            error: (err) => {
              Swal.fire('Surgio un error', 'Ha ocurrido un error en la eliminacion', 'error');
            },
          });
      } else if (result.isDenied) {
        let idPGeneral = this.configuracionVideoPrincipal.idPgeneral;
        this._integraService
        .deleteJsonResponse(`${constApiPlanificacion.ConfigurarVideoProgramaEliminarConfiguracionPrograma}/${idPGeneral}`)
          .subscribe({
            next: (response: HttpResponse<any>) => {
              Swal.fire('Eliminado!', 'Se ha Eliminado correctamente', 'success');
              this.obtenerDetalleConfigurarVideo(this.dataRowConfiguracionVideo);
            },
            error: (err) => {
              Swal.fire('Surgio un error', 'Ha ocurrido un error en la eliminacion', 'error');
            },
          });
      }
    });
  }
  insertarActualizarConfiguracionSecuenciaPreguntaDetalle(): void {
    this.loaderModalDetalle = true;
    let dataEnviada = this.gridConfiguracionSecuenciaPreguntaDetalle.data.map((x) => {
      return {
        idPgeneral: x.idPgeneral,
        idTipoVista: x.idTipoVista,
        segundos: x.segundos,
        grupoPregunta: x.grupoPregunta
      }
    });
    this._integraService
      .putJsonResponse(
        constApiPlanificacion.MaestroPreguntaProgramaCapacitacionActualizarRespuestaPorSecuenciaVideo,
        dataEnviada
      )
      .subscribe({
        next: (response: HttpResponse<SecuenciaPregunta[]>) => {
          Swal.fire('¡Regularizado!','El registro ha sido regularizado correctamente.','success');
          this.gridConfiguracionSecuenciaPreguntaDetalleRegistro.data = [];
          this.mostrarConfiguracionRespuesta = false;
          this.loaderModalDetalle = false;
        },
        error: (err) => {
          this._alertaService.notificationWarning(`Surgio un error al querer guardar los datos`);
        },
      });
  }
  agregarFilaConfiguracionSecuenciaVideoDetalle(): void {
    this.gridConfiguracionSecuenciaVideoDetalle.data.unshift({
      idConfigurarVideoPrograma: 0,
      conLogoDiapositiva: false,
      conLogoVideo: false,
      nroDiapositiva: 0,
      idEvaluacion: 0,
      idTipoVista: 0,
      minuto: 0,
      id: 0,
    });
    this.gridConfiguracionSecuenciaVideoDetalle.loadData();
  }
  eliminarFilaConfiguracionSecuenciaVideoDetalle(dataSource: any): void {
    let indice = this.gridConfiguracionSecuenciaVideoDetalle.data.indexOf(dataSource);
    let filaLimpia = dataSource.nroDiapositiva != 0 || dataSource.idTipoVista != '' ? false : true;
    if (!filaLimpia) {
      Swal.fire({
        title: '¿Está seguro de quitar este registro?',
        text: '¡Se perdera la informacion!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.gridConfiguracionSecuenciaVideoDetalle.data.splice(indice, 1);
          Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
          this.gridConfiguracionSecuenciaVideoDetalle.loadData();
        }
      });
    } else {
      this.gridConfiguracionSecuenciaVideoDetalle.data.splice(indice, 1);
      if(this.gridConfiguracionSecuenciaVideoDetalle.data.length == 0) {
        this.gridConfiguracionSecuenciaVideoDetalle.data = [];
      }
      this.gridConfiguracionSecuenciaVideoDetalle.loadData();
    }
  }
  formatearObjeto(): any {
    let dataEnviada = this.formConfiguracionVideo.getRawValue();
    dataEnviada.imagenDiapositivaAncho = String(dataEnviada.imagenDiapositivaAncho);
    dataEnviada.imagenDiapositivaAlto = String(dataEnviada.imagenDiapositivaAlto);
    dataEnviada.imagenVideoAncho = String(dataEnviada.imagenVideoAncho);
    dataEnviada.imagenVideoAlto = String(dataEnviada.imagenVideoAlto);
    dataEnviada.nroDiapositivas = String(dataEnviada.nroDiapositivas);
    dataEnviada.totalMinutos = String(dataEnviada.totalMinutos);
    dataEnviada.sesionConfigurarVideos = this.gridConfiguracionSecuenciaVideoDetalle.data;
    return dataEnviada;
  }
  cargarConfiguracionGridSecuenciaPregunta(): void {
    this.gridConfiguracionSecuenciaPreguntaDetalle
      .getCellCloseEvent$()
      .subscribe({
        next: (rpta) => {
          let form = rpta.formGroup.getRawValue();
          if (form.tipoMarcador != null) {
            rpta.dataItem.idTipoVista = rpta.formGroupValue.tipoMarcador;
            rpta.dataItem.nombreMarcador = this.listaTipoMarcador.find(
              (x) => x.id == rpta.formGroupValue.tipoMarcador
            ).nombre;
          }
          if (form.valorMarcador != null)
            rpta.dataItem.segundos = rpta.formGroupValue.valorMarcador;
        },
      });
    this.gridConfiguracionSecuenciaPreguntaDetalle
      .getCellClickEvent$()
      .subscribe({
        next: (res) => {
          this.gridConfiguracionSecuenciaPreguntaDetalle.formGroup.setValue({
            tipoMarcador: res.dataItem.idTipoVista,
            valorMarcador: res.dataItem.segundos,
          });
        },
      });

    this.gridConfiguracionSecuenciaPreguntaDetalle.formGroup =
      this._formBuilder.group({
        tipoMarcador: [0],
        valorMarcador: [0],
      });
  }
  cargarConfiguracionGridSecuensiaVideo(): void {
    this.gridConfiguracionSecuenciaVideoDetalle.getCellCloseEvent$().subscribe({
      next: (rpta) => {
        let form = rpta.formGroup.getRawValue();
        if (form.segundo != null)
          rpta.dataItem.minuto = rpta.formGroupValue.segundo;
        if (form.nroDiapositiva != null)
          rpta.dataItem.nroDiapositiva = rpta.formGroupValue.nroDiapositiva;
        if (form.tipoVista != null && form.tipoVista != 0) {
          rpta.dataItem.idTipoVista = rpta.formGroupValue.tipoVista;
        }
        if (form.logoVideo != null)
          rpta.dataItem.conLogoVideo = rpta.formGroupValue.logoVideo;
        if (form.logoDiapositiva != null)
          rpta.dataItem.conLogoDiapositiva =
            rpta.formGroupValue.logoDiapositiva;
      },
    });
    this.gridConfiguracionSecuenciaVideoDetalle.getCellClickEvent$().subscribe({
      next: (res) => {
        this.gridConfiguracionSecuenciaVideoDetalle.formGroup.setValue({
          segundo: Number(res.dataItem.minuto),
          tipoVista: res.dataItem.idTipoVista,
          nroDiapositiva: Number(res.dataItem.nroDiapositiva),
          logoVideo: res.dataItem.conLogoVideo,
          logoDiapositiva: res.dataItem.conLogoDiapositiva,
        });
      },
    });

    this.gridConfiguracionSecuenciaVideoDetalle.formGroup =
      this._formBuilder.group({
        segundo: [0],
        tipoVista: [0],
        nroDiapositiva: [0],
        logoVideo: [false],
        logoDiapositiva: [false],
      });
  }
  abrirModalImportarConfiguracionVideo(flagImportar: number): void {
    this.flagImportar = flagImportar;
    this.modalRefImportar = this._modalService.open(this.modalConfiguracionVideoImportar, {
      size: 'md',
      backdrop: 'static',
    });
  }
  obtenerNombreTipoVista(idTipoVista: number): string { return this.listaTipoVista.find(({id}) => id == idTipoVista).nombre }
  limpiarModalImportacion(): void {
    this.modalRefImportar.close();
    this.archivoImportado.setValue(null);
    this.grupoCantidadFilas = {
      cantidadIncorrecto: 0,
      cantidadCorrecto: 0
    }
    this.mostrarResultadoImportacion = false;
  }
}
