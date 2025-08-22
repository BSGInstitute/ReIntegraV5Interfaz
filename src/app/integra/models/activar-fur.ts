export interface ActivarFur{
  id: number,
  codigo: string,
  centroCosto: string,
  programa:string,
  ciudad:string,
  tipoPedido: string,
  razonSocial: string,
  producto: string,
  productoPresentacion:string,
  fechaLimite:string|Date,
  descripcion:string,
  numeroCuenta: string,
  cuenta:string,
  cantidad: number,
  faseAprobacion1:string,
  precioUnitarioMonedaOrigen: number,
  precioTotalMonedaOrigen: number,
  usuarioSolicitud: string,
  monedaPagoReal:string,
  fechaAprobacionJefeFinanzas:string|Date
}

