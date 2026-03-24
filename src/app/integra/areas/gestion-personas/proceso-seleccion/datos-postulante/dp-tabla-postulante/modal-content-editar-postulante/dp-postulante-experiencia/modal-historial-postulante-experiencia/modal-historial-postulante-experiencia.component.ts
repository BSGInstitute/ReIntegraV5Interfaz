import {
  ComboCentroEstudio,
  HistorialPostulanteExperiencia,
} from './../../../../../../models/DatosPostulante';
import { ComboPostulante } from '@gestionPersonas/models/DatosPostulante';
import { DatosDelPostulanteService } from '@gestionPersonas/services/datos-del-postulante.service';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';

@Component({
  selector: 'app-modal-historial-postulante-experiencia',
  templateUrl: './modal-historial-postulante-experiencia.component.html',
  styleUrls: ['./modal-historial-postulante-experiencia.component.scss'],
})
export class ModalHistorialPostulanteExperienciaComponent implements OnInit {
  @Input() datosPostulanteService: DatosDelPostulanteService;
  //@Input() postulante: DatosPostulante;
  @Input() comboPostulante: ComboPostulante;
  @Input() centroEstudios: ComboCentroEstudio[];

  gridHistorialPostulanteExperiencia =
    new KendoGrid<HistorialPostulanteExperiencia>();
  HistorialPostulanteExperiencia: HistorialPostulanteExperiencia[];

  public pageSize = 5;
  public buttonCount = 2;
  public sizes = [10, 20, 50];

  private _subscriptions$ = new Subscription();

  constructor(
    private sanitizer: DomSanitizer,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private _alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.traerhistorialPostulanteFormacion();
    this.loadingTabla();
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }

  traerhistorialPostulanteFormacion() {
    const datosHistorial$ = this.datosPostulanteService
      .getHistorialPostulanteExperiencia()
      .subscribe({
        next: (data) => {
          this.gridHistorialPostulanteExperiencia.data = data;
          this.HistorialPostulanteExperiencia = data;
          console.log(data);
        },
        error: (error) => {
          this._alertaService.mensajeError(error);
        },
      });
    this._subscriptions$.add(datosHistorial$);
  }

  loadingTabla() {
    const loading$ = this.datosPostulanteService
      .getLoadingHistorialTabla()
      .subscribe({
        next: (success) => {
          this.gridHistorialPostulanteExperiencia.loading = success;
        },
        error: (error) => {
          this._alertaService.mensajeError(error);
        },
      });
    this._subscriptions$.add(loading$);
  }

  SanitizedHTML(value: string): SafeHtml {
    if (!value) {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }


}
