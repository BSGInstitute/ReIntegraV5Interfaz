import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-crear-editar-campania',
  templateUrl: './crear-editar-campania.component.html',
  styleUrls: ['./crear-editar-campania.component.scss'],
})
export class CrearEditarCampaniaComponent implements OnInit {
  envioSeleccionado: 'ahora' | 'programar' = 'ahora';
  formularioValido = false;

  constructor(
    public dialogRef: MatDialogRef<CrearEditarCampaniaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  cerrar(): void {
    this.dialogRef.close();
  }

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  tiposSeleccionados: string[] = ['Promocional', 'Informativa'];
  logicasSeleccionadas: string[] = [];
  argumentosSeleccionados: string[] = [];

  addTipo(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tiposSeleccionados.push(value);
    }
    event.chipInput!.clear();
  }

  removeTipo(tipo: string): void {
    const index = this.tiposSeleccionados.indexOf(tipo);
    if (index >= 0) {
      this.tiposSeleccionados.splice(index, 1);
    }
  }

  addLogica(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.logicasSeleccionadas.push(value);
    }
    if (event.chipInput) {
      event.chipInput.clear();
    }
  }

  removeLogica(logica: string): void {
    const index = this.logicasSeleccionadas.indexOf(logica);
    if (index >= 0) {
      this.logicasSeleccionadas.splice(index, 1);
    }
  }

  addArg(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.argumentosSeleccionados.push(value);
    }
    if (event.chipInput) {
      event.chipInput.clear();
    }
  }

  removeArg(arg: string): void {
    const index = this.argumentosSeleccionados.indexOf(arg);
    if (index >= 0) {
      this.argumentosSeleccionados.splice(index, 1);
    }
  }
}
