import { Component, Input, OnInit } from '@angular/core';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';

/**
 * @module OperacionesModule
 * @name GestionPagos
 * @creation 29/04/2024
 * @author Juan Diego Huanaco Quispe
 * @description Componente contenedor de `Cronograma de Pagos`, `Beneficios e Inversion`, `Formas de Pago` y `Tarifarios`
 * @version 1.0.0
 * @history
 * 29/04/2024: Creacion del componente para cumplir con el nuevo diseño solicitado para Agenda Atencion al Cliente.
 */
@Component({
  selector: 'app-gestion-pagos',
  templateUrl: './gestion-pagos.component.html',
  styleUrls: ['./gestion-pagos.component.scss']
})
export class GestionPagosComponent implements OnInit {

  @Input() agendaService: AgendaOperacionesService;
  constructor() { }

  ngOnInit(): void {
  }

}
