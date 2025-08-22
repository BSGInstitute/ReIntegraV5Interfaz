import { Injectable } from '@angular/core';
import { AgendaService } from './agenda.service';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { ActividadMarcadorLog } from '@comercial/models/interfaces/iagenda-activad';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { constApiComercial } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';

/**
 * @description Agenda Alumno Service
 * @author Flavio R. Mamani Fabian
 * @version 1.0.1
 * @history
 * *
 */
@Injectable()
export class AgendaMarcadorService {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}

  private _agendaService: AgendaService;
  actividadMarcador$ = new ReplaySubject<ActividadMarcadorLog>(1);

  private _rowActual: IRowActual;
  private _subscriptions$: Subscription = new Subscription();
  private _subscriptionsFicha$: Subscription = new Subscription();

  async setAgendaService(agendaService: AgendaService) {
    this._agendaService = agendaService;
    await this.ready();
  }
  async ready() {}
  async initFicha() {
    this._rowActual = this._agendaService.rowActual;
    if(this._agendaService.esRowActualMarcador != true){
      this.obtenerActividaMarcador();
      // this.obtenerActividadMarcadorLog();
    }
  }
  async resetFicha() {
    this.actividadMarcador$ = new ReplaySubject<ActividadMarcadorLog>(1);
  }
  async resetService() {}

  obtenerActividadMarcadorLog() {
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiComercial.ActividadMarcadorLogObtenerPorIdActividadDetalleIdOportunidad}/${this._rowActual.id}/${this._rowActual.idOportunidad}`
      )
      .subscribe({
        next: (resp: HttpResponse<ActividadMarcadorLog>) => {
          if (resp.body != null && resp.body.id != 0) {
            this.actividadMarcador$.next(resp.body);
            if (this._agendaService.esRowActualMarcador != true) {
              this._rowActual.totalIntento = resp.body.totalIntento;
              this._rowActual.fechaProgramadaMarcador = new Date(
                resp.body.fechaProgramada
              );
              this._rowActual.contestado = resp.body.contestado;
              this._rowActual.noContestado = resp.body.noContestado;
              this._rowActual.idAgendaTabMarcador = resp.body.idAgendaTab;
            }
          } else {
            let dataTemp: ActividadMarcadorLog = {
              id: 0,
              idOportunidad: this._rowActual.idOportunidad,
              idActividadDetalle: this._rowActual.id,
              fechaProgramada: null,
              totalIntento: this._rowActual.totalIntento ?? 0,
              noContestado: this._rowActual.noContestado ?? 0,
              contestado: this._rowActual.contestado ?? 0,
              idAgendaTab: this._agendaService.tabActual.idTab,
            };
            if (this._agendaService.esRowActualMarcador != true) {
              // this._rowActual.totalIntento = dataTemp.totalIntento;
              // this._rowActual.fechaProgramadaMarcador = new Date(
              //   dataTemp.fechaProgramada
              // );
              // this._rowActual.contestado = dataTemp.contestado;
              // this._rowActual.noContestado = dataTemp.noContestado;
              // this._rowActual.idAgendaTabMarcador = dataTemp.idAgendaTab;
            }
            this.actividadMarcador$.next(dataTemp);
          }
        },
        error: (error) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  guardarActividadMarcadorLog$(jsonEnvio: ActividadMarcadorLog) {
    return this._integraService.postJsonResponse(
      `${constApiComercial.ActividadMarcadorLogGuardarActividadMarcadorLog}/${this._agendaService.userName}`,
      JSON.stringify(jsonEnvio)
    );
  }
  obtenerActividaMarcador() {
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiComercial.MarcadorObtenerActividadMarcadorPorIdActividadDetalle}/${this._rowActual.id}/${this._rowActual.idOportunidad}`
      )
      .subscribe({
        next: (resp: HttpResponse<ActividadMarcadorLog>) => {
          if (resp.body != null && resp.body.id != 0) {
            this.actividadMarcador$.next(resp.body);
          } else {
            let dataTemp: ActividadMarcadorLog = {
              id: 0,
              idOportunidad: this._rowActual.idOportunidad,
              idActividadDetalle: this._rowActual.id,
              fechaProgramada: this._rowActual.ultimaFechaProgramada,
              totalIntento: this._rowActual.totalIntento ?? 0,
              noContestado: this._rowActual.noContestado ?? 0,
              contestado: this._rowActual.contestado ?? 0,
              idAgendaTab: this._agendaService.tabActual.idTab,
            };
            if (this._agendaService.esRowActualMarcador != true) {
              this._rowActual.totalIntento = dataTemp.totalIntento;
              if(dataTemp.fechaProgramada != null){
                this._rowActual.fechaProgramadaMarcador = new Date(
                  dataTemp.fechaProgramada
                );
              }
              this._rowActual.contestado = dataTemp.contestado;
              this._rowActual.noContestado = dataTemp.noContestado;
              this._rowActual.idAgendaTabMarcador = dataTemp.idAgendaTab;
            }
            this.actividadMarcador$.next(dataTemp);
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
}
