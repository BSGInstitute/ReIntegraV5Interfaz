/**
 * @module MarketingModule
 * @description Interfaces (DTOs) del módulo Reviews Google — alineadas con ResenaGoogleController.
 * @author Max Mantilla
 * @version 1.0.0
 * @history
 * * 21/04/2026 Implementación inicial
*/

export interface ISedeGoogle {
  idGooglePlacesConfiguracion: number;
  identificadorCuenta:         string;
  nombreSede:                  string;
  totalResenas:                number;
  totalMostrar:                number;
  promedioValoracion:          number;
}

export interface IGoogleResena {
  idGoogleResena:               number;
  idGooglePlacesConfiguracion:  number;
  nombreSede:                   string;
  nombreAutor:                  string;
  fotoAutor:                    string;
  valoracion:                   number;
  textoResena:                  string;
  fechaResena:                  Date;
  descripcionTiempoRelativo:    string;
  mostrar:                      boolean;
  fechaCreacion:                Date;
}

export interface ISedeGoogleCombo {
  idGooglePlacesConfiguracion: number;
  nombreSede:                  string;
}

export interface IGoogleResenaFiltro {
  idsSede:          number[];
  esVisible:        boolean | null;
  valoracion:       number | null;
  fechaInicio:      string | null;
  fechaFin:         string | null;
  pagina:           number;
  tamanoPagina:     number;
}

export interface IMarcarVisibilidadGoogleRequest {
  idsGoogleResena:  number[];
  usuario:          string;
}

export interface IGooglePlacesConfiguracion {
  id?:                  number;
  nombreSede:           string;
  identificadorCuenta:  string;
  valoracion:           number;
  resenaTotal:          number;
  mostrar:              boolean;
}
