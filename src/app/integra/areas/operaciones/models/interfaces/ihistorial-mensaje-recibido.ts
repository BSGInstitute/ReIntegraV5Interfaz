export interface IKendoFiltro {
    filters: [IFiltro[]] | [IFiltro];
    logic: string;
}

export interface IFiltro {
    operator: string;
    field: string;
    value: string;
}

export interface ISolicitarCorreo {
    page?: number;
    pageSize?: number;
    skip?: number;
    take?: number;
    idCorreo?: number;
    destinatario?: string;
    idAsesor: number;
    idAlumno?: number;
    folder: string;
    tipoCorreos?: string;
    filtroKendo?: IKendoFiltro;
}

export interface ICorreo {
    id?: number;
    asunto?: string;
    emailBody?: string;
    fecha?: Date | string;
    remitente?: string;
    destinatarios?: string;
    from?: string;
    seen?: boolean;
    totalCorreos?: number;
    idPersonal?: number;
    envioMasivoMandrill?: boolean;
    envioIndividualMandrill?: boolean;
    grupo?: string;
    conCopia?: string;
    idAlumno?: number;
    messageId?: number;
    estado?: any;
    categoria?: any;
    tipo?: any;
    archivosAdjuntos?: IArchivoAdjunto[];
    versiones?: any;
    subestado?: any;
    mensaje?: any;
    plantilla?: any;
    areaCorreo?: string;
}

export interface IArchivoAdjunto {
    id?: number;
    idCorreo: number;
    nombreArchivo: string;
    urlArchivoRepositorio: string;
}
export interface IHistorialCorreo {
    listaCorreos: ICorreo[];
    totalEnviados: number;
}

export interface IHistorialCorreoDetalle {
    archivosAdjuntos: any[];
    emailBody: string;
}

export interface ICorreosEnviadosVentas {
    remitente: string;
    destinatarios: string;
    asunto: string;
    emailBody: string;
    fecha: Date | string;
    areaCorreo?: string;
}

export interface ICorreosEnviados {
    destinatarios: string;
    asunto: string;
    fecha: Date | string;
}

export interface IDataDescarga {
    asesorActual: number;
    folderActual: string;
}

export interface ICorreoAdjunto {
    archivosAdjuntos: IArchivoAdjunto[];
    emailBody: string;
}

export interface IObjetoCorreo {
    nombreEmail: string;
    contenidoEmail: string;
    estado: boolean;
}

export interface IContenidoPlantilla {
    asunto: string;
    cuerpoHTML:string;
    listaArchivosAdjuntos: IArchivoAdjunto[];
}

export interface IPlantillaCorreo {
    data: IPlantillaCorreoContenido[];
}

export interface IPlantillaCorreoContenido {
    clave: string;
    nombre: string;
    valor: string;
    id: number;
    idPlantillaClaveValor: number;
    idAreaEtiqueta: number;
}

export interface IPlantillaWhatsapp {
    id: number;
    nombre: string;
    descripcion: string;
    contenido: string;
    tipoPlantilla: number;
}
export interface IFilaWhatsapp {
    numero: string,
    mensaje?: string,
    idPersonal: number,
    idPais?: number,
    idAlumno?: number,
    fechaCreacion?: Date | string,
    nombreAlumno?: string,
}

export interface IInteraccionChat {
    idInteraccionChat: number;
    idAlumno: number;
    nombreAlumno: string;
    idAsesor: number;
    fechaFin: Date | string;
    tiempo: number;
    ubicacion: string;
    mensajes: string;
    chatsession: string;
    leido: boolean;
}


export interface IInteraccionDetalleChat {
    idInteraccionChatIntegra: number;
    nombreRemitente: string;
    idRemitente: string;
    mensaje: string;
    fecha: Date | string;
    rowVersion: any;
    mensajeOfensivo: any;
    idChatDetalleIntegraArchivo: number;
    id: number;
    fechaCreacion: Date | string;
    fechaModificacion: Date | string;
    estado: boolean;
    usuarioCreacion: string;
    usuarioModificacion: string;
    hasErrors: boolean;
}

export interface IMensajesWhatsapp {
    numero: string;
    tipo: number;
    idPais?: number;
    mensaje: string;
    idPersonal: number;
    idAlumno: number;
    registro?: number;
    fechaCreacion: Date;
    nombrePersonal?: string;
    areaPersonal?:string;
    estadoMensaje?: any;
}

export interface IDatosEstadoContactoWhatsapp {
    IdClasificacionPersona: number;
    Id: number;
    Nombre1: string;
    Nombre2: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    DNI: string;
    Direccion: string;
    FechaNacimiento: Date | string;
    Telefono: string;
    Celular: string;
    Email1: string;
    Email2: string;
    Genero: any;
    Parentesco: any;
    TelefonoFamiliar: any;
    NombreFamiliar: any;
    Empresa: any;
    IdCargo: number;
    Cargo: any;
    IdAFormacion: number;
    AFormacion: any;
    IdATrabajo: number;
    ATrabajo: any;
    IdIndustria: number;
    Industria: any;
    IdReferido: number;
    Referido: any;
    IdCodigoPais: number;
    NombrePais: any;
    IdCiudad: number;
    NombreCiudad: any;
    HoraContacto: any;
    HoraPeru: any;
    Telefono2: any;
    Celular2: any;
    IdEmpresa: number;
    IdOportunidad_Inicial: number;
    IdTipoDocumento: number;
    NroDocumento: any;
    DescripcionCargo: any;
    Asociado: any;
    IdEstadoContactoWhatsApp: number;
    IdEstadoContactoWhatsAppSecundario: any;
    RutaBandera: any;
}
export interface IDocumentosWhatsapp {
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


export interface IDocumentosWhatsapp {
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
