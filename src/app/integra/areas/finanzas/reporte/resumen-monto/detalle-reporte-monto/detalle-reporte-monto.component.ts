import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import * as saveAs from 'file-saver';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-detalle-reporte-monto',
  templateUrl: './detalle-reporte-monto.component.html',
  styleUrls: ['./detalle-reporte-monto.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class DetalleReporteMontoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService:AlertaService,
    public finanzasService:FinanzasServiceService
  ) {}
  // Variables usadas en el componente ------------------------------------------------------------------

  @Input() formGroupFiltro:FormGroup;

  Reporte1=false;Reporte2=false;Reporte3=false;Reporte4=false;Reporte5=false;
  Proceso1=false;Proceso2=false;Proceso3=false;Proceso4=false
  Proceso5=false;Proceso6=false;Proceso7=false;Proceso8=false
  Proceso9=false
  loading=false
  mensajeLoading=''
  dataSource:any

  ReporteGeneral:any={
    resumenMontos:[],
    resumenMontosCierre:[],
    resumenNuevosMatriculados:[],
    cambios:[],
    diferencias:[],
  }

  ReporteDataProcesada:any={
    periodoActual:[],
    periodoCierre:[],
    variacionMensual:[],
    nuevosMatriculados:[],

    totalizadoPais:[],
    modalidadPresencialPais:[],
    modalidadOnlinePais:[],
    modalidadAonlinePais:[],
    modalidadInHousePais:[],
  }

  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
  }
  
  //--------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------

  BuscarByFiltro(){//Genera el reporte con el filtro que se ingreso
    if(this.formGroupFiltro.valid){
      let filtro = this.formGroupFiltro.getRawValue()
      filtro.fechaInicio = datePipeTransform(filtro.fechaInicio,'yyyy-MM-ddT00:00:00','en-US')
      filtro.fechaFin =datePipeTransform(filtro.fechaFin ,'yyyy-MM-ddT23:59:59','en-US')

      if(filtro.idPais==-2)
      {
        filtro.isTodo=true
        filtro.isOtrosPais = false
        filtro.idPais = '';
      }
      else if(filtro.idPais==-1) {
        filtro.isTodo=false
        filtro.idPais = '51,57,591,56';
        filtro.isOtrosPais = true
      }
      else {
        filtro.isTodo=false
        filtro.idPais = filtro.idPais.toString()
        filtro.isOtrosPais = false
      }
      this.mensajeLoading='Obteniendo Datos'
      this.loading=true
      this.ObtenerReporteResumenMontosCierre(filtro)
      this.ObtenerReporteResumenMontosDiferencias(filtro)
      this.ObtenerReporteResumenMontos(filtro)
      this.ObtenerReporteResumenMontosCambios(filtro)
      this.ObtenerReporteResumenMontosNuevosMatriculados(filtro)

    }
    else this.formGroupFiltro.markAllAsTouched()
  }

  ValidarObtencionDeDatos(){
    if(this.loading==true){
      if(this.Reporte1==true && this.Reporte2==true && this.Reporte3==true && this.Reporte4==true && this.Reporte5==true){
        this.ProcesarDatosParaGrilla()
      }else  this.loading=true
    }
  }

  ProcesarDatosParaGrilla()
  {
    this.mensajeLoading='Procesando Datos'
    this.GenerarReporteResumenMontosTotalizadoModalidadInHousePais()
    this.GenerarReporteResumenMontosTotalizadoModalidadAonlinePais()
    this.GenerarReporteResumenMontosTotalizadoModalidadOnlinePais()
    this.GenerarReporteResumenMontosTotalizadoModalidadPresencialPais()
    this.GenerarReporteResumenMontosTotalizadoPais()
    this.GenerarReporteResumenMontosNuevosMatriculados()
    this.GenerarReporteResumenMontosVariacionMensual()
    this.GenerarReporteResumenMontosTotalizadoPeriodoCierre()
    this.GenerarReporteResumenMontosTotalizadoPeriodoActual()
  }

  public periodoActual:Array<any>=[]
  public periodoCierre:Array<any>=[]
  public variacionMensual:Array<any>=[]
  public nuevosMatriculados:Array<any>=[]
  public totalizadoPais:Array<any>=[]
  public modalidadPresencialPais:Array<any>=[]
  public modalidadOnlinePais:Array<any>=[]
  public modalidadAonlinePais:Array<any>=[]
  public modalidadInHousePais:Array<any>=[]


  ValidarProcesoDeDatos(){
    if(this.loading==true){
      if(this.Proceso1==true && this.Proceso2==true && this.Proceso3==true && this.Proceso4==true &&
        this.Proceso5==true && this.Proceso6==true && this.Proceso7==true && this.Proceso8==true && this.Proceso9==true){
          this.loading=false
          console.log("PERIODO ACTUAL ANTES :",this.ReporteDataProcesada)
          this.TotalizadoPeriodoActual()
          this.TotalizadoPeriodoCierre()
          this.VariacionMensual()
          this.NuevosMatriculados()
          this.TotalizadoPais()
          this.ModalidadPresencialPais()
          this.ModalidadOnlinePais()
          this.ModalidadInHousePais()
      }else  this.loading=true
    }
  }
  //------------------------------------------------------------------------------------------------------
  
  //Funciones ARMADO DE DATA PARA GRID-------------------------------------------------------------------------------------------------------
  

  TotalizadoPeriodoActual(){
    this.periodoActual=[]
    if(this.ReporteDataProcesada.periodoActual!=null && this.ReporteDataProcesada.periodoActual.length>0)
    {
      this.ReporteDataProcesada.periodoActual.sort((a:any, b:any) => {
        const fechaA = this.finanzasService.convertirFecha(a.g);
        const fechaB = this.finanzasService.convertirFecha(b.g);
        return fechaA.getTime() - fechaB.getTime();
      });

      this.periodoActual = this.ReporteDataProcesada.periodoActual[0].l.map((e: any) => {
        return { tipoMonto: e.tipoMonto };
      });
      this.periodoActual = this.periodoActual.map((data: any) => {
        const nuevoReporte: any = { ...data }; 
        this.ReporteDataProcesada.periodoActual.forEach((periodos:any)=>{
          nuevoReporte[periodos.g] = this.buscarMontoEnDetalle(periodos.l,nuevoReporte.tipoMonto)
        })
        return nuevoReporte;
      });
    }
    
  }

  buscarMontoEnDetalle(detalle:any[],tipo:string){
    try{
      let data = detalle.find((e:any)=>e.tipoMonto===tipo)
      if(data) return data.monto
      else return 0
    }
    catch{
      return 0
    }
    
  }

  TotalizadoPeriodoCierre(){
    this.periodoCierre=[]
    if(this.ReporteDataProcesada.periodoCierre!=null && this.ReporteDataProcesada.periodoCierre.length>0)
    {
      this.ReporteDataProcesada.periodoCierre.sort((a:any, b:any) => {
        const fechaA = this.finanzasService.convertirFecha(a.g);
        const fechaB = this.finanzasService.convertirFecha(b.g);
        return fechaA.getTime() - fechaB.getTime();
      });

      this.periodoCierre = this.ReporteDataProcesada.periodoCierre[0].l.map((e: any) => {
        return { tipoMonto: e.tipoMonto };
      });
      this.periodoCierre = this.periodoCierre.map((data: any) => {
        const nuevoReporte: any = { ...data }; 
        this.ReporteDataProcesada.periodoCierre.forEach((periodos:any)=>{
          nuevoReporte[periodos.g] = this.buscarMontoEnDetalle(periodos.l,nuevoReporte.tipoMonto)
        })
        return nuevoReporte;
      });

    }
  }

  VariacionMensual(){
    this.variacionMensual=[]
    if(this.ReporteDataProcesada.variacionMensual!=null && this.ReporteDataProcesada.variacionMensual.length>0)
    {
      this.ReporteDataProcesada.variacionMensual.sort((a:any, b:any) => {
        const fechaA = this.finanzasService.convertirFecha(a.g);
        const fechaB = this.finanzasService.convertirFecha(b.g);
        return fechaA.getTime() - fechaB.getTime();
      });

      this.variacionMensual = this.ReporteDataProcesada.variacionMensual[0].l.map((e: any) => {
        return { tipoMonto: e.tipoMonto };
      });
      this.variacionMensual = this.variacionMensual.map((data: any) => {
        const nuevoReporte: any = { ...data }; 
        this.ReporteDataProcesada.variacionMensual.forEach((periodos:any)=>{
          nuevoReporte[periodos.g] = this.buscarMontoEnDetalle(periodos.l,nuevoReporte.tipoMonto)
        })
        return nuevoReporte;
      });
    }
  }
  NuevosMatriculados(){
    this.nuevosMatriculados=[]
    if(this.ReporteDataProcesada.nuevosMatriculados!=null && this.ReporteDataProcesada.nuevosMatriculados.length>0)
    {
      this.ReporteDataProcesada.nuevosMatriculados.sort((a:any, b:any) => {
        const fechaA = this.finanzasService.convertirFecha(a.g);
        const fechaB = this.finanzasService.convertirFecha(b.g);
        return fechaA.getTime() - fechaB.getTime();
      });

      this.nuevosMatriculados = this.ReporteDataProcesada.nuevosMatriculados[0].l.map((e: any) => {
        return { tipoMonto: e.tipoMonto };
      });
      this.nuevosMatriculados = this.nuevosMatriculados.map((data: any) => {
        const nuevoReporte: any = { ...data }; 
        this.ReporteDataProcesada.nuevosMatriculados.forEach((periodos:any)=>{
          nuevoReporte[periodos.g] = this.buscarMontoEnDetalle(periodos.l,nuevoReporte.tipoMonto)
        })
        return nuevoReporte;
      });
    }
    console.log("PERIODO ACTUAL DESPUES :",this.nuevosMatriculados)
  }
  TotalizadoPais(){
    this.totalizadoPais=[]
    if(this.ReporteDataProcesada.totalizadoPais!=null && this.ReporteDataProcesada.totalizadoPais.length>0)
    {
      this.ReporteDataProcesada.totalizadoPais.sort((a:any, b:any) => {
        const fechaA = this.finanzasService.convertirFecha(a.g);
        const fechaB = this.finanzasService.convertirFecha(b.g);
        return fechaA.getTime() - fechaB.getTime();
      });

      this.totalizadoPais = this.ReporteDataProcesada.totalizadoPais[0].l.map((e: any) => {
        return { tipoMonto: e.tipoMonto };
      });
      this.totalizadoPais = this.totalizadoPais.map((data: any) => {
        const nuevoReporte: any = { ...data }; 
        this.ReporteDataProcesada.totalizadoPais.forEach((periodos:any)=>{
          nuevoReporte[periodos.g] = this.buscarMontoEnDetalle(periodos.l,nuevoReporte.tipoMonto)
        })
        return nuevoReporte;
      });
    }
  }
  
  ModalidadPresencialPais(){
    this.modalidadPresencialPais=[]
    if(this.ReporteDataProcesada.modalidadPresencialPais!=null && this.ReporteDataProcesada.modalidadPresencialPais.length>0)
    {
      this.ReporteDataProcesada.modalidadPresencialPais.sort((a:any, b:any) => {
        const fechaA = this.finanzasService.convertirFecha(a.g);
        const fechaB = this.finanzasService.convertirFecha(b.g);
        return fechaA.getTime() - fechaB.getTime();
      });

      this.modalidadPresencialPais = this.ReporteDataProcesada.modalidadPresencialPais[0].l.map((e: any) => {
        return { tipoMonto: e.tipoMonto };
      });
      this.modalidadPresencialPais = this.modalidadPresencialPais.map((data: any) => {
        const nuevoReporte: any = { ...data }; 
        this.ReporteDataProcesada.modalidadPresencialPais.forEach((periodos:any)=>{
          nuevoReporte[periodos.g] = this.buscarMontoEnDetalle(periodos.l,nuevoReporte.tipoMonto)
        })
        return nuevoReporte;
      });
    }
  }
  ModalidadOnlinePais(){
    this.modalidadOnlinePais=[]
    if(this.ReporteDataProcesada.modalidadOnlinePais!=null && this.ReporteDataProcesada.modalidadOnlinePais.length>0)
    {
      this.ReporteDataProcesada.modalidadOnlinePais.sort((a:any, b:any) => {
        const fechaA = this.finanzasService.convertirFecha(a.g);
        const fechaB = this.finanzasService.convertirFecha(b.g);
        return fechaA.getTime() - fechaB.getTime();
      });

      this.modalidadOnlinePais = this.ReporteDataProcesada.modalidadOnlinePais[0].l.map((e: any) => {
        return { tipoMonto: e.tipoMonto };
      });
      this.modalidadOnlinePais = this.modalidadOnlinePais.map((data: any) => {
        const nuevoReporte: any = { ...data }; 
        this.ReporteDataProcesada.modalidadOnlinePais.forEach((periodos:any)=>{
          nuevoReporte[periodos.g] = this.buscarMontoEnDetalle(periodos.l,nuevoReporte.tipoMonto)
        })
        return nuevoReporte;
      });
    }
  }

  ModalidadAonlinePais(){
    this.modalidadAonlinePais=[]
    if(this.ReporteDataProcesada.modalidadAonlinePais!=null && this.ReporteDataProcesada.modalidadAonlinePais.length>0)
    {
      this.ReporteDataProcesada.modalidadAonlinePais.sort((a:any, b:any) => {
        const fechaA = this.finanzasService.convertirFecha(a.g);
        const fechaB = this.finanzasService.convertirFecha(b.g);
        return fechaA.getTime() - fechaB.getTime();
      });

      this.modalidadAonlinePais = this.ReporteDataProcesada.modalidadAonlinePais[0].l.map((e: any) => {
        return { tipoMonto: e.tipoMonto };
      });
      this.modalidadAonlinePais = this.modalidadAonlinePais.map((data: any) => {
        const nuevoReporte: any = { ...data }; 
        this.ReporteDataProcesada.modalidadAonlinePais.forEach((periodos:any)=>{
          nuevoReporte[periodos.g] = this.buscarMontoEnDetalle(periodos.l,nuevoReporte.tipoMonto)
        })
        return nuevoReporte;
      });
    }
  }
  ModalidadInHousePais(){
    this.modalidadInHousePais=[]
    if(this.ReporteDataProcesada.modalidadInHousePais!=null && this.ReporteDataProcesada.modalidadInHousePais.length>0)
    {
      this.ReporteDataProcesada.modalidadInHousePais.sort((a:any, b:any) => {
        const fechaA = this.finanzasService.convertirFecha(a.g);
        const fechaB = this.finanzasService.convertirFecha(b.g);
        return fechaA.getTime() - fechaB.getTime();
      });

      this.modalidadInHousePais = this.ReporteDataProcesada.modalidadInHousePais[0].l.map((e: any) => {
        return { tipoMonto: e.tipoMonto };
      });
      this.modalidadInHousePais = this.modalidadInHousePais.map((data: any) => {
        const nuevoReporte: any = { ...data }; 
        this.ReporteDataProcesada.modalidadInHousePais.forEach((periodos:any)=>{
          nuevoReporte[periodos.g] = this.buscarMontoEnDetalle(periodos.l,nuevoReporte.tipoMonto)
        })
        return nuevoReporte;
      });
    }
  }

  //------------------------------------------------------------------------------------------------------
  //Funciones PROCESAMIENTO DE DATA-------------------------------------------------------------------------------------------------------
  GenerarReporteResumenMontosTotalizadoPeriodoActual(){
    this.Proceso1=false
    this.integraService.postJsonResponse(constApiFinanzas.GenerarReporteResumenMontosTotalizadoPeriodoActual,this.ReporteGeneral).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.Proceso1=true
        this.ReporteDataProcesada.periodoActual=response.body
        this.ValidarProcesoDeDatos()
      },
      error: (error) => {
        this.loading=false
        this.finanzasService.MensajeDeError(error,'Generar Reporte Resumen Montos Totalizado Periodo Actual');
      },
      complete: () => {},
    });
   }
   GenerarReporteResumenMontosTotalizadoPeriodoCierre(){
    this.Proceso2=false
    this.integraService.postJsonResponse(constApiFinanzas.GenerarReporteResumenMontosTotalizadoPeriodoCierre,this.ReporteGeneral).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.Proceso2=true
        this.ReporteDataProcesada.periodoCierre=response.body
        this.ValidarProcesoDeDatos()
      },
      error: (error) => {
        this.loading=false
        this.finanzasService.MensajeDeError(error,'Generar Reporte Resumen Montos Totalizado Periodo Cierre');
      },
      complete: () => {},
    });
   }

   GenerarReporteResumenMontosVariacionMensual(){
    this.Proceso3=false
    this.integraService.postJsonResponse(constApiFinanzas.GenerarReporteResumenMontosVariacionMensual,this.ReporteGeneral).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.Proceso3=true
        this.ReporteDataProcesada.variacionMensual=response.body
        this.ValidarProcesoDeDatos()
      },
      error: (error) => {
        this.loading=false
        this.finanzasService.MensajeDeError(error,'Generar Reporte Resumen Montos Variacion Mensual');
      },
      complete: () => {},
    });
   }
   GenerarReporteResumenMontosNuevosMatriculados(){
    this.Proceso4=false
    this.integraService.postJsonResponse(constApiFinanzas.GenerarReporteResumenMontosNuevosMatriculados,this.ReporteGeneral).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.Proceso4=true
        this.ReporteDataProcesada.nuevosMatriculados=response.body
        this.ValidarProcesoDeDatos()
      },
      error: (error) => {
        this.loading=false
        this.finanzasService.MensajeDeError(error,'Generar Reporte Resumen Montos Nuevos Matriculados');
      },
      complete: () => {},
    });
   }
   GenerarReporteResumenMontosTotalizadoPais(){
    this.Proceso5=false
    this.integraService.postJsonResponse(constApiFinanzas.GenerarReporteResumenMontosTotalizadoPais,this.ReporteGeneral).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.Proceso5=true
        this.ReporteDataProcesada.totalizadoPais=response.body
        this.ValidarProcesoDeDatos()
      },
      error: (error) => {
        this.loading=false
        this.finanzasService.MensajeDeError(error,'Generar Reporte Resumen Montos Totalizado Pais');
      },
      complete: () => {},
    });
   }
   GenerarReporteResumenMontosTotalizadoModalidadPresencialPais(){
    this.Proceso6=false
    this.integraService.postJsonResponse(constApiFinanzas.GenerarReporteResumenMontosTotalizadoModalidadPresencialPais,this.ReporteGeneral).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.Proceso6=true
        this.ReporteDataProcesada.modalidadPresencialPais=response.body
        this.ValidarProcesoDeDatos()
      },
      error: (error) => {
        this.loading=false
        this.finanzasService.MensajeDeError(error,'Generar Reporte Resumen Montos Totalizado Modalidad Presencial Pais');
      },
      complete: () => {},
    });
   }
   GenerarReporteResumenMontosTotalizadoModalidadOnlinePais(){
    this.Proceso7=false
    this.integraService.postJsonResponse(constApiFinanzas.GenerarReporteResumenMontosTotalizadoModalidadOnlinePais,this.ReporteGeneral).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.Proceso7=true
        this.ReporteDataProcesada.modalidadOnlinePais=response.body
        this.ValidarProcesoDeDatos()
      },
      error: (error) => {
        this.loading=false
        this.finanzasService.MensajeDeError(error,'Generar Reporte Resumen Montos Totalizado Modalidad Online Pais');
      },
      complete: () => {},
    });
   }
   GenerarReporteResumenMontosTotalizadoModalidadAonlinePais(){
    this.Proceso8=false
    this.integraService.postJsonResponse(constApiFinanzas.GenerarReporteResumenMontosTotalizadoModalidadAonlinePais,this.ReporteGeneral).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.Proceso8=true
        this.ReporteDataProcesada.modalidadAonlinePais=response.body
        this.ValidarProcesoDeDatos()
      },
      error: (error) => {
        this.loading=false
        this.finanzasService.MensajeDeError(error,'Generar Reporte Resumen Montos Totalizado Modalidad Aonline Pais');
      },
      complete: () => {},
    });
   }
   GenerarReporteResumenMontosTotalizadoModalidadInHousePais(){
    this.Proceso9=false
    this.integraService.postJsonResponse(constApiFinanzas.GenerarReporteResumenMontosTotalizadoModalidadInHousePais,this.ReporteGeneral).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.Proceso9=true
        this.ReporteDataProcesada.modalidadInHousePais=response.body
        this.ValidarProcesoDeDatos()
      },
      error: (error) => {
        this.loading=false
        this.finanzasService.MensajeDeError(error,'Generar Reporte Resumen Montos Totalizado Modalidad Aonline Pais');
      },
      complete: () => {},
    });
   }
  //------------------------------------------------------------------------------------------------------
  //Funciones GENERACION DE DATOS -------------------------------------------------------------------------------------------------------
  ObtenerReporteResumenMontosCierre(filtro:any){
    this.Reporte1=false
    this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteResumenMontosCierre,filtro).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.ReporteGeneral.resumenMontosCierre = response.body
          this.Reporte1=true
          this.ValidarObtencionDeDatos()
          
      },
      error: (error) => {
          this.loading=false
          this.finanzasService.MensajeDeError(error,'Obtener Reporte Resumen Montos Cierre');
      },
      complete: () => {},
    });
   }
   
   ObtenerReporteResumenMontosNuevosMatriculados(filtro:any){
    this.Reporte5=false
    this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteResumenMontosNuevosMatriculados,filtro).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.ReporteGeneral.resumenNuevosMatriculados = response.body
          this.Reporte5=true
          this.ValidarObtencionDeDatos()
          
      },
      error: (error) => {
          this.loading=false
          this.finanzasService.MensajeDeError(error,'Obtener Reporte Resumen Montos Cierre');
      },
      complete: () => {},
    });
   }
   
   ObtenerReporteResumenMontosDiferencias(filtro:any){
    this.Reporte2=false
    this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteResumenMontosDiferencias,filtro).subscribe({
      next: (response: HttpResponse<any[]>) => {
          this.ReporteGeneral.diferencias = response.body
          this.Reporte2=true
          this.ValidarObtencionDeDatos()
          
        },
        error: (error) => {
          this.loading=false
          this.finanzasService.MensajeDeError(error,'Obtener Reporte Resumen Montos Diferencias');
        },
        complete: () => {},
    });
   }
   ObtenerReporteResumenMontos(filtro:any){
    this.Reporte3=false
    this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteResumenMontos,filtro).subscribe({
      next: (response: HttpResponse<any[]>) => {
          this.ReporteGeneral.resumenMontos = response.body
          this.Reporte3=true
          this.ValidarObtencionDeDatos()
          
        },
        error: (error) => {
          this.loading=false
          this.finanzasService.MensajeDeError(error,'Obtener Reporte Resumen Montos');
        },
        complete: () => {},
    });
   }
   ObtenerReporteResumenMontosCambios(filtro:any){
    this.Reporte4=false
    this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteResumenMontosCambios,filtro).subscribe({
      next: (response: HttpResponse<any[]>) => {
          this.ReporteGeneral.cambios = response.body
          this.Reporte4=true
          this.ValidarObtencionDeDatos()
          
        },
        error: (error) => {
          this.loading=false
          this.finanzasService.MensajeDeError(error,'Obtener Reporte Resumen Montos Cambios');
        },
        complete: () => {},
    });
   }
  //------------------------------------------------------------------------------------------------------

  exportarExcel(): void {
    const element = document.getElementById('NuevosMatriculados');
    const tabla = XLSX.utils.table_to_sheet(element);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, tabla, 'Hoja1');
    XLSX.writeFile(libro, 'datos.xlsx');
  }

}
