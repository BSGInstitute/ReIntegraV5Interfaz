import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiOperaciones } from '@environments/constApi';
import Swal from 'sweetalert2';

// --- Interfaces ---
interface Publicacion {
  idPublicacion: number;
  nombre: string;
  contenido: string;
  cantidadLikes: number;
  visible: boolean;
  fechaCreacion: Date;
}

@Component({
  selector: 'app-moderacion',
  templateUrl: './moderacion.component.html',
  styleUrls: ['./moderacion.component.scss']
})
export class ModeracionComponent implements OnInit {

  publicaciones: Publicacion[] = [];
  loaderPublicaciones = false;
  filtroVisible: boolean | null = null;
  fechaInicio: Date;
  fechaFin: Date = new Date();

  // Toast reutilizable (mismo patrón del proyecto)
  private toast = Swal.mixin({
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
    private _alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.fechaInicio = this.calcularLunesSemanaActual();
    this.cargar();
  }

  // ===== HELPERS DE ALERTA =====

  private alertaExito(mensaje: string): void {
    this.toast.fire({ icon: 'success', title: mensaje });
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
    this.loaderPublicaciones = true;
    const inicio = this.formatearFechaInicio(this.fechaInicio);
    const fin = this.formatearFechaFin(this.fechaFin);
    let url = `${constApiOperaciones.MaestroBsgTentoSocialObtenerPublicaciones}?fechaInicio=${inicio}&fechaFin=${fin}`;
    if (this.filtroVisible !== null) {
      url += `&visible=${this.filtroVisible}`;
    }

    this.integraService.getJsonResponse(url)
      .subscribe({
        next: (resp: HttpResponse<Publicacion[]>) => {
          this.publicaciones = resp.body || [];
          this.loaderPublicaciones = false;
        },
        error: () => {
          this.loaderPublicaciones = false;
          this._alertaService.notificationError('Error al obtener las publicaciones');
        }
      });
  }

  aplicarFiltro(valor: boolean | null): void {
    this.filtroVisible = valor;
    this.cargar();
  }

  aplicarRangoFechas(): void {
    this.cargar();
  }

  private calcularLunesSemanaActual(): Date {
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0=domingo, 1=lunes...6=sabado
    const diasARestar = diaSemana === 0 ? 6 : diaSemana - 1; // domingo retrocede 6, resto dia-1
    return new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - diasARestar);
  }

  private formatearFechaInicio(fecha: Date): string {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}T00:00:00`;
  }

  private formatearFechaFin(fecha: Date): string {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}T23:59:59`;
  }

  toggleVisibilidad(item: Publicacion): void {
    const nuevaVisibilidad = !item.visible;
    this.integraService.putJsonResponse(
      `${constApiOperaciones.MaestroBsgTentoSocialActualizarVisibilidadPublicacion}/${item.idPublicacion}/${nuevaVisibilidad}`,
      {}
    ).subscribe({
      next: () => {
        item.visible = nuevaVisibilidad;
        this.publicaciones = [...this.publicaciones]; // trigger change detection
        this.alertaExito(nuevaVisibilidad ? 'Publicación visible' : 'Publicación oculta');
      },
      error: () => {
        this._alertaService.notificationError('Error al actualizar la visibilidad');
      }
    });
  }

  eliminar(item: Publicacion): void {
    this.confirmar(`¿Eliminar la publicación de "${item.nombre}"?`, () => {
      this.integraService.deleteJsonResponse(
        `${constApiOperaciones.MaestroBsgTentoSocialEliminarPublicacion}/${item.idPublicacion}`
      ).subscribe({
        next: () => {
          this.publicaciones = this.publicaciones.filter(p => p.idPublicacion !== item.idPublicacion);
          this.alertaExito('Publicación eliminada');
        },
        error: () => {
          this._alertaService.notificationError('Error al eliminar la publicación');
        }
      });
    });
  }
}
