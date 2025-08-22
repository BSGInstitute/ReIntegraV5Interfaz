export interface EnvioAlumnoCongelado{
  id: number,
  codigoMatricula: string,
  idMatriculaCabecera: number,
  nroCuota: number,
  nroSubCuota: number,
  fechaVencimiento: string|Date,
  cuota: number,
  saldo: number,
  mora: number,
  montoPagado: number,
  cancelado: boolean,
  tipoCuota: string,
  moneda: string,
  fechaPago: string|Date,
  fechaCongelamiento: string|Date,
  idPeriodo: number,
  periodo: string,
  usuario: string
}

