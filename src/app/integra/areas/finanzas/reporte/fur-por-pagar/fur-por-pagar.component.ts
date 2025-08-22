import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { ExcelExportComponent, ExcelExportData } from '@progress/kendo-angular-excel-export';
import {
  aggregateBy,
  AggregateDescriptor,
  AggregateResult,
  process,
} from "@progress/kendo-data-query";

import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';
const currentDate = new Date();

@Component({
  selector: 'app-fur-por-pagar',
  templateUrl: './fur-por-pagar.component.html',
  styleUrls: ['./fur-por-pagar.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class FurPorPagarComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public finanzasService:FinanzasServiceService,
    private renderer: Renderer2, 
    private el: ElementRef
  ) {}


  pageSizes: any = [5, 10, 20, 'All'];
  loader=false
  listaReporte:any[]=[]
  interval:any
  groupo:any[]=[]
  formGroupFiltro = this.formBuilder.group({
    fechaInicio:[new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),Validators.required],
    fechaFin:[new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),Validators.required]
  });

  

  ngOnInit(): void {
    this.cambiarContenidoAgrupado()
    this.generarReporte()
  }

  cambiarContenidoAgrupado() {
    this.interval=setInterval(() => {
      const targetElement = this.el.nativeElement.querySelector('.k-indicator-container');    
      if (targetElement) {
        this.renderer.setProperty(targetElement, 'textContent', 'Arrastre un encabezado de columna y suéltelo aquí para agruparlo por esa columna');
        clearInterval(this.interval)
      }
    }, 200);
  }

  groupChange(event:any){
    this.groupo=event
    if(event.length==0){
      const targetElement = this.el.nativeElement.querySelector('.k-indicator-container');    
      this.cambiarContenidoAgrupado()
    }
  }
  generarReporte(){
    if(this.formGroupFiltro.valid){
      let dataForm = this.formGroupFiltro.getRawValue()
      let envio={
        fechaInicio:dataForm.fechaInicio!=null?datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-ddT00:00:00.000', 'en-US'):null,
        fechaFin:dataForm.fechaFin!=null?datePipeTransform(dataForm.fechaFin, 'yyyy-MM-ddT23:59:00.000', 'en-US'):null
      }
      this.loader=true
      this.integraService.postJsonResponse(constApiFinanzas.ObtenerFurPorPagarByFecha,envio
        ).subscribe({
          next: (response: HttpResponse<any>) => {
            response.body.forEach((e:any) => {
                e.fechaProgramada = e.fechaProgramada!=null?new Date(e.fechaProgramada):null
            });
            this.listaReporte = response.body
            this.loader=false
          },
          error: (error) => {
            this.loader=false
            this.finanzasService.MensajeDeError(error, 'Obtener reporte Fur por pagar');
          },
          complete: () => { },
        });
    }
    else this.formGroupFiltro.markAllAsTouched()
  }

 generarExcel(excel:ExcelExportComponent){
  let data= process(this.listaReporte, {
    group: this.groupo,
  }).data;

  excel.data=data
  excel.group = this.groupo
  excel.save()
 }
}
