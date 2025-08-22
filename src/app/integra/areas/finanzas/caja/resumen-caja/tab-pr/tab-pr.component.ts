import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { PorRendirResumenCaja } from '@integra/models/caja-por-rendir';
import { ResumenCaja } from '@integra/models/resumen-caja';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import Swal from 'sweetalert2';

const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
@Component({
  selector: 'app-tab-pr',
  templateUrl: './tab-pr.component.html',
  styleUrls: ['./tab-pr.component.scss']
})
export class TabPrComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
  ) {}
  
  //--- Variables :
  @Input() datosCaja:ResumenCaja;
  tipoMoneda:string="";
  loader:boolean=false
  total:number=0
  fechaInicio= new FormControl();
  fechaFin= new FormControl();
  listaSeleccion:any[]=[]
  listaPR:PorRendirResumenCaja[]=[]
  pageSizes: any = [5, 10, 20, 'All'];
  ngOnInit(): void {
  }

  //Funciones----------------------------
  GenerarReporteREC(){//Genera el Reporte de NIC
    if(this.fechaInicio.valid && this.fechaFin.valid &&
      this.fechaInicio.value!=null && this.fechaFin.value!=null 
      )
    {
      if(this.datosCaja && this.datosCaja.idCaja!=null)
      {
        
        this.loader=true
        this.listaSeleccion=[]
        this.total=0
        this.tipoMoneda=this.datosCaja.moneda
        let fechaInicio =  pipe.transform(this.fechaInicio.value,formatoFecha)
        let fechaFin = pipe.transform(this.fechaFin.value,formatoFecha)
        let params: Parametro[] = [
          { clave: 'FechaInicial', valor:fechaInicio},
          { clave: 'FechaFinal', valor:fechaFin},
          { clave: 'IdCaja ', valor:this.datosCaja.idCaja}
        ];
        this.integraService
        .obtenerPorPathParams(constApiFinanzas.ResumenCajaGenerarReportePR,params)
        .subscribe({
          next: (response: HttpResponse<PorRendirResumenCaja[]>) => {
            this.listaPR=response.body
          },
          error: (error) => {
            this.loader=false
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loader=false
          },
        });
        
      }else{
        Swal.fire(
          "¡Alerta!",
          "Seleccione una Caja, es necesario!",
          "warning"
        )
      }
    }
    else{
      Swal.fire(
        "¡Alerta!",
        "Seleccione una Fecha de Inicio y una Fecha Fin,<br> es necesario!",
        "warning"
      )
    }
  }
  mostrarMensajeError(error: any): void {//Muestra mensajes de error en el interfaz
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }


  limpiarSeleccion(){// Limpia la selección
    this.listaSeleccion=[]
    this.CalcularTotal()
   }

  CalcularTotal(){//Calcula el total efectivo de los seleccionados
    this.total=0
    let seleccion = this.listaSeleccion
    seleccion.forEach((e:any) => {
      this.total += this.listaPR.find(cp=>cp.idPorRendirCabecera===e).montoTotal
    });
  }

  GenerarPDf()//Genera Un Zip Conteniendo los PDF
   {
     if(this.listaSeleccion.length>0)
     {
       this.loader=true
       this.integraService.
       obtenerPorFiltro(constApiFinanzas.ResumenCajaGenerarPdfPR,this.listaSeleccion)
       .subscribe({
         next: (response: HttpResponse<any>) => {
           let listaBytesPdf=response.body
           var zip = new JSZip();
           let i:number=0
           let nombrePdf:string[]=[]
           this.listaSeleccion.forEach(e=>{
             let nic = this.listaPR.find(ln=>ln.idPorRendirCabecera===e).codigoPorRendir;
             nombrePdf.push(nic)
           })
           listaBytesPdf.forEach((bytesPdf:any)=>{
 
             var base64str = bytesPdf;
             var binary = atob(base64str.replace(/\s/g, ''));
             var nombre = nombrePdf[i] + ".pdf";
             zip.folder(this.datosCaja.codigoCaja+"-PRs").file(nombre, binary, { binary: true });
             i++
         });
         if (listaBytesPdf.length > 0) {
           zip.generateAsync({ type: "blob" })
           .then(function (content) {
             FileSaver.saveAs(content, "ResumenCaja-PRs");
           });
         }
         },
         error: (error) => {
           this.loader=false
           this.mostrarMensajeError(error);
         },
         complete: () => {
           this.loader=false
         },
       });
     }
     else{
       Swal.fire(
         '¡Alerta!',
         'Selecciona almenos un registro NIC, es necesario!',
         'warning'
       )
     }
   }
}
