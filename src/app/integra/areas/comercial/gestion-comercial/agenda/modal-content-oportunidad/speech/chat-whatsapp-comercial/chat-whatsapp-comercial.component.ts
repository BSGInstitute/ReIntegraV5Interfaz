import { HttpResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';
import { Documento } from '@comercial/models/interfaces/iagenda-documento-programa';
import {
  WhatsAppMensajeArchivoCom,
  MensajeGenerico,
  MensajePlantilla,
  MensajeTexto,
  PlantillaInformacion,
} from '@comercial/models/interfaces/iagenda-historial-chat';
import { AgendaService } from '@comercial/services/agenda/agenda.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IMensajesWhatsapp } from '@operaciones/models/interfaces/ihistorial-mensaje-recibido';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-whatsapp-comercial',
  templateUrl: './chat-whatsapp-comercial.component.html',
  styleUrls: ['./chat-whatsapp-comercial.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatWhatsappComercialComponent implements OnInit {
  constructor(
    private _modalService: NgbModal,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder
  ) {}
  @ViewChild('chwcBlockMessage') chwcBlockMessage: ElementRef;
  @ViewChild('modalSeleccionarArchivo') modalSeleccionarArchivo: any;
  @ViewChild('modalPlantillaWhatsapp') modalPlantillaWhatsapp: any;

  @Input() agendaService: AgendaService;
  gridHistorialWhatsapp: KendoGrid = new KendoGrid();
  gridDocumentosPrograma: KendoGrid = new KendoGrid();
  nombreCompletoAlumno: string = 'Cargando...';
  bloquearSeleccion: boolean = false;
  bloquearRedaccion: boolean = false;
  subscriptions: Subscription = new Subscription();
  historialMensajeRecibidosChat: any = [];
  loaderChatAndGridWhatsapp: boolean = false;
  estadoEnviarDocumentoProgram: boolean = false;

  listaPlantillas: PlantillaInformacion[] = [];
  bloquearEnvio: boolean = true;

  archivoTemporal: File = null;
  modalArchivoRef: NgbModalRef;
  modalDocumentoRef: NgbModalRef;
  cantidadCaracterMensaje: number = 0;
  fileWhatsapp: any;
  previsualizacion: SafeHtml = '&nbsp;';
  modalPlantillaRef: NgbModalRef;
  loaderArmandoPlantillaWhatsapp: boolean = false;

  fcPlantilla = new FormControl(null);
  formMensaje: FormGroup = this._formBuilder.group({
    WaTo: '',
    WaType: '',
    WaTypeMensaje: 0,
    WaBody: '',
    WaCaption: '',
    WaCaptionAlterno: '',
    IdPais: 0,
    IdAlumno: 0,
    IdPersonal: 0,
    datosPlantillaWhatsApp: [],
  });
  esPlantillaAlterno: boolean = false;

  valoresEtiquetaWhatsapp: {
    alumnoNombre1: string;
    personalNombreCompleto: string;
    pgeneralNombre: string;
  } = {
    alumnoNombre1: '',
    personalNombreCompleto: '',
    pgeneralNombre: '',
  };
  ngOnInit(): void {
    this.obtenerValoresEtiquetaWhatsapp();
    this.initSubscribeObservables();
    this.consultaBloqueoRedactar();
    this.nombreCompletoAlumno = this.agendaService.rowActual.contacto;
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  get valorAlterno() {
    return this.formMensaje.get('WaCaption').value;
  }
  get numeroWhatsapp() {
    return this.agendaService.agendaAlumnoService.numeroWhatsApp$.value;
  }
  initSubscribeObservables() {
    let sub1$ =
      this.agendaService.agendaChatWhatsappService.objetoMensaje$.subscribe({
        next: (resp) => {
          if (resp != undefined && resp != null)
            this.agregarMensajeChatWhatsapp(
              resp.numero,
              resp.idAlumno,
              resp.mensaje,
              resp.per
            );
          this.consultaBloqueoRedactar();
        },
      });
    let sub2$ =
      this.agendaService.agendaAlumnoService.numeroWhatsApp$.subscribe({
        next: (nro) => {
          if (nro != null) {
            this.obtenerHistorialMensajeChat();
          }
        },
      });
    this.gridDocumentosPrograma.loading = true;
    let sub3$ =
      this.agendaService.agendaDocumentosProgramaService.documentosPrograma$.subscribe(
        {
          next: (response) => {
            if (response != null) {
              this.gridDocumentosPrograma.data = response.documentos;
              this.gridDocumentosPrograma.loading = false;
            }
          },
          error: (error) => {

          }
        }
      );
    this.subscriptions.add(sub1$);
    this.subscriptions.add(sub2$);
    this.subscriptions.add(sub3$);
  }
  private consultaBloqueoRedactar(): void {
    this.agendaService.agendaAlumnoService.numeroWhatsApp$.subscribe({
      next: (resp) => {
        if (resp) {
          this.agendaService.agendaHistorialChatsService
            .validarMensajeEnviadoEn24Horas$(resp ,this.agendaService.idPersonal, this.agendaService.rowActual.idCodigoPais, this.agendaService.rowActual.idPersonal_Asignado)
            .subscribe({
              next: (resp) => {
                this.bloquearRedaccion = resp.body;
              },
              error: (err) => {},
            });
        }
      },
    });
  }
  agregarMensajeChatWhatsapp(waTo: string, asesor: any, waBody: any, per: any) {
    let mensajeIndicadorError: IMensajesWhatsapp = null;
    if (waTo == 'internal') {
      mensajeIndicadorError = {
        numero: waTo,
        tipo: 1,
        mensaje: waBody,
        idPersonal: null,
        fechaCreacion: new Date(),
        idAlumno: null,
      };
    } else if (waTo == this.numeroWhatsapp) {
      switch (per) {
        case 0:
          this.agendaService.agendaHistorialChatsService
            .obtenerHistorialMensajeRecibidosChat$(waTo)
            .subscribe({
              next: (response) => {
                this.gridHistorialWhatsapp.data = response.body;
              },
              error: (err) => {
                this._alertaService.mensajeWarning(err.error);
              },
            });
          let urlInvertida = this._alertaService.invertirTexto(waBody);
          let ext = this._alertaService.invertirTexto(
            urlInvertida.substring(0, urlInvertida.indexOf('.'))
          );
          let imagenes = 'bmp gif jpg jpeg tif png'.split(' ');
          let documentos =
            'docx doc md odt pdf ppt pptx txt xls xlsx csv rar zip'.split(' ');
          let audios = 'flac mp3 aac ogg wma wav wave mpeg'.split(' ');
          let videos = 'avi flv mov mp4'.split(' ');
          let contenidoMensaje = '';
          if (imagenes.includes(ext)) {
            contenidoMensaje = `<a href="${waBody}" download target=_blank><img src="${waBody}" height="200" alt=><span style=display: block;></span><a>`;
          } else if (documentos.includes(ext)) {
            contenidoMensaje = `<a href="${waBody}" download target=_blank><span style=font-size:32px; class=fa fa-file aria-hidden=false></span><span style=display: block;>Descargar documento</span><a>`;
          } else if (audios.includes(ext)) {
            contenidoMensaje = `<audio controls><source src="${waBody}" type="audio/${ext}" >Tu navegador no soporta el tag audio</audio>`;
          } else if (videos.includes(ext)) {
            contenidoMensaje = `<video controls><source src="${waBody}" type="video/${ext}">Your browser does not support HTML video.</video>`;
          } else {
            contenidoMensaje = waBody;
          }
          mensajeIndicadorError = {
            numero: waTo,
            tipo: 2,
            mensaje: contenidoMensaje,
            idPersonal: null,
            fechaCreacion: new Date(),
            idAlumno: null,
            estadoMensaje: 1,
            nombrePersonal: asesor,
          };
          break;
        case 1:
          mensajeIndicadorError = {
            numero: waTo,
            tipo: 1,
            mensaje: waBody,
            idPersonal: null,
            fechaCreacion: new Date(),
            idAlumno: null,
            estadoMensaje: 1,
            nombrePersonal: asesor,
          };
          break;
      }
      this.historialMensajeRecibidosChat.push(mensajeIndicadorError);
      this.posicionarUltimoMensaje();
      this.consultaBloqueoRedactar();
    }
  }
  posicionarUltimoMensaje() {
    try {
      this.chwcBlockMessage.nativeElement.scrollTop =
        this.chwcBlockMessage.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }
  obtenerHistorialMensajeChat() {
    if (this.agendaService.agendaAlumnoService.numeroWhatsApp$.value != null) {
      this.loaderChatAndGridWhatsapp = true;
      this.agendaService.agendaHistorialChatsService
        .obtenerHistorialMensajeChat$(
          this.agendaService.agendaAlumnoService.numeroWhatsApp$.value
        )
        .subscribe({
          next: (response) => {
            this.loaderChatAndGridWhatsapp = false;
            this.historialMensajeRecibidosChat = response.body;
            this.bloquearSeleccion = false;
            this.posicionarUltimoMensaje();
          },
          error: (err) => {
            this.loaderChatAndGridWhatsapp = false;
            let mensaje = this._alertaService.getMessageErrorService(err);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    }
  }
  adjuntarArchivoWhatsapp() {
    let formData = new FormData();
    let documentoValido = ['application/pdf'];
    let imagenValida = ['image/png', 'image/jpeg'];

    this.agendaService.agendaHistorialChatsService
      .validarMesajeRecibidosApiComercial$(
        this.agendaService.agendaAlumnoService.numeroWhatsApp$.value
      )
      .subscribe({
        next: (resp) => {
          if (resp.body == true) {
            let waType = '';
            if (documentoValido.includes(this.archivoTemporal.type)) {
              waType = 'document';
            } else if (imagenValida.includes(this.archivoTemporal.type)) {
              waType = 'image';
            }
            formData.append('file', this.archivoTemporal);

            this.agendaService.agendaHistorialChatsService
              .adjuntarArchivoChatWhatsapp$(formData)
              .subscribe({
                next: (resp: any) => {
                  if (resp.resultado != 'Error') {
                    if (this.numeroWhatsapp != '') {
                      let obj: WhatsAppMensajeArchivoCom = {
                        waTo: this.numeroWhatsapp,
                        waType: waType,
                        waLink: resp.urlArchivo,
                        waFileName: resp.nombreArchivo,
                        idPais: this.agendaService.rowActual.idCodigoPais,
                        idAlumno: this.agendaService.rowActual.idAlumno,
                        idPersonal:
                          this.agendaService.rowActual.idPersonal_Asignado,
                      };
                      this.enviarMensajeArchivo(obj);
                    }
                  }
                  this.archivoTemporal = null;
                },
                error: (err) => {
                  this._alertaService.mensajeWarning(err.error);
                  this.archivoTemporal = null;
                },
              });
          } else {
            this.formMensaje.reset();
            this.esPlantillaAlterno = false;
            this._alertaService.mensajeWarning(
              'No puede enviar documentos por el momento'
            );
          }
          this.modalArchivoRef.close();
        },
        error: (error: any) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  seleccionarArchivo(event: any) {
    if (event.target.files.length > 0) {
      let dataFile = event.target.files[0];
      this.fileWhatsapp = dataFile;
      this.archivoTemporal = dataFile;
      this.modalArchivoRef = this._modalService.open(
        this.modalSeleccionarArchivo,
        {
          size: 'sm',
          backdrop: 'static',
        }
      );
    }
  }
  private enviarMensajeArchivo(objeto: WhatsAppMensajeArchivoCom): void {
    this.loaderChatAndGridWhatsapp = true;
    let mensajeIndicador: IMensajesWhatsapp = null;
    this.agendaService.agendaHistorialChatsService
      .enviarMensajeApigraphWhatsappArchivo$(objeto)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if (!response.body) {
            mensajeIndicador = {
              numero: objeto.waTo,
              tipo: 1,
              mensaje:
                objeto.waType == 'image'
                  ? `<a href="${objeto.waLink}" download target=_blank><img src="${objeto.waLink}" height=200 alt=><span style=display: block;></span><a>`
                  : `<a href="${objeto.waLink}" download target=_blank><span style=font-size:32px; class=fa fa-file aria-hidden=false></span><span style=display: block;>${objeto.waFileName}</span><a>`,
              idPersonal: null,
              fechaCreacion: new Date(),
              idAlumno: null,
              estadoMensaje: 1,
              nombrePersonal: this.agendaService.personalNombres,
            };
            this.historialMensajeRecibidosChat.push(mensajeIndicador);
            this.loaderChatAndGridWhatsapp = false;
          } else {
            this._alertaService.mensajeWarning('El mensaje no fue enviado');
          }
        },
        error: (err) => {
          this._alertaService.mensajeWarning(`Fallo el servicio: ${err.error}`);
          this.loaderChatAndGridWhatsapp = false;
        },
      });
    this.consultaBloqueoRedactar();
  }

  reestablecer(): void {
    this.formMensaje.reset();
    this.esPlantillaAlterno = false;
    this.bloquearRedaccion = false;
  }
  /*
    Funciones que permiten gestionar el manejo de plantillas
    para aperturar del canal de contacto
   */
  abrirModalPlantillas(): void {
    this.previsualizacion = '&nbsp;';
    this.modalPlantillaRef = this._modalService.open(
      this.modalPlantillaWhatsapp,
      {
        size: 'lg',
        backdrop: 'static',
      }
    );
    this.fcPlantilla.reset();
  }

  enviarTexto(): void {
    let contenidoMensaje = this.formMensaje.getRawValue();
    if (contenidoMensaje && contenidoMensaje !== null) {
      if (
        contenidoMensaje.WaTypeMensaje == 8 &&
        contenidoMensaje.WaBody != null &&
        contenidoMensaje.WaBody != ''
      ) {
        this.agendaService.agendaHistorialChatsService
          .consultarPlantillaEnviadaEn24Hrs$(
            this.formMensaje.get('WaBody').value,
            this.agendaService.agendaAlumnoService.numeroWhatsApp$.value,
            this.agendaService.idPersonal, 
            this.agendaService.rowActual.idCodigoPais, 
            this.agendaService.rowActual.idPersonal_Asignado
          )
          .subscribe({
            next: (resp: HttpResponse<boolean>) => {
              this.bloquearEnvio = resp.body;
              if (resp.body == true) {
                this._alertaService.mensajeWarning(
                  'Tiene que pasar 24 horas desde la ultimo plantilla que se envio al cliente'
                );
                this.formMensaje.reset();
                this.esPlantillaAlterno = false;
              } else {
                this.publicarMensaje();
              }
            },
          });
      } else if (contenidoMensaje.WaTypeMensaje != 8) {
        this.agendaService.agendaHistorialChatsService
          .validarMesajeRecibidosApiComercial$(
            this.agendaService.agendaAlumnoService.numeroWhatsApp$.value
          )
          .subscribe({
            next: (resp: HttpResponse<boolean>) => {
              if (resp.body == true) {
                this.publicarMensaje();
              } else {
                this.formMensaje.reset();
                this.esPlantillaAlterno = false;
                this._alertaService.mensajeWarning(
                  'No puede enviar mensajes de texto por el momento'
                );
              }
            },
            error: (error: any) => {
              // this.formMensaje.reset();
            },
          });
      } else this._alertaService.mensajeWarning('No se pudo enviar el mensaje');
    } else if (!this.bloquearRedaccion) this.publicarMensaje();
    this.consultaBloqueoRedactar();
    this.cantidadCaracterMensaje = 0;
  }
  enviarMensajeValidado(objeto: MensajeGenerico): void {
    this.loaderChatAndGridWhatsapp = true;
    if (objeto.WaTo == this.numeroWhatsapp) {
      if (objeto.WaTypeMensaje == 8) {
        this.enviarPlantilla(objeto);
      } else {
        this.enviarMensaje(objeto);
      }
    } else {
      this.agendaService.agendaHistorialChatsService
        .validarPlantillEnviadaWhatsapp$(objeto.WaBody, objeto.WaTo)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            if (!response.body) {
              if (objeto.WaTypeMensaje == 8) {
                this.enviarPlantilla(objeto);
              } else {
                this.enviarMensaje(objeto);
              }
            } else {
              this._alertaService.mensajeWarning(
                'Ya se Envio una plantilla Igual a este Numero'
              );
            }
          },
        });
    }
    this.loaderChatAndGridWhatsapp = false;
  }
  enviarMensaje(objeto: MensajeTexto): void {
    this.loaderChatAndGridWhatsapp = true;
    let mensajeIndicador: IMensajesWhatsapp = null;
    this.agendaService.agendaHistorialChatsService
      .enviarMensajeApigraphWhatsappTexto$(objeto)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if (!response.body) {
            mensajeIndicador = {
              numero: objeto.WaTo,
              tipo: 1,
              mensaje: objeto.WaBody,
              idPersonal: null,
              fechaCreacion: new Date(),
              idAlumno: null,
              estadoMensaje: 1,
              nombrePersonal: this.agendaService.personalNombres,
            };
            this.historialMensajeRecibidosChat.push(mensajeIndicador);
            this.loaderChatAndGridWhatsapp = false;
          } else {
            this._alertaService.mensajeWarning('El mensaje no fue enviado');
          }
        },
        error: (err) => {
          this._alertaService.mensajeWarning(`Fallo el servicio: ${err.error}`);
          this.loaderChatAndGridWhatsapp = false;
        },
      });
    this.consultaBloqueoRedactar();
  }
  /**
   * Actualiza la fecha de ocultar whatsapp
   */
  ocultarOportunidad() {
    this.agendaService.agendaInformacionActividadOportunidadService
      .actualizarFechaOcultarWhatsApp$()
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.agendaService.agendaActividadesService.obtenerWhatsapp(
            this.agendaService.agendaInicializarService.gridWhatsapp.filtroTemp
              .idsAsesores
          );
          this.agendaService.agendaControlPantallaService.cerrarModalProgramarActividades();
        },
        error: (error: any) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  enviarPlantilla(objeto: MensajePlantilla): void {
    this.loaderChatAndGridWhatsapp = true;
    let mensajeIndicador: IMensajesWhatsapp = null;
    this.agendaService.agendaHistorialChatsService
      .enviarMensajeApigraphWhatsappPlantilla$(objeto)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (!response.body.estado) {
            mensajeIndicador = {
              numero: objeto.WaTo,
              tipo: 1,
              mensaje: objeto.WaCaption,
              idPersonal: null,
              fechaCreacion: new Date(),
              idAlumno: null,
              estadoMensaje: 1,
              nombrePersonal: this.agendaService.personalNombres,
            };
            this.historialMensajeRecibidosChat.push(mensajeIndicador);
            this.loaderChatAndGridWhatsapp = false;
          } else {
            this._alertaService.mensajeWarning(response.body.mensaje);
          }
        },
        error: (err) => {
          this._alertaService.mensajeWarning(`Fallo el servicio: ${err.error}`);
          this.loaderChatAndGridWhatsapp = false;
        },
      });
    this.consultaBloqueoRedactar();
  }
  publicarMensaje(): void {
    let codigoPaisEnvioWhatsapp = this.agendaService.rowActual.idCodigoPais;
    let plantilla = this.formMensaje.getRawValue();
    if (plantilla && plantilla.WaTypeMensaje == 8) {
      this.formMensaje.patchValue({
        IdPais: codigoPaisEnvioWhatsapp,
        IdAlumno: this.agendaService.rowActual.idAlumno,
        IdPersonal: this.agendaService.rowActual.idPersonal_Asignado,
      });
    } else {
      this.formMensaje.patchValue({
        IdPais: codigoPaisEnvioWhatsapp,
        IdAlumno: this.agendaService.rowActual.idAlumno,
        IdPersonal: this.agendaService.rowActual.idPersonal_Asignado,
        WaBody: this.formMensaje.get('WaCaption').value,
        WaTypeMensaje: 1,
      });
    }
    this.formMensaje
      .get('WaTo')
      .setValue(this.agendaService.agendaAlumnoService.numeroWhatsApp$.value);
    let dataMensaje = this.formMensaje.getRawValue();
    if (
      this.agendaService.agendaAlumnoService.numeroWhatsApp$.value != '' &&
      dataMensaje.waBody != ''
    ) {
      if (dataMensaje.WaType === 'hsm') {
        this.enviarMensajeValidado(dataMensaje);
      } else this.enviarMensaje(dataMensaje);
    }
    this.formMensaje.reset();
    this.esPlantillaAlterno = false;
  }
  obtenerCaracteres(): void {
    let mensaje = this.formMensaje.getRawValue();
    this.cantidadCaracterMensaje =
      mensaje.WaCaption && mensaje.WaCaption.length > 0
        ? mensaje.WaCaption.length
        : 0;
  }
  /**
   * Genera la cen
   * @param {PlantillaInformacion} event
   * @returns {string}
   */
  remplazarValoresEtiquetaWhatsapp(event: PlantillaInformacion): string {
    let contenido = event.contenido;
    contenido = contenido.replace(
      '{tAlumno.Nombre1}',
      this.valoresEtiquetaWhatsapp.alumnoNombre1
    );
    contenido = contenido.replace(
      '{tPersonal.NombreCompleto}',
      this.valoresEtiquetaWhatsapp.personalNombreCompleto
    );
    contenido = contenido.replace(
      '{tPegeneral.Nombre}',
      this.valoresEtiquetaWhatsapp.pgeneralNombre
    );
    return contenido;
  }
  /**
   * Genera la cadena de previsualizacion para el combo de plantillas
   * @param {PlantillaInformacion} event
   * @returns {string}
   */
  private generarCadenaPrivisualizacion(event: PlantillaInformacion): string {
    let contenido = event.contenido;
    contenido = contenido.replace(
      '{tAlumno.Nombre1}',
      this.valoresEtiquetaWhatsapp.alumnoNombre1
    );
    contenido = contenido.replace(
      '{tPersonal.NombreCompleto}',
      this.valoresEtiquetaWhatsapp.personalNombreCompleto
    );
    contenido = contenido.replace(
      '{tPegeneral.Nombre}',
      this.valoresEtiquetaWhatsapp.pgeneralNombre
    );
    const div = document.createElement('div');
    div.innerHTML = contenido;
    return div.textContent || div.innerText;
  }
  /**
   * Genera el html para la previsualizacion en el modal de plantillas de whatsapp
   * @param event
   */
  calcularHtml(event: PlantillaInformacion) {
    if (event.id != null) {
      this.previsualizacion = this.remplazarValoresEtiquetaWhatsapp(event);
    } else {
      this.previsualizacion = '&nbsp;';
    }
  }
  private obtenerValoresEtiquetaWhatsapp() {
    this.agendaService.agendaHistorialChatsService
      .obtenerValoresEtiquetaWhatsapp$(
        this.agendaService.rowActual.idOportunidad
      )
      .subscribe({
        next: (resp) => {
          if (resp.body != null) {
            this.valoresEtiquetaWhatsapp = resp.body;
          }
          this.obtenerPlantillasWhatsapp();
        },
      });
  }
  private obtenerPlantillasWhatsapp(): void {
    this.agendaService.agendaHistorialChatsService
      .obtenerPlantillaIniciarChatWhatsapp$()
      .subscribe({
        next: (resp) => {
          resp.body.forEach((x) => {
            x.nombreAlterno = x.nombre.replace('COMERCIAL |', '').trim();
            x.htmlPrevisualizacion = this.generarCadenaPrivisualizacion(x);
          });
          this.listaPlantillas = resp.body;
        },
      });
  }
  private consultarPlantillaEnviada24hrs(descripcionPlantilla: string): void {
    this.agendaService.agendaHistorialChatsService
      .consultarPlantillaEnviadaEn24Hrs$(
        descripcionPlantilla,
        this.agendaService.agendaAlumnoService.numeroWhatsApp$.value,
        this.agendaService.idPersonal, 
        this.agendaService.rowActual.idCodigoPais, 
        this.agendaService.rowActual.idPersonal_Asignado
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.bloquearEnvio = resp.body;
        },
      });
  }
  /**
   * Genera la plantilla para el envio de whatsapp
   */
  generarPlantillaWhatsappComercial(): void {
    let plantilla: PlantillaInformacion = this.fcPlantilla.value;
    if (plantilla && plantilla.id) {
      this.loaderArmandoPlantillaWhatsapp = true;
      this.agendaService.agendaHistorialChatsService
        .generarPlantillaWhatsappComercial$(
          this.agendaService.rowActual.idOportunidad,
          plantilla.id
        )
        .subscribe({
          next: (resp) => {
            if (resp.body != null && resp.body != undefined) {
              resp.body.objetoplantilla.forEach((e) => {
                if (e.texto == null) e.texto = ' ';
              });
              this.formMensaje.patchValue({
                WaCaption: resp.body.plantilla,
                WaTypeMensaje: plantilla.tipoPlantilla,
                WaType: 'hsm',
                WaBody: plantilla.descripcion,
                datosPlantillaWhatsApp: resp.body.objetoplantilla,
              });
              this.esPlantillaAlterno = true;
              this.bloquearRedaccion = true;
              this.fcPlantilla.reset();
              this.modalPlantillaRef.close();
              this.loaderArmandoPlantillaWhatsapp = false;
              this.consultarPlantillaEnviada24hrs(plantilla.descripcion);
            }
          },
          error: (error) => {
            this.loaderArmandoPlantillaWhatsapp = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.mensajeWarning(mensaje);
          },
        });
    } else {
      this._alertaService.mensajeWarning('Seleccione una plantilla');
    }
  }
  /**
   * Abre el modal de documentos
   * @param modalContext
   */
  verDocumentosPrograma(modalContext: any) {
    this.modalDocumentoRef = this._modalService.open(modalContext, {
      size: 'lg',
      backdrop: 'static',
    });
  }
  /**
   * Envio de documentos por whatsapp
   * @param documento
   */
  private enviarDocumentoRepositorio(documento: Documento) {
    this.agendaService.agendaHistorialChatsService
      .validarMesajeRecibidosApiComercial$(
        this.agendaService.agendaAlumnoService.numeroWhatsApp$.value
      )
      .subscribe({
        next: (resp) => {
          if (resp.body == true) {
            if (this.numeroWhatsapp != '') {
              let obj: WhatsAppMensajeArchivoCom = {
                waTo: this.numeroWhatsapp,
                waType: 'document',
                waLink: documento.url,
                waFileName: documento.nombre,
                idPais:
                  this.agendaService.agendaAlumnoService.alumno$.value
                    .idCodigoPais,
                idAlumno:
                  this.agendaService.agendaAlumnoService.alumno$.value.id,
                idPersonal: this.agendaService.rowActual.idPersonal_Asignado,
              };
              this.enviarMensajeArchivo(obj);
            }
          } else {
            this.formMensaje.reset();
            this.esPlantillaAlterno = false;
            this._alertaService.mensajeWarning(
              'No puede enviar mensajes de texto por el momento'
            );
          }
          this.modalDocumentoRef.close();
        },
        error: (error: any) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  /**
   * Envio de archivo generado al repositorio y posteriormente su envio por whatsapp
   * @param documento
   */
  private enviarBlobRepositorio(documento: Documento) {
    this.agendaService.agendaHistorialChatsService
      .validarMesajeRecibidosApiComercial$(
        this.agendaService.agendaAlumnoService.numeroWhatsApp$.value
      )
      .subscribe({
        next: (resp) => {
          if (resp.body == true) {
            let base64str = documento.documentoByte;
            let binary = atob(base64str.replace(/\s/g, ''));
            let len = binary.length;
            let buffer = new ArrayBuffer(len);
            let view = new Uint8Array(buffer);
            for (let i = 0; i < len; i++) {
              view[i] = binary.charCodeAt(i);
            }
            let blob = new Blob([view], { type: 'application/pdf' });
            const formData = new FormData();
            formData.append(
              'file',
              blob,
              `${documento.nombre}-${this.agendaService.rowActual.idOportunidad}.pdf`
            );

            this.agendaService.agendaHistorialChatsService
              .adjuntarArchivoChatWhatsapp$(formData)
              .subscribe({
                next: (resp: any) => {
                  if (resp.resultado != 'Error') {
                    if (this.numeroWhatsapp != '') {
                      let obj: WhatsAppMensajeArchivoCom = {
                        waTo: this.numeroWhatsapp,
                        waType: 'document',
                        waLink: resp.urlArchivo,
                        waFileName: resp.nombreArchivo,
                        idPais: this.agendaService.rowActual.idCodigoPais,
                        idAlumno: this.agendaService.rowActual.idAlumno,
                        idPersonal:
                          this.agendaService.rowActual.idPersonal_Asignado,
                      };
                      this.enviarMensajeArchivo(obj);
                    }
                  }
                },
                error: (err) => {
                  this._alertaService.mensajeWarning(err.error);
                  this.archivoTemporal = null;
                },
              });
          } else {
            this.formMensaje.reset();
            this.esPlantillaAlterno = false;
            this._alertaService.mensajeWarning(
              'No puede enviar documentos por el momento'
            );
          }
          this.modalDocumentoRef.close();
        },
        error: (error: any) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  /**
   * Envio de documentos programa para whatsapp
   * @param documento
   */
  enviarDocumentoPrograma(documento: Documento) {
    if (documento != null) {
      if (documento.url != null && documento.mensaje !== 'Incorrecto') {
        if (
          documento.id === 7 ||
          documento.id === 4 ||
          documento.id === 9 ||
          documento.id === 8 ||
          documento.id === 10 ||
          documento.id === 11 ||
          documento.id === 12
        ) {
          this.enviarBlobRepositorio(documento);
        } else {
          this.enviarDocumentoRepositorio(documento);
        }
      }
    }
  }
  /**
   * Descarga de documentos
   * @param documento Documento seleccionado
   */
  descargarDocumentoPrograma(documento: Documento) {
    if (documento != null) {
      if (documento.url != null && documento.mensaje !== 'Incorrecto') {
        if (
          documento.id === 7 ||
          documento.id === 4 ||
          documento.id === 9 ||
          documento.id === 8 ||
          documento.id === 10 ||
          documento.id === 11 ||
          documento.id === 12
        ) {
          let a = document.createElement('a');
          document.body.appendChild(a);
          let base64str = documento.documentoByte;
          let binary = atob(base64str.replace(/\s/g, ''));
          let len = binary.length;
          let buffer = new ArrayBuffer(len);
          let view = new Uint8Array(buffer);
          for (let i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
          }
          let blob = new Blob([view], { type: 'application/pdf' });
          let url = URL.createObjectURL(blob);
          window.open(url, documento.nombre);
          a.href = url;
          a.download = documento.nombre;
          a.click();
          window.URL.revokeObjectURL(url);
        } else {
          window.open(documento.url);
        }
      }
    }
  }
  obtenerDocumentosPorIdActividadDetalle() {
    this.agendaService.agendaDocumentosProgramaService.obtenerDocumentosPorIdActividadDetalle(
      this.agendaService.rowActual.id
    );
  }
}
