import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { constApiMarketing } from '@environments/constApi';
import { ProgramaGeneral } from '@marketing/models/interfaces/categoria-argumentos';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-modal-crear-programa',
  templateUrl: './modal-crear-programa.component.html',
  styleUrls: ['./modal-crear-programa.component.scss'],
})
export class ModalCrearProgramaComponent implements OnInit {
  isLoadingModalCrearPrograma: boolean = false;
  isLoadingProgramaGeneral: boolean = false;
  listadoProgramaGeneral: ProgramaGeneral[] = [];
  nombrePrograma: string = '';
  programasFiltrados: ProgramaGeneral[] = [];
  programaSeleccionado: ProgramaGeneral | null = null;

  constructor(
    private dialogRef: MatDialogRef<ModalCrearProgramaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.obtenerProgramaGeneralValidos();
  }

  obtenerProgramaGeneralValidos(): void {
    this.isLoadingProgramaGeneral = true;
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerListadoProgramaGeneralValido}`
      )
      .subscribe({
        next: (data: any) => {
          this.listadoProgramaGeneral = data.body as ProgramaGeneral[];
          this.programasFiltrados = this.listadoProgramaGeneral;
          this.isLoadingProgramaGeneral = false;
        },
        error: (err) => {
          console.error('Error fetching :', err);
          this._alertaService.notificationError('Error al obtener datos');
          this.isLoadingProgramaGeneral = false;
        },
      });
  }

  filtrarProgramas(valor: string): void {
    const filtro = valor ? valor.toLowerCase() : '';
    this.programasFiltrados = this.listadoProgramaGeneral.filter((p) =>
      p.nombre.toLowerCase().includes(filtro)
    );
    const match = this.listadoProgramaGeneral.find((p) => p.nombre === valor);
    this.programaSeleccionado = match ? match : null;
  }
  validarProgramaSeleccionado(): void {
    const match = this.listadoProgramaGeneral.find(
      (p) => p.nombre === this.nombrePrograma
    );
    if (match) {
      this.programaSeleccionado = match;
    } else {
      this.programaSeleccionado = null;
      this.nombrePrograma = '';
    }
  }

  crearProgramaConfigurado(): void {
    if (!this.programaSeleccionado) {
      this._alertaService.notificationError(
        'Debe seleccionar un programa válido'
      );
      return;
    }
    this.isLoadingModalCrearPrograma = true;
    const request = {
      IdProgramaGeneral: this.programaSeleccionado.id,
      nombre: this.programaSeleccionado.nombre,
    };
    this.integraService
      .postJsonResponse(constApiMarketing.CrearProgramaConfigurado, request)
      .subscribe({
        next: (data: any) => {
          this._alertaService.notificationSuccess(
            'Programa creado exitosamente'
          );
          const idProgramaCreado = data.body;
          this.dialogRef.close(idProgramaCreado);
        },
        error: (err) => {
          this._alertaService.notificationError('Error al crear el programa');
          this.isLoadingModalCrearPrograma = false;
        },
      });
  }

  cerrarModalCrearPrograma(): void {
    this.dialogRef.close();
  }
}
