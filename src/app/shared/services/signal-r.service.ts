import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  hubConnection: any;
  idUsuario = 4922018;
  usuarioNombre = '';
  rooms = ['', '', '', '', '', '', ''];
  // //produccion
  urlSignalBase ='https://integrav4-signalrcore.bsginstitute.com/';
  //local
  //urlSignalBase = 'https://integrav4-signalrcore.bsginstitute.com/';
  //'https://integrav4-signalr.bsginstitute.com/signalr/hubs';
  // urlSignal = environment.urlSignal;

  constructor() {}

  connection(name:string,idUsuario:number,usuarioNombre:string):signalR.HubConnectionBuilder {
    
    const urlSignal = `${this.urlSignalBase}`;
    console.log(urlSignal,'moralesssss')
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withAutomaticReconnect()
      .withUrl(
        urlSignal+name+'?idUsuario='+idUsuario+'&&usuarioNombre='+usuarioNombre+'&&rooms="""'
      )
      .build();
      this.hubConnection.serverTimeoutInMilliseconds = 36000000;
    //this.hubConnection.invoke('notificacionSolicitudBeneficio',1);
        return this.hubConnection;
  }

  // //   app.MapHub<IntegraHub>("/hubIntegraHub");
  // // app.MapHub<ChatFacebookHub>("/hubChatFacebookHub");
  // // app.MapHub<ChatHub>("/hubChatHub");
  // // app.MapHub<ChatInstagramHub>("/hubChatInstagramHub");
  // // app.MapHub<ChatWhatsapp_Peru>("/hubChatWhatsapp_Peru");
  connectionIntegraHub() {}
  connectionChatFacebookHub() {}

  connectionChatHub() {}

  connectionChatInstagramHub() {}
 
  connectionChatWhatsapp_Peru() {
    const urlSignal = `${this.urlSignalBase}/hubChatWhatsapp_Peru`;
    // this.hubConnection = new signalR.HubConnectionBuilder()
    //   .withAutomaticReconnect()
    //   .withUrl(
    //     this.urlSignal +
    //       '/hubChatWhatsapp_Peru?idUsuario=' +
    //       this.idUsuario +
    //       '&&usuarioNombre=' +
    //       this.usuarioNombre +
    //       '&&rooms=' +
    //       this.rooms +
    //       ''
    //   )
    //   .build();
  }
}
