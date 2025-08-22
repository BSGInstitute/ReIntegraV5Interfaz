export interface FiltroBusqueda{
    area: number|null,
    ciudad: number|null,
    anio: number|null,
    semana:number|null,
    moneda: number|null,
    estado: boolean|null,
}


export interface RegistrarPagoFur{
  idFur: number,
  codigo: string,
  idProveedor: number,
  nombreProveedor: string,
  nombreProveedorComprobante: string,
  idProducto: number,
  nombreProducto: string,
  idCC: number,
  idPais: number,
  nombreCentroCosto: string,
  numeroCuenta: string,
  descripcionCuenta: string,
  cantidad: number,
  monedaFur: number,
  nombreMonedaFur: string,
  precioUnitarioSoles: number,
  precioUnitarioDolares: number,
  precioTotalSoles: number,
  precioTotalDolares: number,
  nombreDocumento: string,
  numeroRecibo: string,
  descripcion: string,
  numeroComprobante: string,
  pagoMonedaOrigen: number,
  pagoDolares: number,
  faseAprobacion: number,
  antiguo: number,
  monedaPagoRealizado: number,
  nombreMonedaPagoRealizado: string,
  estadoCancelado: boolean,
  usuario: string,
  fechaModificacion: string|Date
}

export interface AsociarFurDataEnvio{
  idComprobantePago: number,
  monto: number,
  usuario: string,
  idFur: number
}

export interface PagosPorFur{
  id: number,
  idComprobantePagoPorFur: number,
  nombreComprobantePagoPorFur: string,
  numeroPago: number,
  idMoneda: number,
  nombreMoneda: string,
  numeroCuenta: number|null,
  numeroRecibo: string,
  idFormaPago: number,
  nombreFormaPago: string,
  fechaCobroBanco: string|Date,
  precioTotalMonedaOrigen: number,
  precioTotalMonedaDolares: number,
  idCancelado: boolean,
  nombreCancelado: string,
  nombreCuenta:string|null
}

export interface InsertPagoFur{
  id: number,
  idFur: number,
  idComprobantePago: number,
  numeroPago: number,
  idMoneda: number,
  numeroCuenta: string,
  numeroRecibo: string,
  idFormaPago: number,
  fechaCobroBanco: string|Date,
  precioTotalMonedaOrigen: number,
  precioTotalMonedaDolares: number,
  usuario: string,
  idCancelado: boolean,
  idComprobantePagoPorFur: number
}

