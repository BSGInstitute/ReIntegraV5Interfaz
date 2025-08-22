import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { constApiComercial, constApiGlobal } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { ReplaySubject, Subscription, Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { IDatosSentinelAlumno, ISemaforoSentinelAlumno } from '../../models/interfaces/isemaforo-financiero';
import { AgendaService } from './agenda.service';
import { DataCredito } from '@comercial/models/interfaces/iagenda-sentinel';
import { AlertaService } from '@shared/services/alerta.service';

@Injectable()
export class AgendaSentinelService {
  constructor(private integraService: IntegraService, private _alertaService: AlertaService) {}
  private _agendaService: AgendaService;
  paisGlobal = 'PE';
  colorCabecera = '';
  sentinelAlumno$ = new ReplaySubject<IDatosSentinelAlumno>(1);
  informacionDataCredito$ = new ReplaySubject<DataCredito>(1);
  showSentinelHelp$ = new BehaviorSubject<boolean>(false);
  sentinelHelp$ = new ReplaySubject<string>(1);
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
  resetSentinel$ = new Subject<boolean>();
  private _rowActual: IRowActual;
  private _subscriptions$: Subscription = new Subscription();
  private _subscriptionsFicha$: Subscription = new Subscription();
  async setAgendaService(agendaService: AgendaService) {
    this._agendaService = agendaService;
    await this.ready();
  }
  async ready() {}
  async resetService() {
    await this.resetFicha();
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = new Subscription();
  }
  async initFicha() {
    this.paisGlobal = 'PE';
    this._rowActual = this._agendaService.rowActual;
    this.iniciarSentinel();
  }
  async resetFicha() {
    this._subscriptionsFicha$.unsubscribe();
    this._subscriptionsFicha$ = new Subscription();
    this.paisGlobal = 'PE';
    this.colorCabecera = '';
    this.sentinelAlumno$ = new ReplaySubject<IDatosSentinelAlumno>(1);
    this.informacionDataCredito$ = new ReplaySubject<DataCredito>(1);
    this.showSentinelHelp$ = new BehaviorSubject<boolean>(false);
    this.sentinelHelp$ = new ReplaySubject<string>(1);
    this.btnConsultar$ = new BehaviorSubject<any>({
      disabled: false,
      show: false,
      class: 'btn-success',
      text: 'Consultar',
      color: 'success',
    });
    this.btnVerDetalleSentinel$ = new BehaviorSubject<any>({
      disabled: false,
      show: false,
    });
    this.resetSentinel$ = new Subject<boolean>();
  }
  resetSentinel() {
    this.resetSentinel$.next(true);
  }
  obtenerDetalleSentinel$(idSentinel: any) {
    return this.integraService.getJsonResponse(
      `${constApiComercial.SentinelObtenerDetalleSentinel}/${idSentinel}`
    );
  }
  actualizarSentinelAlumno$(CampoDni: any, IdAlumno: any) {
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadActualizarSentinelAlumno}/${CampoDni}/${IdAlumno}/${this._agendaService.userName}`
    );
  }
  actualizarInformacionDataCredito$(CampoDni: any, IdAlumno: any) {
    return this.integraService.getJsonResponse(
      `${constApiComercial.DataCreditoActualizarInformacionDataCredito}/${CampoDni}/${IdAlumno}/${this._agendaService.userName}`
    );
  }
  iniciarSentinel() {
    let sub$ = this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerDatoSentinelAlumno}/${this._rowActual.idAlumno}`
      )
      .subscribe({
        next: (response: HttpResponse<IDatosSentinelAlumno>) => {
          if(response.body != null){
            response.body.sentinelValidado = true
            this.sentinelAlumno$.next(response.body);
          }else{
            let item: IDatosSentinelAlumno = {
              sentinelValidado : false
            }
            this.sentinelAlumno$.next(item);
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje)
        }
      });
    this._subscriptionsFicha$.add(sub$);
  }
  obtenerInformacionDataCredito() {
    let sub$ = this.integraService
      .getJsonResponse(
        `${constApiComercial.DataCreditoObtenerInformacionDataCredito}/${this._rowActual.idAlumno}/${this._agendaService.userName}`
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
  obtenerSemaforoSentinelAlumno$(IdAlumno: any): Observable<HttpResponse<ISemaforoSentinelAlumno>> {
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerSemaforoSentinelAlumno}/${IdAlumno}`
    );
  }
  recargarDatosSentinel$(
    idAlumno: number
  ): Observable<HttpResponse<IDatosSentinelAlumno>> {
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerDatoSentinelAlumno}/${idAlumno}`
    );
  }
  recargarDataCredito$(): Observable<HttpResponse<IDatosSentinelAlumno>> {
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerDatoSentinelAlumno}/${this._rowActual.idAlumno}`
    );
  }
  obtenerCodigoMonedaPorIdAlumno$(idAlumno: number): Observable<
    HttpResponse<{
      valor: string;
    }>
  > {
    return this.integraService.getJsonResponse(
      `${constApiGlobal.MonedaObtenerCodigoMonedaPorIdAlumno}/${idAlumno}`
    );
  }
}
