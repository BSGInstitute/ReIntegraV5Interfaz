import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-crear-editar-campania',
  templateUrl: './crear-editar-campania.component.html',
  styleUrls: ['./crear-editar-campania.component.scss'],
})
export class CrearEditarCampaniaComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CrearEditarCampaniaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  cerrar(): void {
    this.dialogRef.close();
  }
}
