import { IClaveValor, IComboBase1 } from '@shared/models/interfaces/iglobal';
import { IAgendaAlumno } from './iagenda-alumno';
import { ISubAreaCapacitacionCombo } from '@shared/models/interfaces/isub-area-capacitacion';
import { IProgramaGeneralCombo } from '@shared/models/interfaces/iprograma-general';
import { IPEspecificoCombo } from '@shared/models/interfaces/ipespecifico';
import { ComboPersonalVentas } from '@shared/models/interfaces/ipersonal';

export interface ITasaConversionConsolidada {
  alumno?: IAgendaAlumno;
  probabilidadSueldo?: any;
  visualizarDatos?: any;
}
export interface IReporteTasaConversionConsolidada {
  consolidados: IConsolidadoAgrupado[];
  desagregados: IDesagregadoAgrupado[];
  centroCostoAsesorAgrupados: ICentroCostoAsesorAgrupado[];
  centroCostoAsesor: ICentroCostoAsesor[];
}

export interface ICentroCostoAsesor {
  idasesor: number;
  idcodigopais: number;
  ingresoReal: number;
  ingresoMes: number;
  precioSinDesc: number;
  precioListaFinal: number;
  descuento: number;
  descuentoPromedio: number;
  precioPromedio: number;
  oportunidadesOCAnyIS: number;
  oportunidadesOCTotal: number;
  estadoAsesor: boolean;
  nombres: string;
}

export interface ICentroCostoAsesorAgrupado {
  idAsesor: number;
  precioPromedio: number;
  ingresoReal: number;
  ingresoMes: number;
  descuentoPromedio: number;
  oportunidadesOCAnyIS: number;
  oportunidadesOCTotal: number;
  estadoAsesor: boolean;
  precioListaFinal?: number;
  idcodigopais?: number;
  descuento?: number;
}

export interface IConsolidadoAgrupado {
  grupo: string;
  data: IConsolidado[];
}
export interface IListaMuyAlta {
  orden: number;
  idSub: number;
  nombreSub: string;
  idcategoriaOrigen: number;
  idCoordinador: number;
  nombreCoordinador: string;
  idasesor: number;
  ca_nombre: string;
  pais: number;
  nombrePais?: any;
  probabilidad: string;
  nombre: string;
  grupo: number;
  nombreGrupo?: any;
  inscritosMatriculados: number;
  oportunidadesCerradas: number;
  tasaConversion: number;
  ordenp: number;
  probabilidadDesc: string;
  tcMeta: number;
  centroCosto: number;
  nombreCentroCosto?: any;
}

export interface IDesagregado {
  orden: number;
  probabilidadDesc: string;
  grupo: string;
  nombreGrupo: string;
  pais: string;
  nombrePais: string;
  tcMeta: number;
  listaMuyAlta: IListaMuyAlta[];
}

export interface IDesagregadoAgrupado {
  grupo: string;
  data: IDesagregado[];
}

export interface IConsolidado {
  orden: number;
  idSub: number;
  nombreSub: string;
  idcategoriaOrigen: number;
  idCoordinador: number;
  nombreCoordinador: string;
  idasesor: number;
  ca_nombre: string;
  pais: number;
  nombrePais: string;
  probabilidad?: any;
  nombre: string;
  grupo: number;
  nombreGrupo: string;
  inscritosMatriculados: number;
  oportunidadesCerradas: number;
  tasaConversion: number;
  ordenp: number;
  probabilidadDesc: string;
  tcMeta: number;
  centroCosto: number;
  nombreCentroCosto?: string;
}

export interface IConsolidadoCoordinador {
  oc: number;
  is: number;
  tc: number;
  meta: number;
  RealByMeta: number;
  ingresoRealMeta: number;
  ingresoRealPromedio: number;
  ingresoPromedioMeta: number;
  ingresoReal: number;
  ingresoMes: number;
  descuentoPromedio: number;
  ingresoMeta: number;
  idCoordinador: number;
  nombreCoordinador: string;
}

export interface IConsolidadoAsesor {
  nombreCoordinador?: string;
  nombreAsesor?: string;
  IdAsesor?: number;
  inscritos?: number;
  cerradas?: number;
  tc?: number;
  tcMeta?: number;
  RealByMeta?: number;
  ingresoMetaPromedio?: number;
  ingresoRealPromedio?: number;
  IRByIM?: number;
  ingresoReal?: number;
  ingresoMes?: number;
  DescuentoPromedio?: number;
  ingresoMeta?: number;
}

export interface IFiltroEnvio {
  areas?: number[];
  subAreas?: number[];
  pGeneral?: number[];
  pEspecifico?: number[];
  modalidades?: string[];
  ciudades?: string[];
  fecha?: boolean;
  coordinadores?: number[];
  asesores?: number[];
  fechaInicio?: string;
  fechaFin?: string;
  fechaInicioMatricula?: string;
  fechaFinMatricula?: string;
  fechaInicioAsignacion?: string;
  fechaFinAsignacion?: string;
  checkFecha?: number;
  personal?: number;
}

export interface IFormFiltro{
  areas: number[];
  subAreas: number[];
  pGeneral: number[];
  pEspecifico: number[];
  modalidades: string[];
  ciudades: string[];
  fecha: boolean;
  coordinadores: number[];
  asesores: number[];
  fechaInicio: Date;
  fechaFin: Date;
  estadoPersonal: IClaveValor[];
  muestraMinima: number;
}

export interface IReporteTasaConversionConsolidadaCombo{
  coordinadores: ComboPersonalVentas[];
  asesores: ComboPersonalVentas[];
  areasCapacitacion: IComboBase1[];
  subAreasCapacitacion: ISubAreaCapacitacionCombo[];
  programasGenerales: IProgramaGeneralCombo[];
  programasEspecificos: IPEspecificoCombo[];
}
