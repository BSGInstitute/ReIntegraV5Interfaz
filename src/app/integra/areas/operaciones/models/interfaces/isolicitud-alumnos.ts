export interface IFiltroEnvioSolicitudAlumnos{
    idMatriculaCabecera?:number;
    idEstadoSolicitud?: number[];
    idSolicitante?: number[];
    idOrigen?: number[];
    idAreaSolucion?: number [];
    idPersonalSolucion?: number [];
    fechaInicio?: string;
    fechaFin?: string;
}

export interface IFormReporteSolicitudAlumnos {
    alumno?:string[];
    estados?: number[];
    solicitantes?: number[];
    origenes?: number[];
    areasSolucion?: number[];
    personalSolucion?: number[];
    fechaInicio?: string;
    fechaFin?: string;
    tipoBusqueda: string [];
    dataBusqueda : string [];
  }