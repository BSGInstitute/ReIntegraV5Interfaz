export interface IFormProgramarActividad {
  comentario: string;
  fechaProgramada: Date;
  problemaLlamada: number;
  calidadLlamada: number;
  fechaInicioPrograma: null;
  tipoComprobante: number;
  rutFactura: string;
  rucFactura: string;
  razonSocialFactura: string;
  direccionFactura: string;
  comentarioComprobante: string;
  estadoFaseIP: number;
  estadoFasePF: number;
  fechaEnvioFichaPF: Date;
  fechaPagoPF: Date;
  estadoFaseIC: number;
  fechaPagoIC: Date;
  codigoPagoIC: string;
}

export interface IEnvioWhatsApp {
  id: number;
  waTo: string;
  waType: string;
  waTypeMensaje: number;
  waRecipientType: string;
  waBody: string;
  waCaption: string;
  idPais: number;
  esMigracion: boolean;
  idMigracion: number;
  idPersonal: number;
  idAlumno: number;
  usuario: string;
  datosPlantillaWhatsApp: any[];
}

export interface IFinalizarProgramarActividad {
  actividadAntigua?: IActividadAntigua;
  calidadLlamada?: { idProblemaLlamada: number; idCalidadLlamada: number };
  comprobantePago?: IComprobantePago;
  datosCompuesto?: IDatoCompuesto;
  datosOportunidad?: IDatoOportunidad;
  filtro?: IFiltroFinalizarActividad;
  usuario?: string;
}
export interface IFinalizarActividad {
  actividadAntigua: IActividadAntigua;
  oportunidad: { idFaseOportunidad: number };
  datosCompuesto: IDatoCompuesto;
  usuario: string;
}

export interface IActividadAntigua {
  id: number;
  comentario?: string;
  idOcurrencia: number;
  idOcurrenciaActividad: number;
  idAlumno: number;
  idOportunidad: number;
}
export interface IComprobantePago {
  idContacto: number;
  nombres: string;
  apellidos: string;
  celular: string;
  dni: string;
  correo: string;
  nombrePais: string;
  idPais: number;
  nombreCiudad: string;
  tipoComprobante: string;
  nroDocumento: string;
  nombreRazonSocial?: string;
  direccion?: string;
  bitComprobante: number;
  idOcurrencia?: number;
  idAsesor: number;
  idOportunidad?: number;
  comentario?: string;
}

export interface IDatoCompuesto {
  oportunidadCompetidor?: IOportunidadCompetidor;
  calidadProcesamientoAlterno?: ICalidadProcesamientoAlterno
  listaMotivacion?: {
    idOportunidad?: number;
    idMotivacion?: number;
    respuesta?: number;
  }[];
  listaPublicoObjetivo?: {
    idOportunidad: number;
    idPublicoObjetivo: number;
    respuesta: number;
  }[];
  listaCertificacion?: {
    idOportunidad: number;
    idCertificacion: number;
    respuesta: number;
  }[];
  listaPrerequisitoGeneralAlterno?: {
    idOportunidad: number;
    idProgramaGeneralPrerequisito: number;
    respuesta: number;
  }[];
  listaBeneficioAlterno?: {
    idOportunidad?: number;
    idBeneficio?: number;
    respuesta?: number;
  }[];
  listaCompetidor?: number[];
  listaSolucionesAlterno?: {
    idOportunidad: number;
    idProblema: number;
    //seleccionado: boolean;
    //solucionado: boolean;
    checkvalor: boolean;
  }[];
}

export interface IOportunidadCompetidor {
  id?: number;
  idOportunidad?: number;
  otroBeneficio?: string;
  respuesta?: number;
  completado?: string;
  // calidadBO?: ICalidadProcesamiento;
}

