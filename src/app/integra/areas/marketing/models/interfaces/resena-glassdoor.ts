/**
 * @module MarketingModule
 * @description Interfaces (DTOs) del módulo Reviews Glassdoor — alineadas con ResenaGlassdoorController.
 * @author Max Mantilla
 * @version 1.0.0
 * @history
 * * 21/04/2026 Implementación inicial
*/

export interface IGlassdoorResena {
  idGlassdoorResena:         number;
  idGlassdoorConfiguracion:  number;
  titulo:                    string;
  contenido:                 string;
  valoracion:                number;
  cargo:                     string;
  tipoEmpleado:              string;
  ventaja:                   string;
  desventaja:                string;
  idPais:                    number | null;
  nombrePais:                string;
  rutaBandera:               string;
  idCiudad:                  number | null;
  nombreCiudad:              string;
  fechaResena:               Date;
  mostrar:                   boolean;
  fechaCreacion:             Date;
}

export interface IPaisGlassdoorCombo {
  idPais:       number;
  nombrePais:   string;
  rutaBandera:  string;
}

export interface ICiudadGlassdoorCombo {
  idCiudad:      number;
  nombreCiudad:  string;
}

export interface IGlassdoorResenaFiltro {
  mostrar:       boolean | null;
  idPaisLista:   number[];
  tipoEmpleado:  string;
  fechaInicio:   string | null;
  fechaFin:      string | null;
  pagina:        number;
  tamanoPagina:  number;
}

export interface IMarcarVisibilidadGlassdoorRequest {
  idsGlassdoorResena:  number[];
  usuario:             string;
}

export interface IGlassdoorConfiguracion {
  id?:                    number;
  nombreEmpresa:          string;
  identificadorCuenta:    string;
  valoracion:             number;
  resenaTotal:                  number;
  urlPerfil:              string;
  fechaSincronizacion?:   string | null;
}
