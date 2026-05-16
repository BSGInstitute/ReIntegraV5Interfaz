import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { constApiMarketing } from '@environments/constApi';
import { ProgramaConfiguradoDetalle } from '@marketing/models/interfaces/categoria-argumentos';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

interface DialogProps {
  idPrograma: number | null;
  programaCreado?: string;
}

@Component({
  selector: 'app-modal-editar-programa',
  templateUrl: './modal-editar-programa.component.html',
  styleUrls: ['./modal-editar-programa.component.scss'],
})
export class ModalEditarProgramaComponent implements OnInit {
  @Input() idPrograma: number | null = null;
  @Output() closeModal = new EventEmitter<void>();

  // Detalle de configuracion del programa
  isLoadingProgramaConfiguradoDetalle: boolean = false;
  programaConfiguradoDetalle: ProgramaConfiguradoDetalle | null = null;

  // Estado visual del panel expandido
  expandedCategoriaId: number | null = null;
  isRefreshing: boolean = false;

  // Modal para crear argumento
  showModalCrearArgumento: boolean = false;
  argumentoNombre: string = '';
  argumentoDescripcion: string = '';
  argumentoPrioridad: number | null = null;
  argumentoCategoriaId: number | null = null;
  argumentoIdEdit: number | null = null;
  isEditArgumento: boolean = false;
  isLoadingCrearArgumento: boolean = false;

  constructor(
    private integraService: IntegraService,
    private _alertaService: AlertaService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogProps
  ) {
    this.idPrograma = data.idPrograma;
  }

  ngOnInit(): void {
    console.log('ID PROGRAMA RECIBIDO:', this.idPrograma);
    this.obtenerProgramaConfiguradoDetalle();
  }

  obtenerProgramaConfiguradoDetalle(): void {
    this.isLoadingProgramaConfiguradoDetalle = true;
    this.isRefreshing = true;

    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerProgramaConfiguradoDetalle}/${this.idPrograma}`
      )
      .subscribe({
        next: (data: any) => {
          this.programaConfiguradoDetalle =
            data.body as ProgramaConfiguradoDetalle;
          this.isLoadingProgramaConfiguradoDetalle = false;
          this.isRefreshing = false;

          console.log(
            'Detalle Programa Configurado:',
            this.programaConfiguradoDetalle
          );
        },
        error: (err) => {
          console.error('Error fetching :', err);
          this._alertaService.notificationError('Error al obtener datos');
          this.isLoadingProgramaConfiguradoDetalle = false;
          this.isRefreshing = false;
        },
      });
  }

  onPanelClosed(categoriaId: number): void {
    if (!this.isRefreshing && this.expandedCategoriaId === categoriaId) {
      this.expandedCategoriaId = null;
    }
  }

  cerrarModal(): void {
    this.dialog.closeAll();
  }

  guardarArgumentoPorCategoria(): void {
    if (
      !this.idPrograma ||
      !this.argumentoCategoriaId ||
      !this.argumentoNombre?.trim() ||
      !this.argumentoDescripcion?.trim() ||
      !this.argumentoPrioridad
    ) {
      this._alertaService.notificationError('Complete todos los campos');
      return;
    }
    this.isLoadingCrearArgumento = true;
    if (this.isEditArgumento && this.argumentoIdEdit) {
      // Editar argumento existente
      const request = {
        IdArgumento: this.argumentoIdEdit,
        Nombre: this.argumentoNombre.trim(),
        Descripcion: this.argumentoDescripcion.trim(),
        Prioridad: this.argumentoPrioridad,
      };
      this.integraService
        .postJsonResponse(
          constApiMarketing.EditarArgumentoPorCategoria,
          request
        )
        .subscribe({
          next: (data: any) => {
            this._alertaService.mensajeIcon(
              '¡Actualizado!',
              'El argumento ha sido actualizado.',
              'success'
            );
            this.cerrarModalCrearArgumento();
            this.obtenerProgramaConfiguradoDetalle();
          },
          error: (err) => {
            this._alertaService.notificationError(
              'Error al actualizar argumento'
            );
            this.isLoadingCrearArgumento = false;
          },
        });
    } else {
      // Crear nuevo argumento
      const request = {
        IdProgramaConfigurado: this.idPrograma,
        IdCategoria: this.argumentoCategoriaId,
        Nombre: this.argumentoNombre.trim(),
        Prioridad: this.argumentoPrioridad,
        Descripcion: this.argumentoDescripcion.trim(),
      };
      this.integraService
        .postJsonResponse(
          constApiMarketing.AgregarArgumentoPorCategoria,
          request
        )
        .subscribe({
          next: (data: any) => {
            this._alertaService.mensajeIcon(
              '¡Creado!',
              'El argumento ha sido creado.',
              'success'
            );
            this.cerrarModalCrearArgumento();
            this.obtenerProgramaConfiguradoDetalle();
          },
          error: (err) => {
            this._alertaService.notificationError('Error al crear argumento');
            this.isLoadingCrearArgumento = false;
          },
        });
    }
  }

  eliminarArgumentoPorCategoria(idArgumento: number): void {
    Swal.fire({
      title: '¿Desea eliminar este argumento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoadingProgramaConfiguradoDetalle = true;
        const request = {
          idArgumento,
          idProgramaConfigurado: this.idPrograma,
        };

        this.integraService
          .postJsonResponse(
            `${constApiMarketing.EliminarArgumentoPorCategoria}`,
            request
          )
          .subscribe({
            next: (data: any) => {
              this._alertaService.mensajeIcon(
                '¡Eliminado!',
                'El registro ha sido eliminado.',
                'success'
              );
              this.obtenerProgramaConfiguradoDetalle();
            },
            error: (err) => {
              console.error('Error fetching :', err);
              this._alertaService.notificationError(
                'Error al eliminar argumento'
              );
            },
          });
      }
    });
  }

  abrirModalCrearArgumento(idCategoria: number): void {
    this.argumentoCategoriaId = idCategoria;
    this.argumentoNombre = '';
    this.argumentoDescripcion = '';
    this.argumentoPrioridad = null;
    this.argumentoIdEdit = null;
    this.isEditArgumento = false;
    this.showModalCrearArgumento = true;
  }

  abrirModalEditarArgumento(argumento: any, idCategoria: number): void {
    this.argumentoCategoriaId = idCategoria;
    this.argumentoNombre = argumento.nombre;
    this.argumentoDescripcion = argumento.descripcion;
    this.argumentoPrioridad = argumento.prioridad;
    this.argumentoIdEdit = argumento.id;
    this.isEditArgumento = true;
    this.showModalCrearArgumento = true;
  }
  cerrarModalCrearArgumento(): void {
    this.showModalCrearArgumento = false;
    this.argumentoCategoriaId = null;
    this.argumentoNombre = '';
    this.argumentoDescripcion = '';
    this.argumentoPrioridad = null;
    this.argumentoIdEdit = null;
    this.isEditArgumento = false;
    this.isLoadingCrearArgumento = false;
  }
}
