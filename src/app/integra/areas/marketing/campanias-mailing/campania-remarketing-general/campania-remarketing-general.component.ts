import { Component, OnInit } from '@angular/core';
import { constApiMarketing } from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

interface CampaniaRemarketingGeneral {
  id: number;
  nombreCampania: string;
  tipoCampania: string;
  usuarioCreacion: string;
  fechaEnvio: Date;
  cantidad: string;
}

@Component({
  selector: 'app-campania-remarketing-general',
  templateUrl: './campania-remarketing-general.component.html',
  styleUrls: ['./campania-remarketing-general.component.scss'],
})
export class CampaniaRemarketingGeneralComponent implements OnInit {
  listadoRemarketingGeneral: CampaniaRemarketingGeneral[] = [];
  isLoading: boolean = true;

  constructor(
    private integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.ObtenerListadoRemarketingGeneral();
  }

  ObtenerListadoRemarketingGeneral() {
    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerListadoRemarketingGeneral}`)
      .subscribe({
        next: (data: any) => {
          this.listadoRemarketingGeneral =
            data.body as CampaniaRemarketingGeneral[];

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching :', err);
          this._alertaService.notificationError('Error al obtener datos');
          this.isLoading = false;
        },
      });

    // Paginacion
  }

  CrearNuevaCampania() {}

  VerRendimiento() {}

  VerDetalleCampania(id: number) {}

  ActualizarCampania(id: number) {}

  EliminarCampania(id: number) {}
}
