import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiOperaciones } from '@environments/constApi';
import Swal from 'sweetalert2';

// --- Interfaces ---
interface BsgTentoLogro {
  idLogro: number;
  nombre: string;
  descripcion: string;
  tipoLogro: number;
  valorObjetivo: number;
  iconoCodigo: string;
  colorHexadecimal: string;
  idLogroTipoCondicion: number;
  nombreTipoCondicion: string;
  idAreaCapacitacion?: number;
  nombreAreaCapacitacion?: string;
  idPGeneral?: number;
  orden: number;
}

interface BsgTentoMision {
  idMision: number;
  nombre: string;
  descripcion: string;
  idMisionTipo: number;
  nombreTipoMision: string;
  valorObjetivo: number;
  recompensaXP: number;
  recompensaPuntos: number;
  iconoCodigo: string;
  colorHexadecimal: string;
  idLogroTipoCondicion: number;
  nombreTipoCondicion: string;
  idAreaCapacitacion?: number;
  orden: number;
}

interface Combo {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-logros',
  templateUrl: './logros.component.html',
  styleUrls: ['./logros.component.scss']
})
export class LogrosComponent implements OnInit {

  // ===== LISTAS =====
  logros: BsgTentoLogro[] = [];
  rachas: BsgTentoLogro[] = [];
  misiones: BsgTentoMision[] = [];
  tiposCondicion: Combo[] = [];
  comboAreas: Combo[] = [];
  loaderLogros = false;
  loaderMisiones = false;

  // ===== MODAL LOGRO / RACHA =====
  @ViewChild('modalLogro') modalLogro: TemplateRef<any>;
  modalRefLogro: NgbModalRef = null;
  modoFormLogro: 'nuevo' | 'editar' | null = null;
  modoTipoLogro: 1 | 2 = 1;
  logroSeleccionado: BsgTentoLogro = null;
  formLogro = {
    nombre: '',
    descripcion: '',
    tipoLogro: 1,
    idLogroTipoCondicion: null as number | null,
    valorObjetivo: 1,
    iconoCodigo: null as string | null,
    colorHexadecimal: '#F59E0B',
    idAreaCapacitacion: null as number | null,
    idPGeneral: null as number | null
  };
  loaderGuardarLogro = false;

  // ===== MODAL MISIÓN =====
  @ViewChild('modalMision') modalMision: TemplateRef<any>;
  modalRefMision: NgbModalRef = null;
  modoFormMision: 'nuevo' | 'editar' | null = null;
  misionSeleccionada: BsgTentoMision = null;
  formMision = {
    nombre: '',
    descripcion: '',
    idMisionTipo: null as number | null,
    idLogroTipoCondicion: null as number | null,
    valorObjetivo: 1,
    recompensaXP: 0,
    recompensaPuntos: 0,
    iconoCodigo: null as string | null,
    colorHexadecimal: '#3B82F6',
    idAreaCapacitacion: null as number | null
  };
  loaderGuardarMision = false;

  // ===== CATÁLOGOS ESTÁTICOS =====
  readonly iconosList = [
    { codigo: 'trophy', etiqueta: 'Trofeo' },
    { codigo: 'star', etiqueta: 'Estrella' },
    { codigo: 'fire', etiqueta: 'Fuego' },
    { codigo: 'bolt', etiqueta: 'Rayo' },
    { codigo: 'medal', etiqueta: 'Medalla' },
    { codigo: 'crown', etiqueta: 'Corona' },
    { codigo: 'graduation-cap', etiqueta: 'Graduación' },
    { codigo: 'brain', etiqueta: 'Cerebro' },
    { codigo: 'rocket', etiqueta: 'Cohete' },
    { codigo: 'gem', etiqueta: 'Gema' },
    { codigo: 'bullseye', etiqueta: 'Diana' },
    { codigo: 'award', etiqueta: 'Premio' },
    { codigo: 'chart-line', etiqueta: 'Progreso' },
    { codigo: 'calendar-check', etiqueta: 'Calendario' },
    { codigo: 'check-circle', etiqueta: 'Check' },
    { codigo: 'clock', etiqueta: 'Reloj' },
    { codigo: 'flag', etiqueta: 'Bandera' },
    { codigo: 'heart', etiqueta: 'Corazón' },
    { codigo: 'infinity', etiqueta: 'Infinito' },
    { codigo: 'shield-alt', etiqueta: 'Escudo' }
  ];

