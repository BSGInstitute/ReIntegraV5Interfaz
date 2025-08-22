import { HttpResponse } from '@angular/common/http';
import { AlertaService } from '../../../../../../shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Component, Input, OnInit } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { constApiPlanificacion } from '@environments/constApi';
import { PageSizeItem } from '@progress/kendo-angular-treelist';

//*Gretel Canasa*//

interface IReporteConsultasForoDetalleAulaVirtual {
  idForoCurso: number;
  idForoRespuesta: number;
  docente: string;
  tema: string;
  respuesta: string;
  usuarioRespuesta: string;
  codigoMatricula: string;
  fechaRespuesta: string;
  horaRespuesta: string;
  centroCosto: string;
  nombrePrograma: string;
  nombreCoordinadora: string;
}

@Component({
  selector: 'app-consulta-foro-aula-virtual-hijo-detalle',
  templateUrl: './consulta-foro-aula-virtual-hijo-detalle.component.html',
  styleUrls: ['./consulta-foro-aula-virtual-hijo-detalle.component.scss'],
})
export class ConsultaForoAulaVirtualHijoDetalleComponent implements OnInit {
  gridDetalles = new KendoGrid();

  @Input() public idForo: number;
  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  constructor(
    private alertaService: AlertaService,
    private IntegraService: IntegraService
  ) {}

  ngOnInit(): void {
    this.obtener();
  }

  obtener(): void {
    this.gridDetalles.loading = true;
    this.IntegraService.getJsonResponse(
      `${constApiPlanificacion.ReporteConsultasForoAulaVirtualObtenerDetalleForo}/${this.idForo}`
    ).subscribe({
      next: (resp: HttpResponse<IReporteConsultasForoDetalleAulaVirtual[]>) => {
        this.gridDetalles.loading = false;
        this.gridDetalles.data = resp.body;
      },
      error: (error) => {
        this.gridDetalles.loading = false;
        let mensaje = this.alertaService.getMessageErrorService(error);
        this.alertaService.notificationWarning(mensaje);
      },
    });
  }

  eliminar(id: number) {
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.gridDetalles.loading = true;
        this.IntegraService.deleteJsonResponse(
          `${constApiPlanificacion.ReporteConsultasForoAulaVirtualEliminarForoRespuesta}/${id}`
        ).subscribe({
          next: (resp: HttpResponse<boolean>) => {
            console.log(resp.body);
            this.gridDetalles.loading = false;
            if (resp.body) {
              this.alertaService.mensajeIcon(
                '¡Eliminado!',
                'El registro ha sido eliminado.',
                'success'
              );
              this.obtener();
            }
          },
          error: (error) => {
            this.gridDetalles.loading = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          },
        });
      }
    });
  }
}