export interface ICalidadProcesamiento {
  id: number;
  idOportunidad: number;
  perfilCamposLlenos: number;
  perfilCamposTotal: number;
  dni: boolean;
  pgeneralValidados: number;
  pgeneralTotal: number;
  pespecificoValidados: number;
  pespecificoTotal: number;
  beneficiosValidados: number;
  beneficiosTotales: number;
  competidoresVerificacion: boolean;
  problemaSeleccionados: number;
  problemaSolucionados: number;
}
export interface ICalidadProcesamientoAlterno {
  id: number;
  idOportunidad?: number;
  perfilCamposLlenos: number;
  perfilCamposTotal: number;
  tieneDni: boolean;
  sentinelVerificado: boolean;
  pgeneralMotivacionValidado: number;
  pgeneralMotivacionTotal: number;
  publicoObjetivoValidado: number;
  publicoObjetivoTotal: number;
  prerequisitoProgramaValidado: number;
  prerequisitoProgramaTotal: number;
  requisitoCertificacionValidado: number;
  requisitoCertificacionTotal: number;
  beneficiosValidados: number;
  beneficiosTotales: number;
  inicioProgramaVerificado: boolean;
  competidoresVerificacion: boolean;
  cantidadCompetidores: number;
  problemaSeleccionados: number;
  problemaSolucionados: number;
}
export interface IDatoOportunidad {
  id?: number;
  idCentroCosto?: number;
  idPersonalAsignado?: number;
  idTipoDato?: number;
  idFaseOportunidad?: number;
  idOrigen?: number;
  idAlumno?: number;
  ultimoComentario?: string;
  idActividadDetalleUltima?: number;
  idActividadCabeceraUltima?: number;
  idEstadoActividadDetalleUltimoEstado?: number;
  ultimaFechaProgramada?: string;
  ultimaHoraProgramada?: string;
  idEstadoOportunidad?: number;
  idEstadoOcurrenciaUltimo?: number;
  idFaseOportunidadMaxima?: number;
  idFaseOportunidadInicial?: number;
  idCategoriaOrigen?: number;
  idConjuntoAnuncio?: number;
  idCampaniaScoring?: number;
  idFaseOportunidadIp?: number;
  idFaseOportunidadIc?: number;
  fechaEnvioFaseOportunidadPf?: string;
  fechaPagoFaseOportunidadPf?: string;
  fechaPagoFaseOportunidadIc?: string;
  fechaRegistroCampania?: string;
  idFaseOportunidadPortal?: any;
  idFaseOportunidadPf?: number;
  codigoPagoIc?: string;
  flagVentaCruzada?: number;
  idTiempoCapacitacion?: number;
  idTiempoCapacitacionValidacion?: number;
  idSubCategoriaDato?: number;
  idInteraccionFormulario?: number;
  urlOrigen?: string;
  fechaPaso2?: string;
  paso2?: boolean;
  codMailing?: string;
  idPagina?: number;
  fasesActivas?: boolean;
  idTipoInteraccion?: number;
  idClasificacionPersona?: number;
  idPersonalAreaTrabajo?: number;
}

export interface IFiltroFinalizarActividad {
  idOcurrencia: number;
  tipo: string;
  idActividadCabecera: number;
  idCategoria?: number;
  idPersonal?: number;
  usuario: string;
}

export interface IFechaReprogramacionEjecutada {
  diasProgramacion: number;
  fechaMaxima: Date;
  fechaProximaCuota: Date;
  fechaProximaCuotaTexto: string;
  personalHorario: string[][];
}

export interface IFinalizarActividadOperaciones {
  filtro?: IFiltroFinalizarActividad;
  datosOportunidad?: IDatoOportunidad;
  datosOportunidad2?: any;
  actividadAntigua?: IActividadAntigua;
  datosCompuesto?: IDatoCompuesto;
  comprobantePago?: IComprobantePago;
  calidadLlamada?: { idProblemaLlamada: number; idCalidadLlamada: number };
  usuario: string;
  idFaseOportunidad?: number;
  tipoProgramacion?: string;
}

export interface IObtenerFaseOportunidad {
  idOportunidad: number;
  idFaseOportunidad: number;
  idActividadDetalle: number;
  codigoFaseOportunidad: string;
  existe: boolean;
}
