import { IComboBase1 } from "@shared/models/interfaces/iglobal";

export interface IExamenTest {
  id: number;
  nombre?: string;
  nombreAbreviado?: string;
  idMigracion?: number;
  esCalificadoPorPostulante: boolean;
  mostrarEvaluacionAgrupado: boolean;
  mostrarEvaluacionPorGrupo: boolean;
  mostrarEvaluacionPorComponente: boolean;
  requiereCentil: boolean;
  idFormulaPuntaje?: number;
  calificarEvaluacion: boolean;
  esCalificacionAgrupada: boolean;
  factor?: number;
  idEvaluacionCategoria?: number;
}
export interface ModalEditarEvaluacion {
  listaExamenes: IExamenTest[];
  listaGrupo: ConfigurarComponente[];
  listaCentiles: CentilDTO[];
  // listaComponente: IListaComponente[];
  listaComponente: CalificarComponente[];
}

export interface AsignacionComponenteEvaluacionDTO {
  listaComponenteAsignado: ComponenteAsignacionDTO[];
  listaComponenteNoAsignado: ComponenteAsignacionDTO[];
  idEvaluacion?: number;
}

export interface ComponenteAsignacionDTO {
  id: number;
  nombreComponente: string;
}


export interface CentilDTO {
  id: number;
  idExamenTest?: number;
  idGrupoComponenteEvaluacion?: number;
  idExamen?: number;
  idSexo?: number;
  valorMinimo: number;
  valorMaximo: number;
  centil: number;
  centilLetra: string;
}
export interface IListaGrupo {
  id: number;
  nombre: string;
}
export interface IListaComponente {
  id: number;
  nombre: string;
  idExamen: number;
}
export interface IEvaluacionAgrupadaComponenteDTO {
  idAsignacionPreguntaExamen: number;
  idComponente: number;
  idGrupoComponenteEvaluacion?: number;
  idEvaluacion?: number;
  idPregunta: number;
  nombreComponente: string;
  nombreGrupoComponenteEvaluacion: string;
  nombreEvaluacion: string;
  enunciadoPregunta: string;
  nroOrden: number;
}

export interface CombosModulo {
  obtenerFormula: IComboBase1[];
  obtenerSexo: IComboBase1[];
  obtenerCategoria: IComboBase1[];
  obtenerGrupo: IComboBase1[];
  obtenerComponente: IComboBase1[];
}
// modalAgrupador
export interface Componente {
  id: number;
  nombre: string;
}
export interface GrupoComponenteEvaluacionFormularioDTO {
  grupoComponenteEvaluacion: GrupoComponenteEvaluacionDTO;
  usuario: string | null;
  idEvaluacion: number;
}

export interface GrupoComponenteEvaluacionDTO {
  id: number;
  nombre: string;
  nombreAbreviado: string | null;
  listaComponentes: GrupoComponentesDTO[];
  idFormulaPuntaje: number | null;
  requiereCentil: boolean;
  idMigracion: number | null;
  factor: number | null; 
}

export interface GrupoComponentesDTO {
  id: number;
  nombre: string;
}

export interface GuardarConfigurarComponente{
  grupoComponenteEvaluacion: ConfigurarComponente[];
  idEvaluacion: number;
}
export interface ConfigurarComponente {
  id: number;
  nombre: string;
  nombreAbreviado: string | null;
  listaComponentes: Componente[];
  idFormulaPuntaje: number;
  requiereCentil: boolean;
  idMigracion: number | null;
  factor: number | null;
}

export interface CalificarComponente {
  id: number;
  nombre: string;
  idEvaluacion: number;
  idExamen: number;
  nombreExamen: string;
  factor: number | null;
  requiereCentil: boolean;
}
export interface ModalAsociador{
  examenesAsignados: IComboBase1[],
  examenesNoAsignados: IComboBase1[],
}
export interface ModeloModalAgrupador {
  listaConfigurar: ConfigurarComponente[];
  listaCalificar: CalificarComponente[];
  listaCentil: CentilComponente[];
  listaComponente: IComboBase1[];
  listaGrupo: IComboBase1[];
}

export interface CentilComponente {
  id: number;
  idExamenTest?: number;
  idGrupoComponenteEvaluacion?: number;
  idExamen?: number;
  centilLetra?: string;
  idSexo?: number;
  valorMinimo: number;
  valorMaximo: number;
  centil?: number;
  centilAdicional?: number | null;
  version?: number | null;
  esVigente?: boolean | null;
}