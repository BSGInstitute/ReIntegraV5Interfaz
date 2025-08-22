export interface iTarifarioAdministrativo {
    id: number;
    usuario: string;
    nombre: string;
    fechaInicio: Date;
    fechaFin: Date;
    visiblePortalWeb: boolean;
    detalles: iDetallesTarifas[];
}
export interface iDetallesTarifas {
    id: number;
    concepto: string;
    descripcion: string;
    listaPaises: string;
    listaIdPaises: iListaPaises [];
    tipoCantidad: string;
    estados: string;
    subEstados: string;
}
export interface iDetallesTarifasInp {
    idTarifario: number;
    concepto: string;
    descripcion: string;
    listaPaises: string;
    listaIdPaises: iListaPaises [];
    tipoCantidad: string;
    estados: string;
    subEstados: string;
}
export interface iListaPaises {
    id: number;
    idPais: number;
    idMoneda: number;
    monto: number;
}
export interface iListaPaisesInp {
    idTarifario: number;
    id: number;
    idPais: number;
    idMoneda: number;
    monto: number;
}