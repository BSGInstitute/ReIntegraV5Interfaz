import { Injectable } from '@angular/core';
import { AgendaService } from './agenda.service';

import { constApiOperaciones } from '@environments/constApi';
import { environment } from '@environments/environment';
import * as signalR from '@microsoft/signalr';
import { HttpResponse } from '@microsoft/signalr';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { ReplaySubject, Subscription } from 'rxjs';
import { ReconexionChatComercialService } from './reconexion-chat-comercial.service';

export interface InformacionMensajeChatPortal {
  numero: string;
  idAlumno: string;
  value: string;
  per: number
  from:string;
  }
export interface InformacionAlumnoChatPortal {
  tab: string;
  alumno: string;
  faseOportunidad: string;
}
export interface MensajeChat {
  capitulo:string | null;
  celular: string | null;
  centrocosto: string | null;
  codigoAlumno: string | null;
  coordinadora: string | null;
  correo: string | null;
  from: string;
  id: string;
  idMatriculaCabecera: string | null;
  idalumno: string | null;
  nombreAlumno: string | null;
  nombrepgeneral: string | null;
  nombrepgeneralcurso: string | null;
  per: number;
  sesion: string | null;
  value: string;
}
@Injectable({
  providedIn: 'root'
})
export class AgendaChatPortalWebService {
  constructor(
    private _alertaService: AlertaService,
    private _integraService: IntegraService,
  ) {}
  private _agendaService: AgendaService;
  private _subscriptions$: Subscription = new Subscription();
  private _subscriptionsFicha$: Subscription = new Subscription();
  private sonido = new Audio();
  private hubConnectionChatPortal: signalR.HubConnection;
  objetoMensaje$ = new ReplaySubject<InformacionMensajeChatPortal>(1);
  chatFichaMensaje$ = new ReplaySubject<MensajeChat>(1);
  async setAgendaService(agendaService: AgendaService) {
    this._agendaService = agendaService;
    this.ready();
  }
 
  async ready(){
    if(this._agendaService.esWhatsappCorreos){
      this.notificarChatPortal();
      this.prepararNotificacion();
      // this.conectar();
      // setInterval(() => {
      //   this.hubConnectionChatPortal.onclose(async () => {
      //     await this.startConnection();
      //   });
      // }, 1000);
      // setInterval(() => {
      //   this.revisarConexion();
      // }, 50000);
    }
    // this._reconexionChatComercial.closeModalOportunidadComercial$.subscribe(() => {
    //   this.conectar();
    // });
  }

  async initFicha(){}

  async resetService(){
    if(this._agendaService.esWhatsappCorreos){
      this._subscriptions$ = new Subscription();
      this._subscriptions$.unsubscribe();
    }
  }

  async resetFicha(){}

