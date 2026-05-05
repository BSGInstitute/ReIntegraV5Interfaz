import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';
import {
  AlumnoListadoDTO,
  NoAlumnoAgrupado,
  AreaDerivacionCodigo,
  AREA_DERIVACION_LABELS,
  AREA_DERIVACION_NO_DEFINIDO,
  STATUS_COLORS
} from '../models/models';

@Component({
  selector: 'app-lista-alumno',
  templateUrl: './lista-alumno.component.html',
  styleUrls: ['./lista-alumno.component.scss']
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

  displayedColumnsAlumnos: string[] = [
    'nombreAlumno',
    'codigoMatricula',
    'estadoMatricula',
    'codigoAreaDerivacion',
    'totalChats',
    'pendientesCalificacion',
    'actions'
  ];

  // Datos para no alumnos (sin cambios)
  noAlumnosAgrupados: NoAlumnoAgrupado[] = [];
  dataSourceNoAlumnos = new MatTableDataSource<NoAlumnoAgrupado>([]);
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
  areaDerivacionFilter = '';
  estadoCalificacionFilter = '';
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  pageSizeOptions: number[] = [10, 20, 50, 100];
  pageSize = 20;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.loadNoAlumnos();

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

    this.chatService.noAlumnosAgrupados$
      .pipe(takeUntil(this.destroy$))
      .subscribe(noAlumnos => {
        this.noAlumnosAgrupados = noAlumnos;
        this.applyFiltersNoAlumnos();
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

    this.dataSourceNoAlumnos.paginator = this.paginatorNoAlumnos;
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
    let filtered = this.noAlumnosAgrupados.filter(noAlumno => {
      const matchSearch = !this.searchTerm ||
        noAlumno.idContactoPortalSegmento.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchArea = this.matchAreaDerivacion(noAlumno.codigoAreaDerivacion, noAlumno.derivado, this.areaDerivacionFilter);
      const pendientes = this.contarPendientesNoAlumno(noAlumno);
      const matchEstado = this.matchEstadoCalificacion(pendientes, noAlumno.totalChats, this.estadoCalificacionFilter);

      return matchSearch && matchArea && matchEstado;
    });

    filtered = this.ordenarPorPendientesNoAlumno(filtered);
    this.dataSourceNoAlumnos.data = filtered;

    if (this.paginatorNoAlumnos) {
      this.paginatorNoAlumnos.firstPage();
    }
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
    this.areaDerivacionFilter = '';
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
  }

  limpiarFechas(): void {
    this.fechaInicio = null;
    this.fechaFin = null;
    this.alumnosCurrentPage = [];
    this.dataSourceAlumnos.data = [];
    this.totalAlumnos = 0;
    this.hasLoadedOnce = false;
    if (this.paginatorAlumnos) {
      this.paginatorAlumnos.length = 0;
      this.paginatorAlumnos.pageIndex = 0;
    }
    this.fechaCorteChange.emit(null);
    this.fechaFinChange.emit(null);
  }

  onSelectAlumno(alumno: AlumnoListadoDTO): void {
    this.selectStudent.emit({ type: 'alumno', data: alumno });
  }

  onSelectNoAlumno(noAlumno: NoAlumnoAgrupado): void {
    this.selectStudent.emit({ type: 'segmento', data: noAlumno });
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

  getPendientesNoAlumno(element: NoAlumnoAgrupado): number {
    return this.contarPendientesNoAlumno(element);
  }

  private contarPendientesNoAlumno(noAlumno: NoAlumnoAgrupado): number {
    return noAlumno.hilos.filter(h => !h.esCalificadoFormulario).length;
  }

  private matchAreaDerivacion(codigoArea?: number, derivado?: boolean, filtro?: string): boolean {
    if (!filtro) return true;
    if (filtro === 'no-derivado') return derivado === false;
    if (filtro === '1') return derivado === true && codigoArea === AreaDerivacionCodigo.ATENCION_CLIENTE;
    if (filtro === '2') return derivado === true && codigoArea === AreaDerivacionCodigo.COMERCIAL;
    return true;
  }

  private matchEstadoCalificacion(pendientes: number, total: number, filtro: string): boolean {
    if (!filtro) return true;
    if (filtro === 'pendientes') return pendientes > 0;
    if (filtro === 'calificados') return pendientes === 0 && total > 0;
    return true;
  }

  private ordenarPorPendientesNoAlumno(elementos: NoAlumnoAgrupado[]): NoAlumnoAgrupado[] {
    return elementos.sort((a, b) => {
      const pA = this.contarPendientesNoAlumno(a);
      const pB = this.contarPendientesNoAlumno(b);
      if (pA > 0 && pB === 0) return -1;
      if (pA === 0 && pB > 0) return 1;
      if (pA > 0 && pB > 0) return pB - pA;
      return 0;
    });
  }
}
