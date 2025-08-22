export interface Articulo{
  id: number;
  idWeb: number;
  nombre: string;
  titulo: string;
  imgPortada: string;
  imgPortadaAlt: string;
  imgSecundaria: string;
  imgSecundariaAlt: string;
  autor: string;
  idTipoArticulo: number;
  nombreArticulo: string;
  contenido: string;
  idArea: number;
  nombreArea: string;
  idSubArea: number;
  nombreSubArea: string;
  idExpositor: number;
  nombreExpositor: string;
  idCategoria: number;
  nombreCategoriaPrograma: string;
  urlWeb: string;
  urlDocumento: string;
  descripcionGeneral: string;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;
  parametroSeo:Array<ParametroSeo>
}
export interface camposParametroSeo{
  nombre: string,
  contenido: string,
}
export interface ArticuloEnvio{
  id: number;
  nombre: string;
  titulo: string;
  imgPortada: string;
  imgPortadaAlt: string;
  imgSecundaria: string;
  imgSecundariaAlt: string;
  autor: string;
  idTipoArticulo: number;
  contenido: string;
  idArea: number;
  idSubArea: number;
  idExpositor: number;
  idCategoria: number;
  urlWeb: string;
  urlDocumento: string;
  descripcionGeneral: string;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;
}
export interface programasNoAsociados{
  id:number,
  nombre:string,
}
export interface programasAsociados{
  id:number,
  nombre:string,
}
export interface ArticuloPGeneralEnvio{
  idArticulo: number,
  idsAsociados:Array<number>,
  usuario:string,
}
export interface ParametroSeo{
  id:number,
  nombre:string,
  numeroCaracteres:number,
  descripcion:string,
}
export interface ArticuloValor{
  lista:Array<number>
}
