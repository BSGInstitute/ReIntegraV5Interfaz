
export interface CajaPorRendir {
  id: number,
  codigoFur: string,
  idPersonalSolicitante: number,
  nombrePersonalSolicitante: string,
  descripcion: string,
  idMoneda: number,
  idFur:number,
  nombreMoneda: string,
  totalEfectivo: number,
  fechaEntregaEfectivo: string|Date
}


export interface CajaPorRendirCombo{
  readonly id :number,
  readonly nombre:string
}

export interface CajaPorRendirComboCabecera{
  readonly id :number,
  readonly codigo:string
}

export interface MontoCaja{
  notaIngresoCaja: number,
  reciboEgresoCaja: number,
  porRendir: number,
  saldoCaja: number
}

export interface CajaPRCabeceraEnvio{
  id: number,
  idCaja: number,
  codigo: string,
  idPersonalAprobacion: number,
  idPersonalSolicitante: number,
  descripcion: string,
  observacion: string,
  esRendido: boolean,
  montoDevolucion: number,
  usuarioModificacion: string
}

export interface listaPorRendir{
  id: number,
  idCaja: number,
  codigoCaja: string,
  idFur: number,
  codigoFur: string,
  idPersonalSolicitante: number,
  nombrePersonalSolicitante: string,
  idPersonalResponsable: number,
  nombrePersonalResponsable: string,
  descripcion: string,
  idMoneda: number,
  nombreMoneda: string,
  totalEfectivo: number,
  fechaEntregaEfectivo: string|Date,
  usuarioModificacion: string
}

export interface GenerarPorRendir{
  cajaPRCabecera: CajaPRCabeceraEnvio
  listaIdPorRendir:number []
}

export interface GenerarPorRendirInmediato{
  cajaPRCabecera: CajaPRCabeceraEnvio,
  listaPorRendir: listaPorRendir[]
}

export interface PorRendirResumenCaja{
  idPorRendirCabecera: number,
  idCaja: number,
  moneda: string,
  idMoneda: number,
  codigoPorRendir:string,
  codigoFur:string,
  fechaAprobacion: string|Date,
  entregadoA: string,
  montoTotal: number,
  detalle: string,
  observacion: string,
  totalReciboEgreso: number,
  montoDevolucion:number,
  montoPendienteRendicion:number,
  fechasRendicion: string|Date,
  codigoCajaEgreso:string
}