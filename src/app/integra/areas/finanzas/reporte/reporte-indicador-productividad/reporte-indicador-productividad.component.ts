import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-reporte-indicador-productividad',
  templateUrl: './reporte-indicador-productividad.component.html',
  styleUrls: ['./reporte-indicador-productividad.component.scss']
})
export class ReporteIndicadorProductividadComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public finanzasService:FinanzasServiceService
  ) {}

  loader=false
  fun1=false;fun2=false

  listaTab1:any[] = []
  listaTab2:any[] = []
  listaTab3:any[] = []

  formGroupFiltro = this.formBuilder.group({
    fechaInicio:[null,Validators.required],
    fechaFin:[null,Validators.required]
  });

  respuestaGeneral:any={
    horasTrabajadas:[],
    indicadores:[],
  }

  reporteGenaral:any


  ngOnInit(): void {

  }

  generarInformacion(){
    if(this.formGroupFiltro.valid){
      let dataForm = this.formGroupFiltro.getRawValue()
      this.loader=true
      dataForm.fechaInicio = datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-ddT00:00:00.000', 'en-US');
      dataForm.fechaFin = datePipeTransform(dataForm.fechaFin, 'yyyy-MM-ddT23:59:59.000', 'en-US');
      this.ObtenerReporteProductividadVentasHorasTrabajadas(dataForm)
      this.ObtenerReporteProductividadVentasIndicadores(dataForm)
      
    }
    else this.formGroupFiltro.markAllAsTouched()
    
  }

  ObtenerReporteProductividadVentasHorasTrabajadas(filtro:any){
    this.fun1=false
    this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteProductividadVentasHorasTrabajadas,filtro).subscribe({
      next: (response: HttpResponse<any>) => {
          this.fun1=true
          this.respuestaGeneral.horasTrabajadas= response.body  
          this.ValidarObtencionDeDatos()
      },
      error: (error) => {
          this.loader=false
          this.finanzasService.MensajeDeError(error,'Obtener Reporte Productividad Ventas Horas Trabajadas');
      },
      complete: () => {},
    });
  }

  ObtenerReporteProductividadVentasIndicadores(filtro:any){
    this.fun2=false
    this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteProductividadVentasIndicadores,filtro).subscribe({
      next: (response: HttpResponse<any>) => {
          this.fun2=true
          this.respuestaGeneral.indicadores= response.body  
          this.ValidarObtencionDeDatos()
      },
      error: (error) => {
          this.loader=false
          this.finanzasService.MensajeDeError(error,'Obtener Reporte Productividad Ventas Indicadores');
      },
      complete: () => {},
    });
  }

  ValidarObtencionDeDatos(){
    if(this.loader==true){
      if(this.fun1==true && this.fun2==true){
        this.ObtenerInformacionProcesada()
      }else  this.loader=true
    }
  }

  ObtenerInformacionProcesada(){
    this.loader=true
    this.integraService.postJsonResponse(constApiFinanzas.ReporteIndicadoresProductividad,this.respuestaGeneral).subscribe({
      next: (response: HttpResponse<any>) => {
           console.log("ORIGINAL",response.body)
          this.reporteGenaral=response.body
          this.loader=false
          this.prepararTabReporteProductividadHorasTrabajadas()
          this.prepararTabReporteIndicadpresProductividadVentas()
          this.prepararTabReporteRendimientoEquipo()
      },
      error: (error) => {
          this.loader=false
          this.finanzasService.MensajeDeError(error,'Obtener Reporte Productividad Ventas Indicadores');
      },
      complete: () => {},
    });
  }

  prepararTabReporteProductividadHorasTrabajadas(){
    if(this.reporteGenaral.reporteProductividadHorasTrabajadas.length>0){
      this.reporteGenaral.reporteProductividadHorasTrabajadas.forEach((data:any) => {
        data.detalleFecha.forEach((detalle:any)=>{
          let index = this.listaTab1.findIndex((e:any)=>e.idPersonal===detalle.idPersonal)
          if(index==-1){ this.listaTab1.push(detalle)}
        })
      });
      this.listaTab1 = this.listaTab1.map((reporte: any) => {
        const nuevoReporte: any = { ...reporte }; 
        this.reporteGenaral.reporteProductividadHorasTrabajadas.forEach((item: any) => {
          nuevoReporte[item.periodo.trim()]= this.obtenerDiasTrabajadasTab1(nuevoReporte.idPersonal, item.detalleFecha);
        });
        return nuevoReporte;
      });
    }
    
  }
  prepararTabReporteIndicadpresProductividadVentas(){
    if(this.reporteGenaral.reporteIndicadoresProductividad.length>0){
      this.reporteGenaral.reporteIndicadoresProductividad.sort((a:any, b:any) => {
        const fechaA = this.parsePeriodo(a.g);
        const fechaB = this.parsePeriodo(b.g);
        return fechaA.getTime() - fechaB.getTime();
      });
      this.listaTab3 = this.reporteGenaral.reporteIndicadoresProductividad[0].l
      this.listaTab3 = this.listaTab3.map((reporte: any) => {
        const nuevoReporte: any = { ...reporte }; 
        this.reporteGenaral.reporteIndicadoresProductividad.forEach((item: any) => {
          nuevoReporte[item.g.trim()]= this.obtenerMontosTab3(reporte.tipoMonto,item.g.trim(), item.l);
        });
        return nuevoReporte;
      });
    }
  }

  prepararTabReporteRendimientoEquipo(){
    if(this.reporteGenaral.reporteHorasTrabajadasProductividadEquipo.length>0){
      this.reporteGenaral.reporteHorasTrabajadasProductividadEquipo.sort((a:any, b:any) => {
        const fechaA = this.parsePeriodo(a.periodo);
        const fechaB = this.parsePeriodo(b.periodo);
        return fechaA.getTime() - fechaB.getTime();
      });
      console.log(this.reporteGenaral.reporteHorasTrabajadasProductividadEquipo)
      this.reporteGenaral.reporteHorasTrabajadasProductividadEquipo.forEach((e:any)=>{
        this.listaTab2 = this.listaTab2.concat(e.detalleFecha)
      })
      console.log(this.listaTab2)
      this.listaTab2 = this.eliminarDuplicados(this.listaTab2)
      console.log("LIMPIO :",this.listaTab2)
     
      this.listaTab2 = this.listaTab2.map((reporte: any) => {
        const nuevoReporte: any = { ...reporte }; 
        this.reporteGenaral.reporteHorasTrabajadasProductividadEquipo.forEach((item: any) => {
          nuevoReporte[item.periodo.trim()+'TV']= this.obtenerMontosTab2(reporte.idPersonal, item.detalleFecha,'TV');
          nuevoReporte[item.periodo.trim()+'HT']= this.obtenerMontosTab2(reporte.idPersonal, item.detalleFecha,'HT');
          nuevoReporte[item.periodo.trim()+'P']= this.obtenerMontosTab2(reporte.idPersonal, item.detalleFecha,'P');
          nuevoReporte['Nombre de Jefe']= nuevoReporte.nombreJefe==null?' - ':nuevoReporte.nombreJefe;
          nuevoReporte.nombrePersonal = nuevoReporte.nombrePersonal.replace(/\s+/g, ' ')
        });
        return nuevoReporte;
      });

      console.log("FINAL :",this.listaTab2)
    }
  }
  obtenerMontosTab2(idPersonal:number,detalle:any,tipo:string){
    let resultado:any
    let dataDetalle = detalle.find((e:any)=>e.idPersonal === idPersonal )
    if(dataDetalle!=null) {
      switch(tipo){
        case 'TV':
          resultado = dataDetalle.totalVendido
          break
        case 'HT':
          resultado = dataDetalle.diasTrabajados
          break
        case 'P':
          if(dataDetalle.diasTrabajados>0){
            resultado = Math.round((dataDetalle.totalVendido/dataDetalle.diasTrabajados)*100)/100
          }
          else resultado = 0
          break
        default:
          resultado = 0
      }
    }
    else resultado = 0
    return resultado==null?0:resultado
  }

 

  eliminarDuplicados(arr: any){
    const uniqueMap: { [key: string]:any } = {};
  
    for (const personal of arr) {
      const key = `${personal.idPersonal}-${personal.nombrePersonal}`;
      if (!uniqueMap[key]) {
        uniqueMap[key] = personal;
      }
    }
  
    return Object.values(uniqueMap);
  }

  parsePeriodo(periodo: string): Date {
    const monthNames: { [key: string]: number } = {
      Enero: 0, Febrero: 1, Marzo: 2, Abril: 3, Mayo: 4, Junio: 5,
      Julio: 6, Agosto: 7, Setiembre: 8, Septiembre: 8, Octubre: 9, Noviembre: 10, Diciembre: 11,
    };
  
    const parts = periodo.split(/(\d+)/);
    const month = monthNames[parts[0]];
    const year = parseInt(parts[1], 10);
  
    return new Date(year, month);
  }

  obtenerMontosTab3(tipoMonto:string,periodo:string,detalle:any){
    let dataDetalle = detalle.find((e:any)=>e.periodo === periodo && e.tipoMonto=== tipoMonto)
    if(dataDetalle!=null) return this.redondearValor(dataDetalle.monto)
    else return 0
  }

  redondearValor(valor:any){
    try{
      if(valor!=undefined && valor!=null && valor.trim()!=''){
        if(valor.includes('%')) return valor
        else {
          let monto  = parseFloat(valor)
          return Math.round(monto)
        }
      }
      else return valor
      
    }
    catch{
      return valor
    }
   
  }
 
  
  obtenerDiasTrabajadasTab1(idPersonal:number,detalle:any){
    let dataDetalle = detalle.find((e:any)=>e.idPersonal === idPersonal )
    if(dataDetalle!=null) return dataDetalle.diasTrabajados
    else return 0
  }
}
