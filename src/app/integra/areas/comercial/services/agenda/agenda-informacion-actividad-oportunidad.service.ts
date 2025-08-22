import { IHistorialOportunidad, IArgumentoMotivacionPrograma, IPlantillaWhatsApp, IRequisitosCertificacionPrograma, HistorialInteraccionOportunidad, IInformacionProgramaAgendaV2 } from './../../models/interfaces/iagenda-informacion-actividad-oportunidad';
import { IAlumnoInformacion } from '@integra/areas/comercial/models/interfaces/iagenda-datos-alumno';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constApiComercial } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { Subject, BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { AgendaService } from './agenda.service';
import {
  IAgendaConfiguracion,
  ICabeceraSpeech,
  IInformacionProgramaV1,
  IOportunidadInformacion,
  IOportunidadVentaCruzada,
  IPublicoObjetivoPrograma,
} from '@comercial/models/interfaces/iagenda-informacion-actividad-oportunidad';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { AlertaService } from '@shared/services/alerta.service';
@Injectable()
export class AgendaInformacionActividadOportunidadService {
  constructor(
    private integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}
  private _agendaService: AgendaService;
  private subscriptions: Subscription = new Subscription();
  private subscriptionsFicha: Subscription = new Subscription();
  private subscriptionsSpeech: Subscription = new Subscription();
  publicoObjetivoPrograma$: Subject<IPublicoObjetivoPrograma[]> = new Subject<
    IPublicoObjetivoPrograma[]
  >();
  cabeceraSpeech$: ReplaySubject<ICabeceraSpeech> = new ReplaySubject<ICabeceraSpeech>();
  oportunidadInformacion$: ReplaySubject<IOportunidadInformacion> =
    new ReplaySubject<IOportunidadInformacion>(1);
  ventaCruzadaOportunidad$: ReplaySubject<IOportunidadVentaCruzada[]> =
    new ReplaySubject<IOportunidadVentaCruzada[]>(1);
  historialOportunidades$: ReplaySubject<IHistorialOportunidad[]> =
    new ReplaySubject<IHistorialOportunidad[]>(1);
    plantillaWhatsApp$: ReplaySubject<IPlantillaWhatsApp[]> =
    new ReplaySubject<IPlantillaWhatsApp[]>(1);

  agendaConfiguraciones$: ReplaySubject<IAgendaConfiguracion> =
    new ReplaySubject<IAgendaConfiguracion>();
  informacionProgramaV1$: ReplaySubject<IInformacionProgramaV1> =
    new ReplaySubject<IInformacionProgramaV1>();
  informacionProgramaAgendaV2$: ReplaySubject<IInformacionProgramaAgendaV2> =
    new ReplaySubject<IInformacionProgramaAgendaV2>();
  historialInteraccionesPorIdOportunidad$ =
    new ReplaySubject<HistorialInteraccionOportunidad[]>(1);

  diasSinContactoOportunidad$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  requisitosCertificacionProgramaPorIdOportunidad$ = new ReplaySubject<IRequisitosCertificacionPrograma[]>(null);
  objetoWhatsApp: any = new Object();

  argumentoMotivacionPrograma$: ReplaySubject<IArgumentoMotivacionPrograma[]> = new ReplaySubject<IArgumentoMotivacionPrograma[]>();

  private alumno: IAlumnoInformacion;

  async setAgendaService(agendaService: AgendaService) {
    this._agendaService = agendaService;
    await this.ready();
  }
  async ready() {}
  async resetService() {
    await this.resetFicha();
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
  }
  private _idCentroCosto: number = 0;
  private _idOportunidad: number = 0;
  private _idAlumno: number = 0;
  private _idClasificacionPersona: number = 0;
  async initFicha() {
    this._idCentroCosto = this._agendaService.rowActual.idCentroCosto;
    this._idOportunidad = this._agendaService.rowActual.idOportunidad;
    this._idAlumno = this._agendaService.rowActual.idAlumno;
    this._idClasificacionPersona = this._agendaService.rowActual.idClasificacionPersona;
    this.configurarCertificacionGeneral();
    // this.cargarHistorialInteraccionesOportunidad();
    // *Se configura llamadas integra y 3cx
    this.cargarHistorialInteraccionesOportunidad3cx();
    this.obtenerPublicoObjetivoPrograma();
    this.configurarCabeceraSpeech();
    this.obtenerOportunidadInformacion();
    this.obtenerDiasSinContacto();
    this.obtenerArgumentosMotivacionPrograma();

  }
  async resetFicha() {
    this.subscriptionsFicha.unsubscribe();
    this.subscriptionsSpeech.unsubscribe();
    this.subscriptionsFicha = new Subscription();
    this.subscriptionsSpeech = new Subscription();
    this.publicoObjetivoPrograma$ = new ReplaySubject<
      IPublicoObjetivoPrograma[]
    >(1);
    this.cabeceraSpeech$ = new ReplaySubject<ICabeceraSpeech>(1);
    this.oportunidadInformacion$ = new ReplaySubject<IOportunidadInformacion>(
      1
    );
    this.ventaCruzadaOportunidad$ = new ReplaySubject<
      IOportunidadVentaCruzada[]
    >(1);
    this.historialOportunidades$ = new ReplaySubject<IHistorialOportunidad[]>(
      1
    );
    this.plantillaWhatsApp$ = new ReplaySubject<IPlantillaWhatsApp[]>(1);
    this.agendaConfiguraciones$ = new ReplaySubject<IAgendaConfiguracion>(1);
    this.informacionProgramaV1$ = new ReplaySubject<IInformacionProgramaV1>(1);
    this.informacionProgramaAgendaV2$ = new ReplaySubject<IInformacionProgramaAgendaV2>(1);
    this.historialInteraccionesPorIdOportunidad$ = new ReplaySubject<
      HistorialInteraccionOportunidad[]
    >(1);
    this.diasSinContactoOportunidad$ = new BehaviorSubject<number>(0);
    this.requisitosCertificacionProgramaPorIdOportunidad$ = new ReplaySubject<
      IRequisitosCertificacionPrograma[]
    >(1);
    this.objetoWhatsApp = {};
    this.argumentoMotivacionPrograma$ = new ReplaySubject<
      IArgumentoMotivacionPrograma[]
    >(1);
  }
  obtenerPlantillaWhatsApp$() {
    return this.integraService.getJsonResponse(
      constApiComercial.AgendaInformacionActividadObtenerPlantillaWhatsApp
    );
  }
  obtenerConfiguraciones() {
    let sub$ = this.integraService
      .obtenerTodo(constApiComercial.AgendaObtenerConfiguraciones)
      .subscribe({
        next: (response: HttpResponse<IAgendaConfiguracion>) => {
          this.agendaConfiguraciones$.next(response.body);
          this.obtenerInformacionProgramaAgendaV2();
          this.obtenerInformacionProgramaV1();
         
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this.subscriptionsFicha.add(sub$);
  }
  private obtenerInformacionProgramaV1() {
    let param = {
      idCentroCosto: String(this._idCentroCosto),
      codigoPais: String(
        this._agendaService.agendaAlumnoService.alumno$.value.idCodigoPais
      ),
      idMatriculaCabecera: '0',
      idOportunidad: '0',
    };
    let sub$ = this.integraService
      .obtenerPorFiltro(
        constApiComercial.AgendaInformacionActividadObtenerInformacionProgramav1,
        param
      )
      .subscribe({
        next: (response: HttpResponse<IInformacionProgramaV1>) => {
          this.informacionProgramaV1$.next(response.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this.subscriptionsFicha.add(sub$);
  }

  private obtenerInformacionProgramaAgendaV2() {
    let param = {
      idCentroCosto: String(this._idCentroCosto),
      codigoPais: String(
        this._agendaService.agendaAlumnoService.alumno$.value.idCodigoPais
      ),
      idMatriculaCabecera: '0',
      idOportunidad: '0',
    };
    let sub$ = this.integraService
      .obtenerPorFiltro(
        constApiComercial.AgendaInformacionActividadObtenerInformacionProgramaSpeech,
        param
      )
      .subscribe({
        next: (response: HttpResponse<IInformacionProgramaAgendaV2>) => {
          this.informacionProgramaAgendaV2$.next(response.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this.subscriptionsSpeech.add(sub$);
  }
  obtenerInformacionPrograma$(idPGeneral: string) {
    return this.integraService.postJsonResponse(
      constApiComercial.AgendaInformacionActividadObtenerInformacionPrograma,
      JSON.stringify({
        idPGeneral: idPGeneral,
        codigoPais: String(
          this._agendaService.agendaAlumnoService.alumno$.value.idCodigoPais
        ),
      })
    );  
  }
  obtenerInformacionProgramaSpeech$(idPGeneral: string) {
    return this.integraService.postJsonResponse(
      constApiComercial.AgendaInformacionActividadObtenerInformacionProgramaRefreshSpeech,
      JSON.stringify({
        idPGeneral: idPGeneral,
        codigoPais: String(
          this._agendaService.agendaAlumnoService.alumno$.value.idCodigoPais
        ),
      })
    );
  }
  obtenerOportunidadInformacion() {
    let sub$ = this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerOportunidadInformacion}/${this._idAlumno}/${this._idClasificacionPersona}`
      )
      .subscribe({
        next: (resp: HttpResponse<IOportunidadInformacion>) => {
          if (resp.body) {
            this.oportunidadInformacion$.next(resp.body);
            this.ventaCruzadaOportunidad$.next(resp.body.listaVentaCruzada);
            this.historialOportunidades$.next(resp.body.listaHistorial);
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this.subscriptionsFicha.add(sub$);
  }
  // private cargarHistorialInteraccionesOportunidad() {
  //   let sub$ = this.integraService
  //     .getJsonResponse(
  //       `${constApiComercial.AgendaActividadObtenerHistorialInteraccionesPorIdOportunidad}/${this.rowActual.idOportunidad}`
  //     )
  //     .subscribe({
  //       next: (response: HttpResponse<any>) => {
  //         if (response.body) {
  //           this.historialInteraccionesPorIdOportunidad$.next(response.body);
  //         }
  //       },
  //     });
  //   this.subscriptionsFicha.add(sub$);
  // }
  private cargarHistorialInteraccionesOportunidad3cx() {
    let sub$ = this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaActividadObtenerHistorialInteraccionesPorIdOportunidad3cx}/${this._idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<HistorialInteraccionOportunidad[]>) => {
          if (response.body) {
            this.historialInteraccionesPorIdOportunidad$.next(response.body);
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this.subscriptionsFicha.add(sub$);
  }
  setDataResumenProgramasByAreaV2(parametros: any) {
    return this.integraService.obtenerPorFiltro(
      constApiComercial.AgendaInformacionActividadObtenerResumenProgramasV2,
      parametros
    );
  }
  obtenerDiasSinContacto() {
    let sub$ = this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaActividadObtenerDiasSinContactoPorOportunidad}/${this._idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<{ id: number; valor: number }>) => {
          this.diasSinContactoOportunidad$.next(response.body.valor);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this.subscriptionsFicha.add(sub$);
  }
  private configurarCabeceraSpeech() {
    let sub$ = this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerCabeceraSpeech}/${this._idOportunidad}/${this._idCentroCosto}`
      )
      .subscribe({
        next: (response: HttpResponse<ICabeceraSpeech>) => {
          this.cabeceraSpeech$.next(response.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this.subscriptionsFicha.add(sub$);
  }
  private obtenerPublicoObjetivoPrograma() {
    let sub$ = this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerPublicoObjetivoPrograma}/${this._idCentroCosto}/${this._idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<IPublicoObjetivoPrograma[]>) => {
          this.publicoObjetivoPrograma$.next(response.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this.subscriptionsFicha.add(sub$);
  }
  private configurarCertificacionGeneral() {
    let sub$ = this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerRequisitosCertificacionProgramaPorIdOportunidad}/${this._idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<IRequisitosCertificacionPrograma[]>) => {
          this.requisitosCertificacionProgramaPorIdOportunidad$.next(
            response.body
          );
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this.subscriptionsFicha.add(sub$);
  }
  private obtenerArgumentosMotivacionPrograma() {
    let sub$ = this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerArgumentosMotivacionProgramaPorIdOportunidad}/${this._idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<IArgumentoMotivacionPrograma[]>) => {
          this.argumentoMotivacionPrograma$.next(response.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this.subscriptionsFicha.add(sub$);
  }
  actualizarFechaOcultarWhatsApp$(){
    return this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadActualizarFechaOcultarWhatsApp}/${this._agendaService.rowActual.id}/${this._agendaService.userName}`
      )
  }

}
