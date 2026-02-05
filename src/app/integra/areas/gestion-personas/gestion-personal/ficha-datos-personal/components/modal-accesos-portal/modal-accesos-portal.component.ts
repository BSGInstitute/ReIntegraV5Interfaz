import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import {
  AccesosPortal,
  ProgramasAsignadosAccesosPortalDTO,
  CursosAsignadosAccesosPortalDTO
} from '@gestionPersonas/models/fichaDatosPersonal';

@Component({
  selector: 'app-modal-accesos-portal',
  templateUrl: './modal-accesos-portal.component.html',
  styleUrls: ['./modal-accesos-portal.component.scss']
})
export class ModalAccesosPortalComponent implements OnInit {
  @Input() formConfigurarAccesos: FormGroup;
  @Input() DataPEspecificosPersonal: AccesosPortal;
  @Input() DataPEspecificosPersonalProgramaAsignado: ProgramasAsignadosAccesosPortalDTO[] = [];
  @Input() DataPEspecificosPersonalCursosAsignados: CursosAsignadosAccesosPortalDTO[] = [];
  @Input() filterSettings: DropDownFilterSettings;
  @Input() enProcesoSolicitud: boolean = false;
  @Input() isNew: boolean = true;

  @Output() guardarAccesoTemporalEvent = new EventEmitter<void>();
  @Output() actualizarAccesoTemporalEvent = new EventEmitter<void>();
  @Output() cerrarModalEvent = new EventEmitter<void>();
  @Output() onProgramSelectionChangeEvent = new EventEmitter<number | null>();

  constructor() {}

  ngOnInit(): void {}

  onProgramSelectionChange(selectedProgramId: number | null): void {
    this.onProgramSelectionChangeEvent.emit(selectedProgramId);
  }

  guardarAccesos(): void {
    this.guardarAccesoTemporalEvent.emit();
  }
  actualizarAccesos():void{
    this.actualizarAccesoTemporalEvent.emit();
  }

  cerrarModal(): void {
    this.cerrarModalEvent.emit();
  }
}
