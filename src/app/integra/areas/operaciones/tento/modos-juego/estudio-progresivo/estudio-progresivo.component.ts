import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';
import { constApiOperaciones } from '@environments/constApi';
import Swal from 'sweetalert2';

// --- Interfaces ---
interface BsgTentoArea {
  id: number;
  nombre: string;
  descripcion: string;
}

interface BsgTentoUnidad {
  id: number;
  titulo: string;
  descripcion: string;
  orden: number;
}

interface BsgTentoPaso {
  id: number;
  idPGeneral: number;
  nombrePGeneral: string;
  titulo: string;
  descripcion: string;
  orden: number;
}

interface BsgTentoCombo {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-estudio-progresivo',
  templateUrl: './estudio-progresivo.component.html',
  styleUrls: ['./estudio-progresivo.component.scss']
})
export class EstudioProgresivoComponent implements OnInit {

  @ViewChild('modalGestionPasos') modalGestionPasos: TemplateRef<any>;

  // ===== ÁREAS =====
  areas: BsgTentoArea[] = [];
  loaderAreas = false;

  // ===== UNIDADES =====
  expandedAreaIds: number[] = [];
  areaSeleccionada: BsgTentoArea = null;
  unidades: BsgTentoUnidad[] = [];
  loaderUnidades = false;
  modoFormUnidad: 'nuevo' | 'editar' | null = null;
  unidadSeleccionada: BsgTentoUnidad = null;
  formUnidad = { titulo: '', descripcion: '' };
  loaderGuardarUnidad = false;
  ordenCambiadoUnidades = false;
  loaderOrdenUnidades = false;

  // ===== PASOS =====
  unidadParaPasos: BsgTentoUnidad = null;
  pasos: BsgTentoPaso[] = [];
  loaderPasos = false;
  comboProgramas: BsgTentoCombo[] = [];
  modalRefPasos: NgbModalRef = null;
  modoFormPaso: 'nuevo' | 'editar' | null = null;
  pasoSeleccionado: BsgTentoPaso = null;
  formPaso = { idPGeneral: null as number | null, titulo: '', descripcion: '' };
  loaderGuardarPaso = false;
  ordenCambiadoPasos = false;
  loaderOrdenPasos = false;

  // Toast reutilizable (mismo patrón del proyecto)
  toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  constructor(
    private integraService: IntegraService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.cargarAreas();
  }

  // ===== HELPERS DE ALERTA =====

  private alertaExito(mensaje: string): void {
    this.toast.fire({ icon: 'success', title: mensaje });
  }

  private alertaError(mensaje: string): void {
    Swal.fire({ icon: 'error', title: 'Error', text: mensaje });
  }

  private alertaWarning(titulo: string, mensaje: string): void {
    Swal.fire({ icon: 'warning', title: titulo, text: mensaje });
  }

