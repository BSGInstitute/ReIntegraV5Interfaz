import { FormControl } from '@angular/forms';
import { FormService } from '@shared/services/form.service';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiComercial } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileInfo } from '@progress/kendo-angular-upload';
import { UserService } from '@shared/services/user.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { FichaAlumnoAgendaComponent } from '@shared/components/ficha-alumno-agenda/ficha-alumno-agenda.component';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import {
  DropDownFilterSettings,
  VirtualizationSettings,
} from '@progress/kendo-angular-dropdowns';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import {
  CombosReporte,
  DatosNuevaLlamada,
  DetalleReporte,
  FiltroEnvio,
  FormFiltro,
  IReporteSeguimiento3cx,
  LlamadasIntegra3cx,
  LogReporte,
  OportunidadCodigoMatricula,
} from '@comercial/models/interfaces/iseguimiento-oportunidad-3cx';
import { KendoGrid } from '@shared/models/kendo-grid';
import {
  datePipeTransform,
  getFechaFin,
  getFechaInicio,
} from '@shared/functions/date-pipe';
import {
  DetailExpandEvent,
  GridComponent,
  PageChangeEvent,
  RowClassArgs,
} from '@progress/kendo-angular-grid';
import { IDocumentoPerOportunidad } from '@comercial/models/interfaces/iagenda-alumno';
import { ComboPersonalAsignado } from '@shared/models/interfaces/ipersonal';

