import { Subscription } from 'rxjs';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IAlumnoInformacion } from '@integra/areas/comercial/models/interfaces/iagenda-datos-alumno';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';

@Component({
  selector: 'app-historial-mensajes',
  templateUrl: './historial-mensajes.component.html',
  styleUrls: ['./historial-mensajes.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HistorialMensajesComponent implements OnInit {
  @Input() agendaService: AgendaService;
  @ViewChild('modalVerCorreoAlternoSpeech') modalVerCorreoAlternoSpeech: any;
  @ViewChild('modalPreviaVistaCorreos') modalPreviaVistaCorreos: any;

  gridHistorialMensajes: KendoGrid = new KendoGrid();
  gridHistorialCorreo: KendoGrid = new KendoGrid();

  historialMensajeRecibidosChat: any = null;
  mensajesPortal: any = null;
  nombreCompletoAlumno: string = 'Cargando...';
  rowActual: any;
  buttons: any = null;
  correoEnviado: any;
  destinatarioEncode: any = '';
  alumno: IAlumnoInformacion;
  subscriptions: Subscription;
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    console.log('HistorialMensajesComponent');
    this.rowActual = this.agendaService.rowActual;
    this.initSubscribeObservables();
    this.cargarChatWhatsAppOportunidad();
  }

  initSubscribeObservables() {
    this.agendaService.agendaAlumnoService.alumno$.subscribe({
      next: (resp: IAlumnoInformacion) => {
        this.alumno = resp;
      },
    });
    this.gridHistorialMensajes.loading = true;
    this.agendaService.agendaHistorialChatsService.correoRecibidos$.subscribe({
      next: (resp) => {
        this.gridHistorialMensajes.data = resp.listaCorreos;
        this.gridHistorialMensajes.loading = false;
      },
    });
  }

  onSelectedChat(data: any) {
    this.obtenerMensajesRecibidosChatPortal(
      this.rowActual.idPersonal_Asignado,
      this.rowActual.idAlumno
    );
  }

  obtenerMensajesRecibidosChatPortal(idAsesor: number, idAlumno: number) {
    this.agendaService.agendaHistorialChatsService
      .obtenerUltimoMensajePortalChat$(idAsesor, idAlumno)
      .subscribe({
        next: (response: any) => {
          if(response.body.idInteraccionChat != undefined && response.body.idInteraccionChat != 0){
            this.obtenerHistorialMensajesRecibidosChatPortalTemp(
              response.body.idInteraccionChat
            );
          } else {
            this.mensajesPortal = null
          }
        },
      });
  }

  private obtenerHistorialMensajesRecibidosChatPortalTemp(idInteraccion: number){
    // this.agendaService.agendaHistorialChatsService
    //   .obtenerHistorialMensajesPortalChat$(idInteraccion)
    //   .subscribe({
    //     next: (response: any) => {
    //           if(response.body.length != 0){
                
    //             this.mensajesPortal = response.body
    //           } else {
    //             this.mensajesPortal = null
    //           }
    //         }
    //     })
  }

  verHistorialInbox(dataItem: any) {
    if (dataItem.tipo == null) {
      this.agendaService.agendaHistorialChatsService
        .obtenerInformacionGmail$(dataItem.id)
        .subscribe({
          next: (resp: any) => {
            console.log(resp);
          },
        });
    } else {
      this.agendaService.agendaHistorialChatsService
        .obtenerCorreosEnviadosSpeech$(dataItem)
        .subscribe({
          next: (resp: any) => {
            console.log(resp);
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
              this.modalService.open(this.modalPreviaVistaCorreos, {
                size: 'xl',
                backdrop: 'static',
              });
            } else {
              this.modalService.open(this.modalVerCorreoAlternoSpeech, {
                size: 'md',
                backdrop: 'static',
              });
            }
          },
        });
    }
  }

  verInteraccionesCorreo(dataItem: any, content: any) {
    this.agendaService.agendaHistorialChatsService
      .obtenerInteraccionesCorreosEnviados$(dataItem)
      .subscribe({
        next: (resp: any) => {
          this.gridHistorialCorreo.data = resp.body;
          this.modalService.open(content, { size: 'md' });
        },
      });
  }

  seccionEnvioWhatsApp: boolean = false;
  cargarChatWhatsAppOportunidad() {
    this.agendaService.agendaAlumnoService.numeroWhatsApp$.subscribe({
      next: (resp) => {
        if (resp != null) {
          this.agendaService.agendaHistorialChatsService
            .obtenerHistorialMensajeChat$(resp)
            .subscribe({
              next: (resp: any) => {
                if (resp.body != null && resp.body.length > 0) {
                  this.historialMensajeRecibidosChat = resp.body;
                  this.nombreCompletoAlumno = this.agendaService.rowActual.contacto;
                }
              },
            });
        }
      },
    });
  }
}
