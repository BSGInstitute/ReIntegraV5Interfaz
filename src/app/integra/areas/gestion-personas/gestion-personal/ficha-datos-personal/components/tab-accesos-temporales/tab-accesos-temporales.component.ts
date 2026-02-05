import { KendoGrid } from './../../../../../../../shared/models/kendo-grid';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tab-accesos-temporales',
  templateUrl: './tab-accesos-temporales.component.html',
  styleUrls: ['./tab-accesos-temporales.component.scss']
})
export class TabAccesosTemporalesComponent implements OnInit {
  @Input() gridAccesoTemporal: KendoGrid = new KendoGrid();

  @Output() abrirModalAccesosEvent = new EventEmitter<void>();
  @Output() editarAccesoEvent = new EventEmitter<any>();
  @Output() eliminarAccesoEvent = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  abrirModalAccesos(): void {
    this.abrirModalAccesosEvent.emit();
  }

  editarAcceso(dataItem: any): void {
    this.editarAccesoEvent.emit(dataItem);
  }

  eliminarAcceso(dataItem: any): void {
    this.eliminarAccesoEvent.emit(dataItem);
  }
}
