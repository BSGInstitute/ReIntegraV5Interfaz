import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambio-cronograma-codigo-cuota',
  templateUrl: './cambio-cronograma-codigo-cuota.component.html',
  styleUrls: ['./cambio-cronograma-codigo-cuota.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class CambioCronogramaCodigoCuotaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public finanzasService:FinanzasServiceService
  ) {}

  loader=false
  listaPrograma:any[]=[]
  listaAlumno:any[]=[]
  listaMatricula:any[]=[]

  listaCodigos:any[]=[]
  listaCambios:any[]=[]
  listaCuotas:any[]=[]
  listaTraslados:any[]=[]

  tab1=false;tab2=false;tab3=false;tab4=false;
  tab1S=false;tab2S=false;tab3S=false;tab4S=false;
  fun1=false;fun2=false;fun3=false;fun4=false


  fechaCongelamiento =  new FormControl(new Date(),Validators.required)

  formGroupFiltro = this.formBuilder.group({
    fechaInicio:[new Date(),Validators.required],
    fechaFin:[new Date(),Validators.required],
    idCentroCosto:null,
    idAlumno:null,
    idMatricula:null,
  });

  chekedReportes = {
    rCambios:false,
    rCodigos:false,
    rCuotas :false,
    rTraslados:false
  }
  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.validarTabSelect()
  }
  //--------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------

  // Funciones para la optencion de datos ------------------------------------------------------------------
  ObtenerProgramaAutoComplete(programa :string){//Obtiene el Centro de Costo.
    let params: Parametro[] = [
      { clave: 'codigo ', valor: programa }
    ];
    this.integraService.obtenerPorPathParams(constApiFinanzas.GenerarFurCentroCosto,params).subscribe({
      next: (response: HttpResponse<
        {readonly id:number, 
        readonly nombre:string}[]>) => {
        this.listaPrograma=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"autocomplete - programa")
        },
        complete: () => {},
    });
  }
  ObtenerAlumnoAutoComplete(alumno:string){//matricula Autocomplete
    this.integraService
    .postJsonResponse(constApiFinanzas.ObtenerAlumnoPorValor, 
      {valor: alumno,}
    )
    .subscribe({
      next: (response) => {
        this.listaAlumno = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"autocomplete - alumno")
      },
      complete: () => {},
    });
  }

  ObtenerMatriculaAutoComplete(alumno:string){//matricula Autocomplete
    this.integraService
    .postJsonResponse(constApiFinanzas.ObtenerCodigoMatriculaAutocomplete, 
      {valor: alumno}
    )
    .subscribe({
      next: (response) => {
        this.listaMatricula = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"autocomplete - matricula")
      },
      complete: () => {},
    });
  }
  


  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------

  filterPrograma(event:any){//Autocomplete de Matricula
    event= event.trim()
    if(event.length>=4)this.ObtenerProgramaAutoComplete(event)
    else this.listaPrograma=[]
  }

  filterAlumno(event:any){//Autocomplete de Alumno
    event= event.trim()
    if(event.length>=4)this.ObtenerAlumnoAutoComplete(event)
    else this.listaAlumno=[]
  }
  filterCodigoMat(event:any){//Autocomplete de Matricula
    event= event.trim()
    if(event.length>=4)this.ObtenerMatriculaAutoComplete(event)
    else this.listaMatricula=[]
  }

  todosFalsos(obj: Record<string, boolean>): boolean {
    return Object.values(obj).every(value => value === false);
  }

  validarTabSelect(){
    this.tab1=false;this.tab2=false;this.tab3=false;this.tab4=false;
    if(this.todosFalsos(this.chekedReportes)) {
      this.tab1=true
      this.tab1S=true;this.tab2S=true;this.tab3S=true;this.tab4S=true;
    }
    else{
      this.tab1S=this.chekedReportes.rCambios
      this.tab2S=this.chekedReportes.rCodigos
      this.tab3S=this.chekedReportes.rCuotas
      this.tab4S=this.chekedReportes.rTraslados

      if (this.tab1S)  this.tab1 = true;
      else if (this.tab2S) this.tab2 = true;
      else if (this.tab3S) this.tab3 = true;
      else if (this.tab4S) this.tab4 = true;
    }
  }

  generarReporte(){
    if(this.formGroupFiltro.valid){
      if(this.todosFalsos(this.chekedReportes)){
        Swal.fire(
          "Reporte no seleccionado!","Selecciona uno o más reportes.","warning"
        )
      }
      else{
        this.validarTabSelect()
        this.fun1=true;this.fun2=true;this.fun3=true;this.fun4=true
        let dataForm = this.formGroupFiltro.getRawValue()

        dataForm.fechaInicio = datePipeTransform(dataForm.fechaInicio,'yyyy-MM-ddT00:00:00.000', 'en-US');
        dataForm.fechaFin = datePipeTransform(dataForm.fechaFin,'yyyy-MM-ddT23:59:00.000', 'en-US');

        this.loader=true
        if(this.chekedReportes.rCambios==true)this.generarReporteCambios(dataForm)
        if(this.chekedReportes.rCodigos==true)this.generarReporteCodigos(dataForm)
        if(this.chekedReportes.rCuotas==true)this.generarReporteCuotas(dataForm)
        if(this.chekedReportes.rTraslados==true)this.generarReporteTraslados(dataForm)
      }
    }
    else this.formGroupFiltro.markAllAsTouched()
  }

  generarReporteCambios(filtro:any){
    this.fun1=false
    this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteCambios,filtro).subscribe({
      next: (response: HttpResponse<any>) => {
          this.fun1=true
          response.body.forEach((e:any) => {
            e.fechaCambio = e.fechaCambio!=null?new Date(e.fechaCambio):e.fechaCambio
          });
          this.listaCambios=response.body
          this.ValidarObtencionDeDatos()
        },
        error: (error) => {
          this.fun1=true
          this.finanzasService.MensajeDeError(error,"reporte cambios")
          this.ValidarObtencionDeDatos()
        },
        complete: () => {},
    });

  }
  generarReporteCodigos(filtro:any){
    this.fun2=false
    this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteCodigos,filtro).subscribe({
      next: (response: HttpResponse<any>) => {
          this.fun2=true
          response.body.forEach((e:any) => {
            e.fechaCreacion = e.fechaCreacion!=null?new Date(e.fechaCreacion):e.fechaCreacion
          });
          this.listaCodigos=response.body
          this.ValidarObtencionDeDatos()
        },
        error: (error) => {
          this.fun2=true
          this.finanzasService.MensajeDeError(error,"reporte codigos")
          this.ValidarObtencionDeDatos()
        },
        complete: () => {},
    });
  }
  generarReporteCuotas(filtro:any){
    this.fun3=false
    this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteCuotas,filtro).subscribe({
      next: (response: HttpResponse<any>) => {
          this.fun3=true
          response.body.forEach((e:any) => {
            e.fechaCuota = e.fechaCuota!=null?new Date(e.fechaCuota):e.fechaCuota
          });
          this.listaCuotas=response.body
          this.ValidarObtencionDeDatos()
        },
        error: (error) => {
          this.fun3=true
          this.finanzasService.MensajeDeError(error,"reporte cuotas")
          this.ValidarObtencionDeDatos()
        },
        complete: () => {},
    });
  }
  generarReporteTraslados(filtro:any){
    this.fun4=false
    this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteTraslados,filtro).subscribe({
      next: (response: HttpResponse<any>) => {
          this.fun4=true
          response.body.forEach((e:any) => {
            e.fecha = e.fecha!=null?new Date(e.fecha):e.fecha
          });
          this.listaTraslados=response.body
          this.ValidarObtencionDeDatos()
        },
        error: (error) => {
          this.fun4=true
          this.finanzasService.MensajeDeError(error,"reporte Traslados")
          this.ValidarObtencionDeDatos()
        },
        complete: () => {},
    });
  }

  ValidarObtencionDeDatos(){
    if(this.loader==true){
      if(this.fun1==true && this.fun2==true && this.fun3==true && this.fun4==true ){
          this.limpiarData()
          this.loader=false
      }else  this.loader=true
    }
  }

  limpiarData(){
    if(this.chekedReportes.rCambios==false)this.listaCambios=[]
    if(this.chekedReportes.rCodigos==false)this.listaCodigos=[]
    if(this.chekedReportes.rCuotas==false)this.listaCuotas=[]
    if(this.chekedReportes.rTraslados==false)this.listaTraslados=[]
  }

  generarCongelamiento(){
    if(this.fechaCongelamiento.valid){
      Swal.fire({
        title: '¿Está seguro de realizar el congelamiento hasta la fecha '
                +this.finanzasService.fechaTemplate(this.fechaCongelamiento.value)+'?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, Continuar!',
      }).then((result) => {
        if (result.isConfirmed) {
          let fechaCong = datePipeTransform(this.fechaCongelamiento.value, 'yyyy-MM-ddT00:00:00.000', 'en-US');
          let envio={
            FechaCongelamiento : fechaCong
          }
          this.loader=true
          this.integraService.postJsonResponse(constApiFinanzas.CongelarReporteDeCambios,envio).subscribe({
            next: (response: HttpResponse<any>) => {
                this.loader=false
                Swal.fire("Congelamiento exitoso!","El Reporte de Cambios se ha congelado correctamente.","success")
              },
              error: (error) => {
                this.loader=false
                this.finanzasService.MensajeDeError(error,"congelar reporte cambios")
              },
              complete: () => {},
          });
        }
      });
     
    }
    else this.fechaCongelamiento.markAllAsTouched()
  }

}
