
  
  export interface FurCombo {
   id: number,
   codigo: string,
   detalle: string,
   idMonedaPagoReal: number
  }

  export interface FurService{
    idProducto: number,
    producto: string,
    idProveedor: number,
    proveedor: null,
    cuentaContable: string,
    cuenta: string,
    idCantidad: number,
    cantidad: string,
    idMoneda: number,
    costoOriginal: number,
    costoDolares: number,
    precioProducto: number,
    idCondicionTipoPago:number
  }