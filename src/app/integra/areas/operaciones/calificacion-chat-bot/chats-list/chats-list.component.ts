import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Subject, forkJoin, of } from 'rxjs';
import { takeUntil, catchError, map } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';
import { 
  AlumnoAgrupado, 
  NoAlumnoAgrupado, 
  ChatbotMensajeDTO,
  DATE_FORMAT_OPTIONS, 
  STATUS_COLORS,
  TipoOrigen
} from '../models/models';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.scss']
})
export class ChatsListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() alumno?: AlumnoAgrupado;
  @Input() noAlumno?: NoAlumnoAgrupado;
  @Input() tipoOrigen!: TipoOrigen;
  
  @Output() selectChat = new EventEmitter<any>(); // Emite el objeto completo del hilo
  @Output() backToList = new EventEmitter<void>();

  hilosAgrupados: any[] = [];
  isLoading = false;
  displayedColumns: string[] = ['idHilo', 'fechaCreacion', 'totalMensajes', 'primerMensaje', 'estado', 'actions'];

  readonly TipoOrigen = TipoOrigen;
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly chatService: ChatService) {}

  ngOnInit(): void {
    this.loadHilos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Recargar hilos cuando cambian los datos de alumno o noAlumno
    // Esto asegura que se recargue después de una calificación
    if ((changes['alumno'] && !changes['alumno'].firstChange) || 
        (changes['noAlumno'] && !changes['noAlumno'].firstChange)) {
      this.loadHilos();
    }
  }

  /**
   * Método público para recargar los hilos externamente
   * Útil cuando se necesita refrescar después de una calificación
   */
  recargarHilos(): void {
    this.loadHilos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga los hilos según el tipo de origen
   * Principio: Single Responsibility - método dedicado a cargar datos
   */
  loadHilos(): void {
    this.isLoading = true;
    
    if (this.tipoOrigen === TipoOrigen.ALUMNO && this.alumno) {
      this.loadHilosAlumno();
    } else if (this.tipoOrigen === TipoOrigen.SEGMENTO && this.noAlumno) {
      this.loadHilosSegmento();
    }
  }

  /**
   * Carga mensajes de un alumno y los agrupa por hilo
   */
  private loadHilosAlumno(): void {
    if (!this.alumno?.idAlumno) return;

    this.chatService.obtenerMensajesPorAlumno$(this.alumno.idAlumno)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const mensajes = response.body || [];
          
          // Cachear todos los mensajes en el servicio
          this.chatService.cachearMensajes(mensajes);
          
          // Agrupar mensajes por hilo para mostrar en la tabla
          this.hilosAgrupados = this.agruparMensajesPorHilo(mensajes);
          
          // Validar el estado real de cada hilo consultando el backend
          this.validarEstadosCalificacion();
        },
        error: () => {
          this.hilosAgrupados = [];
          this.isLoading = false;
        }
      });
  }

  /**
   * Carga mensajes de un segmento y los agrupa por hilo
   */
  private loadHilosSegmento(): void {
    if (!this.noAlumno?.idContactoPortalSegmento) return;

    this.chatService.obtenerMensajesPorSegmento$(this.noAlumno.idContactoPortalSegmento)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const mensajes = response.body || [];
          
          // Cachear todos los mensajes en el servicio
          this.chatService.cachearMensajes(mensajes);
          
          // Agrupar mensajes por hilo para mostrar en la tabla
          this.hilosAgrupados = this.agruparMensajesPorHilo(mensajes);
          
          // Validar el estado real de cada hilo consultando el backend
          this.validarEstadosCalificacion();
        },
        error: () => {
          this.hilosAgrupados = [];
          this.isLoading = false;
        }
      });
  }

  /**
   * Agrupa mensajes por ID de hilo
   * @param mensajes - Array de mensajes
   * @returns Array de hilos agrupados con información resumida
   */
  private agruparMensajesPorHilo(mensajes: ChatbotMensajeDTO[]): any[] {
    const hilosMap = new Map<number, any>();

    mensajes.forEach(mensaje => {
      const idHilo = mensaje.idChatbotPortalHiloChat;

      if (!hilosMap.has(idHilo)) {
        // Buscar datos desde los hilos originales
        const esCalificado = this.obtenerEstadoCalificacion(idHilo);
        const fechaCreacion = this.obtenerFechaCreacion(idHilo);
        
        hilosMap.set(idHilo, {
          idHilo: idHilo,
          totalMensajes: 0,
          primerMensaje: '',
          fechaCreacion: fechaCreacion,  // ✅ Usar fecha del hilo original, no de mensajes
          mensajes: [],
          esCalificado: esCalificado,  // Usar el flag del endpoint
          fechaCalificacion: null
        });
      }

      const hilo = hilosMap.get(idHilo)!;
      hilo.mensajes.push(mensaje);
      hilo.totalMensajes = hilo.mensajes.length;
      
      // Guardar el primer mensaje del alumno como preview
      if (!hilo.primerMensaje && !mensaje.esUsuario) {
        hilo.primerMensaje = mensaje.contenido;
      }
    });

    return Array.from(hilosMap.values());
  }

  /**
   * Obtiene el estado de calificación de un hilo específico
   * @param idHilo - ID del hilo
   * @returns true si está calificado, false si no
   */
  private obtenerEstadoCalificacion(idHilo: number): boolean {
    if (this.alumno && this.alumno.hilos) {
      const hilo = this.alumno.hilos.find(h => h.idChatbotPortalHiloChat === idHilo);
      return hilo?.esCalificadoFormulario || false;
    }
    
    if (this.noAlumno && this.noAlumno.hilos) {
      const hilo = this.noAlumno.hilos.find(h => h.id === idHilo);
      return hilo?.esCalificadoFormulario || false;
    }
    
    return false;
  }

  /**
   * Obtiene la fecha de creación de un hilo específico desde los datos originales
   * @param idHilo - ID del hilo
   * @returns Fecha de creación del hilo
   */
  private obtenerFechaCreacion(idHilo: number): Date | null {
    if (this.alumno && this.alumno.hilos) {
      const hilo = this.alumno.hilos.find(h => h.idChatbotPortalHiloChat === idHilo);
      return hilo?.fechaCreacion || null;
    }
    
    if (this.noAlumno && this.noAlumno.hilos) {
      const hilo = this.noAlumno.hilos.find(h => h.id === idHilo);
      return hilo?.fechaCreacion || null;
    }
    
    return null;
  }

  /**
   * Valida el estado real de calificación de cada hilo consultando el backend
   * Actualiza el flag esCalificado con la información real
   */
  private validarEstadosCalificacion(): void {
    if (this.hilosAgrupados.length === 0) {
      this.isLoading = false;
      return;
    }

    // Crear array de observables para consultar el estado de cada hilo
    const consultas = this.hilosAgrupados.map(hilo => 
      this.chatService.obtenerRespuestasFormularioAplicado$(hilo.idHilo).pipe(
        map(response => {
          const respuestas = response.body || [];
          return {
            idHilo: hilo.idHilo,
            esCalificado: respuestas.length > 0,
            fechaCalificacion: respuestas.length > 0 ? respuestas[0]?.fechaCreacion : null
          };
        }),
        catchError(error => {
          console.error(`Error validando hilo ${hilo.idHilo}:`, error);
          // En caso de error, mantener el valor original
          return of({
            idHilo: hilo.idHilo,
            esCalificado: hilo.esCalificado,
            fechaCalificacion: hilo.fechaCalificacion
          });
        })
      )
    );

    // Ejecutar todas las consultas en paralelo
    forkJoin(consultas)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resultados) => {
          // Actualizar el estado de cada hilo con la información real del backend
          resultados.forEach(resultado => {
            const hilo = this.hilosAgrupados.find(h => h.idHilo === resultado.idHilo);
            if (hilo) {
              hilo.esCalificado = resultado.esCalificado;
              hilo.fechaCalificacion = resultado.fechaCalificacion;
            }
          });
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error validando estados de calificación:', error);
          this.isLoading = false;
        }
      });
  }

  /**
   * Emite el objeto completo del hilo seleccionado para ver sus mensajes
   */
  onSelectHilo(hilo: any): void {
    this.selectChat.emit(hilo);
  }

  /**
   * Vuelve a la lista principal
   */
  onBack(): void {
    this.backToList.emit();
  }

  /**
   * Obtiene el título según el tipo de origen
   */
  getTitulo(): string {
    if (this.tipoOrigen === TipoOrigen.ALUMNO && this.alumno) {
      return `Chats de ${this.alumno.nombreAlumno} - ${this.alumno.codigoMatricula}`;
    } else if (this.tipoOrigen === TipoOrigen.SEGMENTO && this.noAlumno) {
      return `Chats de Contacto: ${this.noAlumno.idContactoPortalSegmento}`;
    }
    return 'Chats';
  }

  /**
   * Obtiene el preview del primer mensaje del alumno
   */
  getPrimerMensajePreview(primerMensaje: string): string {
    if (!primerMensaje) return 'Sin mensajes del alumno';
    return primerMensaje.length > 100 
      ? primerMensaje.substring(0, 100) + '...'
      : primerMensaje;
  }

  /**
   * Formatea la fecha
   */
  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', DATE_FORMAT_OPTIONS);
  }
}