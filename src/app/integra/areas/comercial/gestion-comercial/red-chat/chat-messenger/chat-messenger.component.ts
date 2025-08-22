import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-messenger',
  templateUrl: './chat-messenger.component.html',
  styleUrls: ['./chat-messenger.component.scss']
})
export class ChatMessengerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  historialMensajeRecibidosChat: any = null;
  nombreCompletoAlumno: string = 'Cargando...';

  public onTabSelect(e: any): void {
    console.log(e);
  }
}
