import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { RowClassArgs } from '@progress/kendo-angular-grid';


@Component({
  selector: 'app-indicadores-productividad-ventas',
  templateUrl: './indicadores-productividad-ventas.component.html',
  styleUrls: ['./indicadores-productividad-ventas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IndicadoresProductividadVentasComponent implements OnInit {

  constructor(
    public finanzasService:FinanzasServiceService,
  ) {}
  pageSizes: any = [5, 10, 20, 'All'];
  @Input() listaReporte:any[]
  @Input() reporteOriginal:any[]

  ngOnInit(): void {
  }

  rowCallback = (context: RowClassArgs) => {
    if (
      context.dataItem.tipoMonto === 'Ventas($)' ||
      context.dataItem.tipoMonto === 'Gastos($)' ||
      context.dataItem.tipoMonto === 'GASTOS RELACIONADOS CON VENTAS (%)' ||
      context.dataItem.tipoMonto === 'COSTO POR ASESOR' 
      ) {
      return { rosa: true };
    } else {
      return { normal: true };
    }
  };

}
