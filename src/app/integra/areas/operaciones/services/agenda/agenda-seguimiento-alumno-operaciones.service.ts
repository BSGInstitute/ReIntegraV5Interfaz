import { ReplaySubject } from 'rxjs';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { Injectable } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { constApiOperaciones } from '@environments/constApi';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { KendoGrid } from '@shared/models/kendo-grid';

@Injectable()
export class AgendaSeguimientoAlumnoOperacionesService {
  constructor(private integraService: IntegraService) {}

  private agendaService: AgendaOperacionesService;
  comentarioOperaciones$: ReplaySubject<any> = new ReplaySubject<any>();
  private rowActual: IRowActual;

  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }
  gridHistorialComentariosTipoPago: KendoGrid = new KendoGrid();
  gridHistorialComentariosTipoAcademico: KendoGrid = new KendoGrid();
  gridHistorialComentariosTipoMembresiaExamenCertificacion: KendoGrid = new KendoGrid();
  gridHistorialComentariosTipoSeguimientoAnterior: KendoGrid = new KendoGrid();
  gridHistorialComentariosPagoAcademico:KendoGrid =  new KendoGrid();
  ready() {}
  async initFicha() {
    this.rowActual = this.agendaService.rowActual;
    this.cargaTotalHistorialComentarios();

  }
  async resetFicha() {
    this.gridHistorialComentariosTipoPago  = new KendoGrid();
    this.gridHistorialComentariosTipoAcademico = new KendoGrid();
    this.gridHistorialComentariosTipoMembresiaExamenCertificacion = new KendoGrid();
    this.gridHistorialComentariosTipoSeguimientoAnterior = new KendoGrid();
    this.gridHistorialComentariosPagoAcademico = new KendoGrid()
  }



 cargaTotalHistorialComentarios() {
  this.gridHistorialComentariosTipoAcademico.loading = true;
  this.gridHistorialComentariosTipoPago.loading = true;
  this.gridHistorialComentariosTipoMembresiaExamenCertificacion.loading = true;
  this.gridHistorialComentariosTipoSeguimientoAnterior.loading = true;
  this.gridHistorialComentariosPagoAcademico.loading =true

  this.integraService
  .getJsonResponse(
    `${constApiOperaciones.AgendaInformacionActividadObtenerComentariosOperacionesPagosAcademicos2}/${this.rowActual.idOportunidad}`
  ).subscribe({
    next: (data) => {
      this.gridHistorialComentariosPagoAcademico.data$.next(data.body);
      this.gridHistorialComentariosPagoAcademico.loading = false;
    },
    error: (error) => {
      console.log('error', error);
      this.gridHistorialComentariosPagoAcademico.loading = false;
    }
  })


  this.integraService
    .getJsonResponse(
      `${constApiOperaciones.AgendaInformacionActividadObtenerComentarioPagosOperaciones}/${this.rowActual.idOportunidad}`
    ).subscribe({
      next: (data) => {
        this.gridHistorialComentariosTipoPago.data$.next(data.body);
        this.gridHistorialComentariosTipoPago.loading = false;
      },
      error: (error) => {
        console.log('error', error);
        this.gridHistorialComentariosTipoPago.loading = false;
      }
    })
    this.integraService
    .getJsonResponse(
      `${constApiOperaciones.AgendaInformacionActividadObtenerComentarioOperaciones}/${this.rowActual.idOportunidad}/${2}`
    ).subscribe({
      next: (data) => {
        this.gridHistorialComentariosTipoAcademico.data$.next(data.body);
        this.gridHistorialComentariosTipoAcademico.loading = false;
      },
      error: (error) => {
        console.log('error', error);
        this.gridHistorialComentariosTipoAcademico.loading = false;
      }
    })
    this.integraService
    .getJsonResponse(
      `${constApiOperaciones.AgendaInformacionActividadObtenerComentarioOperaciones}/${this.rowActual.idOportunidad}/${3}`
    ).subscribe({
      next: (data) => {
        this.gridHistorialComentariosTipoMembresiaExamenCertificacion.data$.next(data.body);
        this.gridHistorialComentariosTipoMembresiaExamenCertificacion.loading = false;
      },
      error: (error) => {
        console.log('error', error);
        this.gridHistorialComentariosTipoMembresiaExamenCertificacion.loading = false;
      }
    })
    this.integraService
    .getJsonResponse(
      `${constApiOperaciones.AgendaInformacionActividadObtenerComentarioOperaciones}/${this.rowActual.idOportunidad}/${4}`
    ).subscribe({
      next: (data) => {
        this.gridHistorialComentariosTipoSeguimientoAnterior.data$.next(data.body);
        this.gridHistorialComentariosTipoSeguimientoAnterior.loading = false;
      },
      error: (error) => {
        console.log('error', error);
        this.gridHistorialComentariosTipoSeguimientoAnterior.loading = false;
      }
    })
}
}
