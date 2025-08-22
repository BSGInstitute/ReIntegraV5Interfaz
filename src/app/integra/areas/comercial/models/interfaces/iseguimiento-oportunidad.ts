import { KendoGrid } from '@shared/models/kendo-grid';

export interface IReporteSeguimiento {
  id: number;
  area: string;
  idCentroCosto: number;
  idPersonalAsignado: number;
  idTipoDato: number;
  idFaseOportunidad: number;
  idOrigen: number;
  idCategoriaOrigen: number;
  idAlumno: number;
  idFaseOportunidadIP?: number;
  idFaseOportunidadPF?: number;
  idFaseoportunidadIC?: number;
  codigoPagoIC: string;
  fechaCreacion?: Date;
  fechaRegistroCampania?: Date;
  usuarioCreacion: string;
  nombreCentroCosto: string;
  nombreCompletoAlumno: string;
  asesor: string;
  codigoFaseOportunidad: string;
  nombreTipoDato: string;
  nombreOrigen: string;
  fechaProgramada: string;
  nombrePais: string;
  nombreCategoriaOrigen: string;
  probabilidadActualValor?: number;
  probabilidadActual: string;
  probabilidadNuevoValor?: number;
  probabilidadNuevo?: number;
  codigoPago: string;
  sentinel: string;
  nombreGrupo: string;
  montoTotal: number;
  precioLista: number;
  precioListaDolares: number;
  montoTotalDolares?: number;
  moneda: string;
  totalPago: number;
  montoPagado?: number
  fechaReal: string;
  idOcurrencia?: number;
  idEstadoActividadDetalle: number;
  idEstadoOcurrencia?: number;
  estadoOcurrencia?: string;
  verificado: string;
  diasSinContactoManhana: number;
  diasSinContactoTarde: number;
  codigoMatricula: string;
  idMatriculaCabecera?: number;
  paquete: string;
  matricula?: number;
  matriculaDolares?: number;
  idMatriculaObservacion?: number;
  idCriterioCalificacion?: number;
  descuento?: string;
  nombreCampania?: string;
  facebookNombreAnuncio?: string;
  probabilidad1?: number;
  probabilidad2?: number;
  clasificacion1?: string;
  clasificacion2?: string;
  fechaCierre?: Date;
  idBusqueda?: number;
  interaccion?: string;
  urlOrigen?: string;
  grabacionIntegra: string;
  grabacionCentral?: string;
  convenioFirmado?: string;
  personaEncargada?: string;
  webphone?: string;
  accesoTemporal: boolean;
  programaAccesoTemporal: string;
  fechaInicioAccesoTemporal: string;
  fechaFinAccesoTemporal: string;
  coordinadoraAcademica: string;
  asesorSolicitante?: string;
  idPersonalSolicitante?: number;
  idSolicitudVisualizacion?: number;
  minutosHabladosFaseActual: number;
  minutosHabladosTotal: number;
  actReproManTotal: number;
  actReproManConsecutivasTotal: number;
  grid: KendoGrid;
  textoZonaHoraria?: string
  perDescuento: string;
}
export interface IReporteSeguimiento3cx {
  id: number;
  area: string;
  idCentroCosto: number;
  idPersonalAsignado: number;
  idTipoDato: number;
  idFaseOportunidad: number;
  idOrigen: number;
  idCategoriaOrigen: number;
  idAlumno: number;
  idFaseOportunidadIP?: number;
  idFaseOportunidadPF?: number;
  idFaseoportunidadIC?: number;
  codigoPagoIC: string;
  fechaCreacion?: Date;
  fechaRegistroCampania?: Date;
  usuarioCreacion: string;
  nombreCentroCosto: string;
  nombreCompletoAlumno: string;
  coordinadoraprobocronograma: string;
  coordinadorseguimiento: string;
  asesor: string;
  codigoFaseOportunidad: string;
  nombreTipoDato: string;
  nombreOrigen: string;
  fechaProgramada: string;
  nombrePais: string;
  nombreCategoriaOrigen: string;
  probabilidadActualValor?: number;
  probabilidadActual: string;
  probabilidadNuevoValor?: number;
  probabilidadNuevo?: number;
  codigoPago: string;
  sentinel: string;
  nombreGrupo: string;
  montoTotal:number;
  precioLista: number;
  precioListaDolares: number;
  montoTotalDolares?:number;
  moneda: string;
  totalPago: number;
  montoPagado?: number;
  fechaReal: string;
  idOcurrencia?: number;
  idEstadoActividadDetalle: number;
  idEstadoOcurrencia?: number;
  estadoOcurrencia?: string;
  verificado: string;
  diasSinContactoManhana: number;
  diasSinContactoTarde: number;
  codigoMatricula: string;
  idMatriculaCabecera?: number;
  paquete: string;
  matricula?:number;
  matriculaDolares?:number;
  idMatriculaObservacion?: number;
  idCriterioCalificacion?: number;
  descuento?: string;
  nombreCampania?: string;
  facebookNombreAnuncio?: string;
  probabilidad1?: number;
  probabilidad2?: number;
  clasificacion1?: string;
  clasificacion2?: string;
  fechaCierre?: Date;
  idBusqueda?: number;
  interaccion?: string;
  urlOrigen?: string;
  grabacionIntegra: string;
  grabacionCentral?: string;
  convenioFirmado?: string;
  personaEncargada?: string;
  webphone?: string;
  accesoTemporal: boolean;
  programaAccesoTemporal: string;
  fechaInicioAccesoTemporal: string;
  fechaFinAccesoTemporal: string;
  coordinadoraAcademica: string;
  asesorSolicitante?: string;
  idPersonalSolicitante?: number;
  idSolicitudVisualizacion?: number;
  minutosHabladosFaseActual: number;
  minutosHabladosTotal: number;
  actReproManTotal: number;
  actReproManConsecutivasTotal: number;
  grid: KendoGrid;
  textoZonaHoraria?: string
}

