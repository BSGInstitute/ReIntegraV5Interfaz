import { Component, Input, OnInit ,ViewEncapsulation} from '@angular/core';
import { ITarifarioDetalleAgenda } from '@comercial/models/interfaces/iagenda-informacion-actividad-oportunidad';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { DecimalPipe } from '@angular/common';

/**
 * @module OperacionesModule
 * @name Tarifario
 * @author Miguel Quiñones, Flavio Mamani, Joseph Llanque, Juan Huanaco
 * @description Componente que lista tarifas de varios procesos administrativos.
 * @version 1.0.2
 * @history
 * * 29/04/2024: Actualización del componente para cumplir con el nuevo diseño solicitado para Agenda Atencion al Cliente.
 */

@Component({
  selector: 'app-tarifario',
  templateUrl: './tarifario.component.html',
  styleUrls: ['./tarifario.component.scss'],
})
export class TarifarioComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService
  constructor() { }
  listaTarifarios : Array<ITarifarioDetalleAgenda>;
  isLoading: boolean = false;
  decimalPipe: DecimalPipe;

  columnsToDisplay = ["nro-orden","concepto","descripcion"]
  columnMontos = ["monto-peru","monto-mexico","monto-colombia","monto-bolivia","monto-extranjero"]
  currentMontoIndex = 0;

  NextMonto(){
    if(this.currentMontoIndex + 1 >= this.columnMontos.length)
      this.currentMontoIndex = 0;
    else
      this.currentMontoIndex++;

    this.columnsToDisplay.pop();
    this.columnsToDisplay.push(this.columnMontos[this.currentMontoIndex]);
  }

  PrevMonto(){
    if(this.currentMontoIndex - 1 < 0)
      this.currentMontoIndex = this.columnMontos.length - 1;
    else
      this.currentMontoIndex--;

    this.columnsToDisplay.pop();
    this.columnsToDisplay.push(this.columnMontos[this.currentMontoIndex]);
  }

  MontoPorDefecto(){
    let codigoPais = this.agendaService.rowActual.idCodigoPais;
    switch (codigoPais){
      case 51:
        this.currentMontoIndex = 0
        this.columnsToDisplay.push(this.columnMontos[this.currentMontoIndex]);
        break;
      case 52:
        this.currentMontoIndex = 1
        this.columnsToDisplay.push(this.columnMontos[this.currentMontoIndex]);
        break;
      case 57:
        this.currentMontoIndex = 2
        this.columnsToDisplay.push(this.columnMontos[this.currentMontoIndex]);
        break;
      case 591:
        this.currentMontoIndex = 3
        this.columnsToDisplay.push(this.columnMontos[this.currentMontoIndex]);
        break;
      default:
        this.currentMontoIndex = 4
        this.columnsToDisplay.push(this.columnMontos[this.currentMontoIndex]);
        break;
    }
  }

  ajustarMonto(monto: string): string{
    if(monto.toLocaleLowerCase().includes('mxn'))
      return this.decimalPipe.transform(monto.toLocaleLowerCase().replace('mxn',''), '1.2-2') + ' MXN';
    if(monto.toLocaleLowerCase().includes('cop'))
      return this.decimalPipe.transform(monto.toLocaleLowerCase().replace('cop',''), '1.2-2') + ' COP';
    if(monto.toLocaleLowerCase().includes('bs'))
      return this.decimalPipe.transform(monto.toLocaleLowerCase().replace('bs',''), '1.2-2') + ' Bs';
    if(monto.toLocaleLowerCase().includes('s/'))
      return this.decimalPipe.transform(monto.toLocaleLowerCase().replace('s/',''), '1.2-2') + ' PEN';
    if(monto.toLocaleLowerCase().includes('$'))
      return this.decimalPipe.transform(monto.toLocaleLowerCase().replace('$',''), '1.2-2') + ' USD';
    return monto;
  }

  ngOnInit(): void {
    this.decimalPipe = new DecimalPipe('en-US');
    this.isLoading = true;
    this.MontoPorDefecto();
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.informacionProgramaV1$.subscribe(
      {
        next: (resp) => {
          if (resp != null) {
            this.isLoading = false;
            console.log("Tarifario",resp)
            resp.respuesta.listaTarifarios.forEach((x)=>{
              x.montoPeru = this.ajustarMonto(x.montoPeru);
              x.montoBolivia = this.ajustarMonto(x.montoBolivia);
              x.montoMexico = this.ajustarMonto(x.montoMexico);
              x.montoColombia = this.ajustarMonto(x.montoColombia);
              x.montoExtranjero = this.ajustarMonto(x.montoExtranjero);
            })
            this.listaTarifarios = resp.respuesta.listaTarifarios

          }
        },
      }
    );
  }




}
