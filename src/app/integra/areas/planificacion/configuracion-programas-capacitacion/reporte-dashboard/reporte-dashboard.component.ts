import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  IChartSeriesItem
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

  // Tab activo
  activeTab: string = 'programas';

  // Agrupacion temporal para graficas (semana, mes, anio)
  agrupacionTemporal: 'semana' | 'mes' | 'anio' = 'semana';
  opcionesAgrupacion: { value: 'semana' | 'mes' | 'anio'; label: string }[] = [
    { value: 'semana', label: 'Por Semana' },
    { value: 'mes', label: 'Por Mes' },
    { value: 'anio', label: 'Por Año' }
  ];

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
  }

  ngOnInit(): void {
    this.cargarFiltros();
    this.cargarDatosDashboard();
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
}
