import { Injectable } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { AgendaOperacionesService } from './agenda-operaciones.service';

@Injectable()
export class AgendaCursoMatriculadoOperacionesService {

  constructor(private integraService: IntegraService) { }

  private agendaService: AgendaOperacionesService;

  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }
  ready() {}
  async initFicha(){}
  async resetFicha(){}
}
