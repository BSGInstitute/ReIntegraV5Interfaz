import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import { ReporteDashboardService } from '@planificacion/services/reporte-dashboard.service';
import {
  IReporteDashboardResumen,
  IReporteDashboardEstado,
  IReporteDashboardModalidad,
  IReporteDashboardPrograma,
  IReporteDashboardGraficoPorMes,
  IReporteDashboardFiltros,
  IReporteDashboardDocente,
  IReporteDashboardCurso,
  IReporteDashboardSemanal,
  IReporteDashboardCompleto,
  IReporteDashboardFiltroRequest,
  IReporteDashboardProgramaEspecificoItem,
  IChartSeriesItem,
  IReporteDashboardEstadoSesion,
  IReporteDashboardSesionDetalle,
  IReporteDashboardKPIsEstadoSesion,
  IReporteDashboardCambioEstado,
  IReporteDashboardEstadoPorDia,
  IReporteDashboardCursoV3,
  IReporteDashboardSeguimientoClase,
  IReporteDashboardSeguimientoFiltroRequest,
  IReporteDashboardDocenteFiltro,
  IReporteDashboardPEspecificoFiltro,
  IReporteDashboardSeguimientoDocente,
  IReporteDashboardSeguimientoDocentePrograma,
  IReporteDashboardSeguimientoDocenteSesion,
  IReporteDashboardSeguimientoDocenteKPIs,
  IReporteDashboardNotasAlumnos,
  IReporteDashboardNotaAlumnoDetalle
} from '@planificacion/models/interfaces/reporte-dashboard';
import { AlertaService } from '@shared/services/alerta.service';
import { ExcelExportComponent } from '@progress/kendo-angular-excel-export';
import { process, State } from '@progress/kendo-data-query';

/**
 * Dashboard de Programas de Capacitacion
 * Autor: Marco Villanueva Torres
 * Fecha: 2025-04-17
 */
@Component({
  selector: 'app-reporte-dashboard',
  templateUrl: './reporte-dashboard.component.html',
  styleUrls: ['./reporte-dashboard.component.scss']
})
export class ReporteDashboardComponent implements OnInit, OnDestroy {

  @ViewChild('excelExport') excelExport: ExcelExportComponent;
  @ViewChild('excelExportProgramas') excelExportProgramas: ExcelExportComponent;
  @ViewChild('excelExportCursos') excelExportCursos: ExcelExportComponent;
  @ViewChild('excelExportDocentes') excelExportDocentes: ExcelExportComponent;

  private destroy$ = new Subject<void>();

  // Estado de carga
  loading: boolean = true;
  loadingProgramas: boolean = false;
  loadingDocentes: boolean = false;
  loadingCursos: boolean = false;
  loadingSemanal: boolean = false;

  // Datos del dashboard
  resumen: IReporteDashboardResumen = {
    totalProgramasPadre: 0,
    totalProgramasHijo: 0,
    programasLanzamiento: 0,
    programasEjecucion: 0,
    programasFinalizados: 0,
    totalDocentes: 0,
    docentesActivos: 0,
    totalCoordinadores: 0,
    totalSesiones: 0
  };

  // Datos para graficos
  datosEstado: IChartSeriesItem[] = [];
  datosModalidad: IChartSeriesItem[] = [];
  datosPorMes: IReporteDashboardGraficoPorMes[] = [];
  categoriasMeses: string[] = [];
  seriesPorMes: { name: string; data: number[]; color?: string }[] = [];

  // Datos para grafico de resumen semanal
  datosSemanal: IReporteDashboardSemanal[] = [];
  categoriasSemanas: string[] = [];
  seriesSemanal: { name: string; data: number[]; color: string }[] = [];

  // Datos para grillas
  programas: IReporteDashboardPrograma[] = [];
  docentes: IReporteDashboardDocente[] = [];
  cursos: IReporteDashboardCurso[] = [];
  datosCompletos: IReporteDashboardCompleto[] = [];

  // Filtros
  filtros: IReporteDashboardFiltros = {
    anios: [],
    estados: [],
    modalidades: [],
    areas: [],
    ciudades: [],
    programasEspecificos: [],
    centrosCosto: []
  };

  formFiltro: FormGroup;

  // Datos filtrados para los MultiSelect
  filteredProgramasEspecificos: IReporteDashboardProgramaEspecificoItem[] = [];
  filteredCentrosCosto: string[] = [];

  // Colores para graficos
  coloresEstado: { [key: string]: string } = {
    'Lanzamiento': '#28a745',
    'Ejecucion': '#007bff',
    'Finalizado': '#6c757d',
    'Cancelado': '#dc3545',
    'Pendiente': '#ffc107'
  };

  coloresModalidad: string[] = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6f42c1'];

  coloresSemanal: { [key: string]: string } = {
    'Pendientes': '#ffc107',
    'Realizadas': '#28a745',
    'Canceladas': '#dc3545',
    'Reprogramadas': '#17a2b8'
  };

  // Estados de Sesion
  loadingEstadosSesion: boolean = false;
  datosEstadoSesion: IChartSeriesItem[] = [];
  kpisEstadoSesion: IReporteDashboardKPIsEstadoSesion = {
    totalSesiones: 0,
    sesionesEjecutadas: 0,
    sesionesCanceladas: 0,
    sesionesPorReprogramar: 0,
    sesionesAdicionales: 0,
    sesionesPorEjecutar: 0,
    sesionesNoAplica: 0,
    sesionesRecuperadas: 0,
    porcentajeEjecutadas: 0,
    porcentajeCanceladas: 0
  };
  sesionesDetalle: IReporteDashboardSesionDetalle[] = [];
  loadingSesionesDetalle: boolean = false;
  estadoSesionSeleccionado: number | null = null;

  // Colores para estados de sesion
  coloresEstadoSesion: { [key: string]: string } = {
    'Ejecutada': '#28a745',
    'Cancelada': '#dc3545',
    'Por-Reprogramar': '#ffc107',
    'Adicional': '#17a2b8',
    'Por Ejecutar': '#007bff',
    'No Aplica': '#6c757d',
    'Recuperada': '#6f42c1'
  };

  // ── CAMBIOS DE ESTADO (log) ──────────────────────────────────────────────
  loadingCambiosEstado: boolean = false;
  datosCambiosEstado: IReporteDashboardCambioEstado[] = [];
  categoriasCambiosEstado: string[] = [];
  seriesCambiosEstado: { name: string; data: number[]; color: string }[] = [];
  ultimasSemanasCambios: number = 8;

