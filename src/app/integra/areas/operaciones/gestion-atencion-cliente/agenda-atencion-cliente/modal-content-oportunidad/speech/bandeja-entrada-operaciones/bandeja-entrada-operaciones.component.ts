import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import {
  ICorreo,
  ICorreosEnviadosVentas,
  IHistorialCorreo,
  IInteraccionChat,
  IInteraccionDetalleChat,
  IPlantillaCorreoContenido,
} from '@operaciones/models/interfaces/ihistorial-mensaje-recibido';
import { KendoGrid } from '@shared/models/kendo-grid';
import { Observable, forkJoin } from 'rxjs';
import { data } from 'jquery';
import { constApiComercial, constApiFinanzas, constApiGlobal, constApiOperaciones } from '@environments/constApi';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { AvatarService } from '@integra/services/avatar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@shared/services/user.service';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { BandejaWhatsappVentasComponent } from './bandeja-whatsapp-ventas/bandeja-whatsapp-ventas.component';
import { BandejaEntradaChatSoporteComponent } from './bandeja-entrada-chat-soporte/bandeja-entrada-chat-soporte.component';

@Component({
  selector: 'app-bandeja-entrada-operaciones',
  templateUrl: './bandeja-entrada-operaciones.component.html',
  styleUrls: ['./bandeja-entrada-operaciones.component.scss'],
})
export class BandejaEntradaOperacionesComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private avatarService: AvatarService,
    private userService: UserService,
    private modalService: NgbModal,
  ) { }

  @Input() agendaService: AgendaOperacionesService;
  @ViewChild('tabgroup') tabgroup: MatTabGroup;
  @ViewChild('whatsappventas') whatsappventas: BandejaWhatsappVentasComponent;
  @ViewChild('entradaChatSoporte') entradaChatSoporte: BandejaEntradaChatSoporteComponent;
  gridHistorialCorreoEnviadoTotal: KendoGrid = new KendoGrid();
  gridHistorialCorreoRecibidoTotal: KendoGrid = new KendoGrid();
  gridHistorialCorreoMasivoTotal: KendoGrid = new KendoGrid();
  chatSoporteInformacion: any = {
    nombres: 'NOMBRE Y APELLIDOS',
    loader: true,
    historialMensajeRecibidosSoporte: [],
    fechaUltimoMensaje: '',
  };

  avatarUrl: string = '';
  lodearUrl: boolean = true;
  dataAsesor: any;
  objetoRedaccionCorreo: any = {
    listaPlantillas: [],
    listaCentroCostos: [],
    listaEstado: [],
    listaSubEstado: [],
    esCoordinador: false,
    correoDestinatario: '',
    correoEmisor: '',
    idOportunidad: 0,
  }
  loaderSendEmail: boolean = false;
  ngOnInit(): void {
    this.cargarHistorialChats();
    this.cargarListaPlantillas();
    this.cargarCentroCostos();
    this.cargarEstadoMatricula();
    this.cargarSubEstadoMatricula();
    this.transferirDatosRedactar();
  }
  ngAfterViewInit(){
    this.tabgroup.selectedTabChange.subscribe((event: MatTabChangeEvent) => {
      if (event.tab.textLabel === 'Historial de Whatsapp de Comercial' && this.whatsappventas)
        this.whatsappventas.scrollToBottom();
      
      else if (event.tab.textLabel === 'Historial de chat de soporte' && this.entradaChatSoporte)
        this.entradaChatSoporte.scrollToBottom();
    });
  }
  cargarHistorialChats() {
    this.gridHistorialCorreoEnviadoTotal.loading = true;
    this.obtenerCorreosEnviados(this.agendaService.rowActual.email1).subscribe({
      next:  ([correosVentas, correosOperaciones]) => {
        // Mapeo y conversión de fechas para correos de operaciones y asignación de área de correo
        correosOperaciones.body.listaCorreos.forEach((correo: ICorreo) => {
          correo.fecha = new Date(correo.fecha);
          correo.areaCorreo = 'Atención al cliente';
        });
        // Mapeo y conversión de fechas para correos de ventas y asignación de área de correo// Ventas se renombra a Comercial
        correosVentas.body.forEach((correo: ICorreosEnviadosVentas) => {
          correo.fecha = new Date(correo.fecha);
          correo.areaCorreo = 'Comercial';
        });
        this.gridHistorialCorreoEnviadoTotal.data = [
          ...correosOperaciones.body.listaCorreos,
          ...correosVentas.body,
        ];
        this.gridHistorialCorreoEnviadoTotal.loading = false;
      },
    error: (error:any)=>{
      this.alertaService.notificationError(
        `Error: ${this.reconocerError(error)}`,
        'right',
        'bottom'
      );
      this.gridHistorialCorreoEnviadoTotal.loading = false;
    }
    });
    this.obtenerCorreosRecibidos();
    this.obtenerCorreosMasivos();
    this.obtenerIteraccionChatSoporte();
    this.obtenerAvatar();
  }
  obtenerCorreosEnviados(email: string): Observable<any> {
    const obtenerVentas =
      this.agendaService.agendaHistorialChatOperacionesService.obtenerCorreosEnviadosVentas$(
        email
      );
    const obtenerOperaciones =
      this.agendaService.agendaBandejaCorreoOperacionesService.cargarEnviadosOperaciones$();
    return forkJoin([obtenerVentas, obtenerOperaciones]);
  }
  obtenerCorreosRecibidos(): void {
    this.gridHistorialCorreoRecibidoTotal.loading = true;
    this.agendaService.agendaBandejaCorreoOperacionesService
      .cargarHistorialCorreoInboxOperaciones$()
      .subscribe({
        next: (response: HttpResponse<IHistorialCorreo>) => {
          response.body.listaCorreos.map(
            (data: ICorreo) => (data.fecha = new Date(data.fecha))
          );
          this.gridHistorialCorreoRecibidoTotal.data =
            response.body.listaCorreos;
          this.gridHistorialCorreoRecibidoTotal.loading = false;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`,
            'right',
            'bottom'
          );
          console.log(error);
          this.gridHistorialCorreoRecibidoTotal.loading = false;
        },
      });
  }
  obtenerCorreosMasivos(): void {
    this.gridHistorialCorreoMasivoTotal.loading = true;
    this.agendaService.agendaBandejaCorreoOperacionesService
      .cargarHistorialCorreoMasivosOperaciones$()
      .subscribe({
        next: (response: HttpResponse<IHistorialCorreo>) => {
          console.log('cargarHistorialCorreoMasivos', response.body);
          response.body.listaCorreos.map(
            (data: ICorreo) => (data.fecha = new Date(data.fecha))
          );
          this.gridHistorialCorreoMasivoTotal.data = response.body.listaCorreos;
          this.gridHistorialCorreoMasivoTotal.loading = false;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`,
            'right',
            'bottom'
          );
          console.log(error);
          this.gridHistorialCorreoMasivoTotal.loading = false;
        },
      });
  }
  obtenerIteraccionChatSoporte(): void {
    this.chatSoporteInformacion.loader = true;
    this.agendaService.agendaHistorialChatOperacionesService
      .obtenerHistorialSoporte$(this.agendaService.rowActual.idAlumno)
      .subscribe({
        next: (response: HttpResponse<IInteraccionChat[]>) => {
          if (response.body.length > 0) {
            this.chatSoporteInformacion.nombres =
              response.body[0].nombreAlumno.toUpperCase();
            this.chatSoporteInformacion.fechaUltimoMensaje =
              response.body[0].fechaFin;
            this.obtenerHistorialChatSoporte(response.body[0].idInteraccionChat);
          } else {
            this.chatSoporteInformacion.nombres = 'NO SE ENCONTRO CHAT';
          }
          this.chatSoporteInformacion.loader = false;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
          console.log(error);
          this.chatSoporteInformacion.loader = false;
        },
      });
  }
  obtenerHistorialChatSoporte(idInteraccion: number): void {
    this.integraService
      .getJsonResponse(
        `${constApiGlobal.PortalHistorialObtenerDetalleChatPorIdInteraccionControlMensajeSoporte}/${this.agendaService.rowActual.idAlumno}/${idInteraccion}`
      )
      .subscribe({
        next: (response: any) => {
          response.body.map(
            (data: IInteraccionDetalleChat) =>
              (data.nombreRemitente = data.nombreRemitente.toLocaleUpperCase())
          );
          this.chatSoporteInformacion.historialMensajeRecibidosSoporte =
            response.body;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
          console.log(error);
        },
      });
  }
  reconocerError(error: any): string {
    let mensaje: string;
    if (error.status == 0) {
      mensaje = 'Verifique la conexion con servicios (0)';
    } else if (error.status == 404) {
      mensaje = 'No se encontro el recurso (404)';
    } else if (error.status == 400) {
      mensaje = 'El servidor no pudo procesará la petición (400)';
    } else {
      mensaje = error.message;
    }
    return mensaje;
  }
  obtenerAvatar() {
    this.lodearUrl = true;
    this.integraService.getJsonResponse(
      constApiOperaciones.AgendaObtenerAvatar + '/' + this.agendaService.rowActual.idAlumno
    ).subscribe((data: any) => {
      this.avatarUrl = this.avatarService.GetUrlImagenAvatar(data.body);
      this.lodearUrl = false;
    }
    );
  }
  cerrarModal(modal: any) {
    modal.dismiss();
  }
  abrirModalCorreos(modal: any,event:any) {
    event.stopPropagation();
    this.modalService.open(modal, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  }
  cargarListaPlantillas() {
    this.agendaService.agendaBandejaCorreoOperacionesService.listaPlantilla$.subscribe(
      {
        next: (response: IPlantillaCorreoContenido[]) => {
          this.objetoRedaccionCorreo.listaPlantillas = response;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
        },
      }
    );
  }
  cargarCentroCostos() {
    this.integraService.getJsonResponse(constApiComercial.CentroCostoObtenerCombo).subscribe({
      next: (response: any) => {
        this.objetoRedaccionCorreo.listaCentroCostos = response.body;
      },
      error: (error: any) => {
        this.alertaService.notificationError(
          `Error: ${this.reconocerError(error)}`
        );
      },
    });
  }
  cargarEstadoMatricula() {
    this.integraService.getJsonResponse(constApiFinanzas.EstadoMatriculaObtenerEstadoMatriculaParaMatriculados).subscribe({
      next: (response: any) => {
        this.objetoRedaccionCorreo.listaEstado = response.body;
      },
      error: (error: any) => {
        this.alertaService.notificationError(
          `Error: ${this.reconocerError(error)}`
        );
      },
    });
  }
  cargarSubEstadoMatricula() {
    this.integraService.getJsonResponse(constApiFinanzas.SubEstadoMatriculaObtenerSubEstadoMatriculaFiltro).subscribe({
      next: (response: any) => {
        this.objetoRedaccionCorreo.listaSubEstado = response.body;
      },
      error: (error: any) => {
        this.alertaService.notificationError(
          `Error: ${this.reconocerError(error)}`
        );
      },
    });
  }
  transferirDatosRedactar() {
    this.agendaService.agendaDocumentoProgramaOperacionesService
      .datosOportunidad$.subscribe(
        {
          next: (resp) => {
            this.dataAsesor = resp
            this.objetoRedaccionCorreo.correoEmisor = this.dataAsesor.email;
          }
        }
      );
    this.objetoRedaccionCorreo.correoDestinatario = this.agendaService.rowActual.email1;
    this.objetoRedaccionCorreo.esCoordinador = this.agendaService.esCoordinadora$.value;
    this.objetoRedaccionCorreo.idOportunidad = this.agendaService.rowActual.idOportunidad;
  }

  esNuevoCorreoRedactado = true;
  sendMessageAcrossMandrill(formModalCorreo: any, nombreForm?: any) {
    const fdata = new FormData();
    const form = formModalCorreo.controls; // Acceso directo a los controles para reducir repetición.

    const _asunto = form['asunto'].value || 'Sin Asunto';
    const _mensaje = window.btoa(unescape(encodeURIComponent(form['mensaje'].value)));
    const _destinatario = this.esNuevoCorreoRedactado ? form['destinatario2'].value : this.agendaService.rowActual.email1;
    const _remitente = this.dataAsesor.email;
    const _centroCosto = (this.esNuevoCorreoRedactado && form['centroCosto'].value != null) ? form['centroCosto'].value : this.agendaService.rowActual.idCentroCosto;

    // Añadir datos al FormData
    fdata.append('IdActividadDetalle', String(this.agendaService.rowActual.id));
    fdata.append('Idcentrocosto', String(_centroCosto));
    fdata.append('Idoportunidad', String(this.agendaService.rowActual.idOportunidad));
    fdata.append('Remitente', _remitente);
    fdata.append('Destinatario', _destinatario);
    fdata.append('Asunto', _asunto);
    fdata.append('Mensaje', _mensaje);
    fdata.append('DestinatarioCc', form['conCopia2'].value || '');
    fdata.append('Usuario', this.userService.userData.userName);
    fdata.append('IdAsesor', String(this.userService.userData.idPersonal));

    // Añadir archivos adjuntos si existen
    const adjuntos = form['adjunto'].value;
    if (adjuntos && adjuntos.length > 0) {
      adjuntos.forEach((file: any) => fdata.append('Files', file));
    }

    this.agendaService.agendaActividadesOperacionesService.sendMessageAcrossMandrill$(fdata)
      .subscribe({
        next: (response) => {
          if (response) {
            this.alertaService.swalFire(
              'Enviado',
              'El mensaje se envió correctamente',
              'success'
            );
            this.alertaService.mensajeCorreoExitoso();
            formModalCorreo.reset();
            nombreForm.dismiss();
          }
        },
        error: (error) => {
          this.alertaService.notificationError(`Error: ${this.reconocerError(error)}`);
        }
      });
  }
  recibirFormData(formModalCorreo:any, modal:any){
    this.loaderSendEmail = true;

    const fdata = new FormData();
    const form = formModalCorreo.controls; // Acceso directo a los controles para reducir repetición.

    const _asunto = form['asunto'].value || 'Sin Asunto';
    const _mensaje = window.btoa(unescape(encodeURIComponent(form['mensaje'].value)));
    const _destinatario = this.esNuevoCorreoRedactado ? form['destinatario2'].value : this.agendaService.rowActual.email1;
    const _remitente = this.dataAsesor.email;
    const _centroCosto = (this.esNuevoCorreoRedactado && form['centroCosto'].value != null) ? form['centroCosto'].value : this.agendaService.rowActual.idCentroCosto;

    // Añadir datos al FormData
    fdata.append('IdActividadDetalle', String(this.agendaService.rowActual.id));
    fdata.append('Idcentrocosto', String(_centroCosto));
    fdata.append('Idoportunidad', String(this.agendaService.rowActual.idOportunidad));
    fdata.append('Remitente', _remitente);
    fdata.append('Destinatario', _destinatario);
    fdata.append('Asunto', _asunto);
    fdata.append('Mensaje', _mensaje);
    fdata.append('DestinatarioCc', form['conCopia2'].value || '');
    fdata.append('Usuario', this.userService.userData.userName);
    fdata.append('IdAsesor', String(this.userService.userData.idPersonal));

    // Añadir archivos adjuntos si existen
    const adjuntos = form['adjunto'].value;
    if (
      formModalCorreo.get('adjunto').value != null &&
      formModalCorreo.get('adjunto').value.length > 0
    ) {
      for (
        let index = 0;
        index < formModalCorreo.get('adjunto').value.length;
        index++
      ) {
        fdata.append('Files', formModalCorreo.get('adjunto').value[index]);
      }
    }

    this.agendaService.agendaActividadesOperacionesService
    .sendMessageAcrossMandrill$(fdata)
    .subscribe({
      next: (response: boolean) => {
        if (response == true) {
          this.alertaService.swalFire(
            'Enviado',
            'El mensaje se envio correctamente',
            'success'
          );
          this.alertaService.mensajeCorreoExitoso();
          formModalCorreo.reset();
          modal.dismiss();
        }
        this.loaderSendEmail = false;

      },
      error: (error: any) => {
        this.alertaService.notificationError(
          `Error: ${this.reconocerError(error)}`
        );
        this.loaderSendEmail = false;
      }
    });
  }
}

