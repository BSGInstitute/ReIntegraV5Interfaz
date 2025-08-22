import { Injectable } from '@angular/core';
import { UserService } from '@shared/services/user.service';
import { IntegraService } from '@shared/services/integra.service';
import { AgendaOperacionesService } from './agenda-operaciones.service';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { IRowActual } from '@comercial/models/interfaces/iagenda';

import {
  IContenidoPlantilla,
  ISolicitarCorreo,
} from '@operaciones/models/interfaces/ihistorial-mensaje-recibido';
import {
  constApiOperaciones,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class AgendaHistorialChatOperacionesService {
  constructor(
    private userService: UserService,
    private integraService: IntegraService
  ) {}

  public contenidoPlantilla$: BehaviorSubject<IContenidoPlantilla> =
    new BehaviorSubject<IContenidoPlantilla>(null);
  private agendaService: AgendaOperacionesService;
  private rowActual: IRowActual;

  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }

  ready() {}

  async initFicha() {
    console.log('AgendaHistorialChatsService');
    this.rowActual = this.agendaService.rowActual;
  }
  async resetFicha() {}

  obtenerHistorialMensajeChat$(
    celular: any
  ) {
    const idPersonal = this.rowActual.idPersonal_Asignado
    const areaTrabajo = "VE";
    console.log("obtenerHistorialMensajeChat areaTrabajo comercial", areaTrabajo);
    return this.integraService.getJsonResponse(
      `${constApiComercial.WhatsAppMensajeEnviadoWhatsAppHistorialMensajeChat}/${idPersonal}/${celular}/${areaTrabajo}`
    );
  }
  obtenerHistorialMensajeRecibidoChat$(
    idPersonalAsignado: number,
    celularLimpiado: string
  ) {
    console.log("obtenerHistorialMensajeChat areaTrabajo",this.agendaService.areaTrabajo);
    return this.integraService.getJsonResponse(
      `${constApiComercial.WhatsAppMensajeEnviadoHistorialMensajeRecibidosChat}/${idPersonalAsignado}/${celularLimpiado}/${this.agendaService.areaTrabajo}`
    );
  }
  obtenerHisotirialconPlantillas$(celular: any) {
    return this.integraService.getJsonResponse(
      `${
        constApiOperaciones.WhatsAppMensajesWhatsAppHistorialMensajeChat
      }/${'0'}/${celular}/${'OP'}`
    );
  }
  correoDetalladoMasivos$(dataCorreo: ISolicitarCorreo) {
    return this.integraService.getJsonResponse(
      `${constApiComercial.CorreoObtenerInformacionEnviadosMasivos}?IdCorreo=${dataCorreo.idCorreo}&IdAsesor=${dataCorreo.idAsesor}&Folder=${dataCorreo.folder}&Destinatario=${dataCorreo.destinatario}`
    );
  }
  correoInformacionDetallado$(dataCorreo: ISolicitarCorreo) {
    return this.integraService.getJsonResponse(
      `${constApiComercial.CorreoObtenerInformacionGmail}?IdCorreo=${dataCorreo.idCorreo}&IdAsesor=${dataCorreo.idAsesor}&Folder=${dataCorreo.folder}`
    );
  }
  obtenerCorreosEnviadosVentas$(email: string) {
    return this.integraService.getJsonResponse(
      `${constApiComercial.CorreoObtenerCorreosEnviadosAlumnoSoloVentas}/${email}`
    );
  }
  obtenerHistorialChatPortal$(idPersonal: number, idAlumno: number) {
    return this.integraService.getJsonResponse(
      `${constApiGlobal.PortalMesajesRecibidosChat}/${idPersonal}/${idAlumno}`
    );
  }
  obtenerHistorialMessenger$(idPersonal: number, idAlumno: number) {
    return this.integraService.getJsonResponse(
      `${constApiComercial.MessengerChatObtenerHistorialChatPorPersonal}/${idPersonal}/${idAlumno}`
    );
  }
  obtenerHistorialSoporte$(idAlumno: number) {
    return this.integraService.getJsonResponse(
      `${constApiMarketing.ChatIntegraHistorialAsesorObtenerTodoHistorialChatsPorAlumno}/${idAlumno}`
    );
  }
  iniciarAgendaAlumnoDocumentos$(idAlumno: number) {
    return this.integraService.getJsonResponse(
      `${constApiOperaciones.AgendaInformacionActividadObtenerDocumentosWhatsApp}/${idAlumno}`
    );
    // .obtenerPorUriIndependiente(
    //   `https://integrav4-servicios.bsginstitute.com/api/AgendaInformacionActividad/ObtenerDocumentosWhatsApp/${idAlumno}`
    // )
  }
  remove_character(element: string) {
    return element.slice(1);
  }
  /**
   * En revision de casuisticas
   * Valida el correo en caso de ser uno institucional o del alumno, se encarga de cubrir
   * @param correo Correo electronico
   * @returns boolean
   * @example emailEsInstitucional('example@bsginstitute.com') => true
   */
  ofuscarCorreo(correo: string): string {
    let correoOfuscado: string = '',
      emailNuevoModelo: string = '',
      nombreEmailNuevoModelo: string = '';
    if (this.agendaService.esCoordinadora$.value) {
      if (correo != '') {
        if (this.emailConNombre(correo).estado) {
          correoOfuscado = correo;
        } else {
          correoOfuscado = correo;
        }
      }
    } else {
      if (correo != '' && correo != null) {
        let conNombre: boolean = false;
        if (this.emailConNombre(correo).estado) {
          let objetoData = this.emailConNombre(correo);
          emailNuevoModelo = objetoData.contenidoEmail;
          nombreEmailNuevoModelo = objetoData.nombreEmail;
          conNombre = true;
        } else {
          emailNuevoModelo = correo;
        }
        if (this.emailEsInstitucional(emailNuevoModelo)) {
          correoOfuscado = emailNuevoModelo;
        } else {
          let contador: number = emailNuevoModelo.indexOf('@');
          let emailNuevoModeloVisualizarInicio: string =
            emailNuevoModelo.substring(0, 3);
          let emailNuevoModeloOcultar: string = emailNuevoModelo.substring(
            3,
            contador
          );
          let emailNuevoModeloVisualizar: string = emailNuevoModelo.substring(
            contador,
            emailNuevoModelo.length
          );
          let emailOperacionesOculto: string = '';
          for (let i = 0; emailNuevoModeloOcultar.length > i; i++) {
            emailOperacionesOculto += '•';
          }
          if (conNombre) {
            correoOfuscado = `${emailNuevoModeloVisualizarInicio}${emailOperacionesOculto}${emailNuevoModeloVisualizar}`;
          } else {
            correoOfuscado = `${emailNuevoModeloVisualizarInicio}${emailOperacionesOculto}${emailNuevoModeloVisualizar}`;
          }
        }
      } else if (correo == '' || correo == null) {
        correoOfuscado = correo;
      }
    }
    return correoOfuscado;
  }
  /**
   * Valida la existencia de '"' al inicio del correo y '<' dentro del mismo
   * @param correo Correo electronico
   * @returns boolean
   * @example emailConNombre('"Carlos Eduardo Lara Caba" <carloslara1994484@gmail.com>"') => {
   *  nombreEmail:'"Carlos Eduardo Lara Caba" <',
   *  contenidoEmail:'carloslara1994484@gmail.com',
   *  estado: true
   * }
   */
  emailConNombre(correo: string): IObjetoCorreo {
    return {
      nombreEmail: correo.substring(0, correo.indexOf('<') + 1),
      contenidoEmail: correo.substring(
        correo.indexOf('<') + 1,
        correo.length - 1
      ),
      estado:
        correo.charAt(0) == '"' && correo.indexOf('<') != -1 ? true : false,
    };
  }
  /**
   * Valida la extension del correo '@gmail.com' en caso de ser una institucional
   * @param correo Correo electronico
   * @returns boolean
   * @example emailEsInstitucional('example@bsginstitute.com') => true
   */
  emailEsInstitucional(correo: string): boolean {
    let dataTemp = this.emailConNombre(correo);
    let correoTemp = dataTemp.estado ? dataTemp.contenidoEmail : correo;
    let extCorreo = correoTemp.substring(
      correoTemp.indexOf('@') + 1,
      correoTemp.length
    );
    return extCorreo == 'bsginstitute.com' || extCorreo == 'bsgrupo.com'
      ? true
      : false;
  }
  /**
   * Encubre todos los caracteres omitiendo los 3 ultimos si el personal
   * es diferente de coordinador.
   * @param numero Numero celular
   * @returns string
   * @example ofuscarNumero('987654321') => ******321
   */
  ofuscarNumero(numero: string): string {
    let numeroOfuscado: string = '';
    if (this.agendaService.esCoordinadora$.value) {
      if (numero != '') {
        numeroOfuscado = numero;
      }
    } else {
      if (numero != '' && numero != null) {
        let contador: number = numero.length;
        let numeroNuevoModeloOcultar: string = numero.substring(
          0,
          contador - 3
        );
        let numeroNuevoModeloVisualizar: string = numero.substring(
          contador - 3,
          numero.length
        );
        let numeroOperacionesOculto: string = '';
        for (let i = 0; numeroNuevoModeloOcultar.length > i; i++) {
          numeroOperacionesOculto += '•';
        }
        numeroOfuscado = `${numeroOperacionesOculto}${numeroNuevoModeloVisualizar}`;
      } else if (numero == '' || numero == null) {
        numeroOfuscado = numero;
      }
    }
    return numeroOfuscado;
  }
  remplazarPlantillaHistorial$(idOportunidad: number, idPlantilla: number) {
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaGenerarPlantillaMailing}/${idOportunidad}/${idPlantilla}`
    );
  }
}

interface IObjetoCorreo {
  nombreEmail: string;
  contenidoEmail: string;
  estado: boolean;
}
interface ICorreoAdjunto {
  Adjuntos: IArchivoAdjunto[];
  EmailBody: string;
}
interface IArchivoAdjunto {
  Id?: number;
  IdCorreo: number;
  NombreArchivo: string;
  UrlArchivoRepositorio: string;
}
interface IFilaWhatsapp {
  Numero: string;
  Mensaje?: string;
  IdPersonal: number;
  IdPais?: number;
  IdAlumno?: number;
  FechaCreacion?: Date | string;
  NombreAlumno?: string;
}
interface IDataDescarga {
  AsesorActual: number;
  FolderActual: string;
}

interface IPlantillaWhatsapp {
  Id: number;
  Nombre: string;
  Descripcion: string;
  Contenido: string;
  TipoPlantilla: number;
}