export interface DetalleReporte {
  log: LogReporte[];
  bloques: Bloque[];
}

export interface LogReporte {
  idActividadDetalle: number;
  faseInicio: string;
  faseDestino?: string;
  fechaModificacion?: string;
  fechaSiguienteLlamada: string;
  estadoFase?: string;
  fechaEnvio?: string;
  fechaPago?: string;
  estado: string;
  tiempoDuracion?: any;
  tiempoContestado3CX?:any
  tiempoDuracion3CX?: any;
  tiempoTimbrado3CX?:any;
  llamadaIntegra?: LlamadaIntegra[];
  llamadaTresCX?: LlamadaTresCxMod[];
  nombreActividad?: string;
  nombreOcurrencia?: string;
  comentarioActividad?: string;
  totalEjecutadas: number;
  totalNoEjecutadas: number;
  totalAsignacionManual: number;
  idFaseOportunidad?: number;
}

export interface LlamadaIntegra {
  id: number;
  fechaInicioLlamada: string;
  fechaFinLlamada: string;
  tiempoDuracion: string;
  tiempoDuracionMinutos: string;
  estadoLlamada: string;
  subEstadoLlamada: string;
  nombreGrabacion?: string;
  webphone: string;

  color?: string;
  bgColor?: string;
  resTiempo?: string;
}

export interface LlamadaTresCxMod {
  id: number
  fechaInicioLlamada: string
  fechaFinLlamada: string
  tiempoDuracion: string
  tiempoDuracionMinutos: any
  estadoLlamada: string
  subEstadoLlamada: string
  nombreGrabacion?: string
  webphone: string

  color?: string;
  bgColor?: string;
  resTiempo?: string;
}
export interface LlamadaTresCx {
  id: number;
  fechaInicioLlamada: string;
  fechaFinLlamada: string;
  tiempoDuracion: string;
  tiempoDuracionMinutos?: any;
  estadoLlamada: string;
  subEstadoLlamada: string;
  nombreGrabacion?: any;
  webphone?: any;
}

export interface Bloque {
  nombre: string;
  horaInicio: string;
  horaFin: string;
  contador: number;
}

export interface DatosNuevaLlamada {
  celular: string;
  idCodigoPais: number;
  anexo3CX: string;
  central: string;
}
