export interface Aprobado {
    valor: number
}

export interface Asesores_CentroCosto_Estado_Fase {
    faseOportunidades: FaseOportunidad[]
    asesores: Asesores[]
    centroCostos: CentroCosto[]
    estados: Estado[]
}

export interface Asesores {
    activo: boolean
    email: string
    id: number
    nivelVisualizacionAgenda:any
    nombres:string
    tipoPersonal:string
    usuario:string
}

export interface CentroCosto {
    codigo:string
    considerarEnvioAutomatico:any
    id:number
    modalidad:any
    nombre:string
    tipoPersonal:any
}

export interface Estado {
    id:number
    nombre:string
}

export interface FaseOportunidad {
    id:number
    codigo:string
    nombre:string
}

export interface Oportunidad {
    id: number,
    area: string,
    idCentroCosto: number,
    idPersonalAsignado: number,
    idTipoDato: number,
    idFaseOportunidad: number,
    idOrigen: number,
    idCategoriaOrigen: number,
    idAlumno: number,
    idFaseOportunidadIP: any,
    idFaseOportunidadPF: any,
    idFaseoportunidadIC: any,
    codigoPagoIC: any,
    fechaCreacion: string,
    fechaRegistroCampania: any,
    usuarioCreacion: string,
    nombreCentroCosto: string,
    nombreCompletoAlumno: string,
    asesor: string,
    codigoFaseOportunidad: string,
    nombreTipoDato: string,
    nombreOrigen: string,
    fechaProgramada: string,
    nombrePais: string,
    nombreCategoriaOrigen: string,
    probabilidadActualValor: any,
    probabilidadActual: string,
    probabilidadNuevoValor: any,
    probabilidadNuevo: any,
    codigoPago: any,
    sentinel: any,
    nombreGrupo: string,
    montoTotal: any,
    montoTotalDolares: any,
    moneda: any,
    TotalPago: any,
    tontoPagado: any,
    fechaReal: any,
    idOcurrencia: any,
    idEstadoActividadDetalle: any,
    idEstadoOcurrencia: any,
    estadoOcurrencia: any,
    verificado: any,
    diasSinContactoManhana: number,
    diasSinContactoTarde: number,
    codigoMatricula: any,
    idMatriculaCabecera: any,
    paquete: any,
    matricula: any,
    matriculaDolares: any,
    idMatriculaObservacion: any,
    idCriterioCalificacion: any,
    descuento: any,
    nombreCampania: any,
    facebookNombreAnuncio: any,
    probabilidad1: any,
    probabilidad2: any,
    clasificacion1: any,
    clasificacion2: any,
    fechaCierre: any,
    idBusqueda: any,
    interaccion: any,
    urlOrigen: any,
    grabacionIntegra: any,
    grabacionCentral: any,
    convenioFirmado: any,
    personaEncargada: any,
    webphone: any,
    accesoTemporal: any,
    programaAccesoTemporal: any,
    fechaInicioAccesoTemporal: any,
    fechaFinAccesoTemporal: any,
    coordinadoraAcademica: any,
    asesorSolicitante: string,
    idPersonalSolicitante: number,
    idSolicitudVisualizacion: number
}