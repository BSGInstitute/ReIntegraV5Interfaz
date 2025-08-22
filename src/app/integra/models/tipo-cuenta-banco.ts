export interface TipoCuentaBanco {
  id: number,
  nombre: string,
  fechaCreacion: Date | string,
  fechaModificacion: Date | string,
  estado: boolean,
  usuarioCreacion: string,
  usuarioModificacion: string
}

export interface TipoCuentaBancoCombo {
  readonly id: number,
  readonly nombre: string
}

export interface TipoCuentaBancoEnvio {
  id: number,
  fechaCreacion: string,
  fechaModificacion: string,
  estado: boolean,
  usuarioCreacion: string,
  usuarioModificacion: string,
  nombre: string
}
