import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { constApiMarketing } from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-grafica-rendimiento',
  templateUrl: './grafica-rendimiento.component.html',
  styleUrls: ['./grafica-rendimiento.component.scss'],
})
export class GraficaRendimientoComponent implements OnInit {
  @Input() selectedCampanias: number[] = [];
  @Output() close = new EventEmitter<void>();

  rendimiento: any;
  isLoading: boolean = false;

  constructor(
    private integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.ObtenerRendimiento();
  }

  ObtenerRendimiento() {
    this.isLoading = true;
    this.integraService
      .postJsonResponse(
        `${constApiMarketing.ObtenerRendimientoListadoCampanias}`,
        this.selectedCampanias
      )
      .subscribe({
        next: (data: any) => {
          // this.rendimiento = data.body;

          this.rendimiento = {
            capacidadEntrega: {
              labels: [
                '2025-12-01',
                '2025-12-02',
                '2025-12-03',
                '2025-12-04',
                '2025-12-05',
              ],
              enviados: [100, 120, 110, 130, 125],
              rebotados: [5, 8, 6, 7, 6],
              rechazados: [2, 1, 3, 2, 1],
              totalEnviados: 585,
              totalEntregados: 570,
              porcentajeEnviadosCorrectos: 97.4,
            },
            tasas: {
              labels: [
                '2025-12-01',
                '2025-12-02',
                '2025-12-03',
                '2025-12-04',
                '2025-12-05',
              ],
              abiertos: [60, 70, 65, 80, 75],
              clicks: [20, 25, 22, 30, 28],
              tasaApertura: 68.4,
              cantidadApertura: 400,
              tasaClicks: 22.2,
              cantidadClicks: 130,
            },
          };

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching :', err);
          this._alertaService.notificationError('Error al obtener datos');
          this.isLoading = false;
        },
      });
  }
}
