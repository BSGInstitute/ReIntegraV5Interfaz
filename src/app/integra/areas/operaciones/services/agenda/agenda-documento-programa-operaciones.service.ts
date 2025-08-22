import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOportunidadPEspecificoAgenda, IOportunidadAgenda } from '@comercial/models/interfaces/iagenda-documento-programa';
import { constApiComercial } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { AgendaOperacionesService } from './agenda-operaciones.service';

@Injectable()
export class AgendaDocumentoProgramaOperacionesService {
  constructor(private integraService: IntegraService) {}

  private agendaService: AgendaOperacionesService;
  private rowActual: any;

  oportunidadPEspecifico$: ReplaySubject<IOportunidadPEspecificoAgenda> =
    new ReplaySubject<IOportunidadPEspecificoAgenda>();
  documentosPrograma$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  datosOportunidad$: BehaviorSubject<IOportunidadAgenda> = new BehaviorSubject<IOportunidadAgenda>(null);

  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }

  ready() {}
  async initFicha() {
    this.rowActual = this.agendaService.rowActual;
    this.iniciarProgramaDocumentos();
  }
  async resetFicha() {}

  iniciarProgramaDocumentos() {
    this.oportunidadPEspecifico$ = new ReplaySubject<any>();
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerOportunidadYPEspecificoPorIdActividadDetalle}/${this.rowActual.id}`
      )
      .subscribe({
        next: (response: HttpResponse<IOportunidadPEspecificoAgenda>) => {
          this.datosOportunidad$.next(response.body.oportunidad)
          this.oportunidadPEspecifico$.next(response.body);
        },
      });

    // this.gridDocumentacion.loading = true;
    // http://localhost:63048/api/AgendaInformacionActividad/ObtenerDocumentos/
    this.documentosPrograma$ = new BehaviorSubject<any>(null);
    this.integraService
      .obtenerPorPathParamsFinal(
        constApiComercial.AgendaInformacionActividadObtenerDocumentosPorIdActividadDetalle,
        [this.rowActual.id]
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          // this._generarGridDocumentos(response.body);
          // this.listadoAlertas = response.body.ListadoAlertas;
          this.documentosPrograma$.next(response.body);
        },
      });
  }
}
