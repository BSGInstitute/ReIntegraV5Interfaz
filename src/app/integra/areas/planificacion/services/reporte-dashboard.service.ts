import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constApiPlanificacion } from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Observable } from 'rxjs';
import {
  IReporteDashboardResumen,
  IReporteDashboardEstado,
  IReporteDashboardModalidad,
  IReporteDashboardPrograma,
  IReporteDashboardCurso,
  IReporteDashboardDocente,
  IReporteDashboardGraficoPorMes,
  IReporteDashboardFiltros,
  IReporteDashboardCompleto,
  IReporteDashboardSemanal,
  IReporteDashboardCalendario,
  IReporteDashboardFiltroRequest,
  IReporteDashboardEstadoSesion,
  IReporteDashboardSesionDetalle,
  IReporteDashboardEvolucionEstadoSesion,
  IReporteDashboardKPIsEstadoSesion,
  IReporteDashboardCambioEstado,
  IReporteDashboardEstadoPorDia,
  IReporteDashboardCursoV3,
  IReporteDashboardSeguimientoClase,
  IReporteDashboardSeguimientoFiltroRequest,
  IReporteDashboardDocenteFiltro,
  IReporteDashboardPEspecificoFiltro,
  IReporteDashboardSeguimientoDocente,
  INotasPorPEspecificoD2,
  IReporteDashboardPEspecificoPorDocente,
  IFurDashboard3
} from '@planificacion/models/interfaces/reporte-dashboard';

/**
 * Servicio para el Dashboard de Programas de Capacitacion
 * Autor: Marco Villanueva Torres
 * Fecha: 2025-04-17
 */
