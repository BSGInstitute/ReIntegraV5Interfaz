
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';

export interface PuestoTrabajo {
  id: number;
  nombre: string;
  idPersonalAreaTrabajo: number;
  personalAreaTrabajo: string;
  idPerfilPuestoTrabajo: number;
  objetivo: string;
  descripcion: string;
  usuarioModificacion: string;
  fechaModificacion: string;
}
export interface DataAprobacion{
  idPuestoTrabajo:number
}
export interface PuestoTrabajoInsertar {
  id: number;
  nombre: string;
  idPersonalAreaTrabajo: number;
}

export interface ComboPuestoTrabajo {
  listaPersonalAreaTrabajo: IComboBase1[];
  listaPuestoTrabajo: IComboBase1[];
  listaTipoFuncion: IComboBase1[];
  listaFrecuenciaPuestoTrabajo: IComboBase1[];
  listaTipoCompetenciaTecnica: IComboBase1[];
  listaCompetenciaTecnica: IComboBase1[];
  listaNivelCompetenciaTecnica: IComboBase1[];
  listaExperiencia: ExperienciaComboDTO[];
  listaTipoExperiencia: IComboBase1[];
  listaSexo: IComboBase1[];
  listaTipoFormacion: IComboBase1[];
  listaNivelEstudio: NivelEstudioComboDTO[];
  listaAreaFormacion: IComboBase1[];
  listaCentroEstudio: CentroEstudioDTO[];
  listaGradoEstudio: IComboBase1[];
  listaEstadoCivil: IComboBase1[];
  listaRango: IComboBase1[];
}
export interface PerfilPuestoTrabajoInsertar {
  idPuestoTrabajo: number;
  idPerfilPuestoTrabajo: number;
  descripcion: string;
  objetivo: string;
  estadoPuestoTrabajoCaracteristicaPersonal: boolean;
  estadoPuestoTrabajoCursoComplementario: boolean;
  estadoPuestoTrabajoExperiencia: boolean;
  estadoPuestoTrabajoFormacionAcademica: boolean;
  estadoPuestoTrabajoFuncion: boolean;
  estadoPuestoTrabajoRelacion: boolean;
  estadoPuestoTrabajoReporte: boolean;
  crearNuevaVersion: boolean;
  esUsuarioAprobacion: boolean;
  idPersonal: number;
  usuario?:string;
  puestoTrabajoRelacion?: PuestoTrabajoRelacionCompuestoDTO[];
  PuestoTrabajoCursoComplementario?:PuestoTrabajoCursoComplementario[];
  PuestoTrabajoCaracteristicaPersonal?:PuestoTrabajoCaracteristicaPersonal[];
  PuestoTrabajoExperiencia?:PuestoTrabajoExperiencia[];
  PuestoTrabajoFormacion?:PuestoTrabajoFormacionAcademica[];
  PuestoTrabajoFuncion?:PuestoTrabajoFuncion[];
  PuestoTrabajoReporte?:PuestoTrabajoReporte[];
  Puntaje?:PuestoTrabajoPuntajeEvaluacionAgrupadaComponente
}
export interface PuestoTrabajoRelacionCompuestoDTO {
  id: number;
  idPerfilPuestoTrabajo: number;
  listaPuestoDependencia: FiltroIdNombrePKDTO[];
  listaPuestoRelacionInterna: FiltroIdNombrePKDTO[];
  listaPuestoACargo: FiltroIdNombrePKDTO[];
}

export interface FiltroIdNombrePKDTO {
  id?: number;
  nombre?: string;
}

export interface ExperienciaComboDTO {
  id: number;
  nombre: string;
  idAreaTrabajo: number;
}
export interface NivelEstudioComboDTO {
  id: number;
  nombre: string;
  idTipoFormacion: number;
}

export interface CentroEstudioDTO {
  id: number;
  nombre: string;
  idPais: number;
  IdCiudad: number;
  idTipoCentroEstudio: number;
  pais: string;
  ciudad: string;
  tipoCentroEstudio: string;
}

export interface PuestoTrabajoRelacionado {
  idPuestoDependencia: number[];
  idPuestoRelacionInterna: number[];
  idPuestoACargo: number[];
}
export interface PuestoFuncion {
  nroOrden: number;
  funcion: string;
  idFuncion: number;
  idFrecuencia: number;
}
export interface ReporteFuncion {
  nroOrden: number;
  reporte: string;
  idFrecuenciaPuestoTrabajo: number;
  frecuenciaPuestoTrabajo:string
}
export interface CursoComplementario {
  idTipoCursoComplementario: number;
  idCursoComplementario: number;
  idNivelCursoComplementario: number;
}
export interface Experiencia {
  idExperiencia: number;
  idTipoExperiencia: number;
  nroPeriodo: number;
  idPeriodo: number;
  tipoExperiencia: string;
  experiencia: string;
  periodo: string;
}
export interface CaracteristicasPersonales {
  idEdadMin: number;
  idEdadMax: number;
  idExperiencia: number;
  idEstadoCivil: number;
  idPerfilPuestoTrabajo: number;
  id: number;
  sexo: string;
  idSexo: number;
  estadoCivil: string;
}
export interface FormacionAcademica {
  idTipoFormacion: number[];
  idNivelEstudio: number[];
  idAreaFormacion: number[];
  idCentroEstudio: number[];
  idGradoEstudio: number[];
}
export interface ExamenesObtener {
  listaPuestoTrabajoRelacion: PuestoTrabajoRelacionCompuestoDTO[];
  listaPuestoTrabajoFuncion: PuestoTrabajoFuncion[];
  listaPuestoTrabajoReporte: PuestoTrabajoReporte[];
  listaPuestoTrabajoCursoComplementario: PuestoTrabajoCursoComplementario[];
  listaPuestoTrabajoExperiencia: PuestoTrabajoExperiencia[];
  listaPuestoTrabajoCaracteristicaPersonal: PuestoTrabajoCaracteristicaPersonal[];
  listaPuestoTrabajoFormacionAcademica: PuestoTrabajoFormacionAcademica[];
  listaEvaluacionesPuntajeCalificacion: PuestoTrabajoNombreEvaluacionAgrupadaComponenteDTO[];
  listaEvaluaciones: PuestoTrabajoNombreEvaluacionesAgrupadaIndependienteDTO[];
}
export interface PuestoTrabajoFuncion {
  id: number;
  idPerfilPuestoTrabajo: number;
  nroOrden: number;
  funcion: string;
  idPersonalTipoFuncion: number;
  personalTipoFuncion: string;
  idFrecuenciaPuestoTrabajo: number;
  frecuenciaPuestoTrabajo: string;
}

