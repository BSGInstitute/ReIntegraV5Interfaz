import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-filtro-reporte',
  templateUrl: './filtro-reporte.component.html',
  styleUrls: ['./filtro-reporte.component.scss']
})
export class FiltroReporteComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService:AlertaService,
    public finanzasService:FinanzasServiceService
  ) {}

  @Output() loading = new EventEmitter<boolean>();
  @Output() resultadoReporte = new EventEmitter<any>();


  data:any
  listaPrograma:any[]=[]
  listaAlumno:any[]=[]
  listaMatricula:any[]=[]
  listaEstado:any[]=[]

  // Variables usadas en el componente ------------------------------------------------------------------
  formGroupFiltro = this.formBuilder.group({
    fechaInicioRetiro:[null,Validators.required],
    fechaFinRetiro:[null,Validators.required],
    fechaInicioCrono:[null],
    fechaFinCrono:[null],
    idTipoDevolucion:[null],
    codigoMat:[null],
    idCentroCosto:[null],
    idAlumno:[null],
  });

  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.ObtenerEstadoPagoMatricula()
  }

  //--------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------
  


  //------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------

  ObtenerProgramaAutoComplete(programa:string){//programa Autocomplete
    this.integraService
    .postJsonResponse(constApiFinanzas.ObtenerPEspecificoPorCentroCosto, 
      {filtro: programa}
    )
    .subscribe({
      next: (response) => {
        this.listaPrograma = response.body
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
  ObtenerEstadoPagoMatricula(){//matricula Autocomplete
    this.integraService
    .getJsonResponse(constApiFinanzas.ObtenerEstadoPagoMatriculaDevoluciones)
    .subscribe({
      next: (response) => {
        this.listaEstado = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"obtener estado pago matricula")
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
  //------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------
  generarReporte(){
    if(this.formGroupFiltro.valid){
      this.loading.emit(true)
      let dataFiltro = this.formGroupFiltro.getRawValue()
      let envio={
        fechaInicio: datePipeTransform(dataFiltro.fechaInicioRetiro ,'yyyy-MM-ddT00:00:00','en-US'),
        fechaFin: datePipeTransform(dataFiltro.fechaFinRetiro ,'yyyy-MM-ddT23:59:00','en-US'),
        fechaInicioCronograma:  dataFiltro.fechaInicioCrono!=null?datePipeTransform(dataFiltro.fechaInicioCrono ,'yyyy-MM-ddT00:00:00','en-US'):null,
        fechaFinCronograma: dataFiltro.fechaFinCrono!=null? datePipeTransform(dataFiltro.fechaFinCrono ,'yyyy-MM-ddT23:59:00','en-US'):null,
        idCentroCosto: dataFiltro.idCentroCosto,
        idAlumno: dataFiltro.idAlumno,
        idMatricula: dataFiltro.codigoMat,
        estadoPago: dataFiltro.idTipoDevolucion=="Todos"?null:dataFiltro.idTipoDevolucion,
      }
      this.integraService
      .postJsonResponse(constApiFinanzas.ObtenerReporteDevoluciones,envio)
      .subscribe({
        next: (response) => {
          this.resultadoReporte.emit(response.body)
          this.loading.emit(false)
        },
        error: (error) => {
          this.loading.emit(false)
          this.finanzasService.MensajeDeError(error,"obtener reporte devolucion")
        },
        complete: () => {},
      });
    }
    else this.formGroupFiltro.markAllAsTouched()
  }
  //------------------------------------------------------------------------------------------------------
}
