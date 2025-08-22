import { KendoGrid } from "@shared/models/kendo-grid";

export interface IIngresoPorAsesor {
  coordinadores: Array<number>;
  asesores: Array<number>;
  periodoInicio: string;
  periodoFin: string;
  tipoPeriodo?: number;
}

export interface IFiltroIngresoAsesor {
  asesores: Array<number>;
  coordinadores: Array<number>;
  periodoFin: string;
  periodoInicio: string;
  tipoPeriodo?: number;
}
export interface IFormFiltro {
  asesores: Array<number>;
  coordinadores: Array<number>;
  periodoFin: number;
  periodoInicio: number;
  tipoPeriodo?: number;
}
export interface IComboFiltroIngresoAsesor {
  asesores: Array<IComboPersonal>;
  coordinadores: Array<IComboPersonal>;
  periodos: Array<IComboPeriodo>;
}
export interface IComboPersonal {
  activo: boolean;
  estado: boolean;
  id: number;
  idJefe: number;
  nombreCompleto: string;
}

export interface IDataAsesor {
  activo: boolean;
  estado: boolean;
  id: number;
  idJefe: number;
  nombreCompleto: string;
  grid: KendoGrid;
  chart: {
    mesRecuperado: string;
    dataVertical: number[];
    dataHorizontal: string[];
    iRmax: number;
    visible: boolean;
  }[];
  contadorColum:number;
  banderaMostrar:boolean;
  loading:boolean;
  ano:string
}
export interface IComboPeriodo {
  fechaCreacion: Date;
  fechaFin: Date;
  fechaInicial: Date;
  id: number;
  nombre: string;
}

export interface ICoordinadorData {
  asignados: Array<IAsesorAsignado>;
  datosPersonal: ICoordinador;
}
export interface IAsesorAsignado {
  activo: boolean;
  email: string;
  id: number;
  nivelVisualizacionAgenda: string;
  nombres: string;
  tipoPersonal?: string;
  usuario?: string;
}
export interface ICoordinador {
  anexo: string;
  anexo3Cx: string;
  apellidos: string;
  areaAbrev: string;
  central: string;
  contrasenaAsterisk: string;
  dominio: string;
  email: string;
  id: number;
  id3Cx: string;
  idJefe: number;
  nombres: string;
  password3Cx: string;
  rol: string;
  tipoPersonal: string;
  usuarioAsterisk: number;
}

export interface IComboFiltroIngresAsesor {
  asesores: Array<number>;
  coordinadores: Array<number>;
  periodos: string;
}
export interface IComboFiltroIngresAsesor {
  asesores: Array<number>;
  coordinadores: Array<number>;
  periodos: string;
}

export interface IReporteGrafica {
  records: { consolidado: Array<IConsolidadoMensual> | Array<IConsolidadoSemanal> };
}

export interface IConsolidadoMensual {
  ano: number;
  descuento: number;
  descuento_Promedio: number;
  estadoAsesor: true;
  iR_IM: number;
  idAsesor: number;
  im: number;
  ingreso_en_el_mes_USD: number;
  ir: number;
  is: number;
  mes: string;
  mesNumero: number;
  nombres: string;
  oc: number;
  pP_IM_PP_OC: number;
  pP_IM_USD: number;
  pP_OC_USD: number;
  porcentaje_ingreso_mes: number;
  precioListaFinal: number;
  precioSinDesc: number;
  tC_Meta: number;
  tC_Real: number;
  tcMeta: number;
  tcReal_TCMeta: number;
}
export interface IConsolidadoSemanal {
  ano: number;
  descuento: number;
  descuento_Promedio: number;
  estadoAsesor: true;
  iR_IM: number;
  idAsesor: number;
  im: number;
  ingreso_en_el_mes_USD: number;
  ir: number;
  is: number;
  mes: string;
  nombres: string;
  nroSemana: number;
  oc: number;
  pP_IM_PP_OC: number;
  pP_IM_USD: number;
  pP_OC_USD: number;
  porcentaje_ingreso_mes: number;
  precioListaFinal: number;
  precioSinDesc: number;
  semana: string;
  tC_Meta: number;
  tC_Real: number;
  tcMeta: number;
  tcReal_TCMeta: number;
}
