import { Component, Input, OnInit } from '@angular/core';
import { IArgumentoMotivacionPrograma } from '@integra/areas/comercial/models/interfaces/iagenda-informacion-actividad-oportunidad';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { RowArgs } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { BehaviorSubject, Subscription } from 'rxjs';

/**
 * @module ComercialModule
 * @description Paso 1 Factores de Motivacion Agenda
 * @author Flavio Rodrigo Mamani Fabian
 * @version 1.0.1
 * @history
 * * 03/10/2022 Implementacion de paso 1
 * * 06/12/2022 Creacion de interfaces de reprogramacion, implementacion de envio de mensajes de whatsapp
 */
@Component({
  selector: 'app-paso1-motivacion-cliente',
  templateUrl: './paso1-motivacion-cliente.component.html',
  styleUrls: ['./paso1-motivacion-cliente.component.scss'],
})
export class Paso1MotivacionClienteComponent implements OnInit {
  @Input() agendaService: AgendaService;

  constructor(private _alertaService: AlertaService) {}

  programaGeneral = '';
  gridFactoresMotivacion: KendoGrid = new KendoGrid();
  gridPrerequisitos: KendoGrid = new KendoGrid();
  _subscriptions$: Subscription = new Subscription();

  ngOnInit(): void {
    this.agendaService.agendaModalService.dataGridFactoresMotivacion$.next([]);
    this.cargarGrid();
    this.initSubscribeObservables();
  }
  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
    this.agendaService.agendaModalService.dataGridFactoresMotivacion$;
  }
  get dataGridFactoresMotivacion$(){
    return this.agendaService.agendaModalService.dataGridFactoresMotivacion$
  }
  initSubscribeObservables() {
    let sub1$ =
      this.agendaService.agendaInformacionActividadOportunidadService.cabeceraSpeech$.subscribe(
        (resp) => {
          if (resp != null) {
            this.programaGeneral = resp.programaGeneral;
          }
        }
      );
    this.gridFactoresMotivacion.loading = true;
    let sub2$ =
      this.agendaService.agendaInformacionActividadOportunidadService.argumentoMotivacionPrograma$.subscribe(
        (resp) => {
          if (resp != null) {
            resp.forEach((e) => {
              e.checked = e.respuesta == 0 ? false : true;
            });
            this.gridFactoresMotivacion.data = resp;
            this.agendaService.agendaModalService.dataGridFactoresMotivacion$.next(resp);
            this.gridFactoresMotivacion.loading = false;
          }
        }
      );
    this._subscriptions$.add(sub1$);
    this._subscriptions$.add(sub2$);
  }
  cargarGrid() {
    this.gridFactoresMotivacion.isDetailExpanded = (args: RowArgs) => {
      return args.dataItem.checked;
    };
    this.gridFactoresMotivacion.kendoGridDetailTemplateShowIf = (
      dataItem: any
    ) => {
      return dataItem.checked;
    };
  }
  checkRespuesta(dataItem: IArgumentoMotivacionPrograma) {
    dataItem.respuesta = dataItem.checked ? 1 : 0;
    let sub$ = this.agendaService.agendaModalService
      .guardarFactorMotivacion$(dataItem.respuesta, dataItem.idMotivacion)
      .subscribe({
        next: (resp) => {
          console.log(resp.body);
          this._alertaService.notificationSuccess('¡Guardado con exito!');
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptions$.add(sub$);
  }
}