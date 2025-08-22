import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgendaService } from './agenda.service';
import { CrmService } from '@shared/services/crm.service';
import { Subscription } from 'rxjs';
import { SharedService } from '@shared/services/shared.service';

@Injectable()
export class AgendaControlPantallaService {
  constructor(private modalService: NgbModal,
     private crmService: CrmService,
     private _sharedService: SharedService
     ) {}
  private _agendaService: AgendaService;
  private _subscriptionsFicha$: Subscription = new Subscription();
  
  async resetFicha() {
    this._subscriptionsFicha$.unsubscribe();
    this._subscriptionsFicha$ = new Subscription();
  }
  async ready() {
  }
  async setAgendaService(agendaService: AgendaService) {
    this._agendaService = agendaService;
    await this.ready();
  }
  async resetService() {
    await this.resetFicha();
  }
  async cerrarModalProgramarActividades() {
    this._agendaService.obtenerReporteControlActividadesAgenda(this._agendaService.idPersonalFiltroTemp);
    this._sharedService.removerComentarioTemporal();
    this._sharedService.comentarioActividad$.next('');
    this._sharedService.showComentarioFicha$.next(false);
    await this._agendaService.resetFichas();
    this.modalService.dismissAll(); 
    this.crmService.esFichaAbierta = false;
    this._agendaService.esFichaAbierta = false;
  }
  async initFicha() {
    let sub$ = this.crmService.cerrarFicha$.subscribe(resp => {
      if(resp == true){
        this.cerrarModalProgramarActividades()
      }
    })
    this._subscriptionsFicha$.add(sub$);
  }
}
