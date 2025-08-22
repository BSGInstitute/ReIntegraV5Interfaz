import { Component, Input, OnInit } from '@angular/core';
import {
  IArgumentoDetalle,
  IArgumentoDetalleNuevaAgenda,
  IProblemaDetalle,
  IProblemaDetalleNuevaAgenda,
} from '@comercial/models/interfaces/iagenda-modal';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-paso6-problema-cliente',
  templateUrl: './paso6-problema-cliente.component.html',
  styleUrls: ['./paso6-problema-cliente.component.scss'],
})
export class Paso6ProblemaClienteComponent implements OnInit {
  @Input() agendaService: AgendaService;
  gridProblemasCliente: KendoGrid = new KendoGrid();
  private _subscriptions$: Subscription = new Subscription();
  constructor(private _alertaService: AlertaService) {}

  ngOnInit(): void {
    this.agendaService.agendaModalService.dataGridProblemaCliente$.next([])
    this.initSubscribeObservables();
  }
  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = null;
  }
  get dataGridProblemaCliente$() {
    return this.agendaService.agendaModalService.dataGridProblemaCliente$;
  }
  initSubscribeObservables() {
    this.gridProblemasCliente.loading = true;
    let sub$ =
      this.agendaService.agendaModalService.dataProblemaCliente$.subscribe(
        (resp) => {
          if (resp != null) {
            resp.forEach((e) => {
              e.class = this.colorearLabel(e);
              e.argumentos.forEach((element) => {
                //element.flagSeleccionado = element.seleccionado == true;
                //element.flagSolucionado = element.solucionado == true;     
                element.flagCheckValor= element.checkValor == true;         
              });
            });
            this.gridProblemasCliente.data = resp;
            this.agendaService.agendaModalService.dataGridProblemaCliente$.next(
              resp
            );
            this.gridProblemasCliente.loading = false;
          }
        }
      );
    this._subscriptions$.add(sub$);
  }
  private colorearLabel(dataItem: IProblemaDetalleNuevaAgenda) {
    
    let concasos= dataItem.argumentos.filter(
      (e) => e.caso.includes('Caso')
    );


    

    //solo son soluciones
    if(Object.keys(concasos).length===0)
    {

      let data = dataItem.argumentos.filter(
        (e) => e.checkValor
      );
      

      //caso 1 , que almenos 1 tenga check -verde
      if (Object.keys(data).length > 0) {
        return 'success';
      } 
      //caso 2,  que ninguno esta marcado - default
      else
      {
        return 'default';
      }
    }
    //tiene casos con solucion cada 1
    else{
      let data = dataItem.argumentos.filter(
        (e) => !e.checkValor
      );
      /////
      let data2 = dataItem.argumentos.filter(
        (e) => e.checkValor
      );
      /////
      let data3 = dataItem.argumentos.filter(
        (e) => e.checkValor && e.caso.includes('Caso')
      );
      let data4 = dataItem.argumentos.filter(
        (e) => e.checkValor && !e.caso.includes('Caso')
      );

      //caso 1 , todo con check marcado - verde
      if (Object.keys(data).length===0) {
        return 'success';
      } 

      //caso 2,  que ninguno esta marcado - default
      if (Object.keys(data2).length===0) {
        return 'default';
      } 
      
      //caso 3,  que hay mas casos marcados pero no resueltos
      if (Object.keys(data3).length > Object.keys(data4).length) {
        return 'danger';
      } 
    }
    return 'default';

    // if (data) {
    //   return 'default';
    // } else {
    //   return 'success';
    // }
  }
  checkboxCheckValor(param: IArgumentoDetalleNuevaAgenda) {
    if (param.checkValor || param.idProgramaGeneralProblema == 1) {
      let sub$ = this.agendaService.agendaModalService
        .guardarProblemaDetalleRespuestaNuevaAgenda$(param)
        .subscribe({
          next: (resp) => {
            console.log(resp.body);
          },
          error: (error) => {
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
      this._subscriptions$.add(sub$);
    }
  }
  checkboxSeleccionado(param: IArgumentoDetalle) {
    if (param.solucionado) {
      param.solucionado = false;
      param.seleccionado = false;
    }
    if (param.seleccionado || param.idProgramaGeneralProblema == 1) {
      let sub$ = this.agendaService.agendaModalService
        .guardarProblemaDetalleRespuesta$(param)
        .subscribe({
          next: (resp) => {
            console.log(resp.body);
          },
          error: (error) => {
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
      this._subscriptions$.add(sub$);
    }
  }
  checkboxSolucionado(param: IArgumentoDetalle) {
    if (param.seleccionado == true || param.idProgramaGeneralProblema == 1) {
      let sub$ = this.agendaService.agendaModalService
        .guardarProblemaDetalleRespuesta$(param)
        .subscribe({
          next: (resp) => {
            console.log(resp.body);
          },
          error: (error) => {
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
      this._subscriptions$.add(sub$);
    }
  }
}
