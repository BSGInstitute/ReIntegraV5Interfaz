/**
 * @module MarketingModule
 * @description Interfaces (DTOs) del módulo Reviews Computrabajo — alineadas con ResenaComputrabajoController.
 * @author Max Mantilla
 * @version 1.0.0
 * @history
 * * 21/04/2026 Implementación inicial
*/

export interface IComputrabajoResena {
  idComputrabajoResena:         number;
  idComputrabajoConfiguracion:  number;
  contenido:                    string;
  valoracion:                   number;
  cargo:                        string;
  tipoEmpleado:                 string;
  ventaja:                      string;
  desventaja:                   string;
  idPais:                       number | null;
  nombrePais:                   string;
  rutaBandera:                  string;
  idCiudad:                     number | null;
  nombreCiudad:                 string;
  fechaResena:                  Date;
  mostrar:                      boolean;
  fechaCreacion:                Date;
}

export interface IPaisComputrabajoCombo {
  idPais:       number;
  nombrePais:   string;
  rutaBandera:  string;
}

export interface ICiudadComputrabajoCombo {
  idCiudad:      number;
  nombreCiudad:  string;
}

export interface IComputrabajoResenaFiltro {
  mostrar:       boolean | null;
  idPaisLista:   number[];
  tipoEmpleado:  string;
  fechaInicio:   string | null;
  fechaFin:      string | null;
  pagina:        number;
  tamanoPagina:  number;
}

export interface IMarcarVisibilidadComputrabajoRequest {
  idsComputrabajoResena:  number[];
  usuario:                string;
}

export interface IComputrabajoConfiguracion {
  id?:                   number;
  nombreEmpresa:         string;
  valoracion:            number;
  resenaTotal:                 number;
  urlPerfil:             string;
  fechaSincronizacion?:  string | null;
}
