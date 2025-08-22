import { IRowActual } from './iagenda';
import { IconName } from "@fortawesome/fontawesome-svg-core";

export interface IAgendaActivad {
  actividadCabecera: string;
  actividadEjecutadaUltimos7Dias?: number;
  actividadTotalUltimos7Dias?: number;
  actividadesAgenda: null;
  actividadesManhana?: number;
  actividadesTarde?: number;
  asesor: string;
  categoriaDescripcion: string;
  categoriaNombre: string;
  celular: string;
  centroCosto: string;
  codigoFase: string;
  codigoMatricula: string;
  contacto: string;
  diasActividadesEjecutadas?: number;
  diasAtrasoCuotaPago?: number;
  diasSeguimiento?: number;
  diasSinContactoManhana?: number;
  diasSinContactoTarde?: number;
  dni?: string;
  ejecutadasDiaActual?: number;
  email1: string;
  estadoHoja: string;
  estadoMatricula: string;
  fechaGrabacion: string;
  fechaPrimeraSesion?: string;
  fechaSolicitud?: string;
  fechaVerificacion?: string;
  grupoCurso?: number;
  id: number;
  idActividadCabecera: number;
  idAlumno: number;
  idCategoriaOrigen: number;
  idCentroCosto: number;
  idClasificacionPersona: number;
  idCodigoPais?: number;
  idEstadoMatricula?: number;
  idEstadoOportunidad: number;
  idFaseOportunidad: number;
  idMatriculaCabecera?: number;
  idOportunidad: number;
  idPadre?: number;
  idPersonal_Asignado: number;
  idSubCategoriaDato: number;
  idTipoDato: number;
  modalidad: string;
  nombreTipoDato: string;
  numeroDiasActividadesReprogramadas?: number;
  origen: string;
  pEspecifico: string;
  probabilidadActualDesc: string;
  reprogramacionAutomatica: true;
  reprogramacionManual: false;
  subEstadoMatricula: string;
  tarifario: string;
  tipoSolicitudOperaciones: string;
  totalDiaActual?: number;
  ultimaFechaProgramada: string;
  ultimoComentario: string;
  validaLlamada: true;
  validoAccesoTemporal?: number;
}

export interface IActividadRealizada {
  actividad: string;
  asesor: string;
  ca_nombre: string;
  centroCosto: string;
  codigoFase: string;
  comentario: string;
  contacto: string;
  duracion: number;
  duracionContesto: string;
  duracionTimbrado: string;
  estado: string;
  estadoClasificacion: string;
  estadoLlamada: string;
  estadoLlamadaTresCX: string;
  estadosTresCX: string;
  faseInicial: string;
  faseMaxima: string;
  fechaFinLlamadaTresCX?: string;
  fechaIncioLlamadaTresCX?: string;
  fechaLlamada: string;
  fechaLlamadaFin?: string;
  fechaLlamadaIntegra?: string;
  fechaModificacion?: string;
  fechaProgramada?: string;
  fechaReal?: string;
  id: number;
  idCategoria: number;
  idContacto: number;
  idFaseOportunidadInicial?: number;
  idLlamada?: number;
  idOportunidad: number;
  idTresCX?: number;
  mayorTiempo: number;
  minutosIntervale: number;
  minutosTotalContesto: number;
  minutosTotalPerdido: number;
  minutosTotalTimbrado: number;
  nombreGrabacionTresCX: string;
  nombreGrabacionIntegra: string;
  nombreGrupo: string;
  numeroLlamadas: string;
  nombreTipoDato: string;
  ocurrencia: string;
  origen: string;
  PprobActual: string;
  subEstadoLlamadaIntegra: string;
  subEstadoLlamadaTresCX: string;
  tiempoLlamadas: string;
  tiempoContestoTresCx?: number;
  tiempoTimbradoTresCx?: number;
  tiemposTresCX: string;
  totalAsignacionManual: number;
  totalEjecutadas: number;
  totalNoEjecutadas: number;
  totalOportunidades: number;
  unicoContesto: string;
  unicoClasificacion: string;
  unicoEstadoLlamada: string;
  unicoFechaLlamada?: string;
  unicoTimbrado: string;
}

export interface IProgramaGeneral {
  codigo?: string;
  chatActivo?: number;
  codigoPartner?: string;
  estado: boolean;
  esModulo?: boolean;
  echaCreacion: string;
  echaModificacion: string;
  id: number;
  idArea?: number;
  idBusqueda?: number;
  idCategoria?: number;
  idChatZopim?: number;
  idPagina?: number;
  idPartner?: number;
  idPgeneral?: number;
  idSubArea?: number;
  idTipoPrograma?: number;
  logoPrograma?: string;
  nombreCorto?: string;
  nombre?: string;
  pw_duracion?: string;
  pw_estado?: string;
  pw_DescripcionGeneral?: string;
  pw_ImgPortada?: string;
  pw_ImgPortadaAlf?: string;
  pw_ImgSecundaria?: string;
  pw_ImgSecundariaAlf?: string;
  pw_mostrarBSPlay?: string;
  pg_titulo?: string;
  pw_tituloHtml?: string;
  urlBrochurePrograma?: string;
  urlImagenPortadaFr?: string;
  urlLogoPrograma?: string;
  urlPartner?: string;
  urlVersion?: string;
  usuarioCreacion: string;
  usuarioModificacion: string;
  tieneProyectoDeAplicacion?: boolean;
}

export interface ISpeechBienvenidaDespedida {
  data: { idPlantillaBienvenida: number; idPlantillaDespedida: number };
}
export interface IPlantillasPorIdFaseOportunidad {
  clave: string;
  idAreaEtiqueta?: number;
  idPlantilla: number;
  idPlantillaClaveValor: number;
  valor?: string;
}

export interface IPlantilla {
  codigo?: string;
  considerarEnvioAutomatico?: boolean;
  id: number;
  modalidad?: string;
  nombre: string;
  tipoPersonal?: string;
}

export interface IPlantillaMailing {
  asunto: string;
  cuerpoHTML: string;
  listaArchivosAdjuntos: {
    content: string;
    name: string;
    type: string;
    base64: boolean;
  };
}
export interface IFiltroAgenda {
  listaEstadoOcurrencia: {
    id: number;
    nombre: string;
  }[];
  listaFaseOportunidad: {
    id: number;
    codigo: string;
    nombre: string;
  }[];
  listaTipoDato: {
    id: number;
    nombre: string;
  }[];
  listaOrigen: {
    id: number;
    nombre: string;
  }[];
  listaProbabilidadRegistro: {
    id: number;
    nombre: string;
  }[];
  listaCategoriaOrigen: {
    id: number;
    nombre: string;
  }[];
}
// export interface ActividadesMarcador{
//   id: number,
//   idOportunidad: number,
//   fechaProgramadaTemp: string,
//   tab: string,
//   totalIntentos: number,
//   intentosExitosos: number,
//   intentosFallidos: number
// }
export interface Telefono{
  disabled?: boolean;
  show?: boolean;
  class?: string;
  icon?: IconName;
  rotate?: number;
}

export interface ActividadAgenda{
  actividadesAgenda: {[key: string]: IRowActual[]}
  estadosTabs: {[key: string]: boolean}
  logCarlos: string;
}export interface ActividadMarcadorLog{
  id: number;
  idOportunidad: number;
  idActividadDetalle: number;
  fechaProgramada?: Date | string;
  totalIntento?: number;
  contestado?: number;
  noContestado?: number;
  idAgendaTab?: number;
}