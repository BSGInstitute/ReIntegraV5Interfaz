import { ViewChild } from '@angular/core';
import { ModalEditarProgramaComponent } from './modal-editar-programa/modal-editar-programa.component';
import { Component, OnInit } from '@angular/core';
import { constApiMarketing } from '@environments/constApi';
import { ProgramaConfigurado } from '@marketing/models/interfaces/categoria-argumentos';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ModalCrearProgramaComponent } from './modal-crear-programa/modal-crear-programa.component';

@Component({
  selector: 'app-programas',
  templateUrl: './programas.component.html',
  styleUrls: ['./programas.component.scss'],
})
export class ProgramasComponent implements OnInit {
  @ViewChild(ModalEditarProgramaComponent)

  // Grilla
  listadoProgramasConfigurados: ProgramaConfigurado[] = [];
  isLoading: boolean = false;

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
          this.listadoProgramasConfigurados =
            data.body as ProgramaConfigurado[];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching :', err);
          this._alertaService.notificationError('Error al obtener datos');
          this.isLoading = false;
        },
      });
  }

  // crearProgramaConfigurado(): void {
  //   if (!this.programaSeleccionado) {
  //     this._alertaService.notificationError(
  //       'Debe seleccionar un programa válido'
  //     );
  //     return;
  //   }

  //   this.isLoadingModalCrearPrograma = true;
  //   const request = {
  //     IdProgramaGeneral: this.programaSeleccionado.id,
  //     nombre: this.programaSeleccionado.nombre,
  //   };

  //   this.integraService
  //     .postJsonResponse(constApiMarketing.CrearProgramaConfigurado, request)
  //     .subscribe({
  //       next: (data: any) => {
  //         this._alertaService.notificationSuccess(
  //           'Programa creado exitosamente'
  //         );
  //         this.cerrarModalCrearPrograma();
  //         this.recargarProgramasConfigurados();
  //         this.abrirModalEditarPrograma(
  //           data.body,
  //           true,
  //           this.programaSeleccionado.nombre
  //         );
  //       },
  //       error: (err) => {
  //         this._alertaService.notificationError('Error al crear el programa');
  //         this.isLoadingModalCrearPrograma = false;
  //       },
  //     });
  // }
  recargarProgramasConfigurados(): void {
    this.obtenerProgramasConfigurados();
  }

  eliminarProgramaConfigurado(id: number): void {
    Swal.fire({
      title: '¿Desea eliminar este programa?',
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
                'El registro ha sido eliminado.',
                'success'
              );
              this.obtenerProgramasConfigurados();
            },
            error: (err) => {
              console.error('Error fetching :', err);
              this._alertaService.notificationError(
                'Error al eliminar categoria'
              );
              this.isLoading = false;
            },
          });
      }
    });
  }

  // Abrir y cerrar modal Crear Programa
  abrirModalCrearPrograma(): void {
    const dialogRef = this.dialog.open(ModalCrearProgramaComponent, {
      width: '600px',
      data: {},
    });
    dialogRef.afterClosed().subscribe((idProgramaCreado) => {
      if (idProgramaCreado) {
        this.recargarProgramasConfigurados();
        this.abrirModalEditarPrograma(idProgramaCreado);
      }
    });
  }

  // Abrir modal Editar Programa
  abrirModalEditarPrograma(id: number): void {
    const dialogRef = this.dialog.open(ModalEditarProgramaComponent, {
      data: {
        idPrograma: id,
      },
    });
  }
}
