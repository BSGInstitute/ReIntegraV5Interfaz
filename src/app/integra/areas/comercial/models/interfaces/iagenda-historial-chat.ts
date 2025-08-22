export interface CorreoEnviadoSpeech {
  remitente: string;
  destinatarios: string;
  asunto: string;
  emailBody: string;
}
export interface CorreoRecibido {
  listaCorreos: ListaCorreo[];
  totalEnviados: number;
}

export interface ListaCorreo {
  id: number;
  asunto: string;
  emailBody: any;
  fecha: string;
  remitente: string;
  destinatarios: string;
  from: any;
  seen: boolean;
  totalCorreos: any;
  idPersonal: number;
  envioMasivoMandrill: any;
  envioIndividualMandrill: any;
  conCopia: any;
  idAlumno: number;
  messageId: string;
  estado: string;
  categoria: any;
  tipo: string;
}

export interface InteraccionCorreosEnviado {
  id: number;
  fechaCreacion: string;
  categoria: string;
  asunto: string;
  estado: string;
  correoReceptor: string;
  correoRemitente: string;
  remitente: any;
  idPersonal: any;
  idAlumno: any;
  nombreProgramaGeneral: any;
  messageId: any;
  orden: number;
}
export interface HistorialMensajeChat {
  numero: string;
  tipo: number;
  idPais: number;
  mensaje: string;
  idPersonal?: number;
  idAlumno?: number;
  registro?: number;
  fechaCreacion: Date;
  nombrePersonal: string;
  estadoMensaje?: number;
}
export interface HistorialChatPortal {
  idInteraccionChat: number;
  nombreRemitente: string;
  ubicacion: string;
  mensaje: string;
  idAsesor: number;
  fecha: Date;
  chatsession: string;
}
export interface DetalleChatInteraccion {
  idInteraccionChatIntegra?: number;
  nombreRemitente?: string;
  idRemitente: string;
  mensaje?: string;
  fecha: Date;
  nroMensajesSinLeer: number;
  mensajeOfensivo?: boolean;
  idChatDetalleIntegraArchivo?: number;
}

// Interfaces agregadas
export interface MensajeGenerico {
  WaTo: string;
  WaBody: string;
  IdPais: number;
  IdAlumno: number;
  IdPersonal: number;
  WaCaption: string
  WaTypeMensaje: number;
  IdPlantilla: number;
  DatosPlantillaWhatsApp: {
    codigo: string;
    texto: string;
  }[];
}
export interface IDataEnvioWhatsappComercial {
  Id: number;
  WaTo: string;
  WaId?: string;
  WaType: string;
  WaTypeMensaje?: number;
  WaRecipientType: string;
  WaBody?: string;
  WaFile?: string;
  WaFileName?: string;
  WaMimeType?: string;
  WaSha256?: string;
  WaLink?: string;
  WaCaption?: string;
  IdPais: number;
  EsMigracion?: boolean;
  IdMigracion?: number;
  IdPersonal: number;
  IdAlumno: number;
  datosPlantillaWhatsApp?: {
    codigo: string;
    texto: string;
  }[];
}
export interface MensajeTexto {
  WaTo: string;
  WaBody: string;
  IdPais: number;
  IdAlumno: number;
}
export interface WhatsAppMensajeArchivoCom {
  waTo: string;
  waType: string;
  waLink: string;
  waFileName: string;
  idPais: number;
  idAlumno: number;
  idPersonal: number;
}
export interface MensajePlantilla {
  WaTo: string;
  WaCaption: string
  WaBody: string
  WaTypeMensaje: number;
  IdPlantilla: number;
  IdPais: number;
  IdAlumno: number;
  IdPersonal: number;
  DatosPlantillaWhatsApp: {
    codigo: string;
    texto: string;
  }[];
}
export interface ContenidoPlantillaCompleta {
  plantilla: string;
  objetoplantilla: {
    codigo: string;
    texto: string;
  }[];
}

export interface ListaMensajeWhatsapp {
  numero: string;
  mensaje: string;
  idPersonal: number;
  idPais: number;
  idAlumno: number;
  fechaCreacion: string;
  nombreAlumno: string;
}

export interface MensajeWhatsapp {
  numero: string;
  tipo: number;
  idPais: number;
  mensaje: string;
  idPersonal: number;
  idAlumno: number;
  registro: number;
  fechaCreacion: string;
  nombrePersonal: string;
  estadoMensaje: number;
}
export interface PlantillaInformacion {
  contenido: string;
  descripcion: string;
  id: number;
  nombre: string;
  tipoPlantilla: number;
  nombreAlterno: string;
  htmlPrevisualizacion: string;
}