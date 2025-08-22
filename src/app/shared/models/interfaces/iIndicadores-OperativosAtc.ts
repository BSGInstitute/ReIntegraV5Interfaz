export interface IindicadoresReporte{
  records:{
    coordinadoras: string[],
    reporteIndicadoresOperativos: IreporteIndicadoresOperativos[]
    reporteIndicadoresOperativosAgrupadoPorDia: IreporteIndicadoresOperativosAgrupadoPorDia[]

  }

}
export interface IreporteIndicadoresOperativos{
  coordinadora: string,
  detalle:IDetalle[],


}
export interface IDetalle{
  coordinadora:string,
  estado:string,
  total:string
}
export interface IreporteIndicadoresOperativosAgrupadoPorDia{
  coordinadora:string,
  detalle: IdetalleAgrupado[],
  dia:string
}
export interface IdetalleAgrupado{
  coordinadora:string,
  dia:string,
  estado:string,
  total:string
}
export interface IReporteOperacionesCombos{
  listaPersonal:IListaPersonal[],
  personalActivo:IPersonalActivo[]
}

export interface IListaPersonal{
  activo:boolean,
  email:string,
  id:number,
  nivelVisualizacionAgenda:string,
  nombres:string,
  tipoPersonal:string,
  usuario:string
}
export interface IPersonalActivo{
     id:number,
     nombreCompleto:string,
     nombre:string,
     apellido:string,
     usuario:string,
     asignado:boolean

}