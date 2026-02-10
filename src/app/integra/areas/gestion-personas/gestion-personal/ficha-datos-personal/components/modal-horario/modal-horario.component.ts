import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-horario',
  templateUrl: './modal-horario.component.html',
  styleUrls: ['./modal-horario.component.scss']
})
export class ModalHorarioComponent implements OnInit {
  @Input() horarioForm: FormGroup;
  @Input() diasSemana: string[] = [];
  @Input() enProcesoSolicitud: boolean = false;

  @Output() guardarHorarioEvent = new EventEmitter<void>();
  @Output() cerrarModalEvent = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  guardarHorario(): void {
    this.guardarHorarioEvent.emit();
  }

  cerrarModal(): void {
    this.cerrarModalEvent.emit();
  }
}
