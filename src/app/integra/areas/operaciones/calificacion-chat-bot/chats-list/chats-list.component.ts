import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';
import {
  AlumnoListadoDTO,
  NoAlumnoAgrupado,
  ChatbotMensajeDTO,
  HiloChatPaginadoDTO,
  TipoOrigen
} from '../models/models';

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.scss']
})
export class ChatsListComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() alumno?: AlumnoListadoDTO;
  @Input() noAlumno?: NoAlumnoAgrupado;
  @Input() tipoOrigen!: TipoOrigen;
  @Input() fechaCorte: Date | null = null;
  @Input() fechaFinInput: Date | null = null;

  @Output() selectChat = new EventEmitter<any>();
  @Output() backToList = new EventEmitter<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<HiloChatPaginadoDTO>([]);
  isLoading = false;
  displayedColumns: string[] = [
    'idHilo', 'fechaCreacion', 'origen',
    'totalMensajes', 'ultimoMensaje', 'estado', 'fechaCalificacion', 'actions'
  ];

  // --- Datepicker: rango para filtrar server-side por fechaCreacion ---
  fechaRangoInicio: Date | null = null;
  fechaRangoFin:    Date | null = null;

  // Filtros client-side adicionales
  estadoFilter = '';
  origenFilter = '';

  totalHilos = 0;

  readonly TipoOrigen = TipoOrigen;
  private readonly destroy$ = new Subject<void>();

  /** Todos los items de la página actual (sin filtro client-side) */
  todosLosHilos: HiloChatPaginadoDTO[] = [];

  constructor(private readonly chatService: ChatService) {}

  ngOnInit(): void {
    if (this.tipoOrigen === TipoOrigen.SEGMENTO) {
      this.loadHilosSegmento();
    } else if (this.tipoOrigen === TipoOrigen.ALUMNO) {
      if (this.fechaCorte) {
        this.fechaRangoInicio = this.fechaCorte;
        this.fechaRangoFin    = this.fechaFinInput;
      } else {
        // Sin fechas (búsqueda por matrícula) → default: último mes → hoy
        this.fechaRangoInicio = this.getDefaultFechaInicio();
        this.fechaRangoFin    = new Date();
      }
      this.loadHilosAlumno();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort      = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const alumnoChanged  = changes['alumno']     && !changes['alumno'].firstChange;
    const noAlumnoChanged = changes['noAlumno']  && !changes['noAlumno'].firstChange;
    const fechaChanged   = changes['fechaCorte'] && !changes['fechaCorte'].firstChange;

    if (alumnoChanged || noAlumnoChanged) {
      this.resetEstado();
      if (this.tipoOrigen === TipoOrigen.SEGMENTO) {
        this.loadHilosSegmento();
      } else if (this.tipoOrigen === TipoOrigen.ALUMNO) {
        if (this.fechaCorte) {
          this.fechaRangoInicio = this.fechaCorte;
          this.fechaRangoFin    = this.fechaFinInput;
        } else {
          this.fechaRangoInicio = this.getDefaultFechaInicio();
          this.fechaRangoFin    = new Date();
        }
        this.loadHilosAlumno();
      }
    }

    if (fechaChanged && this.tipoOrigen === TipoOrigen.ALUMNO) {
      if (this.fechaCorte) {
        this.fechaRangoInicio = this.fechaCorte;
        this.fechaRangoFin    = null;
        this.loadHilosAlumno();
      } else {
        this.resetDatos();
      }
    }
  }

  recargarHilos(): void {
    if (this.tipoOrigen === TipoOrigen.ALUMNO) {
      this.loadHilosAlumno();
    } else {
      this.loadHilosSegmento();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============================================================================
  // DATEPICKER — Rango sobre fechaCreacion (client-side)
  // ============================================================================

  onBuscarHilos(): void {
    if (!this.fechaRangoInicio) return;
    this.loadHilosAlumno();
  }

  limpiarRangoHilos(): void {
    this.fechaRangoInicio = this.fechaCorte;
    this.fechaRangoFin    = null;
    this.loadHilosAlumno();
  }

  // ============================================================================
  // FILTROS CLIENT-SIDE (Estado, Canal, Rango de fechas)
  // ============================================================================

  applyFilters(): void {
    this.applyClientFilters();
  }

  private applyClientFilters(): void {
    let filtered = [...this.todosLosHilos] as any[];

    // Filtro por estado de calificación
    if (this.estadoFilter === 'pendiente') {
      filtered = filtered.filter(h => !h.esCalificado);
    } else if (this.estadoFilter === 'calificado') {
      filtered = filtered.filter(h => h.esCalificado);
    }

    // Filtro por canal
    if (this.origenFilter === 'portal') {
      filtered = filtered.filter(h => h.origen !== 'WhatsApp');
    } else if (this.origenFilter === 'whatsapp') {
      filtered = filtered.filter(h => h.origen === 'WhatsApp');
    }

    // Filtro por rango de fechaCreacion
    if (this.fechaRangoInicio || this.fechaRangoFin) {
      filtered = filtered.filter(h => {
        const fecha = new Date(h.fechaCreacion);
        const desdeOk = !this.fechaRangoInicio || fecha >= this.fechaRangoInicio;
        const hastaOk = !this.fechaRangoFin   || fecha <= this.endOfDay(this.fechaRangoFin);
        return desdeOk && hastaOk;
      });
    }

    this.dataSource.data = filtered;
  }

  private endOfDay(fecha: Date): Date {
    return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 23, 59, 59);
  }

  private getDefaultFechaInicio(): Date {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d;
  }

  // ============================================================================
  // CARGA DE DATOS
  // ============================================================================

  private loadHilosAlumno(): void {
    if (!this.alumno?.idAlumno || !this.fechaRangoInicio) {
      this.resetDatos();
      return;
    }

    this.isLoading = true;

    this.chatService.obtenerHilosPaginados$(
      this.alumno.idAlumno,
      this.fechaRangoInicio,
      1,
      500,
      this.fechaRangoFin
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        const paged = response.body!;
        this.todosLosHilos = paged.items;
        this.totalHilos    = paged.totalCount;
        this.applyClientFilters();
        this.isLoading = false;
      },
      error: () => {
        this.resetDatos();
        this.isLoading = false;
      }
    });
  }

  private loadHilosSegmento(): void {
    if (!this.noAlumno?.idContactoPortalSegmento) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    this.chatService.obtenerMensajesPorSegmento$(this.noAlumno.idContactoPortalSegmento)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const mensajes = response.body || [];
          this.chatService.cachearMensajes(mensajes);
          this.todosLosHilos = this.agruparMensajesPorHilo(mensajes);
          this.totalHilos    = this.todosLosHilos.length;
          this.applyClientFilters();
          this.isLoading = false;
        },
        error: () => {
          this.resetDatos();
          this.isLoading = false;
        }
      });
  }

  private agruparMensajesPorHilo(mensajes: ChatbotMensajeDTO[]): any[] {
    const hilosMap = new Map<number, any>();

    mensajes.forEach(mensaje => {
      const idHilo = mensaje.idChatbotPortalHiloChat;

      if (!hilosMap.has(idHilo)) {
        hilosMap.set(idHilo, {
          idHilo,
          fechaCreacion:     this.obtenerFechaCreacion(idHilo),
          origen:            this.obtenerOrigen(idHilo),
          esCalificado:      this.obtenerEstadoCalificacion(idHilo),
          fechaCalificacion: this.obtenerFechaCalificacion(idHilo),
          mensajes:          [],
        });
      }

      hilosMap.get(idHilo)!.mensajes.push(mensaje);
    });

    return Array.from(hilosMap.values()).map(hilo => {
      const ultimo = hilo.mensajes[hilo.mensajes.length - 1];
      return {
        ...hilo,
        totalMensajes: hilo.mensajes.length,
        ultimoMensaje: ultimo?.contenido ?? null,
      };
    });
  }

  private obtenerEstadoCalificacion(idHilo: number): boolean {
    if (this.noAlumno?.hilos) {
      const hilo = this.noAlumno.hilos.find(h => h.id === idHilo);
      return hilo?.esCalificadoFormulario || false;
    }
    return false;
  }

  private obtenerFechaCreacion(idHilo: number): Date | null {
    if (this.noAlumno?.hilos) {
      const hilo = this.noAlumno.hilos.find(h => h.id === idHilo);
      return hilo?.fechaCreacion || null;
    }
    return null;
  }

  private obtenerFechaCalificacion(idHilo: number): Date | null {
    if (this.noAlumno?.hilos) {
      const hilo = this.noAlumno.hilos.find(h => h.id === idHilo);
      return hilo?.fechaCalificacion || null;
    }
    return null;
  }

  private obtenerOrigen(idHilo: number): string {
    return 'Portal Web'; // Segmentos: solo Portal Web por ahora
  }

  // ============================================================================
  // HELPERS
  // ============================================================================

  private resetEstado(): void {
    this.fechaRangoInicio = null;
    this.fechaRangoFin    = null;
    this.estadoFilter     = '';
    this.origenFilter     = '';
    this.resetDatos();
  }

  private resetDatos(): void {
    this.todosLosHilos   = [];
    this.dataSource.data = [];
    this.totalHilos      = 0;
  }

  getOrigenClass(origen: string): string {
    return origen === 'WhatsApp' ? 'whatsapp' : 'portal';
  }

  onSelectHilo(hilo: any): void {
    this.selectChat.emit(hilo);
  }

  onBack(): void {
    this.backToList.emit();
  }

  getTitulo(): string {
    if (this.tipoOrigen === TipoOrigen.ALUMNO && this.alumno) {
      return `Chats de ${this.alumno.nombreAlumno} - ${this.alumno.codigoMatricula}`;
    } else if (this.tipoOrigen === TipoOrigen.SEGMENTO && this.noAlumno) {
      return `Chats de Contacto: ${this.noAlumno.idContactoPortalSegmento}`;
    }
    return 'Chats';
  }
}
