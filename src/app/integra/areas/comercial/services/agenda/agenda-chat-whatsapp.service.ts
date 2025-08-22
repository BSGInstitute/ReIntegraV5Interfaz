import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { AgendaService } from './agenda.service';
import * as signalR from '@microsoft/signalr';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiOperaciones } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { environment } from '@environments/environment';
import { RingoverSDKService } from '@shared/services/ringover-sdk.service';

export interface InformacionMensajeWhatsapp {
  numero: string;
  idAlumno: string;
  mensaje: string;
  per: number;}
export interface InformacionAlumnoWhatsapp {
  tab: string;
  alumno: string;
  faseOportunidad: string;
}
@Injectable()
export class AgendaChatWhatsappService {
  constructor(
    private _alertaService: AlertaService,
    private _integraService: IntegraService,
    private _ringoverSDKService: RingoverSDKService
  ) {}
  private _agendaService: AgendaService;
  private _subscriptions$: Subscription = new Subscription();
  private _subscriptionsFicha$: Subscription = new Subscription();
  private sonido = new Audio();
  private hubConnection: signalR.HubConnection;
  objetoMensaje$ = new ReplaySubject<InformacionMensajeWhatsapp>(1);
  async setAgendaService(agendaService: AgendaService) {
    this._agendaService = agendaService;
    this.ready();
  }
  async ready(){
    if(this._agendaService.esWhatsappCorreos){
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
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        `${environment.urlSignal}hubChatWhatsapp_Peru?idUsuario=${this._agendaService.idPersonal}&usuarioNombre=${this._agendaService.userName}&rooms=""`
      )
      .withAutomaticReconnect()
      .build();
    this.hubConnection.serverTimeoutInMilliseconds = 300000;
    this.hubConnection.serverTimeoutInMilliseconds = 36000000;
    await this.startConnection();
  }
  async startConnection(): Promise<void> {
    try {
      await this.hubConnection.start();
      this.hubConnection.invoke(
        'AsesorConectado',
        this._agendaService.userName,
        this._agendaService.idPersonal
      );
      this.hubConnection.on(
        'notificarMensaje',
        (Numero: string, IdAlumno: string, value: string, per: number) => {
          this.objetoMensaje$.next({
            numero: Numero,
            idAlumno: IdAlumno,
            mensaje: value,
            per: per
          })
        }
      );
      this.hubConnection.on(
        'mostrarLlamadaringover',
        (valor: string) => {
          this._alertaService.mensajeExitosoPrueba(valor);
          if(valor=="HUMAN" ){//DEJA QUE LA LLAMADA CONTINUE

          }
          else if(valor=="MACHINE"){
            this._ringoverSDKService.colgarLlamada();
          }
          else{//NOT SURE Y VACIOS

          }


        }
      );
    } catch (err) {
      console.error(
        `Error while starting connection: ${err}`
      );
    }
    this.hubConnection.onclose(() => {
      console.log('Connection closed - Componente Whatsapp Comercial');
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
    this.sonido.src =
      '../../../../../../../../../assets/sounds/tono/whatsapp.mp3';
    this.sonido.load();
  }
  reproducirNotificacion() {
    this.sonido.currentTime = 0;
    this.sonido.play();
  }
  notificarWhatsapp(): void {
    let variable$ = this.objetoMensaje$.subscribe({
      next: (objWhatsapp) => {
        if(this._agendaService.esFichaAbierta == true){
          if(Number(objWhatsapp.idAlumno) != this._agendaService.rowActual.idAlumno){
            this._agendaService.agendaActividadesService.obtenerWhatsapp(null);
          }
        }else{
          this._agendaService.agendaActividadesService.obtenerWhatsapp(null);
        }
        this._integraService.getJsonResponse(`${constApiOperaciones.AlumnoObtenerInformacionAlumno}/${objWhatsapp.idAlumno}`)
        .subscribe({
          next: (resp: HttpResponse<InformacionAlumnoWhatsapp>) => {
            this._alertaService.notificacionWhatsappSuperior(objWhatsapp, resp.body);
            this.reproducirNotificacion();
          },
          error: (err) => {
            this._alertaService.notificacionWhatsappSuperior(objWhatsapp);
            this.reproducirNotificacion();
          }
        })
      }
    });
    this._subscriptions$.add(variable$);
  }
}
