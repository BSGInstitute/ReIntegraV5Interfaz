export interface IAgendaDocumentoPrograma {
  id: number,
  nombre: string,
  mensaje: string,
  mensajeDetalle: string,
  url:string,
  documentoByte:string
}

export interface IOportunidadPEspecificoAgenda {
  oportunidad: IOportunidadAgenda;
  pEspecifico: IPEspecificoAgenda;
}

export interface IOportunidadAgenda {
  anexo3CX: string;
  central: string;
  codigoPagoIC?: string;
  costoTotalConDescuento?: string;
  email: string;
  encabezadoCorreoPartner?: string;
  fechaEnvio?: string;
  id: number;
  idActividadCabeceraUltima: number;
  idActividadDetalle: number;
  idActividadDetalleUltima: number;
  idAlumno: number;
  idCategoriaOrigen: number;
  idCategoriaPrograma: string;
  idCentroCosto: number;
  idEstadoActividadDetalleUltimoEstado: number;
  idEstadoOcurrenciaUltimo: number;
  idEstadoOportunidad: number;
  idFaseOportunidad: number;
  idFaseOportunidadInicial: number;
  idFaseOportunidadMaxima: number;
  idOrigen: number;
  idPersonalAsignado: number;
  idPgeneral: number;
  idTipoDato: number;
  nombrePartner?: string;
  nombreProgramaGeneral: string;
  precioContado?: string;
  promocion25?: boolean;
  pwDuracion: string;
  ultimaFechaProgramada: string;
  ultimoComentario: string;
  urlBrochurePrograma: string;
  urlFirmaCorreos: string;
  urlVersion: string;
}
export interface IPEspecificoAgenda {
  categoria: string;
  ciudad: string;
  cursoIndividual?: boolean;
  duracion: string;
  estadoP: string;
  estadoPid: number;
  fechaHoraInicio?: string;
  id: number;
  idAmbiente?: number;
  idCiudad: number;
  idExpositorReferencia: number;
  idProgramaGeneral: number;
  idSesionInicio?: number;
  nombre: string;
  tipo: string;
  tipoAmbiente: string;
  tipoId: number;
  urlDocumentoCronograma?: string;
  urlDocumentoCronogramaGrupos?: string;
}
export interface DocumentoPrograma {
  oportunidad: DPOportunidad
  programaEspecifico: DPProgramaEspecifico
  documentos: Documento[]
}
interface DPOportunidad {
  id: number
  idCentroCosto: number
  idPersonalAsignado: number
  idTipoDato: number
  idFaseOportunidad: number
  idOrigen: number
  codigoPagoIC: any
  idAlumno: number
  ultimoComentario: string
  idActividadDetalleUltima: number
  idActividadCabeceraUltima: number
  idEstadoActividadDetalleUltimoEstado: number
  ultimaFechaProgramada: string
  idEstadoOportunidad: number
  idEstadoOcurrenciaUltimo: number
  idFaseOportunidadMaxima: number
  idFaseOportunidadInicial: number
  idCategoriaOrigen: number
  nombrePartner: string
  encabezadoCorreoPartner: any
  idActividadDetalle: number
  precioContado: any
  nombreProgramaGeneral: string
  pwDuracion: string
  idCategoriaPrograma: string
  urlVersion: any
  urlBrochurePrograma: string
  fechaEnvio: any
  central: string
  anexo3CX: string
  urlFirmaCorreos: string
  email: string
  idPgeneral: number
  costoTotalConDescuento: any
  promocion25: any
}
interface DPProgramaEspecifico {
  id: number
  nombre: string
  estadoP: string
  tipo: string
  tipoAmbiente: string
  categoria: string
  idProgramaGeneral: number
  ciudad: string
  estadoPid: number
  tipoId: number
  idCiudad: number
  duracion: string
  cursoIndividual: boolean
  idSesionInicio: number
  idExpositorReferencia: any
  idAmbiente: any
  urlDocumentoCronograma: string
  fechaHoraInicio: string
  urlDocumentoCronogramaGrupos: any
}
export interface Documento {
  id: number
  nombre: string
  habilitado: boolean
  url?: string
  documentoByte?: string
  mensaje: string
  mensajeDetalle: string
  generado: boolean
}
