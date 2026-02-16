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
          this.rendimiento = data.body;
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
