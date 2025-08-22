export interface ResultadoBusquedaFicha {
  tabAgenda: string;
  idOportunidad: number;
  idActividadDetalle: number;
  idAlumno: number;
  alumno: string;
  idFaseOportunidad: number;
  faseOportunidad: string;
  fechaModificacion: Date;
  idPersonalAsignado: number;
  personalAsignado: string;
  flagShowFicha?: boolean;
}
