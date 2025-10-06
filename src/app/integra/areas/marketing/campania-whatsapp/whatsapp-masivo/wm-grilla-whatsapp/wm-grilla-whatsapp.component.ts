import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { MatDialog } from '@angular/material/dialog';
import { RowArgs, RowClassArgs } from '@progress/kendo-angular-grid';
import { WmChatWhatsAppComponent } from '../wm-chat-whatsapp/wm-chat-whatsapp.component';
import { WHATSAPP_MENSAJE_ENVIADO } from '@apiIntegra/marketing/whatsapp/whatsapp-mensaje-enviado';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { ChatWhatsAppMarketing } from '../models/chat-whatsapp-marketing';
import { AlertaService } from '@shared/services/alerta.service';
import { CalendarioWhatsappComponent } from '@marketing/campania-whatsapp/calendario-whatsapp/calendario-whatsapp.component';
import { MenuSelectEvent } from '@progress/kendo-angular-menu';
import { ModalEnviarPlantillaComponent } from './modal-enviar-plantilla/modal-enviar-plantilla.component';
import { ModalMarcarTipoMensajeComponent } from './modal-marcar-tipo-mensaje/modal-marcar-tipo-mensaje.component';

interface DialogData {
  dateRangeOption: string;
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'app-wm-grilla-whatsapp',
  templateUrl: './wm-grilla-whatsapp.component.html',
  styleUrls: ['./wm-grilla-whatsapp.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WmGrillaWhatsappComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}

  @Input() tab: number;

  grilla: ChatWhatsAppMarketing[] = [];

  selectedRowIndex: number | null = null;

  filtroFecha: DialogData = {
    dateRangeOption: 'Hoy',
    startDate: new Date(),
    endDate: new Date(),
  };

  accionSeleccionada: number;

  accionesConjunto = [
    {
      text: 'Acciones en Conjunto',
      items: [
        { text: 'Enviar plantilla' },
        { text: 'Marcar tipo de mensaje' },
        { text: 'Archivar' },
        { text: 'Desuscribir' },
      ],
    },
  ];
  mySelection: string[] = [];
  mySelectionKey(context: RowArgs): string {
    let dataItem = context.dataItem as ChatWhatsAppMarketing;
    let idAlumno = dataItem.idAlumno ?? 0;
    return idAlumno + '/' + dataItem.celular;
  }

  ngOnInit(): void {
    this.obtenerChatWhatsAppMarketing();
  }

  selectAccionConjunto(event: MenuSelectEvent) {
    console.log(event);
    switch (event.item.text) {
      case 'Archivar':
        this.alertaService
          .swalFireOptions({
            title: '¿Está seguro de realizar la accion "archivar"?',
            icon: 'warning',
            showCancelButton: true,
          })
          .then((result) => {
            if (result.isConfirmed) {
              this.archivarChatMasivo();
            }
          });

        break;
      case 'Desuscribir':
        this.alertaService
          .swalFireOptions({
            title: '¿Está seguro de realizar la accion "desuscribir"?',
            icon: 'warning',
            showCancelButton: true,
          })
          .then((result) => {
            if (result.isConfirmed) {
              this.desuscribirChatMasivo();
            }
          });
        break;
      case 'Enviar plantilla':
        const seleccionadosPlantilla = this.grilla.filter((item, index) =>
          this.mySelection.includes(
            this.mySelectionKey({ dataItem: item, index })
          )
        );
        const dialogRefPlantilla = this.dialog.open(
          ModalEnviarPlantillaComponent,
          { width: '600px', minWidth: '400px', data: seleccionadosPlantilla }
        );
        dialogRefPlantilla.afterClosed().subscribe((result) => {
          this.mySelection = [];
        });
        break;
      case 'Marcar tipo de mensaje':
        const seleccionados = this.grilla.filter((item, index) =>
          this.mySelection.includes(
            this.mySelectionKey({ dataItem: item, index })
          )
        );
        const dialogRefTipoMensaje = this.dialog.open(
          ModalMarcarTipoMensajeComponent,
          { width: '90%', minWidth: '85%', data: seleccionados }
        );
        dialogRefTipoMensaje.afterClosed().subscribe((result) => {
          this.mySelection = [];
        });
        break;
      default:
        break;
    }
  }
  loadingGrilla: boolean = false;

  archivarChatMasivo() {
    this.loadingGrilla = true;

    let jsonEnvio: {
      idAlumno: number;
      celular: string;
    }[] = [];

    this.mySelection.forEach((x) => {
      let items = x.split('/');
      let idAlumno = items[0];
      let celular = items[1];

      jsonEnvio.push({
        idAlumno: Number(idAlumno),
        celular: celular,
      });
    });

    this.integraService
      .postJsonResponse(WHATSAPP_MENSAJE_ENVIADO.ArchivarChatMasivo, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.alertaService.swalFireOptions({
            title: '¡Registros Archivados!',
            icon: 'success',
          });
          this.loadingGrilla = false;
          this.obtenerChatWhatsAppMarketing();
        },
        error: (error) => {
          this.loadingGrilla = false;
        },
      });
  }

  desuscribirChatMasivo() {
    this.loadingGrilla = true;

    let jsonEnvio: {
      idAlumno: number;
      celular: string;
    }[] = [];

    this.mySelection.forEach((x) => {
      let items = x.split('/');
      let idAlumno = items[0];
      let celular = items[1];

      jsonEnvio.push({
        idAlumno: Number(idAlumno),
        celular: celular,
      });
    });

    this.integraService
      .postJsonResponse(
        WHATSAPP_MENSAJE_ENVIADO.DesuscribirChatMasivo,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.alertaService.swalFireOptions({
            title: '¡Registros Desuscritos!',
            icon: 'success',
          });
          this.loadingGrilla = false;
          this.obtenerChatWhatsAppMarketing();
        },
        error: (error) => {
          this.loadingGrilla = false;
        },
      });
  }

  obtenerChatWhatsAppMarketing() {
    let filtro = {
      tab: this.tab,
      fechaInicio: datePipeTransform(this.filtroFecha.startDate),
      fechaFin: datePipeTransform(this.filtroFecha.endDate),
    };
    this.loadingGrilla = true;
    this.mySelection = [];
    this.integraService
      .postJsonResponse(
        WHATSAPP_MENSAJE_ENVIADO.ObtenerChatWhatsAppMarketingV2,
        filtro
      )
      .subscribe({
        next: (response: HttpResponse<ChatWhatsAppMarketing[]>) => {
          this.grilla = response.body;
          this.loadingGrilla = false;
        },
        error: (error) => {
          this.loadingGrilla = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  verWhatsApp(dataItem: ChatWhatsAppMarketing) {
    const dialogRef = this.dialog.open(WmChatWhatsAppComponent, {
      maxWidth: '90%',
      minWidth: '90%',
      maxHeight: '1900px',
      panelClass: 'wm-modal-container',
      data: {
        dataItem: dataItem,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.obtenerChatWhatsAppMarketing();
    });
  }

  rowCallback = (context: RowClassArgs) => {
    let dataItem = context.dataItem as ChatWhatsAppMarketing;
    if (dataItem.tipo == 1) {
      return { gold: true };
    } else {
      return { green: true };
    }
  };
  openCalendar(): void {
    const dialogRef = this.dialog.open(CalendarioWhatsappComponent, {
      width: 'auto',
      data: this.filtroFecha,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.filtroFecha = result;
        this.obtenerChatWhatsAppMarketing();
      }
    });
  }

  getColorClaseTipoMensaje(tipo: string): string {
    switch (tipo) {
      case 'Interesado':
        return 'color-amarillo';
      case 'No Interesado':
      case 'Spam':
        return 'color-rojo';
      case 'Complejo':
        return 'color-verde';
      default:
        return ''; // sin estilo si no coincide
    }
  }
}
