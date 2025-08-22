export interface ArticuloTag{
  idArticulo: number,
  idTag: number,
}
export interface ArticuloTagEnvio{
  idArticulo: number,
  idsAsociados:Array<number>,
  usuario:string,
}
export interface TagPorArticulo{
  id:number,
  nombre:string,
}
