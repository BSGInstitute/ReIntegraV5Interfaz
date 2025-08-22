import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiComercial, constApiGlobal, constApiOperaciones } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';

import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';

import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { UserService } from '@shared/services/user.service';
import Swal from 'sweetalert2';
import { IMensajesWhatsapp, IPlantillaWhatsapp } from '@operaciones/models/interfaces/ihistorial-mensaje-recibido';
import { IDataEnvioWhatsapp, IWhatsappNumeroValidado } from '@operaciones/models/interfaces/chat-whatsapp';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-chatwhatsapp',
  templateUrl: './chatwhatsapp.component.html',
  styleUrls: ['./chatwhatsapp.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', opacity: '0' })),
      state('expanded', style({ height: '*', opacity: '1' })),
      transition('collapsed => expanded', animate('300ms ease-in')),
      transition('expanded => collapsed', animate('200ms ease-out'))
    ])
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ChatwhatsappComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private userService: UserService
  ) { }
  @ViewChild('modalSeleccionarArchivo') modalSeleccionarArchivo: any;
  @ViewChild('modalSeleccionPlantilla') modalSeleccionPlantilla: any;
  @ViewChild('modalSeleccionDocumento') modalSeleccionDocumento: any;
  @ViewChildren('messages') messages: QueryList<any>;
  @ViewChild('content') content: ElementRef;


  dataDocumento: any = null;
  isExpanded = true;
  estadoMensajeErrorCargarDocumentos: boolean = false;
  gridDocumentosWhatsapp: KendoGrid = new KendoGrid();
  tipoAvance:any;
  @Input() agendaService: AgendaOperacionesService;
  loaderChatWhatsapp: boolean = false;
  nombreYapellido: string = 'NOMBRE Y APELLIDOS';
  loaderHistorialMensajes: boolean = false;
  historialMensajeRecibidosChat: IMensajesWhatsapp[] = [];
  camposDisponibles: any = {
    estadoChat: false,
    btnAdjunto: false,
    btnEnvio: false,
    btnEliminar: false,
  };
  formEnviarWhatsapp: FormGroup = this.formBuilder.group({
    mensaje: '',
    plantilla: '',
    archivoAdjunto: [],
  });
  cargaPlantilla: boolean;
  bloquearTextArea: boolean = false;
  loadingCargarPlantilla: boolean;
  cantidadCaracteres: number = 0;
  estadoMensajeCaracteresInvalidos: boolean = false;
  fechaUltimoMensaje: Date =  new Date();
  numeroCelularLimpio:string
  alumno:any
  listaPlantillasWhatsapp: IPlantillaWhatsapp[] = null;
  listaPlantillasWhatsappFiltrado: IPlantillaWhatsapp[] = null;
  plantillaSeleccionada: IPlantillaWhatsapp;
 // private rowActual: IRowActual;
  chatWhatsapp: boolean = false;
  bloquearEnvio: boolean = false;
  objetoPlantillasWhatsApp: any = null;
  esEnvioCorrecto:boolean;
  nombreAsesor: any;
  dataArchivo: any = null;
  modalplantilla:any
  tipoMensaje: string = 'text';
  cargawhatsapp:boolean = false
  ngOnInit(): void {
    this.formEnviarWhatsapp
    .get('mensaje')
    .setValue("");
   // this.rowActual = this.agendaService.rowActual
    this.agendaService.agendaAlumnoOperacionesService.datosAlumno$.subscribe({
      next: (resp) => {
        this.alumno = resp.alumno;
        this.nombreYapellido = `${this.alumno?.nombre1} ${this.alumno?.nombre2} ${this.alumno?.apellidoPaterno} ${this.alumno?.apellidoMaterno}`
      }
    }),
    this.userService.nombrePersonal$.subscribe({
      next: (resp: any) => {
        this.nombreAsesor = resp.valor;
      },
    });

    this.obtenerNumero()
    this.actualizardivchat()
  }

  ngAfterViewInit() {
    this.scrollToBottom();
    this.messages.changes.subscribe(this.scrollToBottom);
  }
  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop =
        this.content.nativeElement.scrollHeight;
    } catch (err) {}
  };
  actualizardivchat() {
    console.log('esaqui3');
    this.loaderChatWhatsapp = true;
    // this.dataGrillaMensajeWhatsappSeleccionado =
    //   dataRow.selectedRows[0].dataItem;
    this.loaderHistorialMensajes = true;
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.WhatsAppMensajeEnviadoWhatsAppHistorialMensajeChatOperaciones}/${this.agendaService.rowActual.idPersonal_Asignado}/${this.numeroCelularLimpio}/${this.agendaService.areaTrabajo}`
      )
      .subscribe({
        next: (response: HttpResponse<IMensajesWhatsapp[]>) => {
          this.chatWhatsapp = true;
          this.loaderChatWhatsapp = false;
          response.body.map(
            (data: any) => (data.fechaCreacion = new Date(data.fechaCreacion))
          );
          // this.bloquearEnvio = this.validarBloqueoEnvioMensaje(response.body)
          //this.camposDisponibles.estadoChat = this.bloquearEnvio;

          this.historialMensajeRecibidosChat = response.body;
          console.log("chat whatsapp", this.historialMensajeRecibidosChat);
          //this.nombreYapellido =  `${this.alumno?.nombre1} ${this.alumno?.nombre2} ${this.alumno?.apellidoPaterno} ${this.alumno?.apellidoMaterno}`
          if(this.historialMensajeRecibidosChat.length>0){
            this.findMaxFechaCreacion();
          }
          this.loaderHistorialMensajes = false;
          this.cargawhatsapp = true

           // this.rowActual.  .nombreAlumno.toLocaleUpperCase();
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
          this.loaderHistorialMensajes = false;
          this.loaderChatWhatsapp = false;
        },
      });

    this.consultaBloqueoRedactar();
  }
  findMaxFechaCreacion() {
    // for (const mensaje of this.historialMensajeRecibidosChat) {
    //   const fechaCreacionActual = mensaje.fechaCreacion;
    //   if (fechaCreacionActual > this.fechaUltimoMensaje) {
    //     this.fechaUltimoMensaje = fechaCreacionActual;
    //   }
    // }
    this.fechaUltimoMensaje = this.historialMensajeRecibidosChat[this.historialMensajeRecibidosChat.length-1].fechaCreacion;
  }
  obtenerNumero() {
    let numero: string =
      //this.alumno.celular;
      this.agendaService.rowActual.celular;

    //numero
    numero = numero.replace('+', '');
    console.log('numerosincaracteres', numero);
    switch (this.agendaService.rowActual.idCodigoPais) {
      case 0: {
        if (numero.startsWith("00")) {
          if (numero.startsWith("0052")) {
            numero = numero.substring(4);
            numero = "521" + numero;
          } else {
            numero = numero.substring(2);
            numero = "" + numero;
          }
        } else {
          numero = "" + numero;
        }
        break;
      }
      case 51: {
        if (numero.startsWith('51')) {
          numero = `${numero}`;
        } else if (numero.startsWith('0051')) {
          numero = numero.substring(2);
          numero = `${numero}`;
        } else {
          numero = `51${numero}`;
        }
        break;
      }

      case 57: {
        if (numero.startsWith('57')) {
          numero = `${numero}`;
        } else if (numero.startsWith('0057')) {
          numero = numero.substring(2);
          numero = `${numero}`;
        } else {
          numero = `57${numero}`;
        }
        //numero = `57${numero}`;// Colombia
        break;
      }
      case 591: {
        if (numero.startsWith('591')) {
          numero = `${numero}`;
        } else if (numero.startsWith('00591')) {
          numero = numero.substring(2);
          numero = `${numero}`;
        } else {
          numero = `591${numero}`;
        }
        //numero = `591${numero}`;// Bolivia
        break;
      }
      case 52: {
        // Mexico
        if (numero.startsWith('0')) {
          numero = numero.substring(4);
          numero = `521${numero}`;
        } else if (numero.startsWith('52')) {
          if (numero.startsWith('521')) {
            numero = numero;
          } else {
            numero = numero.substring(2);
            numero = `521${numero}`;
          }
        } else if (
          !numero.startsWith('0') &&
          !numero.startsWith('521') &&
          !numero.startsWith('52')
        ) {
          //numero = numero.substring(2)
          numero = `521${numero}`;
        }
        break;
      }
      default: {
        if (numero.startsWith('00')) {
          numero = numero.substring(2);
        } else {
          numero = numero;
        }

        break;
      }
    }
  this.numeroCelularLimpio = numero;
   // return numero;
  }
  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }

  recargarChatHistorial() {
    this.consultaBloqueoRedactar();
    console.log('esaqui4');
   // let dataItem: any = this.dataGrillaMensajeWhatsappSeleccionado;
    this.loaderHistorialMensajes = true;
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.WhatsAppMensajeEnviadoWhatsAppHistorialMensajeChatOperaciones}/${this.agendaService.rowActual.idPersonal_Asignado}/${this.numeroCelularLimpio}/${this.agendaService.areaTrabajo}`
      )
      .subscribe({
        next: (response: HttpResponse<IMensajesWhatsapp[]>) => {
          response.body.map(
            (data: any) => (data.fechaCreacion = new Date(data.fechaCreacion))
          );
          this.historialMensajeRecibidosChat = response.body;
          console.log('historialMensajeRecibidosChat', response.body);
          this.loaderHistorialMensajes = false;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
          this.loaderHistorialMensajes = false;
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
  abrirModalSeleccionDocumento() {
    this.gridDocumentosWhatsapp.loading = true;
    this.agendaService.agendaHistorialChatOperacionesService
      .iniciarAgendaAlumnoDocumentos$(this.agendaService.rowActual.idAlumno)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log("seleccionarDocumento",response);
          let nombrePrograma: string =
            response.body.Oportunidad.NombreProgramaGeneral;
          this.gridDocumentosWhatsapp.data = response.body.ListaDocumentos;
          this.gridDocumentosWhatsapp.loading = false;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
        },
      });
    this.modalService.open(this.modalSeleccionDocumento, {
      size: 'lg',
      backdrop: 'static',
    });
  }

  seleccionarArchivo(dataRow: any) {
    if (dataRow.target.files.length > 0) {
      this.dataArchivo = dataRow.target.files[0];
      this.modalService.open(this.modalSeleccionarArchivo, {
        size: 'sm',
        backdrop: 'static',
      });
    }
  }

  ocultarOportunidad() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadActualizarFechaOcultarWhatsApp}/${this.agendaService.rowActual.id}/${this.userService.userData.userName}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(
            this.agendaService.rowActual.id
          );
          this.agendaService.agendaControlPantallaOperacionesService.cerrarModalProgramarActividades();

          this.agendaService.agendaControlPantallaOperacionesService.cerrarModalProgramarActividades();

          // if ($('#gridMensajesWhatsAppCoordinador').data('kendoGrid')) {
          //     $('#gridMensajesWhatsAppCoordinador').data('kendoGrid').dataSource.read();
          // }
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
        },
      });
  }
  cargarPlantillaWhatsAppAgendaOperaciones() {
    this.cargaPlantilla = true;
    this.integraService
      .postJsonResponse(
        `${constApiGlobal.AlumnoEstadoContactoWhatsApp}/${this.agendaService.rowActual.idAlumno}`,
        null
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          let estadoWhatsapp: any = response.body.idEstadoContactoWhatsApp;
          this.cargarPlantillaWhatsAppAgendaOperacionesBoton(estadoWhatsapp);
          this.cargaPlantilla = false;
        },
        error: (error: any) => {
          this.cargaPlantilla = false;
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
        },
      });
  }
  cargarPlantillaWhatsAppAgendaOperacionesBoton(estadoWhatsapp: any) {
    if (estadoWhatsapp != 1) {
      this.alertaService.swalFire(
        'Error Whatsapp',
        'El alumno tiene Whatsapp Inhabilitado',
        'warning'
      );
    } else {
      this.integraService
        .getJsonResponse(
          `${constApiComercial.AgendaInformacionActividadObtenterPlantillaWhatsAppOperaciones}`
        )
        .subscribe({
          next: (response: HttpResponse<IPlantillaWhatsapp[]>) => {
            this.listaPlantillasWhatsapp = response.body;
            this.listaPlantillasWhatsappFiltrado = response.body;
            this.modalplantilla= this.modalService.open(this.modalSeleccionPlantilla, {
              size: 'xs',
              backdrop: 'static',

            });
            this.cargaPlantilla = false;
          },
          error: (error: any) => {
            this.alertaService.notificationError(
              `Error: ${this.reconocerError(error)}`
            );
          },
        });
    }
  }
  cerrarMensajeCaracteresInvalidos() {
    //this.estadoMensajeCaracteresInvalidos = false;
  }
  edicionMensajeWhatsapp(contenido: string) {
    //this.cantidadCaracteres = contenido ? contenido.length : 0;
  }
  enviarTexto() {
    //this.plantillaSeleccionada = ;
    this.consultaBloqueoRedactar();
    let mensaje = this.formEnviarWhatsapp.get('mensaje').value;
    if (this.plantillaSeleccionada && this.plantillaSeleccionada !== null) {
      if (
        this.plantillaSeleccionada.tipoPlantilla == 8 &&
        !this.bloquearEnvio
      ) {
        this.publicarMensaje(
          this.plantillaSeleccionada,
          mensaje,
          this.objetoPlantillasWhatsApp
        );
      } else if (
        this.plantillaSeleccionada.tipoPlantilla != 8 &&
        !this.bloquearEnvio
      ) {
        this.publicarMensaje(
          this.plantillaSeleccionada,
          mensaje,
          this.objetoPlantillasWhatsApp
        );
      } else {
        //this.publicarMensaje(this.plantillaSeleccionada, mensaje, this.objetoPlantillasWhatsApp);
        alert('Tiene que Pasar 24 horas desde el Ultimo mensaje del Cliente');
        this.plantillaSeleccionada = null;

        // EliminarContenido();
      }
    } else if (!this.camposDisponibles.btnEnvio) {
      this.publicarMensaje(
        this.plantillaSeleccionada,
        mensaje,
        this.objetoPlantillasWhatsApp
      );
    }
    this.formEnviarWhatsapp.reset();
    this.consultaBloqueoRedactar();
  }

  publicarMensaje(
    dataForm: IPlantillaWhatsapp,
    mensaje: any,
    objetoPlantillasWhatsApp: any
  ) {
    //let plantillaSeleccionada:IPlantillaWhatsapp = this.formEnviarWhatsapp.get('plantilla').value;
    let objeto: IDataEnvioWhatsapp;
    let codigoPaisEnvioWhatsapp = this.agendaService.rowActual.idCodigoPais;
    if (codigoPaisEnvioWhatsapp == 52) {
      codigoPaisEnvioWhatsapp = 0;
    }
    //this.messengerUsuarioId = this.numeroCelularLimpio;
    if (this.plantillaSeleccionada && this.plantillaSeleccionada) {
      if (this.plantillaSeleccionada.tipoPlantilla == 8) {
        objeto = {
          Id: 0,
          WaTo: this.numeroCelularLimpio,
          WaType: 'hsm',
          WaTypeMensaje: 8,
          WaRecipientType: 'hsm',
          WaBody: this.plantillaSeleccionada.descripcion,
          WaCaption: this.formEnviarWhatsapp.get('mensaje').value,
          IdPais: codigoPaisEnvioWhatsapp, // this.agendaService.rowActual.idCodigoPais,
          EsMigracion: true,
          IdMigracion: 0,
          IdPersonal: this.userService.userData.idPersonal,
          IdAlumno: this.agendaService.rowActual.idAlumno,
          usuario: this.userService.userName,
          datosPlantillaWhatsApp: this.objetoPlantillasWhatsApp,
        };
      } else {
        objeto = {
          Id: 0,
          WaTo: this.numeroCelularLimpio,
          WaType: 'text',
          WaTypeMensaje: 1,
          WaRecipientType: 'individual',
          WaBody: this.formEnviarWhatsapp.get('mensaje').value,
          IdPais: codigoPaisEnvioWhatsapp, // this.agendaService.rowActual.idCodigoPais,
          IdPersonal: this.userService.userData.idPersonal,
          IdAlumno: this.agendaService.rowActual.idAlumno,
          EsMigracion: true,
          IdMigracion: 0,
          usuario: this.userService.userName,
        };
      }
    } else {
      objeto = {
        Id: 0,
        WaTo: this.numeroCelularLimpio,
        WaType: 'text',
        WaTypeMensaje: 1,
        WaRecipientType: 'individual',
        WaBody: this.formEnviarWhatsapp.get('mensaje').value,
        IdPais: codigoPaisEnvioWhatsapp, //this.agendaService.rowActual.idCodigoPais,
        IdPersonal: this.userService.userData.idPersonal,
        IdAlumno: this.agendaService.rowActual.idAlumno,
        EsMigracion: true,
        IdMigracion: 0,
        usuario: this.userService.userName,
      };
    }

    console.log(objeto, 'pedritoselibre');
    // if (mensaje.substring(0, 1) === '/') {
    //   this.commandTriggered(mensaje);
    // } else {
    if (this.numeroCelularLimpio != '' && mensaje != '') {
      if (objeto.WaType === 'hsm') {
        this.enviarMensajeValidado(objeto, this.plantillaSeleccionada);
      } else {
        this.enviarMensaje(objeto);
      }
      // EliminarContenido();
      this.plantillaSeleccionada = null;
    }
    // }
  }

  enviarMensajeValidado(objeto: IDataEnvioWhatsapp, plantillaEnviar: any) {
    //this.conectarAsesor();
    let param: IWhatsappNumeroValidado = {
      idAlumno: objeto.IdAlumno,
      numeroCelular: objeto.WaTo,
      idPais: objeto.IdPais,
      usuario: this.userService.userData.userName,
    };
    this.integraService
      .postJsonResponse(
        constApiComercial.WhatsAppNumeroValidadoVerificarInsertarNumeroValidado,
        param
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.body) {
            if (objeto.WaTo == this.numeroCelularLimpio) {
              this.enviarMensaje(objeto);
              // this.integraService
              //   .postTextResponse(
              //     `${constApiOperaciones.WhatsAppMensajesWhatsAppMensaje}`,
              //     objeto
              //   ).subscribe({
              //     next: (response: HttpResponse<any>) => {
              //       console.log('llegadadewhatsappMorales', response.body);
              //     },
              //   });
              // // this.hubConnection.invoke('opSend', objeto);
              // this.consultaBloqueoRedactar();
            } else {
              this.integraService
                .getJsonResponse(
                  `${constApiComercial.WhatsAppMensajeEnviadoValidarPlantillasEnviadas}/${objeto.WaBody}/${objeto.WaTo}`
                )
                .subscribe({
                  next: (response: HttpResponse<any>) => {
                    console.log('enviarMensajeValidado', response.body);
                    if (
                      response.body == false
                      // ||
                      // plantillaEnviar.Nombre ===
                      //   'Respuesta de Seguimiento Operaciones' ||
                      // plantillaEnviar.Nombre ===
                      //   'Respuesta de Agradecimiento Operaciones' ||
                      // plantillaEnviar.Nombre ===
                      //   'Saludo de Apertura Canal Whatsapp'
                    ) {
                      this.enviarMensaje(objeto);
                      // this.integraService
                      //   .postTextResponse(
                      //     `${constApiOperaciones.WhatsAppMensajesWhatsAppMensaje}`,
                      //     objeto
                      //   )
                      //   .subscribe({
                      //     next: (response: HttpResponse<any>) => {
                      //       console.log('llegadadewhatsapp', response);
                      //     },
                      //   });
                      // // this.hubConnection.invoke('opSend', objeto);
                      // this.consultaBloqueoRedactar();
                    } else {
                      alert('Ya se Envio una plantilla Igual a Este Numero');
                    }
                  },
                });
            }
          } else {
            let param: any = {
              blocking: 'wait',
              contacts: [`+${objeto.WaTo}`],
            };
            this.integraService
              .postJsonResponse(
                `${constApiComercial.WhatsAppContactoWhatsAppValidarNumeros}/${this.userService.userData.idPersonal}/${objeto.IdPais}`,
                param
              )
              .subscribe({
                complete: () => {
                  this.integraService
                    .getJsonResponse(
                      `${constApiComercial.WhatsAppMensajeEnviadoValidarPlantillasEnviadas}/${objeto.WaBody}/${objeto.WaTo}`
                    )
                    .subscribe({
                      next: (response: HttpResponse<any>) => {
                        if (response.body) {
                          this.enviarMensaje(objeto);
                          // this.integraService
                          //   .postTextResponse(
                          //     `${constApiOperaciones.WhatsAppMensajesWhatsAppMensaje}`,
                          //     objeto
                          //   )
                          //   .subscribe({
                          //     next: (response: HttpResponse<any>) => {
                          //       console.log('llegadadewhatsapp', response.body);
                          //     },
                          //   });
                          // // this.hubConnection.invoke('opSend', objeto);
                          // this.consultaBloqueoRedactar();
                        } else {
                          alert(
                            'Ya se Envio una plantilla Igual a Este Numero'
                          );
                        }
                      },
                    });
                },
              });
          }
        },
      });
  }

  enviarMensaje(objeto: IDataEnvioWhatsapp) {
    let mensajeEnvido: any = null;
    let mensajeIndicador: IMensajesWhatsapp = null;
    mensajeEnvido = objeto.WaBody;
    // if(objeto.IdPais !=57)
    // {
      this.integraService
      .postJsonResponseWhatsapp(
        `${constApiOperaciones.WhatsAppMensajesWhatsAppMensajeApiGraph}`,
        objeto
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('llegadadewhatsapp', response.body);
          this.esEnvioCorrecto = response.body.estadoMensaje
          if(this.esEnvioCorrecto==true){
            this.notificacionEnvioFallido('success', 'El mensaje fue enviado Correctamente');
          }else{
            this.notificacionEnvioFallido('error', 'El mensaje no fue enviado');
          }
          mensajeIndicador = {
            numero: this.numeroCelularLimpio,
            tipo: 1,
            mensaje: response.body.mensaje,
            idPersonal: null,
            fechaCreacion: new Date(),
            idAlumno: null,
            estadoMensaje: 1,
            nombrePersonal: this.nombreAsesor,
          };
          this.historialMensajeRecibidosChat.push(mensajeIndicador);
        },
        error: (error: any) => {
          mensajeIndicador = {
            numero: this.numeroCelularLimpio,
            tipo: 1,
            mensaje: 'Problemas con el Servicio de whatsapp',
            idPersonal: null,
            fechaCreacion: new Date(),
            idAlumno: null,
            estadoMensaje: 1,
            nombrePersonal: this.nombreAsesor,
          };
          this.historialMensajeRecibidosChat.push(mensajeIndicador);
          this.notificacionEnvioFallido('error', 'Fallo el servicio');
        },
      });

    // }
    // else{
    //   this.integraService
    //   .postJsonResponse(
    //     `${constApiOperaciones.WhatsAppMensajesWhatsAppMensaje}`,
    //     objeto
    //   )
    //   .subscribe({
    //     next: (response: HttpResponse<any>) => {
    //       console.log('llegadadewhatsapp', response.body);
    //       this.esEnvioCorrecto = response.body.estadoMensaje
    //       if(this.esEnvioCorrecto==true){
    //         this.notificacionEnvioFallido('success', 'El mensaje fue enviado Correctamente');
    //       }else{
    //         this.notificacionEnvioFallido('error', 'El mensaje no fue enviado');
    //       }
    //       mensajeIndicador = {
    //         numero: this.numeroCelularLimpio,
    //         tipo: 1,
    //         mensaje: response.body.mensaje,
    //         idPersonal: null,
    //         fechaCreacion: new Date(),
    //         idAlumno: null,
    //         estadoMensaje: 1,
    //         nombrePersonal: this.nombreAsesor,
    //       };

    //       this.historialMensajeRecibidosChat.push(mensajeIndicador);
    //     },
    //     error: (error: any) => {
    //       mensajeIndicador = {
    //         numero: this.numeroCelularLimpio,
    //         tipo: 1,
    //         mensaje: 'Problemas con el Servicio de whatsapp',
    //         idPersonal: null,
    //         fechaCreacion: new Date(),
    //         idAlumno: null,
    //         estadoMensaje: 1,
    //         nombrePersonal: this.nombreAsesor,
    //       };
    //       this.historialMensajeRecibidosChat.push(mensajeIndicador);
    //       this.notificacionEnvioFallido('error', 'Fallo el servicio');
    //     },
    //   });

    // }

    // this.hubConnection.invoke('OpSend', ContenidoObjeto);
    this.consultaBloqueoRedactar();
  }
  notificacionEnvioFallido(icono: any, title: any) {
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: icono, //'error',
      title: title, // 'No Se Pudo enviar el Mensaje'
    });
  }

  eliminarMensaje() {
    // //if (!this.bloquearEnvio){
    // //this.alertaService.swalFire('Error', 'No se puede enviar mensajes, el asesor ya ha enviado un mensaje en las últimas 24 horas.', 'error');
    // this.formEnviarWhatsapp.patchValue({ mensaje: '' });
    // //this.consultaBloqueoRedactar()
    // //}
    // //else{
    // //this.formEnviarWhatsapp.get('mensaje').enable();
    // //this.formEnviarWhatsapp.patchValue({ mensaje: '' });
    // //}
    // this.consultaBloqueoRedactar();
  }

  consultaBloqueoRedactar() {
    //nueva logica bloqueo
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.WhatsAppMensajesValidarMesajesEnviadosEn24Horas}/${this.numeroCelularLimpio}`
      )
      .subscribe({
        next: (response: any) => {
          console.log('llegofiltro', response);

          this.bloquearTextArea = response.body;
          this.camposDisponibles.btnAdjunto = response.body;
          this.camposDisponibles.btnEnvio = response.body;
          this.camposDisponibles.btnEliminar = false;
        },
        error: (error: any) => {},
      });
  }
  cerrarMensajeErrorCargaDocumentos() {
    this.estadoMensajeErrorCargarDocumentos = false;
  }
  enviarDocumentoAgendaModal(nombreModal: any) {
    if (!this.bloquearEnvio) {
      if (this.dataDocumento.Mensaje == 'Correcto') {
        let objeto: any = {
          WaTo: this.numeroCelularLimpio,
          WaType: 'document',
          WaTypeMensaje: 2,
          WaRecipientType: 'individual',
          WaLink: this.dataDocumento.Url,
          WaFileName: this.dataDocumento.NombreDocumento,
          IdPais: this.agendaService.rowActual.idCodigoPais,
          IdPersonal: this.userService.userData.idPersonal,
          IdAlumno: this.agendaService.rowActual.idAlumno,
          EsMigracion: true,
          IdMigracion: 0,
          usuario: this.userService.userName,
        };
        if (this.numeroCelularLimpio && this.dataDocumento.NombreDocumento) {
          this.enviarMensaje(objeto);
          nombreModal.dismiss();
        }
      } else {
        this.estadoMensajeErrorCargarDocumentos = true;
      }
    } else {
      this.alertaService.swalFire(
        'Envio Invalido',
        'Debe de Pasar 24 horas tras el Ultimo mensaje',
        'warning'
      );
    }
  }
  almacenarDataDocumento(dataRow: any) {
    this.dataDocumento = dataRow.selectedRows[0].dataItem;
  }

  adjuntarArchivoWhatsapp(nombreModal: any) {
    var fdata = new FormData();

    if (!this.bloquearEnvio) {
      let nombreTipoSelecionado: string = null;
      let WaType: string = null;
      let objetoArchivo: any = null;
      if (this.dataArchivo.type == 'application/pdf') {
        nombreTipoSelecionado = 'archivosubido';
        WaType = 'document';
      } else if (this.dataArchivo.type == 'image/png' || this.dataArchivo.type =='image/jpeg') {
        nombreTipoSelecionado = 'imagensubida';
        WaType = 'image';
      }
      fdata.append('file', this.dataArchivo);
      this.integraService
        .postFormJsonResponse(
          constApiOperaciones.WhatsAppMensajeRecibidoAdjuntarArchivoWhatsApp,
          fdata
        )
        .subscribe({
          next: (resp: any) => {
            const response=resp.body
            if (response.resultado != 'Error') {
              objetoArchivo = {
                WaId: '0',
                WaTo: this.numeroCelularLimpio,
                WaType: WaType,
                WaTypeMensaje: 2,
                WaRecipientType: 'individual',
                WaLink: response.urlArchivo,
                WaFileName: response.nombreArchivo,
                IdPais: this.agendaService.rowActual.idCodigoPais,
                IdPersonal: this.userService.userData.idPersonal,
                IdAlumno: this.agendaService.rowActual.idAlumno,
                EsMigracion: true,
                IdMigracion: 0,
                usuario: this.userService.userName,
              };
              //sleep(2000);
              if (this.numeroCelularLimpio != '') {
                this.enviarMensaje(objetoArchivo);
                this.dataArchivo = null;
              } else {
                this.estadoMensajeCaracteresInvalidos = true;
                this.dataArchivo = null;
              }
            } else {
              this.dataArchivo = null;
            }
          },
          error: (error: any) => {
            this.dataArchivo = null;
          },
        });
    } else {
      alert('Tiene que Pasar 24 horas desde el Ultimo mensaje del Cliente');
      this.dataArchivo = null;
    }
    nombreModal.dismiss();
  }

  selectPlantilla2(data:any){
    console.log(data)
    this.plantillaSeleccionada = this.listaPlantillasWhatsapp.filter(x=> x.nombre == data.source.value)[0];
    this.convertirPlantillaAgenda()

  }

  convertirPlantillaAgenda() {
    //this.consultarPlantillaEnviadaEn24Horas()
    this.loadingCargarPlantilla = true;
    console.log('enviarmensaje');
   // this.plantillaSeleccionada = this.plantillaSeleccionarWhatsapp;
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaGenerarPlantillaWhatsapp}/${this.agendaService.rowActual.idOportunidad}/${this.plantillaSeleccionada.id}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loadingCargarPlantilla = false;
          if (response.body && response.body != undefined) {
            this.formEnviarWhatsapp
              .get('mensaje')
              .setValue(response.body.plantilla);
            this.tipoMensaje = 'hsm';
            //if (this.plantillaSeleccionada.tipoPlantilla == 8) {
            //this.camposDisponibles.estadoChat =  true;
            this.formEnviarWhatsapp.get('mensaje');
            this.bloquearTextArea = true;
            response.body.objetoplantilla.forEach((e: any) => {
              if (e.texto == null) {
                e.texto = ' ';
                console.log(e);
              }
            });
            this.objetoPlantillasWhatsApp = response.body.objetoplantilla;
            this.camposDisponibles.btnEnvio = false;
            // } else {
            //   //this.camposDisponibles.estadoChat =  false
            // }
          }
          this.consultarPlantillaEnviadaEn24Horas();
          //ksthis.camposDisponibles.btnEnvio = false
          //else { this.alertaService.swalFire("Error Whatsapp","El alumno tiene Whatsapp Inhabilitado","warning")  }
        },
        error: (error: any) => {
          this.loadingCargarPlantilla = false;
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
        },
      });
      this.modalplantilla.dismiss();
  }


  consultarPlantillaEnviadaEn24Horas() {
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.WhatsAppMensajesValidarPlantillasEnviadas}/${this.plantillaSeleccionada.descripcion}/${this.numeroCelularLimpio}`
      )
      .subscribe({
        next: (response: any) => {
          console.log('llegofiltroPlantilla', response);
          //this.bloquearTextArea = response.body
          this.bloquearEnvio = response.body;
          //logica antigua
        },
        error: (error: any) => {},
      });
  }
  limpiarMensaje(){
    this.formEnviarWhatsapp.get('mensaje').setValue('');
  }
  filtrarPlantilla(event: Event){
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    console.log("eventtt ", value);
    this.listaPlantillasWhatsappFiltrado = this.listaPlantillasWhatsapp.filter(x=>x.nombre.toLowerCase().includes(value.toLowerCase()));
  }
  formatoNombreApellidoPersonal(nombrePersonal: string): string{
    try{
      //Endpoint trae en el sgte formato: apellido1 apellido2 nombre1 nombre2
      let tempArr = nombrePersonal.split(" ");
      //lo ordenamos a nombre1 apellido1
      return tempArr[2] + ' ' + tempArr[0];
    }catch(err){
      return nombrePersonal;
    }
  }
}
