import { Component, Input, OnInit } from '@angular/core';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';

@Component({
  selector: 'app-tab-datos-familiares',
  templateUrl: './tab-datos-familiares.component.html',
  styleUrls: ['./tab-datos-familiares.component.scss']
})
export class TabDatosFamiliaresComponent implements OnInit {
  @Input() gridPersonalFamiliar: KendoGrid = new KendoGrid();
  @Input() DataParentesco: IComboBase1[] = [];
  @Input() DataSexo: IComboBase1[] = [];
  @Input() DataTipoDocumento: IComboBase1[] = [];
  @Input() filterSettings: DropDownFilterSettings;
  @Input() virtual: any = { itemHeight: 28 };

  constructor() {}

  ngOnInit(): void {}

  ObtenerNombreParentesco(id: number): string {
    const busquedaParentesco = this.DataParentesco.find((x: any) => x.id == id);
    return busquedaParentesco ? busquedaParentesco.nombre : 'No encontro';
  }

  ObtenerNombreSexo(id: number): string {
    const busquedaSexo = this.DataSexo.find((x: any) => x.id == id);
    return busquedaSexo ? busquedaSexo.nombre : 'No encontro';
  }

  ObtenerNombreTipoDocumento(id: number): string {
    const busquedaTipoDocumento = this.DataTipoDocumento.find(
      (x: any) => x.id == id
    );
    return busquedaTipoDocumento ? busquedaTipoDocumento.nombre : 'No encontro';
  }
}
