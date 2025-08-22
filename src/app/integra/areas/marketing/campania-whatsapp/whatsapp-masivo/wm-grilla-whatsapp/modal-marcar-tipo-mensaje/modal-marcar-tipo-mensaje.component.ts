import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatosAlumnoWhatsapp } from '../../models/atributos-alumno';
import { HttpResponse } from '@angular/common/http';
import { WHATSAPP_MENSAJE_ENVIADO } from '@apiIntegra/marketing/whatsapp/whatsapp-mensaje-enviado';
import { IntegraService } from '@shared/services/integra.service';
import { constApiMarketing } from '@environments/constApi';
import {
  ChatWhatsAppMarketing,
  ChatWhatsAppMarketingPorCelular,
  ListaAlumnosPorCelular,
} from '../../models/chat-whatsapp-marketing';

interface HistorialAlumnoMensaje {
  idOportunidad: number;
  idAlumno: number;
  celularWhatsApp: string;
  celular: string;
  idCampaniaGeneralDetalleWhatsApp: number;
  idCentroCosto: number;
  tipo: string;
  categoria: string;
  fechaCreacion: string;
  chatValido: string;
  chatInValido: string;
  chatOportunidad: string;
  nombre: string;
  mensaje: string;
}

@Component({
  selector: 'app-modal-marcar-tipo-mensaje',
  templateUrl: './modal-marcar-tipo-mensaje.component.html',
})
export class ModalMarcarTipoMensajeComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraService: IntegraService
  ) {}

  EstadoAsignacion = 0;
  historialAlumno: HistorialAlumnoMensaje[] = [];
  loadingHistorialAlumno: boolean = false;
  count = 0;
  datosChat: ChatWhatsAppMarketingPorCelular = null;
  alumnosPorCelular: ListaAlumnosPorCelular[] = [];

  ngOnInit(): void {
    if (this.data != null) {
      this.AsignacionWhatsapp();

      this.historialAlumno = new Array(this.data.length);

      this.data.forEach((element: ChatWhatsAppMarketing, index: number) => {
        this.obtenerChatWhatsAppMarketingPorCelular(element.celular, index);
      });
    }
  }

  AsignacionWhatsapp() {
    this.integraService
      .obtener(constApiMarketing.AsignacionDatosWhats)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.EstadoAsignacion = response.body;

          if (this.EstadoAsignacion === 1) {
            console.log(' Asignación completada.');
          }
        },
        error: (error) => {
          console.error('Error en la asignación:', error);
        },
      });
  }

  obtenerChatWhatsAppMarketingPorCelular(celular: string, index: number) {
    this.integraService
      .obtener(
        `${WHATSAPP_MENSAJE_ENVIADO.ObtenerChatWhatsAppMarketingPorCelular}/${celular}`
      )
      .subscribe({
        next: (response: HttpResponse<ChatWhatsAppMarketingPorCelular[]>) => {
          this.datosChat = response.body[0];
          this.alumnosPorCelular = this.datosChat.listaAlumnosPorCelular;
          this.obtenerHistorialAlumno(
            this.alumnosPorCelular[0].idAlumno,
            index
          );
        },
        error: (error) => {},
        complete: () => {},
      });
  }

  obtenerHistorialAlumno(idAlumno: number, index: number) {
    this.loadingHistorialAlumno = true;
    this.integraService
      .obtener(
        `${WHATSAPP_MENSAJE_ENVIADO.ObtenerDatosAlumnoWhatsApp}/${idAlumno}`
      )
      .subscribe({
        next: (response: HttpResponse<DatosAlumnoWhatsapp>) => {
          const historial = response.body.historialAlumno[0];
          const alumno = response.body.obtenerAtributosAlumno;

          this.historialAlumno[index] = {
            idOportunidad: historial.idOportunidad,
            idAlumno: historial.idAlumno,
            idCampaniaGeneralDetalleWhatsApp:
              historial.idCampaniaGeneralDetalleWhatsApp,
            idCentroCosto: historial.idCentroCosto,
            tipo: historial.tipo,
            fechaCreacion: historial.fechaCreacion,
            chatValido: historial.chatValido,
            chatInValido: historial.chatInValido,
            categoria: historial.categoria,
            celularWhatsApp: historial.celularWhatsApp,
            chatOportunidad: historial.chatOportunidad,
            celular: alumno.celular,
            nombre:
              alumno.nombre1 +
              ' ' +
              alumno.apellidoPaterno +
              ' ' +
              alumno.apellidoMaterno,
            mensaje: this.data[index].mensaje,
          };

          this.count++;
          this.loadingHistorialAlumno = false;
        },
        error: (error) => {
          this.loadingHistorialAlumno = false;
        },
      });
  }

  DescontarO(e: any, index: number) {
    var jsonEnvio = {
      IdAlumno: e.idAlumno,
      CelularWhatsApp: e.celularWhatsApp,
      IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
      IdCentroCosto: e.idCentroCosto,
      Usuario: '',
    };

    this.integraService
      .postJsonResponse(constApiMarketing.RestaOportunidadWhatsApp, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {},
        complete: () => {
          this.obtenerHistorialAlumno(e.idAlumno, index);
        },
        error: (error) => {},
      });
  }

  ContadorO(e: any, index: number) {
    var jsonEnvio = {
      IdAlumno: e.idAlumno,
      CelularWhatsApp: e.celularWhatsApp,
      IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
      IdCentroCosto: e.idCentroCosto,
      Usuario: '',
    };

    this.integraService
      .postJsonResponse(constApiMarketing.SumaOportunidadWhatsApp, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {},
        complete: () => {
          this.obtenerHistorialAlumno(e.idAlumno, index);
        },
        error: (error) => {},
      });
  }

  DescontarV(e: any, index: number) {
    let jsonEnvio = {
      IdAlumno: e.idAlumno,
      CelularWhatsApp: e.celularWhatsApp,
      IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
      Usuario: '',
    };

    this.integraService
      .postJsonResponse(constApiMarketing.RestaChatValidoWhatsApp, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {},
        complete: () => {
          this.obtenerHistorialAlumno(e.idAlumno, index);
        },
        error: (error) => {},
      });
  }

  ContadorV(e: any, index: number) {
    var jsonEnvio = {
      IdAlumno: e.idAlumno,
      CelularWhatsApp: e.celularWhatsApp,
      IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
      Usuario: '',
    };

    this.integraService
      .postJsonResponse(constApiMarketing.SumaChatValidoWhatsApp, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {},
        complete: () => {
          this.obtenerHistorialAlumno(e.idAlumno, index);
        },
        error: (error) => {},
      });
  }

  DescontarI(e: any, index: number) {
    var jsonEnvio = {
      IdAlumno: e.idAlumno,
      CelularWhatsApp: e.celularWhatsApp,
      IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
      Usuario: '',
    };

    this.integraService
      .postJsonResponse(constApiMarketing.RestaChatInValidoWhatsApp, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {},
        complete: () => {
          this.obtenerHistorialAlumno(e.idAlumno, index);
        },
        error: (error) => {},
      });
  }

  ContadorI(e: any, index: number) {
    var jsonEnvio = {
      IdAlumno: e.idAlumno,
      CelularWhatsApp: e.celularWhatsApp,
      IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
      Usuario: '',
    };

    this.integraService
      .postJsonResponse(constApiMarketing.SumaChatInValidoWhatsApp, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {},
        complete: () => {
          this.obtenerHistorialAlumno(e.idAlumno, index);
        },
        error: (error) => {},
      });
  }
}
