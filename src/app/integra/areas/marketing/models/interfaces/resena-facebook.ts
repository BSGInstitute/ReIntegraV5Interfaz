/**
 * @module MarketingModule
 * @description Interfaces (DTOs) del módulo Reviews Facebook — alineadas con ResenaFacebookController.
 * @author Max Mantilla
 * @version 1.0.0
 * @history
 * * 21/04/2026 Implementación inicial
*/

export interface IPaginaFacebook {
  id:                      number;
  identificadorPagina:     string;
  nombrePagina:            string;
  totalResenas:            number;
  totalMostrar:            number;
  totalOpiniones:          number;
  porcentajeRecomendacion: number;
}

export interface IFacebookResena {
  idFacebookResena:               number;
  idFacebookConfiguracion: number;
  nombrePagina:                   string;
  identificadorHistoria:          string;
  recomienda:                     boolean;
  tieneTexto:                     boolean;
  textoResena:                    string;
  fechaResena:                    Date;
  mostrar:                        boolean;
  fechaCreacion:                  Date;
}

export interface ICuentaFacebookCombo {
  id:                   number;
  nombre:               string;
  identificadorPagina:  string;
}

export interface IFacebookResenaFiltro {
  idsPaginasFacebook: number[];
  fechaInicio:        string | null;
  fechaFin:           string | null;
  esVisible:          boolean | null;
  tamanoPagina:       number;
}

export interface IMarcarVisibilidadRequest {
  idsFacebookResena: number[];
  usuario:           string;
}

export interface IFacebookConfiguracion {
  id?:                  number;
  identificadorPagina:  string;
  nombre:               string;
  tokenAccesoPagina:    string;
  resenaTotal:         number;
  valoracion:           number;
  mostrar:              boolean;
}