  // ── ESTADOS POR DIA (programas hijo) ─────────────────────────────────────
  loadingEstadosPorDia: boolean = false;
  datosEstadosPorDia: IReporteDashboardEstadoPorDia[] = [];
  categoriasEstadosPorDia: string[] = [];
  seriesEstadosPorDia: { name: string; data: number[]; color?: string }[] = [];
  agrupacionEstadosPorDia: 'DIA' | 'SEMANA' = 'DIA';
  formFiltroEstadosPorDia: FormGroup;

  // ── DETALLE CURSOS V3 (Inhouse/Presencial/Online) ────────────────────────
  loadingCursosV3: boolean = false;
  cursosV3: IReporteDashboardCursoV3[] = [];
  stateCursosV3: State = { skip: 0, take: 10, sort: [{ field: 'fecha', dir: 'desc' }] };
  get gridDataCursosV3(): any { return process(this.cursosV3, this.stateCursosV3); }
  formFiltroCursosV3: FormGroup;
  readonly MODALIDADES_CLASIFICADAS = ['Inhouse', 'Presencial', 'Online'];

  // ── SEGUIMIENTO DE CLASES ────────────────────────────────────────────────
  loadingSeguimiento: boolean = false;
  datosSeguimiento: IReporteDashboardSeguimientoClase[] = [];
  categoriasSeguimiento: string[] = [];
  seriesSeguimiento: { name: string; data: number[]; color: string }[] = [];
  formFiltroSeguimiento: FormGroup;

  readonly coloresSeguimiento: { [key: string]: string } = {
    'Programadas': '#007bff',
    'Ejecutadas':  '#28a745',
    'Canceladas':  '#dc3545',
    'Reprogramadas': '#ffc107'
  };

  // Estado de grilla de sesiones
  stateSesiones: State = {
    skip: 0,
    take: 10,
    sort: [{ field: 'fecha', dir: 'desc' }]
  };

  get gridDataSesiones(): any {
    return process(this.sesionesDetalle, this.stateSesiones);
  }

  // Configuracion de grillas
  pageSize: number = 10;
  pageSizeDocentes: number = 5;
  pageSizeCursos: number = 10;

  // Estado de grillas para filtrado
  stateProgramas: State = {
    skip: 0,
    take: 10,
    sort: [{ field: 'fechaInicio', dir: 'desc' }]
  };

  stateCursos: State = {
    skip: 0,
    take: 10,
    sort: [{ field: 'fecha', dir: 'desc' }]
  };

  stateDocentes: State = {
    skip: 0,
    take: 5,
    sort: [{ field: 'totalSesiones', dir: 'desc' }]
  };

  // Tab principal (dashboard1 / dashboard2)
  activeMainTab: 'dashboard1' | 'dashboard2' = 'dashboard1';

  // Tab activo (grillas dentro de dashboard1)
  activeTab: string = 'programas';

  // Agrupacion temporal para graficas (semana, mes, anio)
  agrupacionTemporal: 'semana' | 'mes' | 'anio' = 'semana';
  opcionesAgrupacion: { value: 'semana' | 'mes' | 'anio'; label: string }[] = [
    { value: 'semana', label: 'Por Semana' },
    { value: 'mes', label: 'Por Mes' },
    { value: 'anio', label: 'Por Año' }
  ];

  // ── DASHBOARD 2: Seguimiento por Docente ─────────────────────────────────
  loadingD2: boolean = false;
  // Filtros
  formFiltroD2: FormGroup;
  docentesFiltro: IReporteDashboardDocenteFiltro[] = [];
  docentesFiltroFiltered: IReporteDashboardDocenteFiltro[] = [];
  pEspecificoFiltro: IReporteDashboardPEspecificoFiltro[] = [];
  pEspecificoFiltroFiltered: IReporteDashboardPEspecificoFiltro[] = [];
  loadingDocentesFiltro: boolean = false;
  loadingPEspecificoFiltro: boolean = false;
  // Datos resultado
  seguimientoDocenteKPIs: IReporteDashboardSeguimientoDocenteKPIs = {
    docente: '', totalProgramas: 0, totalSesiones: 0,
    sesionesEjecutadas: 0, sesionesCanceladas: 0,
    sesionesReprogramadas: 0, sesionesProgramadas: 0,
    porcentajeEjecutadas: 0
  };
  seguimientoDocenteProgramas: IReporteDashboardSeguimientoDocentePrograma[] = [];
  seguimientoDocenteSesiones: IReporteDashboardSeguimientoDocenteSesion[] = [];
  // Grilla sesiones Dashboard 2
  stateD2Sesiones: State = { skip: 0, take: 15, sort: [{ field: 'fecha', dir: 'desc' }] };
  get gridDataD2Sesiones(): any { return process(this.seguimientoDocenteSesiones, this.stateD2Sesiones); }
  stateD2Programas: State = { skip: 0, take: 10, sort: [{ field: 'totalSesiones', dir: 'desc' }] };
  get gridDataD2Programas(): any { return process(this.seguimientoDocenteProgramas, this.stateD2Programas); }
  // Grafico por programa
  seriesD2Programas: { name: string; data: number[]; color: string }[] = [];
  categoriasD2Programas: string[] = [];
  readonly coloresD2: { [key: string]: string } = {
    'Ejecutadas': '#28a745',
    'Canceladas': '#dc3545',
    'Reprogramadas': '#ffc107',
    'Programadas': '#007bff'
  };
  // Notas de alumnos
  notasAlumnos: IReporteDashboardNotasAlumnos | null = null;
  loadingNotas: boolean = false;
  notasDetalleData: IReporteDashboardNotaAlumnoDetalle[] = [];
  stateNotas: State = { skip: 0, take: 15 };
  get gridDataNotas(): any { return process(this.notasDetalleData, this.stateNotas); }

  // Getters para datos procesados de grillas
  get gridDataProgramas(): any {
    return process(this.programas, this.stateProgramas);
  }

  get gridDataCursos(): any {
    return process(this.cursos, this.stateCursos);
  }

  get gridDataDocentes(): any {
    return process(this.docentes, this.stateDocentes);
  }

  constructor(
    private _reporteDashboardService: ReporteDashboardService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder
  ) {
    this.formFiltro = this._formBuilder.group({
      anio: [null],
      estado: [null],
      modalidad: [null],
      area: [null],
      ciudad: [null],
      idsProgramaEspecificoPadre: [[]],
      centrosCostoPadre: [[]]
    });

    this.formFiltroEstadosPorDia = this._formBuilder.group({
      idsPEspecificoHijo: [null],
      estados: [null],
      fechaInicio: [null],
      fechaFin: [null],
      ultimasSemanas: [4]
    });

    this.formFiltroCursosV3 = this._formBuilder.group({
      anio: [new Date().getFullYear()],
      modalidadClasificada: [null],
      semanaInicio: [null],
      semanaFin: [null],
      idProgramaPadre: [null]
    });

    this.formFiltroSeguimiento = this._formBuilder.group({
      estadoCurso: [null],
      fechaInicio: [null],
      fechaFin: [null],
      semanaInicio: [null],
      semanaFin: [null],
      anio: [null]
    });

    this.formFiltroD2 = this._formBuilder.group({
      idDocente: [null],
      idPEspecifico: [null],
      anio: [new Date().getFullYear()],
      fechaInicio: [null],
      fechaFin: [null]
    });
  }

