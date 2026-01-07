import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { constApiMarketing } from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-programas',
  templateUrl: './programas.component.html',
  styleUrls: ['./programas.component.scss'],
})
export class ProgramasComponent implements OnInit {
  // Grilla
  listadoCategorias: any[] = [];
  isLoading: boolean = false;

  // Modal Crear/Editar Programa
  showModalPrograma: boolean = false;
  editProgramaId: number | null = null;
  nombrePrograma: string = '';

  // Programa General para el modal
  isLoadingProgramaGeneral: boolean = false;
  listadoProgramaGeneral: ProgramaGeneral[] = [];
  programasFiltrados: ProgramaGeneral[] = [];

  // Mock de categorías de argumentos para la vista de argumentos por programa
  categoriasArgumentos = [
    {
      nombre: 'Calidad académica del programa',
      argumentos: [
        {
          argumento: 'Cobertura integral y actualizada',
          prioridad: 1,
          sustento:
            'El plan de estudios combina enfoques predictivos, ágiles y híbridos alineados con la última edición del PMBOK, abordando desde los fundamentos a la gestión avanzada.',
        },
        {
          argumento: 'Metodología ExTech Learning®',
          prioridad: 2,
          sustento:
            'La propuesta utiliza gamificación, simuladores, y otros patrones de aprendizaje activo para reforzar la aplicación práctica y el aprendizaje colaborativo.',
        },
        {
          argumento: 'Docentes de alto nivel con experiencia regional',
          prioridad: 3,
          sustento:
            'Los instructores son profesionales certificados por el PMI (PMP y PMI-RMP) con décadas de experiencia liderando proyectos en Latinoamérica.',
        },
      ],
    },
    {
      nombre: 'Certificación',
      argumentos: [
        {
          argumento: 'Triple certificación con reconocimiento internacional',
          prioridad: 1,
          sustento:
            'Los graduados obtienen un certificado de participación del programa (110 PDUs) y certificación institucional de BSG Institute, con la opción de rendir por PMI Test completo.',
        },
        {
          argumento: 'Valor de la certificación PMP®',
          prioridad: 2,
          sustento:
            'El PMI informa que los profesionales con certificación PMP® ganan hasta 25% más salario que sus pares no certificados, y en Colombia la membresía incluye beneficios adicionales.',
        },
        {
          argumento: 'Certificación institucional de BSG Institute',
          prioridad: 3,
          sustento:
            'Como ATP autorizado por PMI, BSG Institute es una de las pocas entidades latinoamericanas que otorgan 110 PDUs y cuenta con certificación ISO 9001.',
        },
      ],
    },
    {
      nombre: 'Confianza',
      argumentos: [
        {
          argumento: 'Alto índice de satisfacción de egresados',
          prioridad: 1,
          sustento:
            'Más del 95% de los egresados recomiendan el programa por su aplicabilidad y soporte docente.',
        },
      ],
    },
    {
      nombre: 'Reducción del riesgo',
      argumentos: [
        {
          argumento: 'Metodología de gestión de riesgos',
          prioridad: 1,
          sustento:
            'El programa incluye módulos específicos para la identificación, análisis y mitigación de riesgos en proyectos.',
        },
      ],
    },
  ];

  constructor(
    private integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.obtenerProgramasConfigurados();
    this.obtenerProgramaGeneralValidos();
    this.programasFiltrados = this.listadoProgramaGeneral;
  }

