export interface Producto {
  id: number,
  nombre: string,
  descripcion: string,
  cuentaGeneral:string,
  cuentaGeneralCodigo: string,
  cuentaEspecifica:string,
  cuentaEspecificaCodigo: string,
  idProductoPresentacion: number,
  usuarioModificacion: string
  }

  export interface ProductoCombo {
    readonly id: number,
    readonly nombre: string
  }

  export interface ProductoEnvio {
    id: number,
    fechaCreacion: string,
    fechaModificacion: string,
    estado: boolean,
    usuarioCreacion: string,
    usuarioModificacion: string,
    nombre: string,
    descripcion: string,
    cuentaGeneral: string,
    cuentaGeneralCodigo: string,
    cuentaEspecifica: string,
    cuentaEspecificaCodigo: string,
    idProductoPresentacion: number,
    rowVersion:string
  }
