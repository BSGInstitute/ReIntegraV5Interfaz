import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';

@Component({
  selector: 'app-tab-experiencia-laboral',
  templateUrl: './tab-experiencia-laboral.component.html',
  styleUrls: ['./tab-experiencia-laboral.component.scss']
})
export class TabExperienciaLaboralComponent implements OnInit {
  @Input() gridPersonalExperiencia: KendoGrid = new KendoGrid();
  @Input() DataEmpresa: IComboBase1[] = [];
  @Input() DataArea: IComboBase1[] = [];
  @Input() DataCargo: IComboBase1[] = [];
  @Input() filterSettings: DropDownFilterSettings;
  @Input() virtual: any = { itemHeight: 28 };

  @Output() buscarArchivoMostrarEvent = new EventEmitter<number>();
  @Output() buscarArchivoDescargarEvent = new EventEmitter<number>();
  @Output() onFileSelectEvent = new EventEmitter<{ event: any; formGroup: FormGroup }>();

  constructor() {}

  ngOnInit(): void {}

  ObtenerNombreEmpresa(id: number): string {
    const busquedaEmpresa = this.DataEmpresa?.find(
      (empresa: any) => empresa.id === id
    );
    return busquedaEmpresa ? busquedaEmpresa.nombre : 'No se encontró';
  }

  ObtenerNombreAreadeEmpresa(id: number): string {
    const busquedaAreadeEmpresa = this.DataArea.find((x: any) => x.id == id);
    return busquedaAreadeEmpresa ? busquedaAreadeEmpresa.nombre : 'No encontro';
  }

  ObtenerNombreCargo(id: number): string {
    const busquedaCargo = this.DataCargo.find((x: any) => x.id == id);
    return busquedaCargo ? busquedaCargo.nombre : 'No encontro';
  }

  BuscarArchivoMostrar(idPersonalArchivo: number): void {
    this.buscarArchivoMostrarEvent.emit(idPersonalArchivo);
  }

  BuscarArchivoDescargar(idPersonalArchivo: number): void {
    this.buscarArchivoDescargarEvent.emit(idPersonalArchivo);
  }

  onFileSelect(event: any, formGroup: FormGroup): void {
    this.onFileSelectEvent.emit({ event, formGroup });
  }
}
