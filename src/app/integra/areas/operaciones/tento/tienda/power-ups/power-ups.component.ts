import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiOperaciones } from '@environments/constApi';
import Swal from 'sweetalert2';

// --- Interfaces ---
interface BsgTentoPowerUp {
  idPowerUp: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  efecto: string;
  costoMonedas: number;
  costoPuntos: number;
  iconoCodigo: string;
  colorHexadecimal: string;
  disponibleTienda: boolean;
  recompensaDisponible: boolean;
  disponibleRuletaDiaria: boolean;
  orden: number;
}

@Component({
  selector: 'app-power-ups',
  templateUrl: './power-ups.component.html',
  styleUrls: ['./power-ups.component.scss']
})
export class PowerUpsComponent implements OnInit {

  // ===== LISTA =====
  powerUps: BsgTentoPowerUp[] = [];
  loaderPowerUps = false;

  // ===== MODAL =====
  @ViewChild('modalPowerUp') modalPowerUp: TemplateRef<any>;
  modalRef: NgbModalRef = null;
  modoForm: 'nuevo' | 'editar' = 'nuevo';
  itemSeleccionado: BsgTentoPowerUp = null;
  loaderGuardar = false;

  // ===== ORDEN =====
  ordenCambiado = false;
  loaderOrden = false;

  // ===== FORM =====
  form = {
    codigo: '',
    nombre: '',
    descripcion: '',
    efecto: '',
    costoMonedas: 0,
    costoPuntos: 0,
    iconoCodigo: null as string | null,
    colorHexadecimal: '#3B82F6',
    disponibleTienda: true,
    recompensaDisponible: true,
    disponibleRuletaDiaria: true,
    orden: 1
  };

  // ===== CATÁLOGOS ESTÁTICOS =====
  readonly iconosList = [
    { codigo: 'trophy',         etiqueta: 'Trofeo' },
    { codigo: 'star',           etiqueta: 'Estrella' },
    { codigo: 'fire',           etiqueta: 'Fuego' },
    { codigo: 'bolt',           etiqueta: 'Rayo' },
    { codigo: 'medal',          etiqueta: 'Medalla' },
    { codigo: 'crown',          etiqueta: 'Corona' },
    { codigo: 'graduation-cap', etiqueta: 'Graduación' },
    { codigo: 'brain',          etiqueta: 'Cerebro' },
    { codigo: 'rocket',         etiqueta: 'Cohete' },
    { codigo: 'gem',            etiqueta: 'Gema' },
    { codigo: 'bullseye',       etiqueta: 'Diana' },
    { codigo: 'award',          etiqueta: 'Premio' },
    { codigo: 'chart-line',     etiqueta: 'Progreso' },
    { codigo: 'calendar-check', etiqueta: 'Calendario' },
    { codigo: 'check-circle',   etiqueta: 'Check' },
    { codigo: 'clock',          etiqueta: 'Reloj' },
    { codigo: 'flag',           etiqueta: 'Bandera' },
    { codigo: 'heart',          etiqueta: 'Corazón' },
    { codigo: 'infinity',       etiqueta: 'Infinito' },
    { codigo: 'shield-alt',     etiqueta: 'Escudo' },
    { codigo: 'zap',            etiqueta: 'Zap' },
    { codigo: 'magic',          etiqueta: 'Magia' },
    { codigo: 'crosshairs',     etiqueta: 'Mira' },
    { codigo: 'hand-paper',     etiqueta: 'Mano' },
    { codigo: 'hourglass-half', etiqueta: 'Reloj Arena' }
  ];

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
    this.cargar();
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

  cargar(): void {
    this.loaderPowerUps = true;
    this.integraService.getJsonResponse(constApiOperaciones.MaestroBsgTentoPowerUpsObtenerPowerUps)
      .subscribe({
        next: (resp: HttpResponse<BsgTentoPowerUp[]>) => {
          this.powerUps = resp.body || [];
          this.ordenCambiado = false;
          this.loaderPowerUps = false;
        },
        error: () => {
          this.loaderPowerUps = false;
          this._alertaService.notificationError('Error al obtener los power-ups');
        }
      });
  }

  // ===== MODAL =====

  abrirModal(item: BsgTentoPowerUp | null): void {
    if (item) {
      this.modoForm = 'editar';
      this.itemSeleccionado = item;
      this.form = {
        codigo: item.codigo,
        nombre: item.nombre,
        descripcion: item.descripcion,
        efecto: item.efecto,
        costoMonedas: item.costoMonedas,
        costoPuntos: item.costoPuntos,
        iconoCodigo: item.iconoCodigo || null,
        colorHexadecimal: item.colorHexadecimal || '#3B82F6',
        disponibleTienda: item.disponibleTienda,
        recompensaDisponible: item.recompensaDisponible,
        disponibleRuletaDiaria: item.disponibleRuletaDiaria,
        orden: item.orden
      };
    } else {
      this.modoForm = 'nuevo';
      this.itemSeleccionado = null;
      this.form = {
        codigo: '',
        nombre: '',
        descripcion: '',
        efecto: '',
        costoMonedas: 0,
        costoPuntos: 0,
        iconoCodigo: null,
        colorHexadecimal: '#3B82F6',
        disponibleTienda: true,
        recompensaDisponible: true,
        disponibleRuletaDiaria: true,
        orden: this.powerUps.length + 1
      };
    }
    this.modalRef = this.modalService.open(this.modalPowerUp, {
      size: 'lg',
      backdrop: 'static',
      centered: true
    });
  }

