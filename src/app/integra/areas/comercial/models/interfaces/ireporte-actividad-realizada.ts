// export interface IReporteActividadRealizada {
//   codigoFaseFinal: string;
//   codigoFaseOrigen: string;
//   comentarioActividad: string;
//   estadoOcurrencia: string;
//   estadosTresCX: string;
//   existeLlamadaExitosa: false;
//   fechaLlamada?: string;
//   fechaProgramada: Date | string;
//   fechaReal: Date | string;
//   idActividad: number;
//   idAlumno: number;
//   idFaseOportunidadInicial?: number;
//   idOportunidad: number;
//   mayorTiempo: number;
//   minutosIntervale: number;
//   minutosTotalContesto: number;
//   minutosTotalIntervaleLlamadas: number;
//   minutosTotalPerdido: number;
//   minutosTotalTimbrado: number;
//   nombreActividadCabecera: string;
//   nombreCategoriaOrigen: string;
//   nombreCentroCosto: string;
//   nombreCompletoAsesor: string;
//   nombreCompletoContacto: string;
//   nombreGrabacionIntegra: Array<{
//     funcion: string;
//     nombreGrabacion: string;
//   }>;
//   nombreGrabacionTresCX?: string;
//   nombreGrupo: string;
//   nombreOcurrencia: string;
//   nombreOrigen: string;
//   nombreTipoDato: string;
//   probabilidadActual: string;
//   tiemposDuracionLlamadas: null;
//   tiemposTresCX: string;
//   totalAsignacionManual: number;
//   totalEjecutadas: number;
//   totalNoEjecutadas: number;

import { IComboBase1 } from '@shared/models/interfaces/iglobal';

//   colorRow?: string;
//   colorTexto?: string;
//   minutosReal?: number;
//   condigomatricula?: string
// }
export interface IReporteActividadRealizada {
  idActividad: number;
  nombreCentroCosto: string;
  nombreCompletoContacto: string;
  codigoFaseFinal: string;
  nombreTipoDato: string;
  nombreOrigen: string;
  fechaProgramada?: string;
  fechaReal: string;
  nombreActividadCabecera: string;
  nombreOcurrencia: string;
  comentarioActividad: string;
  nombreCompletoAsesor: string;
  idAlumno: number;
  idOportunidad: number;
  probabilidadActual: string;
  codigoFaseOrigen: string;
  nombreCategoriaOrigen: string;
  estadoOcurrencia: string;
  nombreGrupo: string;
  tiemposDuracionLlamadas?: TiemposDuracionLlamada[];
  minutosTotalIntervaleLlamadas: number;
  minutosIntervalo: number;
  minutosTotalTimbrado: number;
  minutosTotalContesto: number;
  minutosTotalPerdido: number;
  minutosPerdidosOcurrencia: number;
  mayorTiempo: number;
  tiemposTresCX: TiemposDuracionLlamada[];
  estadosTresCX: EstadosTresCx[];
  fechaLlamada?: FechaLlamada[];
  totalEjecutadas: number;
  totalNoEjecutadas: number;
  totalAsignacionManual: number;
  idFaseOportunidadInicial: any;
  nombreGrabacionTresCX: NombreGrabacionTresCx[]; 
  nombreGrabacionIntegra: NombreGrabacionIntegra[];
  existeLlamadaExitosa: boolean;

  colorRow?: string;
  colorTexto?: string;
  minutosReal?: number;
  heightRow: number;
  tipoRefrigerio: number;
  mostrarRefrigerio: boolean;
}
export interface TiemposDuracionLlamada {
  tt: string;
  tc: string;
}
export interface EstadosTresCx {
  tipo: string;
  subTipo: string;
}
export interface FechaLlamada {
  minutosPerdidos?: number;
  inicio: string;
  termino: string;
}
export interface NombreGrabacionIntegra {
  tipo: string;
  webphone: string;
  nombreGrabacion: string;
}

export interface NombreGrabacionTresCx{
  tipo: string;
  webphone: string;
  nombreGrabacion: string;
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