  obtenerProgramasConfigurados(): void {
    this.isLoading = true;

    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerListadoProgramaConfigurado}`)
      .subscribe({
        next: (data: any) => {
          this.listadoCategorias = data.body as any[];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching :', err);
          this._alertaService.notificationError('Error al obtener datos');
          this.isLoading = false;
        },
      });
  }

  guardarCategoria(): void {
    // if (!this.categoriaNombre?.trim()) return;
    // this.isLoadingModal = true;
    // if (this.isEditMode && this.categoriaIdEdit != null) {
    //   // Editar
    //   this.integraService
    //     .postJsonResponse(constApiMarketing.EditarProgramaConfigurado, {
    //       id: this.categoriaIdEdit,
    //       nombre: this.categoriaNombre.trim(),
    //     })
    //     .subscribe({
    //       next: (data: any) => {
    //         this._alertaService.mensajeIcon(
    //           '¡Actualizado!',
    //           'La categoría ha sido actualizada.',
    //           'success'
    //         );
    //         this.cerrarModal();
    //         this.obtenerProgramasConfigurados();
    //       },
    //       error: (err) => {
    //         this._alertaService.notificationError(
    //           'Error al actualizar categoría'
    //         );
    //         this.isLoadingModal = false;
    //       },
    //     });
    // } else {
    //   // Crear
    //   this.integraService
    //     .postJsonResponse(constApiMarketing.CrearProgramaConfigurado, {
    //       nombre: this.categoriaNombre.trim(),
    //     })
    //     .subscribe({
    //       next: (data: any) => {
    //         this._alertaService.mensajeIcon(
    //           '¡Creado!',
    //           'La categoría ha sido creada.',
    //           'success'
    //         );
    //         this.cerrarModal();
    //         this.obtenerProgramasConfigurados();
    //       },
    //       error: (err) => {
    //         this._alertaService.notificationError('Error al crear categoría');
    //         this.isLoadingModal = false;
    //       },
    //     });
    // }
  }

  eliminarProgramaConfigurado(id: number): void {
    Swal.fire({
      title: '¿Desea eliminar este programa?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        // this.integraService
        //   .postJsonResponse(
        //     `${constApiMarketing.EliminarProgramaConfigurado}`,
        //     id
        //   )
        //   .subscribe({
        //     next: (data: any) => {
        //       this._alertaService.mensajeIcon(
        //         '¡Eliminado!',
        //         'El registro ha sido eliminado.',
        //         'success'
        //       );
        //       this.obtenerProgramasConfigurados();
        //     },
        //     error: (err) => {
        //       console.error('Error fetching :', err);
        //       this._alertaService.notificationError(
        //         'Error al eliminar categoria'
        //       );
        //       this.isLoading = false;
        //     },
        //   });
      }
    });
  }

  recargarProgramasConfigurados(): void {
    this.obtenerProgramasConfigurados();
  }

  // Fetch de PROGRAMAS GENERALES válidos para el modal
  obtenerProgramaGeneralValidos(): void {
    this.isLoadingProgramaGeneral = true;

    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerListadoProgramaGeneralValido}`
      )
      .subscribe({
        next: (data: any) => {
          this.listadoProgramaGeneral = data.body as ProgramaGeneral[];
          this.isLoadingProgramaGeneral = false;
        },
        error: (err) => {
          console.error('Error fetching :', err);
          this._alertaService.notificationError('Error al obtener datos');
          this.isLoadingProgramaGeneral = false;
        },
      });
  }

  //Filtros para PROGRAMAS GENERALES en el modal
  filtrarProgramas(valor: string): void {
    const filtro = valor ? valor.toLowerCase() : '';
    this.programasFiltrados = this.listadoProgramaGeneral.filter((p) =>
      p.nombre.toLowerCase().includes(filtro)
    );
  }
  validarProgramaSeleccionado(): void {
    if (
      !this.listadoProgramaGeneral.some((p) => p.nombre === this.nombrePrograma)
    ) {
      this.nombrePrograma = '';
    }
  }

  abrirModalNuevoPrograma() {
    this.showModalPrograma = true;
    this.editProgramaId = null;
    this.nombrePrograma = '';
    console.log('creando');
  }
  abrirModalEditarPrograma(id: number) {
    this.showModalPrograma = true;
    this.editProgramaId = id;
    console.log('editando id:', id);
  }
  cerrarModalPrograma() {
    this.showModalPrograma = false;
    this.editProgramaId = null;
    this.nombrePrograma = '';
  }
}

interface ProgramaGeneral {
  id: number;
  nombre: string;
}
