import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { ComboPersonalAsignado } from '@shared/models/interfaces/ipersonal';
import { KendoGrid } from '@shared/models/kendo-grid';

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
  montoTotal: number;
  precioLista: number;
  precioListaDolares: number;
  montoTotalDolares?: number;
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
  textoZonaHoraria?: string;
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
  nombreActividad?: string;
  nombreOcurrencia?: string;
  comentarioActividad?: string;
  totalEjecutadas: number;
  totalNoEjecutadas: number;
  totalAsignacionManual: number;
  estadoFase?: string;
  estado: string;
  fechaEnvio?: string;
  fechaPago?: string;
  otroMedio: boolean;
  estadoSeguimientoWhatsApp: boolean;
  llamadasIntegra3cx: LlamadasIntegra3cx[];
}
export interface LlamadasIntegra3cx {
  id: number;
  duracionTimbrado: number;
  duracionContesto: number;
  duracionTimbradoMinutos: string;
  duracionContestoMinutos: string;
  idLlamadaCentral?: number;
  fechaInicioLlamada: string;
  fechaFinLlamada: string;
  estadoLlamada: string;
  subEstadoLlamada: string;
  nombreGrabacion?: string;
  webphone: string;
  origenLlamada: string
  //esLlamada3cx: boolean;
  //Solo vistas
  color?: string;
  bgColor?: string;
  resTiempo?: string;
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

export interface CombosReporte {
  centroCostos: IComboBase1[];
  faseOportunidades: { id: number; codigo: string; nombre: string }[];
  asesores: ComboPersonalAsignado[];
  criteriosCalificacion: IComboBase1[];
  observacionMatricula: IComboBase1[];
}
export interface FormFiltro {
  asesores: number[];
  estadoPersonal: number[];
  centroCostos: number[];
  faseOportunidad: number[];
  faseOportunidadOrigen: number[];
  faseOportunidadDestino: number[];
  fechaInicio: Date;
  fechaFin: Date;
  opcionFase: string;
}
export interface FiltroEnvio {
  centroCostos: number[];
  asesores: number[];
  fasesOportunidad: number[];
  fechaInicio: string;
  fechaFin: string;
  opcionFase: number;
  faseOportunidadOrigen: number[];
  faseOportunidadDestino: number[];
  documentoIdentidad?: string;
  codigoMatricula?: string;
  estadosMatricula?: number[];
  tipoFecha?: number;
  controlFiltroFecha?: number;
}
export interface OportunidadCodigoMatricula {
  idOportunidad: number;
  idMatriculaCabecera: number;
  verificado: boolean;
  usuario: string;
  codigoMatricula: string;
}