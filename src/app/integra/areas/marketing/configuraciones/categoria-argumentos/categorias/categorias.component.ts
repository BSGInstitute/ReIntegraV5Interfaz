import { Component, OnInit } from '@angular/core';
import { constApiMarketing } from '@environments/constApi';
import { CategoriaArgumento } from '@marketing/models/interfaces/categoria-argumentos';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent implements OnInit {
  listadoCategorias: CategoriaArgumento[] = [];
  isLoading: boolean = false;

  // Modal control
  showModal: boolean = false;
  isEditMode: boolean = false;
  isLoadingModal: boolean = false;
  categoriaNombre: string = '';
  categoriaIdEdit: number | null = null;

  constructor(
    private integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias(): void {
    this.isLoading = true;

    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerListadoCategoriaArgumento}`)
      .subscribe({
        next: (data: any) => {
          this.listadoCategorias = data.body as CategoriaArgumento[];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching :', err);
          this._alertaService.notificationError('Error al obtener datos');
          this.isLoading = false;
        },
      });
  }

  crearCategoriaArgumento(): void {
    this.isEditMode = false;
    this.categoriaNombre = '';
    this.categoriaIdEdit = null;
    this.showModal = true;
  }

  editarCategoria(id: number): void {
    const categoria = this.listadoCategorias.find((c) => c.id === id);
    if (!categoria) return;
    this.isEditMode = true;
    this.categoriaNombre = categoria.nombre;
    this.categoriaIdEdit = id;
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.categoriaNombre = '';
    this.categoriaIdEdit = null;
    this.isLoadingModal = false;
  }

  guardarCategoria(): void {
    if (!this.categoriaNombre?.trim()) return;

    this.isLoadingModal = true;

    if (this.isEditMode && this.categoriaIdEdit != null) {
      // Editar
      this.integraService
        .postJsonResponse(constApiMarketing.EditarCategoriaArgumento, {
          id: this.categoriaIdEdit,
          nombre: this.categoriaNombre.trim(),
        })
        .subscribe({
          next: (data: any) => {
            this._alertaService.mensajeIcon(
              '¡Actualizado!',
              'La categoría ha sido actualizada.',
              'success'
            );
            this.cerrarModal();
            this.obtenerCategorias();
          },
          error: (err) => {
            this._alertaService.notificationError(
              'Error al actualizar categoría'
            );
            this.isLoadingModal = false;
          },
        });
    } else {
      // Crear
      this.integraService
        .postJsonResponse(constApiMarketing.CrearCategoriaArgumento, {
          nombre: this.categoriaNombre.trim(),
        })
        .subscribe({
          next: (data: any) => {
            this._alertaService.mensajeIcon(
              '¡Creado!',
              'La categoría ha sido creada.',
              'success'
            );
            this.cerrarModal();
            this.obtenerCategorias();
          },
          error: (err) => {
            this._alertaService.notificationError('Error al crear categoría');
            this.isLoadingModal = false;
          },
        });
    }
  }

  eliminarCategoria(id: number): void {
    Swal.fire({
      title: '¿Desea eliminar esta categoria?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.integraService
          .postJsonResponse(
            `${constApiMarketing.EliminarCategoriaArgumento}`,
            id
          )
          .subscribe({
            next: (data: any) => {
              this._alertaService.mensajeIcon(
                '¡Eliminado!',
                'El registro ha sido eliminado.',
                'success'
              );
              this.obtenerCategorias();
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

  recargarCategorias(): void {
    this.obtenerCategorias();
  }
}
