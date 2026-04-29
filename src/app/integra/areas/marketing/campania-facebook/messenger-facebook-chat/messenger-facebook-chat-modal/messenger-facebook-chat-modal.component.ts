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
  DatosGeneralesAlumno,
  EnviarMensajeTextoMessengerFacebook,
} from '@marketing/models/interfaces/messenger-facebook-chat';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';

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
  loaderdetalleAlumnosPorPSID: boolean = false;
  historialChats: ChatMessengerFacebook[] = [];
  newMessage: string = '';
  panelOpenIndex: number | null = null;
  alumnosPorPSID: DatosGeneralesAlumno[] = [];

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
    this.ObtenerDatosGeneralesAlumnosPorPSID();
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

  ObtenerDatosGeneralesAlumnosPorPSID() {
    if (!this.identificadorAmbitoPagina) return;
    this.loaderdetalleAlumnosPorPSID = true;

    this.integraService
      .postJsonResponse(
        `${constApiMarketing.ObtenerDatosGeneralesAlumnosPorPSID}`,
        {
          identificadorAmbitoPagina: this.identificadorAmbitoPagina,
        }
      )
      .subscribe({
        next: (data: any) => {
          this.alumnosPorPSID = data.body as DatosGeneralesAlumno[];
          this.loaderdetalleAlumnosPorPSID = false;
        },
        error: (err) => {
          this.loaderdetalleAlumnosPorPSID = false;
          this._alertaService.notificationError(
            'Error al obtener detalle alumnos'
          );
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

  // Capturar Registros IA
  abrirModalFlag: boolean = false;

  emitirCapturarRegistrosIA() {
    this.abrirModalFlag = true;
    setTimeout(() => {
      this.abrirModalFlag = false;
    }, 100);
  }

  abrirModalFlagAlumnoIdx: number = -1;

  emitirCapturarRegistrosIAParaAlumno(idx: number): void {
    this.abrirModalFlagAlumnoIdx = idx;
    setTimeout(() => {
      this.abrirModalFlagAlumnoIdx = -1;
    }, 100);
  }

  desactivarInteraccionIA(idAlumno: number) {
      Swal.fire({
        title:
          '¿Desea desactivar la interacción automática del Asistente Whatsapp?',
        icon: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Desactivar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.loaderdetalleAlumnosPorPSID = true;
  
            this.integraService
              .postJsonResponse(
                `${constApiMarketing.DesactivarInteraccionAutomaticaMessenger}/${this.identificadorAmbitoPagina}/${idAlumno}`,
                null
              )
              .subscribe({
                next: (response: HttpResponse<any>) => {
                  Swal.fire({
                    title: response.body.descripcion,
                    icon: 'success',
                  });
                  this.loaderdetalleAlumnosPorPSID = false;
                  console.log(response);
                },
                error: (error) => {
                  this.loaderdetalleAlumnosPorPSID = false;
                  console.error(
                    'Error al desactivar la interacipon automática:',
                    error
                  );
                  Swal.fire({
                    title: 'Error al desactivar la interacipon automática',
                    icon: 'error',
                  });
                },
              });
          
        }
      });
    }
}
