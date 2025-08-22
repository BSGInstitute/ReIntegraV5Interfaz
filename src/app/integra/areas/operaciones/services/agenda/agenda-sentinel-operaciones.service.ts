import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDatosSentinelAlumno } from '@comercial/models/interfaces/isemaforo-financiero';
import { constApiComercial, constApiGlobal } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { BehaviorSubject, ReplaySubject, Subject, Observable } from 'rxjs';
import { AgendaOperacionesService } from './agenda-operaciones.service';
import { ISentinelEstado } from '@comercial/models/interfaces/iagenda-sentinel';

@Injectable()
export class AgendaSentinelOperacionesService {
  constructor(private integraService: IntegraService) {}

  private agendaService: AgendaOperacionesService;

  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }
  paisGlobal = 'PE';
  cabeceraSemaforoFinanciero = '';
  colorCabecera = '';
  listaCredito$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  sentinelAlumno$: ReplaySubject<IDatosSentinelAlumno> = new ReplaySubject<IDatosSentinelAlumno>(1);
  informacionDataCredito$: Subject<any> = new Subject<any>();
  listaDeudas$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  listasDeudasVencidas$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  monedaAlumno$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  edad$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  showSentinelHelp$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  sentinelHelp$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  btnConsultar$: BehaviorSubject<any> = new BehaviorSubject<any>({
    disabled: false,
    show: false,
    class: 'btn-success',
    text: 'Consultar',
    color: 'success'
  });
  btnVerDetalleSentinel$: BehaviorSubject<any> = new BehaviorSubject<any>({
    disabled: false,
    show: false,
  });

  resetSentinel$ = new ReplaySubject<boolean>();

  datosTarjeta: boolean = false;
  datosDeuda: boolean = false;
  datosDeudaVencida: boolean = false;
  datosSemaforo: string;
  rowActual: any;

  async initFicha() {
    this.paisGlobal = 'PE';
    this.rowActual = this.agendaService.rowActual;
    this.iniciarSentinel();
  }

  async resetFicha() {
    this.listaCredito$ = new BehaviorSubject<any>(null);
    this.sentinelAlumno$ = new ReplaySubject<any>(1);
    this.informacionDataCredito$ = new Subject<any>();
    this.listaDeudas$ = new BehaviorSubject<any>(null);
    this.listasDeudasVencidas$ = new BehaviorSubject<any>(null);
    this.monedaAlumno$ = new BehaviorSubject<any>(null);
    this.edad$ = new BehaviorSubject<any>(null);

    this.showSentinelHelp$ = new BehaviorSubject<boolean>(false);
    this.sentinelHelp$ = new BehaviorSubject<string>('');
    this.btnConsultar$ = new BehaviorSubject<any>({
      disabled: false,
      show: false,
      text: 'Consultar',
      color: 'success'
    });
    this.btnVerDetalleSentinel$ = new BehaviorSubject<any>({
      disabled: false,
      show: false,
    });
  }

  ready() {}

  obtenerDetalleSentinel$(idSentinel: any) {
    // http://localhost:63048/api/Sentinel/GetDetalleSentinel/' + DatosSentinel.IdSentinel
    return this.integraService.getJsonResponse(
      `${constApiComercial.SentinelObtenerDetalleSentinel}/${idSentinel}`
    );
  }

  actualizarSentinelAlumno$(dni: string, idAlumno: number): Observable<HttpResponse<ISentinelEstado>> {
    // http://localhost:63048/api/AgendaInformacionActividad/ActualizarSentinelAlumno/
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadActualizarSentinelAlumno}/${dni}/${idAlumno}/${this.agendaService.userName}`
    );
  }

  actualizarInformacionDataCredito(CampoDni: any, IdAlumno: any) {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.DataCreditoActualizarInformacionDataCredito}/${CampoDni}/${IdAlumno}/${this.agendaService.userName}`
      )
      .subscribe({
        next: (response: any) => {
          this.informacionDataCredito$.next(response);
        },
      });
  }

  iniciarSentinel() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerDatoSentinelAlumno}/${this.rowActual.idAlumno}`
      )
      .subscribe({
        next: (response: HttpResponse<IDatosSentinelAlumno>) => {
          console.log('responseFINAl', response);
          this.sentinelAlumno$.next(response.body);
        },
      });
  }

  resetSentinel(){
    this.resetSentinel$.next(true)
  }

  obtenerInformacionDataCredito$(idAlumno: number) {
    return this.integraService.getJsonResponse(
      `${constApiComercial.DataCreditoObtenerInformacionDataCredito}/${idAlumno}/${this.agendaService.userName}`
    );
  }

  obtenerSemaforoSentinelAlumno$(IdAlumno: any) {
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerSemaforoSentinelAlumno}/${IdAlumno}`
    );
  }

  recargarDatosSentinel$(idAlumno: number) {
    // url: 'http://localhost:63048/api/AgendaInformacionActividad/ObtenerDatoSentinelAlumno/'
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerDatoSentinelAlumno}/${idAlumno}`
    );
  }

  obtenerCodigoMonedaPorIdAlumno$(idAlumno: any) {
    return this.integraService.getJsonResponse(
      `${constApiGlobal.MonedaObtenerCodigoMonedaPorIdAlumno}/${idAlumno}`
    );
  }
}
