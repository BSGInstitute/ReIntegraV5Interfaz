import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { TipoSangreDTO } from '@gestionPersonas/models/fichaDatosPersonal';

@Component({
  selector: 'app-tab-informacion-medica',
  templateUrl: './tab-informacion-medica.component.html',
  styleUrls: ['./tab-informacion-medica.component.scss']
})
export class TabInformacionMedicaComponent implements OnInit {
  @Input() formDatosPersonal: FormGroup;
  @Input() gridPersonalInformacionMedica: KendoGrid = new KendoGrid();
  @Input() gridPersonalHistorialMedico: KendoGrid = new KendoGrid();
  @Input() DataTipoSangre: TipoSangreDTO[] = [];
  @Input() filterSettings: DropDownFilterSettings;

  constructor() {}

  ngOnInit(): void {}
}
