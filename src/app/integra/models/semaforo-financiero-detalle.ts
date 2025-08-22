export interface SemaforoFinancieroDetalle {
    id: 0,
    fechaCreacion: Date,
    fechaModificacion: Date,
    //estado: boolean, falta agregar en el DTO servicio
    usuarioCreacion: string,
    usuarioModificacion: string,
    idSemaforoFinanciero: number,
    nombre: string,
    mensaje: string,
    color: string
}



export interface SemaforoFinancieroDetalleEnvio {
    id: 0,
    fechaCreacion: string,
    fechaModificacion: string,
    estado: boolean,
    usuarioCreacion: string,
    usuarioModificacion: string,
    idSemaforoFinanciero: number,
    nombre: string,
    mensaje: string,
    color: string
}
