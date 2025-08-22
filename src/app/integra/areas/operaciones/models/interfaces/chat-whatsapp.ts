export interface IDocumentosWhatsapp{
  PEspecifico: number;
  Oportunidad: IDatosOportunidad;
  ListaDocumentos: IDocumentos[];
  ContenidoCertificado: any;
}

export interface IDatosOportunidad {
  Id: number;
  IdCentroCosto: number;
  IdPersonalAsignado: number;
  IdTipoDato: number;
  IdFaseOportunidad: number;
  IdOrigen: number;
  IdPgeneral: number;
  IdAlumno: number;
  UltimoComentario: string;
  IdActividadDetalleUltima: number;
  IdActividadCabeceraUltima: number;
  IdEstadoActividadDetalleUltimoEstado: number;
  UltimaFechaProgramada: Date | string;
  IdEstadoOportunidad: number;
  IdEstadoOcurrenciaUltimo: number;
  IdFaseOportunidadMaxima: number;
  IdFaseOportunidadInicial: number;
  IdCategoriaOrigen: number;
  CodigoPagoIC: string;
  NombrePatner: string;
  EncabezadoCorreoPartner: any;
  PrecioContado: any;
  NombreProgramaGeneral: string;
  CostoTotalConDescuento: any;
  pw_duracion: string;
  FechaEnvio: Date | string;
  IdMatricula: string;
  Central: string;
  UrlVersion: string;
  UrlBrochurePrograma: string;
  Anexo3CX: string;
  UrlFirmaCorreos: string;
  Email: string;
  urlPartner: string;
  NombreCiudad: string;
  Promocion25: any;
  IdCodigoPais: number;
}
export interface IDocumentos {
  Id: number;
  NombreDocumento: string;
  Habilitado: boolean;
  Url: string;
  DocumentoByte: any;
  Mensaje: string;
  MensajeDetalle: string;
  ListadoAlertas: any;
}
export interface IMensajeWhatsapp {
  numero: string;
  tipo: number;
  idPais?: number;
  mensaje: string;
  idPersonal: number;
  idAlumno: number;
  registro?: number;
  fechaCreacion: Date;
  nombrePersonal?: string;
  estadoMensaje?: any;
}

export interface IDatosEstadoContactoWhatsapp {
  idClasificacionPersona: number;
  id: number;
  nombre1: string;
  nombre2: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  DNI: string;
  direccion: string;
  fechaNacimiento: Date | string;
  telefono: string;
  celular: string;
  email1: string;
  email2: string;
  genero: any;
  parentesco: any;
  telefonoFamiliar: any;
  nombreFamiliar: any;
  empresa: any;
  idCargo: number;
  cargo: any;
  idAFormacion: number;
  aFormacion: any;
  idATrabajo: number;
  aTrabajo: any;
  idIndustria: number;
  industria: any;
  idReferido: number;
  referido: any;
  idCodigoPais: number;
  nombrePais: any;
  idCiudad: number;
  nombreCiudad: any;
  horaContacto: any;
  horaPeru: any;
  telefono2: any;
  celular2: any;
  idEmpresa: number;
  idOportunidad_Inicial: number;
  idTipoDocumento: number;
  nroDocumento: any;
  descripcionCargo: any;
  asociado: any;
  idEstadoContactoWhatsApp: number;
  idEstadoContactoWhatsAppSecundario: any;
  rutaBandera: any;
}


export interface IDataEnvioWhatsapp {
  Id: number;
  WaTo: string;
  WaId?: string;
  WaType: string;
  WaTypeMensaje?: number;
  WaRecipientType: string;
  WaBody: string;
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
  usuario: string;
  datosPlantillaWhatsApp?: IDatosPlantillaWhatsapp[];
}

export interface IDatosPlantillaWhatsapp {
  codigo: string;
  texto: string;
}

export interface IWhatsappNumeroValidado {
  idAlumno: number;
  numeroCelular: string;
  idPais: number;
  usuario: string;
}
