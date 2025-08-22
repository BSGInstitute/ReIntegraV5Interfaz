import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAgendaPreguntaFrecuente } from '@comercial/models/interfaces/iagenda-pregunta-frecuente';
import { constApiComercial, constApiGlobal } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { ReplaySubject } from 'rxjs';
import { AgendaOperacionesService } from './agenda-operaciones.service';

@Injectable()
export class AgendaPreguntasFrecuentesOperacionesService {
  //Agenda-PreguntasFrecuentes.js
  constructor(private integraService: IntegraService) {}

  private agendaService: AgendaOperacionesService;
  private rowActual: any;
  comboProgramaGeneral$: ReplaySubject<any> = new ReplaySubject<any>();
  preguntasFrecuentes$: ReplaySubject<IAgendaPreguntaFrecuente> = new ReplaySubject<IAgendaPreguntaFrecuente>();

  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }
  ready() {}
  async initFicha() {
    this.rowActual = this.agendaService.rowActual;
  }
  async resetFicha() {}

  obtenerComboProgramaGeneral() {
    this.integraService
      .getJsonResponse(`${constApiGlobal.ProgramaGeneralObtenerCombo}`)
      .subscribe({
        next: (resp: any) => {
          this.comboProgramaGeneral$.next(resp.body);
        },
      });
  }

  iniciarPreguntasFrecuentes() {
    // http://localhost:63048/api/AgendaInformacionActividad/ObtenerPreguntasFrecuentes
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerPreguntasFrecuentes}/${this.rowActual.idCentroCosto}/${this.rowActual.idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<IAgendaPreguntaFrecuente>) => {
          if (response.body) {
            this.preguntasFrecuentes$.next(response.body);
          }
        },
      });
  }
}
