export interface IValorEtiqueta {
  datosOportunidad?: IDatosOportunidadEtiqueta;
  fechaInicioPrograma?: string;
  objeto?: IObjetoValorEtiqueta;
}

export interface IObjetoValorEtiqueta {
  cronogramaPagos: string;
  datosEtiquetas: Array<{
    idCentroCosto: number;
    idPlantillaPW: string;
    idSeccionPW: string;
    valor: string;
  }>;
  datosOportunidadAlumno: IDatosOportunidadAlumno;
  descripcion: null;
  emailReemplazado: null;
  estado: false;
  etiquetaMontosPagoPaquetes: string;
  fechaCreacion: Date;
  fechaInicioPrograma?: Date;
  fechaModificacion: Date;
  id: number;
  idMigracion?: any;
  idOportunidad: number;
  idPlantilla: number;
  idPlantillaBase: number;
  idPlantillaMaestroPw: number;
  idRevisionPw: number;
  listaCursosRelacionados?: Array<{
    idPgeneral: number;
    nombre: string;
    duracion: string;
    modalidad: string;
    url_Video: string;
    inversion: string;
  }>;
  listaProblemasCausa: Array<IProblemaCausaEtiqueta>;
  listaTemplateV2ReemplazoEtiqueta: Array<{ clave: string; valor: string }>;
  nombre?: string;
  urlCursosRelacionados: Array<{ nombre: string; urlPagina: string }>;
  usuarioCreacion?: string;
  usuarioModificacion?: string;
}
export interface IProblemaCausaEtiqueta {
  idProblema: number;
  nombreCausa: string;
  nombreProblema: string;
}

export interface IDatosOportunidadAlumno {
  anexo1EstructuraCurricular: string;
  anexo2Certificacion: string;
  anioFechaActual: string;
  cronogramaPagoCompleto: string;
  diaFechaActual: string;
  duracionMesesPGeneral: string;
  idPEspecifico: number;
  montoTotal: string;
  nombreMesFechaActual: string;
  nombrePGeneral: string;
  oportunidadAlumno: {
    direccion: string;
    email1: string;
    idCodigoPais: number;
    nombre1: string;
    nombreCiudad: string;
    nombreCompleto: string;
    nombrePais: string;
    nroDocumento: string;
  };
  version: string;
}

export interface IDatosOportunidadEtiqueta {
  anexo3CX: string;
  central: string;
  codigoPagoIC?: any;
  costoTotalConDescuento: string;
  email: string;
  encabezadoCorreoPartner?: any;
  fechaEnvio?: any;
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
  nombrePartner?: any;
  nombreProgramaGeneral: string;
  precioContado?: any;
  promocion25: boolean;
  pwDuracion: string;
  ultimaFechaProgramada: Date;
  ultimoComentario: string;
  urlBrochurePrograma: string;
  urlFirmaCorreos?: any;
  urlVersion: string;

  idMatricula?: string;
  urlPartner?: string;
}

export interface scas {}
