import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { AgendaOperacionesService } from './agenda-operaciones.service';

@Injectable()
export class AgendaControlPantallaOperacionesService {

  constructor(private integraService: IntegraService, private modalService: NgbModal) { }

  private agendaService: AgendaOperacionesService;

  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }
  ready() {}

  async cerrarModalProgramarActividades() {
    await this.agendaService.resetFichas();
    this.modalService.dismissAll();
    // this.agendaService.agendaProgramacionActividadesService.modalProgramarActividadRef.close('submitted')
    // this.agendaService.agendaProgramacionActividadesService.modalProgramarActividadRef.close('submitted')
    // ProgramarActividadModule.closeModalForm();
    //     ProgramarActividadModule.closeModal();
    //     ProgramarActividadModule.destroyCierrePantallaDos();
    //     _closeModalPantalla2();
  }


  async initFicha(){}
  async resetFicha(){}

  closeModalPantalla2(){
    console.log("faltaimplementar")

    //falta implementar
  }
}
