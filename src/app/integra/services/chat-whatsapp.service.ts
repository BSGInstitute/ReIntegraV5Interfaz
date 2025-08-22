import { Injectable } from '@angular/core';
import { IMensajesWhatsapp, IPlantillaWhatsapp } from '@operaciones/models/interfaces/ihistorial-mensaje-recibido';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { AlertaService } from '@shared/services/alerta.service';
import { UserService } from '@shared/services/user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()

export class ChatWhatsappService {

  messengerUsuarioId$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  agendaService:any;
  userService:any;
  sonido = new Audio();

  constructor (
    private alertaService:AlertaService
  ) {}
  
  prepararNotificacion() {
    this.sonido.src = '../../../../../../../../../assets/sounds/tono/whatsapp.mp3';
    this.sonido.load();
  }

  reproducirNotificacion() {
    this.sonido.play();
  }

  asesorConectado() {
    try {
      // this.hubConnection.invoke('asesorConectado', this.nombreCompleto, this.id)
      this.alertaService.notificationSuccess("Usted esta conectado",)
    } catch (err) {
      alert("Error de conexión");
    }
  }
  
  publicarMensaje(dataForm:IPlantillaWhatsapp, mensaje:any, objetoPlantillasWhatsApp:any) {
    let plantillaSeleccionada:IPlantillaWhatsapp = dataForm;
    var obj;
    if (plantillaSeleccionada !== null && plantillaSeleccionada !== undefined) {
      if (plantillaSeleccionada.tipoPlantilla === 8) {
        obj = {
          "Id": 0,
          "WaTo": this.messengerUsuarioId$,
          "WaType": "hsm",
          "WaTypeMensaje": 8,
          "WaRecipientType": "hsm",
          "WaBody": plantillaSeleccionada.descripcion,
          "WaCaption": mensaje,
          "IdPais": this.agendaService.rowActual.idCodigoPais,
          "EsMigracion": true,
          "IdMigracion": 0,
          "IdPersonal": this.userService.userData.idPersonal,
          "IdAlumno": this.agendaService.rowActual.idAlumno,
          "usuario": this.userService.userData.userName,
          "datosPlantillaWhatsApp": objetoPlantillasWhatsApp
        };
      } else {
        obj = {
          Id: 0,
          WaTo: this.messengerUsuarioId$,
          WaType: "text",
          WaTypeMensaje: 1,
          WaRecipientType: "individual",
          WaBody: mensaje,
          IdPais: this.agendaService.rowActual.idCodigoPais,
          IdPersonal: this.userService.userData.idPersonal,
          IdAlumno: this.agendaService.rowActual.idAlumno,
          EsMigracion: true,
          IdMigracion: 0,
          usuario: this.userService.userData.userName
        };
      }
    } else {
      obj = {
        Id: 0,
        WaTo: this.messengerUsuarioId$,
        WaType: "text",
        WaTypeMensaje: 1,
        WaRecipientType: "individual",
        WaBody: mensaje,
        IdPais: this.agendaService.rowActual.idCodigoPais,
        IdPersonal: this.userService.userData.idPersonal,
        IdAlumno: this.agendaService.rowActual.idAlumno,
        EsMigracion: true,
        IdMigracion: 0,
        usuario: this.userService.userData.userName
      };
    };
    let messengerUsuarioId:string;
    this.messengerUsuarioId$.subscribe({ next:(response:string) => messengerUsuarioId = response })
      if (mensaje.substring(0, 1) === '/') {
        // commandTriggered(mensaje);
      } else {
        if (messengerUsuarioId !== '' && mensaje !== '') {
          if (obj.WaType === "hsm") {
            // plantillaEnviar = plantillaSeleccionada;
            // EnviarMensajeValidado(obj);
          } else {
            // _integraProxy.server.opSend(obj);
          }
          // EliminarContenido();
          plantillaSeleccionada = null;
        }
      }
      // $("#nroCaracteresWhatsAppAgenda").val("0");
  }
  validarBloqueoEnvioMensaje(objeto:IMensajesWhatsapp[]):boolean {
    let ultimoMensaje:IMensajesWhatsapp | any = null;
    if (objeto.length !== undefined ) { ultimoMensaje = objeto[objeto.length - 1] }
    else { ultimoMensaje = objeto }
    if (ultimoMensaje == undefined) return true;
    if (ultimoMensaje.tipo == 2) {
      let diferenciaDia = new Date().getTime() - ultimoMensaje.fechaCreacion.getTime();
      let cantidadHoras = diferenciaDia / (1000 * 60 * 60);
      return (cantidadHoras >= 24) ? true : false;
    } else {
      let cantidad = objeto.length - 1;
      while (ultimoMensaje.tipo == 1 && cantidad != -1) {
        if (objeto[cantidad].tipo != 1) {
          ultimoMensaje = objeto[cantidad];
          ultimoMensaje.tipo = 2;
        }
        cantidad--;
      }
      let diferenciaDiaPorAsesor = new Date().getTime() - ultimoMensaje.fechaCreacion.getTime();
      let cantidadHorasPorAsesor = diferenciaDiaPorAsesor / (1000 * 60 * 60);
      return (cantidadHorasPorAsesor >= 24 || cantidad === -1) ? true : false;
    }
  }
  obtenerComandos() {
    var cmdKey = this.getStoredCommands('lcsk-cmd');
    return (cmdKey !== null && cmdKey !== '') ? JSON.parse(cmdKey) : [];
  }
  getStoredCommands(key:string):any {
    if(this.hasStorage()) { return localStorage.getItem(key) }
  }
  hasStorage() {
    return typeof (Storage) !== 'undefined';
  }
}

