import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constApiComercial } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { IAgendaPreguntaFrecuente } from '../../models/interfaces/iagenda-pregunta-frecuente';
import { AgendaService } from './agenda.service';
import { IRowActual } from '@comercial/models/interfaces/iagenda';

@Injectable()
export class AgendaPreguntasFrecuentesService {
  constructor(private integraService: IntegraService) {}
  private _agendaService: AgendaService;
  private _subscriptions$: Subscription = new Subscription();
  private _subscriptionsFicha$: Subscription = new Subscription();
  private _rowActual: IRowActual;
  preguntasFrecuentes$ = new ReplaySubject<IAgendaPreguntaFrecuente>(1);

  async setAgendaService(agendaService: AgendaService) {
    this._agendaService = agendaService;
    await this.ready()
  }
  async ready() {}
  async resetService() {
    await this.resetFicha();
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = new Subscription();
  }
  async initFicha() {
    this._rowActual = this._agendaService.rowActual;
    this.iniciarPreguntasFrecuentes();
  }
  async resetFicha() {
    this._subscriptionsFicha$.unsubscribe();
    this._subscriptionsFicha$ = new Subscription();
    this.preguntasFrecuentes$ = new ReplaySubject<IAgendaPreguntaFrecuente>(1)
  }
  obtenerPreguntasFrecuentesCambio$(idPrograma: any) {
    return this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaActividadObtenerPreguntasFrecuentesCambio}/${this._rowActual.idCentroCosto}/${idPrograma}/${this._rowActual.idOportunidad}`
      )
  }
  iniciarPreguntasFrecuentes() {
    let sub$ = this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerPreguntasFrecuentes}/${this._rowActual.idCentroCosto}/${this._rowActual.idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<IAgendaPreguntaFrecuente>) => {
          if (response.body) {
            this.preguntasFrecuentes$.next(response.body);
          }
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
}