@Injectable({
  providedIn: 'root'
})
export class ReporteDashboardService {

  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService
  ) { }

  /**
   * Obtiene el resumen de KPIs principales del dashboard
   */
  obtenerResumen$(anio?: number, idProgramaEspecificoPadre?: number, idCentroCostoPadre?: number): Observable<HttpResponse<IReporteDashboardResumen>> {
    const params = this.buildQueryParams({ anio, idProgramaEspecificoPadre, idCentroCostoPadre });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerResumen}${params}`
    );
  }

  /**
   * Obtiene la distribucion de programas por estado
   */
  obtenerResumenPorEstado$(anio?: number, idProgramaEspecificoPadre?: number, idCentroCostoPadre?: number): Observable<HttpResponse<IReporteDashboardEstado[]>> {
    const params = this.buildQueryParams({ anio, idProgramaEspecificoPadre, idCentroCostoPadre });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerResumenPorEstado}${params}`
    );
  }

  /**
   * Obtiene la distribucion de programas por modalidad
   */
  obtenerResumenPorModalidad$(anio?: number, estado?: string, idProgramaEspecificoPadre?: number, idCentroCostoPadre?: number): Observable<HttpResponse<IReporteDashboardModalidad[]>> {
    const params = this.buildQueryParams({ anio, estado, idProgramaEspecificoPadre, idCentroCostoPadre });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerResumenPorModalidad}${params}`
    );
  }

  /**
   * Obtiene listado de programas filtrado por estado
   */
  obtenerProgramasPorEstado$(
    estado?: string,
    anio?: number,
    fechaInicio?: string,
    fechaFin?: string,
    modalidad?: string,
    idProgramaEspecificoPadre?: number,
    idCentroCostoPadre?: number
  ): Observable<HttpResponse<IReporteDashboardPrograma[]>> {
    const params = this.buildQueryParams({ estado, anio, fechaInicio, fechaFin, modalidad, idProgramaEspecificoPadre, idCentroCostoPadre });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerProgramasPorEstado}${params}`
    );
  }

  /**
   * Obtiene detalle de cursos/sesiones
   */
  obtenerDetalleCursos$(
    fecha?: string,
    fechaInicio?: string,
    fechaFin?: string,
    idProgramaPadre?: number,
    anio?: number,
    idCentroCostoPadre?: number
  ): Observable<HttpResponse<IReporteDashboardCurso[]>> {
    const params = this.buildQueryParams({ fecha, fechaInicio, fechaFin, idProgramaPadre, anio, idCentroCostoPadre });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerDetalleCursos}${params}`
    );
  }

  /**
   * Obtiene listado de docentes con sus asignaciones
   */
  obtenerDocentesAsignados$(
    anio?: number,
    idDocente?: number,
    estado?: string,
    soloActivos?: boolean,
    idProgramaEspecificoPadre?: number,
    idCentroCostoPadre?: number
  ): Observable<HttpResponse<IReporteDashboardDocente[]>> {
    const params = this.buildQueryParams({ anio, idDocente, estado, soloActivos, idProgramaEspecificoPadre, idCentroCostoPadre });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerDocentesAsignados}${params}`
    );
  }

  /**
   * Obtiene datos para grafico de programas por mes
   */
  obtenerGraficoPorMes$(anio?: number, idProgramaEspecificoPadre?: number, idCentroCostoPadre?: number): Observable<HttpResponse<IReporteDashboardGraficoPorMes[]>> {
    const params = this.buildQueryParams({ anio, idProgramaEspecificoPadre, idCentroCostoPadre });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerGraficoPorMes}${params}`
    );
  }

  /**
   * Obtiene los valores disponibles para los filtros del dashboard
   */
  obtenerFiltros$(): Observable<HttpResponse<IReporteDashboardFiltros>> {
    return this._integraService.getJsonResponse(
      constApiPlanificacion.ReporteDashboardObtenerFiltros
    );
  }

  /**
   * Obtiene todos los datos del dashboard con filtros aplicados
   */
  obtenerDatosCompletos$(filtro: IReporteDashboardFiltroRequest): Observable<HttpResponse<IReporteDashboardCompleto[]>> {
    return this._integraService.postJsonResponse(
      constApiPlanificacion.ReporteDashboardObtenerDatosCompletos,
      JSON.stringify(filtro)
    );
  }

  /**
   * Obtiene resumen semanal de sesiones
   */
  obtenerResumenSemanal$(
    anio?: number,
    mesInicio?: number,
    mesFin?: number,
    idProgramaEspecificoPadre?: number,
    idCentroCostoPadre?: number
  ): Observable<HttpResponse<IReporteDashboardSemanal[]>> {
    const params = this.buildQueryParams({ anio, mesInicio, mesFin, idProgramaEspecificoPadre, idCentroCostoPadre });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerResumenSemanal}${params}`
    );
  }

  /**
   * Obtiene datos de sesiones para vista de calendario
   */
  obtenerSesionesCalendario$(
    anio?: number,
    semanaInicio?: number,
    semanaFin?: number,
    mes?: number
  ): Observable<HttpResponse<IReporteDashboardCalendario[]>> {
    const params = this.buildQueryParams({ anio, semanaInicio, semanaFin, mes });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerSesionesCalendario}${params}`
    );
  }

  /**
   * Construye los query params a partir de un objeto
   */
  private buildQueryParams(params: { [key: string]: any }): string {
    const queryParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    return queryParams ? `?${queryParams}` : '';
  }

  /**
   * Maneja errores de las llamadas HTTP
   */
  handleError(error: any): void {
    const mensaje = this._alertaService.getMessageErrorService(error);
    this._alertaService.notificationWarning(mensaje);
  }

  // ============================================
  // Metodos para Estados de Sesion
  // ============================================

  /**
   * Obtiene resumen de sesiones agrupadas por estado de sesion
   */
  obtenerResumenPorEstadoSesion$(anio?: number, idProgramaEspecificoPadre?: number, idCentroCostoPadre?: number): Observable<HttpResponse<IReporteDashboardEstadoSesion[]>> {
    const params = this.buildQueryParams({ anio, idProgramaEspecificoPadre, idCentroCostoPadre });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerResumenPorEstadoSesion}${params}`
    );
  }

  /**
   * Obtiene detalle de sesiones filtradas por estado
   */
  obtenerSesionesPorEstado$(anio?: number, idEstadoSesion?: number, idProgramaEspecificoPadre?: number, idCentroCostoPadre?: number): Observable<HttpResponse<IReporteDashboardSesionDetalle[]>> {
    const params = this.buildQueryParams({ anio, idEstadoSesion, idProgramaEspecificoPadre, idCentroCostoPadre });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerSesionesPorEstado}${params}`
    );
  }

  /**
   * Obtiene evolucion mensual de estados de sesion
   */
  obtenerEvolucionEstadoSesion$(anio?: number, idProgramaEspecificoPadre?: number, idCentroCostoPadre?: number): Observable<HttpResponse<IReporteDashboardEvolucionEstadoSesion[]>> {
    const params = this.buildQueryParams({ anio, idProgramaEspecificoPadre, idCentroCostoPadre });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerEvolucionEstadoSesion}${params}`
    );
  }

  /**
   * Obtiene KPIs de estados de sesion
   */
  obtenerKPIsEstadoSesion$(anio?: number, idProgramaEspecificoPadre?: number, idCentroCostoPadre?: number): Observable<HttpResponse<IReporteDashboardKPIsEstadoSesion>> {
    const params = this.buildQueryParams({ anio, idProgramaEspecificoPadre, idCentroCostoPadre });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerKPIsEstadoSesion}${params}`
    );
  }

  /**
   * Obtiene cambios de estado basados en log (Lanzamiento->Ejecucion, Ejecucion->Concluido, *->Cancelado)
   */
  obtenerCambiosEstado$(ultimasSemanas?: number): Observable<HttpResponse<IReporteDashboardCambioEstado[]>> {
    const params = this.buildQueryParams({ ultimasSemanas });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerCambiosEstado}${params}`
    );
  }

  /**
   * Obtiene estados de programas hijo agrupados por dia o semana
   */
  obtenerEstadosPorDia$(
    idsPEspecificoHijo?: string,
    estados?: string,
    agrupacion?: string,
    fechaInicio?: string,
    fechaFin?: string,
    ultimasSemanas?: number
  ): Observable<HttpResponse<IReporteDashboardEstadoPorDia[]>> {
    const params = this.buildQueryParams({ idsPEspecificoHijo, estados, agrupacion, fechaInicio, fechaFin, ultimasSemanas });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerEstadosPorDia}${params}`
    );
  }

  /**
   * Obtiene detalle de cursos V3 con modalidad clasificada (Inhouse/Presencial/Online)
   */
  obtenerDetalleCursosV3$(
    fecha?: string,
    fechaInicio?: string,
    fechaFin?: string,
    idProgramaPadre?: number,
    anio?: number,
    idCentroCostoPadre?: number,
    modalidadClasificada?: string,
    semanaInicio?: number,
    semanaFin?: number
  ): Observable<HttpResponse<IReporteDashboardCursoV3[]>> {
    const params = this.buildQueryParams({ fecha, fechaInicio, fechaFin, idProgramaPadre, anio, idCentroCostoPadre, modalidadClasificada, semanaInicio, semanaFin });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerDetalleCursosV3}${params}`
    );
  }

  /**
   * Obtiene seguimiento de clases por dia de semana con filtro propio
   */
  obtenerSeguimientoClases$(filtro: IReporteDashboardSeguimientoFiltroRequest): Observable<HttpResponse<IReporteDashboardSeguimientoClase[]>> {
    return this._integraService.postJsonResponse(
      constApiPlanificacion.ReporteDashboardObtenerSeguimientoClases,
      JSON.stringify(filtro)
    );
  }

  // ============================================
  // Dashboard 2: Seguimiento por Docente
  // ============================================

  /**
   * Obtiene lista de docentes para filtro desplegable con busqueda
   */
  obtenerDocentesFiltro$(busqueda?: string): Observable<HttpResponse<IReporteDashboardDocenteFiltro[]>> {
    const params = this.buildQueryParams({ busqueda });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerDocentesFiltro}${params}`
    );
  }

  /**
   * Obtiene lista de programas especificos para filtro con busqueda
   */
  obtenerPEspecificoFiltro$(busqueda?: string): Observable<HttpResponse<IReporteDashboardPEspecificoFiltro[]>> {
    const params = this.buildQueryParams({ busqueda });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerPEspecificoFiltro}${params}`
    );
  }

  /**
   * Obtiene programas especificos donde el docente tiene sesiones asignadas
   */
  obtenerPEspecificoPorDocente$(idProveedor: number): Observable<HttpResponse<IReporteDashboardPEspecificoPorDocente[]>> {
    const params = this.buildQueryParams({ idProveedor });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerPEspecificoPorDocente}${params}`
    );
  }

  /**
   * Obtiene seguimiento completo de un docente (KPIs + programas + sesiones)
   */
  obtenerSeguimientoDocente$(idDocente?: number, idPEspecifico?: number, anio?: number, fechaInicio?: string, fechaFin?: string): Observable<HttpResponse<IReporteDashboardSeguimientoDocente>> {
    const params = this.buildQueryParams({ idDocente, idPEspecifico, anio, fechaInicio, fechaFin });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerSeguimientoDocente}${params}`
    );
  }

  /**
   * Obtiene notas de alumnos calculadas por PEspecifico (Tareas, Asistencia, Promedio Final)
   */
  obtenerNotasPorPEspecifico$(idPEspecifico: number, grupo: number = 1): Observable<HttpResponse<INotasPorPEspecificoD2>> {
    const params = this.buildQueryParams({ idPEspecifico, grupo });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerNotasPorPEspecifico}${params}`
    );
  }

  // ── Dashboard 3: FURs ─────────────────────────────────────────────────────

  /**
   * Obtiene FURs del area 19, tipo PO, estados 3 y 5 para Dashboard 3
   */
  obtenerFursDashboard3$(): Observable<HttpResponse<IFurDashboard3[]>> {
    return this._integraService.getJsonResponse(
      constApiPlanificacion.ReporteDashboardObtenerFursDashboard3
    );
  }

}
