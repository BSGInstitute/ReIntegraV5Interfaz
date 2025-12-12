import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class WebinarSignalrService {

  private hubConnection!: signalR.HubConnection;

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7288/webinarHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .catch(err => console.log('Error al conectar SignalR: ', err));
  }

  onAsistenciaRegistrada(callback: (data: any) => void) {
    this.hubConnection.on('AsistenciaRegistrada', callback);
  }
}
