import { Component, OnInit } from '@angular/core';
import { constApiMarketing } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-messenger-facebook-chat',
  templateUrl: './messenger-facebook-chat.component.html',
  styleUrls: ['./messenger-facebook-chat.component.scss']
})
export class MessengerFacebookChatComponent implements OnInit {
  grillaResumenMessengerFacebookChat: ResumenMessengerFacebookChat[] = [];
  loading: boolean = false;

  showModal: boolean = false;
  chatData: any = null;

  constructor(private integraService: IntegraService) { }

  ngOnInit(): void {
    this.ObtenerGrillaMessengerFacebookChat();
  }

  ObtenerGrillaMessengerFacebookChat(): void {
    this.loading = true;
    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerGrillaMessengerFacebookChat}?fechaInicio=2025-11-12&fechaFin=2026-11-19&tipo=todas`)
      .subscribe({
        next: (data: any) => {
          this.grillaResumenMessengerFacebookChat = data.body as ResumenMessengerFacebookChat[];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching Messenger Facebook Chat grid:', err);
          this.loading = false;
        }
      });
  }

  abrirModalChat(data: any) {
    this.chatData = data;
    this.showModal = true;
  }

  cerrarModalChat() {
    this.showModal = false;
    this.chatData = null;
  }
}

 interface ResumenMessengerFacebookChat {
  IdentificadorAmbitoPagina: string;
  IdAlumno: number | null; 
  NombreAlumno: string;
  NombrePagina: string;
  TipoMensaje: string;
  Contenido: string | null;
  FechaMensaje: Date; 
}