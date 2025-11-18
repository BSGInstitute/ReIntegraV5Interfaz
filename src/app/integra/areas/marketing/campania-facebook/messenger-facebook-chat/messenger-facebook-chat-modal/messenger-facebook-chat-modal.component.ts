import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  AfterViewChecked,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { constApiMarketing } from '@environments/constApi';
import {
  ChatMessengerFacebook,
  EnviarMensajeTextoMessengerFacebook,
} from '@marketing/models/interfaces/messenger-facebook-chat';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
@Component({
  selector: 'app-messenger-facebook-chat-modal',
  templateUrl: './messenger-facebook-chat-modal.component.html',
  styleUrls: ['./messenger-facebook-chat-modal.component.scss'],
})
export class MessengerFacebookChatModalComponent
  implements OnInit, OnChanges, AfterViewChecked
{
  @Input() identificadorAmbitoPagina: string;
  @Output() close = new EventEmitter<void>();
  @ViewChild('chatHistory') chatHistoryRef: ElementRef;
  private shouldScrollChat = false;
  loaderReloadChat: boolean = false;
  historialChats: ChatMessengerFacebook[] = [];
  newMessage: string = '';
  panelOpenIndex: number | null = null;

  // MOCK TEMPORAL
  alumnosPorPSID: any = [
    // {
    //   id: 101,
    //   nombre: 'Juan Pérez',
    //   correo: 'juan.perez@email.com',
    //   telefono: '+51 999888777',
    //   documento: 'DNI 12345678',
    // },
    // {
    //   id: 102,
    //   nombre: 'Juan Pérez',
    //   correo: 'juan.perez@email.com',
    //   telefono: '+51 999888777',
    //   documento: 'DNI 12345678',
    // },
  ];

  constructor(
    private _alertaService: AlertaService,
    private integraService: IntegraService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['identificadorAmbitoPagina'] &&
      this.identificadorAmbitoPagina
    ) {
      this.obtenerHistorialChatPorPSId(this.identificadorAmbitoPagina);
    }
  }

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    if (this.shouldScrollChat && this.chatHistoryRef) {
      try {
        this.chatHistoryRef.nativeElement.scrollTop =
          this.chatHistoryRef.nativeElement.scrollHeight;
      } catch {}
      this.shouldScrollChat = false;
    }
  }

  obtenerHistorialChatPorPSId(identificadorAmbitoPagina: string) {
    if (!identificadorAmbitoPagina) return;
    this.loaderReloadChat = true;

    this.integraService
      .postJsonResponse(`${constApiMarketing.ObtenerHistorialChatPorPSID}`, {
        identificadorAmbitoPagina: identificadorAmbitoPagina,
      })
      .subscribe({
        next: (data: any) => {
          this.historialChats = data.body as ChatMessengerFacebook[];
          this.shouldScrollChat = true;
          this.loaderReloadChat = false;
        },
        error: (err) => {
          this.loaderReloadChat = false;
          this._alertaService.notificationError('Error al buscar chat por ID');
          console.error('Error buscando chat por ID:', err);
        },
      });
  }

  reloadChats() {
    this.loaderReloadChat = true;
    this.integraService
      .postJsonResponse(`${constApiMarketing.ObtenerHistorialChatPorPSID}`, {
        identificadorAmbitoPagina: this.identificadorAmbitoPagina,
      })
      .subscribe({
        next: (data: any) => {
          this.historialChats = data.body as ChatMessengerFacebook[];
          this.loaderReloadChat = false;
        },
        error: (err) => {
          this._alertaService.notificationError('Error al buscar chat por ID');
          this.loaderReloadChat = false;
        },
      });
  }

  enviarMensajeTexto() {
    const mensaje = this.newMessage?.trim();
    if (!mensaje) return;

    const payload: EnviarMensajeTextoMessengerFacebook = {
      PSID: this.identificadorAmbitoPagina,
      TipoMensaje: 'text',
      Contenido: mensaje,
      IdMessengerConfiguracionPagina:
        this.historialChats[this.historialChats.length - 1]
          ?.idMessengerConfiguracionPagina || null,
    };

    this.integraService
      .postJsonResponse(
        `${constApiMarketing.EnviarMensajeTextoMessengerFacebook}`,
        payload
      )
      .subscribe({
        next: (data: any) => {
          this.newMessage = '';
          this.reloadChats();
          data.body.enviado
            ? this._alertaService.notificationSuccess(data.body.mensaje)
            : this._alertaService.notificationWarning(data.body.mensaje);
        },
        error: (err) => {
          this._alertaService.notificationError('Error al enviar el mensaje');
        },
      });
  }

  // Expansion panel Oportunidad
  onPanelExpanded(expanded: boolean, idx: number) {
    if (expanded) {
      this.panelOpenIndex = idx;
    } else if (this.panelOpenIndex === idx) {
      this.panelOpenIndex = null;
    }
  }
}
