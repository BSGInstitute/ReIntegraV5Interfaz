import { Component, Input, OnInit } from '@angular/core';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';

@Component({
  selector: 'app-solicitud-accesos-temporales',
  templateUrl: './solicitud-accesos-temporales.component.html',
  styleUrls: ['./solicitud-accesos-temporales.component.scss']
})
export class SolicitudAccesosTemporalesComponent implements OnInit {

  @Input() agendaService: AgendaOperacionesService
  constructor() { }

  ngOnInit(): void {
  }

}
