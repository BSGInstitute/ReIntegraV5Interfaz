export interface ReporteContactabilidadCombos {
  asesores: Array<ReportePersonal>;
  asistentesActivos: Array<PersonalAsignado>;
  asistentesInactivos: Array<PersonalAsignado>;
  asistentesTotales: Array<PersonalAsignado>;
}

export interface ReportePersonal {
  id: number;
  nombreCompleto: string;
  activo?: boolean;
  estado?: boolean;
  idJefe?: number;
}
export interface PersonalAsignado {
  id: number;
  nombres: string;
  email: string;
  activo: boolean;
  usuario: string;
  tipoPersonal: string;
  nivelVisualizacionAgenda: string;
}

export interface IReporteContactabilidadDataV2 {
  // comparativoAsesor: Array<ReporteContactabilidadAgrupado>;
  asesorContactabilidad: Array<ReporteContactabilidad>;
  minutosContactabilidad: Array<ReporteContactabilidadMinutos>;
}

export interface ReporteContactabilidadAgrupado {
  idAsesor: number;
  lista: Array<ReporteContactabilidadAsesorIndicadores>;
}
export interface ReporteContactabilidadAsesorIndicadores {
  idAsesor: number;
  hora: number;
  clave: string;
  valor: number;
  tipo: number;
  totalLlamadas?: number;
}
export interface ReporteContactabilidad {
  hora: number;
  clave: string;
  valor: number;
  tipo: number;
  totalLlamadas?: number;
  troncal: string;
  sede: string;
  cantidadIntentos?: number;
  cantidadIntentoEjecutadoUno?: number;
  cantidadIntentoEjecutadoDos?: number;
  cantidadIntentoEjecutadoTres?: number;
  cantidadIntentoEjecutadoMasTres?: number;
  cantidadIntentoNoEjecutadoUno?: number;
  cantidadIntentoNoEjecutadoDos?: number;
  cantidadIntentoNoEjecutadoTres?: number;
  cantidadIntentoNoEjecutadoMasTres?: number;
  duracionIntentoEjecutadoUno?: number;
  duracionIntentoEjecutadoDos?: number;
  duracionIntentoEjecutadoTres?: number;
  duracionIntentoEjecutadoMasTres?: number;
  duracionIntentoNoEjecutadoUno?: number;
  duracionIntentoNoEjecutadoDos?: number;
  duracionIntentoNoEjecutadoTres?: number;
  duracionIntentoNoEjecutadoMasTres?: number;
}
export interface ReporteContactabilidadMinutos {
  pais: string;
  troncal: string;
  segundos: number;
  minutos: number;
  decimal: number;
}
export interface ItemReporte{
//   hora?: string
//   totalAT?: string
//   totalAE?: string
//   totalTC?: string
//   hora?: string
//   hora?: string
//   hora?: string
//   hora?: string
//   hora?: string
//   hora?: string
//   hora?: string
//   hora?: string
}