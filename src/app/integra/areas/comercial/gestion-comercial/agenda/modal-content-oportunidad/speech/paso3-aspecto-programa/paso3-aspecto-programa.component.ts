import { Component, Input, OnInit } from '@angular/core';
import { IBeneficioCompetidor } from '@comercial/models/interfaces/iagenda-modal';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { RowArgs } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-paso3-aspecto-programa',
  templateUrl: './paso3-aspecto-programa.component.html',
  styleUrls: ['./paso3-aspecto-programa.component.scss'],
})
export class Paso3AspectoProgramaComponent implements OnInit {
  @Input() agendaService: AgendaService;
  gridBeneficios: KendoGrid = new KendoGrid();
  private _subscriptions$: Subscription = new Subscription();
  constructor(private _alertaService: AlertaService) {}

  ngOnInit(): void {
    this.agendaService.agendaModalService.beneficioOportunidad$.next('');
    this.agendaService.agendaModalService.dataGridBeneficios$.next([])
    this.initSubscribeObservables();
    this.cargarGrid();
  }
  ngOnDestroy(){
    this.gridBeneficios = null;
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = null
  }
  private cargarGrid() {
    this.gridBeneficios.scrollable = 'none';
    this.gridBeneficios.isDetailExpanded = function (args: RowArgs) {
      return args.dataItem.checked;
    };
    this.gridBeneficios.kendoGridDetailTemplateShowIf = function (
      dataItem: IBeneficioCompetidor
    ) {
      return dataItem.checked;
    };
    this.gridBeneficios.resizable = true;
  }
  get beneficioOportunidad$(){
    return this.agendaService.agendaModalService.beneficioOportunidad$
  }
  get dataGridBeneficios$(){
    return this.agendaService.agendaModalService.dataGridBeneficios$;
  }
  private initSubscribeObservables() {
    this.gridBeneficios.loading = true;
    let sub$ = this.agendaService.agendaModalService.prerequisitosBeneficiosCompetidoresPorIdOportunidad$.subscribe(
      {
        next: (resp) => {
          if(resp != null){
            if(resp.oportunidadCompetidor != null){
              this.agendaService.agendaModalService.beneficioOportunidad$.next(resp.oportunidadCompetidor.otroBeneficio)
            }
            resp.beneficios.forEach((e) => {
              e.checked = e.respuesta == 0 ? false : true;
            });
            this.dataGridBeneficios$.next(resp.beneficios)
            this.gridBeneficios.loading = false;
          }
        },
      }
    );
    this._subscriptions$.add(sub$)
  }
  checkValue(dataItem: IBeneficioCompetidor) {
    dataItem.respuesta = dataItem.checked ? 1 : 0;
    let sub$ = this.agendaService.agendaModalService.guardarBeneficioRespuesta$(dataItem).subscribe({
      next: (resp) => {
        console.log(resp)
      },
      error: (error) => {
        let mensaje = this._alertaService.getMessageErrorService(error);
        this._alertaService.notificationWarning(mensaje);
      }
    })
    this._subscriptions$.add(sub$)
  }
}
