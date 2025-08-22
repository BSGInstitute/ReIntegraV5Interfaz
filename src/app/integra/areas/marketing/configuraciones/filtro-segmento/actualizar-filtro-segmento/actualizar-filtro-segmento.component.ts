import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-actualizar-filtro-segmento',
  templateUrl: './actualizar-filtro-segmento.component.html',
  styleUrls: ['./actualizar-filtro-segmento.component.scss']
})
export class ActualizarFiltroSegmentoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  Nombre:any
  Descripcion:any
  Area:any
  Subareas:any
  ProgramaGeneral:any
  ProgramaEspecificos:any
  FiltroExcluido:any
}
