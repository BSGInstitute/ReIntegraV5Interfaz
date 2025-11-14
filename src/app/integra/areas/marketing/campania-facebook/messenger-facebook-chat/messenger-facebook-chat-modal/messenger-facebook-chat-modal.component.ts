import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
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
export class MessengerFacebookChatModalComponent implements OnInit {
  @Input() identificadorAmbitoPagina: string;
  @Output() close = new EventEmitter<void>();

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

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (
  //     changes['identificadorAmbitoPagina'] &&
  //     this.identificadorAmbitoPagina
  //   ) {
  //     this.obtenerHistorialChatPorPSId(this.identificadorAmbitoPagina);
  //   }
  // }

  obtenerHistorialChatPorPSId(identificadorAmbitoPagina: string) {
    if (!identificadorAmbitoPagina) return;
    this.integraService
      .postJsonResponse(`${constApiMarketing.ObtenerHistorialChatPorPSID}`, {
        identificadorAmbitoPagina: identificadorAmbitoPagina,
      })
      .subscribe({
        next: (data: any) => {
          this.historialChats = data.body as ChatMessengerFacebook[];
        },
        error: (err) => {
          this._alertaService.notificationError('Error al buscar chat por ID');
          console.error('Error buscando chat por ID:', err);
        },
      });
  }

  // Expansion panel
  onPanelExpanded(expanded: boolean, idx: number) {
    if (expanded) {
      this.panelOpenIndex = idx;
    } else if (this.panelOpenIndex === idx) {
      this.panelOpenIndex = null;
    }
  }
}
