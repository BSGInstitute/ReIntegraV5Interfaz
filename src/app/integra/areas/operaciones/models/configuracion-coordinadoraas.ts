export interface IConfiguracionCentroCostoCoordinador {
    centroCostoAsignado:ICentroCostoAsignado[]
    centroCostoNoAsignado:ICentroCostoNoAsignado[]
}
export interface ICentroCostoNoAsignado{
    id?:number;
    idPersonal?:number;
    personal:string;
    idEstadoMatricula?:number;
    estadoMatricula:string;
    idSubEstadoMatricula?:number;
    subEstadoMatricula:string;
    idCentroCosto:number;
    idProgramaEspecifico:number;
    centroCosto:string;
    programaEspecifico:string;
    estadoProgramaEspecifico:string;
    tipo:string;
    fechaCreacion:Date;
    esAsignado:boolean;
}
export interface ICentroCostoAsignado{
    idPersonal:number;
    personal:string;
    idEstadoMatricula?:number;
    estadoMatricula:string;
    idSubEstadoMatricula?:number;
    subEstadoMatricula:string;
    detalleCentroCosto: Array<ConfiguracionCoordinadorPorPersonalDetalleCentroCosto>;
    detalleEstadoMatricula:  Array<ConfiguracionCoordinadorPorPersonalDetalleEstadoMatricula>;
    detalleSubEstadoMatricula:  Array<ConfiguracionCoordinadorPorPersonalDetalleSubEstadoMatricula>;
}
export interface ConfiguracionCoordinadorPorPersonalDetalleCentroCosto{
    idCentroCosto:number;
    centroCosto:string;
}
export interface ConfiguracionCoordinadorPorPersonalDetalleEstadoMatricula{
    idEstadoMatricula?:number;
    estadoMatricula:string;
}
export interface ConfiguracionCoordinadorPorPersonalDetalleSubEstadoMatricula{
    idSubEstadoMatricula?:number;
    subEstadoMatricula:string;
}


export interface IObtenerCombosConfiguracionCoordinador{
    personal: Ipersonal[];
    centroCosto:CentroCostoPadreCentroCostoIndividual[];
    estadoMatricula: FiltroConfiguracionCoordinadoraEstadoMatricula[];
    subEstadoMatricula:SubEstadoMatriculaFiltroConfiguracionCoordinadora[]
}

export interface Ipersonal
{
       id:number;
       nombre:string;
       modalidad:string;
       codigo:string;
       considerarEnvioAutomatico?:boolean;
       tipoPersonal:string;
}
export interface CentroCostoPadreCentroCostoIndividual
{
       idCentroCosto:number;
       idProgramaEspecifico:number;
       centroCosto:string;
       programaEspecifico:string;
       estadoProgramaEspecifico:string;
       tipo:string;
}

export interface FiltroConfiguracionCoordinadoraEstadoMatricula
{
       idEstadoMatricula:number;
       estadoMatricula:string;
}
export interface SubEstadoMatriculaFiltroConfiguracionCoordinadora
{
       idSubEstadoMatricula:number;
       subEstadoMatricula:string;
       idEstadoMatricula:number;
}



export interface IInsertarConfiguracionCoordinadorEnvio
{


    
    id?:number,
    listaPersonal:Array<number>,
    listaCentroCosto:Array<number>,
    listaEstadoMatricula:Array<number>,
    listaSubEstadoMatricula:Array<number>,
    usuario:string,
    
}

export interface IAprobarMaterialVersion
{
    id:number;
    nombreUsuario:string;
}