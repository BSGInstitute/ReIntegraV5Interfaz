import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { areaTrabajoDTO } from '@gestionPersonas/models/fichaDatosPersonal';

@Component({
  selector: 'app-tab-informacion-puesto',
  templateUrl: './tab-informacion-puesto.component.html',
  styleUrls: ['./tab-informacion-puesto.component.scss']
})
export class TabInformacionPuestoComponent implements OnInit {
  @Input() formDatosPersonal: FormGroup;
  @Input() formPersonalDescanso: FormGroup;
  @Input() formPersonalCese: FormGroup;
  @Input() gridAreasDeTrabajo: KendoGrid = new KendoGrid();
  @Input() gridTipoAsesorHistorico: KendoGrid = new KendoGrid();
  @Input() gridJefeInmediatoHistorico: KendoGrid = new KendoGrid();
  @Input() gridPeriodoInactivoHistorico: KendoGrid = new KendoGrid();
  @Input() DataAreaTrabajo: areaTrabajoDTO[] = [];
  @Input() DataPuestoTrabajo: IComboBase1[] = [];
  @Input() DataJefeInmediato: IComboBase1[] = [];
  @Input() DataSede: IComboBase1[] = [];
  @Input() DataPuestoTrabajoNivel: IComboBase1[] = [];
  @Input() DataEstado: any[] = [];
  @Input() DataTipoEstado: IComboBase1[] = [];
  @Input() DataMotivoCese: IComboBase1[] = [];
  @Input() filterSettings: DropDownFilterSettings;
  @Input() valorEstado: boolean = true;
  @Input() valorTipoEstado: boolean = true;
  @Input() valorTipoEstado2: boolean = true;

  @Output() obtenerEstadoEvent = new EventEmitter<any>();
  @Output() obtenerTipoEstadoEvent = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  ObtenerEstado(id: any): void {
    this.obtenerEstadoEvent.emit(id);
  }

  ObtenerTipoEstado(id: any): void {
    this.obtenerTipoEstadoEvent.emit(id);
  }
}
