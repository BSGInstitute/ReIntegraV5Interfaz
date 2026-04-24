import { Component, OnInit } from '@angular/core';
import { constApiMarketing } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewChild, TemplateRef } from '@angular/core';
import {
  ChatMessengerFacebook,
  ResumenMessengerFacebookChat,
} from '@marketing/models/interfaces/messenger-facebook-chat';
import { AlertaService } from '@shared/services/alerta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-messenger-facebook-chat',
  templateUrl: './messenger-facebook-chat.component.html',
  styleUrls: ['./messenger-facebook-chat.component.scss'],
})
export class MessengerFacebookChatComponent implements OnInit {
  grillaResumenMessengerFacebookChat: ResumenMessengerFacebookChat[] = [];
  loading: boolean = false;

  // Variables para el modal de chat
  showModalChat: boolean = false;
  chatData: ChatMessengerFacebook[] = null;
  IdentificadorAmbitoPagina: string = null;

  // Variables para filtro de fechas y tipo
  fechaInicio: Date;
  fechaFin: Date;
  tipo: string = 'entrante';
  @ViewChild('dialogFiltroCalendario')
  dialogFiltroCalendario!: TemplateRef<any>;
  dialogRef: any;
  dialogFechaInicio: Date | null = null;
  dialogFechaFin: Date | null = null;

  // Variables para busqueda por ID
  busquedaId: string = '';
  busquedaIdValida: boolean = false;

  constructor(
    private integraService: IntegraService,
    private dialog: MatDialog,
    private _alertaService: AlertaService
  ) {
    // Setear fechas por defecto: hoy 00:00:00 y hoy fin de día
    const hoy = new Date();
    this.fechaInicio = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
      0,
      0,
      0
    );
    this.fechaFin = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
      23,
      59,
      59
    );
  }

  ngOnInit(): void {
    this.ObtenerGrillaMessengerFacebookChat();
  }

  ObtenerGrillaMessengerFacebookChat(): void {
    this.loading = true;
    const inicioStr = this.fechaInicio.toISOString();
    const finStr = this.fechaFin.toISOString();
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerGrillaMessengerFacebookChat}?fechaInicio=${inicioStr}&fechaFin=${finStr}&tipo=${this.tipo}`
      )
      .subscribe({
        next: (data: any) => {
          this.grillaResumenMessengerFacebookChat =
            data.body as ResumenMessengerFacebookChat[];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching Messenger Facebook Chat grid:', err);
          this._alertaService.notificationError('Error al obtener datos');
          this.loading = false;
        },
      });
  }

  abrirModalChat(data: string | ResumenMessengerFacebookChat, origenBusqueda?: boolean) {
    if (origenBusqueda) {
      const identificador = data as string;
      this.integraService
        .postJsonResponse(`${constApiMarketing.ObtenerHistorialChatPorPSID}`, {
          identificadorAmbitoPagina: identificador,
        })
        .subscribe({
          next: (response: any) => {
            if (response.body && response.body.length > 0) {
              this.IdentificadorAmbitoPagina = identificador;
              this.showModalChat = true;
            } else {
              this._alertaService.notificationError(
                'No se encontró historial de chat para el identificador'
              );
            }
          },
          error: (err) => {
            if (err.status === 404) {
              this._alertaService.notificationError(
                'No se encontró historial de chat para el identificador'
              );
            } else {
              this._alertaService.notificationError(
                'Error al buscar chat por ID'
              );
            }
          },
        });
    } else {
      const item = data as ResumenMessengerFacebookChat;
      this.IdentificadorAmbitoPagina = item.identificadorAmbitoPagina;
      this.showModalChat = true;
      if (item.requiereDerivacion) {
        Swal.fire({
          position: 'center',
          html: `${item.mensajeParaAsesor}`,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  }

  cerrarModalChat() {
    this.showModalChat = false;
    this.IdentificadorAmbitoPagina = null;
  }

  abrirDialogFiltroCalendario() {
    this.dialogFechaInicio = null;
    this.dialogFechaFin = null;
    this.dialogRef = this.dialog.open(this.dialogFiltroCalendario);
  }
  cerrarDialogFiltroCalendario() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
  setHoy() {
    const hoy = new Date();
    this.dialogFechaInicio = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
      0,
      0,
      0
    );
    this.dialogFechaFin = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
      23,
      59,
      59
    );
  }
  setAyer() {
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    this.dialogFechaInicio = new Date(
      ayer.getFullYear(),
      ayer.getMonth(),
      ayer.getDate(),
      0,
      0,
      0
    );
    this.dialogFechaFin = new Date(
      ayer.getFullYear(),
      ayer.getMonth(),
      ayer.getDate(),
      23,
      59,
      59
    );
  }
  aplicarFiltroCalendario() {
    if (this.puedeAplicarFiltro()) {
      this.fechaInicio = this.dialogFechaInicio!;
      const finDia = this.dialogFechaFin!;
      this.fechaFin = new Date(
        finDia.getFullYear(),
        finDia.getMonth(),
        finDia.getDate(),
        23,
        59,
        59
      );
      this.cerrarDialogFiltroCalendario();
      this.ObtenerGrillaMessengerFacebookChat();
    }
  }

  puedeAplicarFiltro(): boolean {
    return !!(this.dialogFechaInicio && this.dialogFechaFin);
  }

  cambiarTipo(nuevoTipo: string) {
    if (this.tipo !== nuevoTipo) {
      this.tipo = nuevoTipo;
      this.ObtenerGrillaMessengerFacebookChat();
    }
  }

  reloadGrilla() {
    this.ObtenerGrillaMessengerFacebookChat();
  }

  validarBusquedaId() {
    // Solo dígitos, no espacios, no letras, no especiales
    const regex = /^\d+$/;
    this.busquedaIdValida = !!this.busquedaId && regex.test(this.busquedaId);
  }
}
