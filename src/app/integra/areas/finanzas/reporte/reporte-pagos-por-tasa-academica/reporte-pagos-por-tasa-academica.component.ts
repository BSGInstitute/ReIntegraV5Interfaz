import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-reporte-pagos-por-tasa-academica',
  templateUrl: './reporte-pagos-por-tasa-academica.component.html',
  styleUrls: ['./reporte-pagos-por-tasa-academica.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportePagosPorTasaAcademicaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public finanzasService:FinanzasServiceService
  ) {}

  loader=false
  pageSizes: any = [5, 10, 20, 'All'];

  listaPrograma:any[]=[]
  listaAlumno:any[]=[]
  listaMatricula:any[]=[]
  listaConceptoTasa:any[]=[]
  listaReporte:any[]=[]
  formGroupFiltro = this.formBuilder.group({
    fechaInicio:[null,Validators.required],
    fechaFin:[null,Validators.required],
    idCentroCosto:null,
    idAlumno:null,
    idMatricula:null,
    concepto:null,
  });

  ngOnInit(): void {
  }

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

  // ObtenerConceptoTasa(concepto:string){//matricula Autocomplete
  //   this.integraService
  //   .postJsonResponse(constApiFinanzas.ObtenerDetalleTasasAcademicas, 
  //     {valor: concepto}
  //   )
  //   .subscribe({
  //     next: (response) => {
  //       this.listaConceptoTasa = response.body
  //     },
  //     error: (error) => {
  //       this.finanzasService.MensajeDeError(error,"autocomplete - Concepto tasa")
  //     },
  //     complete: () => {},
  //   });
  // }

  ObtenercomboConcepto(nombre:string){//programa Autocomplete
    this.integraService
    .getJsonResponse(constApiFinanzas.ObtenercomboConcepto+'/'+nombre )
    .subscribe({
      next: (response) => {
        this.listaConceptoTasa = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"autocomplete - Concepto tasa")
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
  filterConceptoTasa(event:any){//Autocomplete de Tasa
    event= event.trim()
    if(event.length>=4)this.ObtenercomboConcepto(event)
    else this.listaConceptoTasa=[]
  }

  generarReporte(){
    if(this.formGroupFiltro.valid){
      let dataForm = this.formGroupFiltro.getRawValue()
      dataForm.fechaInicio = datePipeTransform(dataForm.fechaInicio , 'yyyy-MM-ddT00:00:00.000', 'en-US');
      dataForm.fechaFin = datePipeTransform(dataForm.fechaFin , 'yyyy-MM-ddT23:59:59.000', 'en-US');
      this.loader=true
      this.integraService.postJsonResponse(constApiFinanzas.ObtenerReportePagosTasasAcademicas,dataForm
        ).subscribe({
          next: (response: HttpResponse<any>) => {
            response.body.forEach((e:any)=>{
              e.fechaPago = e.fechaPago!=null?new Date(e.fechaPago):e.fechaPago
            })
            this.listaReporte = response.body
            this.loader=false
          },
          error: (error) => {
            this.loader=false
            this.finanzasService.MensajeDeError(error, 'Obtener reporte pagos por tasas academicas');
          },
          complete: () => { },
        });
    }
    else this.formGroupFiltro.markAllAsTouched()
  }
}
