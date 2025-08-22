import { HttpResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { IAlumnoInformacion } from '@comercial/models/interfaces/iagenda-datos-alumno';
import {
  CorreoRecibido,
  ListaCorreo,
} from '@comercial/models/interfaces/iagenda-historial-chat';
import { AgendaChatPortalWebService } from '@comercial/services/agenda/agenda-chat-portal-web.service';
import { AgendaService } from '@comercial/services/agenda/agenda.service';
import { ReconexionChatComercialService } from "@comercial/services/agenda/reconexion-chat-comercial.service";
import { constApiComercial } from '@environments/constApi';
import { environment } from '@environments/environment';
import * as signalR from '@microsoft/signalr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';

interface MensajePortal {
  idInteraccionChat: number;
  nombreRemitente: string;
  ubicacion: string;
  mensaje: string;
  idAsesor: number;
  fecha: string;
  chatsession: string;
}

interface InformacionCorreo {
  remitente: string;
  destinatarios: string;
  asunto: string;
  emailBody: string;
}
@Component({
  selector: 'app-historial-mensajes-api',
  templateUrl: './historial-mensajes-api.component.html',
  styleUrls: ['./historial-mensajes-api.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HistorialMensajesApiComponent implements OnInit {
  hubConnection: signalR.HubConnection;
  @Input() agendaService: AgendaService;
  @ViewChild('modalVerCorreoAlternoSpeech') modalVerCorreoAlternoSpeech: any;
  @ViewChild('modalPreviaVistaCorreos') modalPreviaVistaCorreos: any;
  @ViewChildren("messages") messages: QueryList<any>;
  @ViewChild("content") content: ElementRef;

  subscriptions: Subscription = new Subscription();

  gridHistorialMensajes: KendoGrid = new KendoGrid();
  gridHistorialCorreo: KendoGrid = new KendoGrid();


  historialMensajeRecibidosChat: any = [];
  mensajesPortal: any = null;
  nombreCompletoAlumno: string = 'Cargando...';
  correoEnviado: InformacionCorreo;
  destinatarioEncode: any = '';
  alumno: IAlumnoInformacion;

  loaderChatAndGridWhatsapp: boolean = false;
  bloquearRedaccion: boolean = false;
  bloquearSeleccion: boolean = true;

  emailBody: FormControl = new FormControl(null);
  archivoAdjuntos: FormControl = new FormControl(null);
  flagRecibidos: boolean = false;
  btnResponderDisabled: boolean = false;
  pasteCleanupSettings = {
    convertMsLists: true,
    removeHtmlComments: true,
    // stripTags: ['span', 'h1'],
    // removeAttributes: ['lang'],
    removeMsClasses: true,
    removeMsStyles: true,
    removeInvalidHTML: false,
  };
  modalRefVistaPrevia: any;
  
  historyOfMessages: any=[];
  dateOfLastMessage:Date=new Date;
  nombreAlumno:string;
  idPGeneral:number;
  loadingChat:boolean=false;
  formEnviarMensajeChat: FormGroup = this.formBuilder.group({
    mensaje: "",
    // plantilla: '',
    archivoAdjunto: []
  });
  ultimaInteraccion:any;
  idChatSesion:any;
  

/*Signal Connection*/
public hubConnectionChat: signalR.HubConnection;
intervalId: any;
private manualDisconnect: boolean = false;


  constructor(
    private _modalService: NgbModal,
    private _alertaService: AlertaService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private _chatPortalService:AgendaChatPortalWebService,
    private reconectarComercialService: ReconexionChatComercialService,

  ) {}

  ngOnInit(): void {
    // this.obtenerDatosCursoOportunidad();
    // this.loadChathistory();
    this.initSubscribeObservables();
    // this.loadDataOfChat();
  }
  ngOnDestroy(): void {
    // this.desconectarChat();
    // this.reconectarComercialService.closeModal()
    this.subscriptions.unsubscribe();
  }
  private desconectarChat(): void {
    this.manualDisconnect = true;
    if (this.hubConnectionChat) {
      this.hubConnectionChat
        .stop()
        .then(() => {
          console.log("Connection close");
          clearInterval(this.intervalId);
        })
        .catch(err => console.log("Error while stopping connection: " + err));
    }
  }


  ngAfterViewInit() {
    this.scrollToBottom();
    this.messages.changes.subscribe(this.scrollToBottom);
  }
  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    } catch (err) {}
  };

  initSubscribeObservables(): void {
    let sub_1$ = this.agendaService.agendaAlumnoService.alumno$.subscribe({
      next: (resp: IAlumnoInformacion) => {
        if (resp && resp != null) this.alumno = resp;
      },
    });
    this.subscriptions.add(sub_1$);
    // let sub2$ =
    //   this.agendaService.agendaChatPortalService.chatFichaMensaje$.subscribe({
    //     next: (resp) => {
    //       if (resp != undefined && resp != null)
    //         if(resp.from.toLowerCase()!==this.userService.userName){

    //           this.addMessageToHistory(resp);
    //           this.obtenerInteraccionChat(true)
    //         }
    //     },
    //   });
    this.gridHistorialMensajes.loading = true;
    let sub_3$ =
      this.agendaService.agendaHistorialChatsService.correoRecibidos$.subscribe(
        {
          next: (resp: CorreoRecibido) => {
            if (resp && resp != null) {
              this.gridHistorialMensajes.data = resp.listaCorreos;
              this.gridHistorialMensajes.loading = false;
            }
          },
        }
      );
    let sub11$ =
      this.agendaService.agendaDocumentosProgramaService.oportunidadPEspecifico$.subscribe(
        (resp) => {
          if (resp != null) {
            this.emailPersonalOportunidad = resp.oportunidad.email;
          }
        }
      );
    this.subscriptions.add(sub_3$);
    this.subscriptions.add(sub11$);
    // this.subscriptions.add(sub2$);
  }
  emailPersonalOportunidad: string = '';
  /*
    Funciones que se encargan de obtener y armar la
    informacion de sus correos
   */
  verHistorialInbox(dataItem: ListaCorreo): void {
    this.flagRecibidos = false;
    this.archivoAdjuntos.reset();
    this.emailBody.reset();
    if (dataItem.tipo == null) {
      this.flagRecibidos = true;
      this.agendaService.agendaHistorialChatsService
        .obtenerInformacionGmail$(dataItem.id)
        .subscribe({
          next: (resp: HttpResponse<any>) => {
            console.log(resp);
            this.destinatarioEncode = dataItem.destinatarios;
            // this.destinatarioEncode = '';
            this.correoEnviado = {
              destinatarios: dataItem.remitente,
              remitente: dataItem.remitente,
              asunto: dataItem.asunto,
              emailBody: resp.body.emailBody,
            };
            this.emailBody.setValue(resp.body.emailBody);
            // for (
            //   let index = 0;
            //   index < this.correoEnviado.destinatarios.length;
            //   index++
            // ) {
            //   this.destinatarioEncode += '*';
            // }
            this.modalRefVistaPrevia = this._modalService.open(
              this.modalPreviaVistaCorreos,
              {
                size: 'xl',
                backdrop: 'static',
              }
            );
          },
        });
    } else {
      this.agendaService.agendaHistorialChatsService
        .obtenerCorreosEnviadosSpeech$(dataItem)
        .subscribe({
          next: (resp: HttpResponse<InformacionCorreo>) => {
            if (resp.body.asunto != null) {
              this.destinatarioEncode = '';
              this.correoEnviado = resp.body;
              for (
                let index = 0;
                index < this.correoEnviado.destinatarios.length;
                index++
              ) {
                this.destinatarioEncode += '*';
              }
              this.emailBody.setValue(resp.body.emailBody);
              this.modalRefVistaPrevia = this._modalService.open(
                this.modalPreviaVistaCorreos,
                {
                  size: 'xl',
                  backdrop: 'static',
                }
              );
            } else {
              this.modalRefVistaPrevia = this._modalService.open(
                this.modalVerCorreoAlternoSpeech,
                {
                  size: 'md',
                  backdrop: 'static',
                }
              );
            }
          },
        });
    }
  }
  verInteraccionesCorreo(dataItem: any, content: any): void {
    this.agendaService.agendaHistorialChatsService
      .obtenerInteraccionesCorreosEnviados$(dataItem)
      .subscribe({
        next: (resp: any) => {
          this.gridHistorialCorreo.data = resp.body;
          this._modalService.open(content, { size: 'md' });
        },
      });
  }
  


  obtenerHistorialChatsPortal(): void {
    this.agendaService.agendaHistorialChatsService
      .obtenerUltimoMensajePortalChat$(
        this.agendaService.rowActual.idPersonal_Asignado,
        this.agendaService.rowActual.idAlumno
      )
      .subscribe({
        next: (response: HttpResponse<MensajePortal>) => {
          if (
            response.body.idInteraccionChat != undefined &&
            response.body.idInteraccionChat != 0
          ) {
            // this.agendaService.agendaHistorialChatsService
            //   .obtenerHistorialMensajesPortalChat$(
            //     response.body.idInteraccionChat
            //   )
            //   .subscribe({
            //     next: (resp) => {
            //       this.mensajesPortal =
            //         resp.body.length != 0 ? resp.body : null;
            //     },
            //   });
          } else this.mensajesPortal = null;
        },
      });
  }
  cargarHistorialCorreo() {
    this.gridHistorialMensajes.loading = true;
    this.agendaService.agendaHistorialChatsService.cargarHistorialCorreo(
      this.agendaService.agendaAlumnoService.alumno$.value
    );
  }
  responderCorreo() {
    let mensaje = this.emailBody.value as string;
    let adjuntos = this.archivoAdjuntos.value as any;

    let _mensaje = window.btoa(unescape(encodeURIComponent(mensaje)));

    const formData = new FormData();
    // let destinatario = this.correoEnviado.remitente as string;
    // let destinatarioTemp;
    // if(destinatario.includes('<')){
    //   destinatarioTemp = destinatario.split('<').filter(o => o.includes('>'));
    //   destinatario = destinatarioTemp[0].split('>')[0];
    // }
    formData.append(
      'IdCentroCosto',
      String(this.agendaService.rowActual.idCentroCosto)
    );
    formData.append(
      'IdOportunidad',
      String(this.agendaService.rowActual.idOportunidad)
    );
    formData.append('Remitente', this.emailPersonalOportunidad);
    // formData.append('Destinatario', 'fmamanif@bsginstitute.com');
    formData.append('Destinatario', this.alumno.email1);
    formData.append('Asunto', this.correoEnviado.asunto);
    formData.append('Mensaje', _mensaje);
    formData.append('Usuario', String(this.agendaService.userName));

    if (adjuntos != null && adjuntos.length > 0) {
      for (let index = 0; index < adjuntos.length; index++) {
        formData.append('Files', adjuntos[index]);
      }
    }
    this.btnResponderDisabled = true;
    this.agendaService.agendaActividadesService
      .sendMessageAcrossMandrill$(formData)
      .subscribe({
        next: (response: boolean) => {
          console.log(response);
          if (response == true) {
            // this.alertaService.mensajeCorreoEnviado();
            this._alertaService.mensajeCorreoExitoso();
          }
          this.btnResponderDisabled = false;
          this.cargarHistorialCorreo();
          this.modalRefVistaPrevia.close();
          // this.formularioBandejaentrada.enable();
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.swalFireOptions({
            icon: 'warning',
            title: '¡Ocurrio un problema en el envio de correos!',
            text: mensaje,
          });
          this.btnResponderDisabled = false;
        },
        complete: () => {
          this.btnResponderDisabled = false;
          // this.formularioBandejaentrada.enable();
          // this.alertaService.mensajeCorreoEnviado();
        },
      });
  }


  loadDataOfChat(){
    this.nombreAlumno=this.agendaService.rowActual.contacto
  }
  




}
