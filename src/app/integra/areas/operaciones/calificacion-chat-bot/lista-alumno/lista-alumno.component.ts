import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';
import {
  AlumnoListadoDTO,
  SegmentoListadoDTO,
  AreaDerivacionCodigo,
  AREA_DERIVACION_LABELS,
  AREA_DERIVACION_NO_DEFINIDO,
  STATUS_COLORS
} from '../models/models';

@Component({
  selector: 'app-lista-alumno',
  templateUrl: './lista-alumno.component.html',
  styleUrls: ['./lista-alumno.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' }
  ]
})
export class ListaAlumnoComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() selectStudent = new EventEmitter<any>();
  @Output() fechaCorteChange = new EventEmitter<Date | null>();
  @Output() fechaFinChange = new EventEmitter<Date | null>();
  @ViewChild('paginatorAlumnos', { static: false }) paginatorAlumnos!: MatPaginator;
  @ViewChild('paginatorNoAlumnos', { static: false }) paginatorNoAlumnos!: MatPaginator;

  // Datos alumnos — server-side pagination
  dataSourceAlumnos = new MatTableDataSource<AlumnoListadoDTO>([]);
  alumnosCurrentPage: AlumnoListadoDTO[] = [];
  totalAlumnos = 0;
  currentPageAlumnos = 1;
  pageSizeAlumnos = 20;
  hasLoadedOnce = false;
  hasLoadedOnceNoAlumnos = false;

  displayedColumnsAlumnos: string[] = [
    'nombreAlumno',
    'codigoMatricula',
    'estadoMatricula',
    'codigoAreaDerivacion',
    'totalChats',
    'pendientesCalificacion',
    'actions'
  ];

  // Datos para no alumnos — server-side pagination
  dataSourceNoAlumnos = new MatTableDataSource<SegmentoListadoDTO>([]);
  segmentosCurrentPage: SegmentoListadoDTO[] = [];
  totalNoAlumnos = 0;
  currentPageNoAlumnos = 1;
  pageSizeNoAlumnos = 20;
  displayedColumnsNoAlumnos: string[] = [
    'idContactoPortalSegmento',
    'codigoAreaDerivacion',
    'totalChats',
    'pendientesCalificacion',
    'actions'
  ];

  // Tab activo
  selectedTabIndex = 0;

  // Filtros locales (se aplican sobre la página actual del servidor)
  searchTerm = '';
  searchField = 'nombre';
  areaDerivacionFilter: string[] = [];
  readonly areaDerivacionLabels: Record<string, string> = {
    'no-derivado': 'No Derivado',
    '1': 'Atención al Cliente',
    '2': 'Comercial',
    'no-definido': 'No Definido'
  };
  estadoCalificacionFilter = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  pageSizeOptions: number[] = [10, 20, 50, 100];
  pageSize = 20;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly chatService: ChatService,
    private readonly dateAdapter: DateAdapter<Date>
  ) {}

  ngOnInit(): void {
    this.dateAdapter.setLocale('es-PE');
    this.chatService.alumnosListado$
      .pipe(takeUntil(this.destroy$))
      .subscribe(alumnos => {
        this.alumnosCurrentPage = alumnos;
        this.applyLocalFiltersAlumnos();
      });

    this.chatService.totalAlumnos$
      .pipe(takeUntil(this.destroy$))
      .subscribe(total => {
        this.totalAlumnos = total;
        if (this.paginatorAlumnos) {
          this.paginatorAlumnos.length = total;
        }
      });

    this.chatService.segmentosListado$
      .pipe(takeUntil(this.destroy$))
      .subscribe(segmentos => {
        this.segmentosCurrentPage = segmentos;
        this.applyFiltersNoAlumnos();
      });

    this.chatService.totalSegmentos$
      .pipe(takeUntil(this.destroy$))
      .subscribe(total => {
        this.totalNoAlumnos = total;
        if (this.paginatorNoAlumnos) {
          this.paginatorNoAlumnos.length = total;
        }
      });
  }

  ngAfterViewInit(): void {
    this.paginatorAlumnos.page
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: PageEvent) => {
        this.currentPageAlumnos = event.pageIndex + 1;
        this.pageSizeAlumnos = event.pageSize;
        this.loadAlumnos();
      });

    this.paginatorNoAlumnos.page
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: PageEvent) => {
        this.currentPageNoAlumnos = event.pageIndex + 1;
        this.pageSizeNoAlumnos = event.pageSize;
        this.loadSegmentos();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAlumnos(): void {
    const codigoMatricula = this.searchField === 'matricula' && this.searchTerm ? this.searchTerm : undefined;
    if (!this.fechaInicio && !codigoMatricula) return;
    this.chatService.loadAlumnosPaginados(
      this.currentPageAlumnos,
      this.pageSizeAlumnos,
      this.fechaInicio,
      this.fechaFin,
      codigoMatricula
    );
  }

  private loadSegmentos(): void {
    if (!this.fechaInicio) return;
    this.chatService.loadSegmentosPaginados(
      this.currentPageNoAlumnos,
      this.pageSizeNoAlumnos,
      this.fechaInicio,
      this.fechaFin
    );
  }

  // ============================================================
  // Filtros locales sobre la página actual
  // ============================================================

  applyLocalFiltersAlumnos(): void {
    let filtered = this.alumnosCurrentPage.filter(alumno => {
      const term = this.searchTerm.toLowerCase();
      let matchSearch = !this.searchTerm;
      if (this.searchTerm) {
        switch (this.searchField) {
          case 'matricula':
            matchSearch = alumno.codigoMatricula.toLowerCase().includes(term);
            break;
          case 'correo':
            matchSearch = alumno.email.toLowerCase().includes(term);
            break;
          default:
            matchSearch = alumno.nombreAlumno.toLowerCase().includes(term);
        }
      }

      const matchArea = this.matchAreaDerivacion(alumno.codigoAreaDerivacion, alumno.derivado, this.areaDerivacionFilter);
      const matchEstado = this.matchEstadoCalificacion(alumno.pendientesCalificacion, alumno.totalChats, this.estadoCalificacionFilter);

      return matchSearch && matchArea && matchEstado;
    });

    this.dataSourceAlumnos.data = filtered;
  }

  applyFiltersNoAlumnos(): void {
    const filtered = this.segmentosCurrentPage.filter(seg => {
      const matchSearch = !this.searchTerm ||
        seg.idContactoPortalSegmento.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchArea = this.matchAreaDerivacion(seg.codigoAreaDerivacion, seg.derivado, this.areaDerivacionFilter);
      const matchEstado = this.matchEstadoCalificacion(seg.pendientesCalificacion, seg.totalChats, this.estadoCalificacionFilter);

      return matchSearch && matchArea && matchEstado;
    });

    this.dataSourceNoAlumnos.data = filtered;
  }

  applyFilters(): void {
    if (this.selectedTabIndex === 0) {
      this.applyLocalFiltersAlumnos();
    } else {
      this.applyFiltersNoAlumnos();
    }
  }

  onSearchFieldChange(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    this.searchTerm = '';
    this.searchField = 'nombre';
    this.areaDerivacionFilter = [];
    this.estadoCalificacionFilter = '';
    this.applyFilters();
  }

  onFechaInicioChange(): void {
    if (!this.fechaInicio) {
      this.dataSourceAlumnos.data = [];
      this.totalAlumnos = 0;
      this.hasLoadedOnce = false;
      if (this.paginatorAlumnos) {
        this.paginatorAlumnos.length = 0;
        this.paginatorAlumnos.pageIndex = 0;
      }
      this.fechaCorteChange.emit(null);
    }
    if (this.fechaFin && this.fechaInicio && this.fechaFin < this.fechaInicio) {
      this.fechaFin = null;
    }
  }

  onBuscar(): void {
    if (this.selectedTabIndex === 0) {
      const codigoMatricula = this.searchField === 'matricula' && this.searchTerm ? this.searchTerm : undefined;
      if (!this.fechaInicio && !codigoMatricula) return;
      this.hasLoadedOnce = true;
      this.currentPageAlumnos = 1;
      if (this.paginatorAlumnos) {
        this.paginatorAlumnos.pageIndex = 0;
      }
      this.fechaCorteChange.emit(this.fechaInicio);
      this.fechaFinChange.emit(this.fechaFin);
      this.loadAlumnos();
    } else {
      if (!this.fechaInicio) return;
      this.hasLoadedOnceNoAlumnos = true;
      this.currentPageNoAlumnos = 1;
      if (this.paginatorNoAlumnos) {
        this.paginatorNoAlumnos.pageIndex = 0;
      }
      this.fechaCorteChange.emit(this.fechaInicio);
      this.fechaFinChange.emit(this.fechaFin);
      this.loadSegmentos();
    }
  }

  limpiarFechas(): void {
    this.fechaInicio = null;
    this.fechaFin = null;
    this.alumnosCurrentPage = [];
    this.dataSourceAlumnos.data = [];
    this.totalAlumnos = 0;
    this.segmentosCurrentPage = [];
    this.dataSourceNoAlumnos.data = [];
    this.totalNoAlumnos = 0;
    this.hasLoadedOnce = false;
    this.hasLoadedOnceNoAlumnos = false;
    if (this.paginatorAlumnos) {
      this.paginatorAlumnos.length = 0;
      this.paginatorAlumnos.pageIndex = 0;
    }
    if (this.paginatorNoAlumnos) {
      this.paginatorNoAlumnos.length = 0;
      this.paginatorNoAlumnos.pageIndex = 0;
    }
    this.fechaCorteChange.emit(null);
    this.fechaFinChange.emit(null);
  }

  onSelectAlumno(alumno: AlumnoListadoDTO): void {
    this.selectStudent.emit({ type: 'alumno', data: alumno });
  }

  onSelectNoAlumno(segmento: SegmentoListadoDTO): void {
    this.selectStudent.emit({ type: 'segmento', data: segmento });
  }

  // ============================================================
  // Helpers
  // ============================================================

  getAreaDerivacionNombre(codigoArea?: number, derivado?: boolean): string {
    if (derivado === false) return 'No Derivado';
    if (codigoArea === null || codigoArea === undefined) return AREA_DERIVACION_NO_DEFINIDO;
    return AREA_DERIVACION_LABELS[codigoArea] || AREA_DERIVACION_NO_DEFINIDO;
  }

  getAreaDerivacionColor(codigoArea?: number, derivado?: boolean): string {
    if (derivado === false) return 'default';
    if (codigoArea === null || codigoArea === undefined) return 'error';
    switch (codigoArea) {
      case AreaDerivacionCodigo.ATENCION_CLIENTE: return STATUS_COLORS.SUCCESS;
      case AreaDerivacionCodigo.COMERCIAL: return 'info';
      default: return STATUS_COLORS.WARNING;
    }
  }

  getPendientesColor(pendientes: number, total: number): string {
    if (pendientes === 0) return 'success';
    if (pendientes === total) return 'error';
    return 'warning';
  }

  private matchAreaDerivacion(codigoArea?: number, derivado?: boolean, filtros?: string[]): boolean {
    if (!filtros || filtros.length === 0) return true;
    return filtros.some(filtro => {
      if (filtro === 'no-derivado') return derivado === false;
      if (filtro === '1') return derivado === true && codigoArea === AreaDerivacionCodigo.ATENCION_CLIENTE;
      if (filtro === '2') return derivado === true && codigoArea === AreaDerivacionCodigo.COMERCIAL;
      if (filtro === 'no-definido') {
        if (derivado === false) return false;
        return codigoArea == null
            || (codigoArea !== AreaDerivacionCodigo.ATENCION_CLIENTE
                && codigoArea !== AreaDerivacionCodigo.COMERCIAL);
      }
      return false;
    });
  }

  private matchEstadoCalificacion(pendientes: number, total: number, filtro: string): boolean {
    if (!filtro) return true;
    if (filtro === 'pendientes') return pendientes > 0;
    if (filtro === 'calificados') return pendientes === 0 && total > 0;
    return true;
  }

}
