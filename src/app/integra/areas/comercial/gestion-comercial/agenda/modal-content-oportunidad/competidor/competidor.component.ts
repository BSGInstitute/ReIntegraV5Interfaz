import { Subscription } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { KendoGrid } from '@shared/models/kendo-grid';

@Component({
  selector: 'app-competidor',
  templateUrl: './competidor.component.html',
  styleUrls: ['./competidor.component.scss'],
})
export class CompetidorComponent implements OnInit {
  @Input() agendaService: AgendaService;
  gridCompetidoresPantalla: KendoGrid = new KendoGrid();
  private _subscriptions$: Subscription = new Subscription();
  constructor() {}
  ngOnInit(): void {
    this.initSubscribeObservables();
  }
  ngOnDestroy(){
    this._subscriptions$.unsubscribe;
    this._subscriptions$ = null;
    this.gridCompetidoresPantalla = null;
  }
  initSubscribeObservables() {
    let sub$ = this.agendaService.agendaModalService.competidorPorIdOportunidad$.subscribe({
      next: (resp) => {
        if(resp != null){
          this.gridCompetidoresPantalla.data = resp
        }
      }
    })
    this._subscriptions$.add(sub$)
  }
}
