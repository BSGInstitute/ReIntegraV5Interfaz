export interface AgendaFicha {

}

export interface HistorialOportunidades_Ventas {
    idAlumno: number;
    idClasificacionPersona: number;
    historialOportunidades: HistorialOportunidad[];
    ventasCruzadas: VentaCruzada[];
}

export interface HistorialOportunidad {
    idOportunidad: number;
    programa: string;
    area: string;
    grupo: string;
    fechaSolicitud: string;
    probabilidad: string;
    faseMaxima: string;
    faseOportunidad: string;
    asesor: string;
    fechaModificacion: string;
    precio: string;
    comision: string;
    montoTotal: string;
    idBusqueda: string;
}

export interface VentaCruzada {
    idOportunidad: number;
    programa: string;
    probabilidad: string;
    precio: string;
    comision:string;
    contado: string;
    costo: number;
    orden: number;
    matricula: string;
}

export interface HistorialMensajes {
    Id: number;
    Asunto: string;
    EmailBody: string;
    Fecha: Date | string;
    Remitente: string;
    Destinatarios: string;
    From: string;
    Seen: boolean;
    TotalCorreos: string;
    IdPersonal: number;
    EnvioMasivoMandrill: string;
    EnvioIndividualMandrill: string;
    ConCopia: string;
    IdAlumno: number;
    MessageId: string;
    Estado: string;
    Categoria: string;
    Tipo: string;
}

export interface FiltroKendo{
    filters: [
        {
            Field: string;
            Operator: string;
            value: string;
        }
    ]
    logic: string;
}

export interface HistorialMensajesDetalle {
    Remitente: string;
    Destinatarios: string;
    Asunto: string;
    EmailBody: string;
}