@Component({
  selector: 'app-seguimiento-oportunidades-tres-cx',
  templateUrl: './seguimiento-oportunidades-tres-cx.component.html',
  styleUrls: ['./seguimiento-oportunidades-tres-cx.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SeguimientoOportunidadesTresCxComponent implements OnInit {
  @ViewChild('gridsotc') gridsotc: GridComponent;
  constructor(
    private integraService: IntegraService,
    private integraReplicaService: IntegraReplicaService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formService: FormService,
    private userService: UserService
  ) {
    this.allData = this.allData.bind(this);
  }
  virtual: VirtualizationSettings = {
    itemHeight: 28,
  };
  gridSeguimientoOportunidades: KendoGrid = new KendoGrid();
  origenLlamada: string = '';
  formFiltro: FormGroup = this.formBuilder.group({
    asesores: [[]],
    estadoPersonal: [null],
    centroCostos: [[]],
    faseOportunidad: [[]],
    faseOportunidadOrigen: [[]],
    faseOportunidadDestino: [[]],
    fechaInicio: [getFechaInicio()],
    fechaFin: [getFechaFin()],
    opcionFase: ['1'],
  });
  modalRef: NgbModalRef;
  dataEditTemp: IReporteSeguimiento3cx = null;
  formAgregarLlamada: FormGroup = this.formBuilder.group({
    fechaLlamada: [null, Validators.required],
    archivo: [null, Validators.required],
    telefonoDestino: [''],
    nombreArchivo: [''],
    duracionContesto: [''],
    duracionTimbrado: [''],
    nroBytes: [0],
    idActividadDetalle: 0,
    idOportunidad: 0,
    idPersonalAsignado: 0,
    anexo3cx: '',
  });
  counter: string;
  public changeNombreArchivo(event: string): void {
    const contador = event.length;
    this.counter = `${contador}/60`;
  }
  get fechaActual(): Date {
    return new Date();
  }
  private userName: string;
  dataAsesores: ComboPersonalAsignado[] = [];
  dataAsesoresFiltro: ComboPersonalAsignado[] = [];
  dataCentroCosto: IComboBase1[] = [];
  dataCentroCostoFiltro: IComboBase1[] = [];
  dataFaseOportunidad: { id: number; codigo: string; nombre: string }[] = [];
  datacriterios: IComboBase1[];
  dataSourceCriterios: IComboBase1[];
  dataSourceObservaciones: IComboBase1[];
  urlGrabacion: string = '';
  estadoAsesores = [
    { id: true, nombre: 'Activos' },
    { id: false, nombre: 'Inactivos' },
  ];
  nameArchivo: string = '';
  dataAudio: any = '';
  itemLlamadaGlobal: any = 0;
  pesoLlamadaGlobal: any = 0;
  tiempoLlamadaGlobal: any = 0;
  buttonDisable: boolean = true;
  modalVerificar: any = true;
  datoVerificarISTemp: IReporteSeguimiento3cx;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  validationAudio = {
    allowedExtensions: ['WAV', 'MP3'],
    maxFileSize: 20048000,
  };
  documentoIdentidad = {
    url: '',
    comentario: '',
  };
  convenioCapacitacion = {
    url: '',
    comentario: '',
  };
  loaderModal: boolean = false;

  public myFiles: Array<FileInfo> = [];
  public myForm: FormGroup;
  idPersonal: number;
  ngOnInit(): void {
    this.obtenerCombos();
    this.userName = this.userService.userName;
    this.idPersonal = this.userService.idPersonal;
  }
  getErrorMessage(controlName: string): string {
    this.formService.erroMsj = {
      nombreArchivo: {
        required: 'Ingrese un nombre al archivo',
        maxLength: 'El nombre del archivo debe ser menos de 60',
      },
      archivo: {
        required: 'Seleccion un archivo',
      },
    };
    return this.formService.errorMessage(
      this.formAgregarLlamada.get(controlName) as FormControl,
      controlName
    );
  }
  allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: this.gridSeguimientoOportunidades.data,
    };
    return result;
  }
  onExpandHandler(event: DetailExpandEvent) {
    if (event.dataItem.grid.data.length == 0) {
      this.cargarLogs(event.dataItem);
    }
  }
  textoZonaHoraria: string = null;
  cargarLogs(dataItem: IReporteSeguimiento3cx) {
    dataItem.grid.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiComercial.PersonalObtenerPaisSedPersonal}/${dataItem.idPersonalAsignado}`
      )
      .subscribe({
        next: (resp: HttpResponse<{ idPaisSede: number }>) => {
          dataItem.textoZonaHoraria = null;
          if (resp.body.idPaisSede == 52) {
            dataItem.textoZonaHoraria = `* Hora de Reprogramacion y Llamadas ajustado a hora de "Mexico" (UTC-6)`;
          }
          if (resp.body.idPaisSede == 51) {
            dataItem.textoZonaHoraria = `* Hora de Reprogramacion y Llamadas ajustado a hora de "Perú" (UTC-5)`;
          }
          if (resp.body.idPaisSede == 56) {
            dataItem.textoZonaHoraria = `* Hora de Reprogramacion y Llamadas ajustado a hora de "Chile" (UTC-3 en verano y UTC-4 en invierno)`;
          }
          if (resp.body.idPaisSede == 57) {
            dataItem.textoZonaHoraria = `* Hora de Reprogramacion y Llamadas ajustado a hora de "Colombia" (UTC-5)`;
          }
        },
      });
    this.integraService
      .getJsonResponse(
        `${constApiComercial.ReporteSeguimientoOportunidadesTresCxObtenerListaOportunidadLog}/${dataItem.id}`
      )
      .subscribe({
        next: (resp: HttpResponse<DetalleReporte>) => {
          resp.body.log.forEach((e) => {
            if (e.llamadasIntegra3cx != null) {
              let llamadaAnterior = new Date();
              e.llamadasIntegra3cx.forEach((x) => {
                this.getTiempoPer(x, llamadaAnterior);
                llamadaAnterior = new Date(x.fechaFinLlamada);
              });
            }
          });
          dataItem.grid.data = resp.body.log;
          dataItem.grid.loading = false;
        },
        error: (error) => {
          dataItem.grid.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  generarReporte() {
    let datosFormFiltro = this.formFiltro.getRawValue() as FormFiltro;
    
    const idPersonal = this.userService.userData.idPersonal;
    let asesores: number[] = [];
    let filtroPersonal = [
      213,5276,5895,6007,5878,5895,201,6044,5726,5739,109,4659,6108
    ];

    if (datosFormFiltro.asesores.length == 0) {
      if (!filtroPersonal.includes(idPersonal))
        asesores = this.dataAsesoresFiltro.map((x) => x.id);
    } else {
      asesores = datosFormFiltro.asesores;
    }
    
    let pagina: PageChangeEvent = {
      skip: 0,
      take: this.gridsotc.pageSize,
    };
    this.gridsotc.pageChange.emit(pagina);
    const filtro: FiltroEnvio = {
      centroCostos: datosFormFiltro.centroCostos,
      asesores: asesores,
      fasesOportunidad: datosFormFiltro.faseOportunidad,
      fechaInicio:
        datePipeTransform(datosFormFiltro.fechaInicio, 'yyyy-MM-dd') +
        'T00:00:00.000',
      fechaFin:
        datePipeTransform(datosFormFiltro.fechaFin, 'yyyy-MM-dd') +
        'T00:00:00.000',
      opcionFase: Number(datosFormFiltro.opcionFase),
      faseOportunidadOrigen: datosFormFiltro.faseOportunidadOrigen,
      faseOportunidadDestino: datosFormFiltro.faseOportunidadDestino,
    };
    if (new Date(filtro.fechaFin) < new Date(filtro.fechaInicio)) {
      this.alertaService.swalFireOptions({
        icon: 'warning',
        text: 'Rango de fechas no valido',
      });
      return;
    }
    this.gridSeguimientoOportunidades.loading = true;
    this.buttonDisable = true;
    this.integraReplicaService
      .postJsonResponse(
        constApiComercial.ReporteSeguimientoOportunidadesTresCxGenerarReporte,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<IReporteSeguimiento3cx[]>) => {
          // this.regularizarCronogramaVersionFinal();
          resp.body.forEach((element) => {
            element.grid = new KendoGrid();
          });
          this.gridSeguimientoOportunidades.data = resp.body;
          this.gridSeguimientoOportunidades.loading = false;
          this.buttonDisable = false;
        },
        error: (error) => {
          this.buttonDisable = false;
          this.gridSeguimientoOportunidades.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  regularizarCronogramaVersionFinal() {
    this.integraService
      .getJsonResponse(
        constApiComercial.ReporteSeguimientoOportunidadesActualizarCronogramaVersionFinal
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {},
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerCombos() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.ReporteSeguimientoOportunidadesObtenerCombosReporte}`
      )
      .subscribe({
        next: (resp: HttpResponse<CombosReporte>) => {
          this.dataAsesores = resp.body.asesores;
          this.dataAsesoresFiltro = resp.body.asesores;
          this.dataCentroCosto = resp.body.centroCostos;
          this.dataFaseOportunidad = resp.body.faseOportunidades;
          this.dataSourceCriterios = resp.body.criteriosCalificacion;
          this.datacriterios = resp.body.criteriosCalificacion;
          this.dataSourceObservaciones = resp.body.observacionMatricula;
          this.buttonDisable = false;
        },
      });
  }
  filterEstadosAsesores(value: boolean) {
    if (value == null) {
      this.dataAsesoresFiltro = this.dataAsesores.slice();
    } else {
      this.dataAsesoresFiltro = this.dataAsesores.filter(
        (x) => x.activo == value
      );
      let datosFormFiltro = this.formFiltro.getRawValue() as FormFiltro;
      let filtro= datosFormFiltro.asesores.filter((x)=>
        this.dataAsesoresFiltro.map((x)=>x.id).includes(x)
      );
      this.formFiltro.get('asesores').setValue(filtro);
    }
  }
  getMontoTotal(data: IReporteSeguimiento3cx) {
    if (data.matricula == null) {
      return data.montoTotal.toString() + '(0)';
    } else {
      return data.montoTotal.toString() + `(${Math.round(data.matricula)})`;
    }
  }
  getPrecioLista(data: IReporteSeguimiento3cx) {
    if (data.matricula == null) {
      return data.precioLista.toString() + '(0)';
    } else {
      return data.precioLista.toString();
    }
  }
  getPerDescuento(data: IReporteSeguimiento3cx) {
    if (data.precioLista != 0 && data.precioLista != null) {
      let resultado =
        (1 - data.montoTotalDolares / data.precioListaDolares) * 100;
      return resultado.toFixed(0) + '%';
    } else {
      return '-';
    }
  }
  getMontoTotalDolares(dataItem: IReporteSeguimiento3cx) {
    let montoTotalDolares = dataItem.montoTotalDolares ?? 0;
    if (dataItem.matriculaDolares == null) {
      return montoTotalDolares.toString() + '(0)';
    } else {
      return (
        montoTotalDolares.toString() +
        '(' +
        Math.round(dataItem.matriculaDolares) +
        ')'
      );
    }
  }
  getMinutosTotalFaseActual(data: IReporteSeguimiento3cx) {
    if (data.minutosHabladosTotal == null) {
      return '0(0)';
    } else {
      return (
        data.minutosHabladosTotal.toString() +
        '(' +
        data.minutosHabladosFaseActual.toString() +
        ')'
      );
    }
  }
  getMontoPagado(e: IReporteSeguimiento3cx) {
    if (e.montoPagado == null || e.montoPagado == 0) {
      return 'Ninguno';
    } else {
      return (
        e.montoPagado.toString() +
        '(' +
        Math.round((e.montoPagado * 100) / e.montoTotal) +
        '%)'
      );
    }
  }
  getDescuento(e: IReporteSeguimiento3cx) {
    if (e.descuento == null || Number(e.descuento) == 0) {
      return 'Ninguno';
    } else {
      return e.descuento.toString();
    }
  }
  descargarConvenio(dataItem: IReporteSeguimiento3cx, context: any) {
    this.convenioCapacitacion.comentario = '';
    this.convenioCapacitacion.url = '';
    this.documentoIdentidad.comentario = '';
    this.documentoIdentidad.url = '';
    this.modalService.open(context, {
      size: 'md',
    });

    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerDocumentosPorIdOportunidad}/${dataItem.id}`
      )
      .subscribe({
        next: (resp: HttpResponse<IDocumentoPerOportunidad[]>) => {
          if (resp.body != null && resp.body.length > 0) {
            resp.body.forEach((e) => {
              if (e.tipo == 1) {
                this.convenioCapacitacion.comentario = e.comentario;
                this.convenioCapacitacion.url = e.url;
              }
              if (e.tipo == 2) {
                this.documentoIdentidad.comentario = e.comentario;
                this.documentoIdentidad.url = e.url;
              }
            });
          }
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  getConvenioRegistro(e: IReporteSeguimiento3cx) {
    if (e.personaEncargada == null || e.personaEncargada == '') {
      return 'Ninguno';
    } else {
      return e.personaEncargada;
    }
  }
  private getTiempoPer(item: LlamadasIntegra3cx, fechaAnterior: Date) {
    let fechaInicio = new Date(item.fechaInicioLlamada);
    let resultado = (
      (fechaInicio.valueOf() - fechaAnterior.valueOf()) /
      1000 /
      60
    ).toFixed(1);

    let bgcolor = '';
    let color = 'black';
    if (Number(resultado) < 2) {
      bgcolor = 'blue';
      color = 'white';
    } else if (Number(resultado) >= 2 && Number(resultado) < 3) {
      bgcolor = 'skyblue';
    } else if (Number(resultado) >= 3 && Number(resultado) < 5) {
      bgcolor = 'yellow';
    } else if (Number(resultado) >= 5 && Number(resultado) <= 8) {
      bgcolor = 'orange';
    } else if (Number(resultado) > 8) {
      bgcolor = 'red';
      color = 'white';
    }
    item.bgColor = bgcolor;
    item.color = color;
    item.resTiempo = resultado;
  }
  getHoraLlamada(fechaLlamada: string) {
    if (fechaLlamada) {
      const fecha = new Date(fechaLlamada);
      let hora = fecha.getHours().toString();
      let minutos = fecha.getMinutes().toString();
      if (fecha.getHours() < 10) hora = `0${fecha.getHours()}`;
      if (fecha.getMinutes() < 10) minutos = `0${fecha.getMinutes()}`;
      return `${hora}:${minutos}`;
    }
    return '';
  }
  reproducirAudio(context: any, element: LlamadasIntegra3cx) {
    console.log('reproducirAudio', element);
    this.origenLlamada = element.origenLlamada;
    if (element.nombreGrabacion) {
      let flagModal: boolean = false;
      switch (element.webphone) {
        case 'Mizutech':
          break;
        case 'Silcom':
          flagModal = true;
          this.urlGrabacion =element.nombreGrabacion;
          break;
        case 'Silcom Migrado':
          flagModal = true;
          this.urlGrabacion = element.nombreGrabacion;
          break;
        case 'TresCx Migrado':
          flagModal = true;
          this.urlGrabacion = element.nombreGrabacion;
          break;
        case 'TresCx':
          this.alertaService.swalFireOptions({
            icon: 'info',
            text: 'Audio 3cx aun no disponible',
          });
          break;
        case 'TresCx Sin Grabacion':
          this.alertaService.swalFireOptions({
            icon: 'info',
            text: 'No contiene grabacion',
          });
          break;
        case 'Ringover Migrado':
          flagModal = true;
          this.urlGrabacion = element.nombreGrabacion;
          break;
        case 'Wavix Migrado':
            flagModal = true;
            this.urlGrabacion = element.nombreGrabacion;
            break;
        case 'Wolkbox':
          this.alertaService.swalFireOptions({
            icon: 'info',
            text: 'Audio aun no disponible',
          });
          break;
        case 'Wolkbox Migrado':
          this.urlGrabacion = element.nombreGrabacion;
          flagModal = true;
          break;
        case 'Wolkbox Sin Grabacion':
          this.alertaService.swalFireOptions({
            icon: 'info',
            text: 'No contiene grabación',
          });
          break;
      }
      if (flagModal) {
        this.modalService.open(context, { size: 'md', backdrop: 'static' });
      }
    } else {
      this.alertaService.swalFireOptions({
        icon: 'info',
        text: 'No contiene grabacion',
      });
    }
  }
  reproducirConvenioDeVoz(context: any, dataItem: IReporteSeguimiento3cx) {
    this.origenLlamada = '';
    // if (dataItem.grabacionCentral != null) {
    //   if (dataItem.webphone != null && dataItem.webphone.includes('TresCx')) {
    //     this.origenLlamada = true;
    //   }
    //   this.urlGrabacion = dataItem.grabacionCentral;
    //   this.modalService.open(content, { size: 'md', backdrop: 'static' });
    // } else {
    // }
    if (dataItem.grabacionCentral) {
      let flagModal: boolean = false;
      switch (dataItem.webphone) {
        case 'Mizutech':
          break;
        case 'Silcom':
          flagModal = true;
          this.origenLlamada = 'Integra';
          this.urlGrabacion = `https://integrav4-ast-llamadas.bsginstitute.com/play.php?nombreArchivo=${dataItem.grabacionCentral}`;
          // this.reproducirLlamadaNuevoWebPhone(element.nombreGrabacion);
          break;
        case 'Silcom Migrado':
          flagModal = true;
          this.origenLlamada = 'Integra';
          this.urlGrabacion = dataItem.grabacionCentral;
          break;
        case 'TresCx Migrado':
          flagModal = true;
          this.origenLlamada = '3cx';
          this.urlGrabacion = dataItem.grabacionCentral;
          break;
        case 'TresCx':
          this.origenLlamada = '3cx';
          this.alertaService.swalFireOptions({
            icon: 'info',
            text: 'Audio 3cx aun no disponible',
          });
          break;
        case 'TresCx Sin Grabacion':
          this.origenLlamada = '3cx';
          this.alertaService.swalFireOptions({
            icon: 'info',
            text: 'No contiene grabacion',
          });
          break;
        case 'Ringover Migrado':
          this.urlGrabacion = dataItem.grabacionCentral;
          this.origenLlamada = 'Ringover';
          flagModal = true;
          break;
        case 'Ringover':
          flagModal = false;
          this.origenLlamada = 'Ringover';
          this.alertaService.swalFireOptions({
            icon: 'info',
            text: 'Audio Ringover aun no disponible',
          });
          break;
        case 'Ringover - Sin Grabacion':
          flagModal = false;
          this.origenLlamada = 'Ringover';
          this.alertaService.swalFireOptions({
            icon: 'info',
            text: 'No contiene grabacion',
          });
          break;
        case 'Wavix Migrado':
            this.urlGrabacion = dataItem.grabacionCentral;
            this.origenLlamada = 'Wavix';
            flagModal = true;
            break;
        case 'Wavix':
            flagModal = false;
            this.origenLlamada = 'Wavix';
            this.alertaService.swalFireOptions({
              icon: 'info',
              text: 'Audio Wavix aun no disponible',
            });
            break;
        case 'Wavix - Sin Grabacion':
            flagModal = false;
            this.origenLlamada = 'Wavix';
            this.alertaService.swalFireOptions({
              icon: 'info',
              text: 'No contiene grabacion',
            });
            break;
      }
      if (flagModal) {
        this.modalService.open(context, { size: 'md', backdrop: 'static' });
      }
    }
  }
  // reproducirLlamadaNuevoWebPhone(UrlGrabacionTresCx: string) {
  //   this.urlGrabacion = `https://integrav4-ast-llamadas.bsginstitute.com/play.php?nombreArchivo=${UrlGrabacionTresCx}`;
  // }
  abrirModalAdjuntarAudio(context: any, item: any) {
    this.nameArchivo = '';
    this.dataAudio = '';
    this.itemLlamadaGlobal = item;
    this.modalService.open(context, { size: 'md', backdrop: 'static' });
  }
  adjuntarNuevoAudioLlamada(
    context: any,
    dataItem: LogReporte,
    dataItem2: IReporteSeguimiento3cx
  ) {
    this.isDisabledBtnAgregar = false;
    this.dataEditTemp = dataItem2;
    this.formAgregarLlamada.reset();
    this.formAgregarLlamada.get('idOportunidad').setValue(dataItem2.id);
    if (dataItem.fechaModificacion != null) {
      this.formAgregarLlamada
        .get('fechaLlamada')
        .setValue(new Date(dataItem.fechaModificacion));
    } else {
      this.formAgregarLlamada.get('fechaLlamada').setValue(new Date());
    }
    this.formAgregarLlamada
      .get('idActividadDetalle')
      .setValue(dataItem.idActividadDetalle);
    this.formAgregarLlamada
      .get('idPersonalAsignado')
      .setValue(dataItem2.idPersonalAsignado);

    dataItem2.grid.loading = true;
    const idAlumno = dataItem2.idAlumno;
    const idPersonalAsignado = dataItem2.idPersonalAsignado;
    this.integraService
      .getJsonResponse(
        `${constApiComercial.ReporteSeguimientoOportunidadesObtenerDatosNuevaLlamada}/${idAlumno}/${idPersonalAsignado}`
      )
      .subscribe({
        next: (resp: HttpResponse<DatosNuevaLlamada>) => {
          console.log(resp.body);
          let celular = this.limpiarCelular(
            resp.body.celular,
            resp.body.idCodigoPais
          );
          let telefonoDestino = this.calcularTelefonoDestino(
            resp.body.idCodigoPais,
            resp.body.central,
            celular
          );
          this.formAgregarLlamada
            .get('telefonoDestino')
            .setValue(telefonoDestino);
          this.formAgregarLlamada.get('anexo3cx').setValue(resp.body.anexo3CX);
          this.counter = '0/60';
          dataItem2.grid.loading = false;
          this.modalRef = this.modalService.open(context, {
            size: 'md',
            backdrop: 'static',
          });
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
          dataItem2.grid.loading = false;
        },
      });
  }
  insertarArchivo(modal: any) {
    let data = new FormData();
    if (this.dataAudio != '') {
      var archivoPrincipal = this.dataAudio.files[0].rawFile;
      data.append('File', archivoPrincipal);
      data.append('IdLlamada', this.itemLlamadaGlobal.id);
      data.append('NombreArchivo', this.nameArchivo);
      data.append('DuracionContesto', this.tiempoLlamadaGlobal);
      data.append('NroBytes', this.pesoLlamadaGlobal);

      this.integraService
        .insertarFormDataAudio(
          constApiComercial.ReporteSeguimientoOportunidadesModificarLlamadaWebphone,
          data
        )
        .subscribe({
          next: (response: any) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Se subio exitosamente el archivo',
              showConfirmButton: false,
              timer: 1500,
            });

            this.itemLlamadaGlobal.UrlGrabacionTresCx = response;
            this.itemLlamadaGlobal.webphone = 'Silcom Migrado';
            this.itemLlamadaGlobal.tiempoDuracionMinutosTresCx =
              '<span class="colorPersonalizado3">TT: 0.0 m</span> &nbsp&nbsp&nbsp  <span class="colorPersonalizado4">TC: ' +
              (this.tiempoLlamadaGlobal / 60).toFixed(1) +
              ' m </span>';
            this.modalService.dismissAll(modal);
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'Error al subir el archivo',
              text: mensaje,
            });
            this.modalService.dismissAll(modal);
          },
        });
      for (var pair of data.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Selecciona un audio',
      });
    }
  }
  isDisabledBtnAgregar: boolean = false;
  insertarNuevaLlamadaActividad() {
    let formData = new FormData();
    let datosFormulario = this.formAgregarLlamada.getRawValue();
    formData.append('IdActividadDetalle', datosFormulario.idActividadDetalle);
    formData.append('IdOportunidad', datosFormulario.idOportunidad);
    formData.append('IdPersonalAsignado', datosFormulario.idPersonalAsignado);
    formData.append('GrabacionContrato', 'false');
    formData.append('Anexo3CX', datosFormulario.anexo3cx);
    formData.append(
      'FechaInicio',
      datePipeTransform(datosFormulario.fechaLlamada)
    );
    formData.append('TelefonoDestino', datosFormulario.telefonoDestino);
    if (datosFormulario.archivo[0].name.length >= 60) {
      alert('El nombre del archivo excede los 60 caracteres');
    }
    if (datosFormulario.archivo != null) {
      formData.append('File', datosFormulario.archivo[0]);
    }
    formData.append('IdLlamada', '0');
    formData.append('NombreArchivo', datosFormulario.nombreArchivo);
    formData.append('DuracionContesto', datosFormulario.duracionContesto);
    formData.append('NroBytes', datosFormulario.nroBytes);

    this.isDisabledBtnAgregar = true;
    this.formAgregarLlamada.disable();
    this.integraService
      .insertarFormData2(
        constApiComercial.ReporteSeguimientoOportunidadesGenerarNuevaLlamadaActividad,
        formData
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          console.log(resp.body);
          this.modalRef.close();
          this.cargarLogs(this.dataEditTemp);
          this.formAgregarLlamada.enable();
          this.isDisabledBtnAgregar = false;
        },
        error: (error) => {
          this.isDisabledBtnAgregar = false;
          this.formAgregarLlamada.enable();
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: 'Error al generar nueva llamada',
            text: mensaje,
          });
        },
      });
  }

  cerrarModalAdjuntarAudio(content: any) {
    this.itemLlamadaGlobal = 0;
    this.modalService.dismissAll(content);
  }
  select(e: any) {
    this.dataAudio = e;
    this.nameArchivo = e.files[0].name;
    this.pesoLlamadaGlobal = Math.round(e.files[0].size);
    var extension = e.files[0].extension;
    if (this.nameArchivo) {
      if (extension == '.wav' || extension == '.mp3') {
        this.tiempoLlamadaGlobal = Math.round(
          this.pesoLlamadaGlobal / 17612.32853
        );
      } else {
        this.tiempoLlamadaGlobal = 0;
      }
    } else {
      this.tiempoLlamadaGlobal = 0;
    }
  }
  changeArchivo(event: any) {
    console.log(event);
    console.log(event.target.value);
    let file = this.formAgregarLlamada.get('archivo').value[0] as File;
    console.log(file);
    const nroBytes = Math.round(file.size);
    const extension = file.type;
    this.formAgregarLlamada.get('nombreArchivo').setValue(file.name);
    this.formAgregarLlamada.get('nroBytes').setValue(nroBytes);
    this.changeNombreArchivo(file.name);
    let duracionContesto = 0;
    if (file.name) {
      if (extension.includes('audio/wav') || extension.includes('audio/mp3')) {
        duracionContesto = Math.round(nroBytes / 17612.32853);
      }
    }
    this.formAgregarLlamada.get('duracionContesto').setValue(duracionContesto);
  }
  modalVerificarOpcion(content: any, dataItem: IReporteSeguimiento3cx) {
    if (dataItem.verificado == 'SI') {
      Swal.fire({
        icon: 'info',
        text: 'Ya ha sido verificada esta oportunidad!!!',
      });
    } else if (
      this.userName != 'bamontoya' &&
      this.userName !== 'pbeltran' &&
      this.userName !== 'aportillav1' &&
      this.userName != 'aportillav' &&
      this.userName != 'dpacheco' &&
      this.userName != 'dpacheco2' &&
      this.userName != 'dpachecoc'
    ) {
      Swal.fire({
        icon: 'info',
        text: 'Usted no tiene permisos para esta opcion!!!',
      });
    } else {
      this.datoVerificarISTemp = dataItem;
      this.modalService.open(content, { size: 'sm', backdrop: 'static' });
    }
  }
  verificarIsM() {
    if (
      this.datoVerificarISTemp.idMatriculaCabecera == 0 ||
      this.datoVerificarISTemp.idMatriculaCabecera == null
    ) {
      Swal.fire({
        icon: 'error',
        text: 'No se encontro el Id Matricula',
      });
      return;
    }
    this.loaderModal = true;
    let jsonEnvio: OportunidadCodigoMatricula = {
      idOportunidad: this.datoVerificarISTemp.id,
      idMatriculaCabecera: this.datoVerificarISTemp.idMatriculaCabecera,
      verificado: true,
      usuario: this.userName,
      codigoMatricula: this.datoVerificarISTemp.codigoMatricula,
    };
    this.integraService
      .postJsonResponse(
        constApiComercial.VerificacionOportunidadISMInsertarOportunidadVerificada,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: any) => {
          this.integraService
            .postJsonResponse(
              constApiComercial.BeneficiosAlumnoPEspecificoInsertarBeneficios,
              JSON.stringify(jsonEnvio)
            )
            .subscribe({
              next: (resp2: any) => {
                console.log(resp2.body);
                this.loaderModal = false;
              },
              error: (error) => {
                let mensaje = this.alertaService.getMessageErrorService(error);
                this.loaderModal = false;
                this.alertaService.swalFireOptions({
                  icon: 'error',
                  title: 'Error al insertar beneficios',
                  text: mensaje,
                });
              },
            });
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.loaderModal = false;
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: 'Error al insertar oportunidad verificada',
            text: mensaje,
          });
        },
        complete: () => {
          Swal.fire({
            icon: 'success',
            title: 'Se verifico la oportunidad correctamente!!!',
          });
          this.datoVerificarISTemp.verificado = 'SI';
          this.modalService.dismissAll();
        },
      });
  }
  actualizarCriterioObservacionMatricula(
    id: number,
    dataItem: IReporteSeguimiento3cx,
    caso: 'criterio' | 'observacion'
  ) {
    if (
      this.userName != 'bamontoya' &&
      this.userName !== 'pbeltran' &&
      this.userName != 'aportillav' &&
      this.userName != 'aportillav1' &&
      this.userName != 'dpacheco' &&
      this.userName != 'dpacheco2' &&
      this.userName != 'dpachecoc'
    ) {
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: '¡Usted no tiene permisos para esta opcion!',
      });
      return;
    }
    let valorActual: number;
    let endpoint: string;
    let jsonEnvio: {
      idMatriculaCabecera: number;
      idCriterioCalificacion?: number;
      idMatriculaObservacion?: number;
    } = {
      idMatriculaCabecera: dataItem.idMatriculaCabecera,
    };
    if (caso == 'criterio') {
      valorActual = dataItem.idCriterioCalificacion;
      endpoint =
        constApiComercial.ControlDocAlumnoActualizarCriterioCalificacionMatricula;
      jsonEnvio.idCriterioCalificacion = id;
    } else if (caso == 'observacion') {
      valorActual = dataItem.idMatriculaObservacion;
      endpoint =
        constApiComercial.ControlDocAlumnoActualizarMatriculaObservacionMatricula;
      jsonEnvio.idMatriculaObservacion = id;
    }
    if (id != null) {
      if (id != valorActual) {
        this.integraService.putJsonResponse(endpoint, jsonEnvio).subscribe({
          next: (resp: HttpResponse<boolean>) => {
            if (resp) {
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer);
                  toast.addEventListener('mouseleave', Swal.resumeTimer);
                },
              });

              let mensaje =
                caso == 'criterio'
                  ? 'Se actualizo el criterio correctamente'
                  : 'Se actualizo la observacion correctamente';
              Toast.fire({
                icon: 'success',
                title: mensaje,
              });
            }
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'Error en la solicitud',
              text: mensaje,
            });
          },
        });
      }
    }
  }
  cargarFichaAlumno(dataItem?: any) {
    let modalRef = this.modalService.open(FichaAlumnoAgendaComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.idAlumno = dataItem.idAlumno;
    modalRef.componentInstance.idOportunidad = dataItem.id;
    modalRef.componentInstance.nombreCentroCosto = dataItem.nombreCentroCosto;
  }
  limpiarCelular(numeroCelular: string, idCodigoPais: number) {
    switch (idCodigoPais) {
      case 57:
        if (
          !numeroCelular.startsWith('0057') &&
          !numeroCelular.startsWith('57') &&
          !numeroCelular.startsWith('+57') &&
          !numeroCelular.startsWith('057') &&
          !numeroCelular.startsWith('+057') &&
          !numeroCelular.startsWith('+0057') &&
          numeroCelular != ''
        ) {
          numeroCelular = '0057' + numeroCelular;
        }
        break;
      case 591:
        if (
          !numeroCelular.startsWith('00591') &&
          !numeroCelular.startsWith('591') &&
          !numeroCelular.startsWith('+591') &&
          !numeroCelular.startsWith('0591') &&
          !numeroCelular.startsWith('+0591') &&
          !numeroCelular.startsWith('+00591') &&
          numeroCelular !== ''
        ) {
          numeroCelular = '00591' + numeroCelular;
        }
        break;
      case 52:
        if (
          !numeroCelular.startsWith('0052') &&
          !numeroCelular.startsWith('52') &&
          !numeroCelular.startsWith('+52') &&
          !numeroCelular.startsWith('052') &&
          !numeroCelular.startsWith('+052') &&
          !numeroCelular.startsWith('+0052') &&
          numeroCelular !== ''
        ) {
          numeroCelular = '0052' + numeroCelular;
        }
        break;
      case 51:
        if (numeroCelular.startsWith('0051')) {
          numeroCelular = numeroCelular.substring(4);
        }
        if (numeroCelular.startsWith('51')) {
          numeroCelular = numeroCelular.substring(2);
        }
        if (numeroCelular.startsWith('+51')) {
          numeroCelular = numeroCelular.substring(3);
        }
        if (numeroCelular.startsWith('051')) {
          numeroCelular = numeroCelular.substring(3);
        }
        if (numeroCelular.startsWith('+051')) {
          numeroCelular = numeroCelular.substring(4);
        }
        if (numeroCelular.startsWith('+0051')) {
          numeroCelular = numeroCelular.substring(5);
        }
        break;
      default:
        break;
    }
    if (idCodigoPais == 591 || idCodigoPais == 57 || idCodigoPais == 52) {
      numeroCelular = numeroCelular
        .replace('+', '')
        .replace('-', '')
        .replace('_', '')
        .replace(' ', '')
        .replace('/', '');

      if (numeroCelular.substring(0, 1) == '0') {
        for (let i = 0; i < numeroCelular.length; i++) {
          let caracter = numeroCelular.substring(0, 1);
          if (caracter == '0') {
            numeroCelular = numeroCelular.substring(1);
          } else {
            break;
          }
        }
      }
    }
    return numeroCelular.trim();
  }
  calcularTelefonoDestino(
    idCodigoPais: number,
    centralAsesor: string,
    numeroAlumno: string
  ) {
    const troncalLyricAQP: string = '05';
    const troncalLyricLIMA: string = '06';
    const troncalLyricBOL: string = '07';
    const troncalLyricCOL: string = '08';
    const troncalLyricMEX: string = '09';
    const numeroOpenVox1AQP: string = '01';
    const numeroOpenVox1LIMA: string = '01';
    const numeroOpenVox1BOL: string = '01';
    const numeroOpenVox1COL: string = '01';
    const numeroOpenVox1MEX: string = '01';
    let _troncal;
    let _numero;
    if (idCodigoPais === 51 && centralAsesor === '192.168.0.20') {
      _troncal = troncalLyricAQP;
      _numero = numeroOpenVox1AQP;
    } else if (idCodigoPais === 51 && centralAsesor === '192.168.2.20') {
      _troncal = troncalLyricLIMA;
      _numero = numeroOpenVox1LIMA;
    } else if (idCodigoPais === 591) {
      _troncal = troncalLyricBOL;
      _numero = numeroOpenVox1BOL;
    } else if (idCodigoPais === 57) {
      _troncal = troncalLyricCOL;
      _numero = numeroOpenVox1COL;
    } else if (idCodigoPais === 52) {
      _troncal = troncalLyricMEX;
      _numero = numeroOpenVox1MEX;
    } else {
      _troncal = '01';
      _numero = '01';
    }
    return _troncal + _numero + numeroAlumno;
  }

  rowCallback = (context: RowClassArgs) => {
    let dataItem = context.dataItem as LogReporte;
    if (
      dataItem.llamadasIntegra3cx == null ||
      dataItem.llamadasIntegra3cx.length == 0
    ) {
      if (dataItem.estado == 'NO EJECUTADO') {
        return { sinLlamada: false };
      } else {
        if (dataItem.estadoSeguimientoWhatsApp == true) {
          return { esSeguimientoWhatsapp: true };
        } else if (dataItem.otroMedio == true) {
          return { esOtroMedio: true };
        } else {
          return { sinLlamada: true };
        }
      }
    } else if (dataItem.estadoSeguimientoWhatsApp == true) {
      return { esSeguimientoWhatsapp: true };
    } else if (dataItem.otroMedio == true) {
      return { esOtroMedio: true };
    } else {
      return { sinLlamada: false };
    }
  };
}
