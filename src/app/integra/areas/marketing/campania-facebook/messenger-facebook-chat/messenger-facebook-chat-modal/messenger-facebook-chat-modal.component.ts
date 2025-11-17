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
import { ChatMessengerFacebook } from '@marketing/models/interfaces/messenger-facebook-chat';
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

  // MOCK
  oportunidades: Array<{
    id: number;
    alumno: {
      nombre: string;
      correo: string;
      telefono: string;
      documento: string;
    };
  }> = [];

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

  ngOnInit(): void {
    // Mock de oportunidades
    this.oportunidades = [
      {
        id: 101,
        alumno: {
          nombre: 'Juan Pérez',
          correo: 'juan.perez@email.com',
          telefono: '+51 999888777',
          documento: 'DNI 12345678',
        },
      },
      {
        id: 102,
        alumno: {
          nombre: 'Juan Pérez',
          correo: 'juan.perez@email.com',
          telefono: '+51 999888777',
          documento: 'DNI 12345678',
        },
      },
    ];
  }

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
    this.integraService
      .postJsonResponse(`${constApiMarketing.ObtenerHistorialChatPorPSID}`, {
        identificadorAmbitoPagina: identificadorAmbitoPagina,
      })
      .subscribe({
        next: (data: any) => {
          this.historialChats = data.body as ChatMessengerFacebook[];
          this.shouldScrollChat = true;
        },
        error: (err) => {
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

  // Expansion panel Oportunidad
  onPanelExpanded(expanded: boolean, idx: number) {
    if (expanded) {
      this.panelOpenIndex = idx;
    } else if (this.panelOpenIndex === idx) {
      this.panelOpenIndex = null;
    }
  }
}
