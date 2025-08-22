import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';

export interface ConfigurarProcesoSeleccion {
  id: number;
  nombre: string;
  idPuestoTrabajo: number;
  puestoTrabajo: string;
  idSede: number;
  sede: string;
  codigo: number;
  url: string;
  activo: boolean;
  fechaInicioProceso: Date;
  fechaFinProceso: Date;
}

export interface CombosConfigurarProcesoSeleccion {
  listaCriterioSeleccion: IComboBase1[];
  listaExamen: IComboBase1[];
  listaPuestoTrabajo: IComboBase1[];
  listaProcesoSeleccionRango: IComboBase1[];
  listaSedeTrabajo: IComboBase1[];
}

export interface EtapaProcesoSeleccion{
  id:number;
  idProcesoSeleccion:number;
  nroOrden:number
  nombre:string;
}

export interface Evaluaciones{
  listaEvaluacionNoAsociado:EstructuraBasica[];
  listaEvaluacionAsociado:EvaluacionAsignadoProceso[];
  listaEvaluacionNoAsociadoEvaluador:EstructuraBasica[];
  listaEvaluacionAsociadoEvaluador:EvaluacionAsignadoProceso[];
  listaEtapa:ProcesoSeleccionEtapa[];
}

export interface EstructuraBasica{
  id:number;
  nombre:string;
  esCalificadoPorPostulante:boolean;
}
export interface EvaluacionAsignadoProceso{
  id:number;
  idProcesoSeleccion:number;
  idEvaluacion:number;
  nroOrden:number;
  nombre:string;
  esCalificadoPorPostulante:boolean;
  idProcesoSeleccionEtapa:number;
}
export interface ProcesoSeleccionEtapa{
  id?:number;
  nombre:string;
  idProcesoSeleccion?:number;
  nroOrden?:number;

}

export interface PuntajeEvaluacionAgrupadaComponenteDTO{
  ListaPuntaje:NombreEvaluacionAgrupadaCalificacion[];
}
export interface EvaluacionPuntaje{
  listaEvaluaciones:NombreEvaluacionesAgrupadaIndependiente[];
  listaEvaluacionesPuntajeCalificacion:NombreEvaluacionAgrupadaComponente[];
  listacomponentes:NombreEvaluacionAgrupadaComponente[];
}
export interface NombreEvaluacionesAgrupadaIndependiente{
  id:number;
  nombre:string;
  calificacionTotal:boolean;
  calificaAgrupadoNoIndependiente:boolean;
  gridDetallePuntajeCalificacion?:KendoGrid<NombreEvaluacionAgrupadaCalificacion>;
}

export interface NombreEvaluacionAgrupadaCalificacion{
  idProcesoSeleccion:number;
  calificacionTotal:boolean;
  idEvaluacion:number;
  nombreEvaluacion:string;
  idGrupo:number;
  nombreGrupo:string;
  idComponente:number;
  nombreComponente:string;
  puntaje?:number;
  calificaPorCentil:boolean;
  calificaAgrupadoNoIndependiente:boolean;
  idProcesoSeleccionRango:number;
  esCalificable:boolean;
  idRango: number;
  rangoProceso?:string;
  rangoProcesoSeleccionRango?:string;
  editar?:boolean;
  gridPuntajeCalificacion?:KendoGrid<NombreEvaluacionAgrupadaComponente>;
}
export interface NombreEvaluacionAgrupadaComponente{
  idProcesoSeleccion:number;
  calificacionTotal:boolean;
  idEvaluacion:number;
  nombreEvaluacion:string;
  idGrupo:number;
  nombreGrupo:string;
  idComponente:number;
  nombreComponente:string;
  puntaje?:number;
  calificaPorCentil:boolean;
  calificaAgrupadoNoIndependiente:boolean;
  idProcesoSeleccionRango:number
  esCalificable:boolean;
  idRango: number;
  rangoProcesoSeleccionRango?:string;
  editar?:boolean;
}


export interface NombreComponentes{
  IdExamenTest:number;
  NombreEvaluacion:string;
  IdGrupo:number;
  NombreGrupo:string;
  IdExamen:number;
  NombreComponente:string;
}

export interface NombreEvaluacionAgrupadaC{
  idProcesoSeleccion:number;
  calificacionTotal:boolean;
  idEvaluacion:number;
  nombreEvaluacion:string;
  idGrupo:number;
  nombreGrupo:string;
  idComponente:number;
  nombreComponente:string;
  puntaje?:number;
  calificaPorCentil:boolean;
  calificaAgrupadoNoIndependiente:boolean;
  idProcesoSeleccionRango:number;
  esCalificable:boolean;
}


export interface ExamenAsignadoProceso{
  id:number;
  idProcesoSeleccion?:number;
  idExamen?:number;
  nroOrden?:number;
  nombre?:string;
}

export interface EtapaProcesoSeleccionActualizar{
  id:number;
  idProcesoSeleccion?:number;
  nroOrden?:number;
  nombre?:string
}
export  interface ActualizarProcesoSeleccion{
  ConfiguracionProcesoSeleccion:ConfigurarProcesoSeleccion;
  listaEtapas:ExamenAsignadoEtapa[];
  listaEvaluaciones:EvaluacionAsignadoProceso[];
  listaEvaluacionesEvaluador:EvaluacionAsignadoProceso[];
}
export interface ExamenAsignadoEtapa{
  id:number;
  idProcesoSeleccion?:number;
  nroOrden?:number;
  nombre?:string;
}