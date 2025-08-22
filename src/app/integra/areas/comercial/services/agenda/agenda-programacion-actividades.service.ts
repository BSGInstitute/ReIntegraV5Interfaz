import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { IPlantillaWhatsApp } from '@comercial/models/interfaces/iagenda-informacion-actividad-oportunidad';
import {
  IComprobantePago,
  IDatoOportunidad,
  IEnvioWhatsApp,
  IObtenerFaseOportunidad,
} from '@comercial/models/interfaces/iagenda-programacion';
import { IArbolOcurrenciaAlterno } from '@comercial/models/interfaces/iarbol-ocurrencia-alterno';
import { constApiComercial, constApiGlobal } from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Observable, Subscription } from 'rxjs';
import { AgendaService } from './agenda.service';
import { CrmService } from '@shared/services/crm.service';
@Injectable()
export class AgendaProgramacionActividadesService {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private crmService: CrmService
  ) {}
  private _agendaService: AgendaService;
  private _rowActual: IRowActual;
  private _subscriptions$: Subscription = new Subscription();
  private _subscriptionsFicha$: Subscription = new Subscription();

  async setAgendaService(agendaService: AgendaService) {
    this._agendaService = agendaService;
    await this.ready();
  }
  async ready() {}
  async resetService() {
    await this.resetFicha();
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = new Subscription();
  }
  async initFicha() {
    this._rowActual = this._agendaService.rowActual;
  }
  async resetFicha() {
    this._subscriptionsFicha$.unsubscribe();
    this._subscriptionsFicha$ = new Subscription();
  }
  obtenerHojaActividadesPorIdOcurrenciaAlterno$(idOcurrencia: number) {
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerHojaActividadesPorIdOcurrenciaAlterno}/${idOcurrencia}`
    );
  }
  obtenerFechaHoraActividadReprogramacionAutomatica$(
    idOportunidad: any,
    codigoFase: any,
    idOcurrenciaReporte: any
  ): Observable<HttpResponse<string>> {
    return this.integraService.getTextResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerFechaHoraActividadReprogramacionAutomatica}/${idOportunidad}/${codigoFase}/${idOcurrenciaReporte}`
    );
  }
  guardarProgramacionActividad2$(
    comentario: string,
    datosOportunidad: IDatoOportunidad,
    ocurrencia: IArbolOcurrenciaAlterno,
    tipoProgramacion: string,
    datosComprobantePago: IComprobantePago,
    calidadLlamada: {
      idProblemaLlamada: number;
      idCalidadLlamada: number;
    },
    estadoSeguimientoWhatsApp: boolean
  ) {
    this.crmService.enLlamada = false;
    let datosCompuesto = this._agendaService.agendaModalService.traerListas();
    let jsonEnvio: any = {
      actividadAntigua: {
        id: this._rowActual.id,
        comentario: comentario,
        idOcurrencia: ocurrencia.idOcurrenciaReporte,
        idOcurrenciaActividad: ocurrencia.idOcurrenciaActividad,
        idAlumno: this._rowActual.idAlumno,
        idOportunidad: this._rowActual.idOportunidad,
      },
      datosOportunidad: datosOportunidad,
      oportunidadCompetidor: datosCompuesto.oportunidadCompetidor,
      calidadProcesamientoAlterno: datosCompuesto.calidadProcesamientoAlterno,
      listaCompetidor: datosCompuesto.listaCompetidor,
      filtro: {
        idOcurrencia: ocurrencia.idOcurrenciaReporte,
        tipo: tipoProgramacion,
        idActividadCabecera: this._rowActual.idActividadCabecera,
        idCategoria: this._rowActual.idCategoriaOrigen,
        idPersonal: this._rowActual.idPersonal_Asignado,
        usuario: this._agendaService.userName,
      },
      comprobantePago:
        datosComprobantePago?.idContacto != 0 ? datosComprobantePago : null,
      calidadLlamada: calidadLlamada,
      usuario: this._agendaService.userName,
      estadoSeguimientoWhatsApp: estadoSeguimientoWhatsApp,
    };
    this._agendaService.calcularRecargarTab(
      ocurrencia.idFaseOportunidad,
      ocurrencia.nombreEstadoOcurrencia,
      this._rowActual.idFaseOportunidad
    );
    return this.integraService.postJsonResponse(
      constApiComercial.AgendaReprogramacionFinalizarYProgramarActividadAlternoV2,
      JSON.stringify(jsonEnvio)
    );
  }
  cerrarActividad$(comentario: string, ocurrencia: IArbolOcurrenciaAlterno) {
    this.crmService.enLlamada = false;
    let datosCompuestos = this._agendaService.agendaModalService.traerListas();
    let envio: any = {
      actividadAntigua: {
        id: this._rowActual.id,
        comentario: comentario ?? '',
        idOcurrencia: ocurrencia.idOcurrenciaReporte,
        idOcurrenciaActividad: ocurrencia.idOcurrenciaActividad,
        idAlumno: this._rowActual.idAlumno,
        idOportunidad: this._rowActual.idOportunidad,
      },
      datosOportunidad: {
        idFaseOportunidad: this._rowActual.idFaseOportunidad,
      },
      oportunidadCompetidor: datosCompuestos.oportunidadCompetidor,
      calidadProcesamientoAlterno: datosCompuestos.calidadProcesamientoAlterno,
      listaCompetidor: datosCompuestos.listaCompetidor,
      usuario: this._agendaService.userName,
    };
    this._agendaService.calcularRecargarTab(
      ocurrencia.idFaseOportunidad,
      ocurrencia.nombreEstadoOcurrencia,
      this._rowActual.idFaseOportunidad
    );
    return this.integraService.postJsonResponse(
      constApiComercial.AgendaReprogramacionCerrarActividad,
      JSON.stringify(envio)
    );
  }
  enviarIndividualSMSPorOcurrencia$(idOcurrencia: number) {
    return this.integraService.getJsonResponse(
      `${constApiGlobal.AlumnoEnviarIndividualSMSPorOcurrencia}/${this._rowActual.idOportunidad}/${idOcurrencia}`
    );
  }
  verificarInsertarNumeroValidado$() {
    let jsonEnvio = {
      idAlumno: this._rowActual.idAlumno,
      numeroCelular:
        this._agendaService.agendaAlumnoService.numeroWhatsApp$.value,
      idPais: this._agendaService.agendaAlumnoService.alumno$.value.idCodigoPais,
      usuario: this._agendaService.userName,
    };
    return this.integraService.postJsonResponse(
      constApiComercial.WhatsAppNumeroValidadoVerificarInsertarNumeroValidado,
      JSON.stringify(jsonEnvio)
    );
  }
  whatsAppValidarNumeros$() {
    let jsonEnvio = {
      blocking: 'wait',
      contacts: [
        `+${this._agendaService.agendaAlumnoService.numeroWhatsApp$.value}`,
      ],
    };
    const idCodigoPais =
      this._agendaService.agendaAlumnoService.alumno$.value.idCodigoPais;
    return this.integraService.postJsonResponse(
      `${constApiComercial.WhatsAppContactoWhatsAppValidarNumeros}/${this._rowActual.idPersonal_Asignado}/${idCodigoPais}`,
      JSON.stringify(jsonEnvio)
    );
  }
  enviarMensajeAutomatico(dataItem: IPlantillaWhatsApp) {
    let speech =
      this._agendaService.agendaValorEtiquetaService.cargarValoresEtiquetaWhatsApp(
        dataItem.contenido
      );
    const idCodigoPais =
      this._agendaService.agendaAlumnoService.alumno$.value.idCodigoPais;
    let obj: IEnvioWhatsApp = {
      id: 0,
      waTo: this._agendaService.agendaAlumnoService.numeroWhatsApp$.value,
      waType: 'hsm',
      waTypeMensaje: 8,
      waRecipientType: 'hsm',
      waBody: dataItem.descripcion,
      waCaption: speech,
      idPais: idCodigoPais,
      esMigracion: true,
      idMigracion: 0,
      idPersonal: this._rowActual.idPersonal_Asignado,
      idAlumno: this._rowActual.idAlumno,
      usuario: this._agendaService.userName,
      datosPlantillaWhatsApp:
        this._agendaService.agendaValorEtiquetaService.plantillasWhatsApp,
    };
    this.integraService
      .getJsonResponse(
        `${constApiComercial.WhatsAppMensajeEnviadoValidarPlantillasEnviadas}/${obj.waBody}/${obj.waTo}`
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          if (resp.body) {
            this.enviarPlantillaAutomaticaWhatsApp(obj);
          } else {
            this.alertaService.notificationInfo(
              'Ya se Envio una plantilla Igual a Este Numero'
            );
          }
        },
        error: (error) => {
          this.alertaService.notificationWarning(error.message);
        },
      });
  }
  enviarPlantillaAutomaticaWhatsApp(obj: IEnvioWhatsApp) {
    this.integraService
      .postJsonResponse(
        constApiComercial.WhatsAppMensajeEnviadoWhatsAppMensaje,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp) => {
        },
        error: (error) => {
        },
      });
  }
  validacionReprogramacion$(
    idOportunidad: number,
    idFaseOportunidad: number,
    idActividadDetalle: number
  ): Observable<HttpResponse<IObtenerFaseOportunidad>> {
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaReprogramacionValidacionReprogramacion}/${idOportunidad}/${idFaseOportunidad}/${idActividadDetalle}`
    );
  }
  realizarCambioCentroCosto$(idCentroCosto: number){
    return this.integraService.postJsonResponse(
      `${constApiComercial.AgendaReprogramacionRealizarCambioCentroCosto}/${this._rowActual.idOportunidad}/${idCentroCosto}`, null)
  }
}
