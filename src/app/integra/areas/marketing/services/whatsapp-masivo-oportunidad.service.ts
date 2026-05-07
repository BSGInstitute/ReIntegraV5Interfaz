import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IntegraService } from '@shared/services/integra.service';
import { constApiComercial, constApiMarketing } from '@environments/constApi';
import { WHATSAPP_MENSAJE_ENVIADO } from '@apiIntegra/marketing/whatsapp/whatsapp-mensaje-enviado';
import { PreCargaMasivaRequest, LeadPreCargado, ExtraccionBatchRequest, ExtraccionBatchStatus, ExtraccionBatchResultados, CalificacionLlamadaRequest, CalificacionLlamadaStatus, CalificacionLlamadaResultados, HistorialOportunidadMasivo } from '../campania-whatsapp/whatsapp-masivo/models/modal-masivo';
import { AlumnoWhatsapp } from '../campania-whatsapp/whatsapp-masivo/models/atributos-alumno';

@Injectable({ providedIn: 'root' })
export class WhatsappMasivoOportunidadService {

  constructor(
    private integraService: IntegraService
  ) {}

  // Catalogos (reutilizados)
  obtenerCombosAtributosAlumno(): Observable<HttpResponse<any>> {
    return this.integraService.obtener(WHATSAPP_MENSAJE_ENVIADO.ObtenerCombosAtributosAlumno);
  }

  obtenerPersonalOportunidad(): Observable<HttpResponse<any>> {
    return this.integraService.obtener(WHATSAPP_MENSAJE_ENVIADO.ObtenerPersonalOportunidad);
  }

  obtenerOrigenCombo(): Observable<HttpResponse<any>> {
    return this.integraService.obtener(constApiMarketing.OrigenObtenerCombo);
  }

  obtenerComboRespuestaWhatsApp(): Observable<HttpResponse<any>> {
    return this.integraService.obtener(constApiMarketing.CombosPlantilla);
  }

  obtenerCentroCostoAutocomplete(valor: string): Observable<HttpResponse<any>> {
    return this.integraService.postJsonResponse(
      constApiComercial.CentroCostoObtenerAutocomplete,
      JSON.stringify({ valor })
    );
  }

  // Precarga masiva (NUEVO — backend pendiente)
  obtenerDatosPreCargaMasiva(request: PreCargaMasivaRequest): Observable<HttpResponse<LeadPreCargado[]>> {
    return this.integraService.postJsonResponse(
      constApiMarketing.ObtenerDatosPreCargaMasiva,
      request
    );
  }

  // Centro de costo por alumno (NUEVO — backend pendiente)
  obtenerCentroCostoPorAlumno(idAlumno: number): Observable<HttpResponse<any>> {
    return this.integraService.obtener(
      `${constApiMarketing.ObtenerCentroCostoPorAlumno}/${idAlumno}`
    );
  }

  // Actualizar perfil masivo (NUEVO — backend pendiente)
  actualizarDatosAlumnoMasivo(leads: AlumnoWhatsapp[]): Observable<HttpResponse<any>> {
    return this.integraService.postJsonResponse(
      constApiMarketing.ActualizarDatosAlumnoMasivo,
      leads
    );
  }

  // Crear oportunidad individual (reutilizado — llamado en loop)
  crearOportunidadWhatsapp(dto: {
    idAlumno: number;
    idCentroCosto: number;
    idPersonalAsignado: number;
    activo: boolean;
    idOrigen: number;
  }): Observable<HttpResponse<any>> {
    return this.integraService.postJsonResponse(
      constApiMarketing.CrearOportunidadWhatsapp,
      dto
    );
  }

  // Envio masivo de plantilla (ya existe)
  enviarPlantillaMasiva(dto: any): Observable<HttpResponse<any>> {
    return this.integraService.postJsonResponse(
      constApiMarketing.EnvioPlantillasPorLista,
      dto
    );
  }

  // Obtener programa por oportunidad (reutilizado — mismo endpoint que flujo unitario)
  obtenerProgramaPorOportunidadWhatsapp(idOportunidad: number): Observable<HttpResponse<any>> {
    return this.integraService.postJsonResponse(
      constApiMarketing.ObtenerProgramaPorOportunidadWhatsapp,
      JSON.stringify(idOportunidad)
    );
  }

