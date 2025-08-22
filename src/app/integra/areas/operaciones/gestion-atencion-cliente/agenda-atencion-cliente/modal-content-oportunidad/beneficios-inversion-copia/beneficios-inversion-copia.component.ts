import { DecimalPipe } from '@angular/common';
import { AgendaInicializarOperacionesService } from '@operaciones/services/agenda/agenda-inicializar-operaciones.service';
import { AgendaService } from '@comercial/services/agenda/agenda.service';
import { AgendaInformacionActividadOportunidadOperacionesService } from '@operaciones/services/agenda/agenda-informacion-actividad-oportunidad-operaciones.service';
import { IntegraService } from '@shared/services/integra.service';
import { IMontoComplemetario } from './../../../../models/interfaces/beneficios-inversion';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { ColorPaletteComponent } from '@progress/kendo-angular-inputs';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignalRService } from '@shared/services/signal-r.service';
import { HubConnectionBuilder } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { MatTableDataSource } from '@angular/material/table';
import html2canvas from 'html2canvas';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiComercial, constApiOperaciones } from '@environments/constApi';
import { IDataEnvioWhatsapp, IMensajesWhatsapp } from '@operaciones/models/interfaces/ihistorial-mensaje-recibido';
import { HttpResponse } from '@angular/common/http';
export interface CorrespondeBeneficiosDTO {
  beneficios: MatriculaCabeceraBeneficioDTO[];
  corresponde: boolean;
}

