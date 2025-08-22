import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';

@Component({
  selector: 'app-rendimiento-por-equipo',
  templateUrl: './rendimiento-por-equipo.component.html',
  styleUrls: ['./rendimiento-por-equipo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RendimientoPorEquipoComponent implements OnInit {

  constructor(
    public finanzasService:FinanzasServiceService,
  ) {}
  pageSizes: any = [5, 10, 20, 'All'];
  @Input() listaReporte:any[]
  @Input() reporteOriginal:any[]

  group=[{ field: "Nombre de Jefe" }]

  ngOnInit(): void {
  }

  obtenerSumaFooter(group:any,tipo:string){
    let dataGroup = group.items
    let suma=0
    dataGroup.forEach((e:any) => {
      suma = suma + parseFloat(e[tipo]!=null?e[tipo]:0)
    });
    return Math.round(suma*100)/100
  }


}
