import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { NotaIngresoCaja } from '@integra/models/nota-ingreso-caja';
import { ResumenCaja } from '@integra/models/resumen-caja';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';



const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
@Component({
  selector: 'app-tab-nic',
  templateUrl: './tab-nic.component.html',
  styleUrls: ['./tab-nic.component.scss']
})
export class TabNicComponent implements OnInit {

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
  listaNIC:NotaIngresoCaja[]=[]
  pageSizes: any = [5, 10, 20, 'All'];


  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;

  ngOnInit(): void {
  }

  GenerarReporteNIC(){//Genera el Reporte de NIC
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
        .obtenerPorPathParams(constApiFinanzas.ResumenCajaGenerarReporteNic,params)
        .subscribe({
          next: (response: HttpResponse<NotaIngresoCaja[]>) => {
            this.listaNIC=response.body
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

  CalcularTotal(){//Calcula el total efectivo de los seleccionados
    this.total=0
    let seleccion = this.listaSeleccion
    seleccion.forEach((e:any) => {
      this.total += this.listaNIC.find(cp=>cp.id===e).monto
    });
  }
  
  limpiarSeleccion(){// Limpia la selección
   this.listaSeleccion=[]
   this.CalcularTotal()
  }

  GenerarPDf()
  {
    if(this.listaSeleccion.length>0)
    {
      this.loader=true
      this.integraService.
      obtenerPorFiltro(constApiFinanzas.ResumenCajaGenerarPdfNic,this.listaSeleccion)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          let listaBytesPdf=response.body
          var zip = new JSZip();
          let i:number=0
          let nombrePdf:string[]=[]
          this.listaSeleccion.forEach(e=>{
            let nic = this.listaNIC.find(ln=>ln.id===e).codigoNic;
            nombrePdf.push(nic)
          })
          listaBytesPdf.forEach((bytesPdf:any)=>{

            var base64str = bytesPdf;
            var binary = atob(base64str.replace(/\s/g, ''));
            var nombre = nombrePdf[i] + ".pdf";
            zip.folder(this.datosCaja.codigoCaja+"-NICs").file(nombre, binary, { binary: true });
            i++
        });
        if (listaBytesPdf.length > 0) {
          zip.generateAsync({ type: "blob" })
          .then(function (content) {
            FileSaver.saveAs(content, "ResumenCaja-NICs");
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