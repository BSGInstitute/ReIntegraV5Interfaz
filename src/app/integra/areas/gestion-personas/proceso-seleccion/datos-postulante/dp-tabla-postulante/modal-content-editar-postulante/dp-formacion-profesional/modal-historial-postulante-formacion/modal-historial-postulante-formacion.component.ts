import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  ComboCentroEstudio,
  ComboPostulante,
  DatosPostulante,
  HistorialPostulanteFormacion,
} from '@gestionPersonas/models/DatosPostulante';
import { DatosDelPostulanteService } from '@gestionPersonas/services/datos-del-postulante.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-historial-postulante-formacion',
  templateUrl: './modal-historial-postulante-formacion.component.html',
  styleUrls: ['./modal-historial-postulante-formacion.component.scss'],
})
export class ModalHistorialPostulanteFormacionComponent implements OnInit {
  @Input() datosPostulanteService: DatosDelPostulanteService;
  //@Input() postulante: DatosPostulante;
  @Input() comboPostulante: ComboPostulante;
  @Input() centroEstudios: ComboCentroEstudio[];

  gridHistorialPostulanteFormacion =
    new KendoGrid<HistorialPostulanteFormacion>();
  HistorialPostulanteFormacion: HistorialPostulanteFormacion[];

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
      .getHistorialPostulanteFormacion()
      .subscribe({
        next: (data) => {
          this.gridHistorialPostulanteFormacion.data = data;
          this.HistorialPostulanteFormacion = data;
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
          this.gridHistorialPostulanteFormacion.loading = success;
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