  tiposMision: { id: number; nombre: string; descripcion: string }[] = [];

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
    }
  });

  constructor(
    private integraService: IntegraService,
    private modalService: NgbModal,
    private _alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.cargarTiposCondicion();
    this.cargarTiposMision();
    this.cargarLogros();
    this.cargarMisiones();
    this.cargarComboAreas();
  }

  // ===== HELPERS DE ALERTA =====

  private alertaExito(mensaje: string): void {
    this.toast.fire({ icon: 'success', title: mensaje });
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

  // ===== CARGA DE DATOS =====

  cargarTiposCondicion(): void {
    this.integraService.getJsonResponse(constApiOperaciones.MaestroBsgTentoLogrosObtenerTiposCondicion)
      .subscribe({
        next: (resp: HttpResponse<Combo[]>) => {
          this.tiposCondicion = resp.body || [];
        },
        error: () => {
          this._alertaService.notificationError('Error al obtener los tipos de condición');
        }
      });
  }

  cargarTiposMision(): void {
    this.integraService.getJsonResponse(constApiOperaciones.MaestroBsgTentoLogrosObtenerTiposMision)
      .subscribe({
        next: (resp: any) => { this.tiposMision = resp.body || resp || []; },
        error: () => {
          this._alertaService.notificationError('Error al obtener los tipos de misión');
        }
      });
  }

  cargarLogros(): void {
    this.loaderLogros = true;
    this.integraService.getJsonResponse(constApiOperaciones.MaestroBsgTentoLogrosObtenerLogros)
      .subscribe({
        next: (resp: HttpResponse<BsgTentoLogro[]>) => {
          const todos = resp.body || [];
          this.logros = todos.filter(l => l.tipoLogro === 1);
          this.rachas = todos.filter(l => l.tipoLogro === 2);
          this.loaderLogros = false;
        },
        error: () => {
          this.loaderLogros = false;
          this._alertaService.notificationError('Error al obtener los logros');
        }
      });
  }

  cargarMisiones(): void {
    this.loaderMisiones = true;
    this.integraService.getJsonResponse(constApiOperaciones.MaestroBsgTentoLogrosObtenerMisiones)
      .subscribe({
        next: (resp: HttpResponse<BsgTentoMision[]>) => {
          this.misiones = resp.body || [];
          this.loaderMisiones = false;
        },
        error: () => {
          this.loaderMisiones = false;
          this._alertaService.notificationError('Error al obtener las misiones');
        }
      });
  }

  cargarComboAreas(): void {
    this.integraService.getJsonResponse(constApiOperaciones.MaestroBsgTentoObtenerAreasConRuta)
      .subscribe({
        next: (resp: HttpResponse<Combo[]>) => {
          this.comboAreas = resp.body || [];
        },
        error: () => {
          this._alertaService.notificationError('Error al obtener las áreas');
        }
      });
  }

  // ===== MODAL LOGRO / RACHA =====

  abrirModalLogro(item: BsgTentoLogro | null, tipoLogro: 1 | 2): void {
    this.modoTipoLogro = tipoLogro;
    if (item) {
      this.modoFormLogro = 'editar';
      this.logroSeleccionado = item;
      this.formLogro = {
        nombre: item.nombre,
        descripcion: item.descripcion,
        tipoLogro: item.tipoLogro,
        idLogroTipoCondicion: item.idLogroTipoCondicion,
        valorObjetivo: item.valorObjetivo,
        iconoCodigo: item.iconoCodigo || null,
        colorHexadecimal: item.colorHexadecimal || '#F59E0B',
        idAreaCapacitacion: item.idAreaCapacitacion || null,
        idPGeneral: item.idPGeneral || null
      };
    } else {
      this.modoFormLogro = 'nuevo';
      this.logroSeleccionado = null;
      this.formLogro = {
        nombre: '',
        descripcion: '',
        tipoLogro,
        idLogroTipoCondicion: null,
        valorObjetivo: 1,
        iconoCodigo: null,
        colorHexadecimal: '#F59E0B',
        idAreaCapacitacion: null,
        idPGeneral: null
      };
    }
    this.modalRefLogro = this.modalService.open(this.modalLogro, {
      size: 'lg',
      backdrop: 'static',
      centered: true
    });
  }

  cerrarModalLogro(): void {
    this.modalRefLogro?.close();
    this.modalRefLogro = null;
    this.modoFormLogro = null;
    this.logroSeleccionado = null;
  }

  guardarLogro(): void {
    if (!this.formLogro.nombre?.trim() || !this.formLogro.descripcion?.trim()) {
      this.alertaWarning('Campos requeridos', 'Nombre y descripción son obligatorios');
      return;
    }
    if (!this.formLogro.idLogroTipoCondicion) {
      this.alertaWarning('Campos requeridos', 'Seleccioná el tipo de condición');
      return;
    }
    if (!this.formLogro.iconoCodigo) {
      this.alertaWarning('Campos requeridos', 'Seleccioná un ícono para el logro');
      return;
    }

    this.loaderGuardarLogro = true;

    if (this.modoFormLogro === 'nuevo') {
      const body = {
        nombre: this.formLogro.nombre,
        descripcion: this.formLogro.descripcion,
        tipoLogro: this.modoTipoLogro,
        idLogroTipoCondicion: this.formLogro.idLogroTipoCondicion,
        valorObjetivo: this.formLogro.valorObjetivo,
        iconoCodigo: this.formLogro.iconoCodigo,
        colorHexadecimal: this.formLogro.colorHexadecimal,
        idAreaCapacitacion: this.formLogro.idAreaCapacitacion,
        idPGeneral: this.formLogro.idPGeneral,
        orden: (this.modoTipoLogro === 1 ? this.logros : this.rachas).length + 1
      };
      this.integraService.postJsonResponse(constApiOperaciones.MaestroBsgTentoLogrosInsertarLogro, body)
        .subscribe({
          next: () => {
            this.loaderGuardarLogro = false;
            this.cerrarModalLogro();
            this.cargarLogros();
            this.alertaExito(this.modoTipoLogro === 1 ? 'Logro creado correctamente' : 'Racha creada correctamente');
          },
          error: () => {
            this.loaderGuardarLogro = false;
            this._alertaService.notificationError('Error al crear el logro');
          }
        });
    } else {
      const body = {
        id: this.logroSeleccionado.idLogro,
        nombre: this.formLogro.nombre,
        descripcion: this.formLogro.descripcion,
        tipoLogro: this.modoTipoLogro,
        idLogroTipoCondicion: this.formLogro.idLogroTipoCondicion,
        valorObjetivo: this.formLogro.valorObjetivo,
        iconoCodigo: this.formLogro.iconoCodigo,
        colorHexadecimal: this.formLogro.colorHexadecimal,
        idAreaCapacitacion: this.formLogro.idAreaCapacitacion,
        idPGeneral: this.formLogro.idPGeneral
      };
      this.integraService.putJsonResponse(constApiOperaciones.MaestroBsgTentoLogrosActualizarLogro, body)
        .subscribe({
          next: () => {
            this.loaderGuardarLogro = false;
            this.cerrarModalLogro();
            this.cargarLogros();
            this.alertaExito(this.modoTipoLogro === 1 ? 'Logro actualizado correctamente' : 'Racha actualizada correctamente');
          },
          error: () => {
            this.loaderGuardarLogro = false;
            this._alertaService.notificationError('Error al actualizar el logro');
          }
        });
    }
  }

  eliminarLogro(item: BsgTentoLogro): void {
    const tipo = item.tipoLogro === 1 ? 'logro' : 'racha';
    this.confirmar(`¿Eliminar ${tipo} "${item.nombre}"?`, () => {
      this.integraService.deleteJsonResponse(
        `${constApiOperaciones.MaestroBsgTentoLogrosEliminarLogro}/${item.idLogro}`
      ).subscribe({
        next: () => {
          this.cargarLogros();
          this.alertaExito(`${item.tipoLogro === 1 ? 'Logro' : 'Racha'} eliminado`);
        },
        error: () => {
          this._alertaService.notificationError('Error al eliminar el logro');
        }
      });
    });
  }

  // ===== MODAL MISIÓN =====

  abrirModalMision(item: BsgTentoMision | null): void {
    if (item) {
      this.modoFormMision = 'editar';
      this.misionSeleccionada = item;
      this.formMision = {
        nombre: item.nombre,
        descripcion: item.descripcion,
        idMisionTipo: item.idMisionTipo,
        idLogroTipoCondicion: item.idLogroTipoCondicion,
        valorObjetivo: item.valorObjetivo,
        recompensaXP: item.recompensaXP,
        recompensaPuntos: item.recompensaPuntos,
        iconoCodigo: item.iconoCodigo || null,
        colorHexadecimal: item.colorHexadecimal || '#3B82F6',
        idAreaCapacitacion: item.idAreaCapacitacion || null
      };
    } else {
      this.modoFormMision = 'nuevo';
      this.misionSeleccionada = null;
      this.formMision = {
        nombre: '',
        descripcion: '',
        idMisionTipo: null,
        idLogroTipoCondicion: null,
        valorObjetivo: 1,
        recompensaXP: 0,
        recompensaPuntos: 0,
        iconoCodigo: null,
        colorHexadecimal: '#3B82F6',
        idAreaCapacitacion: null
      };
    }
    this.modalRefMision = this.modalService.open(this.modalMision, {
      size: 'lg',
      backdrop: 'static',
      centered: true
    });
  }

  cerrarModalMision(): void {
    this.modalRefMision?.close();
    this.modalRefMision = null;
    this.modoFormMision = null;
    this.misionSeleccionada = null;
  }

  guardarMision(): void {
    if (!this.formMision.nombre?.trim() || !this.formMision.descripcion?.trim()) {
      this.alertaWarning('Campos requeridos', 'Nombre y descripción son obligatorios');
      return;
    }
    if (!this.formMision.idMisionTipo) {
      this.alertaWarning('Campos requeridos', 'Seleccioná el tipo de misión');
      return;
    }
    if (!this.formMision.idLogroTipoCondicion) {
      this.alertaWarning('Campos requeridos', 'Seleccioná el tipo de condición');
      return;
    }
    if (!this.formMision.iconoCodigo) {
      this.alertaWarning('Campos requeridos', 'Seleccioná un ícono para la misión');
      return;
    }

    this.loaderGuardarMision = true;

    if (this.modoFormMision === 'nuevo') {
      const body = {
        nombre: this.formMision.nombre,
        descripcion: this.formMision.descripcion,
        idMisionTipo: this.formMision.idMisionTipo,
        idLogroTipoCondicion: this.formMision.idLogroTipoCondicion,
        valorObjetivo: this.formMision.valorObjetivo,
        recompensaXP: this.formMision.recompensaXP,
        recompensaPuntos: this.formMision.recompensaPuntos,
        iconoCodigo: this.formMision.iconoCodigo,
        colorHexadecimal: this.formMision.colorHexadecimal,
        idAreaCapacitacion: this.formMision.idAreaCapacitacion,
        orden: this.misiones.length + 1
      };
      this.integraService.postJsonResponse(constApiOperaciones.MaestroBsgTentoLogrosInsertarMision, body)
        .subscribe({
          next: () => {
            this.loaderGuardarMision = false;
            this.cerrarModalMision();
            this.cargarMisiones();
            this.alertaExito('Misión creada correctamente');
          },
          error: () => {
            this.loaderGuardarMision = false;
            this._alertaService.notificationError('Error al crear la misión');
          }
        });
    } else {
      const body = {
        id: this.misionSeleccionada.idMision,
        nombre: this.formMision.nombre,
        descripcion: this.formMision.descripcion,
        idMisionTipo: this.formMision.idMisionTipo,
        idLogroTipoCondicion: this.formMision.idLogroTipoCondicion,
        valorObjetivo: this.formMision.valorObjetivo,
        recompensaXP: this.formMision.recompensaXP,
        recompensaPuntos: this.formMision.recompensaPuntos,
        iconoCodigo: this.formMision.iconoCodigo,
        colorHexadecimal: this.formMision.colorHexadecimal,
        idAreaCapacitacion: this.formMision.idAreaCapacitacion
      };
      this.integraService.putJsonResponse(constApiOperaciones.MaestroBsgTentoLogrosActualizarMision, body)
        .subscribe({
          next: () => {
            this.loaderGuardarMision = false;
            this.cerrarModalMision();
            this.cargarMisiones();
            this.alertaExito('Misión actualizada correctamente');
          },
          error: () => {
            this.loaderGuardarMision = false;
            this._alertaService.notificationError('Error al actualizar la misión');
          }
        });
    }
  }

  eliminarMision(item: BsgTentoMision): void {
    this.confirmar(`¿Eliminar la misión "${item.nombre}"?`, () => {
      this.integraService.deleteJsonResponse(
        `${constApiOperaciones.MaestroBsgTentoLogrosEliminarMision}/${item.idMision}`
      ).subscribe({
        next: () => {
          this.cargarMisiones();
          this.alertaExito('Misión eliminada');
        },
        error: () => {
          this._alertaService.notificationError('Error al eliminar la misión');
        }
      });
    });
  }
}
