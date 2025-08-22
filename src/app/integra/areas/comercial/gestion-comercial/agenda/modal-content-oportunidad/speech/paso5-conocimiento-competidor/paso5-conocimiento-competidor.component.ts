import { Component, Input, OnInit } from '@angular/core';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { BehaviorSubject, Subscription, startWith } from 'rxjs';

@Component({
  selector: 'app-paso5-conocimiento-competidor',
  templateUrl: './paso5-conocimiento-competidor.component.html',
  styleUrls: ['./paso5-conocimiento-competidor.component.scss'],
})
export class Paso5ConocimientoCompetidorComponent implements OnInit {
  @Input() agendaService: AgendaService;
  competidoresFiltro: { id: number; nombre: string }[] = [];
  sourceCompetidores: { id: number; nombre: string }[] = [];
  virtual: any = {
    itemHeight: 28,
  };
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  private _subscriptions$: Subscription = new Subscription();
  constructor() {}
  ngOnInit(): void {
    this.agendaService.agendaModalService.checkCompetidorNO$.next(false);
    this.agendaService.agendaModalService.checkCompetidorSI$.next(false);
    this.agendaService.agendaModalService.competidor$.next([]);
    this.initSubscribeObservables();
  }
  ngOnDestroy(){
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = null
  }
  get checkCompetidorNO$() {
    return this.agendaService.agendaModalService.checkCompetidorNO$;
  }
  get checkCompetidorSI$() {
    return this.agendaService.agendaModalService.checkCompetidorSI$;
  }
  get competidor$() {
    return this.agendaService.agendaModalService.competidor$;
  }
  initSubscribeObservables() {
    let sub1$ = this.agendaService.agendaModalService.dataCompetidores$.subscribe(
      (resp) => {
        if (resp != null) {
          this.sourceCompetidores = resp;
          this.competidoresFiltro = resp;
        }
      }
    );
    let sub2$ = this.agendaService.agendaModalService.prerequisitosBeneficiosCompetidoresPorIdOportunidad$.subscribe(
      (resp) => {
        if (resp != null) {
          if (resp.oportunidadCompetidor != null) {
            if (resp.oportunidadCompetidor.respuesta === 1) {
              this.agendaService.agendaModalService.checkCompetidorSI$.next(
                true
              );
              this.agendaService.agendaModalService.checkCompetidorNO$.next(
                false
              );
            } else if (resp.oportunidadCompetidor.respuesta === 2) {
              this.agendaService.agendaModalService.checkCompetidorSI$.next(
                false
              );
              this.agendaService.agendaModalService.checkCompetidorNO$.next(
                true
              );
            }
          }
          if (resp.competidores.length > 0) {
            this.agendaService.agendaModalService.competidor$.next(
              resp.competidores.map((x) => x.id)
            );
          }else{
            this.agendaService.agendaModalService.competidor$.next([])
          }
        }
      }
    );
   this._subscriptions$.add(sub1$);
   this._subscriptions$.add(sub2$);
  }
}
