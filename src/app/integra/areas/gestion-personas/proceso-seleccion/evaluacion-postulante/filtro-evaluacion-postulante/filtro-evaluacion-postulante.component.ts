import { IClaveValor, IComboBase1 } from '@shared/models/interfaces/iglobal';
import { ProcesoSeleccionEtapa } from './../../../models/reporte-evaluacion-postulante';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';


@Component({
  selector: 'app-filtro-evaluacion-postulante',
  templateUrl: './filtro-evaluacion-postulante.component.html',
  styleUrls: ['./filtro-evaluacion-postulante.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FiltroEvaluacionPostulanteComponent {
  @Input() formFiltro: FormGroup = new FormGroup({});

  @Input() comboProcesoSeleccion: IComboBase1[] = [];
  @Input() comboEtapaProceso: ProcesoSeleccionEtapa[] = [];
  @Input() comboEstadoEtapa: IComboBase1[] = [];
  @Input() comboGrupoComparacion: IComboBase1[] = [];
  @Input() comboPostulante: IComboBase1[] = [];
  @Input() comboVersionCentil: IClaveValor[] = [];
  @Input() filterSettings: DropDownFilterSettings = {};
  @Input() btnBuscarDisabled = false;

  @Output() buscar = new EventEmitter<void>();
  @Output() filterChangePostulante = new EventEmitter<string>();
  @Output() changeFiltroPostulante = new EventEmitter<boolean>();
  @Output() valueChangeProcesoSeleccion = new EventEmitter<number>();

  onBuscar() {
    this.buscar.emit();
  }

  onFilterChangePostulante(value: string) {
    this.filterChangePostulante.emit(value);
  }

  onChangeFiltroPostulante(value: boolean) {
    this.changeFiltroPostulante.emit(value);
  }

  onValueChangeProcesoSeleccion(value: number) {
    this.valueChangeProcesoSeleccion.emit(value);
  }
}
