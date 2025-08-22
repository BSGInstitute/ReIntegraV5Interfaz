export interface IFiltroEnvio {
  idMatriculaCabecera?:number;
  idEstadoSolicitud?: number[];
  fechaInicio?: string;
  fechaFin?: string;
  idUsuario?:number;

}

export interface IFormReporte {
  Alumno?:string[];
  estados?: number[];
  fechaInicio?: string;
  fechaFin?: string;
  tipoBusqueda: string [];
  dataBusqueda : string [];
}

export interface IFormRegistro {
  tipoReporte?:number[];
  categoria?: number[];
  subCategoria?: string;
  solicitud?: string;
  curso: string [];
  detalleSolicitud : string [];
}