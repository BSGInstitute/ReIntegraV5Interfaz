import { UserData } from './../../../../../../shared/models/interfaces/iuser';
import {
  ChatAbierto,
  ComboPlantillas,
  DPPlantillaInformacion,
  MensajeGenericoPostulante,
  MensajePlantillaPostulante,
  MensajesWhatsappPostulante,
  MensajeTextoPostulante,
  Plantilla,
  WhatsAppHistorialPostulanteMensajes,
  WhatsAppMensajeArchivoPostulante,
} from './../../../models/DatosPostulante';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WhatsAppPostulanteService } from './../../../services/whats-app-postulante.service';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AlertaService } from '@shared/services/alerta.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { KendoGrid } from '@shared/models/kendo-grid';
import { WhatsAppUltimoMensajesPostulante } from '@gestionPersonas/models/DatosPostulante';
import {
  SelectableMode,
  SelectableSettings,
} from '@progress/kendo-angular-grid';
import { UserService } from '@shared/services/user.service';
import { DatosDelPostulanteService } from '@gestionPersonas/services/datos-del-postulante.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { IntegraService } from '@shared/services/integra.service';
import { HttpResponse } from '@angular/common/http';
import { DataResultIterator } from '@progress/kendo-angular-grid/data/data.collection';

@Component({
  selector: 'app-dp-whatsapp-postulantes',
  templateUrl: './dp-whatsapp-postulantes.component.html',
  styleUrls: ['./dp-whatsapp-postulantes.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DpWhatsappPostulantesComponent implements OnInit {
  @ViewChild('chwcBlockMessage') chwcBlockMessage: ElementRef;
  @ViewChild('modalSeleccionarArchivo') modalSeleccionarArchivo: any;
  @ViewChild('modalPlantillaWhatsapp') modalPlantillaWhatsapp: any;

  private _subscriptions$ = new Subscription();

  comboPlantillas: ComboPlantillas;
  plantillasValidas = ['1309', '1299'];

  /*Configuración grilla*/
  gridHistorialChat = new KendoGrid<WhatsAppUltimoMensajesPostulante>();
  ListaHistorialChat: WhatsAppUltimoMensajesPostulante[] = [];
  postulanteSeleccionado: WhatsAppUltimoMensajesPostulante;
  gridLoading = false;
  public pageSize = 5;
  public buttonCount = 2;
  public sizes = [5, 10];
  public checkboxOnly = false;
  public mode: SelectableMode = 'single';
  public requireMetaKey: boolean = true;
  public drag = false;
  public selectableSettings: SelectableSettings;
  mySelection: string;

  loaderChatAndGridWhatsapp: boolean = false;

  /**Modal archivos */
  fileWhatsapp: any;
  archivoTemporal: File = null;

  modalPlantillaRef: NgbModalRef;
  modalArchivoRef: NgbModalRef;
  modalDocumentoRef: NgbModalRef;

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  bloquearSeleccion: boolean = false;
  bloquearRedaccion: boolean = false;
  validacionPlantilla: boolean = false;
  bloquearEnvio: boolean = true;

  nombreCompletoPostulante: string = 'Cargando...';
  cantidadCaracterMensaje: number = 0;

  /**Chat historial */
  chatHistorialChatWhatsApp: any[] = [];

  /**Plantillas* */
  plantillaRemplazada: Plantilla;
  confirmacionRemplazo = false;

  esPlantillaAlterno: boolean = false;

  listaPlantillas: DPPlantillaInformacion[] = [];
  formContactoEnvio: FormGroup;
  public format: FormatSettings = {
    displayFormat: 'dd/MM/yyyy HH:mm',
    inputFormat: 'dd/MM/yyyy HH:mm',
  };

  formMensaje: FormGroup = this._formBuilder.group({
    WaTo: '',
    WaType: '',
    WaTypeMensaje: 0,
    WaBody: '',
    WaCaption: '',
    WaCaptionAlterno: '',
    IdPais: 0,
    IdPostulante: 0,
    IdPersonal: 0,
    datosPlantillaWhatsApp: [],
    Usuario: '',
  });

  loadingPanelVisible = false;
  controlBotton = false;

  constructor(
    private _integraService: IntegraService,
    private whatsappService: WhatsAppPostulanteService,
    private datosPostulanteService: DatosDelPostulanteService,
    private _modalService: NgbModal,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private _userService: UserService
  ) {}

  ngOnInit() {
    this.iniciarSuscripciones();
    this.loadingTabla();
    this.inicializarForm();
    this.setSelectableSettings();
    this.formContactoEnvio
      .get('idPlantilla')
      ?.valueChanges.subscribe((value) => {
        this.controlarCampoFecha(value);
      });
  }
  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
  }

  public setSelectableSettings(): void {
    if (this.checkboxOnly || this.mode === 'single') {
      this.drag = false;
    }
    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      mode: this.mode,
      drag: this.drag,
    };
  }

  inicializarForm() {
    this.formContactoEnvio = this._formBuilder.group({
      idPlantilla: [null, Validators.required],
      Fecha: [{ value: null, disabled: true }, Validators.required],
    });
  }

  controlarCampoFecha(value: string) {
    if (this.plantillasValidas.includes(value)) {
      // Habilita el campo Fecha
      this.formContactoEnvio.get('Fecha')?.enable();
    } else {
      // Deshabilita el campo Fecha y limpia su valor
      this.formContactoEnvio.get('Fecha')?.reset();
      this.formContactoEnvio.get('Fecha')?.disable();
    }
  }

  get valorAlterno() {
    return this.formMensaje.get('WaCaption').value;
  }

  get nombrePlantilla() {
    return this.formMensaje.get('WaBody').value;
  }

  get numeroWhatsapp() {
    return this.postulanteSeleccionado.numero;
  }

  get idPersonal() {
    return this.postulanteSeleccionado.idPersonal;
  }

  SanitizedHTML(value: string): SafeHtml {
    if (!value) {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  iniciarSuscripciones() {
    let notificacion$ = this.whatsappService.mensajeRecibido$.subscribe({
      next: (resp) => {
        if (resp != undefined && resp != null)
          this.agregarMensajeChatWhatsapp(
            resp.numero,
            resp.idPostulante,
            resp.mensaje,
            resp.per
          );
        this.consultaBloqueoRedactar();
      },
    });

    const loadingWhatsApp$ = this.whatsappService
      .getLoadingWhatsApp()
      .subscribe({
        next: (success) => {
          this.loaderChatAndGridWhatsapp = success;
        },
        error: (error) => {
          this._alertaService.mensajeError(error);
        },
      });

    const chatHistorial$ = this.whatsappService
      .getHistorialChatWhatsApp()
      .subscribe({
        next: (data) => {
          console.log(data);
          this.chatHistorialChatWhatsApp = data;
          console.log('Chat Historial:', this.chatHistorialChatWhatsApp);
        },
        error: (error) => {
          this._alertaService.mensajeError(error);
        },
      });

    const historial$ = this.whatsappService.getGridHistorialChat().subscribe({
      next: (data) => {
        console.log(data);
        this.gridHistorialChat.data = data;
        this.ListaHistorialChat = data;
        console.log(data);
        console.log(this.gridHistorialChat);
      },
      error: (error) => {
        this._alertaService.mensajeError(error);
      },
    });

    const plantillas$ = this.datosPostulanteService
      .getComboPlantillas()
      .subscribe({
        next: (data) => {
          this.comboPlantillas = data;
          this.comboPlantillas.plantillaWhatsApp;
        },
        error: (error) => {
          this._alertaService.mensajeError(error);
        },
      });

    // const plantillaRemplazada$ = this.whatsappService
    //   .getPlantillaRemplazada()
    //   .subscribe({
    //     next: (data) => {
    //       if (data !== null) {
    //         this.plantillaRemplazada = data;
    //         this.formMensaje
    //           .get('WaCaption')
    //           .setValue(this.plantillaRemplazada.plantilla);
    //         this.esPlantillaAlterno = !this.esPlantillaAlterno;
    //       }
    //     },
    //     error: (error) => {
    //       this._alertaService.mensajeError(error);
    //     },
    //   });

    // const confirmacionRemplazo$ = this.whatsappService
    //   .getconfirmacionReemplazo()
    //   .subscribe({
    //     next: (success) => {
    //       this.confirmacionRemplazo = success;
    //       this.formMensaje.patchValue({
    //         WaCaption: this.plantillaRemplazada.plantilla,
    //         WaTypeMensaje: 8,
    //         WaType: 'hsm',
    //         WaBody: this.plantillaRemplazada.descripcion,
    //         datosPlantillaWhatsApp: this.plantillaRemplazada.listaEtiquetas,
    //       });
    //       if (this.confirmacionRemplazo) {
    //         this.modalPlantillaRef.close();
    //       }
    //     },
    //     error: (error) => {
    //       this._alertaService.mensajeError(error);
    //     },
    //   });

    // const validacion24Horas$ = this.whatsappService
    //   .getValidacion24Horas()
    //   .subscribe({
    //     next: (success) => {
    //       if (success) {
    //         this.bloquearRedaccion = false;
    //         this.bloquearSeleccion = false;
    //       } else {
    //         this.bloquearRedaccion = true;
    //         this.bloquearSeleccion = true;
    //       }
    //     },
    //     error: (error) => {
    //       this._alertaService.mensajeError(error);
    //     },
    //   });

    // const validacionPlantilla$ = this.whatsappService
    //   .getValidacionPlantillaEnviada()
    //   .subscribe({
    //     next: (success) => {
    //       this.validacionPlantilla = success;
    //     },
    //     error: (error) => {
    //       this._alertaService.mensajeError(error);
    //     },
    //   });

    this._subscriptions$.add(historial$);
    this._subscriptions$.add(plantillas$);
    // this._subscriptions$.add(plantillaRemplazada$);
    // this._subscriptions$.add(confirmacionRemplazo$);
    this._subscriptions$.add(loadingWhatsApp$);
    this._subscriptions$.add(chatHistorial$);
    //this._subscriptions$.add(validacionPlantilla$);
    // this._subscriptions$.add(validacion24Horas$);
    this._subscriptions$.add(notificacion$);
  }

  agregarMensajeChatWhatsapp(waTo: string, asesor: any, waBody: any, per: any) {
    const Usuario = this._userService.userData;
    let mensajeIndicadorError: MensajesWhatsappPostulante = null;
    if (waTo == 'internal') {
      mensajeIndicadorError = {
        numero: waTo,
        tipo: 1,
        mensaje: waBody,
        idPersonal: null,
        fechaCreacion: new Date(),
        idPostulante: null,
      };
    } else if (waTo == this.numeroWhatsapp) {
      switch (per) {
        case 0:
          this.whatsappService.ObtenerHistorialChat(
            Usuario.idPersonal,
            this.postulanteSeleccionado.numero,
            'GP'
          );
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
            idPostulante: null,
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
            idPostulante: null,
            estadoMensaje: 1,
            nombrePersonal: asesor,
          };
          break;
      }
      this.chatHistorialChatWhatsApp.push(mensajeIndicadorError);
      this.posicionarUltimoMensaje();
      this.consultaBloqueoRedactar();
    }
  }

  loadingTabla() {
    const loading$ = this.whatsappService.getLoadingTabla().subscribe({
      next: (success) => {
        this.gridHistorialChat.loading = success;
      },
      error: (error) => {
        this._alertaService.mensajeError(error);
      },
    });
    this._subscriptions$.add(loading$);
  }

  posicionarUltimoMensaje() {
    try {
      this.chwcBlockMessage.nativeElement.scrollTop =
        this.chwcBlockMessage.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }

  ControlSeleccionChat(selectedRow: WhatsAppUltimoMensajesPostulante) {
    if (selectedRow) {
      this.reestablecer();
      this.nombreCompletoPostulante = selectedRow.nombrePostulante;
      this.postulanteSeleccionado = selectedRow;
      this.whatsappService.ObtenerHistorialChat(
        this.idPersonal,
        this.numeroWhatsapp,
        'GP'
      );
      const chatAbierto: ChatAbierto = {
        numero: this.postulanteSeleccionado.numero,
        idPostulante: this.postulanteSeleccionado.idPostulante,
        chatAbierto: true,
      };
      this.whatsappService.setChatAbierto(chatAbierto);
      this.consultaBloqueoRedactar();
      this.posicionarUltimoMensaje();
    } else {
      console.log('No hay datos de fila seleccionados');
    }
  }

  ActualizarChatPostulanteSeleccionado() {
    this.whatsappService.ObtenerHistorialChat(
      this.idPersonal,
      this.numeroWhatsapp,
      'GP'
    );
  }

  onSelectionChange(selectedKeys: string[]) {
    console.log(selectedKeys);
    this.mySelection = selectedKeys.length > 0 ? selectedKeys[0] : null;
    console.log(this.mySelection);
    if (this.mySelection !== null) {
      const selectedRow = this.ListaHistorialChat.find(
        (item) => item.numero === this.mySelection
      );
      if (selectedRow) {
        this.ControlSeleccionChat(selectedRow);
      }
    } else {
      console.log('No hay selección');
    }
  }

  reestablecer(): void {
    this.formMensaje.reset();
    this.esPlantillaAlterno = false;
    this.bloquearRedaccion = false;
  }

  /*Funcione de reemplazo y validacion de plantillas */
  abrirModalPlantillas(): void {
    if (this.postulanteSeleccionado) {
      this.modalPlantillaRef = this._modalService.open(
        this.modalPlantillaWhatsapp,
        {
          size: 'lg',
          backdrop: 'static',
        }
      );
      this.formContactoEnvio.reset();
    } else {
      this._alertaService.addInfo(
        'Sin chat Seleccionado',
        'Seleccione un chat para poder enviar una plantilla'
      );
    }
  }

  habilitarBTN() {
    const loading$ = this.whatsappService.getHabilitarBTNWhatsApp().subscribe({
      next: (data) => {
        this.controlBotton = data;
      },
    });
    this._subscriptions$.add(loading$);
  }

  cargando() {
    const loading$ = this.whatsappService.getLoadingWhatsApp().subscribe({
      next: (data) => {
        this.loadingPanelVisible = data;
      },
    });
    this._subscriptions$.add(loading$);
  }

  obtenerCaracteres(): void {
    let mensaje = this.formMensaje.getRawValue();
    this.cantidadCaracterMensaje =
      mensaje.WaCaption && mensaje.WaCaption.length > 0
        ? mensaje.WaCaption.length
        : 0;
  }

  ValidarMensajeRecibido24Horas() {
    this.whatsappService.ValidarMensajeRecibido24Horas(this.numeroWhatsapp);
  }

  ValidarUltimaPlantillaEnviada() {
    const plantilla = this.plantillaRemplazada.descripcion;
    this.whatsappService.ValidarUltimaPlantillaEnviadav2(
      plantilla,
      this.numeroWhatsapp
    );
  }

  private consultaBloqueoRedactar(): void {
    this.whatsappService
      .ValidarMensajeRecibido24Horasv2(this.numeroWhatsapp)
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          // this.bloquearRedaccion = data.body;
          if (resp.body) {
            this.bloquearRedaccion = false;
          } else {
            this.bloquearRedaccion = true;
          }
        },
        error: (err) => {},
      });
  }

  RemplazarPlantillaEtiqueta() {
    this.controlBotton = true;
    this.loaderChatAndGridWhatsapp = true;
    if (this.formContactoEnvio.invalid) {
      this.formContactoEnvio.markAllAsTouched();
      this._alertaService.mensajeWarning('Llena los campos requeridos');
    } else {
      const datos = this.formContactoEnvio.getRawValue();
      const usuario = this._userService.userData.userName;
      const IdPersonal = this._userService.userData.idPersonal;
      const jsonData = {
        ...datos,
        Usuario: usuario,
        IdPersonal,
        IdPostulante: this.postulanteSeleccionado.idPostulante,
      };
      console.log(jsonData);
      this.whatsappService.remplazoEtiquetaV2(jsonData).subscribe({
        next: (response: HttpResponse<Plantilla>) => {
          if (response.body && response.body.plantilla) {
            this.plantillaRemplazada = response.body;
            this.formMensaje.get('WaCaption').setValue(response.body.plantilla);
            this.esPlantillaAlterno = !this.esPlantillaAlterno;
            this.controlBotton = false;
            this.confirmacionRemplazo == true;
            this.formMensaje.patchValue({
              WaCaption: this.plantillaRemplazada.plantilla,
              WaTypeMensaje: 8,
              WaType: 'hsm',
              WaBody: this.plantillaRemplazada.descripcion,
              datosPlantillaWhatsApp: this.plantillaRemplazada.listaEtiquetas,
            });
            this.loaderChatAndGridWhatsapp = false;
            console.log('Reemplazo exitoso:', response.body.plantilla);
            this.modalPlantillaRef.close();
          } else {
            this.controlBotton = false;
            this.loaderChatAndGridWhatsapp = false;
            console.log('no se realizo el remplazo');
          }
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.controlBotton = false;
          this.loaderChatAndGridWhatsapp = false;
          this._alertaService.notificationWarning(mensaje);
        },
      });
    }
  }

  enviarPlantilla(objeto: MensajePlantillaPostulante): void {
    console.log('Envio Mensaje Plantilla ', objeto);
    this.loaderChatAndGridWhatsapp = true;
    let mensajeIndicador: WhatsAppHistorialPostulanteMensajes = null;
    this.whatsappService
      .enviarMensajeApigraphWhatsappPlantilla$(objeto)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.body.estado) {
            mensajeIndicador = {
              numero: objeto.WaTo,
              tipo: 1,
              mensaje: objeto.WaCaption,
              idPersonal: null,
              idPostulante: null,
              idPais: objeto.IdPais,
              fechaCreacion: new Date(),
              fechaEstado: new Date(),
              estadoMensaje: 1,
              nombrePersonal: this._userService.userData.userName,
            };
            this.chatHistorialChatWhatsApp.push(mensajeIndicador);
            this.loaderChatAndGridWhatsapp = false;
          } else {
            this._alertaService.mensajeWarning(response.body.mensaje);
            this.loaderChatAndGridWhatsapp = false;
          }
        },
        error: (err) => {
          const error = this._alertaService.getMessageErrorService(err);
          this._alertaService.mensajeWarning(`Fallo el servicio : ${error}`);
          this.loaderChatAndGridWhatsapp = false;
        },
      });
    this.consultaBloqueoRedactar();
  }

  enviarTexto(): void {
    console.log('enviando texto...');
    let contenidoMensaje = this.formMensaje.getRawValue();
    if (contenidoMensaje && contenidoMensaje !== null) {
      if (
        contenidoMensaje.WaTypeMensaje == 8 &&
        contenidoMensaje.WaBody != null &&
        contenidoMensaje.WaBody != ''
      ) {
        console.log('Enviando Plantillas');
        //this.ValidarUltimaPlantillaEnviada();
        // if (this.validacionPlantilla) {
        //   this._alertaService.mensajeWarning(
        //     'Tiene que pasar 24 horas desde la ultimo plantilla que se envio al cliente'
        //   );
        //   this.formMensaje.reset();
        //   this.esPlantillaAlterno = false;
        // } else {
        //   this.publicarMensaje();
        // }
        this.whatsappService
          .ValidarUltimaPlantillaEnviadav2(
            this.nombrePlantilla,
            this.numeroWhatsapp
          )
          .subscribe({
            next: (resp: HttpResponse<boolean>) => {
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
        console.log('Enviando Textoooooooo....');
        // this.ValidarMensajeRecibido24Horas();
        // if (this.ValidarMensajeRecibido24Horas) {
        //   console.log('Validacion correcta 24 horas');
        //   this.publicarMensaje();
        // } else {
        //   console.log('No puede enviar mensajes de texto das24 horas');
        //   this.formMensaje.reset();
        //   this.esPlantillaAlterno = false;
        //   this._alertaService.mensajeWarning(
        //     'No puede enviar mensajes de texto por el momento'
        //   );
        // }
        this.whatsappService
          .ValidarMensajeRecibido24Horasv2(this.numeroWhatsapp)
          .subscribe({
            next: (resp: HttpResponse<boolean>) => {
              if (resp.body == true) {
                this.publicarMensaje();
              } else {
                console.log('No puede enviar mensajes de texto das24 horas');
                this.formMensaje.reset();
                this.esPlantillaAlterno = false;
                this._alertaService.mensajeWarning(
                  'No puede enviar mensajes de texto por el momento'
                );
              }
            },
          });
      } else this._alertaService.mensajeWarning('No se pudo enviar el mensaje');
    } else if (!this.bloquearRedaccion) this.publicarMensaje();
    this.consultaBloqueoRedactar();
    this.cantidadCaracterMensaje = 0;
  }
  // enviarTexto(): void {
  //   console.log('Enviando texto...');
  //   let contenidoMensaje = this.formMensaje.getRawValue();
  //   if (contenidoMensaje && contenidoMensaje !== null) {
  //     if (contenidoMensaje.WaTypeMensaje === 8) {
  //       console.log('Validando Plantilla...');
  //       this.ValidarUltimaPlantillaEnviada();
  //       const validacionPlantillaSub = this.whatsappService
  //         .getValidacionPlantillaEnviada()
  //         .subscribe({
  //           next: (success) => {
  //             if (success) {
  //               this._alertaService.mensajeWarning(
  //                 'Debe esperar 24 horas desde la última plantilla enviada.'
  //               );
  //               this.formMensaje.reset();
  //               this.esPlantillaAlterno = false;
  //             } else {
  //               this.publicarMensaje();
  //             }
  //             validacionPlantillaSub.unsubscribe();
  //           },
  //           error: (error) => {
  //             this._alertaService.mensajeError(error);
  //             validacionPlantillaSub.unsubscribe();
  //           },
  //         });

  //       this._subscriptions$.add(validacionPlantillaSub);
  //     } else {
  //       console.log('Validando mensaje de texto...');
  //       this.ValidarMensajeRecibido24Horas();

  //       const validacion24HorasSub = this.whatsappService
  //         .getValidacion24Horas()
  //         .subscribe({
  //           next: (success) => {
  //             if (success) {
  //               this.publicarMensaje();
  //             } else {
  //               this._alertaService.mensajeWarning(
  //                 'No puede enviar mensajes de texto en este momento.'
  //               );
  //               this.formMensaje.reset();
  //               this.esPlantillaAlterno = false;
  //             }
  //             validacion24HorasSub.unsubscribe();
  //           },
  //           error: (error) => {
  //             this._alertaService.mensajeError(error);
  //             validacion24HorasSub.unsubscribe();
  //           },
  //         });

  //       this._subscriptions$.add(validacion24HorasSub);
  //     }
  //   } else {
  //     this._alertaService.mensajeWarning('El mensaje no puede estar vacío.');
  //   }

  //   this.consultaBloqueoRedactar();
  //   this.cantidadCaracterMensaje = 0;
  // }

  publicarMensaje(): void {
    console.log('Publicando Mensaje...');
    let codigoPaisEnvioWhatsapp = this.postulanteSeleccionado.idPais;
    let plantilla = this.formMensaje.getRawValue();
    if (plantilla && plantilla.WaTypeMensaje == 8) {
      this.formMensaje.patchValue({
        IdPais: codigoPaisEnvioWhatsapp,
        IdPostulante: this.postulanteSeleccionado.idPostulante,
        IdPersonal: this.postulanteSeleccionado.idPersonal,
        datosPlantillaWhatsApp: this.plantillaRemplazada.listaEtiquetas,
        WaBody: this.plantillaRemplazada.descripcion,
        WaCaption: this.formMensaje.get('WaCaption').value,
        Usuario: this._userService.userData.userName,
      });
    } else {
      this.formMensaje.patchValue({
        IdPais: codigoPaisEnvioWhatsapp,
        IdPostulante: this.postulanteSeleccionado.idPostulante,
        IdPersonal: this.postulanteSeleccionado.idPersonal,
        WaCaption: '',
        WaBody: this.formMensaje.get('WaCaption').value,
        WaTypeMensaje: 1,
        Usuario: this._userService.userData.userName,
      });
    }
    this.formMensaje.get('WaTo').setValue(this.postulanteSeleccionado.numero);
    let dataMensaje = this.formMensaje.getRawValue();
    if (this.postulanteSeleccionado.numero != '' && dataMensaje.waBody != '') {
      if (dataMensaje.WaType === 'hsm') {
        this.enviarMensajeValidado(dataMensaje);
      } else this.enviarMensaje(dataMensaje);
    }
    this.formMensaje.reset();
    this.esPlantillaAlterno = false;
  }

  enviarMensajeValidado(objeto: MensajeGenericoPostulante): void {
    console.log('Mensaje Generico Validado ', objeto);
    this.loaderChatAndGridWhatsapp = true;
    if (objeto.WaTo == this.numeroWhatsapp) {
      if (objeto.WaTypeMensaje == 8) {
        this.enviarPlantilla(objeto);
      } else {
        this.enviarMensaje(objeto);
      }
    } else {
      //this.ValidarUltimaPlantillaEnviada();
      // if (this.validacionPlantilla) {
      //   if (objeto.WaTypeMensaje == 8) {
      //     this.enviarPlantilla(objeto);
      //   } else {
      //     this.enviarMensaje(objeto);
      //   }
      // } else {
      //   this._alertaService.mensajeWarning(
      //     'Ya se Envio una plantilla Igual a este Numero'
      //   );
      // }
      this.whatsappService
        .ValidarUltimaPlantillaEnviadav2(
          this.nombrePlantilla,
          this.numeroWhatsapp
        )
        .subscribe({
          next: (resp: HttpResponse<boolean>) => {
            if (resp.body) {
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

  enviarMensaje(objeto: MensajeTextoPostulante): void {
    this.loaderChatAndGridWhatsapp = true;
    let mensajeIndicador: MensajesWhatsappPostulante = null;
    console.log('Mensaje: ', objeto);
    this.whatsappService.enviarMensajeApigraphWhatsappTexto$(objeto).subscribe({
      next: (response: HttpResponse<boolean>) => {
        if (response.body) {
          mensajeIndicador = {
            idPais: this.postulanteSeleccionado.idPais,
            numero: objeto.WaTo,
            tipo: 1,
            mensaje: objeto.WaBody,
            idPersonal: null,
            fechaCreacion: new Date(),
            idPostulante: null,
            estadoMensaje: 1,
            nombrePersonal: this._userService.userData.userName,
          };
          this.chatHistorialChatWhatsApp.push(mensajeIndicador);
          this.loaderChatAndGridWhatsapp = false;
        } else {
          this._alertaService.mensajeWarning('El mensaje no fue enviado');
          this.loaderChatAndGridWhatsapp = false;
        }
      },
      error: (err) => {
        const error = this._alertaService.getMessageErrorService(err);
        this._alertaService.mensajeWarning(`Fallo el servicio : ${error}`);
        this.loaderChatAndGridWhatsapp = false;
      },
    });
    this.consultaBloqueoRedactar();
  }

  adjuntarArchivoWhatsapp() {
    let formData = new FormData();
    let documentoValido = ['application/pdf'];
    let imagenValida = ['image/png', 'image/jpeg'];

    //this.ValidarMensajeRecibido24Horas();
    this.whatsappService
      .ValidarMensajeRecibido24Horasv2(this.numeroWhatsapp)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.body == true) {
            let waType = '';
            if (documentoValido.includes(this.archivoTemporal.type)) {
              waType = 'document';
            } else if (imagenValida.includes(this.archivoTemporal.type)) {
              waType = 'image';
            }
            formData.append('file', this.archivoTemporal);

            this.whatsappService
              .adjuntarArchivoChatWhatsapp$(formData)
              .subscribe({
                next: (resp: any) => {
                  if (resp.resultado != 'Error') {
                    if (this.numeroWhatsapp != '') {
                      let obj: WhatsAppMensajeArchivoPostulante = {
                        waTo: this.numeroWhatsapp,
                        waType: waType,
                        waLink: resp.urlArchivo,
                        waFileName: resp.nombreArchivo,
                        idPais: this.postulanteSeleccionado.idPais,
                        idPostulante: this.postulanteSeleccionado.idPostulante,
                        idPersonal: this.postulanteSeleccionado.idPersonal,
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
  private enviarMensajeArchivo(objeto: WhatsAppMensajeArchivoPostulante): void {
    this.loaderChatAndGridWhatsapp = true;
    let mensajeIndicador: MensajesWhatsappPostulante = null;
    this.whatsappService
      .enviarMensajeApigraphWhatsappArchivo$(objeto)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if (response.body) {
            mensajeIndicador = {
              numero: objeto.waTo,
              tipo: 1,
              mensaje:
                objeto.waType == 'image'
                  ? `<a href="${objeto.waLink}" download target=_blank><img src="${objeto.waLink}" height=200 alt=><span style=display: block;></span><a>`
                  : `<a href="${objeto.waLink}" download target=_blank><span style=font-size:32px; class=fa fa-file aria-hidden=false></span><span style=display: block;>${objeto.waFileName}</span><a>`,
              idPersonal: null,
              fechaCreacion: new Date(),
              idPostulante: null,
              estadoMensaje: 1,
              nombrePersonal: this._userService.userData.userName,
            };
            this.chatHistorialChatWhatsApp.push(mensajeIndicador);
            this.loaderChatAndGridWhatsapp = false;
          } else {
            this._alertaService.mensajeWarning('El mensaje no fue enviado');
            this.loaderChatAndGridWhatsapp = false;
          }
        },
        error: (err) => {
          this._alertaService.mensajeWarning(`Fallo el servicio: ${err.error}`);
          this.loaderChatAndGridWhatsapp = false;
        },
      });
    this.consultaBloqueoRedactar();
  }
}
