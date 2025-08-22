import { datePipeTransform } from '@shared/functions/date-pipe';
import {
  ElementRef,
  Injectable,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import {
  NotificationService,
  NotificationSettings,
} from '@progress/kendo-angular-notification';
import Swal, {
  SweetAlertIcon,
  SweetAlertOptions,
  SweetAlertPosition,
} from 'sweetalert2';
import {
  InformacionAlumnoWhatsapp,
  InformacionMensajeWhatsapp,
} from '@comercial/services/agenda/agenda-chat-whatsapp.service';
import { NgxToastService } from 'ngx-toast-notifier';
import {
  InformacionMensajeChatPortal,
  InformacionAlumnoChatPortal,
} from '@comercial/services/agenda/agenda-chat-portal-web.service';
import {
  DatosPostulanteNotificacion,
  InformacionMensajeWhatsappPostulante,
} from '@gestionPersonas/models/DatosPostulante';

@Injectable({
  providedIn: 'root',
})
export class AlertaService {
  static mensajeError: any;
  @ViewChild('contentDrawer', { read: ViewContainerRef })
  contentDrawer: ViewContainerRef;

  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private ngxToastService: NgxToastService
  ) {}

  mensajeEliminar() {
    return Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      customClass: {
        confirmButton: 'sweetAlert2-customHoverButton',
        cancelButton: 'sweetAlert2-customHoverButton',
      },
    });
  }

  mensajeEliminarTemporal() {
    return Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
    });
  }

  mensajeValidacionEnvio() {
    return Swal.fire({
      title: '¿Está seguro que desea enviar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
    });
  }

  mensajeError(error: any) {
    return Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false,
    });
  }

  mensajeInfo(error: any) {
    return Swal.fire({
      icon: 'info',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-warning fs-6">${error.message}</p>`,
      allowOutsideClick: false,
    });
  }

  mensajeExitosoWhatsapp(mensaje?: string) {
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-message',
      // customClass: {
      //   container: 'swal2-container-integra',
      // },
      position: 'top-left',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    return Toast.fire({
      icon: 'success',
      title: mensaje != null ? mensaje : 'Se envio el mensaje con exito',
    });
  }
  mensajeExitoso(mensaje?: string, target?: string) {
    const Toast = Swal.mixin({
      toast: true,
      target: target ?? '#content-drawer-component',
      customClass: {
        container: 'swal2-container-integra',
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    return Toast.fire({
      icon: 'success',
      title: mensaje != null ? mensaje : 'Guardado con exito',
    });
  }
  mensajeExitosoCarga(mensaje?: string) {
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'swal2-container-integra',
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    return Toast.fire({
      icon: 'success',
      title: mensaje != null ? mensaje : 'Carga completada',
    });
  }
  notificacionWhatsappSuperior(
    infoMensaje: InformacionMensajeWhatsapp,
    infoAlumno?: InformacionAlumnoWhatsapp
  ) {
    let urlInvertida = this.invertirTexto(infoMensaje.mensaje);
    let ext = this.invertirTexto(
      urlInvertida.substring(0, urlInvertida.indexOf('.'))
    );
    let imagenes = 'bmp gif jpg jpeg tif png'.split(' ');
    let documentos =
      'docx doc md odt pdf ppt pptx txt xls xlsx csv rar zip'.split(' ');
    let audios = 'flac mp3 aac ogg wma wav wave mpeg'.split(' ');
    let videos = 'avi flv mov mp4'.split(' ');
    let contenidoMensaje = '';
    if (imagenes.includes(ext)) {
      contenidoMensaje = `
      <div class="main-img">
        <ul class="item-list">
          <li class="item2">
            <input type="radio" name="point" id="slide2" disabled/>
            <label for="slide2" class="label">
              <h4 class="px-2 fw-bold">Vista Previa</h4>
              <span class="control"></span>
              <div class="slider">
                <a href="${infoMensaje.mensaje}" target="_blank">
                  <img
                    src="${infoMensaje.mensaje}"
                    alt="imagen.${ext}"
                    class="imagen-whatsapp"
                  />
                </a>
              </div>
            </label>
          </li>
        </ul>
      </div>`;
    } else if (documentos.includes(ext)) {
      contenidoMensaje = `
      <div class="my-1" style="background-color: #F1F3F4">
        <div class="d-flex" style="color: #25d366;">
          <div class="p-2 fw-bold">
            <a href="${infoMensaje.mensaje}" target="_blank" style="text-decoration: none;">
              <svg xmlns="http://www.w3.org/2000/svg" height="1.6em" viewBox="0 0 512 512"><path d="M256 464a208 208 0 1 1 0-416 208 208 0 1 1 0 416zM256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6c4.5-4.2 7.1-10.1 7.1-16.3c0-12.3-10-22.3-22.3-22.3H304V160c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32v96H150.3C138 256 128 266 128 278.3c0 6.2 2.6 12.1 7.1 16.3l107.1 99.9c3.8 3.5 8.7 5.5 13.8 5.5s10.1-2 13.8-5.5l107.1-99.9z"/></svg>
            </a>
          </div>
          <div class="py-2 fw-bold">
            <a href="${infoMensaje.mensaje}" target="_blank" style="text-decoration: none;">Descargar</a>
          </div>
        </div>
      </div>`;
    } else if (audios.includes(ext)) {
      contenidoMensaje = `
      <div class="rounded my-1" style="background-color: #F1F3F4">
        <audio class="audio-whatsapp" controls>
          <source
            src="${infoMensaje.mensaje}" type="audio/${ext}"
          >
          Tu navegador no soporta el tag audio
        </audio>
      </div>`;
    } else if (videos.includes(ext)) {
      contenidoMensaje = `
      <div class="main-img">
        <ul class="item-list">
          <li class="item2">
            <input type="radio" name="point" id="slide2" disabled/>
            <label for="slide2" class="label">
              <h4 class="px-2 fw-bold">Vista Previa</h4>
              <span class="control"></span>
              <div class="slider">
                <video width="100%" controls>
                  <source src="${infoMensaje.mensaje}" type="video/${ext}">
                  Your browser does not support HTML video.
                </video>
              </div>
            </label>
          </li>
        </ul>
      </div>`;
    } else {
      contenidoMensaje = infoMensaje.mensaje;
    }
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      // timer: 100000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      iconHtml:
        '<img style="width: 45px" src="../../../../../../../../../assets/img/iconWhatsapp.png">',
      html: `
      <div class="py-0 my-0">
        <div class="d-flex fw-bold bg-white bg-white px-2">
          <div class="w-75">
            <span class="text-success">${infoAlumno.tab}</span>
          </div>
          <div class="w-25 text-end">
            <span class="text-success">${infoAlumno.faseOportunidad}</span>
          </div>
        </div>
        <div class="mt-2 text-white">
          <div class="fw-bold">
            ${
              infoAlumno && infoAlumno.alumno
                ? infoAlumno.alumno
                : infoMensaje.numero
            }
          </div>
          <div>
            ${contenidoMensaje}
          </div>
        </div>
      </div>`,
      customClass: 'popup-whatsapp',
    });
  }

  notificacionChatPortalSuperior(
    infoMensaje: InformacionMensajeChatPortal,
    infoAlumno?: InformacionAlumnoChatPortal
  ) {
    let urlInvertida = this.invertirTexto(infoMensaje.value);
    let ext = this.invertirTexto(
      urlInvertida.substring(0, urlInvertida.indexOf('.'))
    );
    let imagenes = 'bmp gif jpg jpeg tif png'.split(' ');
    let documentos =
      'docx doc md odt pdf ppt pptx txt xls xlsx csv rar zip'.split(' ');
    let audios = 'flac mp3 aac ogg wma wav wave mpeg'.split(' ');
    let videos = 'avi flv mov mp4'.split(' ');
    let contenidoMensaje = '';
    if (imagenes.includes(ext)) {
      contenidoMensaje = `
      <div class="main-img">
        <ul class="item-list">
          <li class="item2">
            <input type="radio" name="point" id="slide2" disabled/>
            <label for="slide2" class="label">
              <h4 class="px-2 fw-bold">Vista Previa</h4>
              <span class="control"></span>
              <div class="slider">
                <a href="${infoMensaje.value}" target="_blank">
                  <img
                    src="${infoMensaje.value}"
                    alt="imagen.${ext}"
                    class="imagen-whatsapp"
                  />
                </a>
              </div>
            </label>
          </li>
        </ul>
      </div>`;
    } else if (documentos.includes(ext)) {
      contenidoMensaje = `
      <div class="my-1" style="background-color: #F1F3F4">
        <div class="d-flex" style="color: #9dbf6;">
          <div class="p-2 fw-bold">
            <a href="${infoMensaje.value}" target="_blank" style="text-decoration: none;">
              <svg xmlns="http://www.w3.org/2000/svg" height="1.6em" viewBox="0 0 512 512"><path d="M256 464a208 208 0 1 1 0-416 208 208 0 1 1 0 416zM256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6c4.5-4.2 7.1-10.1 7.1-16.3c0-12.3-10-22.3-22.3-22.3H304V160c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32v96H150.3C138 256 128 266 128 278.3c0 6.2 2.6 12.1 7.1 16.3l107.1 99.9c3.8 3.5 8.7 5.5 13.8 5.5s10.1-2 13.8-5.5l107.1-99.9z"/></svg>
            </a>
          </div>
          <div class="py-2 fw-bold">
            <a href="${infoMensaje.value}" target="_blank" style="text-decoration: none;">Descargar</a>
          </div>
        </div>
      </div>`;
    } else if (audios.includes(ext)) {
      contenidoMensaje = `
      <div class="rounded my-1" style="background-color: #F1F3F4">
        <audio class="audio-whatsapp" controls>
          <source
            src="${infoMensaje.value}" type="audio/${ext}"
          >
          Tu navegador no soporta el tag audio
        </audio>
      </div>`;
    } else if (videos.includes(ext)) {
      contenidoMensaje = `
      <div class="main-img">
        <ul class="item-list">
          <li class="item2">
            <input type="radio" name="point" id="slide2" disabled/>
            <label for="slide2" class="label">
              <h4 class="px-2 fw-bold">Vista Previa</h4>
              <span class="control"></span>
              <div class="slider">
                <video width="100%" controls>
                  <source src="${infoMensaje.value}" type="video/${ext}">
                  Your browser does not support HTML video.
                </video>
              </div>
            </label>
          </li>
        </ul>
      </div>`;
    } else {
      contenidoMensaje = infoMensaje.value;
    }
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      // timer: 100000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      iconHtml:
        '<img style="width: 45px" src="assets/img/iconsagendaatc/174188.png">',
      html: `
        <div class="py-0 my-0">
          <div class="d-flex fw-bold bg-white bg-white px-2">
            <div class="w-75 text-center">
              <span>Chat Portal</span>
            </div>
          </div>
          <div class="mt-2 text-white">
            <div class="fw-bold">
              ${
                infoAlumno && infoAlumno.alumno
                  ? infoAlumno.alumno
                  : infoMensaje.from
              }
            : </div>
            <div class="p-10">
              ${contenidoMensaje}
            </div>
          </div>
        </div>`,
      customClass: 'popup-chatPortal',
    });
  }

  notificacionCorreoSuperior(contacto: string, codigoFase: string) {
    let mensaje = `${contacto} te envio un correo`;
    // if(cantidad == 1){
    //   mensaje = 'Tienes 1 un nuevo correo'
    // }
    // if(cantidad > 1){
    //   mensaje = `Tienes ${cantidad} correos nuevos`;
    // }
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 30000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      iconHtml: `<fa-icon [icon]="['fas', 'envelope']" class="fa-lg fs-5 fw-bold text-danger"></fa-icon>`,
      html: mensaje,
      customClass: 'popup-correo',
    });
  }
  notificacionCorreo(
    contacto: string,
    viewContainerRef?: ViewContainerRef
  ): void {
    this.notificationService.show({
      appendTo: this.contentDrawer,
      content: contacto,
      hideAfter: 15000,
      closable: false,
      position: { horizontal: 'right', vertical: 'top' },
      animation: { type: 'fade', duration: 400 },
      type: { style: 'success', icon: true },
    });
  }

  toastOptions(
    mensaje: string,
    icon: SweetAlertIcon,
    position?: SweetAlertPosition,
    target?: string
  ) {
    const Toast = Swal.mixin({
      toast: true,
      target: target ?? '#content-drawer-component',
      customClass: {
        container: 'swal2-container-integra',
      },
      position: position ?? 'center',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    return Toast.fire({
      icon: icon,
      title: mensaje != null ? mensaje : 'Message',
    });
  }
  mensajeCerrarPlantilla() {
    return Swal.fire({
      title: '¿Está recontra seguro que quieres cerrar el modal?',
      text: '¡Los datos se perderan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }

  mensajeExitosoPrueba(mensaje?: string, target?: string) {
    const Toast = Swal.mixin({
      toast: true,
      target: target,
      customClass: {
        container: 'swal2-container-integra',
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    return Toast.fire({
      icon: 'success',
      title: mensaje != null ? mensaje : 'Llamada Contestada con exito',
    });
  }

  mensajeCorreoExitoso() {
    return Swal.fire({
      title: 'Mensaje Enviado',
      icon: 'success',
      confirmButtonColor: '#4C5FC0',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }
  reclamoRevisado() {
    return Swal.fire({
      title: 'reclamo Revisado',
      icon: 'success',
      confirmButtonColor: '#4C5FC0',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }
  mensajeCorreoEnviado() {
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute',
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    return Toast.fire({
      icon: 'success',
      title: 'Enviado con exito',
    });
  }
  mensajeWarning(text: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'warning',
      title: text,
    });
  }
  customMensaje(options: SweetAlertOptions<any>) {
    return Swal.fire(options);
  }
  swalFireOptions(options: SweetAlertOptions<any>) {
    return Swal.fire(options);
  }

  swalFire(titulo: string, html: string, icon: SweetAlertIcon) {
    return Swal.fire(titulo, html, icon);
  }

  swal(titulo: string) {
    return Swal.fire(titulo);
  }

  mensajeIcon(title?: string, html?: string, icon?: SweetAlertIcon) {
    return Swal.fire({
      title: title,
      text: html,
      icon: icon,
      allowOutsideClick: false,
    });
  }

  notificationDefault(
    content: string,
    viewContainerRef?: ViewContainerRef
  ): void {
    this.notificationService.show({
      appendTo: viewContainerRef ? viewContainerRef : this.contentDrawer,
      content: content,
      hideAfter: 1500,
      position: { horizontal: 'right', vertical: 'top' },
      animation: { type: 'fade', duration: 400 },
      type: { style: 'none', icon: false },
    });
  }

  notificationSuccess(content: any, viewContainerRef?: ViewContainerRef): void {
    this.notificationService.show({
      appendTo: viewContainerRef ? viewContainerRef : this.contentDrawer,
      content: content,
      hideAfter: 1500,
      closable: false,
      position: { horizontal: 'right', vertical: 'top' },
      animation: { type: 'fade', duration: 400 },
      type: { style: 'success', icon: true },
    });
  }
  notificationWarning(
    content: any,
    closable: boolean = false,
    viewContainerRef?: ViewContainerRef
  ): void {
    this.notificationService.show({
      appendTo: viewContainerRef ? viewContainerRef : this.contentDrawer,
      content: content,
      hideAfter: 1500,
      closable: closable,
      position: { horizontal: 'right', vertical: 'bottom' },
      animation: { type: 'fade', duration: 400 },
      type: { style: 'warning', icon: true },
    });
  }
  notificationWarningmkt(
    content: any,
    closable: boolean = false,
    viewContainerRef?: ViewContainerRef
  ): void {
    this.notificationService.show({
      appendTo: viewContainerRef ? viewContainerRef : this.contentDrawer,
      content: content,
      hideAfter: 1500,
      closable: closable,
      position: { horizontal: 'right', vertical: 'bottom' },
      animation: { type: 'fade', duration: 400 },
      type: { style: 'warning', icon: true },
    });
  }
  notificationSuccessBotom(
    content: any,
    closable: boolean = false,
    viewContainerRef?: ViewContainerRef
  ): void {
    this.notificationService.show({
      appendTo: viewContainerRef ? viewContainerRef : this.contentDrawer,
      content: content,
      hideAfter: 1500,
      closable: closable,
      position: { horizontal: 'right', vertical: 'bottom' },
      animation: { type: 'fade', duration: 400 },
      type: { style: 'success', icon: true },
    });
  }
  notificationInfo(
    content: any,
    closable: boolean = false,
    viewContainerRef?: ViewContainerRef
  ): void {
    this.notificationService.show({
      appendTo: viewContainerRef ? viewContainerRef : this.contentDrawer,
      content: content,
      hideAfter: 3000,
      closable: closable,
      position: { horizontal: 'right', vertical: 'bottom' },
      animation: { type: 'fade', duration: 400 },
      type: { style: 'info', icon: true },
    });
  }
  notificationError(
    content: any,
    horizontal: 'left' | 'center' | 'right' = 'right',
    vertical: 'top' | 'bottom' = 'bottom',
    viewContainerRef?: ViewContainerRef
  ): void {
    console.log(content);
    console.log(viewContainerRef);
    console.log(this.contentDrawer);
    this.notificationService.show({
      appendTo: viewContainerRef ? viewContainerRef : this.contentDrawer,
      content: content,
      hideAfter: 2000,
      closable: false,
      cssClass: 'button-notification',
      position: { horizontal: horizontal, vertical: vertical },
      animation: { type: 'fade', duration: 400 },
      type: { style: 'error', icon: true },
    });
  }

  openSnackBarComponent(component: any, durationInSeconds: number) {
    this.snackBar.openFromComponent(component, {
      duration: durationInSeconds * 1000,
    });
  }

  openSnackBar(message: string, action: string, config?: MatSnackBarConfig) {
    if (config != null) {
      this.snackBar.open(message, action, config);
    } else {
      this.snackBar.open(message, action, config);
    }
  }

  getErrorResponse(
    error: any,
    title?: string
  ): { titulo: string; mensaje: string; icon: SweetAlertIcon } {
    console.log(error);
    let respuesta: { titulo: string; mensaje: string; icon: SweetAlertIcon };
    const status = error.status;
    const mensaje = this.getMessageErrorService(error);
    switch (status) {
      case 0:
        respuesta = {
          titulo: 'Error de conexión',
          mensaje: mensaje ?? 'No hubo respuesta en la solicitud',
          icon: 'error',
        };
        break;
      case 400:
        respuesta = {
          titulo: 'Error de sintaxis',
          mensaje:
            mensaje ??
            'Se detecto una sintaxis invalida, revise los parametros enviados y vuelva a intentar',
          icon: 'error',
        };
        break;
      case 401:
        respuesta = {
          titulo: 'Sesion finalizada',
          mensaje:
            mensaje ??
            'Su sesion a finalizado, vuelga a registrar sus credenciales',
          icon: 'error',
        };
        break;
      case 403:
        respuesta = {
          titulo: 'Error de permisos',
          mensaje:
            mensaje ?? 'El cliente no posee permisos para esta direccion',
          icon: 'error',
        };
        break;
      case 404:
        respuesta = {
          titulo: 'Error en la solicitud',
          mensaje: mensaje ?? 'No se reconoce la URL ',
          icon: 'error',
        };
        break;
      case 408:
        respuesta = {
          titulo: 'Error de conexion',
          mensaje:
            mensaje ?? 'Se perdio la conexion, revise su conexion a internet',
          icon: 'error',
        };
        break;
      case 409:
        respuesta = {
          titulo: 'Error de Solicitud',
          mensaje: mensaje ?? 'No se pudo realizar la operacion',
          icon: 'info',
        };
        break;
      case 415:
        respuesta = {
          titulo: 'Tipo de dato no soportado',
          mensaje:
            mensaje ??
            'El formato multimedia de los datos solicitados no está soportada por el servidor, por lo cual el servidor ha rechazado su solicitud.',
          icon: 'error',
        };
        break;
      case 500:
        respuesta = {
          titulo: 'Error en el servidor',
          mensaje:
            mensaje ??
            'Ocurrio un error en el servidor, Comuniquese con soporte tecnico',
          icon: 'error',
        };
        break;
      default:
        respuesta = {
          titulo: 'Error ' + status,
          mensaje:
            mensaje ?? 'Ocurrio un error: Comuniquese con soporte tecnico',
          icon: 'error',
        };
        break;
    }
    // if (mensaje != null) {
    //   respuesta.mensaje = mensaje;
    // }
    if (title != null) {
      respuesta.titulo = title;
    }
    return respuesta;
  }

  getMessageErrorService(errorTest: any): string {
    try {
      if (errorTest.status == 0) {
        this.notificationInfo(errorTest.message);
        return null;
      }
      if (errorTest?.error) {
        localStorage.setItem(
          'logError',
          JSON.stringify({
            error: errorTest,
            dateTime: datePipeTransform(new Date()),
          })
        );
        if (errorTest.error) {
          if (typeof errorTest.error != 'object') {
            return errorTest.error;
          } else {
            let e = errorTest.error;
            if (e?.codigoError) {
              if (e.codigoError.startsWith('#')) {
                return `${e.codigoError} ${e.error}`;
              } else {
                return e.error;
              }
            } else if (e.errors) {
              let temp: string[] = [];
              localStorage.setItem(
                'logErrors',
                JSON.stringify({
                  error: errorTest,
                  dateTime: datePipeTransform(new Date()),
                })
              );
              for (const key in e.errors) {
                if (Object.prototype.hasOwnProperty.call(e.errors, key)) {
                  const element = e.errors[key];
                  temp.push(`${key}: ${element.join(',')}`);
                }
              }
              let mensaje = `${e.title} ${temp.join(';')}`;
              this.notificationInfo(mensaje);
              return mensaje;
            } else {
              localStorage.setItem(
                'logErrorMessage',
                JSON.stringify({
                  error: errorTest,
                  dateTime: datePipeTransform(new Date()),
                })
              );
              if (typeof errorTest.message != 'object') {
                return errorTest.message;
              }
              return null;
            }
          }
        } else if (errorTest.errors) {
          if (typeof errorTest.errors != 'object') {
            return errorTest.errors;
          } else {
            let e = errorTest.errors;
            if (e?.codigoError) {
              if (e.codigoError.startsWith('#')) {
                return `${e.codigoError} ${e.error}`;
              } else {
                return e.error;
              }
            } else if (errorTest?.errors) {
              let e: string[] = [];
              localStorage.setItem(
                'logErrors',
                JSON.stringify({
                  error: errorTest,
                  dateTime: datePipeTransform(new Date()),
                })
              );
              for (const key in errorTest.errors) {
                if (
                  Object.prototype.hasOwnProperty.call(errorTest.errors, key)
                ) {
                  const element = errorTest.errors[key];
                  e.push(`${key}: ${element.join(',')}`);
                }
              }
              let mensaje = `${errorTest.title} ${e.join(';')}`;
              this.notificationInfo(mensaje);
              return null;
            } else {
              localStorage.setItem(
                'logErrorMessage',
                JSON.stringify({
                  error: errorTest,
                  dateTime: datePipeTransform(new Date()),
                })
              );
              if (typeof errorTest.message != 'object') {
                return errorTest.message;
              }
              return null;
            }
          }
        }
        return null;
      } else {
        if (errorTest?.errors) {
          let e: string[] = [];
          localStorage.setItem(
            'logErrors',
            JSON.stringify({
              error: errorTest,
              dateTime: datePipeTransform(new Date()),
            })
          );
          for (const key in errorTest.errors) {
            if (Object.prototype.hasOwnProperty.call(errorTest.errors, key)) {
              const element = errorTest.errors[key];
              e.push(`${key}: ${element.join(',')}`);
            }
          }
          let mensaje = `${errorTest.title} ${e.join(';')}`;
          this.notificationInfo(mensaje);
          return null;
        } else {
          localStorage.setItem(
            'logErrorMessage',
            JSON.stringify({
              error: errorTest,
              dateTime: datePipeTransform(new Date()),
            })
          );
          if (typeof errorTest.message != 'object') {
            return errorTest.message;
          }
          return null;
        }
      }
    } catch (ex) {
      console.log(ex);
      return null;
    }
  }

  warningMessageOptions(_title: string, _text: string) {
    return Swal.fire({
      title: _title,
      text: _text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }

  invertirTexto(url: string): string {
    return [...url].reverse().join('');
  }
  addSuccess(title: string, text: string): void {
    this.ngxToastService.onSuccess(title, text);
  }

  addInfo(title: string, text: string): void {
    this.ngxToastService.onInfo(title, text);
  }

  addWarning(title: string, text: string): void {
    this.ngxToastService.onWarning(title, text);
  }

  addDanger(title: string, text: string): void {
    this.ngxToastService.onDanger(title, text);
  }
  mensajeExitosomkt(text: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    return Toast.fire({
      icon: 'success',
      title: text,
    });
  }

  notificacionWhatsappSuperiorPostulante(
    infoMensaje: InformacionMensajeWhatsappPostulante,
    infoPostulante?: DatosPostulanteNotificacion
  ) {
    let urlInvertida = this.invertirTexto(infoMensaje.mensaje);
    let ext = this.invertirTexto(
      urlInvertida.substring(0, urlInvertida.indexOf('.'))
    );
    let imagenes = 'bmp gif jpg jpeg tif png'.split(' ');
    let documentos =
      'docx doc md odt pdf ppt pptx txt xls xlsx csv rar zip'.split(' ');
    let audios = 'flac mp3 aac ogg wma wav wave mpeg'.split(' ');
    let videos = 'avi flv mov mp4'.split(' ');
    let contenidoMensaje = '';
    if (imagenes.includes(ext)) {
      contenidoMensaje = `
      <div class="main-img">
        <ul class="item-list">
          <li class="item2">
            <input type="radio" name="point" id="slide2" disabled/>
            <label for="slide2" class="label">
              <h4 class="px-2 fw-bold">Vista Previa</h4>
              <span class="control"></span>
              <div class="slider">
                <a href="${infoMensaje.mensaje}" target="_blank">
                  <img
                    src="${infoMensaje.mensaje}"
                    alt="imagen.${ext}"
                    class="imagen-whatsapp"
                  />
                </a>
              </div>
            </label>
          </li>
        </ul>
      </div>`;
    } else if (documentos.includes(ext)) {
      contenidoMensaje = `
      <div class="my-1" style="background-color: #F1F3F4">
        <div class="d-flex" style="color: #25d366;">
          <div class="p-2 fw-bold">
            <a href="${infoMensaje.mensaje}" target="_blank" style="text-decoration: none;">
              <svg xmlns="http://www.w3.org/2000/svg" height="1.6em" viewBox="0 0 512 512"><path d="M256 464a208 208 0 1 1 0-416 208 208 0 1 1 0 416zM256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6c4.5-4.2 7.1-10.1 7.1-16.3c0-12.3-10-22.3-22.3-22.3H304V160c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32v96H150.3C138 256 128 266 128 278.3c0 6.2 2.6 12.1 7.1 16.3l107.1 99.9c3.8 3.5 8.7 5.5 13.8 5.5s10.1-2 13.8-5.5l107.1-99.9z"/></svg>
            </a>
          </div>
          <div class="py-2 fw-bold">
            <a href="${infoMensaje.mensaje}" target="_blank" style="text-decoration: none;">Descargar</a>
          </div>
        </div>
      </div>`;
    } else if (audios.includes(ext)) {
      contenidoMensaje = `
      <div class="rounded my-1" style="background-color: #F1F3F4">
        <audio class="audio-whatsapp" controls>
          <source
            src="${infoMensaje.mensaje}" type="audio/${ext}"
          >
          Tu navegador no soporta el tag audio
        </audio>
      </div>`;
    } else if (videos.includes(ext)) {
      contenidoMensaje = `
      <div class="main-img">
        <ul class="item-list">
          <li class="item2">
            <input type="radio" name="point" id="slide2" disabled/>
            <label for="slide2" class="label">
              <h4 class="px-2 fw-bold">Vista Previa</h4>
              <span class="control"></span>
              <div class="slider">
                <video width="100%" controls>
                  <source src="${infoMensaje.mensaje}" type="video/${ext}">
                  Your browser does not support HTML video.
                </video>
              </div>
            </label>
          </li>
        </ul>
      </div>`;
    } else {
      contenidoMensaje = infoMensaje.mensaje;
    }
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      // timer: 100000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      iconHtml:
        '<img style="width: 45px" src="../../../../../../../../../assets/img/iconWhatsapp.png">',
      html: `
      <div class="py-0 my-0">
        <div class="mt-2 text-white">
          <div class="fw-bold">
            ${
              infoPostulante && infoPostulante.nombre
                ? infoPostulante.nombre + ' ' + infoPostulante.apellidoPaterno
                : infoPostulante.nombre + ' ' + infoPostulante.apellidoPaterno
            }
          </div>
          <div>
            ${contenidoMensaje}
          </div>
        </div>
      </div>`,
      customClass: 'popup-whatsapp',
    });
  }
}
