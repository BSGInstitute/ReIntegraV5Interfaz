import { Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { AgendaService } from './agenda.service';

@Injectable()
export class AgendaProblemaClienteService {
  constructor() {}
  private _agendaService: AgendaService;
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
  }
  async resetFicha() {
    this._subscriptionsFicha$.unsubscribe();
    this._subscriptionsFicha$ = new Subscription();
  }
}
