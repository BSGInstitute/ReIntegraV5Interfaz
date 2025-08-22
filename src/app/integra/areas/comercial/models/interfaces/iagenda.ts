export interface IAgenda {}
// export interface ITabAgenda {
//   indexTab: number;
//   idTab: number;
//   nombreTab: string;
//   titleTab: string;
//   toggleFiltro: boolean;
//   selected: boolean;
//   disabled: boolean;
// }



export interface IRowActual {
  actividadCabecera: string;
  actividadEjecutadaUltimos7Dias?: number;
  actividadTotalUltimos7Dias?: number;
  actividadesAgenda?: any;
  actividadesManhana: number;
  actividadesTarde: number;
  asesor: string;
  categoriaDescripcion: string;
  categoriaNombre: string;
  celular?: string;
  centroCosto: string;
  codigoFase: string;
  codigoMatricula?: string;
  contacto: string;
  diasActividadesEjecutadas?: number;
  diasAtrasoCuotaPago?: number;
  diasSeguimiento?: number;
  diasSinContactoManhana: number;
  diasSinContactoTarde: number;
  dni?: string;
  ejecutadasDiaActual?: number;
  email1?: string;
  estadoHoja?: string;
  estadoMatricula?: string;
  fechaGrabacion?: Date;
  fechaPrimeraSesion?: Date;
  fechaSolicitud?: Date;
  fechaVerificacion?: Date;
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
  modalidad?: string;
  nombreTipoDato: string;
  numeroDiasActividadesReprogramadas?: number;
  origen: string;
  pEspecifico?: string;
  probabilidadActualDesc: string;
  reprogramacionAutomatica: boolean;
  reprogramacionManual: boolean;
  subEstadoMatricula?: string;
  tarifario?: string;
  tipoSolicitudOperaciones?: string;
  totalDiaActual?: number;
  ultimaFechaProgramada: Date;
  ultimoComentario: string;
  validaLlamada: boolean;
  validoAccesoTemporal?: number;
  color?: string;
  //MarcadorAutomatico
  fechaProgramadaMarcador?: Date;
  totalIntento?: number;
  contestado?: number;
  noContestado?: number;
  idAgendaTabMarcador?: number;
}

export interface IConfiguracionOpenVox {
  idPais: number;
  prefijo: string;
  anexo: string;
}

export interface Agenda {}

export interface IFiltroTabEnvio {
  idAlumno?: string;
  idAsesor?: string;
  idAsesorMR?: string;
  idCentroCosto?: string;
  idCategoriaOrigen?: string;
  idEstado?: string;
  idFaseOportunidad?: string;
  idTipoDato?: string;
  idOrigen?: string;
  idProbabilidad?: string;
  fecha?: Date;
}

interface IComboBase {
  readonly id: number;
  readonly nombre: string;
}

export interface IComboFiltroAgenda {
  readonly listaEstadoOcurrencia: Array<IComboBase>;
  readonly listaFaseOportunidad: {
    readonly id: number;
    readonly codigo: string;
    readonly nombre: string;
  }[];
  readonly listaTipoDato: IComboBase[];
  readonly listaOrigen: IComboBase[];
  readonly listaProbabilidadRegistro: IComboBase[];
  readonly listaCategoriaOrigen: IComboBase[];
}

export interface AgendaFiltrosGrid {
  idAlumno?: string;
  idAsesor?: string;
  idCentroCosto?: string;
  idFaseOportunidad?: string;
  idTipoDato?: string;
  idEstado?: string;
  idCategoriaOrigen?: string;
  probabilidadAct?: string;
  idOrigen?: string;
  take?: string;
  skip?: string;
  pageSize?: string;
  page?: string;
}

export interface AgendaFiltroRealizados {
  idEstado?: string;
  idAlumno?: string;
  idsAsesores?: string;
  idFaseOportunidad?: string;
  idTipoDato?: string;
  IdOrigen?: string;
  idCentroCosto?: string;
  fecha?: Date | string;
  categoria?: string;
  idProbabilidadActual?: string;
  take?: number;
  skip?: number;
  pageSize?: number;
  page?: number;
}
export interface ControlActividadesAgenda{
   totales: number;
   ejecutadas: number;
   itsGenerados: number;
   ipsGenerados: number;
}