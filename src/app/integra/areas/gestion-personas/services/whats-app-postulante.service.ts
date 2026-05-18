import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { IntegraService } from '@shared/services/integra.service';
import { Injectable } from '@angular/core';
import { AlertaService } from '@shared/services/alerta.service';
import * as signalR from '@microsoft/signalr';
import { environment } from '@environments/environment';
import { UserService } from '@shared/services/user.service';
import {
  ChatAbierto,
  DatosPostulante,
  DatosPostulanteNotificacion,
  InformacionMensajeWhatsappPostulante,
  MensajePlantillaPostulante,
  MensajeTextoPostulante,
  Plantilla,
  WhatsAppHistorialPostulanteMensajes,
  WhatsAppMensajeArchivoPostulante,
  WhatsAppUltimoMensajesPostulante,
} from '@gestionPersonas/models/DatosPostulante';
import { constApiGestionPersonal } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';

export interface InformacionMensajeWhatsapp {
  numero: string;
  idPostulante: string;
  mensaje: string;
  per: number;
}

@Injectable({
  providedIn: 'root',
})
export class WhatsAppPostulanteService {
  loadingTabla$ = new BehaviorSubject<boolean>(true);
  gridHistorialChat$ = new BehaviorSubject<WhatsAppUltimoMensajesPostulante[]>(
    null
  );

  historialChatWhatsApp$ = new BehaviorSubject<
    WhatsAppHistorialPostulanteMensajes[]
  >(null);

  chatAbierta$ = new BehaviorSubject<ChatAbierto>({
    chatAbierto: false,
    idPostulante: 0,
    numero: '',
  });

  validacionUltimoMensaje24Horas$ = new BehaviorSubject<boolean>(false);
  validacionUltimaPlantillaEnviada$ = new BehaviorSubject<boolean>(false);

  plantillaReemplazada$ = new BehaviorSubject<Plantilla>(null);
  confirmacionReemplazo$ = new BehaviorSubject<boolean>(false);

  habilitarBTNWhatsApp$ = new BehaviorSubject<boolean>(false);
  mostrarLoadingWhatsApp$ = new BehaviorSubject<boolean>(false);

  mensajeRecibido$ = new ReplaySubject<InformacionMensajeWhatsappPostulante>(1);

  private sonido = new Audio();
  private _subscriptions$: Subscription = new Subscription();
  private hubConnection: signalR.HubConnection;

