import { IComboBase1 } from '@shared/models/interfaces/iglobal';

export interface IReporteActividadRealizada {
  idActividad: number
  idOportunidadSeguimiento: number  
  nombreCentroCosto: string
  nombreCompletoContacto: string
  codigoFaseFinal: string
  nombreTipoDato: string
  nombreOrigen: string
  fechaProgramada?: string
  fechaReal: string
  nombreActividadCabecera: string
  nombreOcurrencia: string
  comentarioActividad: string
  nombreCompletoAsesor: string
  idAlumno: number
  idOportunidad: number
  probabilidadActual: string
  codigoFaseOrigen: string
  nombreCategoriaOrigen: string
  estadoOcurrencia: string
  nombreGrupo: string
  minutosTotalIntervaleLlamadas: number
  minutosIntervalo: number
  minutosTotalTimbrado: number
  minutosTotalContesto: number
  minutosTotalPerdido: number
  mayorTiempo: number
  tiempos: TiempoLlamada[]
  estados: EstadoLlamada[]
  fechaLlamada: FechaLlamada[]
  totalEjecutadas: number
  totalNoEjecutadas: number
  totalAsignacionManual: number
  minutosPerdidosOcurrencia: number
  idFaseOportunidadInicial: any
  nombreGrabacion: NombreGrabacion[]
  existeLlamadaExitosa: boolean
  tieneLlamadaHumano: boolean
  diferenciaFechaActualFechaRealmin: number
  estadoSeguimientoWhatsApp: boolean
  otroMedio: boolean

  colorRow?: string;
  colorTexto?: string;
  minutosReal?: number;
  heightRow: number;
  tipoRefrigerio: number;
  mostrarRefrigerio: boolean;
}
export interface TiempoLlamada {
  tt: string;
  tc: string;
  webphone: string
  origenLlamada: string
}
export interface EstadoLlamada {
  tipo: string;
  subTipo: string;
  origenLlamada: string
}
export interface FechaLlamada {
  minutosPerdidos?: number;
  inicio: string;
  termino: string;
  origenLlamada: string
}
export interface NombreGrabacion{
  tipo: string;
  webphone: string;
  nombreGrabacion: string;
  origenLlamada: string
}
export interface IReporteActividadRealizadaFiltro {
  idEstadoOcurrencia?: number;
  idAlumno?: number;
  idAsesor: number;
  idFasesOportunidadOrigen: Array<number>;
  idFasesOportunidadDestino: Array<number>;
  idTipoDato?: number;
  fecha: string;
  idCentroCosto?: number;
  estadoLlamada?: number;
  idTipoCategoriaOrigen?: number;
  idProbabilidadActual?: number;
  horaInicio: number;
  minutosInicio: number;
  horaFin: number;
  minutosFin: number;
  estadoFiltroHora: boolean;
  estadoPersonal?: number;
  idEstadoMatricula?: number;
  idSubestadoMatricula?: number;
}
export interface IComboReporteActividadesRealizadas {
  asesores: Array<IAsesor>;
  categoriaOrigen: Array<IComboBase1>;
  estadoOcurrencia: Array<IComboBase1>;
  faseOportunidad: Array<IFaseOportunidad>;
  probabilidad: Array<IComboBase1>;
  tipoDato: Array<IComboBase1>;
}
export interface IAsesor {
  activo: boolean;
  email: string;
  id: number;
  nivelVisualizacionAgenda?: string;
  nombres: string;
  tipoPersonal?: string;
  usuario?: string;
}
export interface IFaseOportunidad {
  codigo: string;
  id: number;
  nombre: string;
}
