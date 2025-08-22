import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import {
  CreditoVigente,
  DataCredito,
  DataCreditoInformacion,
  TarjetaCredito,
} from '@comercial/models/interfaces/iagenda-sentinel';
import { constApiComercial, constApiGlobal } from '@environments/constApi';
import {
  IDatosSentinelAlumno,
  ISemaforoSentinelAlumno,
  ILineaCredito,
  ILineaDeuda,
} from '@integra/areas/comercial/models/interfaces/isemaforo-financiero';
import { getDate } from '@progress/kendo-date-math';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-semaforo-financiero',
  templateUrl: './modal-semaforo-financiero.component.html',
  styleUrls: ['./modal-semaforo-financiero.component.scss']
})
export class ModalSemaforoFinancieroComponent implements OnInit {
  @Input() idAlumno: number;
  constructor(private integraService: IntegraService, private _alertaService: AlertaService, private userService: UserService) {}

  private _rowActual: IRowActual;
  private _subscriptions$: Subscription = new Subscription();

  cabeceraSemaforoFinanciero: ISemaforoSentinelAlumno = {
    color: '#808080',
    mensaje: 'Aún no se consultó',
  };

  btnConsultar$ = new BehaviorSubject<any>({
    disabled: false,
    show: false,
    class: 'btn-success',
    text: 'Consultar',
    color: 'success',
  });

  btnVerDetalleSentinel$ = new BehaviorSubject<any>({
    disabled: false,
    show: false,
  });

  showSentinelHelp$ = new BehaviorSubject<boolean>(false);
  sentinelHelp$ = new ReplaySubject<string>(1);
  informacionDataCredito$ = new ReplaySubject<DataCredito>(1);
  private _subscriptionsFicha$: Subscription = new Subscription();

  monedaCliente: string = null;
  rowActual: any;
  datosDeuda: any;
  datosDeudaVencida: any;
  flagConsultaCR: boolean = false;
  flagPeru: boolean = false;

  // Grids Semaforo Financiero0
  sentinelAlumno: IDatosSentinelAlumno;
  edadClienteSentinel: string = '';
  // Grids Semaforo Financiero
  gridCreditos: KendoGrid = new KendoGrid();
  gridDeudas: KendoGrid = new KendoGrid();
  gridDeudasVencidas: KendoGrid = new KendoGrid();
  nroDocumento: string = '';

  ngOnInit(): void {
    this.initSubscribeObservables();
    this.flagPeru = true;
  }

  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
  }

  private initSubscribeObservables() {
    let sub1$ = this.integraService.getJsonResponse(
      `${constApiComercial.ObtenerDatosAlumnoSemaforoChatWhatsApp}/${this.idAlumno}`
    ).subscribe(
      (resp) => {
        if (resp != null) {
          this.calcularEdadClienteSentinel(resp.body.alumno.fechaNacimiento);
          if(resp.body.alumno.idCodigoPais!=null){
            if(!this.flagPeru)
            {
              this.btnConsultar$.next({
                disabled: true,
                text: 'No Aplica',
                class: 'btn-secondary',
                color: 'secondary',
              });
            }
          }
        }
      }
    );
    let sub2$ = this.integraService.getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerDatoSentinelAlumno}/${this.idAlumno}`
    ).subscribe(
        (resp) => {
          if (resp.body != null) {
            resp.body.sentinelValidado = true
          }
          else{
            resp.body.sentinelValidado = false
          }
          const data = resp.body;
          if (data != null) {
            this.flagConsultaCR=true;
            this.cargarSemaforoFinanciero(data);
          }
          else{
            this.flagConsultaCR=false;
            this.validarPaisAlumno(this.idAlumno);
          }
        }
      );
    this._subscriptions$.add(sub1$);
    this._subscriptions$.add(sub2$);
  }

  private cargarSemaforoFinanciero(resp: IDatosSentinelAlumno) {
    this.sentinelAlumno = resp;
    this.configurarSentinel(resp);
    this.cargarDatosSentinelAlumno(resp);
    this.cargarGridCreditos(resp.lineaCredito);
    this.cargarGridDeudas(resp.lineaDeuda);
    this.cargarGridDeudasVencidas(resp.lineaDeudaVencida);
    this.cargarCabeceraSemaforo();
    this.gridDeudasVencidas.data = resp.lineaDeuda.filter((e) => e.diasVencidos > 0);
    this.cargarGridDeudas(resp.lineaDeuda);
    this.showSentinelHelp$.next(true);
  }

  private configurarSentinel(resp: IDatosSentinelAlumno) {
    this.sentinelAlumno = resp;
    const fechaProximaConsulta = new Date(resp.fechaUltimaActualizacion);
    fechaProximaConsulta.setMonth(fechaProximaConsulta.getMonth() + 6);
    if (fechaProximaConsulta <= getDate(new Date())) {
      this.btnConsultar$.next({
        disabled: false,
        text: 'Consultar',
        class: 'btn-primary',
        color: 'success',
      });
    } else {
      this.btnConsultar$.next({
        disabled: true,
        text: 'Consultar',
        class: 'btn-warning',
        color: 'warning',
      });
    }
    this.showSentinelHelp$.next(true);
    this.btnVerDetalleSentinel$.next({
      show: true,
    });
    this.sentinelHelp$.next(
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
    let sub$ = this.integraService.getJsonResponse(`${constApiComercial.AgendaInformacionActividadObtenerSemaforoSentinelAlumno}/${this.idAlumno}`)
      .subscribe({
        next: (resp) => {
          if (resp.body != null) {
            this.cabeceraSemaforoFinanciero.color = resp.body.color;
            this.cabeceraSemaforoFinanciero.mensaje = resp.body.mensaje;
            if (
              this.cabeceraSemaforoFinanciero.color == null ||
              this.cabeceraSemaforoFinanciero.mensaje == null
            ) {
              this.cabeceraSemaforoFinanciero.color = '#ff0303';
              this.cabeceraSemaforoFinanciero.mensaje = 'Aún no se consultó';
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
    let sub$ = this.integraService.getJsonResponse(
      `${constApiGlobal.MonedaObtenerCodigoMonedaPorIdAlumno}/${idAlumno}`
    )
      .subscribe({
        next: (response) => {
          this.monedaCliente = response.body.valor;
          if (response.body.valor == 'PEN') {
            this.cabeceraSemaforoFinanciero.color = '#808080';
            this.cabeceraSemaforoFinanciero.mensaje = 'Aún no se consultó';
          }
          if (response.body.valor == 'COL') {
            this.obtenerInformacionDataCredito();
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptions$.add(sub$);
  }

  private obtenerInformacionDataCredito() {
    let sub$ = this.integraService
      .getJsonResponse(
        `${constApiComercial.DataCreditoObtenerInformacionDataCredito}/${this.idAlumno}/${this.userService.userName}`
      )
      .subscribe({
        next: (resp: HttpResponse<DataCredito>) => {
          this.informacionDataCredito$.next(resp.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje)
        }
      });
    this._subscriptionsFicha$.add(sub$);
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
  
}