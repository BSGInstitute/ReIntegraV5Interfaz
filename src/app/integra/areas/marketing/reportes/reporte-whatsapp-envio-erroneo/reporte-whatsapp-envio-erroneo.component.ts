import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import { faLastfmSquare } from '@fortawesome/free-brands-svg-icons';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-reporte-whatsapp-envio-erroneo',
  templateUrl: './reporte-whatsapp-envio-erroneo.component.html',
  styleUrls: ['./reporte-whatsapp-envio-erroneo.component.scss']
})
export class ReporteWhatsappEnvioErroneoComponent implements OnInit {

  constructor(
   private integraService: IntegraService,
   private alertaService: AlertaService,
  ) { }


  loader= false;
  fechaInicio = new FormControl(null);
  fechaFin = new FormControl(null);
  listaGrilla : any=[];

  pageSizes: any = [ 5, 10, 20, 'All' ];
  gridReporteWhatsAppErroneo: KendoGrid = new KendoGrid();
  ngOnInit(): void {
  }

  obtenerGrilalRegistroLandingPage() {
    this.loader = true;
    this.gridReporteWhatsAppErroneo.loading = true;

    let filtro = {
      fechaInicial: this.fechaInicio.value,
      fechaFinal: this.fechaFin.value,
      skip: this.gridReporteWhatsAppErroneo.gridState.skip,
      take: this.gridReporteWhatsAppErroneo.gridState.take,
    };
    this.integraService
      .postJsonResponse(
        constApiMarketing.ObtenerReporteMensajesEnviadosErroneos,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          console.log(resp.body);
          this.loader = false;
          this.listaGrilla = resp.body
          this.gridReporteWhatsAppErroneo.data = resp.body;
          this.gridReporteWhatsAppErroneo.loading = false;
          console.log(this.gridReporteWhatsAppErroneo)
          // this.cargarGrilla()

        },
        error: (error) => {
          this.loader = false;
          this.alertaService.notificationError(error.message);
        },
      });
  }

  BuscarPorFiltro() {
    this.loader = true
    this.gridReporteWhatsAppErroneo.loading = true;
    this.gridReporteWhatsAppErroneo.gridState.skip = 0;
    this.obtenerGrilalRegistroLandingPage();
  }

}
