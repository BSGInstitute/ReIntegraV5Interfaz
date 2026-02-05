import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';

@Component({
  selector: 'app-tab-datos-personal',
  templateUrl: './tab-datos-personal.component.html',
  styleUrls: ['./tab-datos-personal.component.scss']
})
export class TabDatosPersonalComponent implements OnInit {
  @Input() formDatosPersonal: FormGroup;
  @Input() formPersonalSistemaPensionario: FormGroup;
  @Input() formPersonalSeguroSalud: FormGroup;
  @Input() formPersonalRemuneracion: FormGroup;
  @Input() DataTipoDocumento: IComboBase1[] = [];
  @Input() DataEstadoCivil: IComboBase1[] = [];
  @Input() DataSexo: IComboBase1[] = [];
  @Input() DataPais: IComboBase1[] = [];
  @Input() DataCiudad: IComboBase1[] = [];
  @Input() DataTipoVia: IComboBase1[] = [];
  @Input() DataTipoZonaUrbana: IComboBase1[] = [];
  @Input() DataSistemaPensionario: IComboBase1[] = [];
  @Input() DataEntidad: IComboBase1[] = [];
  @Input() DataEntidadSalud: IComboBase1[] = [];
  @Input() DataTipoPago: IComboBase1[] = [];
  @Input() DataEntidadFinanciera: IComboBase1[] = [];
  @Input() filterSettings: DropDownFilterSettings;

  constructor() {}

  ngOnInit(): void {}
}
