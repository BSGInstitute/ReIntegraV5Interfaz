import { Component, Input, OnInit } from '@angular/core';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';

/**
 * @module OperacionesModule
 * @name FormasPago
 * @author Miguel Quiñones, Flavio Mamani, Joseph Llanque, Juan Huanaco
 * @description Componente que lista las formas de pago que disponen los alumnos.
 * @version 1.0.2
 * @history
 * * 29/04/2024: Actualización del componente para cumplir con el nuevo diseño solicitado para Agenda Atencion al Cliente.
 */
@Component({
  selector: 'app-formas-pago',
  templateUrl: './formas-pago.component.html',
  styleUrls: ['./formas-pago.component.scss'],
})
export class FormasPagoComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;
  constructor() { }

  ngOnInit(): void {
    this.PaisPorDefecto();
  }

  
  cards = ['Perú', 'México','Bolivia','Colombia','Internacional']
  currentIndex = 0;

  NextCard(){
    if(this.currentIndex + 1 >= this.cards.length)
      this.currentIndex = 0;
    else
      this.currentIndex++;
  }

  PrevCard(){
    if(this.currentIndex - 1 < 0)
      this.currentIndex = this.cards.length - 1;
    else
      this.currentIndex--;
  }

  PaisPorDefecto(){
    let codigoPais = this.agendaService.rowActual.idCodigoPais;
    switch (codigoPais){
      case 51:
        this.currentIndex = 0
        break;
      case 52:
        this.currentIndex = 1
        break;
      case 591:
        this.currentIndex = 2
        break;
      case 57:
        this.currentIndex = 3
        break;
      default:
        this.currentIndex = 4
        break;
    }
  }

}
