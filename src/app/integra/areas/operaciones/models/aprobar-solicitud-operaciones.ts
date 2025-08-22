export interface Solicitud {
    id: number
    idOportunidad: number
    idTipoSolicitudOperaciones: number
    tipoSolicitudOperaciones: string
    fechaSolicitud: string
    idPersonalSolicitante: number
    personalSolicitante: string
    emailSolicitante: string
    idPersonalAprobacion: number
    personalAprobacion: string
    emailAprobador: string
    valorAnterior: string
    valorNuevo: string
    aprobado: boolean
    esCancelado: boolean
    comentarioSolicitante: string
    observacion: string
    idUrlBlockStorage: number
    urlBlockStorage: string
    nombreArchivo: string
    contentType: string
    realizado: boolean
    observacionEncargado: any
    nombreCompleto: string
    direccion: string
    dni: string
    correo: string
    codigoMatricula: string
    centroCosto: string
    pespecifico: string
    fechaAprobacion: string
    usuario: any
}

export interface SolicitudAceptada {
    codigoMatricula: string
    idMatriculaCabecera: number
}

export interface SolicitudRechazada {
    idOportunidad: number
    idTipoSolicitudOperaciones: number
    fechaSolicitud: string
    idPersonalSolicitante: number
    idPersonalAprobacion: number
    valorAnterior: string
    valorNuevo: string
    aprobado: boolean
    esCancelado: boolean
    comentarioSolicitante: string
    observacion: string
    idMigracion: any
    idUrlBlockStorage: number
    nombreArchivo: string
    contentType: string
    realizado: boolean
    observacionEncargado: any
    fechaAprobacion: string
    relacionEstadoSubEstado: any
    envioAutomatico: any
    id: number
    fechaCreacion: string
    fechaModificacion: string
    estado: boolean
    usuarioCreacion: string
    usuarioModificacion: string
}