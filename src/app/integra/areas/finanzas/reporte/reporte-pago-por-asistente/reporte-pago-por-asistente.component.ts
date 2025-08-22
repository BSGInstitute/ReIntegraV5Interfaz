import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { ConfiguracionAgrupacionMatriculaComponent } from '@shared/components/configuracion-agrupacion-matricula/configuracion-agrupacion-matricula.component';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-reporte-pago-por-asistente',
  templateUrl: './reporte-pago-por-asistente.component.html',
  styleUrls: ['./reporte-pago-por-asistente.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportePagoPorAsistenteComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public finanzasService:FinanzasServiceService

  ) {}

  @ViewChild(ConfiguracionAgrupacionMatriculaComponent)
  private ConfiguracionAgrupacion: ConfiguracionAgrupacionMatriculaComponent;

  loader=false
  pageSizes: any = [5, 10, 20, 'All'];
  listaReporte:any[]=[]

  formGroupFiltro = this.formBuilder.group({
    fechaInicio:[null,Validators.required],
    fechaFin:[null,Validators.required]
  });

  ngOnInit(): void {
  }

  generarReporte(){
    if(this.formGroupFiltro.valid){
      let dataForm = this.formGroupFiltro.getRawValue()
      dataForm.fechaInicio = datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-ddT00:00:00.000', 'en-US');
      dataForm.fechaFin= datePipeTransform(dataForm.fechaFin, 'yyyy-MM-ddT23:59:59.000', 'en-US');
      let select = this.ConfiguracionAgrupacion.ObtenerSeleccionados()
      dataForm.IdsConfiguracion = select!=null?select.toString():null
      
      this.loader=true
      this.integraService.postJsonResponse(constApiFinanzas.ObtenerReportePagoPorAsistente,dataForm
        ).subscribe({
          next: (response: HttpResponse<any>) => {
            response.body.forEach((e:any)=>{
              e.fechaVencimiento = e.fechaVencimiento!=null?new Date(e.fechaVencimiento):e.fechaVencimiento,
              e.fechaPago= e.fechaPago!=null?new Date(e.fechaPago):e.fechaPago
            })
            this.listaReporte = response.body
            console.log(this.listaReporte)
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
