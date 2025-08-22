import { Component, Input, OnInit } from '@angular/core';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-paso4-plazo-inicio-programa',
  templateUrl: './paso4-plazo-inicio-programa.component.html',
  styleUrls: ['./paso4-plazo-inicio-programa.component.scss'],
})
export class Paso4PlazoInicioProgramaComponent implements OnInit {
  @Input() agendaService: AgendaService;
  programaGeneral: string = '';
  private _subscriptions$: Subscription = new Subscription();
  constructor() {}
  ngOnInit(): void {
    this.agendaService.agendaModalService.dataTiemposCapacitacion$.next([])
    this.initSubscribeObservables();
  }
  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = null;
    this.programaGeneral = null;
  }
  get dataTiemposCapacitacion$() {
    return this.agendaService.agendaModalService.dataTiemposCapacitacion$;
  }
  private initSubscribeObservables() {
    let sub1$ =
      this.agendaService.agendaInformacionActividadOportunidadService.cabeceraSpeech$.subscribe(
        (resp) => {
          if (resp != null) {
            this.programaGeneral = resp.programaGeneral;
          }
        }
      );
    let sub2$ =
      this.agendaService.agendaModalService.tiempoCapacitacionPorIdOportunidad$.subscribe(
        (resp) => {
          if (resp != null) {
            let dataTiemposCapacitacion = resp.records.map((e) => {
              let rpta = {
                id: e.id,
                nombre: e.nombre,
                check: resp.recordValidado == e.id ? true : false,
              };
              return rpta;
            });
            this.agendaService.agendaModalService.dataTiemposCapacitacion$.next(
              dataTiemposCapacitacion
            );
          }
        }
      );
    this._subscriptions$.add(sub1$);
    this._subscriptions$.add(sub2$);
  }
  changeValueCheck(
    event: any,
    item: {
      id: number;
      nombre: string;
      check: boolean;
    }
  ) {
    this.dataTiemposCapacitacion$.value.forEach((element) => {
      element.check = false;
    });
    item.check = event.target.checked;
    this.agendaService.agendaModalService.cargarPlazosInicioPrograma(
      item.check ? item.id : 0
    );
  }
}
