import { Component, Input, OnInit } from '@angular/core';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import {
  CreditoVigente,
  DataCredito,
  DataCreditoInformacion,
  TarjetaCredito,
  ISentinelEstado,
  IPosicionHistoria,
  IDetalleSentinel,
  IDatosGenerales,
  IDniRuc,
  IDeuda,
  IDatosVencidas,
} from '@comercial/models/interfaces/iagenda-sentinel';
import {
  IDatosSentinelAlumno,
  ISemaforoSentinelAlumno,
  ILineaCredito,
  ILineaDeuda,
} from '@integra/areas/comercial/models/interfaces/isemaforo-financiero';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import Swal from 'sweetalert2';
import { getDate } from '@progress/kendo-date-math';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-historial-semaforo-financiero',
  templateUrl: './historial-semaforo-financiero.component.html',
  styleUrls: ['./historial-semaforo-financiero.component.scss'],
})
export class HistorialSemaforoFinancieroComponent implements OnInit {
  @Input() agendaService: AgendaService;
  constructor(private _alertaService: AlertaService, private modalService: NgbModal) {}

  private _rowActual: IRowActual;
  private _subscriptions$: Subscription = new Subscription();
  cabeceraSemaforoFinanciero: ISemaforoSentinelAlumno = {
    color: '#ff0303',
    mensaje: 'Solo aplica para Perú',
  };
  monedaCliente: string = null;
  rowActual: any;
  datosDeuda: any;
  datosDeudaVencida: any;
  flagConsultaCR: boolean = false;
  flagPeru: boolean = false;

  btnConsultar: any = {
    disabled: false,
    show: false,
    text: 'Consultar',
    class: 'btn-success',
    color: 'success',
  };

  showSentinelHelp: boolean = false;
  sentinelHelp: string = '';


  // Grids Semaforo Financiero0
  sentinelAlumno: any;
  btnVerDetalleSentinel: any = {
    disabled: false,
    show: false,
  };
  edadClienteSentinel: string = '';
  // Grids Semaforo Financiero
  gridCreditos: KendoGrid = new KendoGrid();
  gridDeudas: KendoGrid = new KendoGrid();
  gridDeudasVencidas: KendoGrid = new KendoGrid();
  nroDocumento: string = '';

  //nuevoa grids
  gridPosicionHistorica: KendoGrid = new KendoGrid();
  gridDireccionesRegistradas: KendoGrid = new KendoGrid();
  gridDocumentoLineasCredito: KendoGrid = new KendoGrid();
  gridDNIRUC: KendoGrid = new KendoGrid();
  gridDocumentoConsultadoDetalleDeuda: KendoGrid = new KendoGrid();
  gridDocumentoDetalleVencidos: KendoGrid = new KendoGrid();
  gridOtroDocumentoConsultadoDetalleDeuda: KendoGrid = new KendoGrid();
  gridOtroDocumentoDetalleVencidos: KendoGrid = new KendoGrid();
  gridOtroDocumentoLineasCredito: KendoGrid = new KendoGrid();
  gridDatosGenerales = new KendoGrid();
  gridDatosPrincipales1: KendoGrid = new KendoGrid();
  gridDatosPrincipales2: KendoGrid = new KendoGrid();

