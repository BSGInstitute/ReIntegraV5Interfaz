import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';

@Component({
  selector: 'app-tab-formacion',
  templateUrl: './tab-formacion.component.html',
  styleUrls: ['./tab-formacion.component.scss']
})
export class TabFormacionComponent implements OnInit {
  @Input() gridPersonalFormacion: KendoGrid = new KendoGrid();
  @Input() gridPersonalInformatica: KendoGrid = new KendoGrid();
  @Input() gridPersonalIdiomas: KendoGrid = new KendoGrid();
  @Input() DataFormacion: IComboBase1[] = [];
  @Input() DataTipoEstudio: IComboBase1[] = [];
  @Input() DataAreaFormacion: IComboBase1[] = [];
  @Input() DataEstadoEstudio: IComboBase1[] = [];
  @Input() DataNivelCompetenciaTecnica: IComboBase1[] = [];
  @Input() DataIdioma: IComboBase1[] = [];
  @Input() DataNivelIdioma: IComboBase1[] = [];
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

  ObtenerNombreTipoEstudio(id: number): string {
    const busquedaTipoEstudio = this.DataTipoEstudio.find((x: any) => x.id == id);
    return busquedaTipoEstudio ? busquedaTipoEstudio.nombre : 'No encontro';
  }

  ObtenerNombreAreaFormacion(id: number): string {
    const busquedaAreaFormacion = this.DataAreaFormacion.find(
      (x: any) => x.id == id
    );
    return busquedaAreaFormacion ? busquedaAreaFormacion.nombre : 'No encontro';
  }

  ObtenerNombreEstadoEstudio(id: number): string {
    const busquedaEstadoEstudio = this.DataEstadoEstudio.find(
      (x: any) => x.id == id
    );
    return busquedaEstadoEstudio ? busquedaEstadoEstudio.nombre : 'No encontro';
  }

  ObtenerNombreNivelCompetenciaTecnica(id: number | null): string {
    if (id === null || id === undefined || id === 0) {
      return '-Seleccione Nivel-';
    }

    const busquedaNivelCompetenciaTecnica = this.DataNivelCompetenciaTecnica.find(
      (x: any) => Number(x.id) === Number(id)
    );

    return busquedaNivelCompetenciaTecnica
      ? busquedaNivelCompetenciaTecnica.nombre
      : 'No encontró';
  }

  ObtenerNombreIdioma(id: number): string {
    const busquedaIdioma = this.DataIdioma.find((x: any) => x.id == id);
    return busquedaIdioma ? busquedaIdioma.nombre : 'No encontro';
  }

  ObtenerNombreNivelIdioma(id: number): string {
    const busquedaNivelIdioma = this.DataNivelIdioma.find((x: any) => x.id == id);
    return busquedaNivelIdioma ? busquedaNivelIdioma.nombre : 'No encontro';
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
