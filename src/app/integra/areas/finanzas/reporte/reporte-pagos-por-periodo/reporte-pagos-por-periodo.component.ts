import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { constApi, constApiFinanzas, constApiGlobal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte-pagos-por-periodo',
  templateUrl: './reporte-pagos-por-periodo.component.html',
  styleUrls: ['./reporte-pagos-por-periodo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportePagosPorPeriodoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public finanzasService:FinanzasServiceService
  ) {}

  loader=false
  listaPrograma:any[]=[]
  listaAlumno:any[]=[]
  listaMatricula:any[]=[]
  listaMedioPago:any[]=[]
  itemsMedioPago:any[]=[]
  listaCiudadSede:any[]=[]
  itemsSede:any[]=[]
  listaModalidad:any[]=[]
  itemsModalidad:any[]=[]
  pageSizes: any = [5, 10, 20, 'All'];
  listaReporte:any[]=[]
  listaPeriodo:any[]=[]


  fechaCon = new FormControl(null,Validators.required)
  PeriodoCon = new FormControl(null,Validators.required)
  formGroupFiltro = this.formBuilder.group({
    fechaInicio:[new Date(),Validators.required],
    fechaFin:[new Date(),Validators.required],
    idCentroCosto:null,
    idAlumno:null,
    idMatricula:null,
    idFormaPago:null,
    idCiudad:null,
    idModalidad:null,
  });

  ngOnInit(): void {
    this.OtroIngresoEgresoObtenerListaFormaPago()
    this.obtenerComboCiudadSede()
    this.ProgramaGeneralModalidadCursoObtenerCombo()
    this.ObtenerComboPeriodo()
  }

  ObtenerComboPeriodo(){// Obtiene datos para el combo Periodo
    this.integraService
      .getJsonResponse(
        `${constApi.PeriodosObtener}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaPeriodo=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"COMBO - PERIODO")
        },
        complete: () => {},
      });
}

  ProgramaGeneralModalidadCursoObtenerCombo(){//Obtiene Combo Modalidad
    this.integraService.obtenerTodo(constApi.ProgramaGeneralModalidadCursoObtenerCombo).subscribe({
      next: (response: HttpResponse<
        {readonly id:number, 
        readonly nombre:string}[]>) => {
        this.listaModalidad=response.body
        this.itemsModalidad=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,'Obtener combo sede')
        },
        complete: () => {},
    });
  }

  obtenerComboCiudadSede(){//Obtiene Combo Ciudad de las sedes de la empresa BSG
    this.integraService.obtenerTodo(constApiFinanzas.GenerarFurObtenerCiudadSedes).subscribe({
      next: (response: HttpResponse<
        {readonly id:number, 
        readonly nombre:string}[]>) => {
        this.listaCiudadSede=response.body
        this.itemsSede=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,'Obtener combo sede')
        },
        complete: () => {},
    });
  }
  OtroIngresoEgresoObtenerListaFormaPago(){//Obtiene la forma de pago
    this.integraService.getJsonResponse(constApiFinanzas.OtroIngresoEgresoObtenerListaFormaPago).subscribe({
      next: (response: HttpResponse<
        {readonly id:number, 
        readonly nombre:string}[]>) => {
        this.listaMedioPago=response.body
        this.itemsMedioPago = response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"autocomplete - programa")
        },
        complete: () => {},
    });
  }

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
  filterMedioPago(event:any){//Autocomplete de Matricula
    event= event.trim()
    if(event.length>=3)
    this.itemsMedioPago = this.listaMedioPago.filter(
      (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    else this.itemsMedioPago=this.listaMedioPago
  }

  filterSede(event:any){//Autocomplete de Sede
    event= event.trim()
    if(event.length>=2)this.itemsSede = this.listaCiudadSede.filter(
      (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    else this.itemsSede = this.listaCiudadSede
  }
  filterModalidad(event:any){//Autocomplete de modalidad
    event= event.trim()
    if(event.length>=2)this.itemsModalidad = this.listaModalidad.filter(
      (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    else this.itemsModalidad = this.listaModalidad
  }

  generarReportePagoPorPeriodo(){
    if(this.formGroupFiltro.valid){
      let dataForm = this.formGroupFiltro.getRawValue();
      dataForm.fechaInicio = datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-ddT00:00:00.000', 'en-US');
      dataForm.fechaFin = datePipeTransform(dataForm.fechaFin, 'yyyy-MM-ddT23:59:59.000', 'en-US');
      this.loader=true
      this.integraService
    .postJsonResponse(constApiFinanzas.ObtenerReportePagosIngresos, 
      dataForm
    )
    .subscribe({
      next: (response) => {
        response.body.forEach((e:any) => {
          e.fechaPago = e.fechaPago==null?e.fechaPago:new Date(e.fechaPago)
          e.fechaCuota= e.fechaCuota==null?e.fechaCuota:new Date(e.fechaCuota)
          e.fechaDisponible= e.fechaDisponible==null?e.fechaDisponible:new Date(e.fechaDisponible)
          e.fechaDepositaron= e.fechaDepositaron==null?e.fechaDepositaron:new Date(e.fechaDepositaron)
          e.fechaPagoOriginal= e.fechaPagoOriginal==null?e.fechaPagoOriginal:new Date(e.fechaPagoOriginal)
          e.fechaProcesoPago= e.fechaProcesoPago==null?e.fechaProcesoPago:new Date(e.fechaProcesoPago)
        });
        this.listaReporte = response.body
        this.loader=false
      },
      error: (error) => {
        this.loader=false
        this.finanzasService.MensajeDeError(error,"REPORTE PAGOS POR PERIODO")
      },
      complete: () => {},
    });
    } 
    else this.formGroupFiltro.markAllAsTouched()
  }

  congelarFlujoFecha(){
    if(this.fechaCon.valid){
      this.PeriodoCon.reset()
      this.congelarFlujo(true)
    }
    else this.fechaCon.markAllAsTouched()
    
  }
  congelarFlujoPeriodo(){
    if(this.PeriodoCon.valid){
      this.fechaCon.reset()
      this.congelarFlujo(false)
    }
    else this.PeriodoCon.markAllAsTouched()
  }

  congelarFlujo(isfecha:boolean){
    const mensaje  = isfecha==true?this.finanzasService.fechaTemplate(this.fechaCon.value):this.PeriodoCon.value.nombre
    Swal.fire({
      title: '¿Está seguro de realizar el congelamiento hasta '+ (isfecha==true?'la fecha ':'el Periodo ')+ mensaje +' ?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Continuar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader=true

        let envio={
          fechaCongelamiento: isfecha==true?datePipeTransform(this.fechaCon.value ,'yyyy-MM-ddT00:00:00','en-US'):
          datePipeTransform(this.PeriodoCon.value.fechaFinFinanzas,'yyyy-MM-ddT00:00:00','en-US'),
          idPeriodo: isfecha!=true?this.PeriodoCon.value.id:null
        }

        console.log(envio)
        const urlCongelamiento = isfecha==true?constApiFinanzas.CongelarReporteDePagosPorDia:
        constApiFinanzas.CongelarReporteDePagosPorPeriodo

        this.integraService
        .postJsonResponse(urlCongelamiento,envio)
        .subscribe({
          next: (response) => {
            this.loader=false
              Swal.fire("Congelamiento exitoso!","El Reporte de pagos por periodo se ha congelado correctamente.","success")
          },
          error: (error) => {
            this.loader=false

            this.finanzasService.MensajeDeError(error,"congelar reporte pagos por periodo")
          },
          complete: () => {},
        });
      }
    });
  }
}
