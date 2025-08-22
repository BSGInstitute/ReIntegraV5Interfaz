import { Component, Input, OnInit } from '@angular/core';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-grid-auxiliar',
  templateUrl: './grid-auxiliar.component.html',
  styleUrls: ['./grid-auxiliar.component.scss']
})
export class GridAuxiliarComponent implements OnInit {

  constructor() { }

  @Input() listaReporte:any[]=[]
  @Input() detalle:any[]=[]
  @Input() tipo:string=""

  public sort: SortDescriptor[] = [
    {
      field: "agrupacionMat",
      dir: "asc",
    },
  ];

  group=[{ field: "Asistente de cobranza" },{ field: "estadoMatricula" }]

  ngOnInit(): void {
  }

}