export interface PuestoTrabajoReporte {
  id: number;
  idPerfilPuestoTrabajo: number;
  nroOrden: number;
  reporte: string;
  idFrecuenciaPuestoTrabajo: number;
  frecuenciaPuestoTrabajo: string;
  version: number;
}

export interface PuestoTrabajoCursoComplementario {
  id: number;
  idPerfilPuestoTrabajo: number;
  idTipoCompetenciaTecnica: number;
  idCompetenciaTecnica: number;
  idNivelCompetenciaTecnica: number;
  tipoCompetenciaTecnica: string;
  competenciaTecnica: string;
  nivelCompetenciaTecnica: string;
  version?: string;
}
export interface PuestoTrabajoExperiencia {
  id: number;
  idPerfilPuestoTrabajo: number;
  idTipoCompetenciaTecnica?: number;
  idCompetenciaTecnica?: number;
  idNivelCompetenciaTecnica?: number;
  tipoCompetenciaTecnica?: string;
  competenciaTecnica?: string;
  nivelCompetenciaTecnica?: string;
  version?: string;
  experiencia?:string;
  tipoExperiencia?:string;
  idExperiencia?: number;
  idTipoExperiencia?:number;
  numeroMinimo?:number;
  periodo?:string;
 
}
export interface PuestoTrabajoCaracteristicaPersonal {
  id: number;
  idPerfilPuestoTrabajo: number;
  edadMinima?: number;
  edadMaxima?: number;
  idSexo?: number;
  idEstadoCivil?: number;
  sexo: string;
  estadoCivil: string;
  version: string;
}
export interface PuestoTrabajoFormacionAcademica {
  id: number;
  idPerfilPuestoTrabajo: number;
  idTipoFormacion: number[];
  idNivelEstudio: number[];
  idAreaFormacion: number[];
  idCentroEstudio: number[];
  idGradoEstudio: number[];
}

export interface PuestoTrabajoNombreEvaluacionAgrupadaComponenteDTO {
  calificacionTotal?: boolean;
  idEvaluacion?: number;
  nombreEvaluacion?: string;
  idGrupo?: number;
  nombreGrupo?: string;
  idComponente?: number;
  nombreComponente?: string;
  puntaje?: number;
  calificaPorCentil?: boolean;
  calificaAgrupadoNoIndependiente?: boolean;
  idProcesoSeleccionRango?: number;
  rangoProcesoSeleccionRango?: string;
  editar?: boolean;
  esCalificable?: boolean;
}
export interface PuestoTrabajoNombreEvaluacionAgrupada {
  calificacionTotal: boolean;
  idEvaluacion: number;
  nombreEvaluacion: string;
  idGrupo: number;
  nombreGrupo: string;
  idComponente: number;
  nombreComponente: string;
  puntaje: number;
  calificaPorCentil: boolean;
  calificaAgrupadoNoIndependiente: boolean;
  idProcesoSeleccionRango: number;
  esCalificable: boolean;
}
export interface PuestoTrabajoNombreEvaluacionesAgrupadaIndependienteDTO {
  id: number;
  nombre: string;
  calificacionTotal: boolean;
  calificaAgrupadoNoIndependiente: boolean;
  gridDetalleEvaluacion?: KendoGrid<PuestoTrabajoNombreEvaluacionAgrupadaComponenteDTO>;
}


export interface PuestoTrabajoVersiones
{
  id: number;
  idPuestoTrabajo: number;
  puestoTrabajo: string;
  version: number;
  objetivo: string;
  descripcion: string;
  personal_Solicitud: string;
  personal_Aprobacion: string;
  fechaSolicitud: string;
  fechaAprobacion: string;
  idPerfilPuestoTrabajoEstadoSolicitud: number;
  perfilPuestoTrabajoEstadoSolicitud: string;
  observacion: string;
  esActual: boolean;
}


export interface InterfazModulo{
id:number;
idModuloSistema:number;
moduloSistema:string;
idModuloSistemaGrupo:string;
moduloSistemaGrupo:string;
estado: boolean;
url:string;
idTipo:number;
nombreTipo:string;
}
export interface PuestoTrabajoPuntajeEvaluacionAgrupadaComponente{
  listaPuntaje:PuestoTrabajoNombreEvaluacionAgrupadaComponenteDTO[];
  usuario?: string
}

export interface AsignarInterfazDTO{
  listaAsignacion:ValidarAsignacionDTO[]
  id:number;
  usuario:string;
}

export interface ValidarAsignacionDTO{
  id:number;
  idModuloSistema:number;
  moduloSistema:string;
  idModuloSistemaGrupo:number;
  moduloSistemaGrupo:string;
  estado :boolean;
  modificacion:boolean;
  url :string;
}

