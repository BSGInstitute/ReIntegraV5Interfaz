export interface EntidadFinanciera{
  id: number,
  nombre: string,
  descripcion: string,
  idMoneda: number,
  moneda: string,
  fechaCreacion: string | Date,
  fechaModificacion: string | Date,
  estado: boolean,
  usuarioModificacion: string,
  usuarioCreacion: string
}
  
export interface EntidadFinancieraCombo {
  readonly id: number,
  readonly nombre: string
}
export interface EntidadFinancieraEnvio{
  id: number,
  fechaCreacion: string,
  fechaModificacion: string,
  estado: boolean,
  usuarioCreacion: string,
  usuarioModificacion: string,
  nombre: string,
  descripcion: string,
  idMoneda: number,
  cuentaCte: string,
  idProveedor: number
}
