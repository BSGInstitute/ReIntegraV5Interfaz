export interface IArbolOcurrenciaOperaciones {
  color: string;
  crearOportunidad: boolean;
  estadoOcurrencia: number;
  faseSiguiente?: string;
  fechaCreacion: Date;
  idActividadCabecera: number;
  idFaseOportunidad: number;
  idOcurrenciaActividad: number;
  idOcurrenciaActividad_Padre: number;
  idOcurrenciaReporte: number;
  idPlantillaCE?: number;
  idPlantillaWP?: number;
  idPlantilla_Speech?: number;
  nivel: string;
  nombreEstadoOcurrencia: string;
  nombreOcurrencia: string;
  requiereLlamada: string;
  roles: string;
  tieneActividades: string;
  tieneOcurrencias: boolean;

  ocurrenciasHijos: any;
  class?: string;
  seleccionado?: boolean;
  toggle?: boolean;
  plantilla?: {
    titulo?: string;
    contenido?: string;
    toggle?: boolean;
  };
  // ocurrenciasHijos?: IArbolOcurrenciaAlterno[];
}
export interface IArbolOcurrenciaAlterno {
  idOcurrenciaActividad?: number;
  idOcurrenciaReporte: number;
  requiereLlamada?: string;
  estadoOcurrencia?: number;
  nombreOcurrencia?: string;
  color?: string;
  roles?: string;
  nivel: string;
  tieneOcurrencias: boolean;
  tieneActividades: string;
  idFaseOportunidad: number;
  idOcurrenciaActividadPadre?: number;
  fechaCreacion: string | Date;
  idPlantillaSpeech?: number;
  nombreEstadoOcurrencia: string;
  crearOportunidad: boolean;
  faseSiguiente?: string;
  idPlantillaWP?: number;
  idPlantillaCE?: number;
  class?: string;
  seleccionado?: boolean;
  toggle?: boolean;
  plantilla?: {
    titulo?: string;
    contenido?: string;
    toggle?: boolean;
  };
  ocurrenciasHijos?: IArbolOcurrenciaAlterno[];
}
export interface IPlantillaActividadOcurrencia {
  id: number;
  idOcurrenciaActividad: number;
  idPlantilla: number;
  numeroDiasSinContacto: number;
}

export interface IReporteIncidencia{
  idContacto: number;
  idCentroCosto?: number;
  idOcurrenciaReporte: number;
  idFaseOportunidad: number;
  idActividadOcurrencia: number;
  diasSinContactoOportunidad: number;
  idActividadCabecera: number;
  tieneOcurrencias: boolean;
}