  ngOnInit(): void {
    this.cargarFiltros();
    this.cargarDatosDashboard();
    this.cargarCambiosEstado();
    this.cargarEstadosPorDia();
    this.cargarCursosV3();
    this.cargarSeguimientoClases();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga los valores disponibles para los filtros
   */
  cargarFiltros(): void {
    this._reporteDashboardService.obtenerFiltros$()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<IReporteDashboardFiltros>) => {
          if (response.body) {
            this.filtros = response.body;
            // Inicializar datos filtrados para los MultiSelect
            this.filteredProgramasEspecificos = this.filtros.programasEspecificos.slice(0, 50);
            this.filteredCentrosCosto = this.filtros.centrosCosto.slice(0, 50);

            const anioActual = new Date().getFullYear();
            if (this.filtros.anios.includes(anioActual)) {
              this.formFiltro.get('anio')?.setValue(anioActual);
            } else if (this.filtros.anios.length > 0) {
              this.formFiltro.get('anio')?.setValue(this.filtros.anios[0]);
            }
          }
        },
        error: (error) => {
          this._reporteDashboardService.handleError(error);
        }
      });
  }

  /**
   * Filtra los programas especificos en el MultiSelect
   */
  onFilterProgramas(filter: string): void {
    if (!filter || filter.length < 1) {
      this.filteredProgramasEspecificos = this.filtros.programasEspecificos.slice(0, 50);
    } else {
      const filterLower = filter.toLowerCase();
      this.filteredProgramasEspecificos = this.filtros.programasEspecificos
        .filter(p => p.nombre?.toLowerCase().includes(filterLower))
        .slice(0, 100);
    }
  }

  /**
   * Filtra los centros de costo en el MultiSelect
   */
  onFilterCentrosCosto(filter: string): void {
    if (!filter || filter.length < 1) {
      this.filteredCentrosCosto = this.filtros.centrosCosto.slice(0, 50);
    } else {
      const filterLower = filter.toLowerCase();
      this.filteredCentrosCosto = this.filtros.centrosCosto
        .filter(c => c.toLowerCase().includes(filterLower))
        .slice(0, 100);
    }
  }

  /**
   * Obtiene los filtros actuales del formulario
   */
  private getSelectedFilters(): { idProgramaEspecificoPadre?: number; centroCostoPadre?: string } {
    const idsProgramas = this.formFiltro.get('idsProgramaEspecificoPadre')?.value as number[] || [];
    const centrosCosto = this.formFiltro.get('centrosCostoPadre')?.value as string[] || [];

    return {
      idProgramaEspecificoPadre: idsProgramas.length > 0 ? idsProgramas[0] : undefined,
      centroCostoPadre: centrosCosto.length > 0 ? centrosCosto[0] : undefined
    };
  }

  /**
   * Carga todos los datos del dashboard
   */
  cargarDatosDashboard(): void {
    this.loading = true;
    const anio = this.formFiltro.get('anio')?.value;
    const { idProgramaEspecificoPadre, centroCostoPadre } = this.getSelectedFilters();

    forkJoin({
      resumen: this._reporteDashboardService.obtenerResumen$(anio, idProgramaEspecificoPadre, centroCostoPadre),
      estados: this._reporteDashboardService.obtenerResumenPorEstado$(anio, idProgramaEspecificoPadre, centroCostoPadre),
      modalidades: this._reporteDashboardService.obtenerResumenPorModalidad$(anio, undefined, idProgramaEspecificoPadre, centroCostoPadre),
      graficoPorMes: this._reporteDashboardService.obtenerGraficoPorMes$(anio, idProgramaEspecificoPadre, centroCostoPadre)
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (responses) => {
        // Resumen KPIs
        if (responses.resumen.body) {
          this.resumen = responses.resumen.body;
        }

        // Grafico de estados (pie chart)
        if (responses.estados.body) {
          this.datosEstado = responses.estados.body.map(item => ({
            category: item.estado || 'Sin Estado',
            value: item.cantidadProgramas,
            color: this.coloresEstado[item.estado || ''] || '#6c757d'
          }));
        }

        // Grafico de modalidades (donut chart)
        if (responses.modalidades.body) {
          this.datosModalidad = responses.modalidades.body.map((item, index) => ({
            category: item.modalidad || 'Sin Modalidad',
            value: item.cantidadProgramas,
            color: this.coloresModalidad[index % this.coloresModalidad.length]
          }));
        }

        // Grafico por mes (bar chart)
        if (responses.graficoPorMes.body) {
          this.procesarDatosPorMes(responses.graficoPorMes.body);
        }

        this.loading = false;
        this.cargarProgramas();
        this.cargarDocentes();
        this.cargarResumenSemanal();
        this.cargarEstadosSesion();
      },
      error: (error) => {
        this.loading = false;
        this._reporteDashboardService.handleError(error);
      }
    });
  }

  /**
   * Procesa los datos para el grafico de evolucion mensual
   */
  procesarDatosPorMes(datos: IReporteDashboardGraficoPorMes[]): void {
    const mesesUnicos = [...new Set(datos.map(d => d.mes))].sort((a, b) => a - b);
    this.categoriasMeses = mesesUnicos.map(m => this.getNombreMes(m));

    const estadosUnicos = [...new Set(datos.map(d => d.estadoPadre || 'Sin Estado'))];

    this.seriesPorMes = estadosUnicos.map(estado => {
      const dataEstado = mesesUnicos.map(mes => {
        const item = datos.find(d => d.mes === mes && (d.estadoPadre || 'Sin Estado') === estado);
        return item ? item.cantidadProgramas : 0;
      });
      return {
        name: estado,
        data: dataEstado,
        color: this.coloresEstado[estado] || '#6c757d'
      };
    });
  }

  /**
   * Carga el resumen semanal para el grafico de lineas
   */
  cargarResumenSemanal(): void {
    this.loadingSemanal = true;
    const anio = this.formFiltro.get('anio')?.value;
    const { idProgramaEspecificoPadre, centroCostoPadre } = this.getSelectedFilters();

    this._reporteDashboardService.obtenerResumenSemanal$(anio, undefined, undefined, idProgramaEspecificoPadre, centroCostoPadre)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<IReporteDashboardSemanal[]>) => {
          if (response.body && response.body.length > 0) {
            this.datosSemanal = response.body;
            this.procesarDatosSemanal(response.body);
          } else {
            this.datosSemanal = [];
            this.seriesSemanal = [];
            this.categoriasSemanas = [];
          }
          this.loadingSemanal = false;
        },
        error: (error) => {
          this.loadingSemanal = false;
          this._reporteDashboardService.handleError(error);
        }
      });
  }

  /**
   * Carga los datos de estados de sesion
   */
  cargarEstadosSesion(): void {
    this.loadingEstadosSesion = true;
    const anio = this.formFiltro.get('anio')?.value;
    const { idProgramaEspecificoPadre, centroCostoPadre } = this.getSelectedFilters();

    forkJoin({
      resumen: this._reporteDashboardService.obtenerResumenPorEstadoSesion$(anio, idProgramaEspecificoPadre, centroCostoPadre),
      kpis: this._reporteDashboardService.obtenerKPIsEstadoSesion$(anio, idProgramaEspecificoPadre, centroCostoPadre)
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (responses) => {
        // Grafico de estados de sesion
        if (responses.resumen.body && responses.resumen.body.length > 0) {
          this.datosEstadoSesion = responses.resumen.body.map(item => ({
            category: item.estadoSesion || 'Sin Estado',
            value: item.cantidadSesiones,
            color: this.coloresEstadoSesion[item.estadoSesion || ''] || '#6c757d'
          }));
        } else {
          this.datosEstadoSesion = [];
        }

        // KPIs de estados de sesion
        if (responses.kpis.body) {
          this.kpisEstadoSesion = responses.kpis.body;
        }

        this.loadingEstadosSesion = false;
      },
      error: (error) => {
        this.loadingEstadosSesion = false;
        this._reporteDashboardService.handleError(error);
      }
    });
  }

  /**
   * Carga el detalle de sesiones filtradas por estado
   */
  cargarSesionesDetalle(idEstadoSesion?: number): void {
    this.loadingSesionesDetalle = true;
    this.estadoSesionSeleccionado = idEstadoSesion || null;
    const anio = this.formFiltro.get('anio')?.value;
    const { idProgramaEspecificoPadre, centroCostoPadre } = this.getSelectedFilters();

    this._reporteDashboardService.obtenerSesionesPorEstado$(anio, idEstadoSesion, idProgramaEspecificoPadre, centroCostoPadre)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<IReporteDashboardSesionDetalle[]>) => {
          this.sesionesDetalle = response.body || [];
          this.loadingSesionesDetalle = false;
        },
        error: (error) => {
          this.loadingSesionesDetalle = false;
          this._reporteDashboardService.handleError(error);
        }
      });
  }

  /**
   * Maneja el click en un segmento del grafico de estados de sesion
   */
  onEstadoSesionClick(event: any): void {
    if (event?.dataItem?.category) {
      // Buscar el idEstadoSesion basado en el nombre
      const estadoNombres: { [key: string]: number } = {
        'Ejecutada': 1,
        'Cancelada': 2,
        'Por-Reprogramar': 3,
        'Adicional': 4,
        'Por Ejecutar': 5,
        'No Aplica': 6,
        'Recuperada': 7
      };
      const idEstado = estadoNombres[event.dataItem.category];
      if (idEstado) {
        this.cargarSesionesDetalle(idEstado);
      }
    }
  }

  /**
   * Maneja cambio de estado en grilla de sesiones
   */
  onStateChangeSesiones(state: State): void {
    this.stateSesiones = state;
  }

  /**
   * Obtiene la clase CSS para el badge de estado de sesion
   */
  getEstadoSesionBadgeClass(estado: string): string {
    const clases: { [key: string]: string } = {
      'Ejecutada': 'bg-success',
      'Cancelada': 'bg-danger',
      'Por-Reprogramar': 'bg-warning text-dark',
      'Adicional': 'bg-info',
      'Por Ejecutar': 'bg-primary',
      'No Aplica': 'bg-secondary',
      'Recuperada': 'bg-purple'
    };
    return clases[estado] || 'bg-secondary';
  }

  /**
   * Procesa los datos para el grafico de resumen semanal
   */
  procesarDatosSemanal(datos: IReporteDashboardSemanal[]): void {
    this.categoriasSemanas = datos.map(d => `S${d.semana}`);

    this.seriesSemanal = [
      {
        name: 'Pendientes',
        data: datos.map(d => d.sesionesPendientes),
        color: this.coloresSemanal['Pendientes']
      },
      {
        name: 'Realizadas',
        data: datos.map(d => d.sesionesRealizadas),
        color: this.coloresSemanal['Realizadas']
      },
      {
        name: 'Canceladas',
        data: datos.map(d => d.sesionesCanceladas),
        color: this.coloresSemanal['Canceladas']
      },
      {
        name: 'Reprogramadas',
        data: datos.map(d => d.sesionesReprogramadas),
        color: this.coloresSemanal['Reprogramadas']
      }
    ];
  }

  /**
   * Cambia la agrupacion temporal de las graficas (semana/mes/anio)
   */
  cambiarAgrupacionTemporal(agrupacion: 'semana' | 'mes' | 'anio'): void {
    if (this.agrupacionTemporal !== agrupacion) {
      this.agrupacionTemporal = agrupacion;
      this.procesarDatosSegunAgrupacion();
    }
  }

  /**
   * Procesa los datos segun la agrupacion temporal seleccionada
   */
  procesarDatosSegunAgrupacion(): void {
    if (this.datosSemanal.length === 0) return;

    switch (this.agrupacionTemporal) {
      case 'semana':
        // Agrupar por semana (datos originales)
        this.categoriasSemanas = this.datosSemanal.map(d => `S${d.semana}`);
        this.seriesSemanal = this.generarSeriesSemanal(this.datosSemanal);
        break;

      case 'mes':
        // Agrupar por mes
        const datosPorMes = this.agruparPorMes(this.datosSemanal);
        this.categoriasSemanas = datosPorMes.map(d => d.label);
        this.seriesSemanal = this.generarSeriesSemanal(datosPorMes.map(d => d.data));
        break;

      case 'anio':
        // Mostrar totales del anio
        const datosAnio = this.agruparPorAnio(this.datosSemanal);
        this.categoriasSemanas = ['Total del Año'];
        this.seriesSemanal = [
          { name: 'Pendientes', data: [datosAnio.sesionesPendientes], color: this.coloresSemanal['Pendientes'] },
          { name: 'Realizadas', data: [datosAnio.sesionesRealizadas], color: this.coloresSemanal['Realizadas'] },
          { name: 'Canceladas', data: [datosAnio.sesionesCanceladas], color: this.coloresSemanal['Canceladas'] },
          { name: 'Reprogramadas', data: [datosAnio.sesionesReprogramadas], color: this.coloresSemanal['Reprogramadas'] }
        ];
        break;
    }
  }

  /**
   * Genera las series de datos para el grafico semanal
   */
  private generarSeriesSemanal(datos: IReporteDashboardSemanal[]): { name: string; data: number[]; color: string }[] {
    return [
      { name: 'Pendientes', data: datos.map(d => d.sesionesPendientes), color: this.coloresSemanal['Pendientes'] },
      { name: 'Realizadas', data: datos.map(d => d.sesionesRealizadas), color: this.coloresSemanal['Realizadas'] },
      { name: 'Canceladas', data: datos.map(d => d.sesionesCanceladas), color: this.coloresSemanal['Canceladas'] },
      { name: 'Reprogramadas', data: datos.map(d => d.sesionesReprogramadas), color: this.coloresSemanal['Reprogramadas'] }
    ];
  }

  /**
   * Agrupa los datos semanales por mes
   */
  private agruparPorMes(datos: IReporteDashboardSemanal[]): { label: string; data: IReporteDashboardSemanal }[] {
    const mesesMap = new Map<number, IReporteDashboardSemanal>();

    datos.forEach(d => {
      const fecha = new Date(d.fechaInicioSemana);
      const mes = fecha.getMonth() + 1;

      if (mesesMap.has(mes)) {
        const existing = mesesMap.get(mes)!;
        existing.totalSesiones += d.totalSesiones;
        existing.sesionesPendientes += d.sesionesPendientes;
        existing.sesionesRealizadas += d.sesionesRealizadas;
        existing.sesionesCanceladas += d.sesionesCanceladas;
        existing.sesionesReprogramadas += d.sesionesReprogramadas;
        existing.programasActivos = Math.max(existing.programasActivos, d.programasActivos);
        existing.docentesActivos = Math.max(existing.docentesActivos, d.docentesActivos);
      } else {
        mesesMap.set(mes, { ...d });
      }
    });

    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return Array.from(mesesMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([mes, data]) => ({ label: meses[mes - 1], data }));
  }

  /**
   * Agrupa los datos semanales por anio (totales)
   */
  private agruparPorAnio(datos: IReporteDashboardSemanal[]): IReporteDashboardSemanal {
    return datos.reduce((acc, d) => ({
      semana: 0,
      fechaInicioSemana: '',
      fechaFinSemana: '',
      totalSesiones: acc.totalSesiones + d.totalSesiones,
      programasActivos: Math.max(acc.programasActivos, d.programasActivos),
      docentesActivos: Math.max(acc.docentesActivos, d.docentesActivos),
      sesionesPendientes: acc.sesionesPendientes + d.sesionesPendientes,
      sesionesRealizadas: acc.sesionesRealizadas + d.sesionesRealizadas,
      sesionesCanceladas: acc.sesionesCanceladas + d.sesionesCanceladas,
      sesionesReprogramadas: acc.sesionesReprogramadas + d.sesionesReprogramadas
    }), {
      semana: 0,
      fechaInicioSemana: '',
      fechaFinSemana: '',
      totalSesiones: 0,
      programasActivos: 0,
      docentesActivos: 0,
      sesionesPendientes: 0,
      sesionesRealizadas: 0,
      sesionesCanceladas: 0,
      sesionesReprogramadas: 0
    });
  }

  /**
   * Carga el listado de programas
   */
  cargarProgramas(): void {
    this.loadingProgramas = true;
    const { anio, estado, modalidad } = this.formFiltro.value;
    const { idProgramaEspecificoPadre, centroCostoPadre } = this.getSelectedFilters();

    this._reporteDashboardService.obtenerProgramasPorEstado$(estado, anio, undefined, undefined, modalidad, idProgramaEspecificoPadre, centroCostoPadre)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<IReporteDashboardPrograma[]>) => {
          this.programas = response.body || [];
          this.loadingProgramas = false;
        },
        error: (error) => {
          this.loadingProgramas = false;
          this._reporteDashboardService.handleError(error);
        }
      });
  }

  /**
   * Carga el listado de cursos/sesiones
   */
  cargarCursos(): void {
    this.loadingCursos = true;
    const anio = this.formFiltro.get('anio')?.value;
    const { idProgramaEspecificoPadre, centroCostoPadre } = this.getSelectedFilters();

    this._reporteDashboardService.obtenerDetalleCursos$(undefined, undefined, undefined, idProgramaEspecificoPadre, anio, centroCostoPadre)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<IReporteDashboardCurso[]>) => {
          this.cursos = response.body || [];
          this.loadingCursos = false;
        },
        error: (error) => {
          this.loadingCursos = false;
          this._reporteDashboardService.handleError(error);
        }
      });
  }

  /**
   * Carga el listado de docentes
   */
  cargarDocentes(): void {
    this.loadingDocentes = true;
    const anio = this.formFiltro.get('anio')?.value;
    const { idProgramaEspecificoPadre, centroCostoPadre } = this.getSelectedFilters();

    this._reporteDashboardService.obtenerDocentesAsignados$(anio, undefined, undefined, false, idProgramaEspecificoPadre, centroCostoPadre)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<IReporteDashboardDocente[]>) => {
          this.docentes = response.body || [];
          this.loadingDocentes = false;
        },
        error: (error) => {
          this.loadingDocentes = false;
          this._reporteDashboardService.handleError(error);
        }
      });
  }

  /**
   * Aplica los filtros y recarga los datos
   */
  aplicarFiltros(): void {
    this.cargarDatosDashboard();
  }

  /**
   * Limpia los filtros
   */
  limpiarFiltros(): void {
    this.formFiltro.reset();
    const anioActual = new Date().getFullYear();
    if (this.filtros.anios.includes(anioActual)) {
      this.formFiltro.get('anio')?.setValue(anioActual);
    }
    this.cargarDatosDashboard();
  }

  /**
   * Cambia el tab activo de grillas
   */
  onTabChange(tab: string): void {
    this.activeTab = tab;
    if (tab === 'cursos' && this.cursos.length === 0) {
      this.cargarCursos();
    }
  }

  /**
   * Maneja el click en un segmento del grafico de estados
   */
  onEstadoClick(event: any): void {
    if (event?.category) {
      this.formFiltro.get('estado')?.setValue(event.category);
      this.cargarProgramas();
    }
  }

  /**
   * Maneja el click en una barra del grafico de modalidades
   */
  onModalidadClick(event: any): void {
    if (event?.category) {
      this.formFiltro.get('modalidad')?.setValue(event.category);
      this.cargarProgramas();
    }
  }

  /**
   * Obtiene el nombre del mes
   */
  getNombreMes(mes: number): string {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return meses[mes - 1] || '';
  }

  /**
   * Formatea fecha para mostrar
   */
  formatearFecha(fecha: Date | string): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  /**
   * Exporta los datos completos a Excel
   */
  exportarExcel(): void {
    if (this.datosCompletos.length > 0) {
      this.excelExport.save();
    } else {
      this._alertaService.notificationInfo('Cargando datos para exportar...');
      this.cargarDatosCompletos();
    }
  }

  /**
   * Exporta los datos de la grilla activa a Excel
   */
  exportarGrillaActual(): void {
    switch (this.activeTab) {
      case 'programas':
        if (this.programas.length > 0) {
          this.excelExportProgramas.save();
        } else {
          this._alertaService.notificationInfo('No hay datos de programas para exportar');
        }
        break;
      case 'cursos':
        if (this.cursos.length > 0) {
          this.excelExportCursos.save();
        } else {
          this._alertaService.notificationInfo('No hay datos de cursos para exportar');
        }
        break;
      case 'docentes':
        if (this.docentes.length > 0) {
          this.excelExportDocentes.save();
        } else {
          this._alertaService.notificationInfo('No hay datos de docentes para exportar');
        }
        break;
    }
  }

  /**
   * Genera el nombre del archivo Excel con fecha
   */
  getNombreArchivoExcel(tipo?: string): string {
    const fecha = new Date();
    const fechaStr = `${fecha.getFullYear()}${(fecha.getMonth() + 1).toString().padStart(2, '0')}${fecha.getDate().toString().padStart(2, '0')}`;
    const anio = this.formFiltro.get('anio')?.value || fecha.getFullYear();

    if (tipo) {
      return `Dashboard_${tipo}_${anio}_${fechaStr}.xlsx`;
    }
    return `Dashboard_Programas_Capacitacion_${anio}_${fechaStr}.xlsx`;
  }

  /**
   * Label para grafico de pie
   */
  public labelContent = (e: any): string => {
    return `${e.category}: ${e.value}`;
  };

  /**
   * Label para grafico de pie con porcentaje
   */
  public labelContentPercent = (e: any): string => {
    const percent = (e.percentage * 100).toFixed(1);
    return `${e.category}\n${percent}%`;
  };

  /**
   * Tooltip para graficos
   */
  public tooltipTemplate = (e: any): string => {
    return `${e.category}: ${e.value} programas`;
  };

  /**
   * Obtiene la clase CSS para el badge de estado
   */
  getEstadoBadgeClass(estado: string): string {
    const clases: { [key: string]: string } = {
      'Lanzamiento': 'bg-success',
      'Ejecucion': 'bg-primary',
      'Finalizado': 'bg-secondary',
      'Cancelado': 'bg-danger',
      'Pendiente': 'bg-warning text-dark'
    };
    return clases[estado] || 'bg-secondary';
  }

  /**
   * Maneja cambio de estado en grilla de programas
   */
  onStateChangeProgramas(state: State): void {
    this.stateProgramas = state;
  }

  /**
   * Maneja cambio de estado en grilla de cursos
   */
  onStateChangeCursos(state: State): void {
    this.stateCursos = state;
  }

  /**
   * Maneja cambio de estado en grilla de docentes
   */
  onStateChangeDocentes(state: State): void {
    this.stateDocentes = state;
  }

  /**
   * Carga los datos completos para exportacion a Excel
   */
  cargarDatosCompletos(): void {
    const { idProgramaEspecificoPadre, centroCostoPadre } = this.getSelectedFilters();
    const filtro: IReporteDashboardFiltroRequest = {
      anio: this.formFiltro.get('anio')?.value,
      estado: this.formFiltro.get('estado')?.value,
      modalidad: this.formFiltro.get('modalidad')?.value,
      idProgramaEspecificoPadre,
      centroCostoPadre
    };

    this._reporteDashboardService.obtenerDatosCompletos$(filtro)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<IReporteDashboardCompleto[]>) => {
          this.datosCompletos = response.body || [];
          if (this.excelExport && this.datosCompletos.length > 0) {
            this.excelExport.save();
          } else if (this.datosCompletos.length === 0) {
            this._alertaService.notificationInfo('No hay datos para exportar');
          }
        },
        error: (error) => {
          this._reporteDashboardService.handleError(error);
        }
      });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CAMBIOS DE ESTADO (log)
  // ═══════════════════════════════════════════════════════════════════════════

  cargarCambiosEstado(): void {
    this.loadingCambiosEstado = true;
    this._reporteDashboardService.obtenerCambiosEstado$(this.ultimasSemanasCambios)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<IReporteDashboardCambioEstado[]>) => {
          this.datosCambiosEstado = response.body || [];
          this.procesarDatosCambiosEstado(this.datosCambiosEstado);
          this.loadingCambiosEstado = false;
        },
        error: (error) => {
          this.loadingCambiosEstado = false;
          this._reporteDashboardService.handleError(error);
        }
      });
  }

  procesarDatosCambiosEstado(datos: IReporteDashboardCambioEstado[]): void {
    this.categoriasCambiosEstado = datos.map(d =>
      d.esSemanaActual ? `S${d.numeroSemana} (actual)` : `S${d.numeroSemana}`
    );
    this.seriesCambiosEstado = [
      { name: 'Lanzamiento → Ejecución', data: datos.map(d => d.lanzamientoAEjecucion), color: '#28a745' },
      { name: 'Ejecución → Concluido',   data: datos.map(d => d.ejecucionAConcluido),   color: '#007bff' },
      { name: '→ Cancelado',             data: datos.map(d => d.aCancelado),             color: '#dc3545' }
    ];
  }

  cambiarUltimasSemanasCambios(semanas: number): void {
    this.ultimasSemanasCambios = semanas;
    this.cargarCambiosEstado();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ESTADOS POR DIA (programas hijo)
  // ═══════════════════════════════════════════════════════════════════════════

  cargarEstadosPorDia(): void {
    this.loadingEstadosPorDia = true;
    const { idsPEspecificoHijo, estados, fechaInicio, fechaFin, ultimasSemanas } = this.formFiltroEstadosPorDia.value;
    const fechaInicioStr = fechaInicio ? new Date(fechaInicio).toISOString().split('T')[0] : undefined;
    const fechaFinStr = fechaFin ? new Date(fechaFin).toISOString().split('T')[0] : undefined;

    this._reporteDashboardService.obtenerEstadosPorDia$(
      idsPEspecificoHijo || undefined,
      estados ? estados.join(',') : undefined,
      this.agrupacionEstadosPorDia,
      fechaInicioStr,
      fechaFinStr,
      ultimasSemanas || undefined
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: HttpResponse<IReporteDashboardEstadoPorDia[]>) => {
        this.datosEstadosPorDia = response.body || [];
        this.procesarDatosEstadosPorDia(this.datosEstadosPorDia);
        this.loadingEstadosPorDia = false;
      },
      error: (error) => {
        this.loadingEstadosPorDia = false;
        this._reporteDashboardService.handleError(error);
      }
    });
  }

  procesarDatosEstadosPorDia(datos: IReporteDashboardEstadoPorDia[]): void {
    // Usar string crudo para evitar desplazamiento UTC en new Date()
    const toKey = (d: IReporteDashboardEstadoPorDia): string =>
      this.agrupacionEstadosPorDia === 'SEMANA'
        ? `S${d.numeroSemana}`
        : d.fecha ? String(d.fecha).substring(0, 10) : '';

    const categoriasSet = [...new Set(datos.map(d => toKey(d)))].filter(Boolean);
    this.categoriasEstadosPorDia = categoriasSet;

    const estadosUnicos = [...new Set(datos.map(d => d.estado))].filter(Boolean);
    this.seriesEstadosPorDia = estadosUnicos.map(estado => ({
      name: estado,
      data: categoriasSet.map(cat => {
        const item = datos.find(d => toKey(d) === cat && d.estado === estado);
        return item ? item.cantidadSesiones : 0;
      }),
      color: this.coloresEstado[estado] || undefined
    }));
  }

  cambiarAgrupacionEstadosPorDia(agrupacion: 'DIA' | 'SEMANA'): void {
    this.agrupacionEstadosPorDia = agrupacion;
    this.cargarEstadosPorDia();
  }

  aplicarFiltroEstadosPorDia(): void {
    this.cargarEstadosPorDia();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DETALLE CURSOS V3 (Inhouse / Presencial / Online)
  // ═══════════════════════════════════════════════════════════════════════════

  cargarCursosV3(): void {
    this.loadingCursosV3 = true;
    const { anio, modalidadClasificada, semanaInicio, semanaFin, idProgramaPadre } = this.formFiltroCursosV3.value;

    this._reporteDashboardService.obtenerDetalleCursosV3$(
      undefined, undefined, undefined,
      idProgramaPadre || undefined,
      anio || undefined,
      undefined,
      modalidadClasificada || undefined,
      semanaInicio || undefined,
      semanaFin || undefined
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: HttpResponse<IReporteDashboardCursoV3[]>) => {
        this.cursosV3 = response.body || [];
        this.loadingCursosV3 = false;
      },
      error: (error) => {
        this.loadingCursosV3 = false;
        this._reporteDashboardService.handleError(error);
      }
    });
  }

  aplicarFiltroCursosV3(): void {
    this.cargarCursosV3();
  }

  onStateChangeCursosV3(state: State): void {
    this.stateCursosV3 = state;
  }

  getModalidadClasificadaBadgeClass(modalidad: string): string {
    const clases: { [key: string]: string } = {
      'Inhouse': 'bg-warning text-dark',
      'Presencial': 'bg-success',
      'Online': 'bg-info'
    };
    return clases[modalidad] || 'bg-secondary';
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SEGUIMIENTO DE CLASES (Lunes-Sabado)
  // ═══════════════════════════════════════════════════════════════════════════

  cargarSeguimientoClases(): void {
    this.loadingSeguimiento = true;
    const { estadoCurso, fechaInicio, fechaFin, semanaInicio, semanaFin, anio } = this.formFiltroSeguimiento.value;

    const filtro: IReporteDashboardSeguimientoFiltroRequest = {
      estadoCurso: estadoCurso || undefined,
      fechaInicio: fechaInicio || undefined,
      fechaFin: fechaFin || undefined,
      semanaInicio: semanaInicio || undefined,
      semanaFin: semanaFin || undefined,
      anio: anio || undefined
    };

    this._reporteDashboardService.obtenerSeguimientoClases$(filtro)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<IReporteDashboardSeguimientoClase[]>) => {
          this.datosSeguimiento = response.body || [];
          this.procesarDatosSeguimiento(this.datosSeguimiento);
          this.loadingSeguimiento = false;
        },
        error: (error) => {
          this.loadingSeguimiento = false;
          this._reporteDashboardService.handleError(error);
        }
      });
  }

  procesarDatosSeguimiento(datos: IReporteDashboardSeguimientoClase[]): void {
    // Agrupar por nroDiaSemana (independiente del idioma del servidor SQL)
    const agrupado = new Map<number, IReporteDashboardSeguimientoClase>();
    datos.forEach(d => {
      const nro = d.nroDiaSemana;
      if (!agrupado.has(nro)) {
        agrupado.set(nro, { ...d });
      } else {
        const ex = agrupado.get(nro)!;
        ex.programadas  += d.programadas;
        ex.ejecutadas   += d.ejecutadas;
        ex.canceladas   += d.canceladas;
        ex.reprogramadas += d.reprogramadas;
        ex.totalSesiones += d.totalSesiones;
      }
    });

    // Ordenar por numero de dia (2=Lunes ... 7=Sabado en SQL Server)
    const diasOrdenados = [...agrupado.entries()].sort((a, b) => a[0] - b[0]).map(e => e[1]);

    this.categoriasSeguimiento = diasOrdenados.map(d => d.diaSemana);

    this.seriesSeguimiento = [
      { name: 'Programadas',   data: diasOrdenados.map(d => d.programadas),   color: this.coloresSeguimiento['Programadas'] },
      { name: 'Ejecutadas',    data: diasOrdenados.map(d => d.ejecutadas),    color: this.coloresSeguimiento['Ejecutadas'] },
      { name: 'Canceladas',    data: diasOrdenados.map(d => d.canceladas),    color: this.coloresSeguimiento['Canceladas'] },
      { name: 'Reprogramadas', data: diasOrdenados.map(d => d.reprogramadas), color: this.coloresSeguimiento['Reprogramadas'] }
    ];
  }

  aplicarFiltroSeguimiento(): void {
    this.cargarSeguimientoClases();
  }

  limpiarFiltroSeguimiento(): void {
    this.formFiltroSeguimiento.reset();
    this.cargarSeguimientoClases();
  }

  totalSeguimiento(campo: keyof IReporteDashboardSeguimientoClase): number {
    return this.datosSeguimiento.reduce((acc, d) => acc + (Number(d[campo]) || 0), 0);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DASHBOARD 2: Seguimiento por Docente
  // ═══════════════════════════════════════════════════════════════════════════

  onMainTabChange(tab: 'dashboard1' | 'dashboard2'): void {
    this.activeMainTab = tab;
    if (tab === 'dashboard2' && this.docentesFiltro.length === 0) {
      this.cargarDocentesFiltro();
    }
  }

  cargarDocentesFiltro(busqueda?: string): void {
    this.loadingDocentesFiltro = true;
    this._reporteDashboardService.obtenerDocentesFiltro$(busqueda)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<IReporteDashboardDocenteFiltro[]>) => {
          this.docentesFiltro = response.body || [];
          this.docentesFiltroFiltered = this.docentesFiltro.slice(0, 50);
          this.loadingDocentesFiltro = false;
        },
        error: () => { this.loadingDocentesFiltro = false; }
      });
  }

  onFilterDocentes(filter: string): void {
    if (!filter || filter.length < 2) {
      this.docentesFiltroFiltered = this.docentesFiltro.slice(0, 50);
    } else {
      const fl = filter.toLowerCase();
      this.docentesFiltroFiltered = this.docentesFiltro
        .filter(d => d.nombre?.toLowerCase().includes(fl) || d.razonSocial?.toLowerCase().includes(fl))
        .slice(0, 100);
    }
  }

  onDocenteFilterChange(filter: string): void {
    if (filter && filter.length >= 2) {
      this.cargarDocentesFiltro(filter);
    } else if (!filter) {
      this.cargarDocentesFiltro();
    }
  }

  cargarPEspecificoFiltro(busqueda?: string): void {
    if (!busqueda || busqueda.length < 2) {
      this.pEspecificoFiltroFiltered = this.pEspecificoFiltro.slice(0, 50);
      return;
    }
    this.loadingPEspecificoFiltro = true;
    this._reporteDashboardService.obtenerPEspecificoFiltro$(busqueda)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<IReporteDashboardPEspecificoFiltro[]>) => {
          this.pEspecificoFiltro = response.body || [];
          this.pEspecificoFiltroFiltered = this.pEspecificoFiltro;
          this.loadingPEspecificoFiltro = false;
        },
        error: () => { this.loadingPEspecificoFiltro = false; }
      });
  }

  private readonly _kpisVacio: IReporteDashboardSeguimientoDocenteKPIs = {
    docente: '', totalProgramas: 0, totalSesiones: 0,
    sesionesEjecutadas: 0, sesionesCanceladas: 0,
    sesionesReprogramadas: 0, sesionesProgramadas: 0,
    porcentajeEjecutadas: 0
  };

  buscarSeguimientoDocente(): void {
    const { idDocente, idPEspecifico, anio, fechaInicio, fechaFin } = this.formFiltroD2.value;
    const fi = fechaInicio ? new Date(fechaInicio).toISOString().split('T')[0] : undefined;
    const ff = fechaFin ? new Date(fechaFin).toISOString().split('T')[0] : undefined;
    this.loadingD2 = true;

    this._reporteDashboardService.obtenerSeguimientoDocente$(
      idDocente  || undefined,
      idPEspecifico || undefined,
      anio       || undefined,
      fi, ff
    )
    .pipe(
      takeUntil(this.destroy$),
      finalize(() => { this.loadingD2 = false; })
    )
    .subscribe({
      next: (response: HttpResponse<IReporteDashboardSeguimientoDocente>) => {
        const data = response.body;
        if (data) {
          // kPIs puede llegar null si el SP no devuelve filas en RS1
          this.seguimientoDocenteKPIs = data.kPIs ?? { ...this._kpisVacio };
          this.seguimientoDocenteProgramas = data.programas || [];
          this.seguimientoDocenteSesiones  = data.sesiones  || [];
          this.procesarGraficoD2();
        }
      },
      error: () => {
        this.seguimientoDocenteKPIs = { ...this._kpisVacio };
      }
    });

    // Siempre cargar notas — el SP acepta @IdPEspecifico = NULL
    this.cargarNotasAlumnos(idPEspecifico || undefined);
  }

  cargarNotasAlumnos(idPEspecifico?: number): void {
    this.loadingNotas = true;
    this.notasAlumnos = null;
    this.notasDetalleData = [];
    this._reporteDashboardService.obtenerNotasAlumnosPorPrograma$(idPEspecifico)
    .pipe(
      takeUntil(this.destroy$),
      finalize(() => { this.loadingNotas = false; })
    )
    .subscribe({
      next: (response: HttpResponse<IReporteDashboardNotasAlumnos>) => {
        const data = response.body;
        if (data) {
          this.notasAlumnos     = data;
          this.notasDetalleData = data.detalle || [];
        }
      },
      error: () => {}
    });
  }

  onStateChangeNotas(state: State): void {
    this.stateNotas = state;
  }

  limpiarFiltroD2(): void {
    this.formFiltroD2.patchValue({ idDocente: null, idPEspecifico: null, fechaInicio: null, fechaFin: null });
    this.seguimientoDocenteKPIs    = { ...this._kpisVacio };
    this.seguimientoDocenteProgramas = [];
    this.seguimientoDocenteSesiones  = [];
    this.notasAlumnos     = null;
    this.notasDetalleData = [];
    this.buscarSeguimientoDocente();
  }

  private procesarGraficoD2(): void {
    const top10 = this.seguimientoDocenteProgramas.slice(0, 10);
    this.categoriasD2Programas = top10.map(p => p.programa?.length > 25 ? p.programa.substring(0, 25) + '...' : p.programa);
    this.seriesD2Programas = [
      { name: 'Ejecutadas',    data: top10.map(p => p.sesionesEjecutadas),    color: this.coloresD2['Ejecutadas'] },
      { name: 'Canceladas',    data: top10.map(p => p.sesionesCanceladas),    color: this.coloresD2['Canceladas'] },
      { name: 'Reprogramadas', data: top10.map(p => p.sesionesReprogramadas), color: this.coloresD2['Reprogramadas'] },
      { name: 'Programadas',   data: top10.map(p => p.sesionesProgramadas),   color: this.coloresD2['Programadas'] }
    ];
  }

  onStateChangeD2Sesiones(state: State): void {
    this.stateD2Sesiones = state;
  }

  onStateChangeD2Programas(state: State): void {
    this.stateD2Programas = state;
  }

  getEstadoSesionColor(idEstado: number): string {
    const mapa: { [k: number]: string } = {
      1: 'bg-success', 2: 'bg-danger', 3: 'bg-warning text-dark',
      5: 'bg-primary', 4: 'bg-info', 6: 'bg-secondary'
    };
    return mapa[idEstado] || 'bg-secondary';
  }
}
