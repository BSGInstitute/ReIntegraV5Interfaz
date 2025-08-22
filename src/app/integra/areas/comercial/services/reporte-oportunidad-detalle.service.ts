import { Injectable } from '@angular/core';
import { AgendaService } from './agenda/agenda.service';

@Injectable()
export class ReporteOportunidadDetalleService {

  constructor() { }

  private agendaService: AgendaService
  async setAgendaService(agendaService: AgendaService){
    this.agendaService = agendaService
    await this.ready();
  }
  async resetFicha(){}
  async initFicha(){
    this.resetFicha();
  }

  async resetService() {
    await this.resetFicha();
  }
  async ready() {}
}
