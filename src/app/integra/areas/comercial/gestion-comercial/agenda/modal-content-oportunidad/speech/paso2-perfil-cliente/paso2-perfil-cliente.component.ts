import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { Component, Input, OnInit } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  IPublicoObjetivoPrograma,
  IRequisitosCertificacionPrograma,
} from '@integra/areas/comercial/models/interfaces/iagenda-informacion-actividad-oportunidad';
import { IPreRequisitoOportunidad } from '@comercial/models/interfaces/iagenda-modal';
import { AlertaService } from '@shared/services/alerta.service';

@Component({
  selector: 'app-paso2-perfil-cliente',
  templateUrl: './paso2-perfil-cliente.component.html',
  styleUrls: ['./paso2-perfil-cliente.component.scss'],
})
export class Paso2PerfilClienteComponent implements OnInit {
  @Input() agendaService: AgendaService;

  gridPublicoObjetivo: KendoGrid = new KendoGrid();
  gridCertificacionGeneral: KendoGrid = new KendoGrid();
  gridPrerequisitos: KendoGrid = new KendoGrid();
  readonly dataNivelCumplimiento: Array<{ id: number; nombre: string }> = [
    { id: 1, nombre: 'Cumple al 100%' },
    { id: 2, nombre: 'Cumple al 75%' },
    { id: 3, nombre: 'Cumple al 50%' },
    { id: 4, nombre: 'Cumple al 25%' },
    { id: 5, nombre: 'No cumple en absoluto' },
  ];
  readonly optionCertificacion = [
    { id: 1, nombre: 'Si, cumple ahora' },
    { id: 2, nombre: 'Cumple en 6 meses' },
    { id: 3, nombre: 'Cumple en 1 año' },
    { id: 4, nombre: 'Cumple en mas de 1 año' },
    { id: 5, nombre: 'No cumple' },
  ];
  private _subscriptions$: Subscription = new Subscription();
  constructor(private _alertaService: AlertaService) {}
  
  ngOnInit(): void {
    this.agendaService.agendaModalService.dataGridPublicoObjetivo$.next([])
    this.agendaService.agendaModalService.dataGridPrerequisitos$.next([])
    this.agendaService.agendaModalService.dataGridCertificacionGeneral$.next([])
    this.initSubscribeObservables();
  }
  get dataGridPublicoObjetivo$(){
    return this.agendaService.agendaModalService.dataGridPublicoObjetivo$;
  }
  get dataGridPrerequisitos$(){
    return  this.agendaService.agendaModalService.dataGridPrerequisitos$;
  }
  get dataGridCertificacionGeneral$(){
    return this.agendaService.agendaModalService.dataGridCertificacionGeneral$;
  }
  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
  initSubscribeObservables() {
    this.gridPublicoObjetivo.loading = true;
    let sub1$ =
      this.agendaService.agendaInformacionActividadOportunidadService.publicoObjetivoPrograma$.subscribe(
        (resp) => {
          if (resp != null) {
            this.gridPublicoObjetivo.data = resp;
            this.agendaService.agendaModalService.dataGridPublicoObjetivo$.next(resp);
            this.gridPublicoObjetivo.loading = false;
          }
        }
      );
    let sub2$ =
      this.agendaService.agendaModalService.prerequisitosBeneficiosCompetidoresPorIdOportunidad$.subscribe(resp => {
        if(resp != null){
            this.gridPrerequisitos.data = resp.prerequisitosGenerales;
            this.agendaService.agendaModalService.dataGridPrerequisitos$.next(resp.prerequisitosGenerales);
        }
      });
    this.gridCertificacionGeneral.loading = true;
    let sub3$ =
      this.agendaService.agendaInformacionActividadOportunidadService.requisitosCertificacionProgramaPorIdOportunidad$.subscribe(resp => {
        if(resp != null){
          this.gridCertificacionGeneral.loading = false;
            this.gridCertificacionGeneral.data = resp;
            this.agendaService.agendaModalService.dataGridCertificacionGeneral$.next(resp);
        }
      });
    this._subscriptions$.add(sub1$);
    this._subscriptions$.add(sub2$);
    this._subscriptions$.add(sub3$);
  }
  limpiarContenido(cadena: string) {
    let flag = true;
    while (flag) {
      let indice = cadena.indexOf('font-family');
      if (indice != -1) {
        let sub1 = cadena.substring(0, indice);
        cadena = cadena.substring(indice);
        indice = cadena.indexOf(';');
        let sub2 = cadena.substring(indice);
        cadena = sub1 + sub2;
      } else {
        flag = false;
      }
    }
    flag = true;
    while (flag) {
      let indice = cadena.indexOf('font-size');
      if (indice != -1) {
        let sub1 = cadena.substring(0, indice);
        cadena = cadena.substring(indice);
        indice = cadena.indexOf(';');
        let sub2 = cadena.substring(indice);
        cadena = sub1 + sub2;
      } else {
        flag = false;
      }
    }
    flag = true;
    while (flag) {
      let indice = cadena.indexOf('background-color');
      if (indice != -1) {
        let sub1 = cadena.substring(0, indice);
        cadena = cadena.substring(indice);
        indice = cadena.indexOf(';');
        let sub2 = cadena.substring(indice);
        cadena = sub1 + sub2;
      } else {
        flag = false;
      }
    }
    flag = true;
    while (flag) {
      let indice = cadena.indexOf('color');
      if (indice != -1) {
        let sub1 = cadena.substring(0, indice);
        cadena = cadena.substring(indice);
        indice = cadena.indexOf(';');
        let sub2 = cadena.substring(indice);
        cadena = sub1 + sub2;
      } else {
        flag = false;
      }
    }
    return cadena;
  }
  changePublicoObjetivo(event: number, dataItem: IPublicoObjetivoPrograma) {
    this.agendaService.agendaModalService
      .guardarPublicoObjetivo$(dataItem)
      .subscribe({
        next: (resp) => {
          console.log(resp.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  changePrerequisitos(event: number, dataItem: IPreRequisitoOportunidad) {
    this.agendaService.agendaModalService
      .guardarPreRequisitosRespuesta$(dataItem)
      .subscribe({
        next: (resp) => {
          console.log(resp);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  changeCertificacion(
    event: number,
    dataItem: IRequisitosCertificacionPrograma
  ) {
    this.agendaService.agendaModalService
      .guardarCertificacionRespuesta$(dataItem)
      .subscribe({
        next: (resp) => {
          console.log(resp);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
}
