
export interface ProveedorCombo {
    readonly id:number;
    readonly nombre:string;
}

export interface ProveedorCuentaBancaria{
    id: number,
    idProveedor: number,
    idEntidadFinanciera: number,
    nombreBanco: string,
    idTipoCuentaBanco: number,
    tipoCuenta: string,
    nroCuenta: string,
    cuentaInterbancaria: string,
    idMoneda: number,
    moneda: string,
    usuarioModificacion: string
}
export interface ProveedorCalificacionEnvio{
  idProveedor: number,
  listaIdSubCriterioCalificacion:number[],
  idPrestacionRegistro: number,
  usuarioModificacion: string
}

export interface ProveedorEnvio{
    id: number,
    idTipoContribuyente: number,
    idDocumentoIdentidad: number,
    nroDocumento: string,
    razonSocial: string,
    apePaterno: string,
    apeMaterno: string,
    nombre1: string,
    nombre2: string,
    descripcion: string,
    direccion: string,
    idCiudad: number,
    telefono: string,
    email: string,
    celular1: string,
    celular2: string,
    contacto1: string,
    contacto2: string,
    alias: string,
    esDocente: boolean,
    usuarioModificacion: string,
    idImpuesto: number,
    idRetencion: number,
    idDetraccion: number,
    idPersonalAsignado: number,
    idPrestacionRegistro: number,
    plazoPago: number,
    listaProveedorTipoServicio: []
}

export interface proveedorComboEgreso{
    id: number,
    nroDocIdentidad: string,
    razonSocial: string,
    idTipoImpuesto: number,
    idDetraccion: number,
    idRetencion: number,
    idPais: number  
}
