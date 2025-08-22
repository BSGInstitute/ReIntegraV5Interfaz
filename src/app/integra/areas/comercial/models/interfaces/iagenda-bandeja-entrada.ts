export interface ICorreoBody {
  emailBody: string;
  archivosAdjuntos: Array<ICorreoArchivoAdjunto>;
}

export interface ICorreoArchivoAdjunto {
  id: number;
  idCorreo: number;
  nombreArchivo?: string;
  urlArchivoRepositorio?: string;
}

export interface IReemplazoEtiquetaPlantilla {
  idPlantilla: number;
  idPlantillaBase: number;
  idOportunidad: number;
  grupo: number;
  idMaterialPEspecificoDetalle: number;
  listaIdMaterialPEspecificoDetalle: Array<number>;
  idPostulanteProcesoSeleccion: number;
  fechaGP?: Date;
  //   PersonalBO Personal ;
  incrementoZonaHoraria: number;
  fechaDinamicaRegularizar: number;
  nombrePais: string;
  idPEspecificoSesion?: number;
  idMatriculaCabecera?: number;
  idProveedor: number;
  idPEspecificoWebinar: number;
  idPEspecifico: number;
  emailReemplazado: IPlantillaEmailMandrill;
  whatsAppReemplazado: IPlantillaWhatsAppCalculado;
  smsReemplazado: IPlantillaSmsCalculado;
}

export interface IPlantillaEmailMandrill {
  asunto: string;
  cuerpoHTML: string;
  listaArchivosAdjuntos: Array<IEmailAttachment>;
}
export interface IEmailAttachment {
  content: string;
  name: string;
  type: string;
  base64: boolean;
}

export interface IPlantillaMailingAgenda {
  data: Array<IPlantillaMailing>;
}
export interface IPlantillaMailing {
  idPlantilla: number;
  nombre: string;
  valor: string;
  idPlantillaClaveValor?: number;
}

export interface IPlantillaWhatsAppCalculado {
  plantilla: string;
  listaEtiquetas: Array<IDatoPlantillaWhatsApp>;
}
export interface IDatoPlantillaWhatsApp {
  codigo: string;
  texto: string;
}
export interface IPlantillaSmsCalculado {
  cuerpo: string;
}

export interface ICorreoRecibido {
  id: number;
  asunto: string;
  emailBody?: any;
  fecha: Date;
  remitente: string;
  destinatarios: string;
  from: string;
  seen: boolean;
  totalCorreos?: any;
  idPersonal?: any;
  envioMasivoMandrill?: any;
  envioIndividualMandrill?: any;
  conCopia: string;
  idAlumno?: any;
  messageId?: any;
  estado?: any;
  categoria?: any;
  tipo?: any;
}


export interface IBandejaCorreoEnviadoPorPersonal {
  listaCorreos: Array<any>;
  totalEnviados: number;
}
export interface ICorreoEnviadoPorPersonal {
  id: number;
  asunto: string;
  fecha: Date;
  remitente: string;
  seen: boolean;
  destinatarios: string;
  totalCorreos?: number;
  envioIndividualMandrill: boolean;
  data: any;
  total: number;
}

export interface IFiltroBandejaCorreo {
  idAlumno?: number;
  page: number;
  pageSize: number;
  skip: number;
  take: number;
  idAsesor?: number;
  folder?: string;
  tipoCorreos?: string;
  filtroKendo?: {
    filters: {
      operator: string;
      field: string;
      value: string;
    }[];
    logic: string;
  };
}

export interface IDescargarDocumento {
  idCorreo: number;
  nombreArchivo: string;
}

export interface IMontoPagoPaquete {
  idCentroCosto: number;
  idPaquete: number;
  paquete: string;
}
export interface IComboEstadoMatricula {
  estado: boolean;
  estadoMatricula: string;
  fechaCreacion: Date;
  id: number;
  usuarioCreacion: string;
  usuarioModificacion: string;
}

export interface IComboSubEstado {
  estado: boolean;
  estadoMatricula: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  id: number;
  idAgendaTab: number;
  idEstadoMatricula: number;
  idEstadoPago: string;
  idOpcionAvanceAcademico: number;
  idOpcionNotaPromedio: number;
  nombre: string;
  proyectoFinal: boolean;
  requiereVerificacionInformacion: boolean;
  tieneDeuda: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  valorAvanceAcademico1: number;
  valorAvanceAcademico2: number;
  valorNotaPromedio1: number;
  valorNotaPromedio2: number;
}

export interface IFormRedactarMensajeOperaciones{
  asunto: string,
  de: string,
  para: string,
  conCopia: string,
  plantilla: number,
  grupo: number,
  versiones: number[],
  estados: number[],
  subEstados: number[],
  adjuntar: any,
  mensaje: string,
}
