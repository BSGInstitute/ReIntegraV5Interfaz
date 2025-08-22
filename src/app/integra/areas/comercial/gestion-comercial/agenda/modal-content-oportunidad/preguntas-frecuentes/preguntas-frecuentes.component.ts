import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { IProgramaGeneral } from '@integra/areas/comercial/models/interfaces/iagenda-activad';
import { IAgendaPreguntaFrecuente } from '@integra/areas/comercial/models/interfaces/iagenda-pregunta-frecuente';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { AlertaService } from '@shared/services/alerta.service';

@Component({
  selector: 'app-preguntas-frecuentes',
  templateUrl: './preguntas-frecuentes.component.html',
  styleUrls: ['./preguntas-frecuentes.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PreguntasFrecuentesComponent implements OnInit, OnDestroy {
  constructor(private _alertaService: AlertaService) {}
  idPrograma: number = null;
  dataProgramaGeneral: Array<IProgramaGeneral> = [];
  sourceProgramaGeneral: Array<IProgramaGeneral> = [];
  contentPreguntaFrecuente: string = '';
  resPreguntaFrecuente: IAgendaPreguntaFrecuente;
  loading: boolean = false;
  _subscriptions$: Subscription = new Subscription();
  @Input() agendaService: AgendaService;

  ngOnInit(): void {
    this.initSubscribeObservables();
  }
  ngOnDestroy(): void {
    this.dataProgramaGeneral = null;
    this.contentPreguntaFrecuente = null;
    this.sourceProgramaGeneral = null;
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = null;
  }
  private initSubscribeObservables() {
    let sub1$ =
      this.agendaService.agendaInformacionActividadOportunidadService.informacionProgramaV1$.subscribe(
        (resp) => {
          if (resp != null) {
            this.idPrograma = resp.respuesta.idPGeneral;
          }
        }
      );
    let sub2$ =
      this.agendaService.agendaActividadesService.datosProgramaGeneral$.subscribe(
        (resp) => {
          if (resp != null) {
            this.sourceProgramaGeneral = resp;
            this.dataProgramaGeneral = resp;
          }
        }
      );
    let sub3$ =
      this.agendaService.agendaPreguntasFrecuentesService.preguntasFrecuentes$.subscribe(
        (resp) => {
          if(resp != null){
            this.resPreguntaFrecuente = resp;
            if (resp.data.length > 0) {
              this.idPrograma = resp.data[0].idPrograma;
            }
          }
        }
      );
    this._subscriptions$.add(sub1$);
    this._subscriptions$.add(sub2$);
    this._subscriptions$.add(sub3$);
  }
  filterProgramaGeneral(value: string) {
    this.dataProgramaGeneral = this.sourceProgramaGeneral.filter(
      (e) => e.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  changeProgramaGeneral(id: number) {
    this.loading = true;
    this.agendaService.agendaPreguntasFrecuentesService
      .obtenerPreguntasFrecuentesCambio$(id)
      .subscribe({
        next: (resp: HttpResponse<IAgendaPreguntaFrecuente>) => {
          this.resPreguntaFrecuente = resp.body;
          this.loading = false;
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
}
