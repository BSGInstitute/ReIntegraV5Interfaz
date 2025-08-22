import { Subscription } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { KendoGrid } from '@shared/models/kendo-grid';

@Component({
  selector: 'app-historial-oportunidad',
  templateUrl: './historial-oportunidad.component.html',
  styleUrls: ['./historial-oportunidad.component.scss'],
})
export class HistorialOportunidadComponent implements OnInit {
  @Input() agendaService: AgendaService;
  gridHistorialOportunidades: KendoGrid = new KendoGrid();
  private _subscriptions$: Subscription = new Subscription();
  constructor() {}

  ngOnInit(): void {
    this.gridHistorialOportunidades.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.initSubscribeObservables();
  }
  private initSubscribeObservables() {
    this.gridHistorialOportunidades.loading = true;
    let sub$ = this.agendaService.agendaInformacionActividadOportunidadService.historialOportunidades$.subscribe(
      {
        next: (resp) => {
          this.gridHistorialOportunidades.data = resp;
          this.gridHistorialOportunidades.loading = false;
        },
      }
    );
    this._subscriptions$.add(sub$)
  }
}
