import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { IAlumnoInformacion } from '@comercial/models/interfaces/iagenda-datos-alumno';
import { constApiComercial, constApiGlobal, constApiOperaciones } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { ReplaySubject, Subscription, Observable } from 'rxjs';
import { AgendaService } from './agenda.service';

import {
  CorreoRecibido,
  IDataEnvioWhatsappComercial,
  ListaCorreo,
  WhatsAppMensajeArchivoCom,
  MensajePlantilla,
  MensajeTexto,
  ContenidoPlantillaCompleta,
  ListaMensajeWhatsapp,
  MensajeWhatsapp,
  PlantillaInformacion,
} from '@comercial/models/interfaces/iagenda-historial-chat';
import { AlertaService } from '@shared/services/alerta.service';
@Injectable()
export class AgendaHistorialChatsService {
  constructor(
    private integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}
  private agendaService: AgendaService;
  private _subscriptions$: Subscription = new Subscription();
  private _subscriptionsFicha$: Subscription = new Subscription();

  correoRecibidos$ = new ReplaySubject<CorreoRecibido>(1);
  private rowActual: IRowActual;
  async setAgendaService(agendaService: AgendaService) {
    this.agendaService = agendaService;
    await this.ready();
  }
  async ready() {}
  async resetService() {
    await this.resetFicha();
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = new Subscription();
  }
  async initFicha() {
    this.rowActual = this.agendaService.rowActual;
  }
  async resetFicha() {
    this._subscriptionsFicha$.unsubscribe();
    this._subscriptionsFicha$ = new Subscription();
    this.correoRecibidos$ = new ReplaySubject<CorreoRecibido>(1)
  }
  cargarHistorialCorreo(alumno: IAlumnoInformacion) {
    let filtro = {
      idAsesor: this.rowActual.idPersonal_Asignado,
      filtroKendo: {
        filters: [
          {
            field: 'remitente',
            operator: 'contains',
            value: alumno.email1,
          },
        ],
        logic: 'and',
      },
      folder: 'inbox',
      idAlumno: alumno.id,
      pageSize: 1000,
      skip: 0,
      page: 1,
      take: 1000
    };
    let sub$ = this.integraService
      .obtenerPorFiltro(constApiComercial.CorreoObtenerCorreoRecibido, filtro)
      .subscribe({
        next: (response: HttpResponse<CorreoRecibido>) => {
          if (response.body) {
            this.correoRecibidos$.next(response.body);
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptions$.add(sub$);
  }
  obtenerUltimoMensajePortalChat$(
    idAsesor: number,
    idAlumno: number
  ) {
    return this.integraService.getJsonResponse(
      `${constApiGlobal.ChatDetalleIntegraObtenerHistorialChatPortal}/${idAsesor}/${idAlumno}`
    );
  }


  obtenerInformacionGmail$(idCorreo: any) {
    const idAsesor: any = this.rowActual.idPersonal_Asignado;
    return this.integraService.getJsonResponse(
      `${constApiComercial.CorreoObtenerInformacionGmail}?idCorreo=${idCorreo}&idAsesor=${idAsesor}&folder=inbox`
    );
  }
  obtenerCorreosEnviadosSpeech$(
    dataItem: ListaCorreo
  ) {
    return this.integraService.getJsonResponse(
      `${constApiComercial.CorreoObtenerCorreosEnviadosSpeech}/${dataItem.destinatarios}/${dataItem.messageId}`
    );
  }
  obtenerInteraccionesCorreosEnviados$(
    dataItem: ListaCorreo
  ) {
    return this.integraService.getJsonResponse(
      `${constApiComercial.CorreoObtenerInteraccionesCorreosEnviados}/${dataItem.idAlumno}/${dataItem.idPersonal}/${dataItem.messageId}`
    );
  }

  obtenerHistorialMensajeRecibidosChat$(celular: string): Observable<HttpResponse<ListaMensajeWhatsapp[]>> {
    const idPersonal = this.rowActual.idPersonal_Asignado;
    const areaTrabajo = this.agendaService.areaTrabajo;
    return this.integraService.getJsonResponse(
      `${constApiComercial.WhatsAppMensajeEnviadoHistorialMensajeRecibidosChat}/${idPersonal}/${celular}/${areaTrabajo}`
    );
  }
  obtenerHistorialMensajeChat$(
    celular: string
  ): Observable<HttpResponse<MensajeWhatsapp[]>> {
    const idPersonal = this.rowActual.idPersonal_Asignado
    const areaTrabajo = this.agendaService.areaTrabajo
    return this.integraService.getJsonResponse(
      `${constApiComercial.WhatsAppMensajeEnviadoWhatsAppHistorialMensajeChat}/${idPersonal}/${celular}/${areaTrabajo}`
    );
  }
  validarMensajeEnviadoEn24Horas$(
    celular: string, idPersonal : number, idPais:number, idPersonalAsignado : number
  ): Observable<HttpResponse<boolean>> {
    return this.integraService.getJsonResponse(
      `${constApiOperaciones.WhatsAppMensajesValidarMesajesEnviadosEn24HorasComercial}/${celular}/${idPersonal}/${idPais}/${idPersonalAsignado}`
    );
  }
  enviarMensajeWhatsapp$(
    mensaje: IDataEnvioWhatsappComercial
  ) {
    return this.integraService.postJsonResponse(
      constApiOperaciones.WhatsAppMensajesEnviarMensajeWhatsappComercial, mensaje
    );
  }
  enviarMensajeApigraphWhatsappTexto$(
    mensaje: MensajeTexto
  ) {
    return this.integraService.postJsonResponse(
      constApiComercial.WhatsAppMensajeEnviadoApiComercialWhatsAppMensajeTexto, mensaje
    );
  }
  enviarMensajeApigraphWhatsappPlantilla$(
    mensaje: MensajePlantilla
  ) {
    return this.integraService.postJsonResponse(
      constApiComercial.WhatsAppMensajeEnviadoApiComercialEnvioPlantilla, mensaje
    );
  }
  enviarMensajeApigraphWhatsappArchivo$(
    mensaje: WhatsAppMensajeArchivoCom
  ) {
    return this.integraService.postJsonResponse(
      constApiComercial.WhatsAppMensajeEnviadoApiComercialEnvioArchivo, mensaje
    )
  }
  validarNumeroWhatsAppContacto$(
    idPais: number,
    contenido: {
      blocking: string,
      contacts: string[]
    }
  ) {
    const idPersonal = this.rowActual.idPersonal_Asignado;
    return this.integraService.postJsonResponse(
      `${constApiComercial.WhatsAppContactoWhatsAppValidarNumeros}/${idPersonal}/${idPais}`, contenido
    )
  }
  validarPlantillEnviadaWhatsapp$(
    mensaje: string,
    celular: string
  ) {
    return this.integraService.getJsonResponse(
      `${constApiComercial.WhatsAppMensajeEnviadoValidarPlantillasEnviadas}/${mensaje}/${celular}`
    )
  }
  verificarNumeroValidadoWhatsapp$(
    contenido:any
  ) {
    return this.integraService.postJsonResponse(
        constApiComercial.WhatsAppNumeroValidadoVerificarInsertarNumeroValidado, contenido
    )
  }
  obtenerPlantillaIniciarChatWhatsapp$(): Observable<HttpResponse<PlantillaInformacion[]>> {
    return this.integraService.getJsonResponse(
      constApiComercial.AgendaInformacionActividadObtenerPlantillaWhatsAppComercial
    )
  }
  generarPlantillaWhatsappComercial$(
    idOportunidad: number,
    idPlantilla: number
  ): Observable<HttpResponse<ContenidoPlantillaCompleta>> {
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaGenerarPlantillaWhatsappComercial}/${idOportunidad}/${idPlantilla}`
    )
  }
  adjuntarArchivoChatWhatsapp$(
    archivo: FormData
  ) {
    return this.integraService.postFormJson(
      constApiOperaciones.WhatsAppMensajeRecibidoAdjuntarArchivoWhatsApp,
      archivo
    )
  }
  consultarPlantillaEnviadaEn24Hrs$(
    descripcion: string,
    celular: string,
    idPersonal : number, 
    idPais:number, 
    idPersonalAsignado : number
  ) {
    return this.integraService
      .getJsonResponse(
        `${constApiOperaciones.WhatsAppMensajesValidarPlantillasEnviadasComercial}/${descripcion}/${celular}/${idPersonal}/${idPais}/${idPersonalAsignado}`
      )
  }
  validarMesajeRecibidosApiComercial$(
    celular: string
  ): Observable<HttpResponse<boolean>> {
    return this.integraService
      .getJsonResponse(
        `${constApiOperaciones.WhatsAppMensajesValidarMesajeRecibidosApiComercial}/${celular}`
      )
  }
  obtenerValoresEtiquetaWhatsapp$(
    idOportunidad: number
  ): Observable<HttpResponse<{
    alumnoNombre1: string
    personalNombreCompleto: string
    pgeneralNombre: string
  }>> {
    return this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaActividadObtenerValoresEtiquetaWhatsapp}/${idOportunidad}`
      )
  }
}
