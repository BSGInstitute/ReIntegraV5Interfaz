import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AgendaService } from '@comercial/services/agenda/agenda.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resumen-comentario',
  templateUrl: './resumen-comentario.component.html',
  styleUrls: ['./resumen-comentario.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ResumenComentarioComponent implements OnInit {
  @Input() agendaService: AgendaService;
  private _subscriptions$: Subscription = new Subscription();

  gridResumenComentario = new KendoGrid();
  urlGrabacion: string = '';
  _textoZonaHoraria: string = null;
  esReproduccion3cx: boolean = false;
  constructor() {}

  ngOnInit(): void {
    this.initSubscribeObservables();
  }
  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
  initSubscribeObservables() {
    this.gridResumenComentario.loading = true;
    let sub1$ =
      this.agendaService.agendaInformacionActividadOportunidadService.historialInteraccionesPorIdOportunidad$.subscribe(
        (resp) => {
          if (resp != null) {
            let data = resp.map((x) => {
              let item = {
                comentarioActividad: x.comentarioActividad ?? '',
                fechaModificacion: x.fechaModificacion,
                duracionMinutos: '<vacio>',
                estadoOcurrencia: x.estado,
                nombreOcurrencia: x.nombreOcurrencia,
                faseInicio: x.faseInicio,
                faseDestino: x.faseDestino,
              };
              if (
                x.llamadasIntegra3cx != null &&
                x.llamadasIntegra3cx.length > 0
                ) {
                let duracionTotal = 0;
                x.llamadasIntegra3cx.forEach((l) => {
                  duracionTotal += l.duracionContesto;
                });
                // let duracionMinutos = (duracionTotal / 60).toFixed(1) + ' m';
                let duracionMinutos = Math.round((duracionTotal / 60) * 10) / 10
                item.duracionMinutos = duracionMinutos.toString() + ' m';
              }
              return item;
            });
            this.gridResumenComentario.data = data.filter(
              (x) => x.estadoOcurrencia != 'NO EJECUTADO'
            );
          }
          this.gridResumenComentario.loading = false;
        }
      );
    this._subscriptions$.add(sub1$);
  }
}
