import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { Parametro } from '@shared/models/parametro';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte-control-documento',
  templateUrl: './reporte-control-documento.component.html',
  styleUrls: ['./reporte-control-documento.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReporteControlDocumentoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService:AlertaService,
    public finanzasService:FinanzasServiceService,
    private cdr: ChangeDetectorRef
  ) {}
  
  loader=false
  dataReporte:any[]=[]
  checkedTemp=""

  // Variables usadas en el componente ------------------------------------------------------------------
  
  estadoControl=new FormControl(null);
  pageSizes: any = [5, 10, 20, 'All'];

  listaAsesor:any[]=[]
  listaCordinador:any[]=[]
  itemsAsesor:any[]=[]
  itemsCordinador:any[]=[]
  listaMatricula:any[]=[]
  listaPrograma:any[]=[]
  listaAlumno:any[]=[]

  listaEstado:any[]=[
    {id:1,nombre:'pormatricular'},
    {id:2,nombre:'matriculado'}
  ]
  
  formGroupFiltro = this.formBuilder.group({
    fechaInicio:[null,Validators.required],
    fechaFin:[null,Validators.required],
    idCoordinador:[null,Validators.required],
    idAsesor:[null,Validators.required],
    idCentroCosto:[null,Validators.required],
    idAlumno:[null,Validators.required],
    idMatricula:[null,Validators.required],
  });

  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.formGroupFiltro.disable()
    this.ObtenerCoordinadorAutcomplete()
    this.ObtenerAsesorPorApellidosAutocomplete()
  }
  //--------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------
 

  //------------------------------------------------------------------------------------------------------
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

  ObtenerCoordinadorAutcomplete(){//asesor Autocomplete
    this.integraService
    .getJsonResponse(constApiFinanzas.ObtenerCoordinadorPorApellidos)
    .subscribe({
      next: (response) => {
        this.listaCordinador = response.body
        this.listaCordinador.push({id:126,nombreCompleto:"Ninguno Ninguno"})

      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"combo - coordinador")
      },
      complete: () => {},
    });
  }

  ObtenerAsesorPorApellidosAutocomplete(){//asesor Autocomplete
    this.integraService
    .getJsonResponse(constApiFinanzas.ObtenerAsesorPorApellidos)
    .subscribe({
      next: (response) => {
        this.listaAsesor = response.body

      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"combo - asesor")
      },
      complete: () => {},
    });
  }

  generarReporte(){
    let dataForm = this.formGroupFiltro.getRawValue()
    dataForm.IdEstadoPagoMatricula = this.estadoControl.value
    dataForm.fechaInicio = this.checkedTemp=='fecha'?datePipeTransform(dataForm.fechaInicio ,'yyyy-MM-ddT00:00:00','en-US'):null,
    dataForm.fechaFin = this.checkedTemp=='fecha'?datePipeTransform(dataForm.fechaFin ,'yyyy-MM-ddT23:59:00','en-US'):null
    this.loader=true
    this.integraService
      .postJsonResponse(constApiFinanzas.ObtenerReporteControlDocumentos,dataForm)
      .subscribe({
        next: (response) => {
          response.body.forEach((element:any) => {
            element.fechaEntregaDocumento = element.fechaEntregaDocumento!=null ?new Date(element.fechaEntregaDocumento):element.fechaEntregaDocumento
            element.fechaPrimerPago = element.fechaPrimerPago!=null ?new Date(element.fechaPrimerPago):element.fechaPrimerPago

          });
          this.dataReporte = response.body
          this.loader=false
        },
        error: (error) => {
          this.loader=false
          this.finanzasService.MensajeDeError(error,"obtener reporte control de documebtos")
        },
        complete: () => {},
      });
  }

  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------
   

  disblebForm(control: string) {
    this.formGroupFiltro.disable();
    this.formGroupFiltro.reset();
    
    if (control !== "fecha") {
      this.formGroupFiltro.get(control).enable();
    } else {
      this.formGroupFiltro.get('fechaInicio').enable();
      this.formGroupFiltro.get('fechaFin').enable();
    }
    this.checkedTemp = control;
    this.cdr.detectChanges()
  }

  filterAsesor(event:any){//Autocomplete de Asesor
    event= event.trim()
    if(event.length>=4)this.itemsAsesor = this.listaAsesor.filter(
      (s) => s.nombreCompleto.toLowerCase().indexOf(event.toLowerCase()) !== -1)
  }
  filterCordinador(event:any){//Autocomplete de Coordinador
    event= event.trim()
    if(event.length>=4)this.itemsCordinador = this.listaCordinador.filter(
      (s) => s.nombreCompleto.toLowerCase().indexOf(event.toLowerCase()) !== -1)
  }

  filterCodigoMat(event:any){//Autocomplete de Matricula
    event= event.trim()
    if(event.length>=4)this.ObtenerMatriculaAutoComplete(event)
    else this.listaMatricula=[]
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

  validarFitro(){
    if(this.checkedTemp!=""){
      let valido=false
      if(this.checkedTemp!="fecha"){
        if(this.formGroupFiltro.get(this.checkedTemp).valid){
          valido=true
        }
        else this.formGroupFiltro.get(this.checkedTemp).markAllAsTouched()
      }
      else{
        if(this.formGroupFiltro.get('fechaInicio').valid && this.formGroupFiltro.get('fechaFin').valid){
          valido=true
        }
        else {
          this.formGroupFiltro.get('fechaInicio').markAllAsTouched()
          this.formGroupFiltro.get('fechaFin').markAllAsTouched()

          } 
      }
      if(valido==true){
        this.generarReporte()
      }
    }
    else Swal.fire("Filtros no seleccionados!","Selecciona un filtro he ingresa datos!","warning")
  }
}