  async conectar() {
    this.hubConnectionChatPortal = new signalR.HubConnectionBuilder()
      .withUrl(
        // `${environment.urlSignalPrototpo}hubIntegraHub?idUsuario=${this._agendaService.idPersonal}&usuarioNombre=${this._agendaService.userName}&rooms=""`
        
          `https://signalr-prototipo.bsginstitute.com/hubIntegraHub` +
            "?idUsuario=" +
            this._agendaService.idPersonal +
            "&&usuarioNombre=" +
            this._agendaService.userName +
            '&&rooms="""'
      )
      .withAutomaticReconnect()
      .build();
    this.hubConnectionChatPortal.serverTimeoutInMilliseconds = 300000;
    this.hubConnectionChatPortal.serverTimeoutInMilliseconds = 36000000;
    await this.startConnection();
  }
  async startConnection(): Promise<void> {
    try {
      await this.hubConnectionChatPortal.start();
      this.hubConnectionChatPortal.invoke(
        'asesorConectadoComercial',
        this._agendaService.userName,
        this._agendaService.idPersonal
      );
      this.hubConnectionChatPortal.on(
        'addMessage',
        (newMessage:any) => {
          // this.objetoMensaje$.next({
          //   // numero: "0",
          //   // idAlumno: newMessage.idalumno,
          //   // value: newMessage.value,
          //   // per: newMessage.from 
          // })
          console.log("notificacionViewComercial", {
            newMessage
          });
        }
      );
      // this.registerNewChats()
    } catch (err) {
      console.error(
        `Error while starting connection: ${err}`
      );
    }
    this.hubConnectionChatPortal.onclose(() => {
      console.log('Connection closed - Componente Chat Portal - Comercial');
      setTimeout(() => this.startConnection(), 1000);
    });
  }
  revisarConexion(): void {
    if (this.hubConnectionChatPortal.state === 'Connected') {
      console.log('La conexión está activa Componente CHAT-Portal');
    } else {
      console.log('La conexión está inactiva Componente CHAT-Portal');
      this.startConnection();
    }
  }
  prepararNotificacion() {
    this.sonido.src =
      '../../../../assets/sounds/tono/chat_notification.mp3';
    this.sonido.load();
    this.sonido.volume = 0.17;
  }
  reproducirNotificacion() {
    this.sonido.currentTime = 0;
    this.sonido.play();
  }
  notificarChatPortal(): void {
    let variable$ = this.objetoMensaje$.subscribe({
      next: (objWhatsapp) => {
        if(this._agendaService.esFichaAbierta == true){
          if(Number(objWhatsapp.idAlumno) != this._agendaService.rowActual.idAlumno){
            // this._agendaService.agendaActividadesService.obtenerChatPortal(null);
          }
        }else{
          // this._agendaService.agendaActividadesService.obtenerChatPortal(null);
        }
        this._integraService.getJsonResponse(`${constApiOperaciones.AlumnoObtenerInformacionAlumno}/${objWhatsapp.idAlumno}`)
        .subscribe({
          next: (resp:any) => {
            if(this._agendaService.esFichaAbierta !== true){
              this._alertaService.notificacionChatPortalSuperior(objWhatsapp, resp.body);
              this.reproducirNotificacion();
            }

          },
          error: (err) => {
            if(this._agendaService.esFichaAbierta !== true){
              this._alertaService.notificacionChatPortalSuperior(objWhatsapp);
            }
            
          }
        })
      }
    });
    this._subscriptions$.add(variable$);
  }

  notificarChatPortalComercial(objetoMensaje:any) {
        if(this._agendaService.esFichaAbierta == true){
          if(Number(objetoMensaje.idalumno) != this._agendaService.rowActual.idAlumno){
            // this._agendaService.agendaActividadesService.obtenerChatPortal(null);
          }
        }else{
          // this._agendaService.agendaActividadesService.obtenerChatPortal(null);
        }
        this._integraService.getJsonResponse(`${constApiOperaciones.AlumnoObtenerInformacionAlumno}/${objetoMensaje.idalumno}`)
        .subscribe({
          next: (resp:any) => {
            if(this._agendaService.esFichaAbierta !== true){
              this._alertaService.notificacionChatPortalSuperior(objetoMensaje, resp.body);
              this.reproducirNotificacion();
            }

          },
          error: (err) => {
            if(this._agendaService.esFichaAbierta !== true){
              this._alertaService.notificacionChatPortalSuperior(objetoMensaje);
            }
            
          }
        })
  }


  // private registerNewChats(): void {
  //   this.hubConnectionChatPortal.on("addMessage", (objNewMessage:MensajeChat) => {
  //     console.log("mensajeNuevoComercial", {
  //       objNewMessage
  //     })
  //     this.chatFichaMensaje$.next(objNewMessage)
  //   });
  // }
  
  //  sendMessage(idChatSesion:string,mensaje:string){
  //   if (this.hubConnectionChatPortal.state === 'Connected') {
  //     this.hubConnectionChatPortal.invoke("opSend", idChatSesion, mensaje, 2);
  //   } else {
  //     console.error("Connection not established. Cannot send message.");
  //   }
  // }
}
