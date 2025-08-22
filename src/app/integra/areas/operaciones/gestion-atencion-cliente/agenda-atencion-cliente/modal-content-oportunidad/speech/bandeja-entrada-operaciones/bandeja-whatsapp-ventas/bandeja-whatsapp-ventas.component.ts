import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren, ViewEncapsulation  } from '@angular/core';
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
// import { AgendaService } from '@comercial/services/agenda/agenda.service';
import { Console } from 'console';
@Component({
  selector: 'app-bandeja-whatsapp-ventas',
  templateUrl: './bandeja-whatsapp-ventas.component.html',
  styleUrls: ['./bandeja-whatsapp-ventas.component.scss'],
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
export class BandejaWhatsappVentasComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private userService: UserService,
    // private agendaComercialService: AgendaService
  ) { }
  @ViewChild('chwcBlockMessage') chwcBlockMessage: ElementRef;
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
  nombreYapellido: string = '';
  loaderHistorialMensajes: boolean = true;
  historialMensajeRecibidosChat: IMensajesWhatsapp[] = [];
  historialMensajeRecibidosChatComercial: any = [];

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
  listaPlantillasWhatsappFiltro: IPlantillaWhatsapp[] = null;
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
    this.agendaService.agendaAlumnoOperacionesService.datosAlumno$.subscribe({
      next: (resp) => {
        this.alumno = resp.alumno;
        this.nombreYapellido = `${this.alumno?.nombre1} ${this.alumno?.nombre2} ${this.alumno?.apellidoPaterno} ${this.alumno?.apellidoMaterno}`
      }
    });
    this.userService.nombrePersonal$.subscribe({
      next: (resp: any) => {
        this.nombreAsesor = resp.valor;
      },
    });
    this.obtenerNumero()
    this.historialMensajeRecibidosChat=[];
    this.obtenerHistorialMensajeChatComercial();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
    this.messages.changes.subscribe(()=>this.scrollToBottom());
  }

  scrollToBottom = () => {
    if (this.content) {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    }
  };

  obtenerHistorialMensajeChatComercial() {
    this.loaderHistorialMensajes = true;
    console.log("entro obtenerHistorialMensajeChatComercial");
    if (this.numeroCelularLimpio != null) {

      this.agendaService.agendaHistorialChatOperacionesService
        .obtenerHistorialMensajeChat$(
          this.numeroCelularLimpio
        )
        .subscribe({
          next: (response: any) => {
            this.loaderHistorialMensajes = false;
            this.historialMensajeRecibidosChat = response.body;
            console.log("whatsapp comercial", this.historialMensajeRecibidosChat);
          },
          error: (err: any) => {
            this.loaderHistorialMensajes = false;
            let mensaje = this.alertaService.getMessageErrorService(err);
            this.alertaService.notificationWarning(mensaje);
          },
        });
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

  findMaxFechaCreacion() {
    this.fechaUltimoMensaje = this.historialMensajeRecibidosChat[this.historialMensajeRecibidosChat.length-1].fechaCreacion;
  }
  obtenerNumero() {
    let numero: string = this.agendaService.rowActual.celular;
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

  }
  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }
}
