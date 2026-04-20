/**
 * Interfaces para el Dashboard de Programas de Capacitacion
 * Autor: Marco Villanueva Torres
 * Fecha: 2025-04-17
 */

// KPIs principales del dashboard
export interface IReporteDashboardResumen {
  totalProgramasPadre: number;
  totalProgramasHijo: number;
  programasLanzamiento: number;
  programasEjecucion: number;
  programasFinalizados: number;
  totalDocentes: number;
  docentesActivos: number;
  totalCoordinadores: number;
  totalSesiones: number;
}

// Distribucion por estado
export interface IReporteDashboardEstado {
  estado: string;
  cantidadProgramas: number;
}

// Distribucion por modalidad
export interface IReporteDashboardModalidad {
  modalidad: string;
  cantidadProgramas: number;
  cantidadSesiones: number;
  porcentaje: number;
}

// Listado de programas
export interface IReporteDashboardPrograma {
  idProgramaEspecificoPadre: number;
  centroCostoPadre: string;
  programaEspecificoPadre: string;
  estadoPadre: string;
  modalidad: string;
  fechaInicio: Date | string;
  ciudad: string;
  areaCapacitacion: string;
  subAreaCapacitacion: string;
}

// Detalle de cursos/sesiones
export interface IReporteDashboardCurso {
  centroCostoPadre: string;
  programaEspecificoPadre: string;
  centroCostoHijo: string;
  curso: string;
  estadoSesion: string;
  nroSesion: string;
  fecha: Date | string;
  diaSemana: string;
  horario: string;
  docente: string;
  sede: string;
  aula: string;
  coordinador: string;
}

// Asignacion de docentes
export interface IReporteDashboardDocente {
  docente: string;
  idDocente: number;
  docenteActivo: number;
  programasAsignados: number;
  cursosAsignados: number;
  totalSesiones: number;
  primeraClase: Date | string;
  ultimaClase: Date | string;
}

// Grafico de programas por mes
export interface IReporteDashboardGraficoPorMes {
  mes: number;
  nombreMes: string;
  estadoPadre: string;
  cantidadProgramas: number;
  cantidadSesiones: number;
}

// Valores para los combos de filtros
export interface IReporteDashboardFiltros {
  anios: number[];
  estados: string[];
  modalidades: string[];
  areas: string[];
  ciudades: string[];
  programasEspecificos: IReporteDashboardProgramaEspecificoItem[];
  centrosCosto: string[];
}

// Item para combo de programas especificos
export interface IReporteDashboardProgramaEspecificoItem {
  id: number;
  nombre: string;
}

// Resumen semanal de sesiones
export interface IReporteDashboardSemanal {
  semana: number;
  fechaInicioSemana: Date | string;
  fechaFinSemana: Date | string;
  totalSesiones: number;
  programasActivos: number;
  docentesActivos: number;
  sesionesPendientes: number;
  sesionesRealizadas: number;
  sesionesCanceladas: number;
  sesionesReprogramadas: number;
}

// Datos completos para exportacion
export interface IReporteDashboardCompleto {
  centroCostoPadre: string;
  programaEspecificoPadre: string;
  estadoPadre: string;
  centroCostoHijo: string;
  programaEspecificoHijo: string;
  estadoHijo: string;
  modalidadHijo: string;
  anio: number;
  semanaCalendario: string;
  fecha: Date | string;
  horario: string;
  sede: string;
  aula: string;
  nroSesion: string;
  docente: string;
  coordinador: string;
  nroAmbientesProgramados: string;
  nroAmbientesDisponibles: number;
  nombreModalidad: string;
  areaCapacitacion: string;
  subAreaCapacitacion: string;
  ciudad: string;
  diaSemana: string;
}

// Request de filtros desde el frontend
export interface IReporteDashboardFiltroRequest {
  anio?: number;
  estado?: string;
  modalidad?: string;
  fechaInicio?: Date | string;
  fechaFin?: Date | string;
  area?: string;
  ciudad?: string;
  programaPadre?: string;
  idProgramaEspecificoPadre?: number;
  centroCostoPadre?: string;
}

// Datos de sesiones para vista de calendario
export interface IReporteDashboardCalendario {
  fecha: Date | string;
  diaSemana: string;
  semanaCalendario: number;
  cantidadSesiones: number;
  programas: string;
}

// Datos para graficos de Kendo
export interface IChartSeriesItem {
  category: string;
  value: number;
  color?: string;
}

export interface IChartSeriesData {
  name: string;
  data: number[];
}