  esChatAbierto: ChatAbierto;

  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _userService: UserService
  ) {}

  setChatAbierto(chat: ChatAbierto) {
    this.esChatAbierto = chat;
  }

  getLoadingTabla() {
    return this.loadingTabla$.asObservable();
  }

  getGridHistorialChat() {
    return this.gridHistorialChat$.asObservable();
  }

  getHabilitarBTNWhatsApp() {
    return this.habilitarBTNWhatsApp$.asObservable();
  }

  getLoadingWhatsApp() {
    return this.mostrarLoadingWhatsApp$.asObservable();
  }

  getHistorialChatWhatsApp() {
    return this.historialChatWhatsApp$.asObservable();
  }

  getPlantillaRemplazada() {
    return this.plantillaReemplazada$.asObservable();
  }

  getconfirmacionReemplazo() {
    return this.confirmacionReemplazo$.asObservable();
  }

  getValidacion24Horas() {
    return this.validacionUltimoMensaje24Horas$.asObservable();
  }

  getValidacionPlantillaEnviada() {
    return this.validacionUltimaPlantillaEnviada$.asObservable();
  }

  async listo() {
    this.notificarWhatsapp();
    this.prepararNotificacion();
    this.conectar();
    setInterval(() => {
      this.hubConnection.onclose(async () => {
        await this.startConnection();
      });
    }, 1000);
    setInterval(() => {
      this.revisarConexion();
    }, 50000);
  }

  async conectar() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        `https://integrav4-signalrcore.bsginstitute.com/hubChatWhatsapp_Peru?idUsuario=${this._userService.userData.idPersonal}&usuarioNombre=${this._userService.userData.userName}`
      )
      .withAutomaticReconnect()
      .build();
    this.hubConnection.serverTimeoutInMilliseconds = 300000;
    this.hubConnection.serverTimeoutInMilliseconds = 36000000;
    await this.startConnection();
    // `testMe` invocaba `TestMe` (método debug del hub V1, no existe en V2).
    // Lo dejamos comentado por si vuelve algún día.
    // await this.testMe('HOLA');
  }

  async testMe(mensaje: string): Promise<void> {
    try {
      await this.hubConnection.invoke('TestMe', mensaje);
      this.hubConnection.on('ReceiveMessage', (response: string) => {
        console.log('Mensaje recibido desde el servidor:', response);
      });
    } catch (err) {
      console.error('Error al llamar a TestMe:', err);
    }
  }

  async startConnection(): Promise<void> {
    try {
      await this.hubConnection.start();
      // Hub `hubChatWhatsapp_Peru` espera `AsesorConectado(nombre, id)`.
      // Antes invocaba `OperadorProcesoConectado` (método del hub V1 deprecado).
      this.hubConnection.invoke(
        'AsesorConectado',
        this._userService.userData.userName,
        this._userService.userData.idPersonal
      );

      // this.hubConnection.on('PruebaMensaje', (response: string) => {
      //   console.log('Mensaje recibido desde el postulante:', response);
      //   this._alertaService.mensajeExitoso(
      //     'Mensaje recibido desde el postulante:',
      //     response
      //   );
      // });

      this.hubConnection.on(
        'ResultadoLogeo',
        (conectado: boolean, ConnectionId: string, nombrePersonal: string) => {
          console.log(
            `Conectado?: , ${conectado}' IdConeccion: ${ConnectionId}, Nombre Personal: ${nombrePersonal}`
          );
        }
      );

      this.hubConnection.on(
        'ActualizarChat',
        (IdPersonal: number, numero: string, Area: string) => {
          this.ObtenerHistorialChat(IdPersonal, numero, Area);
        }
      );

      this.hubConnection.on(
        'notificarMensaje',
        (Numero: string, IdPostulante: string, value: string, per: number) => {
          this.mensajeRecibido$.next({
            numero: Numero,
            idPostulante: IdPostulante,
            mensaje: value,
            per: per,
          });
          console.log(Numero, IdPostulante, value, per);
          this.obtenerUltimoMensajeWhatsAppPostulante(
            this._userService.userData.idPersonal
          );
        }
      );
    } catch (err) {
      console.error(`Error while starting connection: ${err}`);
    }
    this.hubConnection.onclose(() => {
      console.log('Connection closed - Componente Whatsapp Postulante');
      setTimeout(() => this.startConnection(), 1000);
    });
  }
  revisarConexion(): void {
    if (this.hubConnection.state === 'Connected') {
      console.log('La conexión está activa Componente CHAT');
    } else {
      console.log('La conexión está inactiva Componente CHAT');
      this.startConnection();
    }
  }

  prepararNotificacion() {
    this.sonido.src = '../../../../../assets/sounds/tono/whatsapp.mp3';
    this.sonido.load();
  }

  reproducirNotificacion() {
    this.sonido.currentTime = 0;
    this.sonido.play();
  }

  notificarWhatsapp(): void {
    const chatAbiertoActual = this.chatAbierta$?.getValue();
    let variable$ = this.mensajeRecibido$.subscribe({
      next: (objWhatsapp) => {
        if (chatAbiertoActual.chatAbierto) {
          if (
            Number(objWhatsapp.idPostulante) != chatAbiertoActual.idPostulante
          ) {
            this.obtenerUltimoMensajeWhatsAppPostulante(
              this._userService.userData.idPersonal
            );
          }
        } else {
          this.obtenerUltimoMensajeWhatsAppPostulante(
            this._userService.userData.idPersonal
          );
        }

        this._integraService
          .post(
            `${constApiGestionPersonal.ObtenerPostulanteInformacion}/${objWhatsapp.idPostulante}`
          )
          .subscribe({
            next: (resp: HttpResponse<DatosPostulanteNotificacion>) => {
              this._alertaService.notificacionWhatsappSuperiorPostulante(
                objWhatsapp,
                resp.body
              );
              this.reproducirNotificacion();
            },
            error: (err) => {
              this._alertaService.notificacionWhatsappSuperiorPostulante(
                objWhatsapp
              );
              this.reproducirNotificacion();
            },
          });
      },
    });
    this._subscriptions$.add(variable$);
  }

  obtenerUltimoMensajeWhatsAppPostulante(idPersonal: number) {
    //this.loadingTabla$.next(true);
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ObtenerUltimoMensajeRecibidosChat}/${idPersonal}`
      )
      .subscribe({
        next: (response: HttpResponse<WhatsAppUltimoMensajesPostulante[]>) => {
          this.gridHistorialChat$.next(response.body);
          this.loadingTabla$.next(false);
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
          this.loadingTabla$.next(false);
        },
      });
  }

  remplazoEtiqueta(JsonData: any) {
    this.habilitarBTNWhatsApp$.next(true);
    this.mostrarLoadingWhatsApp$.next(true);
    this._integraService
      .postJsonResponse(
        constApiGestionPersonal.GenerarPlantillaGPWhatsapp,
        JSON.stringify(JsonData)
      )
      .subscribe({
        next: (response: HttpResponse<Plantilla>) => {
          if (response.body && response.body.plantilla) {
            this.plantillaReemplazada$.next(response.body);
            this.habilitarBTNWhatsApp$.next(false);
            this.confirmacionReemplazo$.next(true);
            this.mostrarLoadingWhatsApp$.next(false);
            console.log('Reemplazo exitoso:', response.body.plantilla);
          } else {
            this.habilitarBTNWhatsApp$.next(false);
            this.mostrarLoadingWhatsApp$.next(false);
            console.log('no se realizo el remplazo');
          }
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.habilitarBTNWhatsApp$.next(false);
          this.mostrarLoadingWhatsApp$.next(false);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  // validacionUltimoMensaje24Horas$ = new BehaviorSubject<boolean>(false);
  // validacionUltimaPlantillaEnviada$ = new BehaviorSubject<boolean>(false);
  ValidarMensajeRecibido24Horas(numero: string) {
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ObtenerValidacionMensajeRecibido24Horas}/${numero}`
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.validacionUltimoMensaje24Horas$.next(response.body);
        },
        error: (error: any) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  ValidarUltimaPlantillaEnviada(plantilla: string, numero: string) {
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ObtenerValicacionUltimaPlantillaEnviada}/${plantilla}/${numero}`
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if (response.body) {
            this._alertaService.mensajeExitoso('Mensaje enviado con exito');
            this.validacionUltimaPlantillaEnviada$.next(response.body);
          } else {
            this._alertaService.addInfo(
              'Plantilla Enviada',
              'Seleccione otra plantilla'
            );
            this.validacionUltimaPlantillaEnviada$.next(response.body);
          }
        },
        error: (error: any) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  // habilitarBTNWhatsApp$ = new BehaviorSubject<boolean>(false);
  // mostrarLoadingWhatsApp$ = new BehaviorSubject<boolean>(false);
  //historialChatWhatsApp$ = new BehaviorSubject<WhatsAppHistorialPostulanteMensajes>(null)
  ObtenerHistorialChat(IdPersonal: number, numero: string, Area: string) {
    this.habilitarBTNWhatsApp$.next(true);
    this.mostrarLoadingWhatsApp$.next(true);
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ObtenerWhatsAppHistorialMensajeChat}/${IdPersonal}/${numero}/${Area}`
      )
      .subscribe({
        next: (
          response: HttpResponse<WhatsAppHistorialPostulanteMensajes[]>
        ) => {
          const historial = response.body || [];

          if (historial.length > 0) {
            this.historialChatWhatsApp$.next(historial);
          } else {
            console.log('No se encontró historial de chat.');
          }

          this.habilitarBTNWhatsApp$.next(false);
          this.mostrarLoadingWhatsApp$.next(false);
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.habilitarBTNWhatsApp$.next(false);
          this.mostrarLoadingWhatsApp$.next(false);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  enviarMensajeApigraphWhatsappTexto$(mensaje: MensajeTextoPostulante) {
    return this._integraService.postJsonResponse(
      constApiGestionPersonal.EnviarMensajeTextoPostulante,
      mensaje
    );
  }
  enviarMensajeApigraphWhatsappPlantilla$(mensaje: MensajePlantillaPostulante) {
    return this._integraService.postJsonResponse(
      constApiGestionPersonal.EnviarPlantillaPostulante,
      mensaje
    );
  }

  adjuntarArchivoChatWhatsapp$(archivo: FormData) {
    return this._integraService.postFormJson(
      constApiGestionPersonal.AdjuntarArchivoWhatsAppPostulante,
      archivo
    );
  }

  enviarMensajeApigraphWhatsappArchivo$(
    mensaje: WhatsAppMensajeArchivoPostulante
  ) {
    return this._integraService.postJsonResponse(
      constApiGestionPersonal.EnvioArchivoWhatsAppPostulante,
      mensaje
    );
  }

  // validacionUltimoMensaje24Horas$ = new BehaviorSubject<boolean>(false);
  // validacionUltimaPlantillaEnviada$ = new BehaviorSubject<boolean>(false);
  ValidarMensajeRecibido24Horasv2(numero: string) {
    return this._integraService.getJsonResponse(
      `${constApiGestionPersonal.ObtenerValidacionMensajeRecibido24Horas}/${numero}`
    );
  }

  ValidarUltimaPlantillaEnviadav2(plantilla: string, numero: string) {
    return this._integraService.getJsonResponse(
      `${constApiGestionPersonal.ObtenerValicacionUltimaPlantillaEnviada}/${plantilla}/${numero}`
    );
  }

  remplazoEtiquetaV2(JsonData: any) {
    this.habilitarBTNWhatsApp$.next(true);
    this.mostrarLoadingWhatsApp$.next(true);
    return this._integraService.postJsonResponse(
      constApiGestionPersonal.GenerarPlantillaGPWhatsapp,
      JSON.stringify(JsonData)
    );
  }
}
