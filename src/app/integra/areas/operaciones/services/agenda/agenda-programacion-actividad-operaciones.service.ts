import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { constApiComercial, constApiOperaciones } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { AgendaOperacionesService } from './agenda-operaciones.service';
import { IDatoOportunidad, IFechaReprogramacionEjecutada, IFinalizarActividadOperaciones } from '@comercial/models/interfaces/iagenda-programacion';
import { IArbolOcurrenciaOperaciones } from '@comercial/models/interfaces/iarbol-ocurrencia-alterno';

@Injectable()
export class AgendaProgramacionActividadOperacionesService {
  constructor(private integraService: IntegraService) {}

  private agendaService: AgendaOperacionesService;
  modalProgramarActividadRef: any;
  private rowActual: any;
  private userName: any;

  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }
  ready() {}
  async initFicha() {
    console.log('AgendaProgramacionActividadService');
    this.rowActual = this.agendaService.rowActual;
    this.userName = this.agendaService.userName;
  }

  _openModalProgramarActividad() {}
  async resetFicha() {}
  obtenerHojaActividadesPorIdOcurrenciaAlterno$(idOcurrencia: number) {
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerHojaActividadesPorIdOcurrenciaAlterno}/${idOcurrencia}`
    );
  }

  obtenerFechaReprogramacionAutomatica$(
    idOportunidad: number
  ) {
    // http://localhost:63048/api/AgendaInformacionActividad/ObtenerFechaReprogramacionAutomatica
    return this.integraService.getTextResponse(
      `${constApiOperaciones.AgendaInformacionActividadObtenerFechaReprogramacionAutomatica}/${idOportunidad}`
    );
  }

  guardarProgramacionActividad$(
    comentario: string,
    oportunidad: IDatoOportunidad,
    ocurrencia: IArbolOcurrenciaOperaciones,
    tipoProgramacion: string,
    datosCalidadLlamada: any,
  ) {
    // console.log
    let envio: IFinalizarActividadOperaciones = {
      actividadAntigua: {
        id: this.rowActual.id,
        comentario: comentario ?? '',
        idOcurrencia: ocurrencia.idOcurrenciaReporte,
        idOcurrenciaActividad: ocurrencia.idOcurrenciaActividad,
        idAlumno: this.rowActual.idAlumno,
        idOportunidad: this.rowActual.idOportunidad,
      },
      datosOportunidad: oportunidad,
      // datosCompuesto: this.agendaService.agendaModalOperacionesService.traerListas(),
      tipoProgramacion: tipoProgramacion,
      filtro: {
        idOcurrencia: ocurrencia.idOcurrenciaReporte,
        tipo: tipoProgramacion,
        idActividadCabecera: this.rowActual.idActividadCabecera,
        idPersonal: this.rowActual.idPersonal_Asignado,
        usuario: this.agendaService.userName,
      },
      // comprobantePago: datosComprobantePago,
      calidadLlamada: datosCalidadLlamada,
      usuario: this.agendaService.userName,
    };

    console.log(envio);
    console.log(JSON.stringify(envio));
    // this.agendaService.agendaControlPantallaService.cerrarModalProgramarActividades();
    return this.integraService.postJsonResponse(
      constApiOperaciones.AgendaInformacionActividadFinalizarYProgramarActividadOperaciones,
      JSON.stringify(envio)
    );
  }

  cerrarActividad$(comentario: string, ocurrencia: any) {
    console.log(this.agendaService.agendaModalOperacionesService.traerListas());
    let envio: any = {
      actividadAntigua: {
        id: this.rowActual.id,
        comentario: comentario ? comentario : '',
        idOcurrencia: ocurrencia.idOcurrenciaReporte,
        idOcurrenciaActividad: ocurrencia.idOcurrenciaActividad,
        idAlumno: this.rowActual.idAlumno,
        idOportunidad: this.rowActual.idOportunidad,
        idAsignado: this.rowActual.idPersonal_Asignado,
      },
      oportunidad: {
        idFaseOportunidad: this.rowActual.idFaseOportunidad,
      },
      datosCompuesto:
        this.agendaService.agendaModalOperacionesService.traerListas(),
      usuario: this.userName,
    };
    console.log(JSON.stringify(envio));
    console.log(envio);
    // this.agendaService.agendaVentaCruzadaService.actividadEjecutada(this.rowActual.id, this.rowActual);
    // this.agendaService.agendaControlPantallaService.cerrarModalProgramarActividades();
    return this.integraService.postJsonResponse(
      constApiComercial.AgendaReprogramacionCerrarActividad,
      JSON.stringify(envio)
    );
    // return this.integraService
    //   .postJsonResponse(
    //     constApiComercial.OportunidadFinalizarActividadAlternoV2,
    //     JSON.stringify(envio)
    //   )
  }

  envioAutomaticoPlantillaWhatsApp() {}

  obtenerFechaReprogramacionEjecutada$(
    idOportunidad: number
  ): Observable<HttpResponse<{ records: IFechaReprogramacionEjecutada }>> {
    // http://localhost:63048/api/AgendaInformacionActividad/ObtenerFechaReprogramacionEjecutada
    return this.integraService.getJsonResponse(
      `${constApiOperaciones.AgendaInformacionActividadObtenerFechaReprogramacionEjecutada}/${idOportunidad}`
    );
  }
}
