export interface IIdsSolicitud {
    idClasificacionPersona: number;
    idAlumno: number;
}

export interface IHistorialProgramas {
    actividadesOportunidad: any;
    listaHistorial: IPrograma[];
    listaVentaCruzada: IProgramaVentaCruzada[];
    programaGeneralPreBen: IProgramaGeneralPreBen;
}

export interface IPrograma {
    idOportunidad: number;
    programa: string;
    area: string;
    grupo: string;
    probabilidad: string;
    faseMaxima: string;
    faseOportunidad: string;
    precio: string;
    comision: string;
    montoTotal: string;
    idBusqueda: string;
    asesor: string;
    fechaSolicitud: Date | string;
    fechaModificacion: Date | string;
}

export interface IProgramaGeneralPreBen {
    oportunidadCompetidor: any;
    listaPreGeneral: any;
    listaPreEspecifico: any;
    listaBeneficios: any;
    listaCompetidores: any;
}

export interface IProgramaVentaCruzada {
    idOportunidad: number;
    programa: string;
    probabilidad: string;
    precio: string;
    matricula: string;
    comision: string;
    contado: string;
    orden: number;
    costo: number;
}
export interface IProgramaVentaCruzada {
    idPGeneral: number;
    idOportunidad: number;
    programa: string;
    area: string;
    grupo: string;
    probabilidad: string;
    faseMaxima: string;
    faseOportunidad: string;
    precio: string;
    comision: string;
    montoTotal: string;
    idBusqueda: string;
    asesor: string;
    fechaSolicitud: Date | string;
    fechaModificacion: Date | string;
}