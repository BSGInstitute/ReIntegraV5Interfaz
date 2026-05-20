/**
 * @module MarketingModule
 * @description Interfaces (DTOs) del módulo Reviews LinkedIn — alineadas con ResenaLinkedinController.
 * @author Max Mantilla
 * @version 1.0.0
 * @history
 * * 21/04/2026 Implementación inicial
*/

export interface ILinkedinResena {
  idLinkedinResena:        number;
  idLinkedinConfiguracion: number;
  nombreAutor:             string;
  cargo:                   string;
  empresa:                 string;
  fotoAutor:               string;
  urlPublicacion:          string;
  textoResena:             string;
  certificacion:           string;
  idPais:                  number | null;
  nombrePais:              string;
  rutaBandera:             string;
  idCiudad:                number | null;
  nombreCiudad:            string;
  fechaResena:             Date;
  mostrar:                 boolean;
  fechaCreacion:           Date;
}

export interface IPaisLinkedinCombo {
  idPais:       number;
  nombrePais:   string;
  rutaBandera:  string;
}

export interface ICiudadLinkedinCombo {
  idCiudad:      number;
  nombreCiudad:  string;
}

export interface ILinkedinResenaFiltro {
  esVisible:     boolean | null;
  idsPais:       number[];
  fechaInicio:   string | null;
  fechaFin:      string | null;
  pagina:        number;
  tamanoPagina:  number;
}

export interface IMarcarVisibilidadLinkedinRequest {
  idsLinkedinResena:  number[];
  usuario:            string;
}

export interface ILinkedinConfiguracion {
  id?:           number;
  nombre:        string;
  enlacePagina:  string;
  resenaTotal:  number;
}
