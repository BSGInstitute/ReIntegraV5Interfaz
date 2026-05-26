import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { POPUP_CONTAINER } from '@progress/kendo-angular-popup';

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
  IReporteDashboardCentroCostoItem,
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
  INotasPorPEspecificoD2,
  INotaAlumnoD2,
  INotaEvaluacionD2,
  IReporteDashboardPEspecificoPorDocente,
  IFurDashboard3,
} from '@planificacion/models/interfaces/reporte-dashboard';
import { AlertaService } from '@shared/services/alerta.service';
import { ExcelExportComponent } from '@progress/kendo-angular-excel-export';
import { process, State } from '@progress/kendo-data-query';
import { IntegraService } from '@shared/services/integra.service';
import { constApiFinanzas, constApiPlanificacion } from '@environments/constApi';

interface IComboD4 {
  id: number | null;
  nombre: string;
}

interface ICombosProyectoAlumnoD4 {
  obtenerCoordinadorasDocente: IComboD4[];
  obtenerNombreProveedorParaHonorario: IComboD4[];
  obtenerCombo: IComboD4[];
  obtenerProgramaEspecifico: IComboD4[];
}

interface ICodigoMatriculaD4 {
  id: number | null;
  codigoMatricula: string;
}

interface IFiltroProyectoAlumnoD4 {
  idsProgramaEspecifico: number[] | null;
  idsCentroCosto: number[] | null;
  idsDocente: number[] | null;
  idsCoordinadora: number[] | null;
  idCodigoMatricula: number | null;
  idEstadoRevision: number | null;
  fechaInicial: string | Date;
  fechaFin: string | Date;
}

interface IProyectoPresentadoPorAlumnoD4 {
  idEnvio: string;
  programaEspecifico: string;
  centroCosto: string;
  codigoMatricula: string;
  alumno: string;
  nombreArchivo: string;
  enlaceArchivo: string;
  fechaEnvio: string;
  horaEnvio: string;
  fechaCalificacion: string;
  horaCalificacion: string;
  nota: string;
  coordinadorAcademico: string;
  docente: string;
  responsableCoordinacion: string;
  nroEnvio: string;
  comentarios: string;
  docenteCalificacion: string;
  responsableCoordinacionDocenteCalificacion: string;
  nombreArchivoRetroalimentacion: string;
  urlArchivoSubidoRetroalimentacion: string;
  estadoDevuelto: boolean | null;
  estadoCalificacion: string | null;
  subEstadoCalificacion: string | null;
  estadoEntrega: string | null;
  subEstadoEntrega: string | null;
  estadoRevisionProyecto: string | null;
  plazoCargaRevision: string | null;
  fechaEnvioOriginal: string | null;
  fechaCalificacionOriginal: string | null;
}

interface IDashboardEstadoResumenD4 {
  codigo: string;
  nombre: string;
  cantidad: number;
  porcentaje: number;
  descripcion: string;
  color: string;
}

interface IDashboardFilaD4 {
  nombre: string;
  cantidad: number;
  porcentaje: number;
  tiempoPromedioRevision?: number | null;
  esEstado?: boolean;
  nivel?: number;
  color?: string;
}

interface IDashboardTablaD4 {
  titulo: string;
  total: number;
  totalEntregados?: number;
  filas: IDashboardFilaD4[];
  estados?: IDashboardEstadoResumenD4[];
  distribucion?: IDashboardFilaD4[];
  mostrarTiempoRevision?: boolean;
}

interface IDashboardEstructuraCalificacionD4 {
  estado: string;
  subEstados: string[];
}

interface IDashboardEstructuraEntregaD4 {
  estado: string;
  subEstados: string[];
}

interface IDashboardFiltroEstadoD4 {
  codigo: string;
  nombre: string;
  estado: string | null;
  subEstado?: string | null;
  cantidad: number;
  color: string;
}

interface IFiltrosInternosDashboardD4 {
  programas: string[];
  centrosCosto: string[];
  docentes: string[];
  fechaInicio: Date | null;
  fechaFin: Date | null;
}

interface IDashboardDocenteD4 {
  docente: string;
  programa: string;
  total: number;
  tiempoPromedio: number | null;
  segmentos: IDashboardFilaD4[];
}

/**
 * Dashboard de Programas de Capacitacion
 * Autor: Marco Villanueva Torres
 * Fecha: 2025-04-17
 */
