export interface PuestoTrabajoReporteDTO {
    id: number;
    nombre: string;
    idPersonalAreaTrabajo: number;
    personalAreaTrabajo:string;
}

export interface ProcesoSeleccionReporteDTO {
    id: number;
    nombre: string;
    idPuestoTrabajo: number;
    personalAreaTrabajo:string;
}

export interface ObtenerComboReporteDTO {
    listaPuestoTrabajo:PuestoTrabajoReporteDTO[];
    listaProcesoSeleccion:ProcesoSeleccionReporteDTO[];
}

export interface ReportePrincipalAnalisisProcesoSeleccionDTO {
    listaEtapas :ReporteAnalisisProcesoSeleccionDTO[]
    listaEtapasPorcentaje :ReporteAnalisisProcesoSeleccionPorcentajeDTO[]
}
export interface ReporteAnalisisProcesoSeleccionDTO{
    idEtapa : number;
    idProcesoSeleccion: number;
    nombreEtapa :string;
    idProveedor: number;
    proveedor :string;
    ordenEtapa: number;
    numeroPostulante: number;
    contactados: number;
    aprobados: number;
    desaprobados: number;
    enProceso: number;
    abandonados: number;
    sinRendir: number;
}
export interface ReporteAnalisisProcesoSeleccionPorcentajeDTO{
    idEtapa : number;
    idProcesoSeleccion: number;
    nombreEtapa :string;
    idProveedor: number;
    proveedor :string;
    ordenEtapa: string;
    numeroPostulante: string;
    contactados: string;
    aprobados: string;
    desaprobados: string;
    enProceso: string;
    abandonados: string;
    sinRendir: string;
}