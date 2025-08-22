import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAgendaDocumentoLegal } from '@comercial/models/interfaces/iagenda-documento-legal';
import { IDatosSentinelAlumno } from '@comercial/models/interfaces/isemaforo-financiero';
import { constApiComercial, constApiGlobal } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { AgendaOperacionesService } from './agenda-operaciones.service';

@Injectable()
export class AgendaDocumentoLegalOperacionesService {
  constructor(private integraService: IntegraService) {}
  private agendaService: AgendaOperacionesService;
  public informacionProgramaTab: any;
  public documentosLegalesTab: any;
  documentoLegal$: ReplaySubject<IAgendaDocumentoLegal[]> = new ReplaySubject<
    IAgendaDocumentoLegal[]
  >();
  datosPersonal: any;
  rowActual: any;

  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }

  ready() {}

  async initFicha() {
    this.rowActual = this.agendaService.rowActual;
    this.agendaService.agendaPersonal$.subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.datosPersonal = resp.datosPersonal;
        this.obtenerDocumentosLegales(3, this.rowActual.idAlumno);
      },
    });
  }

  async resetFicha() {
    this.documentoLegal$ = new ReplaySubject<IAgendaDocumentoLegal[]>();
  }

  obtenerDocumentosLegales(idAreaPersonal: number, idAlumno: number) {
    const tipoPersonal = this.datosPersonal.tipoPersonal;
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerDocumentoLegal}/${idAreaPersonal}/${tipoPersonal}/${idAlumno}`
      )
      .subscribe({
        next: (response: HttpResponse<IAgendaDocumentoLegal[]>) => {
          this.documentoLegal$.next(response.body);
        },
        error: (error) => {
          this.documentoLegal$.error(error);
        },
      });
  }
}