@Component({
  selector: 'app-reporte-dashboard',
  templateUrl: './reporte-dashboard.component.html',
  styleUrls: ['./reporte-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: POPUP_CONTAINER,
    useFactory: () => ({ nativeElement: document.body } as ElementRef)
  }]
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
  filteredCentrosCosto: IReporteDashboardCentroCostoItem[] = [];
  filteredProgramasV3: IReporteDashboardProgramaEspecificoItem[] = [];

  // Paleta de colores distintos para estados sin mapeo explícito
  private readonly _paletaEstados: string[] = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1',
    '#14b8a6', '#a855f7', '#fb923c', '#22c55e', '#e11d48'
  ];

  // Colores para graficos — incluye variantes con/sin tilde
  coloresEstado: { [key: string]: string } = {
    'Lanzamiento':  '#10b981',
    'Ejecucion':    '#3b82f6',
    'Ejecución':    '#3b82f6',
    'En Ejecucion': '#3b82f6',
    'En Ejecución': '#3b82f6',
    'Finalizado':   '#8b5cf6',
    'Concluido':    '#8b5cf6',
    'Cancelado':    '#ef4444',
    'Pendiente':    '#f59e0b',
    'Sin Estado':   '#94a3b8',
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

  // Tabla V3 — filtro, orden y paginación client-side
  filtroTablaV3: string = '';
  filtroColV3: { [k: string]: string } = {};
  ordenV3Campo: string = 'fecha';
  ordenV3Dir: 'asc' | 'desc' = 'desc';
  paginaV3: number = 1;
  tamPaginaV3: number = 20;
  expandedRowsV3 = new Set<number>();

  get cursosV3Filtrados(): IReporteDashboardCursoV3[] {
    let datos = this.cursosV3;
    const txt = (this.filtroTablaV3 ?? '').toLowerCase().trim();
    if (txt) {
      const campos = ['modalidadClasificada', 'centroCostoPadre', 'programaEspecificoPadre',
        'centroCostoHijo', 'curso', 'estadoSesion', 'docente', 'sede', 'diaSemana',
        'horario', 'aula', 'observacion'];
      datos = datos.filter(r => campos.some(k => String((r as any)[k] ?? '').toLowerCase().includes(txt)));
    }
    Object.entries(this.filtroColV3).forEach(([k, v]) => {
      if (v?.trim()) {
        const vl = v.toLowerCase().trim();
        datos = datos.filter(r => String((r as any)[k] ?? '').toLowerCase().includes(vl));
      }
    });
    const campo = this.ordenV3Campo;
    const dir = this.ordenV3Dir;
    return [...datos].sort((a: any, b: any) =>
      dir === 'asc'
        ? String(a[campo] ?? '').localeCompare(String(b[campo] ?? ''))
        : String(b[campo] ?? '').localeCompare(String(a[campo] ?? ''))
    );
  }

  get cursosV3Paginados(): IReporteDashboardCursoV3[] {
    const inicio = (this.paginaV3 - 1) * this.tamPaginaV3;
    return this.cursosV3Filtrados.slice(inicio, inicio + this.tamPaginaV3);
  }

  get totalPaginasV3(): number {
    return Math.max(1, Math.ceil(this.cursosV3Filtrados.length / this.tamPaginaV3));
  }

  get paginasV3(): number[] {
    const total = this.totalPaginasV3;
    const curr = this.paginaV3;
    const pages: number[] = [];
    for (let i = Math.max(1, curr - 2); i <= Math.min(total, curr + 2); i++) { pages.push(i); }
    return pages;
  }

  minV3(a: number, b: number): number { return Math.min(a, b); }

  // ── SEGUIMIENTO DE CLASES ────────────────────────────────────────────────
  loadingSeguimiento: boolean = false;
  datosSeguimiento: IReporteDashboardSeguimientoClase[] = [];
  categoriasSeguimiento: string[] = [];
  seriesSeguimiento: { name: string; data: number[]; color: string }[] = [];
  formFiltroSeguimiento: FormGroup;

  readonly coloresSeguimiento: { [key: string]: string } = {
    'Por Ejecutar': '#007bff',
    'Ejecutadas':   '#28a745',
    'Canceladas':   '#dc3545',
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

  // Tab principal (dashboard1 / dashboard2 / dashboard3 / dashboard4)
  activeMainTab: 'dashboard1' | 'dashboard2' | 'dashboard3' | 'dashboard4' = 'dashboard1';

  // Flags de inicialización: una vez cargado el tab, el DOM se mantiene vivo
  // y solo se oculta/muestra con [hidden] para evitar destruir/recrear charts
  dashboard2Initialized = false;
  dashboard3Initialized = false;
  dashboard4Initialized = false;

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
  pEspecificoPorDocenteFiltro: IReporteDashboardPEspecificoPorDocente[] = [];
  loadingDocentesFiltro: boolean = false;
  loadingPEspecificoFiltro: boolean = false;
  loadingPEspecificoPorDocente: boolean = false;
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
  // ── Dashboard 3: FURs ─────────────────────────────────────────────────────
  loadingD3: boolean = false;
  fursDashboard3: IFurDashboard3[] = [];
  stateD3: State = { skip: 0, take: 20, sort: [], filter: { logic: 'and', filters: [] } };
  get gridDataD3(): any { return process(this.fursDashboard3, this.stateD3); }

  // Tabla FURs — filtro, orden y paginación client-side
  filtroTablaD3: string = '';
  filtroColD3: { [k: string]: string } = {};
  ordenD3Campo: string = 'fechaCreacion';
  ordenD3Dir: 'asc' | 'desc' = 'desc';
  paginaD3: number = 1;
  tamPaginaD3: number = 20;
  expandedRowsD3 = new Set<number>();

  get fursD3Filtrados(): IFurDashboard3[] {
    let datos = this.fursDashboard3;
    const txt = (this.filtroTablaD3 ?? '').toLowerCase().trim();
    if (txt) {
      const campos = ['codigo', 'centroCosto', 'programa', 'razonSocial', 'producto',
        'descripcion', 'faseAprobacion1', 'monedaPagoReal', 'observaciones', 'usuarioCreacion'];
      datos = datos.filter(r => campos.some(k => String((r as any)[k] ?? '').toLowerCase().includes(txt)));
    }
    Object.entries(this.filtroColD3).forEach(([k, v]) => {
      if (v?.trim()) {
        const vl = v.toLowerCase().trim();
        datos = datos.filter(r => String((r as any)[k] ?? '').toLowerCase().includes(vl));
      }
    });
    const campo = this.ordenD3Campo;
    const dir = this.ordenD3Dir;
    return [...datos].sort((a: any, b: any) =>
      dir === 'asc'
        ? String(a[campo] ?? '').localeCompare(String(b[campo] ?? ''))
        : String(b[campo] ?? '').localeCompare(String(a[campo] ?? ''))
    );
  }

  get fursD3Paginados(): IFurDashboard3[] {
    const inicio = (this.paginaD3 - 1) * this.tamPaginaD3;
    return this.fursD3Filtrados.slice(inicio, inicio + this.tamPaginaD3);
  }

  get totalPaginasD3(): number {
    return Math.max(1, Math.ceil(this.fursD3Filtrados.length / this.tamPaginaD3));
  }

  get paginasD3(): number[] {
    const total = this.totalPaginasD3;
    const curr = this.paginaD3;
    const pages: number[] = [];
    for (let i = Math.max(1, curr - 2); i <= Math.min(total, curr + 2); i++) { pages.push(i); }
    return pages;
  }

  minD3(a: number, b: number): number { return Math.min(a, b); }

  // ── Dashboard 4: Proyectos presentados por alumnos ────────────────────────
  loadingD4: boolean = false;
  loadingCombosD4: boolean = false;
  formFiltroD4: FormGroup;
  dataCoordinadorasD4: IComboD4[] = [];
  dataDocentesD4: IComboD4[] = [];
  dataCentroCostoD4: IComboD4[] = [];
  dataPEspecificoD4: IComboD4[] = [];
  filteredCoordinadorasD4: IComboD4[] = [];
  filteredDocentesD4: IComboD4[] = [];
  filteredCentroCostoD4: IComboD4[] = [];
  filteredPEspecificoD4: IComboD4[] = [];
  estadoRevisionD4: IComboD4[] = [
    { nombre: 'Revisado', id: 1 },
    { nombre: 'Pendiente', id: 2 }
  ];
  codigoMatriculaD4: ICodigoMatriculaD4[] = [];
  reporteDashboardBaseD4: IProyectoPresentadoPorAlumnoD4[] = [];
  dashboardCalificacionD4: IDashboardTablaD4 | null = null;
  dashboardEntregaD4: IDashboardTablaD4 | null = null;
  dashboardDocentesD4: IDashboardDocenteD4[] = [];
  dashboardFechaInicioD4: string = '';
  dashboardFechaFinD4: string = '';
  dashboardFiltroEstadoSeleccionadoD4: string = 'todos';
  dashboardFiltrosEstadoD4: IDashboardFiltroEstadoD4[] = [];
  dashboardFiltroEntregaSeleccionadoD4: string = 'todos';
  dashboardFiltrosEntregaD4: IDashboardFiltroEstadoD4[] = [];
  filtrosCalificacionD4 = this.crearFiltrosInternosDashboardD4();
  filtrosEntregaInternosD4 = this.crearFiltrosInternosDashboardD4();
  filtrosDocentesInternosD4 = this.crearFiltrosInternosDashboardD4();
  opcionesProgramaDashboardD4: string[] = [];
  opcionesCentroCostoDashboardD4: string[] = [];
  opcionesDocenteDashboardD4: string[] = [];

  readonly estructuraCalificacionD4: IDashboardEstructuraCalificacionD4[] = [
    { estado: 'Calificado', subEstados: ['Calificado observado', 'Calificado sin observaciones'] },
    { estado: 'Pendiente de revisión', subEstados: ['En plazo', 'Por vencer', 'Vencido'] },
    { estado: 'Sin proyecto (No aplica)', subEstados: ['No entregado aún'] }
  ];

  readonly estructuraEntregaD4: IDashboardEstructuraEntregaD4[] = [
    { estado: 'Proyectos Pendientes de entrega', subEstados: ['Pendiente de entrega'] },
    { estado: 'Proyectos entregados', subEstados: ['Primer envío', 'Reenviado'] }
  ];

  // ── Notas de alumnos por PEspecifico ──────────────────────────────────────
  loadingNotas: boolean = false;
  filtrarSinNotas: boolean = false;
  evaluacionesD2: INotaEvaluacionD2[] = [];
  alumnosNotas: INotaAlumnoD2[] = [];
  stateNotas: State = { skip: 0, take: 15, sort: [{ field: 'alumno', dir: 'asc' }] };
  get gridDataNotas(): any {
    const datos = this.filtrarSinNotas
      ? this.alumnosNotas.filter(a => this.esSinNota(a))
      : this.alumnosNotas;
    return process(datos, this.stateNotas);
  }

  obtenerNota(alumno: INotaAlumnoD2, idEvaluacion: number): number {
    return (alumno.notas ?? []).find(n => n.idEvaluacion === idEvaluacion)?.nota ?? 0;
  }

  rowClassNotas = (context: any): string => {
    return this.esSinNota(context.dataItem) ? 'fila-sin-notas' : '';
  };

  private esSinNota(a: INotaAlumnoD2): boolean {
    return (a.notas ?? []).every(n => n.nota === 0) && (a.promedioFinal ?? 0) === 0;
  }

  get totalSinNota(): number {
    return (this.alumnosNotas ?? []).filter(a => this.esSinNota(a)).length;
  }

  get totalConNota(): number {
    return (this.alumnosNotas ?? []).length - this.totalSinNota;
  }

  get donutCalificacion(): { category: string; value: number; color: string }[] {
    if (!(this.alumnosNotas ?? []).length) return [];
    return [
      { category: 'Calificados', value: this.totalConNota, color: '#28a745' },
      { category: 'Sin nota',    value: this.totalSinNota,  color: '#dc3545' }
    ];
  }

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
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
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

    this.formFiltroD4 = this.crearFormFiltroD4();
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
            this.filteredProgramasV3 = this.filtros.programasEspecificos.slice(0, 50);
            // No se auto-asigna anio: null = todos los anios en la carga inicial
          }
          this.cdr.markForCheck();
        },
        error: (error) => {
          this._reporteDashboardService.handleError(error);
          this.cdr.markForCheck();
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
        .filter(c => (c.nombre ?? '').toLowerCase().includes(filterLower))
        .slice(0, 100);
    }
  }

  onFilterProgramasV3(filter: string): void {
    if (!filter || filter.length < 1) {
      this.filteredProgramasV3 = this.filtros.programasEspecificos.slice(0, 50);
    } else {
      const fl = filter.toLowerCase();
      this.filteredProgramasV3 = this.filtros.programasEspecificos
        .filter(p => p.nombre?.toLowerCase().includes(fl))
        .slice(0, 100);
    }
  }

  /**
   * Obtiene los filtros actuales del formulario
   */
  private getSelectedFilters(): { idProgramaEspecificoPadre?: number; idCentroCostoPadre?: number } {
    const idsProgramas = this.formFiltro.get('idsProgramaEspecificoPadre')?.value as number[] || [];
    const centrosCosto = this.formFiltro.get('centrosCostoPadre')?.value as number[] || [];

    return {
      idProgramaEspecificoPadre: idsProgramas.length > 0 ? idsProgramas[0] : undefined,
      idCentroCostoPadre: centrosCosto.length > 0 ? centrosCosto[0] : undefined
    };
  }

  /**
   * Carga todos los datos del dashboard
   */
  cargarDatosDashboard(): void {
    this.loading = true;
    const anio = this.formFiltro.get('anio')?.value;
    const { idProgramaEspecificoPadre, idCentroCostoPadre } = this.getSelectedFilters();

    forkJoin({
      resumen: this._reporteDashboardService.obtenerResumen$(anio, idProgramaEspecificoPadre, idCentroCostoPadre),
      estados: this._reporteDashboardService.obtenerResumenPorEstado$(anio, idProgramaEspecificoPadre, idCentroCostoPadre),
      modalidades: this._reporteDashboardService.obtenerResumenPorModalidad$(anio, undefined, idProgramaEspecificoPadre, idCentroCostoPadre),
      graficoPorMes: this._reporteDashboardService.obtenerGraficoPorMes$(anio, idProgramaEspecificoPadre, idCentroCostoPadre)
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (responses) => {
        // Resumen KPIs
        if (responses.resumen.body) {
          this.resumen = responses.resumen.body;
        }

        // Grafico de estados (donut chart)
        if (responses.estados.body) {
          this.datosEstado = responses.estados.body.map((item, i) => ({
            category: item.estado || 'Sin Estado',
            value: item.cantidadProgramas,
            color: this.coloresEstado[item.estado || '']
                   ?? this._paletaEstados[i % this._paletaEstados.length]
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
        this.cargarCursos();
        this.cargarDocentes();
        this.cargarResumenSemanal();
        this.cargarEstadosSesion();
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.loading = false;
        this._reporteDashboardService.handleError(error);
        this.cdr.markForCheck();
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

    this.seriesPorMes = estadosUnicos.map((estado, i) => {
      const dataEstado = mesesUnicos.map(mes => {
        const item = datos.find(d => d.mes === mes && (d.estadoPadre || 'Sin Estado') === estado);
        return item ? item.cantidadProgramas : 0;
      });
      return {
        name: estado,
        data: dataEstado,
        color: this.coloresEstado[estado] ?? this._paletaEstados[i % this._paletaEstados.length]
      };
    });
  }

  /**
   * Carga el resumen semanal para el grafico de lineas
   */
  cargarResumenSemanal(): void {
    this.loadingSemanal = true;
    const anio = this.formFiltro.get('anio')?.value;
    const { idProgramaEspecificoPadre, idCentroCostoPadre } = this.getSelectedFilters();

    this._reporteDashboardService.obtenerResumenSemanal$(anio, undefined, undefined, idProgramaEspecificoPadre, idCentroCostoPadre)
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
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.loadingSemanal = false;
          this._reporteDashboardService.handleError(error);
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Carga los datos de estados de sesion
   */
  cargarEstadosSesion(): void {
    this.loadingEstadosSesion = true;
    const anio = this.formFiltro.get('anio')?.value;
    const { idProgramaEspecificoPadre, idCentroCostoPadre } = this.getSelectedFilters();

    forkJoin({
      resumen: this._reporteDashboardService.obtenerResumenPorEstadoSesion$(anio, idProgramaEspecificoPadre, idCentroCostoPadre),
      kpis: this._reporteDashboardService.obtenerKPIsEstadoSesion$(anio, idProgramaEspecificoPadre, idCentroCostoPadre)
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
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.loadingEstadosSesion = false;
        this._reporteDashboardService.handleError(error);
        this.cdr.markForCheck();
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
    const { idProgramaEspecificoPadre, idCentroCostoPadre } = this.getSelectedFilters();

    this._reporteDashboardService.obtenerSesionesPorEstado$(anio, idEstadoSesion, idProgramaEspecificoPadre, idCentroCostoPadre)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<IReporteDashboardSesionDetalle[]>) => {
          this.sesionesDetalle = response.body || [];
          this.loadingSesionesDetalle = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.loadingSesionesDetalle = false;
          this._reporteDashboardService.handleError(error);
          this.cdr.markForCheck();
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
    const sorted = [...datos].sort((a, b) => a.semana - b.semana);
    this.datosSemanal = sorted;
    this.categoriasSemanas = sorted.map(d => `S${d.semana}`);

    this.seriesSemanal = [
      {
        name: 'Pendientes',
        data: sorted.map(d => d.sesionesPendientes),
        color: this.coloresSemanal['Pendientes']
      },
      {
        name: 'Realizadas',
        data: sorted.map(d => d.sesionesRealizadas),
        color: this.coloresSemanal['Realizadas']
      },
      {
        name: 'Canceladas',
        data: sorted.map(d => d.sesionesCanceladas),
        color: this.coloresSemanal['Canceladas']
      },
      {
        name: 'Reprogramadas',
        data: sorted.map(d => d.sesionesReprogramadas),
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
    const { idProgramaEspecificoPadre, idCentroCostoPadre } = this.getSelectedFilters();

    this._reporteDashboardService.obtenerProgramasPorEstado$(estado, anio, undefined, undefined, modalidad, idProgramaEspecificoPadre, idCentroCostoPadre)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<IReporteDashboardPrograma[]>) => {
          this.programas = response.body || [];
          this.loadingProgramas = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.loadingProgramas = false;
          this._reporteDashboardService.handleError(error);
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Carga el listado de cursos/sesiones
   */
  cargarCursos(): void {
    this.loadingCursos = true;
    const anio = this.formFiltro.get('anio')?.value;
    const { idProgramaEspecificoPadre, idCentroCostoPadre } = this.getSelectedFilters();

    this._reporteDashboardService.obtenerDetalleCursos$(undefined, undefined, undefined, idProgramaEspecificoPadre, anio, idCentroCostoPadre)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<IReporteDashboardCurso[]>) => {
          this.cursos = response.body || [];
          this.loadingCursos = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.loadingCursos = false;
          this._reporteDashboardService.handleError(error);
          this.cdr.markForCheck();
        }
      });
  }

  /**
   * Carga el listado de docentes
   */
  cargarDocentes(): void {
    this.loadingDocentes = true;
    const anio = this.formFiltro.get('anio')?.value;
    const { idProgramaEspecificoPadre, idCentroCostoPadre } = this.getSelectedFilters();

    this._reporteDashboardService.obtenerDocentesAsignados$(anio, undefined, undefined, false, idProgramaEspecificoPadre, idCentroCostoPadre)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<IReporteDashboardDocente[]>) => {
          this.docentes = response.body || [];
          this.loadingDocentes = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.loadingDocentes = false;
          this._reporteDashboardService.handleError(error);
          this.cdr.markForCheck();
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
    // anio queda en null = todos los anios
    this.cargarDatosDashboard();
  }

  /**
   * Cambia el tab activo de grillas
   */
  onTabChange(tab: string): void {
    this.activeTab = tab;
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

  public labelOnlyPercent = (e: any): string => {
    if (e.percentage < 0.05) return '';
    return `${(e.percentage * 100).toFixed(0)}%`;
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
    const { idProgramaEspecificoPadre, idCentroCostoPadre } = this.getSelectedFilters();
    const filtro: IReporteDashboardFiltroRequest = {
      anio: this.formFiltro.get('anio')?.value,
      estado: this.formFiltro.get('estado')?.value,
      modalidad: this.formFiltro.get('modalidad')?.value,
      idProgramaEspecificoPadre,
      idCentroCostoPadre
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
          this.cdr.markForCheck();
        },
        error: (error) => {
          this._reporteDashboardService.handleError(error);
          this.cdr.markForCheck();
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
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.loadingCambiosEstado = false;
          this._reporteDashboardService.handleError(error);
          this.cdr.markForCheck();
        }
      });
  }

  procesarDatosCambiosEstado(datos: IReporteDashboardCambioEstado[]): void {
    const datosOrdenados = [...datos].sort((a, b) => a.numeroSemana - b.numeroSemana);
    this.categoriasCambiosEstado = datosOrdenados.map(d =>
      d.esSemanaActual ? `S${d.numeroSemana} (actual)` : `S${d.numeroSemana}`
    );
    this.seriesCambiosEstado = [
      { name: 'Lanzamiento → Ejecución', data: datosOrdenados.map(d => d.lanzamientoAEjecucion), color: '#28a745' },
      { name: 'Ejecución → Concluido',   data: datosOrdenados.map(d => d.ejecucionAConcluido),   color: '#007bff' },
      { name: '→ Cancelado',             data: datosOrdenados.map(d => d.aCancelado),             color: '#dc3545' }
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
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.loadingEstadosPorDia = false;
        this._reporteDashboardService.handleError(error);
        this.cdr.markForCheck();
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
    this.seriesEstadosPorDia = estadosUnicos.map((estado, i) => ({
      name: estado,
      data: categoriasSet.map(cat => {
        const item = datos.find(d => toKey(d) === cat && d.estado === estado);
        return item ? item.cantidadSesiones : 0;
      }),
      color: this.coloresEstado[estado] ?? this._paletaEstados[i % this._paletaEstados.length]
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
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.loadingCursosV3 = false;
        this._reporteDashboardService.handleError(error);
        this.cdr.markForCheck();
      }
    });
  }

  aplicarFiltroCursosV3(): void {
    this.cargarCursosV3();
  }

  limpiarFiltroCursosV3(): void {
    this.formFiltroCursosV3.reset({ anio: new Date().getFullYear() });
    this.filteredProgramasV3 = this.filtros.programasEspecificos.slice(0, 50);
    this.filtroTablaV3 = '';
    this.filtroColV3 = {};
    this.paginaV3 = 1;
    this.cargarCursosV3();
  }

  onStateChangeCursosV3(state: State): void {
    this.stateCursosV3 = state;
    this.cdr.markForCheck();
  }

  ordenarTablaV3(campo: string): void {
    if (this.ordenV3Campo === campo) {
      this.ordenV3Dir = this.ordenV3Dir === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenV3Campo = campo;
      this.ordenV3Dir = 'asc';
    }
    this.paginaV3 = 1;
    this.cdr.markForCheck();
  }

  onFiltroTablaV3(valor: string): void {
    this.filtroTablaV3 = valor;
    this.paginaV3 = 1;
    this.cdr.markForCheck();
  }

  onFiltroColV3(campo: string, valor: string): void {
    this.filtroColV3 = { ...this.filtroColV3, [campo]: valor };
    this.paginaV3 = 1;
    this.cdr.markForCheck();
  }

  irPaginaV3(pagina: number): void {
    this.paginaV3 = Math.min(Math.max(1, pagina), this.totalPaginasV3);
    this.expandedRowsV3.clear();
    this.cdr.markForCheck();
  }

  cambiarTamPaginaV3(tam: number): void {
    this.tamPaginaV3 = tam;
    this.paginaV3 = 1;
    this.expandedRowsV3.clear();
    this.cdr.markForCheck();
  }

  toggleExpandRowV3(idx: number): void {
    if (this.expandedRowsV3.has(idx)) {
      this.expandedRowsV3.delete(idx);
    } else {
      this.expandedRowsV3.add(idx);
    }
    this.cdr.markForCheck();
  }

  modalidadFilterChange(value: string | null, filterService: any): void {
    filterService.filter({
      filters: value ? [{ field: 'modalidadClasificada', operator: 'eq', value }] : [],
      logic: 'and'
    });
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
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.loadingSeguimiento = false;
          this._reporteDashboardService.handleError(error);
          this.cdr.markForCheck();
        }
      });
  }

  procesarDatosSeguimiento(datos: IReporteDashboardSeguimientoClase[]): void {
    // Normalizar nombre de día (quita tildes, minúsculas) para comparar sin importar locale del servidor
    const normalizar = (s: string) =>
      (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

    // Agrupar por nombre de día normalizado
    const agrupadoPorDia = new Map<string, IReporteDashboardSeguimientoClase>();
    datos.forEach(d => {
      const key = normalizar(d.diaSemana ?? '');
      if (!agrupadoPorDia.has(key)) {
        agrupadoPorDia.set(key, { ...d });
      } else {
        const ex = agrupadoPorDia.get(key)!;
        ex.programadas   += d.programadas;
        ex.ejecutadas    += d.ejecutadas;
        ex.canceladas    += d.canceladas;
        ex.reprogramadas += d.reprogramadas;
        ex.totalSesiones += d.totalSesiones;
      }
    });

    // Orden fijo Lunes → Sábado; siempre muestra los 6 días aunque no tengan datos
    const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    const diasOrdenados: IReporteDashboardSeguimientoClase[] = DIAS_SEMANA.map((nombre, idx) => {
      const found = agrupadoPorDia.get(normalizar(nombre));
      return found
        ? { ...found, diaSemana: nombre }
        : { nroDiaSemana: idx + 1, diaSemana: nombre, programadas: 0, ejecutadas: 0, canceladas: 0, reprogramadas: 0, totalSesiones: 0 } as IReporteDashboardSeguimientoClase;
    });

    this.datosSeguimiento = diasOrdenados;
    this.categoriasSeguimiento = diasOrdenados.map(d => d.diaSemana);

    this.seriesSeguimiento = [
      { name: 'Por Ejecutar',   data: diasOrdenados.map(d => d.programadas),   color: this.coloresSeguimiento['Por Ejecutar'] },
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

  onMainTabChange(tab: 'dashboard1' | 'dashboard2' | 'dashboard3' | 'dashboard4'): void {
    this.activeMainTab = tab;

    if (tab === 'dashboard2') {
      this.dashboard2Initialized = true;
      if (this.docentesFiltro.length === 0) {
        this.cargarDocentesFiltro();
      }
    }

    if (tab === 'dashboard3') {
      this.dashboard3Initialized = true;
      if (this.fursDashboard3.length === 0) {
        this.cargarFursDashboard3();
      }
    }

    if (tab === 'dashboard4') {
      this.dashboard4Initialized = true;
      if (!this.dataPEspecificoD4.length) {
        this.cargarCombosD4();
      }
      if (!this.dashboardCalificacionD4 && !this.loadingD4) {
        this.generarReporteD4();
      }
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
          this.cdr.markForCheck();
        },
        error: () => { this.loadingDocentesFiltro = false; this.cdr.markForCheck(); }
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
    // Si hay docente seleccionado, no usar el buscador por texto
    if (this.formFiltroD2.value.idDocente) return;

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
          this.cdr.markForCheck();
        },
        error: () => { this.loadingPEspecificoFiltro = false; this.cdr.markForCheck(); }
      });
  }

  onDocenteValueChange(idDocente: number | null): void {
    // Limpiar seleccion de PEspecifico cuando cambia el docente
    this.formFiltroD2.patchValue({ idPEspecifico: null });
    this.evaluacionesD2 = [];
    this.alumnosNotas = [];

    if (idDocente) {
      this.cargarPEspecificoPorDocente(idDocente);
    } else {
      // Sin docente: volver al modo de búsqueda por texto
      this.pEspecificoPorDocenteFiltro = [];
      this.pEspecificoFiltroFiltered = this.pEspecificoFiltro.slice(0, 50);
    }
  }

  cargarPEspecificoPorDocente(idProveedor: number): void {
    this.loadingPEspecificoPorDocente = true;
    this._reporteDashboardService.obtenerPEspecificoPorDocente$(idProveedor)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loadingPEspecificoPorDocente = false; this.cdr.markForCheck(); })
      )
      .subscribe({
        next: (response: HttpResponse<IReporteDashboardPEspecificoPorDocente[]>) => {
          this.pEspecificoPorDocenteFiltro = response.body || [];
        },
        error: () => { this.pEspecificoPorDocenteFiltro = []; }
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
      finalize(() => { this.loadingD2 = false; this.cdr.markForCheck(); })
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

    // Cargar notas si hay un PEspecifico seleccionado
    if (idPEspecifico) {
      this.cargarNotasPorPEspecifico(idPEspecifico);
    } else {
      this.evaluacionesD2 = [];
      this.alumnosNotas = [];
    }
  }

  cargarNotasPorPEspecifico(idPEspecifico: number): void {
    this.loadingNotas = true;
    this._reporteDashboardService.obtenerNotasPorPEspecifico$(idPEspecifico)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loadingNotas = false; this.cdr.markForCheck(); })
      )
      .subscribe({
        next: (response: HttpResponse<INotasPorPEspecificoD2>) => {
          const data = response.body;
          if (data) {
            this.evaluacionesD2 = data.evaluaciones || [];
            this.alumnosNotas   = data.alumnos || [];
          }
        },
        error: () => {
          this.evaluacionesD2 = [];
          this.alumnosNotas   = [];
        }
      });
  }

  limpiarFiltroD2(): void {
    this.formFiltroD2.patchValue({ idDocente: null, idPEspecifico: null, fechaInicio: null, fechaFin: null });
    this.seguimientoDocenteKPIs    = { ...this._kpisVacio };
    this.seguimientoDocenteProgramas = [];
    this.seguimientoDocenteSesiones  = [];
    this.evaluacionesD2 = [];
    this.alumnosNotas   = [];
    this.pEspecificoPorDocenteFiltro = [];
    this.pEspecificoFiltroFiltered = this.pEspecificoFiltro.slice(0, 50);
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

  // ═══════════════════════════════════════════════════════════════════════════
  // DASHBOARD 3: FURs
  // ═══════════════════════════════════════════════════════════════════════════

  cargarFursDashboard3(): void {
    this.loadingD3 = true;
    this._reporteDashboardService.obtenerFursDashboard3$()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => { this.loadingD3 = false; this.cdr.markForCheck(); })
      )
      .subscribe({
        next: (response: HttpResponse<IFurDashboard3[]>) => {
          this.fursDashboard3 = response.body || [];
          this.paginaD3 = 1;
          this.expandedRowsD3.clear();
        },
        error: () => { this.fursDashboard3 = []; }
      });
  }

  onStateChangeD3(state: State): void {
    this.stateD3 = state;
  }

  ordenarTablaD3(campo: string): void {
    if (this.ordenD3Campo === campo) {
      this.ordenD3Dir = this.ordenD3Dir === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenD3Campo = campo;
      this.ordenD3Dir = 'asc';
    }
    this.paginaD3 = 1;
    this.cdr.markForCheck();
  }

  onFiltroTablaD3(valor: string): void {
    this.filtroTablaD3 = valor;
    this.paginaD3 = 1;
    this.cdr.markForCheck();
  }

  onFiltroColD3(campo: string, valor: string): void {
    this.filtroColD3 = { ...this.filtroColD3, [campo]: valor };
    this.paginaD3 = 1;
    this.cdr.markForCheck();
  }

  irPaginaD3(pagina: number): void {
    this.paginaD3 = Math.min(Math.max(1, pagina), this.totalPaginasD3);
    this.expandedRowsD3.clear();
    this.cdr.markForCheck();
  }

  cambiarTamPaginaD3(tam: number): void {
    this.tamPaginaD3 = tam;
    this.paginaD3 = 1;
    this.expandedRowsD3.clear();
    this.cdr.markForCheck();
  }

  toggleExpandRowD3(idx: number): void {
    if (this.expandedRowsD3.has(idx)) {
      this.expandedRowsD3.delete(idx);
    } else {
      this.expandedRowsD3.add(idx);
    }
    this.cdr.markForCheck();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DASHBOARD 4: Proyectos presentados por alumnos
  // ═══════════════════════════════════════════════════════════════════════════

  private crearFormFiltroD4(): FormGroup {
    return this._formBuilder.group({
      idsProgramaEspecifico: [[]],
      idsCentroCosto: [[]],
      idsDocente: [[]],
      idsCoordinadora: [[]],
      idCodigoMatricula: [null],
      idEstadoRevision: [null],
      fechaInicial: [new Date()],
      fechaFin: [new Date()]
    });
  }

  get obtenerFechaActualD4(): Date {
    return new Date();
  }

  cargarCombosD4(): void {
    this.loadingCombosD4 = true;
    this._integraService
      .getJsonResponse(constApiPlanificacion.ProyectoPresentadoPorAlumnoObtenerCombosModulo)
      .pipe(takeUntil(this.destroy$), finalize(() => { this.loadingCombosD4 = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (resp: HttpResponse<ICombosProyectoAlumnoD4>) => {
          const body = resp.body;
          this.dataCoordinadorasD4 = body?.obtenerCoordinadorasDocente || [];
          this.dataDocentesD4 = body?.obtenerNombreProveedorParaHonorario || [];
          this.dataCentroCostoD4 = body?.obtenerCombo || [];
          this.dataPEspecificoD4 = body?.obtenerProgramaEspecifico || [];
          this.filteredCoordinadorasD4 = this.dataCoordinadorasD4.slice(0, 80);
          this.filteredDocentesD4 = this.dataDocentesD4.slice(0, 80);
          this.filteredCentroCostoD4 = this.dataCentroCostoD4.slice(0, 80);
          this.filteredPEspecificoD4 = this.dataPEspecificoD4.slice(0, 80);
        },
        error: (error) => {
          const mensaje = this._alertaService.getMessageErrorService(error);
          if (mensaje) this._alertaService.notificationWarning(mensaje);
        }
      });
  }

  filtrarComboD4(origen: IComboD4[], destino: 'programa' | 'centroCosto' | 'docente' | 'coordinadora', filtro: string): void {
    const data = !filtro
      ? origen.slice(0, 80)
      : origen.filter(item => (item.nombre || '').toLowerCase().includes(filtro.toLowerCase())).slice(0, 120);

    if (destino === 'programa') this.filteredPEspecificoD4 = data;
    if (destino === 'centroCosto') this.filteredCentroCostoD4 = data;
    if (destino === 'docente') this.filteredDocentesD4 = data;
    if (destino === 'coordinadora') this.filteredCoordinadorasD4 = data;
  }

  obtenerCodigoMatriculaAutocompleteD4(value: string): void {
    if (!value || value.length < 4) return;

    this._integraService
      .obtenerPorFiltro(constApiFinanzas.MatriculaCabeceraObtenerCodigoMatriculaAutocomplete, { valor: value })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<ICodigoMatriculaD4[]>) => {
          this.codigoMatriculaD4 = response.body || [];
          this.cdr.markForCheck();
        }
      });
  }

  generarReporteD4(): void {
    this.loadingD4 = true;
    this.limpiarDashboardD4(false);

    const dataForm: IFiltroProyectoAlumnoD4 = this.formFiltroD4.getRawValue();
    const filtro = {
      ProgramaEspecifico: dataForm.idsProgramaEspecifico,
      CentroCosto: dataForm.idsCentroCosto,
      Docente: dataForm.idsDocente,
      Coordinadora: dataForm.idsCoordinadora,
      CodigoMatricula: dataForm.idCodigoMatricula,
      EstadoRevision: dataForm.idEstadoRevision,
      FechaInicial: dataForm.fechaInicial,
      FechaFin: dataForm.fechaFin
    };

    this._integraService
      .postJsonResponse(constApiPlanificacion.ProyectoPresentadoPorAlumnoGenerarReporte, JSON.stringify(filtro))
      .pipe(takeUntil(this.destroy$), finalize(() => { this.loadingD4 = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: (resp: HttpResponse<IProyectoPresentadoPorAlumnoD4[]>) => {
          this.construirDashboardD4(resp.body || [], dataForm);
        },
        error: (error) => {
          const mensaje = this._alertaService.getMessageErrorService(error);
          if (mensaje) this._alertaService.notificationWarning(mensaje);
        }
      });
  }

  limpiarFiltroD4(): void {
    this.formFiltroD4 = this.crearFormFiltroD4();
    this.codigoMatriculaD4 = [];
    this.dashboardFiltroEstadoSeleccionadoD4 = 'todos';
    this.generarReporteD4();
  }

  limpiarDashboardD4(limpiarBase: boolean = true): void {
    this.dashboardCalificacionD4 = null;
    this.dashboardEntregaD4 = null;
    this.dashboardDocentesD4 = [];
    this.dashboardFechaInicioD4 = '';
    this.dashboardFechaFinD4 = '';
    this.dashboardFiltroEstadoSeleccionadoD4 = 'todos';
    this.dashboardFiltrosEstadoD4 = [];
    this.dashboardFiltroEntregaSeleccionadoD4 = 'todos';
    this.dashboardFiltrosEntregaD4 = [];
    this.limpiarTodosFiltrosDashboardInternosD4(false);
    if (limpiarBase) this.reporteDashboardBaseD4 = [];
  }

  construirDashboardD4(reporte: IProyectoPresentadoPorAlumnoD4[], filtro: IFiltroProyectoAlumnoD4): void {
    this.dashboardFechaInicioD4 = this.formatearFechaDashboardD4(filtro.fechaInicial);
    this.dashboardFechaFinD4 = this.formatearFechaDashboardD4(filtro.fechaFin);
    this.reporteDashboardBaseD4 = reporte;
    this.dashboardFiltroEstadoSeleccionadoD4 = 'todos';
    this.dashboardFiltroEntregaSeleccionadoD4 = 'todos';
    this.inicializarOpcionesFiltrosDashboardD4(reporte);
    this.limpiarTodosFiltrosDashboardInternosD4(false);
    this.recalcularDashboardCalificacionD4();
    this.recalcularDashboardEntregaD4();
    this.recalcularDashboardDocentesD4();
  }

  inicializarOpcionesFiltrosDashboardD4(reporte: IProyectoPresentadoPorAlumnoD4[]): void {
    this.opcionesProgramaDashboardD4 = this.obtenerValoresUnicosDashboardD4(reporte, item => item.programaEspecifico);
    this.opcionesCentroCostoDashboardD4 = this.obtenerValoresUnicosDashboardD4(reporte, item => item.centroCosto);
    this.opcionesDocenteDashboardD4 = this.obtenerValoresUnicosDashboardD4(reporte, item => item.docenteCalificacion || item.docente);
  }

  obtenerValoresUnicosDashboardD4(reporte: IProyectoPresentadoPorAlumnoD4[], selector: (item: IProyectoPresentadoPorAlumnoD4) => string): string[] {
    return Array.from(new Set(reporte.map(selector).filter(valor => !!valor))).sort((a, b) => a.localeCompare(b));
  }

  crearFiltrosInternosDashboardD4(): IFiltrosInternosDashboardD4 {
    return {
      programas: [] as string[],
      centrosCosto: [] as string[],
      docentes: [] as string[],
      fechaInicio: null,
      fechaFin: null
    };
  }

  limpiarTodosFiltrosDashboardInternosD4(recalcular: boolean = true): void {
    this.filtrosCalificacionD4 = this.crearFiltrosInternosDashboardD4();
    this.filtrosEntregaInternosD4 = this.crearFiltrosInternosDashboardD4();
    this.filtrosDocentesInternosD4 = this.crearFiltrosInternosDashboardD4();
    if (recalcular) {
      this.recalcularDashboardCalificacionD4();
      this.recalcularDashboardEntregaD4();
      this.recalcularDashboardDocentesD4();
    }
  }

  limpiarFiltrosCalificacionD4(): void {
    this.filtrosCalificacionD4 = this.crearFiltrosInternosDashboardD4();
    this.recalcularDashboardCalificacionD4();
  }

  limpiarFiltrosEntregaD4(): void {
    this.filtrosEntregaInternosD4 = this.crearFiltrosInternosDashboardD4();
    this.recalcularDashboardEntregaD4();
  }

  limpiarFiltrosDocentesD4(): void {
    this.filtrosDocentesInternosD4 = this.crearFiltrosInternosDashboardD4();
    this.recalcularDashboardDocentesD4();
  }

  recalcularDashboardCalificacionD4(): void {
    const reporteFiltrado = this.obtenerReporteDashboardFiltradoD4(this.filtrosCalificacionD4);
    this.dashboardFiltrosEstadoD4 = this.construirFiltrosEstadoCalificacionD4(reporteFiltrado);
    if (!this.dashboardFiltrosEstadoD4.some(filtro => filtro.codigo === this.dashboardFiltroEstadoSeleccionadoD4)) this.dashboardFiltroEstadoSeleccionadoD4 = 'todos';
    this.aplicarFiltroDashboardCalificacionD4(reporteFiltrado);
    this.cdr.markForCheck();
  }

  recalcularDashboardEntregaD4(): void {
    const reporteFiltrado = this.obtenerReporteDashboardFiltradoD4(this.filtrosEntregaInternosD4);
    this.dashboardFiltrosEntregaD4 = this.construirFiltrosEstadoEntregaD4(reporteFiltrado);
    if (!this.dashboardFiltrosEntregaD4.some(filtro => filtro.codigo === this.dashboardFiltroEntregaSeleccionadoD4)) this.dashboardFiltroEntregaSeleccionadoD4 = 'todos';
    this.aplicarFiltroDashboardEntregaD4(reporteFiltrado);
    this.cdr.markForCheck();
  }

  recalcularDashboardDocentesD4(): void {
    const reporteFiltrado = this.obtenerReporteDashboardFiltradoD4(this.filtrosDocentesInternosD4);
    this.dashboardDocentesD4 = this.construirDashboardDocentesD4(reporteFiltrado);
    this.cdr.markForCheck();
  }

  obtenerReporteDashboardFiltradoD4(filtros: IFiltrosInternosDashboardD4): IProyectoPresentadoPorAlumnoD4[] {
    return this.reporteDashboardBaseD4.filter(item => {
      const docente = item.docenteCalificacion || item.docente;
      const fechaEnvio = this.obtenerFechaDashboardD4(item.fechaEnvioOriginal || item.fechaEnvio);
      return (
        (!filtros.programas.length || filtros.programas.includes(item.programaEspecifico)) &&
        (!filtros.centrosCosto.length || filtros.centrosCosto.includes(item.centroCosto)) &&
        (!filtros.docentes.length || filtros.docentes.includes(docente)) &&
        (!filtros.fechaInicio || (fechaEnvio && fechaEnvio >= filtros.fechaInicio)) &&
        (!filtros.fechaFin || (fechaEnvio && fechaEnvio <= this.obtenerFechaFinInclusivaD4(filtros.fechaFin)))
      );
    });
  }

  obtenerFechaFinInclusivaD4(fecha: Date): Date {
    return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 23, 59, 59);
  }

  construirFiltrosEstadoCalificacionD4(reporte: IProyectoPresentadoPorAlumnoD4[]): IDashboardFiltroEstadoD4[] {
    return [
      { codigo: 'todos', nombre: 'Todos los estados', estado: null, cantidad: reporte.length, color: '#2f7dad' },
      ...this.estructuraCalificacionD4.map(estructura => ({
        codigo: this.obtenerCodigoFiltroEstadoD4(estructura.estado),
        nombre: estructura.estado,
        estado: estructura.estado,
        cantidad: reporte.filter(item => this.obtenerEstadoCalificacionD4(item) === estructura.estado).length,
        color: this.obtenerColorCalificacionD4(estructura.estado)
      }))
    ];
  }

  seleccionarFiltroDashboardCalificacionD4(filtro: IDashboardFiltroEstadoD4): void {
    this.dashboardFiltroEstadoSeleccionadoD4 = filtro.codigo;
    this.aplicarFiltroDashboardCalificacionD4(this.obtenerReporteDashboardFiltradoD4(this.filtrosCalificacionD4));
  }

  aplicarFiltroDashboardCalificacionD4(reporteBase: IProyectoPresentadoPorAlumnoD4[]): void {
    const filtroSeleccionado = this.dashboardFiltrosEstadoD4.find(filtro => filtro.codigo === this.dashboardFiltroEstadoSeleccionadoD4);
    const reporteFiltrado = filtroSeleccionado?.estado
      ? reporteBase.filter(item => this.obtenerEstadoCalificacionD4(item) === filtroSeleccionado.estado)
      : reporteBase;

    this.dashboardCalificacionD4 = this.construirTablaCalificacionD4(reporteFiltrado);
    this.dashboardCalificacionD4.estados = this.construirTarjetasCalificacionD4(
      this.construirFilasCalificacionD4(reporteBase, reporteBase.length),
      reporteBase.length
    );
    this.cdr.markForCheck();
  }

  construirTablaCalificacionD4(reporte: IProyectoPresentadoPorAlumnoD4[]): IDashboardTablaD4 {
    const totalDashboard = reporte.length;
    const filas = this.construirFilasCalificacionD4(reporte, totalDashboard);
    const distribucion = this.construirDistribucionCalificacionD4(filas);

    return {
      titulo: 'POR ESTADOS DE CALIFICACIÓN',
      total: totalDashboard,
      totalEntregados: totalDashboard,
      estados: this.construirTarjetasCalificacionD4(filas, totalDashboard),
      distribucion,
      filas,
      mostrarTiempoRevision: true
    };
  }

  construirFilasCalificacionD4(reporte: IProyectoPresentadoPorAlumnoD4[], totalEntregados: number): IDashboardFilaD4[] {
    const estados: {
      [key: string]: {
        cantidad: number;
        diasRevision: number;
        revisados: number;
        subEstados: { [key: string]: { cantidad: number; diasRevision: number; revisados: number } };
      };
    } = {};

    reporte.forEach(item => {
      const estado = this.obtenerEstadoCalificacionD4(item);
      const subEstado = this.obtenerSubEstadoCalificacionD4(item, estado);
      const diasRevision = this.obtenerDiasRevisionDashboardD4(item);

      if (!estados[estado]) {
        estados[estado] = { cantidad: 0, diasRevision: 0, revisados: 0, subEstados: {} };
      }
      if (!estados[estado].subEstados[subEstado]) {
        estados[estado].subEstados[subEstado] = { cantidad: 0, diasRevision: 0, revisados: 0 };
      }

      estados[estado].cantidad++;
      estados[estado].subEstados[subEstado].cantidad++;

      if (diasRevision != null) {
        estados[estado].diasRevision += diasRevision;
        estados[estado].revisados++;
        estados[estado].subEstados[subEstado].diasRevision += diasRevision;
        estados[estado].subEstados[subEstado].revisados++;
      }
    });

    return this.estructuraCalificacionD4.reduce((filas, estructura) => {
      const grupoEstado = estados[estructura.estado] || { cantidad: 0, diasRevision: 0, revisados: 0, subEstados: {} };
      filas.push({
        nombre: estructura.estado,
        cantidad: grupoEstado.cantidad,
        porcentaje: this.calcularPorcentajeD4(grupoEstado.cantidad, totalEntregados),
        tiempoPromedioRevision: grupoEstado.revisados ? Math.round(grupoEstado.diasRevision / grupoEstado.revisados) : null,
        esEstado: true,
        nivel: 0,
        color: this.obtenerColorCalificacionD4(estructura.estado)
      });

      estructura.subEstados.forEach(subEstado => {
        const filaSubEstado = grupoEstado.subEstados[subEstado] || { cantidad: 0, diasRevision: 0, revisados: 0 };
        filas.push({
          nombre: subEstado,
          cantidad: filaSubEstado.cantidad,
          porcentaje: this.calcularPorcentajeD4(filaSubEstado.cantidad, totalEntregados),
          tiempoPromedioRevision: filaSubEstado.revisados ? Math.round(filaSubEstado.diasRevision / filaSubEstado.revisados) : null,
          esEstado: false,
          nivel: 1,
          color: this.obtenerColorCalificacionD4(subEstado, estructura.estado)
        });
      });

      return filas;
    }, [] as IDashboardFilaD4[]);
  }

  construirTarjetasCalificacionD4(filas: IDashboardFilaD4[], total: number): IDashboardEstadoResumenD4[] {
    const pendienteRevision = this.obtenerCantidadFilaD4(filas, 'Pendiente de revisión', true);
    const sinProyecto = this.obtenerCantidadFilaD4(filas, 'Sin proyecto (No aplica)', true);
    const enPlazo = this.obtenerCantidadFilaD4(filas, 'En plazo');
    const porVencer = this.obtenerCantidadFilaD4(filas, 'Por vencer');
    const vencido = this.obtenerCantidadFilaD4(filas, 'Vencido');

    return [
      { codigo: 'pendientes', nombre: 'TOTAL PENDIENTES REVISIÓN', cantidad: pendienteRevision, porcentaje: this.calcularPorcentajeD4(pendienteRevision, total), descripcion: 'Proyectos pendientes de revisión por docente', color: '#1f5f8b' },
      { codigo: 'sin-proyecto', nombre: 'SIN PROYECTO', cantidad: sinProyecto, porcentaje: this.calcularPorcentajeD4(sinProyecto, total), descripcion: 'Alumno aún no envía su proyecto', color: '#8c8c8c' },
      { codigo: 'en-plazo', nombre: 'EN PLAZO', cantidad: enPlazo, porcentaje: this.calcularPorcentajeD4(enPlazo, total), descripcion: '< 13 días sin calificación', color: '#2ab34b' },
      { codigo: 'por-vencer', nombre: 'POR VENCER', cantidad: porVencer, porcentaje: this.calcularPorcentajeD4(porVencer, total), descripcion: 'Entre 13 y 15 días', color: '#f5a623' },
      { codigo: 'vencido', nombre: 'VENCIDO', cantidad: vencido, porcentaje: this.calcularPorcentajeD4(vencido, total), descripcion: '> 15 días - alerta enviada', color: '#e53935' }
    ];
  }

  construirDistribucionCalificacionD4(filas: IDashboardFilaD4[]): IDashboardFilaD4[] {
    let estadoActual = '';
    return filas.reduce((distribucion, fila) => {
      if (fila.esEstado) {
        estadoActual = fila.nombre;
        if (!this.esEstadoPendienteProyectoD4(fila.nombre)) return distribucion;
        distribucion.push({ ...fila, nombre: 'Sin proyecto' });
        return distribucion;
      }

      const prefijo = estadoActual.toLowerCase().includes('pendiente') ? 'Pendiente' : estadoActual;
      distribucion.push({ ...fila, nombre: `${prefijo} - ${fila.nombre}` });
      return distribucion;
    }, [] as IDashboardFilaD4[]);
  }

  obtenerCantidadFilaD4(filas: IDashboardFilaD4[], nombre: string, esEstado: boolean = false): number {
    const fila = filas.find(item =>
      item.nombre.toLowerCase() === nombre.toLowerCase() && (esEstado ? item.esEstado : !item.esEstado)
    );
    return fila ? fila.cantidad : 0;
  }

  construirFiltrosEstadoEntregaD4(reporte: IProyectoPresentadoPorAlumnoD4[]): IDashboardFiltroEstadoD4[] {
    return [
      { codigo: 'todos', nombre: 'Todos los estados', estado: null, cantidad: reporte.length, color: '#2f7dad' },
      { codigo: 'pendiente-entrega', nombre: 'Pendiente', estado: null, subEstado: 'Pendiente de entrega', cantidad: reporte.filter(item => this.obtenerSubEstadoEntregaDashboardD4(item, this.obtenerEstadoEntregaDashboardD4(item)) === 'Pendiente de entrega').length, color: '#8c8c8c' },
      { codigo: 'primer-envio', nombre: 'Primer envío', estado: null, subEstado: 'Primer envío', cantidad: reporte.filter(item => this.obtenerSubEstadoEntregaDashboardD4(item, this.obtenerEstadoEntregaDashboardD4(item)) === 'Primer envío').length, color: '#1aa6a6' },
      { codigo: 'reenviado', nombre: 'Reenviado', estado: null, subEstado: 'Reenviado', cantidad: reporte.filter(item => this.obtenerSubEstadoEntregaDashboardD4(item, this.obtenerEstadoEntregaDashboardD4(item)) === 'Reenviado').length, color: '#9b51e0' }
    ];
  }

  seleccionarFiltroDashboardEntregaD4(filtro: IDashboardFiltroEstadoD4): void {
    this.dashboardFiltroEntregaSeleccionadoD4 = filtro.codigo;
    this.aplicarFiltroDashboardEntregaD4(this.obtenerReporteDashboardFiltradoD4(this.filtrosEntregaInternosD4));
  }

  aplicarFiltroDashboardEntregaD4(reporteBase: IProyectoPresentadoPorAlumnoD4[]): void {
    const filtroSeleccionado = this.dashboardFiltrosEntregaD4.find(filtro => filtro.codigo === this.dashboardFiltroEntregaSeleccionadoD4);
    const reporteFiltrado = filtroSeleccionado?.subEstado
      ? reporteBase.filter(item => this.obtenerSubEstadoEntregaDashboardD4(item, this.obtenerEstadoEntregaDashboardD4(item)) === filtroSeleccionado.subEstado)
      : filtroSeleccionado?.estado
      ? reporteBase.filter(item => this.obtenerEstadoEntregaDashboardD4(item) === filtroSeleccionado.estado)
      : reporteBase;

    this.dashboardEntregaD4 = this.construirTablaEntregaD4(reporteFiltrado);
    this.dashboardEntregaD4.estados = this.construirTarjetasEntregaD4(
      this.construirFilasEntregaD4(reporteBase, reporteBase.length),
      reporteBase.length
    );
    this.cdr.markForCheck();
  }

  construirTablaEntregaD4(reporte: IProyectoPresentadoPorAlumnoD4[]): IDashboardTablaD4 {
    const totalDashboard = reporte.length;
    const filas = this.construirFilasEntregaD4(reporte, totalDashboard);
    const distribucion = this.construirDistribucionEntregaD4(filas);

    return {
      titulo: 'POR ESTADOS DE ENTREGA',
      total: totalDashboard,
      estados: this.construirTarjetasEntregaD4(filas, totalDashboard),
      distribucion,
      filas,
      mostrarTiempoRevision: false
    };
  }

  construirFilasEntregaD4(reporte: IProyectoPresentadoPorAlumnoD4[], total: number): IDashboardFilaD4[] {
    const estados: { [key: string]: { cantidad: number; subEstados: { [key: string]: { cantidad: number } } } } = {};

    reporte.forEach(item => {
      const estado = this.obtenerEstadoEntregaDashboardD4(item);
      const subEstado = this.obtenerSubEstadoEntregaDashboardD4(item, estado);
      if (!estados[estado]) estados[estado] = { cantidad: 0, subEstados: {} };
      if (!estados[estado].subEstados[subEstado]) estados[estado].subEstados[subEstado] = { cantidad: 0 };
      estados[estado].cantidad++;
      estados[estado].subEstados[subEstado].cantidad++;
    });

    return this.estructuraEntregaD4.reduce((filas, estructura) => {
      const grupoEstado = estados[estructura.estado] || { cantidad: 0, subEstados: {} };
      filas.push({
        nombre: estructura.estado,
        cantidad: grupoEstado.cantidad,
        porcentaje: this.calcularPorcentajeD4(grupoEstado.cantidad, total),
        esEstado: true,
        nivel: 0,
        color: this.obtenerColorEntregaD4(estructura.estado)
      });

      estructura.subEstados.forEach(subEstado => {
        const filaSubEstado = grupoEstado.subEstados[subEstado] || { cantidad: 0 };
        filas.push({
          nombre: subEstado,
          cantidad: filaSubEstado.cantidad,
          porcentaje: this.calcularPorcentajeD4(filaSubEstado.cantidad, total),
          esEstado: false,
          nivel: 1,
          color: this.obtenerColorEntregaD4(subEstado, estructura.estado)
        });
      });

      return filas;
    }, [] as IDashboardFilaD4[]);
  }

  construirTarjetasEntregaD4(filas: IDashboardFilaD4[], total: number): IDashboardEstadoResumenD4[] {
    const pendiente = this.obtenerCantidadFilaD4(filas, 'Proyectos Pendientes de entrega', true);
    const primerEnvio = this.obtenerCantidadFilaD4(filas, 'Primer envío');
    const reenviado = this.obtenerCantidadFilaD4(filas, 'Reenviado');

    return [
      { codigo: 'total', nombre: 'TOTAL PROYECTOS', cantidad: total, porcentaje: 100, descripcion: 'Alumnos del rango de fechas seleccionado', color: '#1f5f8b' },
      { codigo: 'pendiente', nombre: 'PENDIENTE DE ENTREGA', cantidad: pendiente, porcentaje: this.calcularPorcentajeD4(pendiente, total), descripcion: 'El alumno aún no sube archivo', color: '#8c8c8c' },
      { codigo: 'primer-envio', nombre: 'PRIMER ENVÍO', cantidad: primerEnvio, porcentaje: this.calcularPorcentajeD4(primerEnvio, total), descripcion: 'Versión única, sin reenvío', color: '#1aa6a6' },
      { codigo: 'reenviado', nombre: 'REENVIADO', cantidad: reenviado, porcentaje: this.calcularPorcentajeD4(reenviado, total), descripcion: 'Versión ≥ 2 (tras observación)', color: '#9b51e0' }
    ];
  }

  construirDistribucionEntregaD4(filas: IDashboardFilaD4[]): IDashboardFilaD4[] {
    return filas.filter(fila => !fila.esEstado);
  }

  obtenerEstadoEntregaDashboardD4(item: IProyectoPresentadoPorAlumnoD4): string {
    const subEstado = this.obtenerValorDashboardD4(item.subEstadoEntrega, '');
    const estadoPorSubEstado = this.obtenerEstadoPorSubEstadoEntregaD4(subEstado);
    if (estadoPorSubEstado) return estadoPorSubEstado;

    const estado = this.obtenerValorDashboardD4(item.estadoEntrega, '');
    if (estado) return this.normalizarEstadoEntregaD4(estado);
    return (item.fechaEnvioOriginal || item.fechaEnvio) ? 'Proyectos entregados' : 'Proyectos Pendientes de entrega';
  }

  obtenerSubEstadoEntregaDashboardD4(item: IProyectoPresentadoPorAlumnoD4, estadoEntrega: string = null): string {
    const subEstado = this.obtenerValorDashboardD4(item.subEstadoEntrega, '');
    if (subEstado) return this.normalizarSubEstadoEntregaD4(subEstado, estadoEntrega);
    const estado = estadoEntrega || this.obtenerEstadoEntregaDashboardD4(item);
    if (estado === 'Proyectos Pendientes de entrega') return 'Pendiente de entrega';
    return this.esReenviadoD4(item) ? 'Reenviado' : 'Primer envío';
  }

  obtenerEstadoPorSubEstadoEntregaD4(subEstado: string): string {
    const valor = (subEstado || '').toLowerCase();
    if (!valor) return '';
    if (valor.includes('pendiente')) return 'Proyectos Pendientes de entrega';
    if (valor.includes('primer') || valor.includes('reenviado') || valor.includes('reenv')) return 'Proyectos entregados';
    return '';
  }

  normalizarEstadoEntregaD4(estado: string): string {
    const valor = estado.toLowerCase();
    if (valor.includes('pendiente')) return 'Proyectos Pendientes de entrega';
    if (valor.includes('entregado') || valor.includes('envio') || valor.includes('envío')) return 'Proyectos entregados';
    return estado;
  }

  normalizarSubEstadoEntregaD4(subEstado: string, estado: string): string {
    const valor = subEstado.toLowerCase();
    if (valor.includes('pendiente')) return 'Pendiente de entrega';
    if (valor.includes('primer')) return 'Primer envío';
    if (valor.includes('reenviado') || valor.includes('reenv')) return 'Reenviado';
    if (estado === 'Proyectos Pendientes de entrega') return 'Pendiente de entrega';
    return subEstado;
  }

  esReenviadoD4(item: IProyectoPresentadoPorAlumnoD4): boolean {
    const nroEnvio = Number(item.nroEnvio || 0);
    return nroEnvio >= 2;
  }

  obtenerColorEntregaD4(nombre: string, estado: string = ''): string {
    const valor = `${estado} ${nombre}`.toLowerCase();
    if (valor.includes('pendiente')) return '#8c8c8c';
    if (valor.includes('primer')) return '#1aa6a6';
    if (valor.includes('reenviado') || valor.includes('reenv')) return '#9b51e0';
    if (valor.includes('entregado')) return '#2ab34b';
    return '#8c8c8c';
  }

  construirDashboardDocentesD4(reporte: IProyectoPresentadoPorAlumnoD4[]): IDashboardDocenteD4[] {
    const agrupado: {
      [key: string]: {
        docente: string;
        programa: string;
        total: number;
        diasRevision: number;
        revisados: number;
        segmentos: { [key: string]: IDashboardFilaD4 };
      };
    } = {};

    reporte.forEach(item => {
      const docente = this.obtenerValorDashboardD4(item.docenteCalificacion || item.docente, 'Sin docente asignado');
      if (!agrupado[docente]) {
        agrupado[docente] = {
          docente,
          programa: this.obtenerValorDashboardD4(item.programaEspecifico || item.centroCosto, ''),
          total: 0,
          diasRevision: 0,
          revisados: 0,
          segmentos: {}
        };
      }

      const segmento = this.obtenerSegmentoDocenteD4(item);
      if (!agrupado[docente].segmentos[segmento]) {
        agrupado[docente].segmentos[segmento] = {
          nombre: segmento,
          cantidad: 0,
          porcentaje: 0,
          color: this.obtenerColorSegmentoDocenteD4(segmento)
        };
      }

      agrupado[docente].total++;
      agrupado[docente].segmentos[segmento].cantidad++;

      const diasRevision = this.obtenerDiasRevisionDashboardD4(item);
      if (diasRevision != null) {
        agrupado[docente].diasRevision += diasRevision;
        agrupado[docente].revisados++;
      }
    });

    return Object.values(agrupado)
      .map(docente => ({
        docente: docente.docente,
        programa: docente.programa,
        total: docente.total,
        tiempoPromedio: docente.revisados ? Math.round((docente.diasRevision / docente.revisados) * 10) / 10 : null,
        segmentos: this.obtenerSegmentosDocenteOrdenadosD4(docente.segmentos, docente.total)
      }))
      .sort((a, b) => b.total - a.total || a.docente.localeCompare(b.docente));
  }

  obtenerSegmentoDocenteD4(item: IProyectoPresentadoPorAlumnoD4): string {
    const estadoEntrega = this.obtenerEstadoEntregaDashboardD4(item);
    if (estadoEntrega === 'Proyectos Pendientes de entrega') return 'Pendiente de entrega';

    const subEstadoCalificacion = this.obtenerSubEstadoCalificacionD4(
      item,
      this.obtenerEstadoCalificacionD4(item)
    );
    if (['En plazo', 'Por vencer', 'Vencido'].includes(subEstadoCalificacion)) {
      return `Calificado - ${subEstadoCalificacion}`;
    }
    return this.obtenerEstadoCalificacionD4(item) === 'Pendiente de revisión'
      ? 'Pendiente de revisión'
      : 'Calificado - En plazo';
  }

  obtenerSegmentosDocenteOrdenadosD4(segmentos: { [key: string]: IDashboardFilaD4 }, total: number): IDashboardFilaD4[] {
    const orden = [
      'Pendiente de revisión',
      'Calificado - En plazo',
      'Calificado - Por vencer',
      'Calificado - Vencido',
      'Pendiente de entrega'
    ];

    return orden
      .map(nombre => segmentos[nombre] || {
        nombre,
        cantidad: 0,
        porcentaje: 0,
        color: this.obtenerColorSegmentoDocenteD4(nombre)
      })
      .filter(segmento => segmento.cantidad > 0)
      .map(segmento => ({
        ...segmento,
        porcentaje: this.calcularPorcentajeD4(segmento.cantidad, total)
      }));
  }

  obtenerColorSegmentoDocenteD4(nombre: string): string {
    const valor = nombre.toLowerCase();
    if (valor.includes('pendiente de entrega')) return '#a3a3a3';
    if (valor.includes('pendiente de revisión')) return '#1267d8';
    if (valor.includes('en plazo')) return '#2ab34b';
    if (valor.includes('por vencer')) return '#f5a623';
    if (valor.includes('vencido')) return '#e53935';
    return '#8c8c8c';
  }

  get docentesActivosD4(): number {
    return this.dashboardDocentesD4.length;
  }

  get tiempoPromedioDocentesD4(): number | null {
    const docentesConTiempo = this.dashboardDocentesD4.filter(docente => docente.tiempoPromedio != null);
    if (!docentesConTiempo.length) return null;
    return Math.round((docentesConTiempo.reduce((total, docente) => total + (docente.tiempoPromedio || 0), 0) / docentesConTiempo.length) * 10) / 10;
  }

  get tasaObservacionD4(): number {
    const totalCalificados = this.reporteDashboardBaseD4.filter(item => this.obtenerEstadoCalificacionD4(item) === 'Calificado').length;
    const observados = this.reporteDashboardBaseD4.filter(item => this.obtenerSubEstadoCalificacionD4(item, this.obtenerEstadoCalificacionD4(item)) === 'Calificado observado').length;
    return this.calcularPorcentajeD4(observados, totalCalificados);
  }

  obtenerCodigoFiltroEstadoD4(estado: string): string {
    return estado
      .toLowerCase()
      .replace(/[á]/g, 'a')
      .replace(/[é]/g, 'e')
      .replace(/[í]/g, 'i')
      .replace(/[ó]/g, 'o')
      .replace(/[ú]/g, 'u')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  calcularPorcentajeD4(cantidad: number, total: number): number {
    return total ? Math.round((cantidad * 10000) / total) / 100 : 0;
  }

  obtenerEstadoCalificacionD4(item: IProyectoPresentadoPorAlumnoD4): string {
    const subEstadoCalificacion = this.obtenerValorDashboardD4(item.subEstadoCalificacion, '');
    const estadoPorSubEstado = this.obtenerEstadoPorSubEstadoCalificacionD4(subEstadoCalificacion);
    if (estadoPorSubEstado) return estadoPorSubEstado;

    const estadoCalificacion = this.obtenerValorDashboardD4(item.estadoCalificacion, '');
    if (estadoCalificacion) return this.normalizarEstadoCalificacionD4(estadoCalificacion);
    if (this.esPendienteProyectoCalificacionD4(item)) return 'Sin proyecto (No aplica)';
    if (item.estadoDevuelto != null) return 'Devuelto';
    if (item.fechaCalificacionOriginal || item.fechaCalificacion || item.nota) return 'Calificado';
    return 'Pendiente de revisión';
  }

  obtenerEstadoPorSubEstadoCalificacionD4(subEstado: string): string {
    const valor = subEstado.toLowerCase();
    if (!valor) return '';
    if (valor.includes('observado') || valor.includes('sin observaciones')) return 'Calificado';
    if (valor.includes('en plazo') || valor.includes('por vencer') || valor.includes('vencido')) return 'Pendiente de revisión';
    if (valor.includes('no entregado') || valor.includes('no aplica')) return 'Sin proyecto (No aplica)';
    return '';
  }

  obtenerSubEstadoCalificacionD4(item: IProyectoPresentadoPorAlumnoD4, estadoCalificacion: string = null): string {
    const subEstadoCalificacion = this.obtenerValorDashboardD4(item.subEstadoCalificacion, '');
    if (subEstadoCalificacion) return this.normalizarSubEstadoCalificacionD4(subEstadoCalificacion, estadoCalificacion);
    const estado = estadoCalificacion || this.obtenerEstadoCalificacionD4(item);
    if (this.esEstadoPendienteProyectoD4(estado)) return 'No entregado aún';
    if (item.estadoDevuelto != null) return 'Proyecto devuelto';
    if (item.nota) return `Nota: ${item.nota}`;
    return estado;
  }

  normalizarEstadoCalificacionD4(estado: string): string {
    const valor = estado.toLowerCase();
    if (valor.includes('sin proyecto') || valor.includes('no aplica')) return 'Sin proyecto (No aplica)';
    if (valor.includes('pendiente')) return 'Pendiente de revisión';
    if (valor.includes('calificado')) return 'Calificado';
    return estado;
  }

  normalizarSubEstadoCalificacionD4(subEstado: string, estado: string): string {
    const valor = subEstado.toLowerCase();
    if (valor.includes('observado')) return 'Calificado observado';
    if (valor.includes('sin observaciones')) return 'Calificado sin observaciones';
    if (valor.includes('en plazo')) return 'En plazo';
    if (valor.includes('por vencer')) return 'Por vencer';
    if (valor.includes('vencido')) return 'Vencido';
    if (valor.includes('no entregado')) return 'No entregado aún';
    if (valor.includes('no aplica')) return 'No entregado aún';
    if (this.esEstadoPendienteProyectoD4(estado)) return 'No entregado aún';
    return subEstado;
  }

  esPendienteProyectoCalificacionD4(item: IProyectoPresentadoPorAlumnoD4): boolean {
    const estadoCalificacion = this.obtenerValorDashboardD4(item.estadoCalificacion, '');
    return !estadoCalificacion && !item.fechaEnvioOriginal && !item.fechaEnvio;
  }

  esEstadoPendienteProyectoD4(estado: string): boolean {
    const valor = (estado || '').toLowerCase();
    return valor.includes('sin proyecto') || valor.includes('no aplica');
  }

  obtenerColorCalificacionD4(nombre: string, estado: string = ''): string {
    const valor = `${estado} ${nombre}`.toLowerCase();
    if (valor.includes('sin proyecto') || valor.includes('pendiente de proyecto') || valor.includes('no entregado') || valor.includes('no aplica')) return '#8c8c8c';
    if (valor.includes('en plazo')) return '#2ab34b';
    if (valor.includes('por vencer')) return '#f5a623';
    if (valor.includes('vencido')) return '#e53935';
    if (valor.includes('observado')) return '#1267d8';
    if (valor.includes('sin observaciones')) return '#5a9be7';
    if (valor.includes('pendiente')) return '#1267d8';
    if (valor.includes('calificado')) return '#2ab34b';
    return '#8c8c8c';
  }

  obtenerValorDashboardD4(valor: string | null, valorDefecto: string): string {
    return valor && valor.toString().trim() ? valor.toString().trim() : valorDefecto;
  }

  formatearFechaDashboardD4(fecha: string | Date): string {
    if (!fecha) return '';
    const fechaConvertida = new Date(fecha);
    if (isNaN(fechaConvertida.getTime())) return fecha.toString();
    const dia = fechaConvertida.getDate().toString().padStart(2, '0');
    const mes = (fechaConvertida.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaConvertida.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

  obtenerDiasRevisionDashboardD4(item: IProyectoPresentadoPorAlumnoD4): number | null {
    const fechaEnvio = item.fechaEnvioOriginal || item.fechaEnvio;
    const fechaCalificacion = item.fechaCalificacionOriginal || item.fechaCalificacion;
    if (!fechaEnvio) return null;
    return this.obtenerDiasTranscurridosD4(fechaEnvio, fechaCalificacion);
  }

  obtenerFechaDashboardD4(fecha: string): Date | null {
    if (!fecha) return null;
    const partes = fecha.split('-');
    if (partes.length === 3 && partes[0].length === 2) return new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);

    const fechaConvertida = new Date(fecha);
    return isNaN(fechaConvertida.getTime()) ? null : fechaConvertida;
  }

  obtenerDiasTranscurridosD4(fEnvio: string, fRevisado: string): number {
    const startDate = this.obtenerFechaDashboardD4(fEnvio);
    const endDate = fRevisado ? this.obtenerFechaDashboardD4(fRevisado) : new Date();
    if (!startDate || !endDate) return 0;

    const timeDifferenceMs = endDate.getTime() - startDate.getTime();
    return Math.max(0, Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24)));
  }

  formatearNumero(valor: number | null | undefined, decimales: number = 2): string {
    if (valor === null || valor === undefined) return '-';
    return valor.toLocaleString('es-PE', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
  }

  getEstadoSesionColor(idEstado: number): string {
    const mapa: { [k: number]: string } = {
      1: 'bg-success', 2: 'bg-danger', 3: 'bg-warning text-dark',
      5: 'bg-primary', 4: 'bg-info', 6: 'bg-secondary'
    };
    return mapa[idEstado] || 'bg-secondary';
  }
}
