import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { ReportePostulanteMatricula } from '@gestionPersonas/models/reporte-evaluacion-postulante';

@Component({
  selector: 'app-reporte-curso-asesor-capacitacion',
  templateUrl: './reporte-curso-asesor-capacitacion.component.html',
  styleUrls: ['./reporte-curso-asesor-capacitacion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReporteCursoAsesorCapacitacionComponent {
  @Input() gridCursoAsesorCapacitacion: KendoGrid<ReportePostulanteMatricula>;
  @Input() showReporteAsesorCapacitacion = false;
  @Input() loadingReporteAsesorCapacitacion = false;

  @Output() confirmarReestablecerEnviar =
    new EventEmitter<ReportePostulanteMatricula>();

  onConfirmarReestablecerEnviar(dataItem: ReportePostulanteMatricula) {
    this.confirmarReestablecerEnviar.emit(dataItem);
  }
}
