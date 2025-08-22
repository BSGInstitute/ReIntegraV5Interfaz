import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';

const currentDate = new Date();


@Component({
  selector: 'app-reporte-pagos-proveedores',
  templateUrl: './reporte-pagos-proveedores.component.html',
  styleUrls: ['./reporte-pagos-proveedores.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportePagosProveedoresComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public finanzasService:FinanzasServiceService,
  ) {}
  pageSizes: any = [5, 10, 20, 'All'];
  loader=false
  listaReporte:any[]=[]


  formGroupFiltro = this.formBuilder.group({
    fechaInicio:[new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),Validators.required],
    fechaFin:[new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),Validators.required]
  });

  ngOnInit(): void {
  }


  generarReporte(){
    if(this.formGroupFiltro.valid){
      let dataForm = this.formGroupFiltro.getRawValue()
      let envio={
        fechaInicio:datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-ddT00:00:00.000', 'en-US'),
        fechaFin:datePipeTransform(dataForm.fechaFin, 'yyyy-MM-ddT23:59:00.000', 'en-US')
      }
      this.loader=true
      this.integraService.postJsonResponse(constApiFinanzas.ObtenerReportePagos,envio
        ).subscribe({
          next: (response: HttpResponse<any>) => {
            response.body.forEach((e:any) => {
                e.fechaEmision = e.fechaEmision!=null?new Date(e.fechaEmision):null
                e.fechaVencimiento = e.fechaVencimiento!=null?new Date(e.fechaVencimiento):null
                e.fechaPagoBanco = e.fechaPagoBanco!=null?new Date(e.fechaPagoBanco):null
            });
            this.listaReporte = response.body
            this.loader=false
          },
          error: (error) => {
            this.loader=false
            this.finanzasService.MensajeDeError(error, 'Obtener reporte pago proveedor');
          },
          complete: () => { },
        });
    }
    else this.formGroupFiltro.markAllAsTouched()
  }

}
