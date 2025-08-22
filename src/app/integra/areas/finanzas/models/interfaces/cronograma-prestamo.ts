export interface IFiltroEntidades{
      id:number,
      nombre:string,
}

export interface IFiltroPrestamo{
  toLowerCase(): unknown;
  id:number,
  nombre:string,
  idEntidadFinanciera: number,
}
export interface ILista{
  numeroCuota: number,
  fechaVencimientoCuota:Date,
  capitalCuota: number,
  interesCuota: number,
  totalCuota: number,
  nombreMoneda: string
}
