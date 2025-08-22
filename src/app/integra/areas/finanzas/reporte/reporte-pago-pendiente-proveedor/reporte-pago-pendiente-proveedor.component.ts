import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';
const currentDate = new Date();

@Component({
  selector: 'app-reporte-pago-pendiente-proveedor',
  templateUrl: './reporte-pago-pendiente-proveedor.component.html',
  styleUrls: ['./reporte-pago-pendiente-proveedor.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ReportePagoPendienteProveedorComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public finanzasService:FinanzasServiceService,
  ) {}
  pageSizes: any = [5, 10, 20, 'All'];
  loader=false
  listaReporte:any[]=[]


  // formGroupFiltro = this.formBuilder.group({
  //   fechaInicio:[new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),Validators.required],
  //   fechaFin:[new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),Validators.required]
  // });

  ngOnInit(): void {
  }


  generarReporte(){
    this.loader=true
      this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteDocumentosPendientesPago,null
        ).subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response.body)
            response.body.forEach((e:any) => {
                e.fechaEmisionComprobante = e.fechaEmisionComprobante!=null?new Date(e.fechaEmisionComprobante):null
                e.fechaVencimientoComprobante = e.fechaVencimientoComprobante!=null?new Date(e.fechaVencimientoComprobante):null
            });
            this.listaReporte = response.body
            this.loader=false
          },
          error: (error) => {
            this.loader=false
            this.finanzasService.MensajeDeError(error, 'Obtener reporte pago pendiente proveedor');
          },
          complete: () => { },
        });
  }

}
