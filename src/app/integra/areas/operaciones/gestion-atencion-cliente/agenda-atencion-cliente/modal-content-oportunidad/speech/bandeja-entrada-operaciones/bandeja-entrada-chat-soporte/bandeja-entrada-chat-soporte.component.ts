import { Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild, ViewChildren, QueryList} from '@angular/core';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';

@Component({
  selector: 'app-bandeja-entrada-chat-soporte',
  templateUrl: './bandeja-entrada-chat-soporte.component.html',
  styleUrls: ['./bandeja-entrada-chat-soporte.component.scss']
})
export class BandejaEntradaChatSoporteComponent implements OnInit {

  @ViewChild('myScrollableDiv') myScrollableDiv!: ElementRef;
  @ViewChildren('messages') messages: QueryList<any>;
  @Input() agendaService: AgendaOperacionesService;
  mensajes: any[];
  constructor() { }

  @Input() chatSoporteInformacion: any;
  @Input() avatarUrl: string;
  nombreYapellido: string = '';
  ngOnInit(): void {
    this.mensajes = [];
    this.agendaService.agendaAlumnoOperacionesService.datosAlumno$.subscribe({
      next: (resp) => {
        let alumno = resp.alumno;
        if (alumno == null)
          this.nombreYapellido = this.chatSoporteInformacion.nombres
        else
          this.nombreYapellido = `${alumno.nombre1} ${alumno.nombre2} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`
      }
    });
  }

  ngAfterViewInit() {
    this.messages.changes.subscribe(()=>this.scrollToBottom());
    setTimeout(()=>{this.mensajes = this.chatSoporteInformacion.historialMensajeRecibidosSoporte}, 0);
  }
  scrollToBottom(): void {
    if(this.myScrollableDiv){
      this.myScrollableDiv.nativeElement.scrollTop = this.myScrollableDiv.nativeElement.scrollHeight;
    }

  }
}
