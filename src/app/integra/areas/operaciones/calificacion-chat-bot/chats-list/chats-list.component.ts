import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';
import {
  AlumnoListadoDTO,
  SegmentoListadoDTO,
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
  @Input() noAlumno?: SegmentoListadoDTO;
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
    'totalMensajes', 'intervencionBot', 'ultimoMensaje', 'estado', 'fechaCalificacion', 'actions'
  ];

  // --- Datepicker: rango para filtrar server-side por fechaCreacion ---
  fechaRangoInicio: Date | null = null;
  fechaRangoFin:    Date | null = null;

  // Filtros client-side adicionales
  estadoFilter = '';
  origenFilter = '';

  totalHilos = 0;
  pageIndex = 0;
  pageSize  = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];

  readonly TipoOrigen = TipoOrigen;
  private readonly destroy$ = new Subject<void>();

  /** Todos los items de la página actual (sin filtro client-side) */
  todosLosHilos: HiloChatPaginadoDTO[] = [];

  constructor(private readonly chatService: ChatService) {}

  ngOnInit(): void {
    this.sincronizarRangoDesdeInputs();

    if (this.tipoOrigen === TipoOrigen.SEGMENTO) {
      this.loadHilosSegmento();
    } else if (this.tipoOrigen === TipoOrigen.ALUMNO) {
      this.loadHilosAlumno();
    }
  }

  /** Hidrata fechaRangoInicio/Fin desde los inputs del padre con defaults razonables. */
  private sincronizarRangoDesdeInputs(): void {
    if (this.fechaCorte) {
      this.fechaRangoInicio = this.fechaCorte;
      // Si el padre no tiene fechaFin, default a hoy para que el datepicker no quede vacío
      // y el query server-side tenga ambos lados del rango.
      this.fechaRangoFin    = this.fechaFinInput ?? new Date();
    } else {
      // Sin fechas (búsqueda por matrícula) → default: último mes → hoy
      this.fechaRangoInicio = this.getDefaultFechaInicio();
      this.fechaRangoFin    = new Date();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.paginator.page
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: PageEvent) => {
        this.pageIndex = event.pageIndex;
        this.pageSize  = event.pageSize;
        this.recargarHilos();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const alumnoChanged   = changes['alumno']        && !changes['alumno'].firstChange;
    const noAlumnoChanged = changes['noAlumno']      && !changes['noAlumno'].firstChange;
    const fechaInicioChg  = changes['fechaCorte']    && !changes['fechaCorte'].firstChange;
    const fechaFinChg     = changes['fechaFinInput'] && !changes['fechaFinInput'].firstChange;

    if (alumnoChanged || noAlumnoChanged) {
      this.resetEstado();
      this.sincronizarRangoDesdeInputs();
      this.resetPaginacion();
      this.recargarHilos();
      return;
    }

    if (fechaInicioChg || fechaFinChg) {
      if (this.fechaCorte) {
        this.sincronizarRangoDesdeInputs();
        this.resetPaginacion();
        this.recargarHilos();
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
    this.resetPaginacion();
    this.recargarHilos();
  }

  limpiarRangoHilos(): void {
    this.fechaRangoInicio = this.fechaCorte;
    this.fechaRangoFin    = null;
    this.resetPaginacion();
    this.recargarHilos();
  }

  private resetPaginacion(): void {
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
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
      this.pageIndex + 1,
      this.pageSize,
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
    if (!this.noAlumno?.idContactoPortalSegmento || !this.fechaRangoInicio) {
      this.resetDatos();
      return;
    }

    this.isLoading = true;

    this.chatService.obtenerHilosPaginadosPorSegmento$(
      this.noAlumno.idContactoPortalSegmento,
      this.fechaRangoInicio,
      this.pageIndex + 1,
      this.pageSize,
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
