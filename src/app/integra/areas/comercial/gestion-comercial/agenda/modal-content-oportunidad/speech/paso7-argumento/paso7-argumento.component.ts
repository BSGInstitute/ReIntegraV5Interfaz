import { Component, Input, OnInit } from '@angular/core';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-paso7-argumento',
  templateUrl: './paso7-argumento.component.html',
  styleUrls: ['./paso7-argumento.component.scss']
})
export class Paso7ArgumentoComponent implements OnInit {
  @Input() agendaService: AgendaService;
  gridPresentacionArgumentoCliente: KendoGrid = new KendoGrid();
  private _subscriptions$: Subscription = new Subscription();
  constructor(private _alertaService: AlertaService) {}


  ngOnInit(): void {
    this.agendaService.agendaModalService.dataGridPresentacionArgumentoCliente$.next([])
    this.initSubscribeObservables();
  }

  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = null;
  }

  get dataGridPresentacionArgumentoCliente$() {
    return this.agendaService.agendaModalService.dataGridPresentacionArgumentoCliente$;
  }
  initSubscribeObservables() {
    this.gridPresentacionArgumentoCliente.loading = true;

    let sub$ =
      this.agendaService.agendaModalService.dataPresentacionArgumentoCliente$.subscribe(
        (resp) => {
          if (resp != null) {
            
            this.gridPresentacionArgumentoCliente.data = resp;
            this.agendaService.agendaModalService.dataGridPresentacionArgumentoCliente$.next(
              resp
            );
            this.gridPresentacionArgumentoCliente.loading = false;
          }
        }
      );
      this._subscriptions$.add(sub$);
  }



}
