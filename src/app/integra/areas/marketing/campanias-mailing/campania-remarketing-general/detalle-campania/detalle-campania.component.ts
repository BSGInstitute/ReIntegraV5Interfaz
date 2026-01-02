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
  @Input() id: number | null = null;
  @Output() close = new EventEmitter<void>();

  detalleCampania: any = null;
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
    if (changes['id'] && changes['id'].currentValue) {
      this.ObtenerDetallesCampaniaRemarketing(changes['id'].currentValue);
    }
  }

  ObtenerDetallesCampaniaRemarketing(id: number) {
    this.isLoading = true;
    this.detalleCampania = null;
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.VerDetallesCampaniaRemarketing}/${id}`
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

  verMensaje(idAlumno: number) {
    this.mensajeLoading = true;
    this.mensajeContenido = null;
    this.mensajeModalOpen = true;
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerMensajeGeneradoPorId}/${idAlumno}`
      )
      .subscribe({
        next: (data: any) => {
          this.mensajeContenido = data.body?.contenido || 'Sin contenido';
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

  reenviarMensaje(idAlumno: number) {
    this.reenviandoId = idAlumno;
    this.integraService
      .postJsonResponse(
        `${constApiMarketing.ReenviarMensajeGenerado}`,
        idAlumno
      )
      .subscribe({
        next: () => {
          this.reenviandoId = null;
          this.alertaService.mensajeIcon(
            '¡Reenviado!',
            'El mensaje fue reenviado.',
            'success'
          );
        },
        error: (err) => {
          this.reenviandoId = null;
          this.alertaService.notificationError('Error al reenviar mensaje');
        },
      });
  }

  get porcentajeAperturas(): string {
    if (!this.detalleCampania || !this.detalleCampania.programados) return '-';
    return (
      (
        (this.detalleCampania.aperturas / this.detalleCampania.programados) *
        100
      ).toFixed(1) + '%'
    );
  }
  get porcentajeClicks(): string {
    if (!this.detalleCampania || !this.detalleCampania.programados) return '-';
    return (
      (
        (this.detalleCampania.clicks / this.detalleCampania.programados) *
        100
      ).toFixed(1) + '%'
    );
  }
  get porcentajeRebotados(): string {
    if (!this.detalleCampania || !this.detalleCampania.programados) return '-';
    return (
      (
        (this.detalleCampania.rebotados / this.detalleCampania.programados) *
        100
      ).toFixed(1) + '%'
    );
  }
}
