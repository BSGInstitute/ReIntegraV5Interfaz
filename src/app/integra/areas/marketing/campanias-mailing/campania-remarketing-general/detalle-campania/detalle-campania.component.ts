import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { constApiMarketing } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { DetallesCampania } from '@marketing/models/interfaces/campania-remarketing-general';

@Component({
  selector: 'app-detalle-campania',
  templateUrl: './detalle-campania.component.html',
  styleUrls: ['./detalle-campania.component.scss'],
})
export class DetalleCampaniaComponent implements OnInit, OnChanges {
  @Input() idCampania: number | null = null;
  @Input() identificadorLlamadaIA: string | null = null;
  @Output() close = new EventEmitter<void>();

  detalleCampania: DetallesCampania;
  isLoading: boolean = false;

  mensajeContenido: string | null = null;
  mensajeModalOpen: boolean = false;
  mensajeLoading: boolean = false;
  reenviandoId: number | null = null;

  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idCampania'] && changes['idCampania'].currentValue) {
      this.ObtenerDetallesCampaniaRemarketing(changes['idCampania'].currentValue);
    }
  }

  ObtenerDetallesCampaniaRemarketing(idCampania: number) {
    this.isLoading = true;
    this.detalleCampania = null;
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.VerDetallesCampaniaRemarketing}/${idCampania}`
      )
      .subscribe({
        next: (data: any) => {
          this.detalleCampania = data.body as DetallesCampania;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching detalle campaña:', err);
          this.alertaService.notificationError(
            'Error al obtener detalles de la campaña'
          );
          this.isLoading = false;
        },
      });
  }

  verUltimoMensaje(idAlumno: number) {
    this.mensajeLoading = true;
    this.mensajeContenido = null;
    this.mensajeModalOpen = true;
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerMensajeGeneradoPorId}/${this.identificadorLlamadaIA}/${idAlumno}`
      )
      .subscribe({
        next: (data: any) => {
          this.mensajeContenido = data.body[0]?.contenido || 'Sin contenido';
          this.mensajeLoading = false;
        },
        error: (err) => {
          this.mensajeContenido = 'Error al obtener mensaje';
          this.mensajeLoading = false;
        },
      });
  }

  cerrarMensajeModal() {
    this.mensajeModalOpen = false;
    this.mensajeContenido = null;
  }

  // reenviarMensaje(idAlumno: number) {
  //   this.reenviandoId = idAlumno;
  //   const request = {
  //     identificadorLlamadaIA: this.identificadorLlamadaIA,
  //     idAlumno
  //   };

  //   this.integraService
  //     .postJsonResponse(
  //       `${constApiMarketing.ReenviarMensajeGenerado}`,
  //       request
  //     )
  //     .subscribe({
  //       next: () => {
  //         this.reenviandoId = null;
  //         this.alertaService.mensajeIcon(
  //           '¡Reenviado!',
  //           'El mensaje fue reenviado.',
  //           'success'
  //         );
  //       },
  //       error: (err) => {
  //         this.reenviandoId = null;
  //         this.alertaService.notificationError('Error al reenviar mensaje');
  //       },
  //     });
  // }

  get porcentajeAbiertos(): string {
    if (!this.detalleCampania || !this.detalleCampania.totalMensajes) return '-';
    return (
      (
        (this.detalleCampania.abiertos / this.detalleCampania.totalMensajes) *
        100
      ).toFixed(1) + '%'
    );
  }
  get porcentajeEnviados(): string {
    if (!this.detalleCampania || !this.detalleCampania.totalMensajes) return '-';
    return (
      (
        (this.detalleCampania.enviados / this.detalleCampania.totalMensajes) *
        100
      ).toFixed(1) + '%'
    );
  }
  get porcentajeRebotados(): string {
    if (!this.detalleCampania || !this.detalleCampania.totalMensajes) return '-';
    return (
      (
        (this.detalleCampania.rebotados / this.detalleCampania.totalMensajes) *
        100
      ).toFixed(1) + '%'
    );
  }
}
