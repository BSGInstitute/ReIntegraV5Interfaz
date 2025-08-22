import { Injectable } from '@angular/core';
import { AgendaService } from './agenda.service';
import { ReplaySubject, BehaviorSubject, Subscription, Observable } from 'rxjs';
import { IntegraService } from '@shared/services/integra.service';
import { constApiComercial } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import {
  EliminarCronogramaRespuesta,
  ICodigoMatriculaPespecifico,
  ICronograPagoEnvio,
  ICronogramaPago,
  ICronogramaPagoRespuesta,
  IEnvioSms,
  IMetodoPagoMatricula,
  IMontoPagoCronograma,
  IPasarelaPago,
  ITextoBeneficios,
} from '@comercial/models/interfaces/iagenda-cronograma-pago';
import { AlertaService } from '@shared/services/alerta.service';

@Injectable()
export class AgendaCronogramaPagoService {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService
  ) {}
  private _agendaService: AgendaService;
  private _subscriptions$: Subscription = new Subscription();
  private _subscriptionsFicha$: Subscription = new Subscription();
  oportunidadCronogramaPago$ = new ReplaySubject<ICronogramaPago>(1);
  cronogramaAprobado$ = new BehaviorSubject<boolean>(false);
  private _rowActual: IRowActual;
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
    this._rowActual = this._agendaService.rowActual;
    this.cargarCronogramaPagos(this._rowActual.idOportunidad);
  }
  async resetFicha() {
    this._subscriptionsFicha$.unsubscribe();
    this._subscriptionsFicha$ = new Subscription();
    this.oportunidadCronogramaPago$ = new ReplaySubject<ICronogramaPago>(1);
    this.cronogramaAprobado$ = new BehaviorSubject<boolean>(false);
  }
  /**
   * @description Obtiene una lista del medio de pago
   * @param {number} idOportunidad
   */
  cargarCronogramaPagos(idOportunidad: number) {
    let sub$ = this.integraService
      .getJsonResponse(
        `${constApiComercial.MontoPagoCronogramaObtenerOportunidadCronogramaPago}/${idOportunidad}/${this._agendaService.tipoPersonal}`
      )
      .subscribe({
        next: (response: HttpResponse<ICronogramaPago>) => {
          this.oportunidadCronogramaPago$.next(response.body);
          if (response.body.cronograma.esAprobado == true) {
            this.cronogramaAprobado$.next(true);
          } else {
            this.cronogramaAprobado$.next(false);
          }
        },
        error: (error) => {
          let mensaje = this.alertaService.getErrorResponse(error).mensaje;
          this.alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  obtenerOportunidadCronogramaPago$(
    idOportunidad: number
  ): Observable<HttpResponse<ICronogramaPago>> {
    return this.integraService.getJsonResponse(
      `${constApiComercial.MontoPagoCronogramaObtenerOportunidadCronogramaPago}/${idOportunidad}/${this._agendaService.tipoPersonal}`
    );
  }
  /**
   * @description Obtiene una lista del medio de pago
   * @param {number} idAlumno
   * @returns {Observable<HttpResponse<IPasarelaPago[]>>}
   */
  cargarMedioPago$(
    idAlumno: number
  ): Observable<HttpResponse<IPasarelaPago[]>> {
    return this.integraService.getJsonResponse(
      `${constApiComercial.PasarelaPagoPwObtenerPasarelaPagoPorIdAlumno}/${idAlumno}`
    );
  }
  /**
   * @description Obtiene matricula por alumno costo
   * @param {number} idAlumno
   * @param {number} idCentroCosto
   * @returns {Observable<HttpResponse<number>>}
   */
  obtenerMatriculaPorAlumnoCosto$(
    idAlumno: number,
    idCentroCosto: number
  ): Observable<HttpResponse<number>> {
    return this.integraService.getJsonResponse(
      `${constApiComercial.MatriculaCabeceraObtenerIdMatriculaPorAlumnoCentroCosto}/${idAlumno}/${idCentroCosto}`
    );
  }
  /**
   * @description Obtiene pago por IdMatriculaCabecera
   * @param {number} idMatriculaCabecera
   * @returns {Observable<HttpResponse<IMetodoPagoMatricula>>}
   */
  obtenerMetodoPagoPorIdMatriculaCabecera$(
    idMatriculaCabecera: number
  ): Observable<HttpResponse<IMetodoPagoMatricula>> {
    return this.integraService.getJsonResponse(
      `${constApiComercial.MedioPagoMatriculaCronogramaObtenerMedioPagoPorIdMatricula}/${idMatriculaCabecera}`
    );
  }
  /**
   * @description Obtiene el detalle del monto pago
   * @param {number} idMontoPago
   * @returns {Observable<HttpResponse<ITextoBeneficios[]>>}
   */
  obtenerDetalleMontoPago$(
    idMontoPago: number
  ): Observable<HttpResponse<ITextoBeneficios[]>> {
    return this.integraService.getJsonResponse(
      `${constApiComercial.MontoPagoCronogramaObtenerDetalleMontoPago}/${idMontoPago}`
    );
  }
  /**
   * @description Guarda cronograma de pago
   * @param {number} idOportunidad
   * @param {number} idAlumno
   * @param {IMontoPagoCronograma} cronograma
   * @returns {Observable<HttpResponse<ICronogramaPagoRespuesta>>}
   */
  guardarCronogramaPago$(
    idOportunidad: number,
    idAlumno: number,
    cronograma: IMontoPagoCronograma
  ): Observable<HttpResponse<ICronogramaPagoRespuesta>> {
    return this.integraService.postJsonResponse(
      `${constApiComercial.MontoPagoCronogramaGuardarCronogramaVentas}/${idOportunidad}/${idAlumno}`,
      JSON.stringify(cronograma)
    );
  }
  /**
   * @description Congela el cronograma de pago del alumno
   * @param {number} idCronograma
   * @param {string} usuario
   * @returns {Observable<HttpResponse<ICodigoMatriculaPespecifico>>}
   */
  congelarCronogramaAlumno$(
    idCronograma: number,
    usuario: string
  ): Observable<HttpResponse<ICodigoMatriculaPespecifico>> {
    return this.integraService.postJsonResponse(
      `${constApiComercial.MontoPagoCronogramaCongelarCronogramaAlumno}/${idCronograma}/${usuario}`,
      null
    );
  }
  /**
   * @description Creacion del objeto oportunidad finalizar
   * @param {int} idAlumno
   * @param {int} idAlumno
   * @returns {IDatoOportunidad} Datos de la oportunidad
   */
  eliminarCronogramaVentas$(
    idAlumno: number,
    cronograma: ICronograPagoEnvio
  ): Observable<HttpResponse<EliminarCronogramaRespuesta>> {
    return this.integraService.postJsonResponse(
      `${constApiComercial.MontoPagoCronogramaEliminarCronogramaVentas}/${idAlumno}`,
      JSON.stringify(cronograma)
    );
  }
  actualizarMedioPago$(
    data: IMetodoPagoMatricula
  ): Observable<HttpResponse<boolean>> {
    return this.integraService.postJsonResponse(
      constApiComercial.PasarelaPagoPWRegistroMedioPagoMatriculaCronograma,
      JSON.stringify(data)
    );
  }
  enviarMensajeTexto$(data: IEnvioSms) {
    return this.integraService.postJsonResponse(
      constApiComercial.AgendaInformacionActividadEnviarMensajeTexto,
      JSON.stringify(data)
    );
  }
}
