import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})
export class WebinarSignalrService {

    private hubConnection!: signalR.HubConnection;

    startConnection() {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${environment.urlSignal}hubIntegraHub`
                + `?idUsuario=WebHook&usuarioNombre=WebHook&rooms=''`
            )
            .withAutomaticReconnect()
            .build();

        this.hubConnection.start()
            .catch(err => console.log('Error al conectar SignalR: ', err));
    }

    onAsistenciaRegistrada(callback: (data: any) => void) {
        this.hubConnection.on('AsistenciaRegistradaWebinar', callback);
    }
}
