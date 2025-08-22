import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-reporte-comprobantes',
  templateUrl: './reporte-comprobantes.component.html',
  styleUrls: ['./reporte-comprobantes.component.scss'],
})
export class ReporteComprobantesComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public finanzasService: FinanzasServiceService
  ) {}

  ngOnInit(): void {
    this.ObtenerTipoAsociado();
  }

  listaReporte: any = [];
  pageSizes: any = [5, 10, 20, 'All'];
  loader = false;
  tipo: any;
  listTipoAsociado: any = [];

  ObtenerTipoAsociado() {
    this.loader = true;
    this.integraService
      .obtener(constApiFinanzas.ObtenerTipoAsociado)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.listTipoAsociado = response.body;
          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
          this.finanzasService.MensajeDeError(
            error,
            'Obtener reporte pago pendiente proveedor'
          );
        },
        complete: () => {},
      });
  }

  generarReporte() {
    var id = {
      Id: this.tipo.id,
    };
    this.loader = true;
    this.integraService
      .postJsonResponse(constApiFinanzas.ObtenerReporteComprobantes, id)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.listaReporte = response.body;
          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
          this.finanzasService.MensajeDeError(
            error,
            'Obtener reporte pago pendiente proveedor'
          );
        },
        complete: () => {},
      });
  }
}