  // Validar probabilidad oportunidades (reutilizado — mismo endpoint que flujo unitario)
  validarProbabilidadOportunidades(dto: {
    IdOportunidad: number;
    IdAlumno: number;
    IdClasificacionPersona: number;
    IdArea: number;
    IdPGeneral: number;
  }): Observable<HttpResponse<any>> {
    return this.integraService.postJsonResponse(
      constApiMarketing.ValidarProbabilidadOportunidades,
      dto
    );
  }

  // ---------------------------------------------------------------------------
  // Extraccion IA — via backend BSG
  // ---------------------------------------------------------------------------

  iniciarExtraccionBatch(payload: any): Observable<HttpResponse<{ call_id: string }>> {
    return this.integraService.postJsonResponse(
      constApiMarketing.IniciarExtraccionBatch,
      payload
    );
  }

  obtenerEstadoExtraccion(callId: string): Observable<HttpResponse<ExtraccionBatchStatus>> {
    return this.integraService.obtener(
      `${constApiMarketing.ObtenerEstadoExtraccion}/${callId}`
    );
  }

  obtenerResultadosExtraccion(callId: string): Observable<HttpResponse<ExtraccionBatchResultados>> {
    return this.integraService.obtener(
      `${constApiMarketing.ObtenerResultadosExtraccion}/${callId}`
    );
  }

  // ---------------------------------------------------------------------------
  // Calificacion IA — via backend BSG
  // ---------------------------------------------------------------------------

  iniciarCalificacionBatch(payload: any): Observable<HttpResponse<{ llamada_id: string }>> {
    return this.integraService.postJsonResponse(
      constApiMarketing.IniciarCalificacionBatch,
      payload
    );
  }

  obtenerEstadoCalificacion(llamadaId: string): Observable<HttpResponse<CalificacionLlamadaStatus>> {
    return this.integraService.obtener(
      `${constApiMarketing.ObtenerEstadoCalificacion}/${llamadaId}`
    );
  }

  obtenerResultadosCalificacion(llamadaId: string): Observable<HttpResponse<CalificacionLlamadaResultados>> {
    return this.integraService.obtener(
      `${constApiMarketing.ObtenerResultadosCalificacion}/${llamadaId}`
    );
  }

  // ---------------------------------------------------------------------------
  // Historial de Oportunidades por Alumno (para calificacion IA V2)
  // ---------------------------------------------------------------------------

  obtenerHistorialOportunidades(idAlumno: number): Observable<HttpResponse<HistorialOportunidadMasivo[]>> {
    return this.integraService.obtener(
      `${constApiMarketing.ObtenerHistorialOportunidades}/${idAlumno}`
    );
  }

  // ---------------------------------------------------------------------------
  // Calificacion IA V2 — perfil_lead + historial_oportunidades
  // ---------------------------------------------------------------------------

  iniciarCalificacionBatchV2(payload: any): Observable<HttpResponse<any>> {
    return this.integraService.postJsonResponse(
      constApiMarketing.IniciarCalificacionBatchV2,
      payload
    );
  }

  obtenerEstadoCalificacionV2(llamadaId: string): Observable<HttpResponse<any>> {
    return this.integraService.obtener(
      `${constApiMarketing.ObtenerEstadoCalificacionV2}/${llamadaId}`
    );
  }

  obtenerResultadosCalificacionV2(llamadaId: string): Observable<HttpResponse<any>> {
    return this.integraService.obtener(
      `${constApiMarketing.ObtenerResultadosCalificacionV2}/${llamadaId}`
    );
  }

  // Contadores (reutilizados — llamados en loop)
  sumaOportunidad(dto: any): Observable<HttpResponse<any>> {
    return this.integraService.postJsonResponse(constApiMarketing.SumaOportunidadWhatsApp, dto);
  }

  sumaChatValido(dto: any): Observable<HttpResponse<any>> {
    return this.integraService.postJsonResponse(constApiMarketing.SumaChatValidoWhatsApp, dto);
  }

  sumaChatInvalido(dto: any): Observable<HttpResponse<any>> {
    return this.integraService.postJsonResponse(constApiMarketing.SumaChatInValidoWhatsApp, dto);
  }
}
