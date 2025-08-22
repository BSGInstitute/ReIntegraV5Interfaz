import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { GridComponent } from '@progress/kendo-angular-grid';
import { IntegraService } from '@shared/services/integra.service';
import { Workbook } from 'exceljs';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-retiros-matricula',
  templateUrl: './retiros-matricula.component.html',
  styleUrls: ['./retiros-matricula.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class RetirosMatriculaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public finanzasService:FinanzasServiceService,
  ) {}
  @ViewChild('grid', { static: false }) grid!: GridComponent;

  loader=false
  listaReporte:any[]=[]
  reporteGeneral:any
  pageSizes: any = [5, 10, 20, 'All'];


  ngOnInit(): void {
  }

  ActividadLoading(valor:boolean){
    this.loader=valor
  }

  GenerarGrillaReporte(reporte:any){
    
    if(typeof reporte =="object" && reporte.reporteDevoluciones.length>0){
      this.reporteGeneral=reporte

      this.reporteGeneral.reporteDevolucionAgrupado.sort((a:any, b:any) => {
        const fechaA = this.convertirFecha(a.g);
        const fechaB = this.convertirFecha(b.g);
        return fechaA.getTime() - fechaB.getTime();
      });
      
      
      this.listaReporte=reporte.reporteDevoluciones
      if(this.reporteGeneral.cronograma==true){
        this.listaReporte = this.listaReporte.map((reporte: any) => {
          const nuevoReporte: any = { ...reporte }; 
          this.reporteGeneral.reporteDevolucionAgrupado.forEach((item: any) => {
            nuevoReporte[item.g.trim()] = this.obtenerMontoDevuelto(nuevoReporte.codigoMatricula, item.g);
          });
          return nuevoReporte;
        });

        this.listaReporte = this.eliminarDuplicadosConSet(this.listaReporte,"codigoMatricula")
      }
      this.listaReporte.forEach((e)=>{
        e.fecha = e.fecha!=null?new Date(e.fecha):null
      })
      
      console.log("DataGrilla",this.listaReporte)
    }
    else Swal.fire(
      "No se encontraron datos.","No se encontraron datos con los filtros ultizados, intenta nuevamente con otros filtros.","info"
    )
  }
  convertirFecha(cadenaFecha:string) {
    const meses: { [key: string]: number } = {
      'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3,
      'Mayo': 4, 'Junio': 5, 'Julio': 6, 'Agosto': 7, 'Septiembre': 8,
      'Setiembre': 8,
      'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11
    };
  
    const partes = cadenaFecha.split(' ');
    const mes = meses[partes[0]];
    const año = Number(partes[1]);
    const fecha = new Date(año, mes, 1);
    return fecha;
  }

  obtenerMontoDevuelto(codMat: string, nombreFecha: string): number {
    const objetoContenedor = this.reporteGeneral.reporteDevolucionAgrupado.find((e: any) => e.g === nombreFecha);
    if (!objetoContenedor)return 0;
    const itemEncontrado = objetoContenedor.l.find((e: any) => e.codigoMatricula === codMat);
    if (!itemEncontrado) return 0;
    const montoDevuelto = itemEncontrado.montoDevolucion!=null?itemEncontrado.montoDevolucion:0;
    return montoDevuelto * -1;
  }

  obtenerTotalDevolucion(data:any[]){
    let suma=0
    data.forEach((e:any)=>{
      suma = e.montoDevolucion + suma
    })
    suma= Math.round(suma*100)/100
    return suma*-1
  }

  eliminarDuplicadosConSet(lista: any[], clave: string): any[] {
    const valoresUnicos = new Set();
    const listaUnica :any[]= [];
  
    lista.forEach(item => {
      const valorClave = item[clave];
      if (!valoresUnicos.has(valorClave)) {
        valoresUnicos.add(valorClave);
        listaUnica.push(item);
      }
    });
  
    return listaUnica;
  }
  

  
  
  
  
  

}
