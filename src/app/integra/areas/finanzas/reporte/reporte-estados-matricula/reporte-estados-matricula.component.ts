import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { ConfiguracionAgrupacionMatriculaComponent } from '@shared/components/configuracion-agrupacion-matricula/configuracion-agrupacion-matricula.component';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-reporte-estados-matricula',
  templateUrl: './reporte-estados-matricula.component.html',
  styleUrls: ['./reporte-estados-matricula.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReporteEstadosMatriculaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public finanzasService:FinanzasServiceService

  ) {}

  @ViewChild(ConfiguracionAgrupacionMatriculaComponent)
  private ConfiguracionAgrupacion: ConfiguracionAgrupacionMatriculaComponent;

  fun1=false ;fun2=false

  loader=false
  pageSizes: any = [5, 10, 20, 'All'];
  reporteGeneral:any
  listaEstadosMat:any[]=[]
  listaPersonal:any[]=[]
  itemsEstado:any[]=[]

  listaReporteMatriculado:any[]=[]

  listaReporteReal:any[]=[]
  listaReportePendiente:any[]=[]
  listaReporteProyectado:any[]=[]

  detalle:any[]=[]

  formGroupFiltro = this.formBuilder.group({
    fechaInicio:[null,Validators.required],
    fechaFin:[null,Validators.required],
    idsEstados:[null],
    idsCoordinadora:[null]
  });


  ngOnInit(): void {
    this.ObtenerComboEstados()
  }

  ObtenerComboEstados(){
    this.integraService
      .getJsonResponse(constApiFinanzas.EstadosMatriculaObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.listaEstadosMat = response.body;
          this.itemsEstado= response.body;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,'obtener comobo estados')
        },
        complete: () => {},
      });
  }

  ObtenerPersonalAutoComplete(nombre:string){
    this.integraService.getJsonResponse(constApiFinanzas.ObtenerAsistenteAcademicoMatricula+"/"+nombre).subscribe({
      next: (response: HttpResponse<
        {readonly id:number, 
        readonly nombre:string}[]>) => {
          this.listaPersonal=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"data combo personal")

        },
        complete: () => {},
    });
  }

  filterEstado(event:string){//Busca el Personal
    event= event.trim()
    if(event.length>=2)this.itemsEstado = this.listaEstadosMat.filter(
      (s) => s.estadoMatricula.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    else this.itemsEstado = this.listaEstadosMat
  }

  filterPersonal(event:string){//Busca el Personal
    event= event.trim()
    if(event.length>=3)this.ObtenerPersonalAutoComplete(event)
  }


  generarReporte(){
    if(this.formGroupFiltro.valid){
      let dataForm = this.formGroupFiltro.getRawValue()
      dataForm.fechaInicio = datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-ddT00:00:00.000', 'en-US');
      dataForm.fechaFin= datePipeTransform(dataForm.fechaFin, 'yyyy-MM-ddT23:59:59.000', 'en-US');
      let select = this.ConfiguracionAgrupacion.ObtenerSeleccionados()
      dataForm.idsConfiguracionPeriodo = select!=null?select.toString():null
      dataForm.idsEstados = dataForm.idsEstados!=null?dataForm.idsEstados.toString():null 
      dataForm.idsCoordinadora = dataForm.idsCoordinadora!=null?dataForm.idsCoordinadora.toString():null
      this.loader=true
      this.obtenerReporteMatriculados(dataForm)
      this.ObtenerReportePorEstadosMatricula(dataForm)
    }
    else this.formGroupFiltro.markAllAsTouched()
  }

  obtenerReporteMatriculados(envio :any){
    this.fun1=false
    this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteMatriculados,envio
      ).subscribe({
        next: (response: HttpResponse<any>) => {
          response.body.forEach((e:any)=>{
            e.fechaMatricula = e.fechaMatricula!=null?new Date(e.fechaMatricula):e.fechaMatricula
          })
          this.listaReporteMatriculado = response.body
          this.fun1=true
          this.ValidarProcesoDeDatos()
        },
        error: (error) => {
          this.loader==false
          this.fun1=true
          this.finanzasService.MensajeDeError(error, 'Obtener reporte matriculados');
        },
        complete: () => { },
      });
  }

  ObtenerReportePorEstadosMatricula(envio :any){
    this.fun2=false
    this.integraService.postJsonResponse(constApiFinanzas.ObtenerReportePorEstadosMatricula,envio
      ).subscribe({
        next: (response: HttpResponse<any>) => {
          console.log("Otros Reportes",response.body)
          this.reporteGeneral=response.body
          this.fun2=true
          this.ValidarProcesoDeDatos()
        },
        error: (error) => {
          this.fun2=true
          this.loader==false
          this.finanzasService.MensajeDeError(error, 'Obtener reporte matriculados');
        },
        complete: () => { },
      });
  }

  armarGrillasReportes(){
    if(this.reporteGeneral.detalle.length>0){
      
      this.reporteGeneral.detalle.sort((a:any, b:any) => {
        const fechaA = this.finanzasService.convertirFecha(a.periodo);
        const fechaB = this.finanzasService.convertirFecha(b.periodo);
        return fechaA.getTime() - fechaB.getTime();
      });

      this.detalle=this.reporteGeneral.detalle

      this.listaReporteProyectado = this.reporteGeneral.listaPrincipal.map((data: any) => {
        const nuevoReporte: any = { ...data };
        this.reporteGeneral.detalle.forEach((periodos: any) => {
          nuevoReporte[periodos.periodo] = this.obtenerMontosParaGrid(
            1,periodos.detalle,nuevoReporte.coordinadoraCobranza,nuevoReporte.agrupacionMat,nuevoReporte.estadoMatricula);
            nuevoReporte['Asistente de cobranza'] = nuevoReporte.coordinadoraCobranza
        });
        return nuevoReporte;
      });

      this.listaReporteReal = this.reporteGeneral.listaPrincipal.map((data: any) => {
        const nuevoReporte: any = { ...data };
        this.reporteGeneral.detalle.forEach((periodos: any) => {
          nuevoReporte[periodos.periodo] = this.obtenerMontosParaGrid(
            2,periodos.detalle,nuevoReporte.coordinadoraCobranza,nuevoReporte.agrupacionMat,nuevoReporte.estadoMatricula);
            nuevoReporte['Asistente de cobranza'] = nuevoReporte.coordinadoraCobranza
        });
        return nuevoReporte;
      });

      this.listaReportePendiente = this.reporteGeneral.listaPrincipal.map((data: any) => {
        const nuevoReporte: any = { ...data };
        this.reporteGeneral.detalle.forEach((periodos: any) => {
          nuevoReporte[periodos.periodo] = this.obtenerMontosParaGrid(
            3,periodos.detalle,nuevoReporte.coordinadoraCobranza,nuevoReporte.agrupacionMat,nuevoReporte.estadoMatricula);
          nuevoReporte['Asistente de cobranza'] = nuevoReporte.coordinadoraCobranza
        });
        return nuevoReporte;
      });

      console.log("PROYECTADO ",this.listaReporteProyectado)
      console.log("REAL ",this.listaReporteReal)
      console.log("PENDIENTE ",this.listaReportePendiente)
    }
    this.loader=false
  }

  obtenerMontosParaGrid(tipo:number,detalle:any,coordinadora:string,agrup:string,estado:string){
    try{
      let data = detalle.find((e:any)=>
        e.coordinadoraCobranza===coordinadora && 
        e.agrupacionMat===agrup && 
        e.estadoMatricula===estado
      )
      if(data){
        switch(tipo){
          case 1://proyectado
            return Math.round(data.proyectado*100)/100
            break;
          case 2://real
            return Math.round(data.real*100)/100
            break;
          case 3://pendiente
            return Math.round(data.pendiente*100)/100
            break;
          default:
            return 0
            break;
        }
      }
      else return 0
    }
    catch{
      return 0
    }
  }

  ValidarProcesoDeDatos(){
    if(this.loader==true){
      if(this.fun1==true && this.fun2==true){
        this.armarGrillasReportes()
      }else  this.loader=true
    }
  }
}
