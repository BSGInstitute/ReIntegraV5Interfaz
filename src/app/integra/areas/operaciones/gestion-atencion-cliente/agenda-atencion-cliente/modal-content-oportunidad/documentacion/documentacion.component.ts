import { Component, Input, OnInit } from '@angular/core';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';

/**
 * @module OperacionesModule
 * @name Documentacion
 * @creation 29/04/2024
 * @author Juan Diego Huanaco Quispe
 * @description Componente contenedor de `Documentos Programa` y `Documentos Legales`
 * @version 1.0.0
 * @history
 * 29/04/2024: Creacion del componente para cumplir con el nuevo diseño solicitado para Agenda Atencion al Cliente.
 */
@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html',
  styleUrls: ['./documentacion.component.scss']
})
export class DocumentacionComponent implements OnInit {

  @Input() agendaService: AgendaOperacionesService;
  constructor() { }

  ngOnInit(): void {
  }

}
