import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';

@Component({
  selector: 'app-tab-certificaciones',
  templateUrl: './tab-certificaciones.component.html',
  styleUrls: ['./tab-certificaciones.component.scss']
})
export class TabCertificacionesComponent implements OnInit {
  @Input() gridPersonalCertificacion: KendoGrid = new KendoGrid();
  @Input() DataFormacion: IComboBase1[] = [];
  @Input() filterSettings: DropDownFilterSettings;

  @Output() buscarArchivoMostrarEvent = new EventEmitter<number>();
  @Output() buscarArchivoDescargarEvent = new EventEmitter<number>();
  @Output() onFileSelectEvent = new EventEmitter<{ event: any; formGroup: FormGroup }>();

  constructor() {}

  ngOnInit(): void {}

  ObtenerNombreFormacion(id: number): string {
    const busquedaFormacion = this.DataFormacion.find((x: any) => x.id == id);
    return busquedaFormacion ? busquedaFormacion.nombre : 'No encontro';
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
