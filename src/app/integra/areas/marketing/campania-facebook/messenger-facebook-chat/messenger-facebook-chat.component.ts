import { Component, OnInit } from '@angular/core';
import { constApiMarketing } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-messenger-facebook-chat',
  templateUrl: './messenger-facebook-chat.component.html',
  styleUrls: ['./messenger-facebook-chat.component.scss'],
})
export class MessengerFacebookChatComponent implements OnInit {
  grillaResumenMessengerFacebookChat: ResumenMessengerFacebookChat[] = [];
  loading: boolean = false;

  showModal: boolean = false;
  chatData: any = null;

  // Variables para filtro de fechas y tipo
  fechaInicio: Date;
  fechaFin: Date;
  tipo: string = 'saliente';

  @ViewChild('dialogFiltroCalendario')
  dialogFiltroCalendario!: TemplateRef<any>;
  dialogRef: any;
  dialogFechaInicio: Date | null = null;
  dialogFechaFin: Date | null = null;

  constructor(
    private integraService: IntegraService,
    private dialog: MatDialog
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
          this.loading = false;
        },
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

  puedeAplicarFiltro(): boolean {
    return !!(this.dialogFechaInicio && this.dialogFechaFin);
  }

  aplicarFiltroCalendario() {
    console.log(this.dialogFechaInicio);
    console.log(this.dialogFechaFin);
    if (this.puedeAplicarFiltro()) {
      this.fechaInicio = this.dialogFechaInicio!;
      this.fechaFin = this.dialogFechaFin!;
      this.cerrarDialogFiltroCalendario();
      this.ObtenerGrillaMessengerFacebookChat();
    }
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

  busquedaId: string = '';
  busquedaIdValida: boolean = false;

  validarBusquedaId() {
    // Solo dígitos, no espacios, no letras, no especiales
    const regex = /^\d+$/;
    this.busquedaIdValida = !!this.busquedaId && regex.test(this.busquedaId);
  }

  buscarChatPorId() {
    if (!this.busquedaIdValida) return;
    this.loading = true;
    this.integraService
      .postJsonResponse(`${constApiMarketing.ObtenerHistorialChatPorPSID}`, {
        psid: this.busquedaId,
      })
      .subscribe({
        next: (data: any) => {
          this.loading = false;
          this.chatData = data.body;
          this.showModal = true;
        },
        error: (err) => {
          this.loading = false;
          console.error('Error buscando chat por ID:', err);
        },
      });
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
