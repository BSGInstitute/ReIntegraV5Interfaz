export interface HistoricoProducto {
   id: number,
   producto: string,
   idProducto: number,
   proveedor: string,
   idProveedor: number,
   idCondicionPago: number,
   condicionPago:string,
   moneda: string,
   idMoneda: number,
   precio: number,
   idTipoPago: number,
   tipoPago: string,
   observaciones: string,
   usuarioModificacion:string,
   fechaModificacion: string|Date,
   estado: boolean
  }

  export interface HistoricoProductoCombo {
    readonly id: number,
    readonly nombre: string
  }

  export interface HistoricoProductoEnvio {
    id: number,
    producto: string,
    idProducto: number,
    proveedor: string,
    idProveedor: number,
    idCondicionPago: number,
    condicionPago: string,
    moneda: string,
    idMoneda: number,
    precio: number,
    idTipoPago: number,
    tipoPago: string,
    observaciones: string,
    usuarioModificacion: string,
    fechaModificacion: Date|string,
    estado: boolean
  }
  export interface HistoricoEnvio{
    id: number,
    idTipoPago: number,
    idCondicionPago: number,
    observaciones: string,
    usuarioModificacion: string
  }
