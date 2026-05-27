/**
 * @module MarketingModule
 * @description Interfaces (DTOs) del módulo Alumno Caso Exito PW.
 * @author Miguel Valdivia
 * @version 1.0.0
 * @history
 * * 27/05/2026 Implementación inicial
*/

export interface IAlumnoCasoExito {
  id: number;
  nombreAlumno: string;
  nombrePrograma: string;
  fotoPerfil: string | null;
  fotoPerfilAlf: string | null;
  testimonio: string | null;
  idPais: number;
  nombrePais: string;
  posicion: number;
  estadoVisibilidad: boolean;
  urlFotoPerfil: string | null;
}

export interface IPaisComboAce {
  id: number;
  nombre: string;
}

export interface IAlumnoCasoExitoPosicion {
  id: number;
  posicion: number;
}

export interface IAlumnoCasoExitoVisibilidad {
  id: number;
  estadoVisibilidad: boolean;
}
