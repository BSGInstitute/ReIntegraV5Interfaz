import { ViewChild } from '@angular/core';
import { ModalEditarProgramaComponent } from './modal-editar-programa/modal-editar-programa.component';
import { ModalCrearProgramaComponent } from './modal-crear-programa/modal-crear-programa.component';
import { Component, OnInit } from '@angular/core';
import { constApiMarketing } from '@environments/constApi';
import { ProgramaGeneralListado } from '@marketing/models/interfaces/categoria-argumentos';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-programas',
  templateUrl: './programas.component.html',
  styleUrls: ['./programas.component.scss'],
})
export class ProgramasComponent implements OnInit {
  @ViewChild(ModalEditarProgramaComponent)

  // Grilla — muestra programas que tienen al menos un argumento activo (Estado = 1)
  listadoProgramasConfigurados: ProgramaGeneralListado[] = [];
  isLoading: boolean = false;

  // Filtro de la grilla
  filtroNombre: string = '';

  get programasFiltradosGrilla(): ProgramaGeneralListado[] {
    if (!this.filtroNombre.trim()) return this.listadoProgramasConfigurados;
    const filtro = this.filtroNombre.trim().toLowerCase();
    return this.listadoProgramasConfigurados.filter((p) =>
      p.nombre.toLowerCase().includes(filtro)
    );
  }

  // Modal Editar Programa
  modalEditarPrograma!: ModalEditarProgramaComponent;
  showModalEditarPrograma: boolean = false;

  constructor(
    private integraService: IntegraService,
    private _alertaService: AlertaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.obtenerProgramasConfigurados();
  }

  obtenerProgramasConfigurados(): void {
    this.isLoading = true;

    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerListadoProgramaConfigurado}`)
      .subscribe({
        next: (data: any) => {
          this.listadoProgramasConfigurados = data.body as ProgramaGeneralListado[];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching :', err);
          this._alertaService.notificationError('Error al obtener datos');
          this.isLoading = false;
        },
      });
  }

  recargarProgramasConfigurados(): void {
    this.obtenerProgramasConfigurados();
  }

  eliminarProgramaConfigurado(id: number): void {
    Swal.fire({
      title: '¿Desea eliminar la configuración de argumentos de este programa?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.integraService
          .postJsonResponse(
            `${constApiMarketing.EliminarProgramaConfigurado}`,
            id
          )
          .subscribe({
            next: (data: any) => {
              this._alertaService.mensajeIcon(
                '¡Eliminado!',
                'La configuración de argumentos ha sido eliminada.',
                'success'
              );
              this.obtenerProgramasConfigurados();
            },
            error: (err) => {
              console.error('Error fetching :', err);
              this._alertaService.notificationError(
                'Error al eliminar la configuración'
              );
              this.isLoading = false;
            },
          });
      }
    });
  }

  // Abrir modal Editar Programa (configurar argumentos del programa seleccionado)
  abrirModalEditarPrograma(id: number): void {
    const dialogRef = this.dialog.open(ModalEditarProgramaComponent, {
      data: {
        idPrograma: id,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.obtenerProgramasConfigurados();
    });
  }

  abrirModalAgregarPrograma(): void {
    const ref = this.dialog.open(ModalCrearProgramaComponent, {
      width: '600px',
    });

    ref.afterClosed().subscribe((programaSeleccionado: ProgramaGeneralListado | null) => {
      if (programaSeleccionado?.id) {
        this.abrirModalEditarPrograma(programaSeleccionado.id);
      }
    });
  }
}
