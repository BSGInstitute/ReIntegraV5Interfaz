import { IListarReclamos } from './../../../comercial/models/interfaces/ireclamo-alumno';
import { constApiOperaciones } from './../../../../../../environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IArbolOcurrenciaOperaciones } from '@comercial/models/interfaces/iarbol-ocurrencia-alterno';
import { constApiComercial } from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { ReplaySubject } from 'rxjs';
import { AgendaOperacionesService } from './agenda-operaciones.service';

@Injectable()
export class AgendaArbolOcurrenciaOperacionesService {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService
  ) {}

  private agendaService: AgendaOperacionesService;
  private rowActual: any;

  reclamosAlumnos$ = new ReplaySubject<IListarReclamos[]>(1);
  arbolOcurrencias$: ReplaySubject<IArbolOcurrenciaOperaciones[]> =
    new ReplaySubject<IArbolOcurrenciaOperaciones[]>(1);
  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }
  ready() {}

  async initFicha() {
    this.rowActual = this.agendaService.rowActual;
    this.cargarArbolOcurrencias(this.rowActual.idActividadCabecera, 0);
    this.obtenerReclamosAlumno();
    console.log('reclamosAlumnos$21');
  }

  resetFicha() {
    this.arbolOcurrencias$ = new ReplaySubject<any>(1);
    this.reclamosAlumnos$ = new ReplaySubject<any>(1);
  }

  cargarArbolOcurrencias(actividadCabeceraId: any, idOcurrenciaPadre: any) {
    this.obtenerArbolOcurrencia$(
      actividadCabeceraId,
      idOcurrenciaPadre
    ).subscribe({
      next: (response: HttpResponse<IArbolOcurrenciaOperaciones[]>) => {
        this.arbolOcurrencias$.next(response.body);
      },
      error: (error) => {
        this.alertaService.notificationWarning(error.message);
    }})
  }
  obtenerReclamosAlumno() {
    console.log('reclamosAlumnos$');
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.ReclamoObtenerReclamosAlumno}/${this.rowActual.idMatriculaCabecera}`
      )
      .subscribe({
        next: (response: HttpResponse<{ listaReclamo: IListarReclamos[] }>) => {
          this.reclamosAlumnos$.next(response.body.listaReclamo);
        },
      });
  }

  obtenerArbolOcurrencia$(
    idActividadCabecera: number,
    idOcurrenciaPadre: number
  ) {
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerArbolOcurrencias}/${idActividadCabecera}/${idOcurrenciaPadre}`
    );
  }
  actualizarNombreAlumno$(data:any){
    return this.integraService.postJsonResponse(
      constApiOperaciones.AlumnoActualizarNombreAlumno, JSON.stringify(data)
    );
  }
  InsertarCertificadoDatos$(data:any){
    return this.integraService.postJsonResponse(
      constApiOperaciones.MatriculaCabeceraDatosCertificadoMensajeInsertarCertificadoDatos, JSON.stringify(data));
  }
  solicitarCertificadoFisicoDatos$(data:any){
    return this.integraService.postJsonResponse(
      constApiOperaciones.SolicitudCertificadoFisicoInsertar,JSON.stringify(data)
    );
  }



}
