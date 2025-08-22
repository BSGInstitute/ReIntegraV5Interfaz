import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';

export interface ProgramaGeneralPuntoCorte {
  id: number;
  idProgramaGeneral: number;
  puntoCorteMedia: number;
  puntoCorteAlta: number;
  puntoCorteMuyAlta: number;
  idPais: number;
  listaPuntoCorteMedia: ProgramaGeneralPuntoCorteDetalle[];
  listaPuntoCorteAlta: ProgramaGeneralPuntoCorteDetalle[];
  listaPuntoCorteMuyAlta: ProgramaGeneralPuntoCorteDetalle[];
}

export interface ProgramaGeneralPuntoCorteDetalle {
  id: number;
  idProgramaGeneralPuntoCorte: number;
  idPuntoCorte: number;
  tipo: string;
  descripcion: string;
  valorMinimo: number;
  valorMaximo: number;
}

export interface ProgramaGeneralPuntoCorteConfiguracion {
  id: number;
  idTipoCorte: number;
  tipo: string;
  idAreaCapacitacion: number;
  idSubAreaCapacitacion: number;
  idPgeneral: number;
  color: string;
  texto: string;
}

export interface ComboModuloPuntoCorte {
  listaAreaCapacitacion: IComboBase1[];
  listaSubAreaCapacitacion: SubAreaCapacitacion[];
  listaProgramaGeneral: ProgramaGeneralCombo[];
  listaPuntoCorte: IComboBase1[];
}

export interface SubAreaCapacitacion {
  id: number;
  nombre: string;
  idAreaCapacitacion: number;
}

export interface ProgramaGeneralCombo {
  id: number;
  nombre: string;
  idSubAreaCapacitacion: number;
}

export interface IFormFiltro {
  areas: number[];
  subAreas: number[];
  programaGeneral: number[];
  estadoPrograma: boolean;
}

export class PuntoCorteCabecera {
  puntoCorteMedia: number = 0.0;
  puntoCorteAlta: number = 0.0;
  puntoCorteMuyAlta: number = 0.0;
}

export interface ProgramaGeneralPuntoCorteAreaSubArea {
  idProgramaGeneralPuntoCorte?: number;
  idProgramaGeneral: number;
  nombreProgramaGeneral: string;
  puntoCorteMedia: number;
  puntoCorteAlta: number;
  puntoCorteMuyAlta: number;
  idAreaCapacitacion: number;
  idSubAreaCapacitacion: number;
  idPais?: number;
}

export interface PuntoCortePaises {
  idPais: number;
  nombrePais: string;
  field: string;
  selected: boolean;
  checked: boolean;
  panels: {
    idPuntoCorte: number;
    title: string;
    grid: KendoGrid<ProgramaGeneralPuntoCorteDetalle>;
  }[];
  puntosCorte: PuntoCorteCabecera;
  mensajeError: string;
}
export interface ProgramaGeneralPuntoCorteMasivo {
  listaIdPgeneral: number[];
  aplicaTodos: boolean;
  programaGeneralPuntoCorte: ProgramaGeneralPuntoCorte[];
}
