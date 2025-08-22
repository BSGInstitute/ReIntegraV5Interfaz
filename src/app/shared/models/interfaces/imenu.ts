export interface IMenu {}

export interface IGrupoModulo {
  idGrupo: number;
  nombreGrupo: string;
  subGrupoModulo: Array<ISubGrupoModulo>;
  level: number;
  children: boolean;
}
export interface ISubGrupoModulo {
  idGrupo: number;
  idModuloSistemaTipo: number;
  modulos?: Array<IModuloUsuario>;
  nombreModuloSistemaTipo: string;
  level: number;
  children: boolean;
}
export interface IModuloUsuario {
  etiqueta: string;
  icono:string;
  idGrupo: number;
  idModulo: number;
  idModuloSistemaTipo: number;
  nombreModulo: string;
  url: string;
  level: number;
}

export interface ItemMenu {
  text: string;
  icon: string;
  expanded: boolean;
  children: boolean;
  selected: boolean;
  level?: number;
}