  private confirmar(titulo: string, callback: () => void): void {
    Swal.fire({
      title: titulo,
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  }

  // ===== ÁREAS =====

  cargarAreas(): void {
    this.loaderAreas = true;
    this.integraService.getJsonResponse(constApiOperaciones.MaestroBsgTentoObtenerAreasConRuta)
      .subscribe({
        next: (resp: HttpResponse<BsgTentoArea[]>) => {
          this.areas = resp.body || [];
          this.loaderAreas = false;
        },
        error: () => {
          this.loaderAreas = false;
        }
      });
  }

  // ===== UNIDADES =====

  onDetailExpand(event: any): void {
    // Solo una área expandida a la vez
    this.expandedAreaIds = [event.dataItem.id];
    this.areaSeleccionada = event.dataItem;
    this.modoFormUnidad = null;
    this.ordenCambiadoUnidades = false;
    this.unidades = [];
    this.cargarUnidades(event.dataItem.id);
    this.cargarComboProgramas(event.dataItem.id);
  }

  onDetailCollapse(event: any): void {
    this.expandedAreaIds = [];
    this.areaSeleccionada = null;
    this.modoFormUnidad = null;
    this.unidades = [];
    this.ordenCambiadoUnidades = false;
  }

  cargarUnidades(idArea: number): void {
    this.loaderUnidades = true;
    this.integraService.getJsonResponse(
      `${constApiOperaciones.MaestroBsgTentoObtenerUnidadesPorArea}/${idArea}`
    ).subscribe({
      next: (resp: HttpResponse<BsgTentoUnidad[]>) => {
        this.unidades = resp.body || [];
        this.loaderUnidades = false;
      },
      error: () => {
        this.loaderUnidades = false;
      }
    });
  }

  mostrarFormNuevaUnidad(): void {
    this.modoFormUnidad = 'nuevo';
    this.unidadSeleccionada = null;
    this.formUnidad = { titulo: '', descripcion: '' };
  }

  editarUnidad(unidad: BsgTentoUnidad): void {
    this.modoFormUnidad = 'editar';
    this.unidadSeleccionada = unidad;
    this.formUnidad = { titulo: unidad.titulo, descripcion: unidad.descripcion };
  }

  cancelarFormUnidad(): void {
    this.modoFormUnidad = null;
    this.unidadSeleccionada = null;
    this.formUnidad = { titulo: '', descripcion: '' };
  }

  guardarUnidad(): void {
    if (!this.formUnidad.titulo?.trim() || !this.formUnidad.descripcion?.trim()) {
      this.alertaWarning('Campos requeridos', 'Título y descripción son obligatorios');
      return;
    }

    this.loaderGuardarUnidad = true;

    if (this.modoFormUnidad === 'nuevo') {
      const body = {
        idAreaCapacitacion: this.areaSeleccionada.id,
        titulo: this.formUnidad.titulo,
        descripcion: this.formUnidad.descripcion,
        orden: this.unidades.length + 1
      };
      this.integraService.postJsonResponse(constApiOperaciones.MaestroBsgTentoInsertarUnidad, body)
        .subscribe({
          next: () => {
            this.loaderGuardarUnidad = false;
            this.cancelarFormUnidad();
            this.cargarUnidades(this.areaSeleccionada.id);
            this.alertaExito('Unidad creada correctamente');
          },
          error: (err: any) => {
            this.loaderGuardarUnidad = false;
            this.alertaError(err?.error?.message || 'Error al crear la unidad');
          }
        });
    } else {
      const body = {
        id: this.unidadSeleccionada.id,
        titulo: this.formUnidad.titulo,
        descripcion: this.formUnidad.descripcion
      };
      this.integraService.putJsonResponse(constApiOperaciones.MaestroBsgTentoActualizarUnidad, body)
        .subscribe({
          next: () => {
            this.loaderGuardarUnidad = false;
            this.cancelarFormUnidad();
            this.cargarUnidades(this.areaSeleccionada.id);
            this.alertaExito('Unidad actualizada correctamente');
          },
          error: (err: any) => {
            this.loaderGuardarUnidad = false;
            this.alertaError(err?.error?.message || 'Error al actualizar la unidad');
          }
        });
    }
  }

  eliminarUnidad(unidad: BsgTentoUnidad): void {
    this.confirmar(`¿Eliminar la unidad "${unidad.titulo}"?`, () => {
      this.integraService.deleteJsonResponse(
        `${constApiOperaciones.MaestroBsgTentoEliminarUnidad}/${unidad.id}`
      ).subscribe({
        next: () => {
          this.cargarUnidades(this.areaSeleccionada.id);
          this.alertaExito('Unidad eliminada');
        },
        error: (err: any) => {
          this.alertaError(err?.error?.message || 'No se pudo eliminar la unidad');
        }
      });
    });
  }

  moverUnidadArriba(index: number): void {
    if (index > 0) {
      [this.unidades[index], this.unidades[index - 1]] = [this.unidades[index - 1], this.unidades[index]];
      this.unidades.forEach((u, i) => u.orden = i + 1);
      this.unidades = [...this.unidades];
      this.ordenCambiadoUnidades = true;
    }
  }

  moverUnidadAbajo(index: number): void {
    if (index < this.unidades.length - 1) {
      [this.unidades[index], this.unidades[index + 1]] = [this.unidades[index + 1], this.unidades[index]];
      this.unidades.forEach((u, i) => u.orden = i + 1);
      this.unidades = [...this.unidades];
      this.ordenCambiadoUnidades = true;
    }
  }

  guardarOrdenUnidades(): void {
    this.loaderOrdenUnidades = true;
    const body = this.unidades.map((u, i) => ({ id: u.id, orden: i + 1 }));
    this.integraService.putJsonResponse(constApiOperaciones.MaestroBsgTentoActualizarOrdenUnidades, body)
      .subscribe({
        next: () => {
          this.loaderOrdenUnidades = false;
          this.ordenCambiadoUnidades = false;
          this.alertaExito('Orden guardado correctamente');
        },
        error: (err: any) => {
          this.loaderOrdenUnidades = false;
          this.alertaError(err?.error?.message || 'Error al guardar el orden');
        }
      });
  }

  // ===== PASOS =====

  abrirModalPasos(unidad: BsgTentoUnidad): void {
    this.unidadParaPasos = unidad;
    this.ordenCambiadoPasos = false;
    this.modalRefPasos = this.modalService.open(this.modalGestionPasos, {
      size: 'lg',
      backdrop: 'static',
      centered: true
    });
    this.cargarPasos(unidad.id);
    if (this.comboProgramas.length === 0) {
      this.cargarComboProgramas(this.areaSeleccionada.id);
    }
  }

  cerrarModalPasos(): void {
    this.modalRefPasos?.close();
    this.modalRefPasos = null;
    this.unidadParaPasos = null;
    this.pasos = [];
    this.modoFormPaso = null;
    this.ordenCambiadoPasos = false;
  }

  cargarPasos(idUnidad: number): void {
    this.loaderPasos = true;
    this.integraService.getJsonResponse(
      `${constApiOperaciones.MaestroBsgTentoObtenerPasosPorUnidad}/${idUnidad}`
    ).subscribe({
      next: (resp: HttpResponse<BsgTentoPaso[]>) => {
        this.pasos = resp.body || [];
        this.loaderPasos = false;
      },
      error: () => {
        this.loaderPasos = false;
      }
    });
  }

  cargarComboProgramas(idArea: number): void {
    this.integraService.getJsonResponse(
      `${constApiOperaciones.MaestroBsgTentoObtenerComboPrograma}/${idArea}`
    ).subscribe({
      next: (resp: HttpResponse<BsgTentoCombo[]>) => {
        this.comboProgramas = resp.body || [];
      },
      error: () => {}
    });
  }

  mostrarFormNuevoPaso(): void {
    this.modoFormPaso = 'nuevo';
    this.pasoSeleccionado = null;
    this.formPaso = { idPGeneral: null, titulo: '', descripcion: '' };
  }

  editarPaso(paso: BsgTentoPaso): void {
    this.modoFormPaso = 'editar';
    this.pasoSeleccionado = paso;
    this.formPaso = { idPGeneral: paso.idPGeneral, titulo: paso.titulo, descripcion: paso.descripcion };
  }

  cancelarFormPaso(): void {
    this.modoFormPaso = null;
    this.pasoSeleccionado = null;
    this.formPaso = { idPGeneral: null, titulo: '', descripcion: '' };
  }

  guardarPaso(): void {
    if (!this.formPaso.idPGeneral || !this.formPaso.titulo?.trim() || !this.formPaso.descripcion?.trim()) {
      this.alertaWarning('Campos requeridos', 'Programa, título y descripción son obligatorios');
      return;
    }

    this.loaderGuardarPaso = true;

    if (this.modoFormPaso === 'nuevo') {
      const body = {
        idUnidadEstudio: this.unidadParaPasos.id,
        idPGeneral: this.formPaso.idPGeneral,
        titulo: this.formPaso.titulo,
        descripcion: this.formPaso.descripcion,
        orden: this.pasos.length + 1
      };
      this.integraService.postJsonResponse(constApiOperaciones.MaestroBsgTentoInsertarPaso, body)
        .subscribe({
          next: () => {
            this.loaderGuardarPaso = false;
            this.cancelarFormPaso();
            this.cargarPasos(this.unidadParaPasos.id);
            this.alertaExito('Paso creado correctamente');
          },
          error: (err: any) => {
            this.loaderGuardarPaso = false;
            this.alertaError(err?.error?.message || 'Error al crear el paso');
          }
        });
    } else {
      const body = {
        id: this.pasoSeleccionado.id,
        idPGeneral: this.formPaso.idPGeneral,
        titulo: this.formPaso.titulo,
        descripcion: this.formPaso.descripcion
      };
      this.integraService.putJsonResponse(constApiOperaciones.MaestroBsgTentoActualizarPaso, body)
        .subscribe({
          next: () => {
            this.loaderGuardarPaso = false;
            this.cancelarFormPaso();
            this.cargarPasos(this.unidadParaPasos.id);
            this.alertaExito('Paso actualizado correctamente');
          },
          error: (err: any) => {
            this.loaderGuardarPaso = false;
            this.alertaError(err?.error?.message || 'Error al actualizar el paso');
          }
        });
    }
  }

  eliminarPaso(paso: BsgTentoPaso): void {
    this.confirmar(`¿Eliminar el paso "${paso.titulo}"?`, () => {
      this.integraService.deleteJsonResponse(
        `${constApiOperaciones.MaestroBsgTentoEliminarPaso}/${paso.id}`
      ).subscribe({
        next: () => {
          this.cargarPasos(this.unidadParaPasos.id);
          this.alertaExito('Paso eliminado');
        },
        error: (err: any) => {
          this.alertaError(err?.error?.message || 'No se pudo eliminar el paso');
        }
      });
    });
  }

  moverPasoArriba(index: number): void {
    if (index > 0) {
      [this.pasos[index], this.pasos[index - 1]] = [this.pasos[index - 1], this.pasos[index]];
      this.pasos.forEach((p, i) => p.orden = i + 1);
      this.pasos = [...this.pasos];
      this.ordenCambiadoPasos = true;
    }
  }

  moverPasoAbajo(index: number): void {
    if (index < this.pasos.length - 1) {
      [this.pasos[index], this.pasos[index + 1]] = [this.pasos[index + 1], this.pasos[index]];
      this.pasos.forEach((p, i) => p.orden = i + 1);
      this.pasos = [...this.pasos];
      this.ordenCambiadoPasos = true;
    }
  }

  guardarOrdenPasos(): void {
    this.loaderOrdenPasos = true;
    const body = this.pasos.map((p, i) => ({ id: p.id, orden: i + 1 }));
    this.integraService.putJsonResponse(constApiOperaciones.MaestroBsgTentoActualizarOrdenPasos, body)
      .subscribe({
        next: () => {
          this.loaderOrdenPasos = false;
          this.ordenCambiadoPasos = false;
          this.alertaExito('Orden guardado correctamente');
        },
        error: (err: any) => {
          this.loaderOrdenPasos = false;
          this.alertaError(err?.error?.message || 'Error al guardar el orden');
        }
      });
  }
}
