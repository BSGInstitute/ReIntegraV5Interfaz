import {
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from "@angular/core";
import { FormGroup, FormsModule } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { constApiOperaciones } from "@environments/constApi";
import * as signalR from "@microsoft/signalr";
import { HttpResponse } from "@microsoft/signalr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IAddMessage } from "@operaciones/models/interfaces/iagendaoperaciones";
import { IMensajesWhatsapp } from "@operaciones/models/interfaces/ihistorial-mensaje-recibido";
import { AgendaOperacionesService } from "@operaciones/services/agenda/agenda-operaciones.service";
import { ReconexionChatOperacionesService } from "@operaciones/services/agenda/reconexion-chat-operaciones.service";
import { AlertaService } from "@shared/services/alerta.service";
import { IntegraService } from "@shared/services/integra.service";
import { UserService } from "@shared/services/user.service";
import { url } from "inspector";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-chat-portal-atc",
  templateUrl: "./chat-portal-atc.component.html",
  styleUrls: ["./chat-portal-atc.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ChatPortalAtcComponent implements OnInit {
  private signal$ = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private userService: UserService,
    private reconectarService: ReconexionChatOperacionesService,
  ) {}
  isExpanded = false;
  dateOfLastMessage: Date = new Date();
  nameAlumno: string = "Alumno";
  nameAsesora: string = "Asistente";
  historyOfMessages: any;
  selectedFiles: any;
  loadingChat: boolean = false;
  intervalId: any;
  msg: string;
  idMatriculaCabecera: number;
  idChatSesion: string;
  tiempoIntervalo = 1000;
  archivoenviado: any;
  imagenMostrada: boolean = false;
  imagenUrlActual: string = "";
  manualDisconnect: boolean = false;
  nameCut: string = "Asesor";
  isChatEnd: string;
  msgEndChat: string = "Gracias por haberte comunicado con nosotros. Espero haber podido ayudarte con tus dudas e inconvenientes. Si tienes mas preguntas, no dudes en volver a contactarnos por este medio.Hasta pronto.Gracias por haberte comunicado con nosotros. Espero haber podido ayudarte con tus dudas e inconvenientes. Si tienes mas preguntas, no dudes en volver a contactarnos por este medio.Hasta pronto.";
  formEnviarMensajeChat: FormGroup = this.formBuilder.group({
    mensaje: "",
    // plantilla: '',
    archivoAdjunto: []
  });
  public hubConnectionChatFicha: signalR.HubConnection;
  @ViewChildren("messages") messages: QueryList<any>;
  @ViewChild("content") content: ElementRef;
  @Input() agendaService: AgendaOperacionesService;
  ngOnInit(): void {
    // this.reconectarService.openModal();
    // this.conectarChat();
    // this.manualDisconnect = false;
    // this.nameAlumno = this.agendaService.rowActual.contacto;
    // this.nameAsesora = this.agendaService.rowActual.asesor;
    // this.nameCut = this.formatoNombrePersonal(
    //   this.agendaService.datosPersonal.nombres +
    //     "," +
    //     this.agendaService.datosPersonal.apellidos
    // );
    // this.idMatriculaCabecera = this.agendaService.rowActual.idMatriculaCabecera;
    // this.getIdChatSesion(this.idMatriculaCabecera);
    // this.loadChathiostory();
    // this.reconectarService.openModalOportunidad$.subscribe(() => {
    //   // this.reconectarChat();
    //   this.manualDisconnect = false;
    // });
  }
 
}
