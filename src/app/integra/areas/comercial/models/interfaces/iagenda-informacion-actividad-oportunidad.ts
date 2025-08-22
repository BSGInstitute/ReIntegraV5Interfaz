export interface ICabeceraSpeech {
  color: string;
  programaGeneral: string;
  texto: string;
}
export interface IAgendaConfiguracion {
  areasCapacitacion: Array<{ id: number; nombre: string }>;
  programasGenerales: Array<{ id: number; nombre: string }>;
  subAreasCapacitacion: Array<{
    id: number;
    idAreaCapacitacion: number;
    nombre: string;
  }>;
}
export interface IInformacionProgramaV1 {
  respuesta: {
    etiquetaBeneficiosInversion?: string;
    etiquetaDuracionHorarios?: string;
    etiquetaExpositores?: string;
    etiquetaFormasPago?: string;
    listaTarifarios?: Array<ITarifarioDetalleAgenda>;
    idPGeneral?: number;
    informacionPrograma?: string;
    informacionProgramaV2?: Array<IInformacionProgramaV2>;
    listaBeneficios?: Array<IBeneficioPrograma>;
    resumenProgramasV2?: Array<IResumenProgramaV2>;
    listaBeneficiosAtC?:Array<IlistaBeneficiosAtC>;
    inversion?:Array<Iinversion>;
    montopagado?:Array<Imontopagado>;
    versionAlumno?:Array<IversionAlumno>;
  };
}
// export interface IInformacionProgramaV1 {
//   respuesta: {
//     etiquetaBeneficiosInversion?: string;
//     etiquetaDuracionHorarios?: string;
//     etiquetaExpositores?: string;
//     etiquetaFormasPago?: string;
//     etiquetaTarifarios?: string;
//     idPGeneral?: number;
//     informacionPrograma?: string;
//     listaBeneficios?: Array<IBeneficioPrograma>;
//     resumenProgramasV2?: Array<IResumenProgramaV2>;
//     listaBeneficiosAtC?: Array<IlistaBeneficiosAtC>;
//     inversion?: Array<Iinversion>;
//     montopagado?: Array<Imontopagado>;
//     versionAlumno?: Array<IversionAlumno>;
//   };
export interface IInformacionProgramaV2{
  seccion: string,
  detalleSeccion: IInformacionProgramaV2Detalle[]
}
export interface IInformacionProgramaV2Detalle{
  titulo: string,
  cabecera?: string,
  piePagina?: string,
  detalleContenido: string[]
}
export interface ITarifarioDetalleAgenda{
  concepto: string,
  descripcion: string,
  montoPeru: string,
  montoColombia: string,
  montoBolivia: string,
  montoMexico: string,
  montoExtranjero: string,
}
export interface IversionAlumno {
  id: number;
  nombre: string;
}
export interface IlistaBeneficiosAtC {
  beneficio: string;
  version: string;
}
export interface Iinversion {
  idPGeneral: number;
  paquete: number;
  nombrePaquete: string;
  inversionContado: string;
  inversionCredito: string;
  contadoByDolares: number;
  pais: number;
  beneficios: string;
}
export interface Imontopagado {
  id: number;
  idMontoPago: number;
  moneda: string;
  costoOriginal: number;
  descuento: number;
  porcentajeDescuento: string;
  costoFinal: number;
}
export interface IBeneficioPrograma {
  ordenBeneficio: number;
  paquete: number;
  titulo: string;
}
export interface IResumenProgramaV2 {
  certificacion: string;
  duracion?: string;
  idArea: number;
  idSubArea: number;
  inversion: string;
  nombrePrograma: string;
}
export interface IPublicoObjetivoPrograma {
  contenido: string;
  id: number;
  idPGeneral: number;
  respuesta: number;
  titulo: string;
}

export interface IOportunidadInformacion {
  actividadesOportunidad: any;
  listaHistorial: IHistorialOportunidad[];
  listaVentaCruzada: IOportunidadVentaCruzada[];
  programaGeneralPreBen: any;
}

export interface IHistorialOportunidad {
  idOportunidad: number;
  programa: string;
  area: string;
  grupo: string;
  probabilidad: string;
  faseMaxima: string;
  faseOportunidad: string;
  precio: string;
  comision: string;
  montoTotal: string;
  idBusqueda: string;
  asesor: string;
  fechaSolicitud: Date | string;
  fechaModificacion: Date | string;
}

export interface IOportunidadVentaCruzada {
  idOportunidad: number;
  programa: string;
  probabilidad: string;
  precio: string;
  matricula: string;
  comision: string;
  contado: string;
  orden: number;
  costo: number;
}

export interface IArgumentoMotivacionPrograma {
  argumentos: Array<{
    id: number;
    idProgramaGeneralMotivacion: number;
    nombre: string;
  }>;
  completado: string;
  idMotivacion: number;
  nombreMotivacion: string;
  respuesta: number;
  checked: boolean;
}

export interface IFiltro {
  id: number;
  nombre: string;
  modalidad: string;
  codigo: string;
  considerarEnvioAutomatico: boolean;
  tipoPersonal: string;
}

export interface IPlantillaWhatsApp {
  contenido: string;
  descripcion: string;
  id: number;
  nombre: string;
  tipoPlantilla: number;
}

export interface IRequisitosCertificacionPrograma {
  completado: string;
  idCertificacion: number;
  nombreCertificacion: string;
  requisitos: {
    id: number;
    idProgramaGeneralCertificacion: number;
    nombre: string;
  };
  respuesta: number;
}
/* #region  ResumenContacto*/
/* #region  ResumenContacto*/
export interface HistorialInteraccionOportunidad {
  faseInicio: string;
  faseDestino?: string;
  fechaModificacion?: Date;
  fechaSiguienteLlamada: Date;
  nombreActividad?: string;
  nombreOcurrencia?: string;
  comentarioActividad?: string;
  totalEjecutadas: number;
  totalNoEjecutadas: number;
  totalAsignacionManual: number;
  estadoFase?: string;
  estado: string;
  fechaEnvio: Date;
  fechaPago: Date;
  llamadasIntegra3cx: LlamadasIntegra3cx[];
}
export interface LlamadasIntegra3cx {
  id: number;
  duracionTimbrado: number;
  duracionContesto: number;
  duracionTimbradoMinutos: string;
  duracionContestoMinutos: string;
  idLlamadaCentral: number;
  fechaInicioLlamada: string;
  fechaFinLlamada: string;
  estadoLlamada: string;
  subEstadoLlamada: string;
  nombreGrabacion?: string;
  webphone: string;
  origenLlamada: string;
}
/* #endregion ResumenContacto*/
export interface IInformacionProgramaAgendaV2 {
  respuesta: {
    etiquetaBeneficiosInversion?: string;
    etiquetaDuracionHorarios?: string;
    etiquetaExpositores?: string;
    etiquetaFormasPago?: string;
    listaTarifarios?: Array<ITarifarioDetalleAgenda>;
    idPGeneral?: number;
    informacionPrograma?: string;
    informacionProgramaV2?: Array<IInformacionProgramaV2>;
    listaBeneficios?: Array<IBeneficioPrograma>;
    resumenProgramasV2?: Array<IResumenProgramaV2>;
    listaBeneficiosAtC?:Array<IlistaBeneficiosAtC>;
    inversion?:Array<Iinversion>;
    montopagado?:Array<Imontopagado>;
    versionAlumno?:Array<IversionAlumno>;
  };
}