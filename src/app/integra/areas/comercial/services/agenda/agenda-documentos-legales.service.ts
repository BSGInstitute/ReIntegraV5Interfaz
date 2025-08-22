import { ReplaySubject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { constApiComercial } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { AgendaService } from './agenda.service';
import { AlertaService } from '@shared/services/alerta.service';
import { IAgendaDocumentoLegal } from '@comercial/models/interfaces/iagenda-documento-legal';

@Injectable()
export class AgendaDocumentosLegalesService {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService
  ) {}

  private _agendaService: AgendaService;
  private _subscriptions$: Subscription = new Subscription();
  private _subscriptionsFicha$: Subscription = new Subscription();
  documentoLegal$ = new ReplaySubject<IAgendaDocumentoLegal[]>(1);
  rowActual: any;
  async setAgendaService(agendaService: AgendaService) {
    this._agendaService = agendaService;
    await this.ready();
  }
  async ready() {}
  async initFicha() {
    this.rowActual = this._agendaService.rowActual;
    this.obtenerDocumentosLegales(8, this.rowActual.idAlumno);
  }
  async resetService() {
    await this.resetFicha();
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = new Subscription();
  }
  async resetFicha() {
    this._subscriptionsFicha$.unsubscribe();
    this._subscriptionsFicha$ = new Subscription();
    this.documentoLegal$ = new ReplaySubject<IAgendaDocumentoLegal[]>(1);
  }
  obtenerDocumentosLegales(idAreaPersonal: number, idAlumno: number) {
    const tipoPersonal = this._agendaService.tipoPersonal;
    let sub$ = this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerDocumentoLegal}/${idAreaPersonal}/${tipoPersonal}/${idAlumno}`
      )
      .subscribe({
        next: (response: HttpResponse<IAgendaDocumentoLegal[]>) => {
          this.documentoLegal$.next(response.body);
        },
        error: (error) => {
          let mensaje = this.alertaService.getErrorResponse(error).mensaje;
          this.alertaService.notificationWarning(mensaje);
          this.documentoLegal$.error(error);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
}