export interface GridInverionDTO {
  beneficios: string;
  contadoByDolares: number;
  idPGeneral: number;
  inversionContado: string;
  inversionCredito: string;
  nombrePaquete: string;
  pais: number;
  paquete: number;
}
export interface MatriculaCabeceraBeneficioDTO {
  id: number;
  titulo: string;
  estadoMatriculaCabeceraBeneficio: string;
  fechaSolicitud: string | null;
  estadoSolicitudBeneficio: string;
  fechaProgramada: string | null;
  idConfiguracionBeneficioProgramaGeneral: number;
  fechaEntregaBeneficio: string | null;
}
@Component({
  selector: 'app-beneficios-inversion-copia',
  templateUrl: './beneficios-inversion-copia.component.html',
  styleUrls: ['./beneficios-inversion-copia.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class BeneficiosInversionCopiaComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;
  @ViewChild('modalSolicitudCambioVersion') modalSolicitudCambioVersion: any;
  modalRefModalSolicitudCambioVersion: any;
  coordinador: boolean = true;
  loadingPrograma: boolean = true;
  informacionProgramaBeneficio: SafeHtml = '';
  gridMontoComplementariosCargado: KendoGrid = new KendoGrid();
  gridMontoComplementarios: any;
  loading: boolean;
  correspondeBeneficio: boolean = false;
  correspondeBeneficioTemp: boolean;
  descuentos: any;
  activo: boolean = false;
  DescuentoTexto: string = '';
  inputdescuentomontocomplementariosData: any;
  esCoodinador: boolean = true;
  loadingBeneficiosMatActual: boolean;
  loadingBeneficiosSolicitados: boolean;
  loadingBeneficiosVersionMonto: boolean;
  loadingBeneficiosVersionesDisponibles: boolean;
  loadingBeneficiosSimuladorCuotas: boolean;
  isCronogramaConErrores = false;

  precioFinal: string;
  esCoordinadora: boolean = true;
  loadingBeneficiosSolicitud: boolean;
  corresponde: boolean;
  inputdescuentomontocomplementarios: any;
  versionAlumno: any;
  habilitarSolicitud: boolean;
  //montopagoCuotasComplementarios = object() new montopagoCuotasComplementarios
  private rowActual: IRowActual;

  /*------------------------------------------------ */
  /* Variables simulador de Pagos */
  sp_NuevaVersion: null | string = null;
  sp_DiferenciaPagar: null | number = null;
  sp_NumCuotas: null | number = null;
  sp_CodMoneda: string = '';
  sp_loading: boolean = false;
  dataNuevaVersion: any[] = [];
  columnsToDisplayCronogramaNuevo = [
    'tipoCuota',
    'fechaVencimiento',
    'nroCuota',
    'monto',
  ];
  ultimaCuotaCrongrama: any;
  dataCronogramaNuevo: any[] = [];
  dataAsesor: any;
  numeroCelularLimpio:any
  historialMensajeRecibidosChat: IMensajesWhatsapp[] = [];
  /*------------------------------------------------ */

  formularioDroopDownListDescuentos: FormGroup = this.formBuilder.group({
    inputdescuentomontocomplementarios: ['<Seleccione Descuento>'],
  });
  public hubConnection: signalR.HubConnection;
  hub: any;
  personal: any;

  formSolicitud: FormGroup = this.formBuilder.group({
    listaVersion: [null, Validators.required],
    observacion: [null, Validators.required],
  });
  //Nuevo agenda
  gridBeneficiosSolicitados: Array<any>;
  columnsToDisplayBeneficiosSolicitados = [
    'beneficio',
    'programa',
    'centroCosto',
    'fechaSolicitud',
    'fechaProgramada',
    'fechaEntregaBeneficio',
    'coordinador',
    'estadoSolicitud',
    'aprobarSolicitud',
    'restablecerSolicitud',
  ];
  gridBeneficiosMatriculaActual: Array<MatriculaCabeceraBeneficioDTO>;
  columnsToDisplayBeneficiosMatriculaActual = [
    //'id',
    'version',
    'titulo',
    'acciones',
    //'estadoMatriculaCabeceraBeneficio',
    'fechaSolicitud',
    'fechaProgramada',
    'fechaEntregaBeneficio',
    'estadoSolicitudBeneficio',
    //'idConfiguracionBeneficioProgramaGeneral',
  ];
  gridInversion: Array<GridInverionDTO>;
  columnsToDisplayInversion = [
    'nombrePaquete',
    'inversionContado',
    'inversionCredito',
  ];

  gridBeneficios: Array<any>;
  gridMontoActual: Array<any>;
  columnsToDisplayInversionMontoActual = [
    'version',
    'costoOriginal',
    'descuento',
    'porcentajeDescuento',
    'costoFinal',
  ];
  listaVersionesTotal: any;
  listaVersion: any = [];
  constructor(
    private modalService: NgbModal,
    public sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    public SignalRService: SignalRService,
    private _SignalRService: SignalRService,
    public alertaService :AlertaService,
    private integraService: IntegraService,
  ) {}
  Toast = Swal.mixin({
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
  monedaSimboloMap = new Map();

  monedaActual: string;
  monedaActualAcronimo: string;
  decimalPipe: DecimalPipe;

  ngOnInit(): void {
    this.precioFinal = null;
    this.decimalPipe = new DecimalPipe('EN-US');
    this.monedaSimboloMap.set('soles', 'PEN');
    this.monedaSimboloMap.set('bolivianos', 'BOB');
    this.monedaSimboloMap.set('dolares', 'USD');
    this.monedaSimboloMap.set('pesos chilenos', 'CLP');
    this.monedaSimboloMap.set('pesos colombianos', 'COP');
    this.monedaSimboloMap.set('pesos mexicanos', 'MXN');

    this.obtenerNumero()
    this.transferirDatosRedactar()
    this.loadingBeneficiosMatActual = false;
    this.loadingBeneficiosSolicitados = false;
    this.loadingBeneficiosVersionMonto = false;
    this.loadingBeneficiosVersionesDisponibles = false;
    this.loadingBeneficiosSimuladorCuotas = false;

    this.personal = this.agendaService.datosPersonal;
    this.hub = this.SignalRService.connection(
      'hubIntegraHub',
      this.agendaService.idPersonal,
      this.agendaService.userName
    );
    this.rowActual = this.agendaService.rowActual;
    this.ObtenerEsCoordinadora();
    this.encontrarTipoMonedayCronograma();
    // @if (tipoPersonal == "Coordinador" || @Model.DatosPersonal.Id == 213 || @Model.DatosPersonal.Id == 4489 || @Model.DatosPersonal.Id == 10)
    // {

    //this.loading = true;
    ////console.log'init respuestabeneficios');
    this.initSubscribeObservables();
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withAutomaticReconnect()
      .withUrl(
        `https://integrav4-signalrcore.bsginstitute.com/hubIntegraHub` +
          '?idUsuario=' +
          this.agendaService.idPersonal +
          '&&usuarioNombre=' +
          this.agendaService.userName +
          '&&rooms="""'
      )
      .build();

    this.hubConnection.serverTimeoutInMilliseconds = 36000000;
  }

  ObtenerEsCoordinadora() {
    this.loadingBeneficiosSolicitados = true;

    this.agendaService.esCoordinadora$.subscribe(
      (resp) => (this.esCoordinadora = resp)
    );
  }
  initSubscribeObservables() {
    this.obtenerBeneficiosSolicitadosCoordinador();
    this.obtenerBeneficiosMatriculaActual();
    this.obtenerInversion();
    this.obtenerPrecioFinal();
  }

  obtenerBeneficiosSolicitadosCoordinador() {
    this.loadingBeneficiosSolicitados = true;
    //this.loading = true;
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados$.subscribe(
      {
        next: (resp: MatriculaCabeceraBeneficioDTO[]) => {
          if (resp != null) {
            this.gridBeneficiosSolicitados = resp;
            this.loadingBeneficiosSolicitados = false;
            //this.loading = false;
          }
        },
      }
    );
  }

  mostrarErrorCronograma(){
    this.isCronogramaConErrores = true;
        Swal.fire({
          title: "Matrícula interna / Cronograma no generado",
          icon: "info",
          iconColor: "#f9c396",
          width: 300,
          confirmButtonText: "Aceptar",
          buttonsStyling: false,
          customClass:{
            confirmButton: "sweetAlert2-customConfirmButtonSwal",
          }
    });
  }

  obtenerPrecioFinal(){
    this.integraService.getJsonResponse(constApiOperaciones.AgendaInformacionActividadObtenerPrecioFinalProgramaAlumno + '/' + this.agendaService.rowActual.codigoMatricula).subscribe({
      next: (response: HttpResponse<PrecioFinalProgramaAlumnoDTO>)=>{
        if (response.body == null) return;
        if (response.body.idCronograma === null || response.body.idCronograma === 0) this.mostrarErrorCronograma();
        else{
          try{
            let sumatoriaMatricula = this.decimalPipe.transform(response.body.sumatoriaMatriculas, '1.2-2');
            let valorMenorCuota = this.decimalPipe.transform(response.body.valorMenorCuota, '1.2-2');
            this.precioFinal = `(1 cuota inicial de ${sumatoriaMatricula} _tipoMoneda_ y ${response.body.nroCuotas} cuotas mensuales de ${valorMenorCuota} _tipoMoneda_)`;
          }catch(error){
            
          }
        }
      },
      error: (err)=>{
        console.log("Error en el cronograma");
      }
    });
    
  }

  replaceAll(text: string, oldValue: string, newValue: string){
    let textToSearch = new RegExp(oldValue, "g");
    return text.replace(textToSearch, newValue);
  }

  obtenerBeneficiosMatriculaActual() {
    this.loadingBeneficiosMatActual = true;
    //this.loading = true;
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.obtenerBeneficiosAlumnoAgenda$.subscribe(
      {
        next: (resp) => {
          if (resp != null) {
            console.log('RESP Beneficios Matriculados Actual COPIA', resp);
            this.gridBeneficiosMatriculaActual = resp.beneficios;
            console.log(
              'GRID Beneficios Matriculados Actual COPIA',
              this.gridBeneficiosMatriculaActual
            );
            this.correspondeBeneficio = resp.corresponde;
            this.correspondeBeneficioTemp = resp.corresponde;
            this.corresponde = resp.corresponde;
            resp.corresponde = false; //esto se pierde cuando termina la funcion
            this.correspondeBeneficioTemp = true;
          }
          //this.loading = false;
          this.loadingBeneficiosMatActual = false;
        },
      }
    );
  }
  solicitarDocumento(objRow: any) {
    this.loadingBeneficiosMatActual = true;
    let objeto: any = new Object();
    objeto.idTipoSolicitudOperaciones = 7;
    objeto.idOportunidad = this.rowActual.idOportunidad;
    objeto.idPersonalSolicitante = this.rowActual.idPersonal_Asignado;
    objeto.aprobado = true;
    objeto.realizado = true;
    objeto.idPersonalAprobacion = this.rowActual.idPersonal_Asignado;
    objeto.valorAnterior = 'beneficio';
    objeto.valorNuevo = 'beneficios';
    objeto.comentarioSolicitante = objRow.titulo;
    objeto.usuario = this.agendaService.userName;
    console.log('pruebassolicituddd3');
    let dto = JSON.stringify(objeto);

    this.agendaService.agendaInformacionActividadOportunidadOperacionesService
      .solicitarDocumento$(objRow)
      .subscribe({
        next: (response: any) => {
          this.Toast.fire({
            icon: 'success',
            title: 'Se aprobo el Beneficio',
          });
          console.log(response);
          this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridSolicitudDocumentos();
          if (
            response.body.datosadicionales == null ||
            response.body.datosadicionales == undefined ||
            response.body.datosadicionales == 0
          ) {
            this.hub.invoke(
              'notificacionSolicitudBeneficio',
              this.agendaService.datosPersonal.idJefe.toString()
            );
            //AgendaSocketModule.NotificacionSolicitudBeneficio(IdJefe);
          }
          //this.updateSolicitudCambio();
          this.loadingBeneficiosMatActual = false;
          this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados();
        },
        error: (error: any) => {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al aprobar el Beneficio',
          });
          this.loadingBeneficiosMatActual = false;
        },
      });
  }
  habilitarEntregaAsesor(e: any) {
    if (this.correspondeBeneficio == true) {
      if (e.EstadoSolicitudBeneficio === 'Aprobado') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  solicitarBeneficios(row: any) {
    Swal.fire({
      title: "¿Estás seguro de solicitar el beneficio?",
      icon: "info",
      iconColor: "#f9c396",
      showDenyButton: true,
      width: 300,
      confirmButtonText: "Aceptar",
      denyButtonText: "Cancelar",
      buttonsStyling: false,
      customClass:{
        confirmButton: "sweetAlert2-customConfirmButtonSwal",
        denyButton: "sweetAlert2-customDenyButton"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitarDocumento(row);
        this.RestablecerBeneficio(row);
      }
    });
    
  }
  AprobarBeneficio(objRow: any) {
    console.log('AprobarBeneficio', objRow);
    this.loadingBeneficiosMatActual = true;
    //this.loading = true;
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService
      .AprobarSolicitudBeneficio$(objRow.id)
      .subscribe({
        next: (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Se Aprobo Beneficio Con Exito',
          });
          //NotificacionModule.showMensajeExitoso(data.Mensaje, NotificacionId);
          this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados();
          this.agendaService.agendaInicializarOperacionesService.obtenerSolicitudes();
          //          this.loading = false;
          this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados$.subscribe(
            {
              next: (resp) => {
                if (resp != null) {
                  console.log('gridBeneficiosSolicitadosAprobar');
                  this.gridBeneficiosSolicitados = resp;
                  //this.loading = false;
                  this.loadingBeneficiosMatActual = false;

                }
              },
            }
          );
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: error.error,
          });
          //this.loading = false;
          this.loadingBeneficiosMatActual = false;

        },
      });
  }
  RechazarBeneficio(objRow: any) {
    console.log('RechazarBeneficio', objRow);
    this.loadingBeneficiosMatActual = true;
    //this.loading = true;
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService
      .RechazarSolicitudBeneficio$(objRow.id)
      .subscribe({
        next: (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Se rechazo con éxito',
          });

          //NotificacionModule.showMensajeExitoso(data.Mensaje, NotificacionId);
          this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados();
          //updateSolicitudCambio();
          //this.agendaService.AgendaInicializarOperacionesService.obtenerSolicitudes()
          this.agendaService.agendaInicializarOperacionesService.obtenerSolicitudes();
          //this.loading = false;
          //this.agendaService.agendaInicializarOperacionesService.obtenerSolicitudes();

          this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados$.subscribe(
            {
              next: (resp) => {
                if (resp != null) {
                  console.log('gridBeneficiosSolicitadosRechazar');
                  this.gridBeneficiosSolicitados = resp;
                  this.loadingBeneficiosMatActual = false;
                  //this.loading = false;
                }
              },
            }
          );
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: error.error,
          });
          this.loadingBeneficiosMatActual = false;
          //this.loading = false;
        },
      });
  }
  RestablecerBeneficio(dataItem: any) {
    this.loadingBeneficiosSolicitud = true;
    this.loadingBeneficiosMatActual = true;
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService
      .RestablecerBeneficio$(dataItem)
      .subscribe({
        next: (resp) => {
          this.loadingBeneficiosSolicitud = false;
          this.loadingBeneficiosMatActual = false;
          if (resp != null) {
            console.log(resp);
            console.log(
              'agendaInformacionActividadOportunidadOperacionesService'
            );
            this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados();
            this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridSolicitudDocumentos();
            //this.updateSolicitudCambio();
          }
        },
        error: (error: any) => {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al restablecer',
          });
          this.loadingBeneficiosSolicitud = false;
          this.loadingBeneficiosMatActual = false;

        },
      });
  }
  SolicitudCambioVersion() {
    this.modalRefModalSolicitudCambioVersion = this.modalService.open(
      this.modalSolicitudCambioVersion,
      {
        animation: true,
      }
    );
  }

  convertirSignosPrecio(texto: string){
    return texto.replace(/([A-Za-z\/\$]+)(\d+)/g, (match, p1, p2) => {
      return this.decimalPipe.transform(p2, '1.2-2') + ' '+ this.monedaActualAcronimo + ' ';
    });

   // return texto.replace(/([A-Za-z\/]+)(\d+)/g, this.decimalPipe.transform('$2', '1.2-2') + this.monedaActualAcronimo + ' ');
  }

  obtenerTotalPrecioCredito(text: string){
    try{
      let matches = text.replace(",",'').match(/\d+(?:\.\d{2})?/g);
      let cuotaInicial = parseFloat(matches[1]);
      let nroCuotas = parseInt(matches[2]);
      let costoCuota = parseFloat(matches[3]);
      let totalPrecio = cuotaInicial + (nroCuotas * costoCuota);
      return this.decimalPipe.transform(totalPrecio, '1.2-2') +' '+ this.monedaActualAcronimo;
    }catch(ex){
      return ''
    }
  }
  
  
  
  obtenerInversion() {
    this.loadingBeneficiosVersionesDisponibles = true;
    //this.loading = true;
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.informacionProgramaV1$.subscribe(
      {
        next: (resp) => {
          if (resp != null) {
            this.loadingBeneficiosVersionesDisponibles = false;
            let count: number = 1;
            console.log('respuestabeneficios resp', resp);
            console.log('respuestabeneficios Inversion',resp.respuesta.inversion);
            this.informacionProgramaBeneficio =
              resp.respuesta.etiquetaBeneficiosInversion;
            this.versionAlumno = resp.respuesta.inversion.find(
              (data: any) => data.paquete === resp.respuesta.versionAlumno[0].id
            )?.nombrePaquete;
            this.sp_NuevaVersion = resp.respuesta.inversion.find(
              (data: any) => data.paquete === resp.respuesta.versionAlumno[0].id
            )?.nombrePaquete;
            // console.log('TODA RESPUESTA', resp.respuesta);
            //TODO solo que salga el de la version actual
            // console.log('resp inversion', resp.respuesta.inversion);
            //this.gridInversion = resp.respuesta.inversion.filter( element => element.nombrePaquete === this.versionAlumno);
            // console.log(
            //   'gridInversion igual a la version ',
            //   this.gridInversion
            // );
            this.gridInversion = resp.respuesta.inversion;
            this.dataNuevaVersion = resp.respuesta.inversion.filter(
              (data: any) => data.paquete >= resp.respuesta.versionAlumno[0].id
            );
            this.gridBeneficios = resp.respuesta.listaBeneficiosAtC;
            this.gridMontoActual = resp.respuesta.montopagado;
            this.monedaActual = this.gridMontoActual[0]?.moneda ?? "";
            // console.log("moneda actual", this.monedaActual);
            this.monedaActualAcronimo = this.monedaSimboloMap.get(this.monedaActual.toLowerCase());
            // console.log("moneda actual ACR", this.monedaActualAcronimo);
            this.cargarNuevaVersion();
            console.log(this.informacionProgramaBeneficio);
            this.listaVersionesTotal = resp.respuesta.listaBeneficiosAtC;
            //this.loading = false;
            //logica lista versiones

            // console.log('insertarlista');
            // if (this.listaVersionesTotal.length < 2) {
            //   this.habilitarSolicitud = true;
            // } else {
            //   this.listaVersionesTotal.forEach((e: any) => {
            //     if (e.version != this.versionAlumno) {
            //       this.listaVersion.push({
            //         id: count,
            //         version: e.version,
            //       });
            //       count++;
            //     }
            //   });
            //   console.log(this.listaVersion);
            // }
          }
        },
        error: (error: any) => {
          this.loadingBeneficiosVersionesDisponibles = false;
          Swal.fire({
            icon: 'error',
            title: error.error,
          });
        },
      }
    );
  }

  // RegistrarSolicitudOperaciones() {
  //   // if(this.validFormSolicitud()){
  //   if (this.formSolicitud.get('observacion').value == null) {
  //     return Swal.fire({
  //       icon: 'warning',
  //       title: 'Ingrese un comentario Por favor',
  //     });
  //   }
  //   if (this.formSolicitud.get('listaVersion').value == null) {
  //     return Swal.fire({
  //       icon: 'warning',
  //       title: 'Ingrese una version Por favor',
  //     });
  //   }
  //   let objeto: any = {};
  //   let nuevoValor: any = this.formSolicitud.get('listaVersion').value;

  //   //let valorNuevo:any = this.formSolicitud.get("listaVersion")ValueAxisComponent..map((x:any) => x.id).includes(this.listaVersionesTotal)
  //   console.log('facebookds');

  //   //else if (IdTipoCambioOperacionesGeneral === 3)/*3: Version*/ {
  //   objeto.ValorAnterior = this.versionAlumno; //ObjetoCronogramaFinanzas[0].VersionPrograma === 1 ? "Básica" : ObjetoCronogramaFinanzas[0].VersionPrograma === 2 ? "Profesional" : ObjetoCronogramaFinanzas[0].VersionPrograma === 3 ? "Gerencial" : "sin versión";
  //   objeto.ValorNuevo = nuevoValor.version; //$('#inputValorVersion').data("kendoDropDownList").text();
  //   objeto.ComentarioSolicitante = this.formSolicitud.get('observacion').value; // $("#inputComentarioSolicitante").val();
  //   objeto.Usuario = this.agendaService.userName;
  //   objeto.IdOportunidad = this.rowActual.idOportunidad;
  //   objeto.idTipoSolicitudOperaciones = 3; //solicitud de version
  //   objeto.idPersonalSolicitante = this.rowActual.idPersonal_Asignado;
  //   objeto.idOportunidad = this.rowActual.idOportunidad;
  //   if (!this.esCoordinadora) {
  //     objeto.aprobado = false;
  //     objeto.idPersonalAprobacion = this.personal.idJefe;
  //   } else {
  //     objeto.aprobado = true;
  //     objeto.idPersonalAprobacion = this.rowActual.idPersonal_Asignado;
  //   }
  //   this.loading = true;

  //   var dto = JSON.stringify(objeto);
  //   this.agendaService.agendaInformacionActividadOportunidadOperacionesService
  //     .insertarSolicitudOperaciones$(objeto)
  //     .subscribe({
  //       next: (response: any) => {
  //         console.log(response.id);
  //         if (this.esCoordinadora) {
  //           let obj: any = {};
  //           obj.idSolicitudOperaciones = response.id;
  //           obj.usuario = response.usuarioCreacion;
  //           obj.observacion = response.comentarioSolicitante;
  //           this.agendaService.agendaInformacionActividadOportunidadOperacionesService
  //             .realizadoSolicitudOperaciones$(obj)
  //             .subscribe({
  //               next: (response: any) => {
  //                 console.log(response);
  //               },
  //             });
  //         }
  //         this.notificacionSeEnvioSolicitud();
  //         this.CancelarSolicitudOperaciones();
  //         this.loading = false;
  //       },
  //       error: (error: any) => {
  //         this.loading = false;
  //         Swal.fire({
  //           icon: 'error',
  //           title: error.error,
  //         });
  //       },
  //     });
  //   // }
  //   return 1;
  // }
  CancelarSolicitudOperaciones() {
    this.modalRefModalSolicitudCambioVersion.close();
    this.formSolicitud.reset();
  }
  notificacionSeEnvioSolicitud() {
    let Toast = Swal.mixin({
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
    Toast.fire({
      icon: 'success',
      title: 'Se Envio la Solicitud',
    });
  }

  validateCuotas() {
    /**Valida que el numero de cuotas sea 1 o mayor */
    this.sp_NumCuotas = this.sp_NumCuotas < 1 ? 1 : this.sp_NumCuotas;
  }

  cargarNuevaVersion() {
    const versionActual = this.gridInversion.find(
      (data: any) => data.nombrePaquete === this.versionAlumno
    );
    const versionNueva = this.gridInversion.find(
      (data: any) => data.nombrePaquete === this.sp_NuevaVersion
    );
    if (this.versionAlumno !== this.sp_NuevaVersion) {
      this.sp_DiferenciaPagar =
        versionNueva.contadoByDolares - versionActual.contadoByDolares;
      this.sp_NumCuotas = 1;
    } else {
      this.sp_DiferenciaPagar = null;
      this.sp_NumCuotas = null;
    }
    this.modificarCrongrama();
  }


  modificarCrongrama() {
    this.encontrarTipoMonedayCronograma();
    if (
      this.sp_DiferenciaPagar &&
      this.sp_DiferenciaPagar > 0 &&
      this.sp_NumCuotas > 0
    ) {
      let fechaVencimiento = new Date(
        this.ultimaCuotaCrongrama.fechaVencimiento
      );
      if (this.sp_NumCuotas === 1) {
        fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1);
        this.dataCronogramaNuevo.push({
          tipoCuota: 'Adicional',
          fechaVencimiento: datePipeTransform(
            new Date(fechaVencimiento),
            'dd/MM/yyyy',
            'en-US'
          ),
          nroCuota: this.ultimaCuotaCrongrama.nroCuota + 1,
          monto: this.sp_DiferenciaPagar,
        });
      } else {
        let cuotaTotal = this.sp_DiferenciaPagar;
        for (let i = 1; i <= this.sp_NumCuotas; i++) {
          cuotaTotal -= this.ultimaCuotaCrongrama.cuota;
          fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1);
          const fechaFormateada = datePipeTransform(
            fechaVencimiento,
            'dd/MM/yyyy',
            'en-US'
          );
          const montoCuota =
            cuotaTotal >= 0
              ? this.ultimaCuotaCrongrama.cuota
              : this.ultimaCuotaCrongrama.cuota + cuotaTotal;
          this.dataCronogramaNuevo.push({
            tipoCuota: 'Adicional',
            fechaVencimiento: fechaFormateada,
            nroCuota: this.ultimaCuotaCrongrama.nroCuota + i,
            monto: montoCuota >= 0 ? montoCuota : 0,
          });
          if (cuotaTotal < 0) cuotaTotal = 0;
        }
        if (cuotaTotal > 0) {
          const ultimaCuota =
            this.dataCronogramaNuevo[this.dataCronogramaNuevo.length - 1];
          ultimaCuota.monto += cuotaTotal;
        }
      }
    }
    this.dataCronogramaNuevo = this.dataCronogramaNuevo.slice();
  }

  copiarImgCronograma() {
    this.sp_loading=true
    const cronograma = document.getElementById('bloque-img');
    html2canvas(cronograma).then((canvas) => {
      canvas.toBlob((blob) => {
        navigator.clipboard
          .write([new ClipboardItem({ 'image/png': blob })])
          .then(() => {
            console.error('Img Creada');
            this.sp_loading=false
          })
          .catch((error) => {
            console.error('Error al copiar la imagen al portapapeles:', error);
            this.sp_loading=false
          });
      }, 'image/png');
    });
  }

  copiarImgCronogramaParaEnvio(): Promise<File> {
    const cronograma = document.getElementById('bloque-img');
    return html2canvas(cronograma).then(canvas => {
      return new Promise<File>((resolve, reject) => {
        canvas.toBlob(blob => {
          if (blob) {
            const file = new File([blob], 'cronograma.png', { type: 'image/png' });
            resolve(file);
          } else {
            reject('No se pudo generar la imagen.');
          }
        }, 'image/png');
      });
    });
  }

  encontrarTipoMonedayCronograma() {
    // const codigoPais = this.agendaService.rowActual.idCodigoPais;
    // switch (codigoPais) {
    //   case 51:
    //     this.sp_CodMoneda = 'PEN';
    //     break;
    //   case 52:
    //     this.sp_CodMoneda = 'MXN';
    //     break;
    //   case 57:
    //     this.sp_CodMoneda = 'COP';
    //     break;
    //   case 591:
    //     this.sp_CodMoneda = 'USD';
    //     break;
    //   default:
    //     this.sp_CodMoneda = 'USD';
    //     break;
    // }
    this.sp_CodMoneda = this.monedaActualAcronimo;
    this.agendaService.agendaCronogramaOperacionesService.cronogramaDePagos$.subscribe(
      {
        next: (resp: any) => {
          if (resp.listaCronogramaDetalle) {
            this.dataCronogramaNuevo = resp.listaCronogramaDetalle
              .filter((data: any) => {
                return !data.cancelado;
              })
              .map((data: any) => {
                return {
                  tipoCuota: data.tipoCuota,
                  fechaVencimiento: datePipeTransform(
                    new Date(data.fechaVencimiento),
                    'dd/MM/yyyy',
                    'en-US'
                  ),
                  nroCuota: data.nroCuota,
                  monto: data.cuota,
                };
              });
            this.ultimaCuotaCrongrama =
              resp.listaCronogramaDetalle[
                resp.listaCronogramaDetalle.length - 1
              ];
            console.log('ULTIMO CUOTA ', this.ultimaCuotaCrongrama);
          }
          console.log('CRONOGRAMA', resp.listaCronogramaDetalle);
        },
      }
    );
  }

  async enviarEmailSimuladorPago(){
    this.sp_loading=true
    const promise = this.copiarImgCronogramaParaEnvio()
    try{
      const resultado = await promise;
      const fdata = new FormData();

      const _asunto = 'Simulador de Pagos';
      const _mensaje = btoa("Imagen de Simulador de pagos adjunto.");
      const _destinatario =  this.agendaService.rowActual.email1;
      const _remitente = this.dataAsesor.email;
      const _centroCosto = this.agendaService.rowActual.idCentroCosto ;

      // Añadir datos al FormData
      fdata.append('IdActividadDetalle', String(this.agendaService.rowActual.id));
      fdata.append('Idcentrocosto', String(_centroCosto));
      fdata.append('Idoportunidad', String(this.agendaService.rowActual.idOportunidad));
      fdata.append('Remitente', _remitente);
      fdata.append('Destinatario', _destinatario);
      fdata.append('Asunto', _asunto);
      fdata.append('Mensaje', _mensaje);
      fdata.append('DestinatarioCc',  '');
      fdata.append('Usuario', this.agendaService.userName);
      fdata.append('IdAsesor', String(this.agendaService.idPersonal));
      fdata.append('Files', resultado);

      this.agendaService.agendaActividadesOperacionesService
      .sendMessageAcrossMandrill$(fdata)
      .subscribe({
        next: (response: boolean) => {
          if (response == true) {
            // this.alertaService.swalFire(
            //   'Enviado',
            //   'El mensaje se envio correctamente',
            //   'success'
            // );
            this.alertaService.mensajeCorreoExitoso();
          }
          this.sp_loading = false;

        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
          this.sp_loading = false;
        }
      });
    }catch{
      console.log("Error en la creacion de img")
    }


  }

  obtenerNumero(): void {
    let numero: string = this.agendaService.rowActual.celular;
    numero = numero.replace('+', '');
    let prefijo: string;
    switch (this.agendaService.rowActual.idCodigoPais) {
      case 0: // Default case
        prefijo = '';
        break;
      case 51: // Perú
        prefijo = '51';
        break;
      case 57: // Colombia
        prefijo = '57';
        break;
      case 591: // Bolivia
        prefijo = '591';
        break;
      case 52: // México
        prefijo = '52';
        break;
      default: // Otros países
        prefijo = '';
    }
    if (numero.startsWith(prefijo)) {
      numero = numero;
    }
    else if (numero.startsWith('00')) {
      numero = numero.substring(2);
    }
    else if (numero.startsWith(`00${prefijo}`)) {
      numero = numero.substring(4);
      numero = `${prefijo}${numero}`;
    }
    else {
      numero = `${prefijo}${numero}`;
    }
    this.numeroCelularLimpio = numero;
  }

  async enviarWhatsAppSimuladorPago( ) {
    this.sp_loading=true
    const promise = this.copiarImgCronogramaParaEnvio()
    try{
        const resultado = await promise;
        var fdata = new FormData();
          let nombreTipoSelecionado: string = 'imagensubida';
          let WaType: string ='image';
          let objetoArchivo: any = null;

          fdata.append('file', resultado);
          this.integraService
            .postFormJsonResponse(
              constApiOperaciones.WhatsAppMensajeRecibidoAdjuntarArchivoWhatsApp,
              fdata
            )
            .subscribe({
              next: (response: any) => {
                if (response.resultado != 'Error') {
                  objetoArchivo = {
                    WaId: '0',
                    WaTo: this.numeroCelularLimpio,
                    WaType: WaType,
                    WaTypeMensaje: 2,
                    WaRecipientType: 'individual',
                    WaLink: response.urlArchivo,
                    WaFileName: response.nombreArchivo,
                    IdPais: this.agendaService.rowActual.idCodigoPais,
                    IdPersonal: this.agendaService.idPersonal,
                    IdAlumno: this.agendaService.rowActual.idAlumno,
                    EsMigracion: true,
                    IdMigracion: 0,
                    usuario: this.agendaService.userName,
                  };
                  //sleep(2000);
                  if (this.numeroCelularLimpio != '') {
                    this.enviarMensaje(objetoArchivo);
                  } else {
                    this.alertaService.swalFire("Mensaje no enviado","El número del alumno no es valido","error")
                    this.sp_loading=false
                  }
                } else {
                  this.alertaService.swalFire("Mensaje no enviado","Ocurrio un error al procesar la imagen","error")
                  this.sp_loading=false
                }
              },
              error: (error: any) => {
                this.alertaService.swalFire("Mensaje no enviado","Ocurrio un error al procesar la imagen","error")
                this.sp_loading=false
              },
            });
    }catch{
      console.log("Error en la creacion de img")
      this.sp_loading=false
    }
  }

  enviarMensaje(objeto: IDataEnvioWhatsapp) {

    let mensajeEnvido: any = null;
    let mensajeIndicador: IMensajesWhatsapp = null;
    mensajeEnvido = objeto.WaBody;
    objeto.IdPais=51
    if( objeto.IdPais !=51 && objeto.IdPais !=57 && objeto.IdPais !=591 )
    {
      this.integraService
      .postJsonResponseWhatsapp(
        `${constApiOperaciones.WhatsAppMensajesWhatsAppMensaje}`,
        objeto
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('llegadadewhatsapp', response.body);
           const esEnvioCorrecto = response.body.estadoMensaje
           this.sp_loading=false
          if(esEnvioCorrecto===true){
            this.alertaService.swalFire('success', 'El mensaje fue enviado Correctamente','success');
          }else{
            this.alertaService.swalFire('error', 'El mensaje no fue enviado','error');
          }
          mensajeIndicador = {
            numero: this.numeroCelularLimpio,
            tipo: 1,
            mensaje: response.body.mensaje,
            idPersonal: null,
            fechaCreacion: new Date(),
            idAlumno: null,
            estadoMensaje: 1,
            nombrePersonal: this.agendaService.personalNombres,
          };
          this.historialMensajeRecibidosChat.push(mensajeIndicador);
        },
        error: (error: any) => {
          this.sp_loading=false
          mensajeIndicador = {
            numero: this.numeroCelularLimpio,
            tipo: 1,
            mensaje: 'Problemas con el Servicio de whatsapp',
            idPersonal: null,
            fechaCreacion: new Date(),
            idAlumno: null,
            estadoMensaje: 1,
            nombrePersonal: this.agendaService.personalNombres,
          };
          this.historialMensajeRecibidosChat.push(mensajeIndicador);
          this.alertaService.swalFire('error', 'Fallo el servicio','error');
        },
      });

    }
    else{
      this.integraService
      .postJsonResponse(
        `${constApiOperaciones.WhatsAppMensajesWhatsAppMensaje}`,
        objeto
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('llegadadewhatsapp', response.body);
          this.sp_loading=false
          const esEnvioCorrecto = response.body.estadoMensaje
          if(esEnvioCorrecto===true){
            this.alertaService.swalFire('success', 'El mensaje fue enviado Correctamente','success');
          }else{
            this.alertaService.swalFire('error', 'El mensaje no fue enviado','error');
          }
          mensajeIndicador = {
            numero: this.numeroCelularLimpio,
            tipo: 1,
            mensaje: response.body.mensaje,
            idPersonal: null,
            fechaCreacion: new Date(),
            idAlumno: null,
            estadoMensaje: 1,
            nombrePersonal: this.agendaService.personalNombres,
          };

          this.historialMensajeRecibidosChat.push(mensajeIndicador);
        },
        error: (error: any) => {
          this.sp_loading=false
          mensajeIndicador = {
            numero: this.numeroCelularLimpio,
            tipo: 1,
            mensaje: 'Problemas con el Servicio de whatsapp',
            idPersonal: null,
            fechaCreacion: new Date(),
            idAlumno: null,
            estadoMensaje: 1,
            nombrePersonal:  this.agendaService.personalNombres,
          };
          this.historialMensajeRecibidosChat.push(mensajeIndicador);
          this.alertaService.swalFire('error', 'Fallo el servicio','error');
        },
      });

    }
  }


  transferirDatosRedactar() {
    this.agendaService.agendaDocumentoProgramaOperacionesService
      .datosOportunidad$.subscribe(
        {
          next: (resp) => {
            this.dataAsesor = resp
          }
        }
      );
  }
  reconocerError(error: any): string {
    let mensaje: string;
    if (error.status == 0) {
      mensaje = 'Verifique la conexion con servicios (0)';
    } else if (error.status == 404) {
      mensaje = 'No se encontro el recurso (404)';
    } else if (error.status == 400) {
      mensaje = 'El servidor no pudo procesará la petición (400)';
    } else {
      mensaje = error.message;
    }
    return mensaje;
  }
}

interface PrecioFinalProgramaAlumnoDTO {
  idCronograma: number | null;
  sumatoriaMatriculas: number | null;
  nroCuotas: number | null;
  valorMenorCuota: number | null;
}