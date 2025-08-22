import { Injectable } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { constApiComercial } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Subscription, ReplaySubject } from 'rxjs';
import { AgendaService } from './agenda.service';
import {
  DocumentoPrograma,
  IOportunidadPEspecificoAgenda,
} from '@comercial/models/interfaces/iagenda-documento-programa';
import { AlertaService } from '@shared/services/alerta.service';

/**
 * @description Agenda Documentos Programa Service
 * @author Comercial
 * @version 2.0.0
 * @history
 * *
 */
@Injectable()
export class AgendaDocumentosProgramaService {
  constructor(
    private integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}
  private _agendaService: AgendaService;
  private _subscriptions$: Subscription = new Subscription();
  private _subscriptionsFicha$: Subscription = new Subscription();
  oportunidadPEspecifico$ = new ReplaySubject<IOportunidadPEspecificoAgenda>(1);
  documentosPrograma$ = new ReplaySubject<DocumentoPrograma>(1);
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
    this.iniciarProgramaDocumentos(this._agendaService.rowActual.id);
  }
  async resetFicha() {
    this._subscriptionsFicha$.unsubscribe();
    this._subscriptionsFicha$ = new Subscription();
    this.oportunidadPEspecifico$ =
      new ReplaySubject<IOportunidadPEspecificoAgenda>(1);
    this.documentosPrograma$ = new ReplaySubject<DocumentoPrograma>(1);
  }
  private iniciarProgramaDocumentos(idActividadDetalle: number) {
    let sub1$ = this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerOportunidadYPEspecificoPorIdActividadDetalle}/${idActividadDetalle}`
      )
      .subscribe({
        next: (response: HttpResponse<IOportunidadPEspecificoAgenda>) => {
          this.oportunidadPEspecifico$.next(response.body);
          this._agendaService.agendaAlumnoService.cargarDatosCompletosAlumno();
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this.obtenerDocumentosPorIdActividadDetalle(idActividadDetalle);
    this._subscriptionsFicha$.add(sub1$);
  }
  obtenerDocumentosPorIdActividadDetalle(idActividadDetalle: number) {
    let sub2$ = this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerDocumentosPorIdActividadDetalle}/${idActividadDetalle}`
      )
      .subscribe({
        next: (response: HttpResponse<DocumentoPrograma>) => {
          this.documentosPrograma$.next(response.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptionsFicha$.add(sub2$);
  }
}
