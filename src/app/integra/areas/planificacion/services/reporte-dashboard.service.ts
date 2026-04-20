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
  IReporteDashboardFiltroRequest
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
  obtenerResumen$(anio?: number, idProgramaEspecificoPadre?: number, centroCostoPadre?: string): Observable<HttpResponse<IReporteDashboardResumen>> {
    const params = this.buildQueryParams({ anio, idProgramaEspecificoPadre, centroCostoPadre });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerResumen}${params}`
    );
  }

  /**
   * Obtiene la distribucion de programas por estado
   */
  obtenerResumenPorEstado$(anio?: number, idProgramaEspecificoPadre?: number, centroCostoPadre?: string): Observable<HttpResponse<IReporteDashboardEstado[]>> {
    const params = this.buildQueryParams({ anio, idProgramaEspecificoPadre, centroCostoPadre });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerResumenPorEstado}${params}`
    );
  }

  /**
   * Obtiene la distribucion de programas por modalidad
   */
  obtenerResumenPorModalidad$(anio?: number, estado?: string, idProgramaEspecificoPadre?: number, centroCostoPadre?: string): Observable<HttpResponse<IReporteDashboardModalidad[]>> {
    const params = this.buildQueryParams({ anio, estado, idProgramaEspecificoPadre, centroCostoPadre });
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
    centroCostoPadre?: string
  ): Observable<HttpResponse<IReporteDashboardPrograma[]>> {
    const params = this.buildQueryParams({ estado, anio, fechaInicio, fechaFin, modalidad, idProgramaEspecificoPadre, centroCostoPadre });
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
    centroCostoPadre?: string
  ): Observable<HttpResponse<IReporteDashboardCurso[]>> {
    const params = this.buildQueryParams({ fecha, fechaInicio, fechaFin, idProgramaPadre, anio, centroCostoPadre });
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
    centroCostoPadre?: string
  ): Observable<HttpResponse<IReporteDashboardDocente[]>> {
    const params = this.buildQueryParams({ anio, idDocente, estado, soloActivos, idProgramaEspecificoPadre, centroCostoPadre });
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ReporteDashboardObtenerDocentesAsignados}${params}`
    );
  }

  /**
   * Obtiene datos para grafico de programas por mes
   */
  obtenerGraficoPorMes$(anio?: number, idProgramaEspecificoPadre?: number, centroCostoPadre?: string): Observable<HttpResponse<IReporteDashboardGraficoPorMes[]>> {
    const params = this.buildQueryParams({ anio, idProgramaEspecificoPadre, centroCostoPadre });
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
    centroCostoPadre?: string
  ): Observable<HttpResponse<IReporteDashboardSemanal[]>> {
    const params = this.buildQueryParams({ anio, mesInicio, mesFin, idProgramaEspecificoPadre, centroCostoPadre });
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
}
