import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { 
  FacebookLeadsRecuperacionDatosService, 
  FacebookLeadResponse 
} from '@shared/services/facebook-leads-recuperacion-datos.service';
import { NotificationService } from '@progress/kendo-angular-notification';

/**
 * Componente Modal para mostrar detalles de un Lead de Facebook
 * @author Miguel Valdivia
 * @version 1.0.0
 * @description Modal que consume la API de Facebook Leads y muestra información detallada
 */
@Component({
  selector: 'app-modal-detalle-lead-facebook',
  templateUrl: './modal-detalle-lead-facebook.component.html',
  styleUrls: ['./modal-detalle-lead-facebook.component.scss']
})
export class ModalDetalleLeadFacebookComponent implements OnInit {

  // Input recibido del componente padre
  @Input() leadId!: string;

  // Estados del componente
  loading: boolean = false;
  error: string | null = null;
  
  // Datos del lead obtenidos de la API
  leadData: FacebookLeadResponse | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private facebookService: FacebookLeadsRecuperacionDatosService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    console.log('Modal inicializado con Lead ID:', this.leadId);
    
    // Validar que se recibió el leadId
    if (!this.leadId) {
      this.error = 'No se proporcionó un ID de lead válido';
      return;
    }

    // Cargar datos automáticamente al inicializar el modal
    this.cargarDatosLead();
  }

  /**
   * Obtiene los datos del lead desde la API
   */
  private cargarDatosLead(): void {
    this.loading = true;
    this.error = null;

    console.log('Cargando datos para Lead ID:', this.leadId);

    this.facebookService.obtenerLeadPorId(this.leadId).subscribe({
      next: (data: FacebookLeadResponse) => {
        console.log('Datos del lead obtenidos:', data);
        this.leadData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos del lead:', error);
        this.error = error.message || 'Error al cargar los datos del lead';
        this.loading = false;
        
        // Mostrar notificación de error
        this.notificationService.show({
          content: `Error al cargar el lead: ${this.error}`,
          cssClass: 'button-notification',
          position: { horizontal: 'center', vertical: 'top' },
          animation: { type: 'fade', duration: 400 },
          type: { style: 'error', icon: true },
          closable: true
        });
      }
    });
  }

  /**
   * Copia texto al portapapeles
   * @param texto - Texto a copiar
   */
  copiarAlPortapapeles(texto: string): void {
    if (!texto || texto.trim() === '') {
      return;
    }

    navigator.clipboard.writeText(texto).then(() => {
      // Mostrar notificación de éxito
      this.notificationService.show({
        content: 'Información copiada al portapapeles',
        cssClass: 'button-notification',
        position: { horizontal: 'center', vertical: 'bottom' },
        animation: { type: 'fade', duration: 300 },
        type: { style: 'success', icon: true },
        closable: true,
        hideAfter: 2000
      });
    }).catch(() => {
      console.warn('No se pudo copiar al portapapeles');
    });
  }

  /**
   * Reintentar carga de datos
   */
  reintentar(): void {
    this.cargarDatosLead();
  }

  /**
   * Cerrar el modal
   */
  cerrarModal(): void {
    this.activeModal.dismiss();
  }

  /**
   * Formatear fecha para mostrar
   * @param fecha - Fecha en formato string
   * @returns Fecha formateada
   */
  formatearFecha(fecha: string): string {
    try {
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return fecha;
    }
  }

  /**
   * Validar si un valor está vacío o es nulo
   * @param valor - Valor a validar
   * @returns true si está vacío, false en caso contrario
   */
  esValorVacio(valor: any): boolean {
    return !valor || valor.toString().trim() === '';
  }
}