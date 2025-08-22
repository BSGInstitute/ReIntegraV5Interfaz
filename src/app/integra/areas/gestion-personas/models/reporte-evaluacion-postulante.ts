import { FormControl } from '@angular/forms';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';

export interface ComboModulo {
  estadoEtapas: Array<IComboBase1>;
  procesosDeSeleccion: Array<IComboBase1>;
  procesoSeleccionEtapas: Array<ProcesoSeleccionEtapa>;
  gruposComparacion: Array<IComboBase1>;
  versionesCentil: Array<{ valor: string }>;
}
export interface ProcesoSeleccionEtapa {
  id: number;
  nombre: string;
  idProcesoSeleccion: number;
  nombreProcesoSeleccion: string;
  nroOrden: number;
}

export interface ReporteEvaluacionPostulante {
  datosEvaluacionAgrupado: DatosEvaluacionAgrupado[];
  postulantes: Postulante[];
  etapaAprobada: EtapaAprobada[];
  cantidadEtapaAprobada: number;
  clasificacionNEO: ClasificacionNeo[];
  matriculaPostulantes: { id: number; valor: number }[];
}

export interface DatosEvaluacionAgrupado {
  ordenReal: number;
  proceso: Proceso[];
}

export interface Proceso {
  idProcesoSeleccion: number;
  procesoSeleccion: string;
  idPostulante: number;
  postulante: string;
  edad: number;
  examen?: string;
  idCategoria: number;
  categoria: string;
  idExamen: number;
  versionCentil: number;
  evaluacion: string;
  idEvaluacion: number;
  grupo?: string;
  idGrupo: number;
  idEtapa: number;
  etapa: string;
  notaAprobatoria: string;
  simbolo: string;
  registro: string;
  orden: number;
  esAprobado: boolean;
  calificaPorCentil: boolean;
  idSexo: number;
  ordenReal: number;
  idFormulaGrupo?: number;
  estadoAcceso: any;
  configuracionComponenteCurso?: boolean;
  idExamenAccesoTemporal?: number;
  cantidadConfigurado: number;
  cantidadResuelto: number;
  puntajeCurso: number;
  examenCentilVersion?: ExamenCentilVersion[];
}

export interface ExamenCentilVersion {
  idCentil: number;
  registro: string;
  esAprobado: boolean;
  notaAprobatoria: string;
  simbolo: string;
  version: number;
  esVigente: boolean;
  esVersionExamen: boolean;
}

export interface Postulante {
  idPostulante: number;
  postulante: string;
  edad: number;
  clasificacionNeo: ClasificacionNeo;
}

export interface EtapaAprobada {
  idPostulante: number;
  postulante: string;
  etapas: Etapa[];
}

export interface Etapa {
  idProcesoSeleccion: number;
  procesoSeleccion: string;
  idEtapa: number;
  etapa: string;
  estadoEtapa: number;
  idEstadoEtapaProceso: number;
  etapaContactado: boolean;
  nroOrden: number;
  esCalificadoPorPostulante: boolean;
}

export interface ClasificacionNeo {
  idProcesoSeleccion: number;
  idPostulante: number;
  respuestaAlAzar: boolean;
  aquiescenciaAq: boolean;
  negacionesNe: boolean;
}

export interface EvaluacionesAsignadasEvaluador {
  id: number;
  idPostulante: number;
  idProcesoSeleccion: number;
  idExamen: number;
  idGrupoComponenteEvaluacion?: number;
  idEvaluacion: number;
  evaluacion: string;
  mostrarEvaluacionAgrupado?: boolean;
  mostrarEvaluacionPorGrupo?: boolean;
  mostrarEvaluacionPorComponente?: boolean;
  estadoExamen: boolean;
  requiereTiempo: boolean;
  duracionMinutos?: number;
  instrucciones: string;
}

export interface PreguntaTestAgrupado {
  idEvaluacion: number;
  idProcesoSeleccion: number;
  idPostulante: number;
  examenRequiereTiempo: boolean;
  examenDuracionMinutos: number;
  instrucciones: string;
  listaPreguntas: Array<PreguntaTestAgrupadoDetalle>;
}

export interface PreguntaTestAgrupadoDetalle {
  idExamenAsignado: number;
  idExamen: number;
  idPregunta: number;
  enunciadoPregunta: string;
  nroOrdenPregunta: number;
  idPreguntaTipo: number;
  preguntaTipo: string;
  idTipoRespuesta: number;
  tipoRespuesta: string;
  listaRespuestas: Array<RespuestasTest>;
  listaRespuestasRealizada: Array<RespuestaRealizada>;
  fcPregunta4: FormControl;
  fcPregunta5: FormControl;
}

export interface RespuestasTest {
  idPregunta: number;
  idRespuesta: number;
  nroOrden: number;
  enunciadoRespuesta: string;
  fcRespuesta93: FormControl;
  fcRespuesta75: FormControl;
  fcRespuesta10: FormControl;
  fcRespuesta: FormControl;
}

export interface RespuestaRealizada {
  id: number;
  idExamenAsignadoEvaluador: number;
  idPregunta: number;
  idRespuestaPregunta: number;
  textoRespuesta: string;
}

export interface FiltroReporte {
  idsPostulantes: Array<number>;
  idProcesoSeleccion?: number;
  idGrupoComparacion?: number;
  idsProcesoEtapa: Array<number>;
  idsEstadoEtapa: Array<number>;
  fechaInicio?: string;
  fechaFin?: string;
  filtroPorPostulante: boolean;
  idsPostulanteGrupoComparacion?: Array<number>;
  idProcesoSeleccionGrupoComparacion?: number;
}

export interface RespuestaEvaluacionEvaluador {
  listaRespuestasEvaluador: Array<RespuestaDetalle>;
  idEstadoEvaluacionEvaluador: number;
  idProcesoSeleccionEvaluacionEvaluador: number;
  idExamenEvaluacionEvaluador: number;
  idPostulanteEvaluacionEvaluador: number;
}
export interface RespuestaDetalle {
  idExamen: number;
  idRespuesta: number;
  idPregunta: number;
  idExamenAsignado: number;
  textoRespuesta: string;
  flag: boolean;
}

export interface ReportePostulanteMatricula {
  idPostulante: number;
  nombrePostulante: string;
  valorEscala: string;
  nombreProgramaEspecifico: string;
  usuario: string;
  programaGeneral: number;
}
export interface EvaluacionPortalPostulante {
  idPostulante: number;
  idProcesoSeleccion: number;
  idExamen: number;
  idPespecifico: number;
  idProgramaGeneral: number;
  idAlumno: number;
  cantidadConfigurado: number;
  cantidadResuelto: number;
  puntajeCurso: number;
  versionCentil: number;
}
