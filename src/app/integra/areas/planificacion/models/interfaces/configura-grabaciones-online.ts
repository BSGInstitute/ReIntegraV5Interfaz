export interface IFiltroConfiguraGrabacionesOnline{
    area?:number[];
    subArea?: number[];
    pGeneral?: number[];
    pEspecifico?: number[];
    partner?: number [];
}

export interface IFiltroObtenerSesiones{
    idPEspecifico?: number;
}

export interface IFiltroModificarDisponibilidadProgramaDefecto{
    id: string;
    numeroDia: string;
}

export interface IFiltroActualizarSesiones{
    idPEspecifico: string;
    idPEspecificoSesion: string;
    nombreSesion: string;
    idTipoProveedorVideo: string;
    video: string;
    fechaInicio: Date | null | undefined;
    fechaFin: Date | null | undefined;
    habilitado: string;
}

export interface IFiltroInsertarConfiguracionResumenGrabacionOnline {
    idPEspecificoSesion: number;
    idResumenGrabacionOnline: number;
    estado: boolean;
    usuario: string;
}

export interface IFiltroIniciarProcesoResumenGrabaciones {
    idPEspecifico: number;
    idPEspecificoSesion: number;
    tipoResumenGrabacionOnline: number[];
    sesion: string;
    urlVideo: string;
    usuario: string;
}