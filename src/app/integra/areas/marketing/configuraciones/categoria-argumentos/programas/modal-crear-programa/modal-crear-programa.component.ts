import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { constApiMarketing } from '@environments/constApi';
import { ProgramaGeneralListado } from '@marketing/models/interfaces/categoria-argumentos';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-crear-programa',
  templateUrl: './modal-crear-programa.component.html',
  styleUrls: ['./modal-crear-programa.component.scss'],
})
export class ModalCrearProgramaComponent implements OnInit, OnDestroy {
  programasDisponibles: ProgramaGeneralListado[] = [];
  programasFiltrados: ProgramaGeneralListado[] = [];
  programaSeleccionado: ProgramaGeneralListado | null = null;
  isLoading: boolean = false;

  busquedaPrograma = new FormControl('');
  private busquedaSub!: Subscription;

  constructor(
    private dialogRef: MatDialogRef<ModalCrearProgramaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraService: IntegraService,
    private alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.cargarProgramasDisponibles();

    this.busquedaSub = this.busquedaPrograma.valueChanges.subscribe((valor) => {
      if (typeof valor === 'string') {
        const filtro = valor.toLowerCase();
        this.programasFiltrados = this.programasDisponibles.filter((p) =>
          p.nombre.toLowerCase().includes(filtro)
        );
        // Si el usuario borra el texto, limpiamos la selección
        if (!valor) {
          this.programaSeleccionado = null;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.busquedaSub?.unsubscribe();
  }

  cargarProgramasDisponibles(): void {
    this.isLoading = true;
    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerProgramasDisponiblesConfigurar}`)
      .subscribe({
        next: (data: any) => {
          this.programasDisponibles = data.body as ProgramaGeneralListado[];
          this.programasFiltrados = this.programasDisponibles;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar programas disponibles:', err);
          this.alertaService.notificationError('Error al cargar programas disponibles');
          this.isLoading = false;
        },
      });
  }

  displayNombrePrograma(programa: ProgramaGeneralListado): string {
    return programa?.nombre ?? '';
  }

  onProgramaSeleccionado(event: MatAutocompleteSelectedEvent): void {
    this.programaSeleccionado = event.option.value as ProgramaGeneralListado;
  }

  confirmarSeleccion(): void {
    if (!this.programaSeleccionado) {
      this.alertaService.notificationError('Seleccioná un programa');
      return;
    }
    this.dialogRef.close(this.programaSeleccionado);
  }

  cerrarModalCrearPrograma(): void {
    this.busquedaPrograma.setValue('', { emitEvent: false });
    this.dialogRef.close(null);
  }
}
