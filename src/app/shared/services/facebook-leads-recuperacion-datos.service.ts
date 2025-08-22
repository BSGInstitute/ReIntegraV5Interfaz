import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '@environments/environment';

/**
 * Servicio para consumir la API de Facebook Leads Recuperación de Datos
 * @author Miguel Valdivia
 * @version 1.0.0
 */
@Injectable({
  providedIn: 'root'
})
export class FacebookLeadsRecuperacionDatosService {

  private readonly baseUrl = environment.urlApi; 

  constructor(private http: HttpClient) { }

  /**
   * Obtiene los detalles completos de un lead de Facebook por su ID
   * @param leadId - ID del lead de Facebook
   * @returns Observable con los datos completos del lead
   */
  obtenerLeadPorId(leadId: string): Observable<FacebookLeadResponse> {
    const url = `${this.baseUrl}/FacebookLeadsRecuperacionDatos/ObtenerPorId/${leadId}`;
    
    return this.http.get<FacebookLeadResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo de errores del servicio
   * @param error - Error recibido
   * @returns Observable con error formateado
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en FacebookLeadsRecuperacionDatosService:', error);
    
    let errorMessage = 'Ha ocurrido un error inesperado';
    
    if (error.error?.mensaje) {
      errorMessage = error.error.mensaje;
    } else if (error.status === 0) {
      errorMessage = 'No se puede conectar con el servidor';
    } else if (error.status === 404) {
      errorMessage = 'Lead no encontrado';
    } else if (error.status === 500) {
      errorMessage = 'Error interno del servidor';
    }

    return throwError(() => ({ message: errorMessage, originalError: error }));
  }
}

// Interfaces para tipar la respuesta de la API
export interface FacebookLeadResponse {
  leadId: string;
  fechaRegistro: string;
  formulario: FacebookFormulario;
  campania: FacebookCampania;
  conjuntoAnuncio: FacebookConjuntoAnuncio;
  anuncio: FacebookAnuncio;
}

export interface FacebookFormulario {
  nombre: string;
  correo: string;
  movil: string;
  pais: string;
  ciudad: string;
  areaFormacion: string;
  areaTrabajo: string;
  cargo: string;
  industria: string;
}

export interface FacebookCampania {
  nombre: string;
  estado: string;
  objetivo: string;
}

export interface FacebookConjuntoAnuncio {
  nombre: string;
  estado: string;
}

export interface FacebookAnuncio {
  nombre: string;
  estado: string;
}