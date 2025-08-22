import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApi, constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { faTruckMedical } from '@fortawesome/free-solid-svg-icons';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte-pendiente-mes-coordinadora',
  templateUrl: './reporte-pendiente-mes-coordinadora.component.html',
  styleUrls: ['./reporte-pendiente-mes-coordinadora.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportePendienteMesCoordinadoraComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public finanzasService:FinanzasServiceService
  ) {}

  f1=false ; f2=false
  loader=false
  listaPeriodo:any[]=[]
  itemPeriodo:any[]=[]

  formGroupFiltro = this.formBuilder.group({
    fechaCorte1:[null,Validators.required],/*mayor */
    fechaCorte2:[null,Validators.required],/*menor */
    fechaPagoInicial:[null,Validators.required],
    fechaPagoFinal:[null,Validators.required],
    periodoInicial:[null,Validators.required],
    periodoFin:[null,Validators.required],
  });
  group=[{ field: "Coordinador" }]
  reporteGeneral:any={
    periodo:[],
    cierre:[],
    fechaCierreActual:null,
    fechaCierrePrevio:null,
  }

  reporteFinal:any

  listaReporteMes:any[] =[]
  listaReporteCoordinadora:any[] =[]

  ngOnInit(): void {
    this.listaReporteMes=[]
    this.listaReporteCoordinadora =[]
    this.ObtenerComboPeriodo()
  }
  prueba:string=""

  rowCallback = (context: RowClassArgs) => {
    if (
      context.dataItem.id === 16 ||
      context.dataItem.id === 17  || 
      context.dataItem.id === 18 ||
      context.dataItem.id=== 19|| 
      context.dataItem.id=== 20  ||
      context.dataItem.id=== 21  ||
      context.dataItem.id=== 22 ||
      context.dataItem.id=== 23
      ) {
      return { rosa: true };
    } else {
      return { normal: true };
    }
  };

  rowCallbackCoor = (context: RowClassArgs) => {
    if (
      context.dataItem.id === 17  || 
      context.dataItem.id === 18 ||
      context.dataItem.id=== 19|| 
      context.dataItem.id=== 20  ||
      context.dataItem.id=== 21  ||
      context.dataItem.id=== 22 ||
      context.dataItem.id=== 23 ||
      context.dataItem.id=== 24
      ) {
      return { rosa: true };
    } else {
      return { normal: true };
    }
  };

  //------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------
  ObtenerComboPeriodo(){// Obtiene datos para el combo Periodo
    this.integraService
      .getJsonResponse(
        `${constApi.PeriodoObtenerCombo}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaPeriodo=response.body
          this.itemPeriodo=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"COMBO - PERIODO")
        },
        complete: () => {},
      });
  }

  // Funciones para el control de Interfaz ------------------------------------------------------------------

  filtroPeriodo(event:any){//Filtra periodos en el combobox
    if(typeof event=="string"){
      this.itemPeriodo = this.listaPeriodo.filter(
        (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    }
    else{
      this.itemPeriodo = this.listaPeriodo
    }
  }

  
  validarFecha(tipo:string){
    const f1 = this.formGroupFiltro.get('fechaCorte1').value
    const f2 = this.formGroupFiltro.get('fechaCorte2').value
    if(f1!=null && f2!=null){
      if(tipo=='c1'){
        if(f1<f2){
          this.formGroupFiltro.get('fechaCorte1').setValue(null)
          Swal.fire("Fecha de Cierre Incorrecta.","EL valor de la fecha de cierre 1 debe ser posterior a la fecha de corte 2.","warning")
        }
      }
      else if(tipo=='c2'){
        if(f2>f1){
          this.formGroupFiltro.get('fechaCorte2').setValue(null)
          Swal.fire("Fecha de Cierre Incorrecta.","EL valor de la fecha de cierre 2 debe ser anterior a la fecha de corte 1.","warning")
        }
      }
    }
    
  }

  generarReporte(){
    if(this.formGroupFiltro.valid){
      let dataForm = this.formGroupFiltro.getRawValue()

      this.reporteGeneral.fechaCierreActual = dataForm.fechaCorte1.getDate().toString() + '/'+ (dataForm.fechaCorte1.getMonth() + 1).toString()
      this.reporteGeneral.fechaCierrePrevio =  dataForm.fechaCorte2.getDate().toString() + '/'+ (dataForm.fechaCorte2.getMonth() + 1).toString()

      dataForm.fechaCorte1 = datePipeTransform(dataForm.fechaCorte1, 'yyyy-MM-ddT00:00:00.000', 'en-US');
      dataForm.fechaCorte2 = datePipeTransform(dataForm.fechaCorte2, 'yyyy-MM-ddT00:00:00.000', 'en-US');
      dataForm.fechaPagoInicial = datePipeTransform(dataForm.fechaPagoInicial, 'yyyy-MM-ddT00:00:00.000', 'en-US');
      dataForm.fechaPagoFinal = datePipeTransform(dataForm.fechaPagoFinal, 'yyyy-MM-ddT23:59:59.000', 'en-US');
      this.loader=true
      
      this.ObtenerReportePendientePeriodoyCoordinadorPorMesCoordinador(dataForm)
      this.ObtenerReportePendienteCierrePorMesCoordinador(dataForm)

    }
    else this.formGroupFiltro.markAllAsTouched()
  }

  ObtenerReportePendientePeriodoyCoordinadorPorMesCoordinador(envio:any){
    this.f1=false
    this.integraService.postJsonResponse(constApiFinanzas.ObtenerReportePendientePeriodoyCoordinadorPorMesCoordinador,envio).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.f1=true
        this.reporteGeneral.periodo = response.body
        this.ValidarProcesoDeDatos()
      },
      error: (error) => {
        this.loader=false
        this.f1=true
        this.finanzasService.MensajeDeError(error,'Obtener Reporte Pendiente Periodo y Coordinador Por Mes Coordinador');
      },
      complete: () => {},
    });
   }

   ObtenerReportePendienteCierrePorMesCoordinador(envio:any){
    this.f2=false
    this.integraService.postJsonResponse(constApiFinanzas.ObtenerReportePendienteCierrePorMesCoordinador,envio).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.f2=true
        this.reporteGeneral.cierre = response.body
        this.ValidarProcesoDeDatos()
      },
      error: (error) => {
        this.loader=false
        this.f2=true
        this.finanzasService.MensajeDeError(error,'Obtener Reporte Pendiente Cierre Por Mes Coordinador');
      },
      complete: () => {},
    });
   }

  ProcesarReporteMesCoordinadora(envio:any){
    this.loader=true
    this.integraService.postJsonResponse(constApiFinanzas.ProcesarReporteMesCoordinadora,envio).subscribe({
      next: (response: HttpResponse<any[]>) => {
       
        console.log("Resultado FINAL",response.body)
        this.reporteFinal = response.body
        this.armarGrillaReportesMes(response.body)
        this.armarGrillaReportesMesCoordinador(response.body)
        this.loader=false
      },
      error: (error) => {
        this.loader=false
        this.finanzasService.MensajeDeError(error,'Procesar ReporteMes Coordinadora');
      },
      complete: () => {},
    });
  }

  armarGrillaReportesMes(reporte:any){
    if(reporte.reportePendientePorPeriodo.length>0){
      reporte.reportePendientePorPeriodo.sort((a:any, b:any) => {
        const fechaA = this.finanzasService.convertirFecha(a.g);
        const fechaB = this.finanzasService.convertirFecha(b.g);
        return fechaA.getTime() - fechaB.getTime();
      });

      const tiposMontoSet = new Set<string>();

      reporte.reportePendientePorPeriodo.forEach((data: any) => {
        data.l.forEach((i: any) => {
          tiposMontoSet.add(i.tipoMonto);
        });
      });

      const tiposMontoArray = Array.from(tiposMontoSet);

      this.listaReporteMes = tiposMontoArray.map((tipoMonto: string) => ({
        tipoMonto: tipoMonto
      }));
      let i=0
      this.listaReporteMes = this.listaReporteMes.map((informacion: any) => {
        const nuevoReporte: any = { ...informacion }; 
        reporte.reportePendientePorPeriodo.forEach((data: any) => {
          nuevoReporte[data.g.trim()] = this.obtenerMonto(nuevoReporte.tipoMonto, data.l);
          nuevoReporte['id'] = i
        });
        i=i+1
        return nuevoReporte;
      });



    }
  }

  armarGrillaReportesMesCoordinador(reporte:any){
    if(reporte.reportePendientePeriodoYCoordinador.length>0){
      reporte.reportePendientePeriodoYCoordinador.sort((a:any, b:any) => {
        const fechaA = this.finanzasService.convertirFecha(a.g);
        const fechaB = this.finanzasService.convertirFecha(b.g);
        return fechaA.getTime() - fechaB.getTime();
      });

      const coordinadoresSet = new Set();

      reporte.reportePendientePeriodoYCoordinador.forEach((data: any) => {
        data.l.forEach((i: any) => {
          const clave = `${i.tipoMonto}-${i.coordinador}`;
          if (!coordinadoresSet.has(clave)) {
            coordinadoresSet.add(clave);
            this.listaReporteCoordinadora.push({ tipoMonto: i.tipoMonto, Coordinador: i.coordinador });
          }
        });
      });
      let i=0 
      let tempCoor=""
      this.listaReporteCoordinadora = this.listaReporteCoordinadora.map((informacion: any) => {
        const nuevoReporte: any = { ...informacion };
        if(tempCoor===nuevoReporte.Coordinador) i=i+1
        else { tempCoor=nuevoReporte.Coordinador;i = 0 }
        reporte.reportePendientePeriodoYCoordinador.forEach((data: any) => {
          
          nuevoReporte[data.g.trim()] = this.obtenerMontoCoordinador(nuevoReporte.tipoMonto,nuevoReporte.Coordinador, data.l);
          nuevoReporte['id'] = i
          
        });
        return nuevoReporte;
      });

      console.log("ordenado",reporte.reportePendientePeriodoYCoordinador)
      console.log("listaReporteCoordinadora",this.listaReporteCoordinadora)


    }
  }

  obtenerMontoCoordinador(tipoMonto:string,coor:string,detalle:any){
    try{
      let data = detalle.filter((e:any)=>e.tipoMonto===tipoMonto && e.coordinador===coor)
      if(data.length>0) {
        return this.redondearValor(data[0].monto)
      }
      else return 0
    }
    catch{
      return 0
    }
    
  }

  obtenerMonto(tipoMonto:string,detalle:any){
    try{
      let data = detalle.find((e:any)=>e.tipoMonto===tipoMonto)
      if(data) return this.redondearValor(data.monto)
      else return 0
    }
    catch{
      return 0
    }
    
  }


  ValidarProcesoDeDatos(){
    if(this.loader==true){
      if(this.f1==true && this.f2==true){
        this.ProcesarReporteMesCoordinadora(this.reporteGeneral)
      }else  this.loader=true
    }
  }

  redondearValor(valor:string){
    try{
      if(valor.includes('%')) return valor
      else {
        let monto  = parseFloat(valor)
        return Math.round(monto*100)/100
      }
    }
    catch{
      return valor
    }
   
  }

}
