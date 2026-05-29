export interface IReporteProblemasAulaVirtualFiltro {
  capitulo: string
  codigoMatricula: string
  comentario: string
  coordinador: string
  descripcion: string
  fechaCreacion: Date
  id: number
  idTipoCategoriaError: number
  nombreTipoCategoriaError: string
  nombreAlumno: string
  nombreCentroCosto: string
  sesion: string
}
export interface IReporteLibroReclamacionFiltro {
  bienServicio: string
  celular: string
  correoElectronico: string
  detalleReclamo: string
  dni: string
  domicilio: string
  fechaRegistro: Date
  fechaResponder: Date
  id: number
  nombre: string
  pedidoReclamo: string
  referente: string
  tipoReclamo: string
  tipoServicio: string
}
export interface IReporteControlTareaAlumnoFiltro {
  alumno: string
  centroCosto: string
  codigoMatricula: string
  coordinadorAcademico: string
  coordinadorResponsableRevision: string
  curso: string
  direccionUrl: string
  esDocente: boolean
  fechaAsignacion: Date
  fechaCalificacion: Date | string
  fechaEnvio: Date
  id: number
  matriculaAlumnoResponsableRevision: string
  nombreAlumnoResponsableRevision: string
  nombreArchivo: string
  nota: string
  nroTarea: number
  programaEspecifico: string
  version: number
  //propiedades bvista
  diasTranscurridos?: number
  horaCalificacion?: string
}
export interface IReporteEncuestaInicialFiltro {
  idAlumno: number
  alumno: string
  codigoMatricula: string
  idPEspecificoExamen: number
  pEspecificoExamen: string
  idPGeneralExamen: number
  pGeneralExamen: string
  encuesta: string
  centroCostoExamen: string
  idCentroCostoMatricula: number
  centroCostoMatricula: string
  idCoordinador?: number
  coordinadorAcademico: string
  idPGeneralMatricula: number
  pGeneralMatricula: string
  fechaCreacion: string
  nroOrden: number
  idPregunta: number
  enunciadoPregunta: string
  respuesta?: string
  textoRespuesta?: string
  validado: boolean
  preguntas: Pregunta[]
}
export interface IReporteEncuestaIntermediaFiltro {
  alumno: string
  centroCosto: string
  centroCostoMatriculado: string
  codigoMatricula: string
  coordinadorAcademico: string
  encuesta: string
  enunciadoPregunta: string
  fechaCreacion: string
  idPregunta: number
  idRespuesta: number
  nroOrden: number
  pGeneral: string
  PGeneralMatriculado: string
  pEspecifico: string
  respuesta: string
  textoRespuesta: string
}
export interface ReporteEncuesta {
  idAlumno: number
  alumno: string
  codigoMatricula: string
  idPEspecificoExamen: number
  pEspecificoExamen: string
  idPGeneralExamen: number
  pGeneralExamen: string
  centroCostoExamen: string
  idCentroCostoMatricula: number
  centroCostoMatricula: string
  idCoordinador: number
  coordinadorAcademico: string
  idPGeneralMatricula: number
  pGeneralMatricula: string
  encuesta: string
  nombreDocente: string
  fechaCreacion: string
  area?: string
  subArea?: string
  preguntas: Pregunta[]
}

export interface EncuestaFinal {
  alumno: string
  codigoMatricula: string
  pEspecificoExamen: string
  pGeneralExamen: string
  centroCostoExamen: string
  centroCostoMatricula: string
  coordinadorAcademico: string
  pGeneralMatricula: string
  encuesta: string
  fechaCreacion: string
}

export interface Pregunta {
  idPregunta: number
  enunciadoPregunta: string
  nroOrden: number
  validado: boolean
  idTipoPregunta: number
  idTipoRespuesta: number
  nombreTipoRespuesta: string
  respuestas: Respuesta[]
}

export interface Respuesta {
  idRespuesta: number
  enunciadoRespuesta: string
  ordenRespuesta?: number
  textoRespuesta?: string
  validado: boolean
}

//QuejaSugerencia
export interface IQuejaSugerencia{
  id: number;
  fecha: string;
  tipoQueja: string;
  descripcion: string;
  alumno: string;
  programaGeneral: string;
  programaEspecifico: string;
  codigoMatricula: string;
  correo: string;
  asistenteAAC: string;
  centroCosto: string;
  docente: string;
}

export interface QuejaSugerenciaFiltro{
  area: number[] | null;
  subArea: number[] | null;
  programaGeneral: number[] | null;
  tipo: number[] | null;
  fechaInicial: string;
  fechaFin: string;
}
