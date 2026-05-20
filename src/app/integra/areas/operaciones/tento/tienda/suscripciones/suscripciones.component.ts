import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiOperaciones } from '@environments/constApi';
import Swal from 'sweetalert2';

// --- Interfaces ---
interface PlanSuscripcion {
  id: number;
  nombre: string;
  descripcion: string;
  esPremium: boolean;
  powerUpsIlimitados: boolean;
  incluyeAnuncio: boolean;
  contenidoExclusivo: boolean;
  orden: number;
}

@Component({
  selector: 'app-suscripciones',
  templateUrl: './suscripciones.component.html',
  styleUrls: ['./suscripciones.component.scss']
})
export class SuscripcionesComponent implements OnInit {

  // ===== LISTA =====
  planes: PlanSuscripcion[] = [];
  loaderPlanes = false;

  // ===== MODAL =====
  @ViewChild('modalPlan') modalPlan: TemplateRef<any>;
  modalRef: NgbModalRef = null;
  modoForm: 'nuevo' | 'editar' = 'nuevo';
  itemSeleccionado: PlanSuscripcion = null;
  loaderGuardar = false;

  // ===== FORM =====
  form = {
    nombre: '',
    descripcion: '',
    esPremium: false,
    powerUpsIlimitados: false,
    incluyeAnuncio: false,
    contenidoExclusivo: false,
    orden: 1
  };

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
    this.loaderPlanes = true;
    this.integraService.getJsonResponse(constApiOperaciones.MaestroBsgTentoSuscripcionesObtenerPlanes)
      .subscribe({
        next: (resp: HttpResponse<PlanSuscripcion[]>) => {
          this.planes = resp.body || [];
          this.loaderPlanes = false;
        },
        error: () => {
          this.loaderPlanes = false;
          this._alertaService.notificationError('Error al obtener los planes de suscripción');
        }
      });
  }

  // ===== MODAL =====

  abrirModal(item: PlanSuscripcion | null): void {
    if (item) {
      this.modoForm = 'editar';
      this.itemSeleccionado = item;
      this.form = {
        nombre: item.nombre,
        descripcion: item.descripcion,
        esPremium: item.esPremium,
        powerUpsIlimitados: item.powerUpsIlimitados,
        incluyeAnuncio: item.incluyeAnuncio,
        contenidoExclusivo: item.contenidoExclusivo,
        orden: item.orden
      };
    } else {
      this.modoForm = 'nuevo';
      this.itemSeleccionado = null;
      this.form = {
        nombre: '',
        descripcion: '',
        esPremium: false,
        powerUpsIlimitados: false,
        incluyeAnuncio: false,
        contenidoExclusivo: false,
        orden: this.planes.length + 1
      };
    }
    this.modalRef = this.modalService.open(this.modalPlan, {
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
    if (!this.form.nombre?.trim()) {
      this.alertaWarning('Campos requeridos', 'El nombre es obligatorio');
      return;
    }
    if (!this.form.descripcion?.trim()) {
      this.alertaWarning('Campos requeridos', 'La descripción es obligatoria');
      return;
    }

    this.loaderGuardar = true;

    if (this.modoForm === 'nuevo') {
      const body = {
        nombre: this.form.nombre,
        descripcion: this.form.descripcion,
        esPremium: this.form.esPremium,
        powerUpsIlimitados: this.form.powerUpsIlimitados,
        incluyeAnuncio: this.form.incluyeAnuncio,
        contenidoExclusivo: this.form.contenidoExclusivo,
        orden: this.form.orden
      };
      this.integraService.postJsonResponse(constApiOperaciones.MaestroBsgTentoSuscripcionesInsertarPlan, body)
        .subscribe({
          next: () => {
            this.loaderGuardar = false;
            this.cerrarModal();
            this.cargar();
            this.alertaExito('Plan creado correctamente');
          },
          error: () => {
            this.loaderGuardar = false;
            this._alertaService.notificationError('Error al crear el plan');
          }
        });
    } else {
      const body = {
        id: this.itemSeleccionado.id,
        nombre: this.form.nombre,
        descripcion: this.form.descripcion,
        esPremium: this.form.esPremium,
        powerUpsIlimitados: this.form.powerUpsIlimitados,
        incluyeAnuncio: this.form.incluyeAnuncio,
        contenidoExclusivo: this.form.contenidoExclusivo,
        orden: this.form.orden
      };
      this.integraService.putJsonResponse(constApiOperaciones.MaestroBsgTentoSuscripcionesActualizarPlan, body)
        .subscribe({
          next: () => {
            this.loaderGuardar = false;
            this.cerrarModal();
            this.cargar();
            this.alertaExito('Plan actualizado correctamente');
          },
          error: () => {
            this.loaderGuardar = false;
            this._alertaService.notificationError('Error al actualizar el plan');
          }
        });
    }
  }

  // ===== ELIMINAR =====

  eliminar(item: PlanSuscripcion): void {
    this.confirmar(`¿Eliminar el plan "${item.nombre}"?`, () => {
      this.integraService.deleteJsonResponse(
        `${constApiOperaciones.MaestroBsgTentoSuscripcionesEliminarPlan}/${item.id}`
      ).subscribe({
        next: () => {
          this.planes = this.planes.filter(p => p.id !== item.id);
          this.alertaExito('Plan eliminado');
        },
        error: () => {
          this._alertaService.notificationError('Error al eliminar el plan');
        }
      });
    });
  }
}