  ngOnInit(): void {
    this._rowActual = this.agendaService.rowActual;
    this.initSubscribeObservables();
  }
  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
  }
  private initSubscribeObservables() {
    let sub1$ = this.agendaService.agendaAlumnoService.alumno$.subscribe(
      (resp) => {
        if (resp != null) {
          this.calcularEdadClienteSentinel(resp.fechaNacimiento);
          if(resp.idCodigoPais!=null){
            this.flagPeru = resp.idCodigoPais==51 ? true : false;
            this.nroDocumento = resp.dni;
            if(!this.flagPeru)
            {
              this.agendaService.agendaSentinelService.btnConsultar$.next({
                disabled: true,
                text: 'No Aplica',
                class: 'btn-secondary',
                color: 'secondary',
              });

              //carlos
              this.btnConsultar = {
                disabled: true,
                text: 'No Aplica',
                class: 'btn-secondary',
                color: 'secondary',
              };
            }
          }
        }
      }
    );
    let sub2$ =
      this.agendaService.agendaSentinelService.sentinelAlumno$.subscribe(
        (resp) => {
          if (resp != null) {
            if (resp.sentinelValidado == true) {
              this.flagConsultaCR=true;
              this.cargarSemaforoFinanciero(resp);
            } else {
              this.flagConsultaCR=false;
              this.validarPaisAlumno(this._rowActual.idAlumno);
            }
          }
        }
      );
    let sub3$ =
      this.agendaService.agendaSentinelService.informacionDataCredito$.subscribe(
        (resp) => {
          if (resp != null) {
            this.flagConsultaCR=true;
            this.cargarDataCredito(resp);
          }else{
            this.flagConsultaCR=false;
          }
        }
      );
    let sub4$ =
      this.agendaService.agendaSentinelService.resetSentinel$.subscribe(
        (resp) => {
          if (resp == true) {
            this.sentinelAlumno = null;
            this.edadClienteSentinel = 'Edad:';
            this.gridCreditos.data = [];
            this.gridDeudas.data = [];
            this.gridDeudasVencidas.data = [];
            this.gridDeudas.data = [];
            this.cabeceraSemaforoFinanciero = {
              color: '#808080',
              mensaje: 'Consultando...',
            };
          }
        }
      );
      let sub5$ = this.agendaService.agendaSentinelService.showSentinelHelp$.subscribe(
        (resp) => {
          this.showSentinelHelp = resp;
        }
      );
      let sub6$ = this.agendaService.agendaSentinelService.resetSentinel$.subscribe({
        next: (resp) => {
          if(resp == true){
            this.sentinelAlumno = {};
            this.sentinelHelp = '';
            this.showSentinelHelp = false;
            this.btnConsultar = {
              disabled: false,
              show: false,
              text: 'Consultar',
              color: 'success',
            };
            this.btnVerDetalleSentinel = {
              disabled: false,
              show: false,
            };
          }
        },
      });
      let sub7$ = this.agendaService.agendaSentinelService.btnVerDetalleSentinel$.subscribe(
        (resp) => {
          this.btnVerDetalleSentinel = Object.assign(
            this.btnVerDetalleSentinel,
            resp
          );
        }
      );
      let sub8$ = this.agendaService.agendaSentinelService.sentinelHelp$.subscribe((resp) => {
          this.sentinelHelp = resp;
        }
      );
      
    this._subscriptions$.add(sub1$);
    this._subscriptions$.add(sub2$);
    this._subscriptions$.add(sub3$);
    this._subscriptions$.add(sub4$);
  }
  consultarNroDocumento() {
    const CampoDni = this.nroDocumento.trim();
    if (this.agendaService.agendaSentinelService.paisGlobal == 'PE') {
      this.btnConsultar.disabled = true;
      this.btnConsultar.html = 'Consultar';
      this.btnConsultar.class = 'btn-warning';
      this.btnConsultar.color = 'warning';
      if (CampoDni.length == 8) {
        this.agendaService.agendaSentinelService.resetSentinel();
        this.agendaService.agendaSentinelService
          .actualizarSentinelAlumno$(CampoDni, this._rowActual.idAlumno)
          .subscribe({
            next: (response: HttpResponse<ISentinelEstado>) => {
              if (response.body.rpta == true) {
                this.recargarDatosSentinel();
              } else {
                Swal.fire('No se encontró información');
                this.cabeceraSemaforoFinanciero.color = '#808080';
                this.cabeceraSemaforoFinanciero.mensaje = 'Aun no se consulto';
              }
            },
            error: (error) => {
              let mensaje = this._alertaService.getErrorResponse(error).mensaje;
              this._alertaService.notificationWarning(mensaje);
              Swal.fire({
                icon: 'error',
                title: 'Error al consultar los datos de Sentinel',
                text: mensaje,
              });
              this.btnConsultar.disabled = false;
            },
          });
      } else {
        this.btnConsultar.disabled = false;
        this._alertaService.swalFireOptions({
          icon: 'warning',
          text: 'El numero de DNI a consultar debe tener 8 digitos',
        });
      }
    } else {
      this.btnConsultar.disabled = true;
      this.btnConsultar.html = 'Consultar';
      this.btnConsultar.color = 'warning';
      if (CampoDni.length >= 9) {
        this.agendaService.agendaSentinelService.resetSentinel();
        this.agendaService.agendaSentinelService
          .actualizarInformacionDataCredito$(CampoDni, this._rowActual.idAlumno)
          .subscribe({
            next: (resp: HttpResponse<any>) => {
              this.agendaService.agendaSentinelService.obtenerInformacionDataCredito();
            },
            error: (error) => {
              this._alertaService.notificationWarning(error.message);
            },
          });
      } else {
        this.btnConsultar.disabled = false;
        this._alertaService.swalFireOptions({
          icon: 'warning',
          text: 'El numero de Cedula a consultar debe tener 10 digitos',
        });
      }
    }
  }
  recargarDatosSentinel() {
    this.agendaService.agendaSentinelService
      .recargarDatosSentinel$(this._rowActual.idAlumno)
      .subscribe({
        next: (resp: HttpResponse<IDatosSentinelAlumno>) => {
          if(resp.body != null){
            resp.body.sentinelValidado = true
            this.agendaService.agendaSentinelService.sentinelAlumno$.next(
              resp.body
            );
          }else{
            let item: IDatosSentinelAlumno = {
              sentinelValidado : false
            }
            this.agendaService.agendaSentinelService.sentinelAlumno$.next(
            item
            );
          }  
        },
        complete: () => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Se cargo correctamente los datos de Sentinel',
            showConfirmButton: false,
            timer: 1500,
          });
        },
      });
  }

  private cargarSemaforoFinanciero(resp: IDatosSentinelAlumno) {
    this.sentinelAlumno = resp;
    this.configurarSentinel(resp);
    this.cargarDatosSentinelAlumno(resp);
    this.cargarGridCreditos(resp.lineaCredito);
    this.cargarGridDeudas(resp.lineaDeuda);
    this.cargarGridDeudasVencidas(resp.lineaDeudaVencida);
    this.cargarCabeceraSemaforo();
    this.gridCreditos.data = resp.lineaCredito;
    this.gridDeudas.data = resp.lineaDeuda.filter((e) => e.diasVencidos == 0);
    this.gridDeudasVencidas.data = resp.lineaDeuda.filter(
      (e) => e.diasVencidos > 0
    );
    this.cargarGridDeudas(resp.lineaDeuda);
    this.agendaService.agendaSentinelService.showSentinelHelp$.next(true);
    this.showSentinelHelp = true;
  }
  private configurarSentinel(resp: IDatosSentinelAlumno) {
    this.sentinelAlumno = resp;
    const fechaProximaConsulta = new Date(resp.fechaUltimaActualizacion);
    fechaProximaConsulta.setMonth(fechaProximaConsulta.getMonth() + 6);
    if (fechaProximaConsulta <= getDate(new Date())) {
      this.agendaService.agendaSentinelService.btnConsultar$.next({
        disabled: false,
        text: 'Consultar',
        class: 'btn-primary',
        color: 'success',
      });

      this.btnConsultar = {
        disabled: false,
        text: 'Consultar',
        class: 'btn-primary',
        color: 'success',
      };

    } else {
      this.agendaService.agendaSentinelService.btnConsultar$.next({
        disabled: true,
        text: 'Consultar',
        class: 'btn-warning',
        color: 'warning',
      });

      this.btnConsultar = {
        disabled: true,
        text: 'Consultar',
        class: 'btn-warning',
        color: 'warning',
      };
    }
    this.agendaService.agendaSentinelService.showSentinelHelp$.next(true);
    this.showSentinelHelp = true;
    this.agendaService.agendaSentinelService.btnVerDetalleSentinel$.next({
      show: true,
    });
    this.btnVerDetalleSentinel = {
      show: true,
    };
    this.agendaService.agendaSentinelService.sentinelHelp$.next(
      this.getSentinelHelp(this.sentinelAlumno, 'DNI')
    );
  }
  private cargarGridDeudasVencidas(
    lineaDeuda: ILineaDeuda[] | CreditoVigente[]
  ) {
    if (lineaDeuda != null && lineaDeuda.length > 0) {
      this.gridDeudasVencidas.data = lineaDeuda.filter(
        (e) => e.diasVencidos > 0
      );
    } else {
      this.gridDeudasVencidas.data = [];
    }
  }
  private cargarInformacionDataCreditoAlumno() {
    this.agendaService.agendaSentinelService.btnConsultar$.next({
      disabled: true,
      text: 'Consultar',
      class: 'btn-warning',
      color: 'warning',
    });

    this.btnConsultar = {
      disabled: true,
      text: 'Consultar',
      class: 'btn-warning',
      color: 'warning',
    };
  }
  private cargarDataCredito(data: DataCredito) {
    if (data != null) {
      this.cargarInformacionDataCreditoAlumno();
      this.cargarGridCreditos(data.tarjeta);
      this.cargarGridDeudas(data.credito);
      this.cargarGridDeudasVencidas(data.credito);
      this.agendaService.agendaSentinelService.showSentinelHelp$.next(true);
      this.agendaService.agendaSentinelService.sentinelHelp$.next(
        this.getSentinelHelp(data.informacion, 'Cedula')
      );
    } else {
      this.agendaService.agendaSentinelService.btnConsultar$.next({
        disabled: false,
      });
      this.btnConsultar.disabled=false;
      this.agendaService.agendaSentinelService.btnVerDetalleSentinel$.next({
        show: true,
      });
      this.btnVerDetalleSentinel = {
        show: true,
      };
    }
  }
  private getSentinelHelp(
    sentinel: IDatosSentinelAlumno | DataCreditoInformacion,
    tipoDocumento: string
  ): string {
    if (sentinel.fechaUltimaActualizacion) {
      const fechaUltimaActualizacion = new Date(
        sentinel.fechaUltimaActualizacion
      );
      const fehcaProximaConsulta = new Date(sentinel.fechaUltimaActualizacion);
      fehcaProximaConsulta.setMonth(fechaUltimaActualizacion.getMonth() + 6);
      return `Consulta exitosa realizada el ${datePipeTransform(
        fechaUltimaActualizacion,
        'dd/MM/yyyy'
      )} para ${sentinel.nombreAlterno}; con ${tipoDocumento} ${sentinel.dni}
      <br>Proxima fecha de consulta: ${datePipeTransform(
        fehcaProximaConsulta,
        'dd/MM/yyyy'
      )}`;
    } else {
      return '';
    }
  }
  private cargarCabeceraSemaforo() {
    let sub$ = this.agendaService.agendaSentinelService
      .obtenerSemaforoSentinelAlumno$(this._rowActual.idAlumno)
      .subscribe({
        next: (resp) => {
          if (resp.body != null) {
            this.cabeceraSemaforoFinanciero.color = resp.body.color;
            this.cabeceraSemaforoFinanciero.mensaje = resp.body.mensaje;
            if (
              this.cabeceraSemaforoFinanciero.color == null ||
              this.cabeceraSemaforoFinanciero.mensaje == null
            ) {
              this.cabeceraSemaforoFinanciero.color = '#808080';
              this.cabeceraSemaforoFinanciero.mensaje = 'Aun no se consulto';
            }
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptions$.add(sub$);
  }
  private calcularEdadClienteSentinel(fechaNacimiento: Date | string) {
    if (fechaNacimiento != null) {
      fechaNacimiento = new Date(fechaNacimiento);
      const fechaActual = new Date();
      let years = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
      let months = fechaActual.getMonth() - fechaNacimiento.getMonth();
      if (
        months < 0 ||
        (months == 0 && fechaActual.getDate() < fechaNacimiento.getDate())
      ) {
        this.edadClienteSentinel = `Edad: ${years--}`;
      }
      this.edadClienteSentinel = `Edad: ${years}`;
    } else {
      this.edadClienteSentinel = 'Edad: --';
    }
  }
  private cargarDatosSentinelAlumno(resp: IDatosSentinelAlumno) {
    this.sentinelAlumno = resp;
    this.calcularEdadClienteSentinel(this.sentinelAlumno.fechaNacimiento);
  }
  private validarPaisAlumno(idAlumno: number) {
    let sub$ = this.agendaService.agendaSentinelService
      .obtenerCodigoMonedaPorIdAlumno$(idAlumno)
      .subscribe({
        next: (response) => {
          this.monedaCliente = response.body.valor;
          if (response.body.valor == 'PEN') {
            this.cabeceraSemaforoFinanciero.color = '#808080';
            this.cabeceraSemaforoFinanciero.mensaje = 'Aun no se consulto';
          }
          if (response.body.valor == 'COL') {
            this.agendaService.agendaSentinelService.paisGlobal = 'CO';
            this.agendaService.agendaSentinelService.obtenerInformacionDataCredito();
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptions$.add(sub$);
  }
  private cargarGridCreditos(lineaCredito: ILineaCredito[] | TarjetaCredito[]) {
    if (lineaCredito != null && lineaCredito.length > 0) {
      this.gridCreditos.data = lineaCredito;
    } else {
      this.gridCreditos.data = [];
    }
  }
  private cargarGridDeudas(lineaDeuda: ILineaDeuda[] | CreditoVigente[]) {
    if (lineaDeuda != null && lineaDeuda.length > 0) {
      this.gridDeudas.data = lineaDeuda.filter((x: any) => x.diasVencidos == 0);
      
    } else {
      this.gridDeudas.data = [];
    }
  }
  verDetalleSemaforoFin(content: any) {
    const idSentinel = this.sentinelAlumno.idSentinel;
    this.agendaService.agendaSentinelService
      .obtenerDetalleSentinel$(idSentinel)
      .subscribe({
        next: (response: HttpResponse<IDetalleSentinel>) => {
          const data = response.body;
          let dniRuc = data.dniRuc.map((e) => ({
            ...e,
            fechaProceso: new Date(e.fechaProceso),
            fechaInicioActividad: new Date(e.fechaInicioActividad),
            fechaCreacion: new Date(e.fechaCreacion),
            fechaModificacion: new Date(e.fechaProceso),
          }));
          let datosGenerales = data.datosGenerales.map((e) => ({
            ...e,
            fechaActividad: new Date(e.fechaActividad),
            fechaNacimiento: new Date(e.fechaNacimiento),
            fechaCreacion: new Date(e.fechaCreacion),
            fechaModificacion: new Date(e.fechaModificacion),
          }));
          let deuda = data.deuda.map((e) => ({
            ...e,
            fechaReporte: new Date(e.fechaReporte),
            fechaCreacion: new Date(e.fechaCreacion),
            fechaModificacion: new Date(e.fechaModificacion),
          }));
          let lineaCredito = data.lineaCredito;
          let datosVencidas = data.datosVencidas.map((e) => ({
            ...e,
            fechaCreacion: new Date(e.fechaCreacion),
            fechaModificacion: new Date(e.fechaModificacion),
          }));
          let posicionHistoria = data.posicionHistoria.map((e) => ({
            ...e,
            fechaProceso: new Date(e.fechaProceso),
            fechaCreacion: new Date(e.fechaCreacion),
            fechaModificacion: new Date(e.fechaModificacion),
          }));
          this.cargarDNIRUC(dniRuc);
          this.cargarDocumentoConsultadoSemaforos(dniRuc);
          this.cargarDocumentoDetalleDeudaSBS(deuda);
          this.cargarDocumentoDetalleVencidos(datosVencidas);
          this.cargarDocumentoLineasCredito(lineaCredito);
          this.cargarOtroDocumentoConsultadoSemaforos(dniRuc);
          this.cargarOtroDocumentoDetalleDeudaSBS(deuda);
          this.cargarOtroDocumentoDetalleVencidos(datosVencidas);
          this.cargarOtroDocumentoLineasCredito(lineaCredito);
          this.cargarDatosGenerales(datosGenerales);
          this.cargarDatosPrincipales1(datosGenerales);
          this.cargarDatosPrincipales2(datosGenerales);
          this.cargarDireccionesRegistradas(datosGenerales);
          this.cargarPosicionHistorica(posicionHistoria);
        },
      });
    this.modalService.open(content, { backdrop: 'static', size: 'xl' });
  }
  _colorSemaforoAV(semaforo: any) {
    var color;
    switch (semaforo) {
      case 'R':
        color = 'red';
        break;
      case 'G':
        color = 'gray';
        break;
      case 'A':
        color = 'yellow';
        break;
      case 'V':
        color = 'green';
        break;
      default:
        color = 'transparent';
    }
    return color;
  }
  cargarPosicionHistorica(posicionHistoria: IPosicionHistoria[]) {
    this.gridPosicionHistorica.data = posicionHistoria;
  }

  cargarDNIRUC(dniRuc: IDniRuc[]) {
    this.gridDNIRUC.data = dniRuc;
  }
  semaforos: any[] = [];
  cargarDocumentoConsultadoSemaforos(dniRuc: IDniRuc[]) {
    let documentoConsultadoSemaforos = dniRuc.filter((item) => {
      return item.tipoDocumento == 'D' ? true : false;
    });
    let semaforos =
      documentoConsultadoSemaforos.length > 0
        ? documentoConsultadoSemaforos[0].semaforos
        : '';
    this.semaforos = semaforos.split('');
  }

  cargarDocumentoDetalleDeudaSBS(deuda: IDeuda[]) {
    let record = deuda.filter((item) => item.tipoDoc == 'D');
    this.gridDocumentoConsultadoDetalleDeuda.data = record;
  }
  cargarDocumentoDetalleVencidos(deuda: IDatosVencidas[]) {
    let record = deuda.filter((item) => item.tipoDocumento == 'D');
    this.gridDocumentoDetalleVencidos.data = record;
  }
  cargarDocumentoLineasCredito(lineaCredito: ILineaCredito[]) {
    let record = lineaCredito.filter((item) => item.tipoDocumento == 'D');
    this.gridDocumentoLineasCredito.data = record;
  }
  semaforos2: any[] = [];
  cargarOtroDocumentoConsultadoSemaforos(records: IDniRuc[]) {
    let documentoConsultadoSemaforos = records.filter(
      (item) => item.tipoDocumento == 'R'
    );
    let semaforos =
      documentoConsultadoSemaforos.length > 0
        ? documentoConsultadoSemaforos[0].semaforos
        : '';
    this.semaforos2 = semaforos.split('');
  }
  cargarOtroDocumentoDetalleDeudaSBS(deuda: IDeuda[]) {
    let record = deuda.filter((item) => item.tipoDoc == 'R');
    this.gridOtroDocumentoConsultadoDetalleDeuda.data = record;
  }
  cargarOtroDocumentoDetalleVencidos(datosVencidas: IDatosVencidas[]) {
    let record = datosVencidas.filter((item) => item.tipoDocumento == 'R');
    this.gridOtroDocumentoDetalleVencidos.data = record;
  }
  cargarOtroDocumentoLineasCredito(lineaCredito: ILineaCredito[]) {
    let record = lineaCredito.filter((item) => item.tipoDocumento == 'R');
    this.gridOtroDocumentoLineasCredito.data = record;
  }
  cargarDatosGenerales(datosGenerales: IDatosGenerales[]) {
    this.gridDatosGenerales.data = datosGenerales;
  }
  cargarDatosPrincipales1(datosGenerales: IDatosGenerales[]) {
    this.gridDatosPrincipales1.data = datosGenerales;
  }
  cargarDatosPrincipales2(datosGenerales: IDatosGenerales[]) {
    this.gridDatosPrincipales2.data = datosGenerales;
  }
  cargarDireccionesRegistradas(datosGenerales: IDatosGenerales[]) {
    this.gridDireccionesRegistradas.data = datosGenerales;
  }
}
