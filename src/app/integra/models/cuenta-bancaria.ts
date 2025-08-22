export interface CuentaBancaria{
  id: number,
  numeroCuenta: string,
  moneda: string,
  idMoneda: number,
  ciudad: string,
  idCiudad: number,
  nombreBanco: string,
  idBanco: number,
  usuarioModificacion: string,
  fechaModificacion: Date | string,
  usuarioCreacion: string,
  fechaCreacion:Date | string,
  estadoCuenta: boolean
}
export interface CuentaBancariaCombo {
    readonly id :number,
    readonly numeroCuenta :  string,
    readonly idMoneda : number,
    readonly idBanco : number
}
export interface CuentaBancariaEnvio{
  id: number,
  fechaCreacion:string,
  fechaModificacion: string,
  estado: true,
  usuarioCreacion: string,
  usuarioModificacion: string,
  numeroCuenta: string,
  idCiudad: number,
  sucursal: string,
  idMoneda: number,
  cuenta: string,
  idBanco: number
}

   