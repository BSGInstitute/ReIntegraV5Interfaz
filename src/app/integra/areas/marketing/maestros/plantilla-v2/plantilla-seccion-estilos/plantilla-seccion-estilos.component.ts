import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-plantilla-seccion-estilos',
  templateUrl: './plantilla-seccion-estilos.component.html',
  styleUrls: ['./plantilla-seccion-estilos.component.scss']
})
export class PlantillaSeccionEstilosComponent implements OnInit, OnChanges {

  @Input() id = 0
  @Input() idEstilos = 0
  @Input() nombreEstilo = ''
  @Input() tipo = ''
  @Input() fuente : any 
  @Input() listaEstilo : any[] = [];
  @Output() close=new EventEmitter<Array<void>>(); 
  @Output() onChange = new EventEmitter<string>();
  @Input() valor: any=''

  tipoWeight: any[] = [
    {id: 1, nombre: 'normal'},
    {id: 2, nombre: 'bold'},
    {id: 3, nombre: 'lighter'},
    {id: 1, nombre: 'bolder'},
    {id: 2, nombre: '100'},
    {id: 3, nombre: '200'},
    {id: 1, nombre: '300'},
    {id: 2, nombre: '400'},
    {id: 3, nombre: '500'},
    {id: 1, nombre: '600'},
    {id: 2, nombre: '700'},
    {id: 3, nombre: '800'},
    {id: 3, nombre: '900'},
    {id: 3, nombre: 'inherit'},
    {id: 1, nombre: 'initial'},
    {id: 2, nombre: 'revert'},
    {id: 3, nombre: 'revert-layer'},
    {id: 3, nombre: 'unset'},
];
  

  public autoCorrect = true;
  public min = 1;
  public max = 48;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {

  console.log(this.valor)
    if(this.tipo == 'magnitud'){
      this.valor = this.valor.split('px')[0]
    }
  }

  ngOnInit(): void {
  
  }

}
