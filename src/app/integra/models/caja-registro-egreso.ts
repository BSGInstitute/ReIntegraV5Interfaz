
export interface CajaEgreso {
  id: number,
  idCajaPorRendirCabecera: string,
  idCaja: number,
  idComprobantePago: number,
  idProveedor: number,
  nombreProveedor: string,
  rucProveedor: string,
  idSunatDocumento: number,
  nombreSunatDocumento: string,
  serie: string,
  numero: string,
  idFur: number,
  idFurAnterior: null,
  codigoFur: string,
  descripcion:string,
  idMoneda: number,
  totalEfectivo: number,
  fechaEmision: string|Date,
  idCajaEgresoAprobado: number,
  esEnviado: boolean,
  idPersonalResponsable: number,
  idPersonalSolicitante: number,
  personalSolicitante: string,
  montoFur: number,
  montoPendiente: number,
  esCancelado: boolean,
  usuarioModificacion: string
}

export interface CajaEgresoEnvio{
  id: number,
  idFur: number,
  totalEfectivo: number,
  idComprobantePago: number,
  usuarioModificacion: string,
  descripcion: string,
  idMoneda: number,
  idFurAnterior: number
}
export interface listaEsCancelado{
  idRec: number,
  furEsCancelado: boolean
}

export interface CajaEgresoGenerarREC{
  cajaRECAprobado:CajaEgreseAprobado,
  listaEgresoCancelado:listaEsCancelado[]
}

export interface CajaEgreseAprobado{
  id: number,
  idCaja: number,
  codigoRec: string,
  anho: string,
  detalle: string,
  observacion: string,
  origen: string,
  fechaCreacionRegistro: string|Date,
  idPersonalResponsable: number,
  usuarioModificacion: string
}

export interface CajaEgresoGenerarRECDirecto{
  cajaEgresoAprobado:CajaEgreseAprobado,
  listaRegistroEgreso:CajaEgreso[]
}

export interface CajaEgresoResumenCaja{
  idCajaEgresoAprobado: number,
  idCaja: number,
  codigoEgresoCaja: string,
  nombreProveedor:string,
  rucProveedor: string,
  codigoFur: string,
  comprobantes: string,
  fechaEmisionRecibo:string|Date,
  entregadoA:string,
  montoTotal: number,
  origen: string,
  moneda: string,
  idMoneda: number,
  detalle: string,
  observacion:string,
  tipoDocumentosSunat: string,
  fechaGeneracionREC: string|Date
}

export interface fitroCaja{
  idPersonalResponsable: number|null,
  idCaja: number|null,
  idSolicitante: number|null,
}