  cerrarModal(): void {
    this.modalRef?.close();
    this.modalRef = null;
    this.itemSeleccionado = null;
  }

  // ===== GUARDAR =====

  guardar(): void {
    if (!this.form.codigo?.trim()) {
      this.alertaWarning('Campos requeridos', 'El código es obligatorio');
      return;
    }
    if (!this.form.nombre?.trim()) {
      this.alertaWarning('Campos requeridos', 'El nombre es obligatorio');
      return;
    }
    if (!this.form.descripcion?.trim()) {
      this.alertaWarning('Campos requeridos', 'La descripción es obligatoria');
      return;
    }
    if (!this.form.efecto?.trim()) {
      this.alertaWarning('Campos requeridos', 'El efecto es obligatorio');
      return;
    }
    if (!this.form.iconoCodigo) {
      this.alertaWarning('Campos requeridos', 'Seleccioná un ícono para el power-up');
      return;
    }

    this.loaderGuardar = true;

    if (this.modoForm === 'nuevo') {
      const body = {
        codigo: this.form.codigo.toUpperCase(),
        nombre: this.form.nombre,
        descripcion: this.form.descripcion,
        efecto: this.form.efecto,
        costoMonedas: this.form.costoMonedas,
        costoPuntos: this.form.costoPuntos,
        iconoCodigo: this.form.iconoCodigo,
        colorHexadecimal: this.form.colorHexadecimal,
        disponibleTienda: this.form.disponibleTienda,
        recompensaDisponible: this.form.recompensaDisponible,
        disponibleRuletaDiaria: this.form.disponibleRuletaDiaria,
        orden: this.powerUps.length + 1
      };
      this.integraService.postJsonResponse(constApiOperaciones.MaestroBsgTentoPowerUpsInsertarPowerUp, body)
        .subscribe({
          next: () => {
            this.loaderGuardar = false;
            this.cerrarModal();
            this.cargar();
            this.alertaExito('Power-up creado correctamente');
          },
          error: () => {
            this.loaderGuardar = false;
            this._alertaService.notificationError('Error al crear el power-up');
          }
        });
    } else {
      const body = {
        id: this.itemSeleccionado.idPowerUp,
        codigo: this.form.codigo.toUpperCase(),
        nombre: this.form.nombre,
        descripcion: this.form.descripcion,
        efecto: this.form.efecto,
        costoMonedas: this.form.costoMonedas,
        costoPuntos: this.form.costoPuntos,
        iconoCodigo: this.form.iconoCodigo,
        colorHexadecimal: this.form.colorHexadecimal,
        disponibleTienda: this.form.disponibleTienda,
        recompensaDisponible: this.form.recompensaDisponible,
        disponibleRuletaDiaria: this.form.disponibleRuletaDiaria,
        orden: this.form.orden
      };
      this.integraService.putJsonResponse(constApiOperaciones.MaestroBsgTentoPowerUpsActualizarPowerUp, body)
        .subscribe({
          next: () => {
            this.loaderGuardar = false;
            this.cerrarModal();
            this.cargar();
            this.alertaExito('Power-up actualizado correctamente');
          },
          error: () => {
            this.loaderGuardar = false;
            this._alertaService.notificationError('Error al actualizar el power-up');
          }
        });
    }
  }

  // ===== ELIMINAR =====

  eliminar(item: BsgTentoPowerUp): void {
    this.confirmar(`¿Eliminar el power-up "${item.nombre}"?`, () => {
      this.integraService.deleteJsonResponse(
        `${constApiOperaciones.MaestroBsgTentoPowerUpsEliminarPowerUp}/${item.idPowerUp}`
      ).subscribe({
        next: () => {
          this.cargar();
          this.alertaExito('Power-up eliminado');
        },
        error: () => {
          this._alertaService.notificationError('Error al eliminar el power-up');
        }
      });
    });
  }

  // ===== REORDEN =====

  moverArriba(index: number): void {
    if (index === 0) { return; }
    const temp = this.powerUps[index];
    this.powerUps[index] = this.powerUps[index - 1];
    this.powerUps[index - 1] = temp;
    this.powerUps = [...this.powerUps];
    this.ordenCambiado = true;
  }

  moverAbajo(index: number): void {
    if (index === this.powerUps.length - 1) { return; }
    const temp = this.powerUps[index];
    this.powerUps[index] = this.powerUps[index + 1];
    this.powerUps[index + 1] = temp;
    this.powerUps = [...this.powerUps];
    this.ordenCambiado = true;
  }

  guardarOrden(): void {
    this.loaderOrden = true;
    const body = this.powerUps.map((p, i) => ({ id: p.idPowerUp, orden: i + 1 }));
    this.integraService.putJsonResponse(constApiOperaciones.MaestroBsgTentoPowerUpsActualizarOrdenPowerUps, body)
      .subscribe({
        next: () => {
          this.loaderOrden = false;
          this.ordenCambiado = false;
          this.alertaExito('Orden actualizado correctamente');
        },
        error: () => {
          this.loaderOrden = false;
          this._alertaService.notificationError('Error al actualizar el orden');
        }
      });
  }
}
