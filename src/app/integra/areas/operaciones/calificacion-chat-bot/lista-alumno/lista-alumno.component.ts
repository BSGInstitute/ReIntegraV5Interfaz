import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';
import { 
  Student, 
  FilterOptions, 
  RATING_THRESHOLDS, 
  STATUS_COLORS,
  AlumnoAgrupado,
  NoAlumnoAgrupado,
  AreaDerivacionCodigo,
  AREA_DERIVACION_LABELS,
  AREA_DERIVACION_NO_DEFINIDO,
  DATE_FORMAT_OPTIONS
} from '../models/models';

@Component({
  selector: 'app-lista-alumno',
  templateUrl: './lista-alumno.component.html',
  styleUrls: ['./lista-alumno.component.scss']
})
export class ListaAlumnoComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() selectStudent = new EventEmitter<Student>();
  @ViewChild('paginatorAlumnos', { static: false }) paginatorAlumnos!: MatPaginator;
  @ViewChild('paginatorNoAlumnos', { static: false }) paginatorNoAlumnos!: MatPaginator;

  // Datos para alumnos
  alumnosAgrupados: AlumnoAgrupado[] = [];
  dataSourceAlumnos = new MatTableDataSource<AlumnoAgrupado>([]);
  displayedColumnsAlumnos: string[] = [
    'nombreAlumno', 
    'codigoMatricula', 
    'estadoMatricula', 
    'codigoAreaDerivacion',
    'totalChats',
    'pendientesCalificacion',
    'actions'
  ];

  // Datos para no alumnos
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

  // Filtros
  searchTerm = '';
  derivadoFilter = '';
  areaDerivacionFilter = ''; // '' = Todos, 'no-derivado' = No Derivado, '1' = Atención Cliente, '2' = Comercial
  estadoCalificacionFilter = ''; // '' = Todos, 'calificados' = Calificados, 'pendientes' = Pendientes

  // Configuración de paginación
  pageSizeOptions: number[] = [5, 10, 25, 50, 100];
  pageSize = 10;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.dataSourceAlumnos.paginator = this.paginatorAlumnos;
    this.dataSourceNoAlumnos.paginator = this.paginatorNoAlumnos;
  }

  loadData(): void {
    this.chatService.loadStudents();
    
    this.chatService.alumnosAgrupados$
      .pipe(takeUntil(this.destroy$))
      .subscribe(alumnos => {
        this.alumnosAgrupados = alumnos;
        this.applyFiltersAlumnos();
      });

    this.chatService.noAlumnosAgrupados$
      .pipe(takeUntil(this.destroy$))
      .subscribe(noAlumnos => {
        this.noAlumnosAgrupados = noAlumnos;
        this.applyFiltersNoAlumnos();
      });
  }

  applyFiltersAlumnos(): void {
    let filtered = this.alumnosAgrupados.filter(alumno => {
      // Filtro de búsqueda
      const matchSearch = !this.searchTerm || 
        alumno.nombreAlumno.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        alumno.codigoMatricula.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtro de derivado (legacy - mantener para compatibilidad)
      const matchDerivado = this.derivadoFilter === '' || 
        (this.derivadoFilter === 'true' && alumno.derivado) ||
        (this.derivadoFilter === 'false' && !alumno.derivado);

      // Filtro de área de derivación
      const matchArea = this.matchAreaDerivacion(
        alumno.codigoAreaDerivacion, 
        alumno.derivado, 
        this.areaDerivacionFilter
      );

      // Filtro de estado de calificación
      const pendientes = this.contarPendientesCalificacion(alumno.hilos);
      const matchEstadoCalificacion = this.matchEstadoCalificacion(
        pendientes,
        alumno.totalChats,
        this.estadoCalificacionFilter
      );

      return matchSearch && matchDerivado && matchArea && matchEstadoCalificacion;
    });
    
    // Ordenar: primero los que tienen pendientes, luego los completamente calificados
    filtered = this.ordenarPorPendientes(filtered);
    
    this.dataSourceAlumnos.data = filtered;
    
    // Resetear paginador a primera página
    if (this.paginatorAlumnos) {
      this.paginatorAlumnos.firstPage();
    }
  }

  applyFiltersNoAlumnos(): void {
    let filtered = this.noAlumnosAgrupados.filter(noAlumno => {
      // Filtro de búsqueda
      const matchSearch = !this.searchTerm || 
        noAlumno.idContactoPortalSegmento.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtro de derivado (legacy)
      const matchDerivado = this.derivadoFilter === '' || 
        (this.derivadoFilter === 'true' && noAlumno.derivado) ||
        (this.derivadoFilter === 'false' && !noAlumno.derivado);

      // Filtro de área de derivación
      const matchArea = this.matchAreaDerivacion(
        noAlumno.codigoAreaDerivacion,
        noAlumno.derivado,
        this.areaDerivacionFilter
      );

      // Filtro de estado de calificación
      const pendientes = this.contarPendientesCalificacion(noAlumno.hilos);
      const matchEstadoCalificacion = this.matchEstadoCalificacion(
        pendientes,
        noAlumno.totalChats,
        this.estadoCalificacionFilter
      );

      return matchSearch && matchDerivado && matchArea && matchEstadoCalificacion;
    });
    
    // Ordenar: primero los que tienen pendientes, luego los completamente calificados
    filtered = this.ordenarPorPendientes(filtered);
    
    this.dataSourceNoAlumnos.data = filtered;
    
    // Resetear paginador a primera página
    if (this.paginatorNoAlumnos) {
      this.paginatorNoAlumnos.firstPage();
    }
  }

  applyFilters(): void {
    if (this.selectedTabIndex === 0) {
      this.applyFiltersAlumnos();
    } else {
      this.applyFiltersNoAlumnos();
    }
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    this.searchTerm = '';
    this.derivadoFilter = '';
    this.areaDerivacionFilter = '';
    this.estadoCalificacionFilter = '';
    this.applyFilters();
  }

  /**
   * Emite el evento para ver los hilos de un alumno
   */
  onSelectAlumno(alumno: AlumnoAgrupado): void {
    this.selectStudent.emit({
      type: 'alumno',
      data: alumno
    } as any);
  }

  /**
   * Emite el evento para ver los hilos de un no alumno
   */
  onSelectNoAlumno(noAlumno: NoAlumnoAgrupado): void {
    this.selectStudent.emit({
      type: 'segmento',
      data: noAlumno
    } as any);
  }

  getDerivadoText(derivado: boolean): string {
    return derivado ? 'Sí' : 'No';
  }

  getDerivadoColor(derivado: boolean): string {
    return derivado ? STATUS_COLORS.SUCCESS : STATUS_COLORS.WARNING;
  }

  /**
   * Obtiene el nombre del área de derivación basado en el código
   * @param codigoArea - Código del área de derivación
   * @returns Nombre del área o "No Definido" si es null/undefined
   * 
   * Principio: Single Responsibility - Método dedicado exclusivamente a mapear códigos de área
   */
  getAreaDerivacionNombre(codigoArea?: number, derivado?: boolean): string {
    // Si no está derivado, mostrar "No Derivado"
    if (derivado === false) {
      return 'No Derivado';
    }
    
    // Si está derivado pero sin código de área, mostrar "No Definido"
    if (codigoArea === null || codigoArea === undefined) {
      return AREA_DERIVACION_NO_DEFINIDO;
    }
    
    return AREA_DERIVACION_LABELS[codigoArea] || AREA_DERIVACION_NO_DEFINIDO;
  }

  /**
   * Obtiene el color para el badge del área de derivación
   * @param codigoArea - Código del área de derivación
   * @returns Color del badge según el área
   * 
   * Principio: Open/Closed - Extensible para nuevas áreas sin modificar la lógica base
   */
  getAreaDerivacionColor(codigoArea?: number, derivado?: boolean): string {
    // Si no está derivado, color secundario (gris)
    if (derivado === false) {
      return 'default';
    }
    
    // Si está derivado pero sin código, color de error
    if (codigoArea === null || codigoArea === undefined) {
      return 'error';
    }
    
    // Colores según área
    switch (codigoArea) {
      case AreaDerivacionCodigo.ATENCION_CLIENTE:
        return STATUS_COLORS.SUCCESS;
      case AreaDerivacionCodigo.COMERCIAL:
        return 'info';
      default:
        return STATUS_COLORS.WARNING;
    }
  }

  /**
   * Formatea una fecha según las opciones de formato del sistema
   * @param date - Fecha a formatear
   * @returns Fecha formateada en español
   * 
   * Principio: DRY - Método reutilizable para formateo consistente de fechas
   */
  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', DATE_FORMAT_OPTIONS);
  }

  /**
   * Cuenta cuántos hilos no tienen evaluación (pendientes de calificación)
   * @param hilos - Array de hilos de chat
   * @returns Número de hilos pendientes de calificación
   */
  contarPendientesCalificacion(hilos: any[]): number {
    // Usar esCalificadoFormulario como campo principal
    return hilos.filter(hilo => !hilo.esCalificadoFormulario).length;
  }

  /**
   * Obtiene el número de pendientes de calificación para mostrar en la tabla
   * Funciona tanto para AlumnoAgrupado como NoAlumnoAgrupado
   * @param element - Elemento de la tabla (alumno o no alumno)
   * @returns Número de chats pendientes de calificación
   */
  getPendientesCalificacion(element: AlumnoAgrupado | NoAlumnoAgrupado): number {
    return this.contarPendientesCalificacion(element.hilos);
  }

  /**
   * Verifica si el área de derivación coincide con el filtro seleccionado
   * @param codigoArea - Código del área de derivación
   * @param derivado - Si está derivado
   * @param filtro - Valor del filtro
   * @returns true si coincide con el filtro
   */
  matchAreaDerivacion(codigoArea?: number, derivado?: boolean, filtro?: string): boolean {
    if (!filtro) return true; // Sin filtro, mostrar todos

    if (filtro === 'no-derivado') {
      return derivado === false;
    }

    if (filtro === '1') {
      return derivado === true && codigoArea === AreaDerivacionCodigo.ATENCION_CLIENTE;
    }

    if (filtro === '2') {
      return derivado === true && codigoArea === AreaDerivacionCodigo.COMERCIAL;
    }

    return true;
  }

  /**
   * Verifica si el estado de calificación coincide con el filtro
   * @param pendientes - Número de chats pendientes
   * @param total - Total de chats
   * @param filtro - Valor del filtro ('calificados', 'pendientes', '')
   * @returns true si coincide con el filtro
   */
  matchEstadoCalificacion(pendientes: number, total: number, filtro: string): boolean {
    if (!filtro) return true; // Sin filtro, mostrar todos

    if (filtro === 'pendientes') {
      return pendientes > 0; // Tiene al menos un pendiente
    }

    if (filtro === 'calificados') {
      return pendientes === 0 && total > 0; // Todos calificados
    }

    return true;
  }

  /**
   * Ordena los elementos poniendo primero los que tienen pendientes de calificación
   * @param elementos - Array de elementos a ordenar
   * @returns Array ordenado
   */
  ordenarPorPendientes<T extends AlumnoAgrupado | NoAlumnoAgrupado>(elementos: T[]): T[] {
    return elementos.sort((a, b) => {
      const pendientesA = this.contarPendientesCalificacion(a.hilos);
      const pendientesB = this.contarPendientesCalificacion(b.hilos);

      // Primero: los que tienen pendientes (descendente por cantidad de pendientes)
      if (pendientesA > 0 && pendientesB === 0) return -1;
      if (pendientesA === 0 && pendientesB > 0) return 1;
      
      // Si ambos tienen pendientes, ordenar por cantidad descendente
      if (pendientesA > 0 && pendientesB > 0) {
        return pendientesB - pendientesA;
      }

      // Si ambos están completamente calificados, mantener orden original
      return 0;
    });
  }

  /**
   * Obtiene el color del badge de pendientes según la cantidad
   * @param pendientes - Número de pendientes
   * @param total - Total de chats
   * @returns Clase de color para el badge
   */
  getPendientesColor(pendientes: number, total: number): string {
    if (pendientes === 0) return 'success';
    if (pendientes === total) return 'error';
    return 'warning'; // Parcialmente calificado
  }
}
