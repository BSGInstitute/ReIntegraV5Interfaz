export interface IHistorialInteracciones {
    faseInicio: string;
    faseDestino: string;
    fechaModificacion: Date | string;
    fechaSiguienteLlamada: Date | string;
    estadoFase: string;
    fechaEnvio: Date | string;
    fechaPago: Date | string;
    estado: string;
    tiempoDuracion: string;
    tiempoDuracion3CX: string;
    llamadaIntegra: ILlamadas;
    llamadaTresCX: ILlamadas;
    nombreActividad: string;
    nombreOcurrencia: string;
    comentarioActividad: string;
    totalEjecutadas: number;
    totalNoEjecutadas: number;
    totalAsignacionManual: number;
    idFaseOportunidad: number;
}

export interface ILlamadas {
    id: number;
    fechaInicioLlamada: Date | string;
    fechaFinLlamada: Date | string;
    tiempoDuracion: string;
    tiempoDuracionMinutos: string;
    estadoLlamada: string;
    subEstadoLlamada: string;
    estadoLlamadaSegunFlow: null;
    nombreGrabacion: string;
    webphone: string
}