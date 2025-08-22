import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { ExcelExportComponent } from '@progress/kendo-angular-excel-export/excel-export.component';
import { IntegraService } from '@shared/services/integra.service';
import {  process} from "@progress/kendo-data-query";
import Swal from 'sweetalert2';
import { constApiFinanzas } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-reporte-ingresos-congelados',
  templateUrl: './reporte-ingresos-congelados.component.html',
  styleUrls: ['./reporte-ingresos-congelados.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReporteIngresosCongeladosComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    public finanzasService:FinanzasServiceService,
  ) {}
  filtro =new FormControl(null);
  @Input() listaReporteCongelado:any[]=[]
  listaReporteCongeladoFiltrado:any[]=[]
  @Input() modalRef:any
  loader=false
  sumaFoter=0
  ngOnInit(): void {
    this.listaReporteCongeladoFiltrado = this.listaReporteCongelado.slice()
  }

  generarExcel(excel:ExcelExportComponent, dataReporte:any){
    const listaReporte =JSON.parse(dataReporte.detalleCongelado)
    if(listaReporte.length>0){
      this.sumaFoter =  listaReporte.map((x:any) => x.valor).reduce((a:any, b:any) => a + b) -  listaReporte[8].valor;
       
      let data= process(listaReporte, {
      }).data;
      excel.fileName="Reporte Ingreso Congelado "+dataReporte.nombreFiltro+".xlsx"
      excel.data=data
       excel.save()
    }
    else Swal.fire("Reporte sin datos!.","El reporte congelado no tiene datos.","warning")
   
   }

   eliminarCongelamiento(id:number){
    this.loader=true
    this.integraService.deleteJsonResponse(constApiFinanzas.EliminarReporteIngresoCongelamiento+"/"+id
    ).subscribe({
      next: (response: HttpResponse<any>) => {
        this.listaReporteCongelado = this.listaReporteCongelado.filter((e:any)=>e.id==id)
        Swal.fire("Registro Eliminado!.","El registro del reportes congelado se ha eliminado exitosamente.","success")
        this.loader=false
      },
      error: (error) => {
        this.loader=false
        this.finanzasService.MensajeDeError(error, 'Obtener reporte ingresos congelados');
      },
      complete: () => { },
    });
   }

   filtroChange(event:string){
    if(event.length>=1){
      this.listaReporteCongeladoFiltrado = this.listaReporteCongelado.filter((e:any)=>e.nombreFiltro.includes(event))
    }
    else this.listaReporteCongeladoFiltrado = this.listaReporteCongelado.slice()

   }

}
