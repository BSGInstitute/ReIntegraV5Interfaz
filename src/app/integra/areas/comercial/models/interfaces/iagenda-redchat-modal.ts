export interface IRedChatFormulario {
    apellidoPaterno: string;
    apellidoMaterno: string;
    centroCosto: string;
    nombreUno: string;
    nombreDos: string;
    emailUno: string;
    celular: string;
    faseOportunidad: number;
    areaFormacion: number;
    areaTrabajo: number;
    industria: number;
    tipoDato: number;
    ciudad: number;
    cargo: number;
    pais: number;
}

export interface IRedChatCombos {
    categoriaOrigenes: any;
    faseOportunidades: IFaseOportunidad[];
    areasFormacion: IAreaFormacion[];
    tipoDatoChats: ITipoDato[];
    areasTrabajo: IAreaTrabajo[];
    industrias: IIndustria[];
    ciudades: ICiudad[];
    origenes: IOrigenes[];
    cargos: ICargo[];
    paises: IPaises[];
}

export interface IAreaFormacion {
    id: number;
    nombre: string;
}

export interface IAreaTrabajo {
    id: number;
    nombre: string;
    usuario: string;
}

export interface ICargo {
    id: number;
    nombre: string;
}

export interface ICiudad {
    codigo: number;
    id: number;
    idPais: number;
    nombre: string;
}

export interface IFaseOportunidad {
    id: number;
    codigo: string;
    nombre: string;
}

export interface IIndustria {
    id: number;
    nombre: string;
}

export interface IOrigenes {
    id: number;
    nombre: string;
}

export interface IPaises {
    codigo: number;
    nombre: string;
    zonaHoraria: string;
}

export interface ITipoDato {
    id: number;
    nombre: string;
    modalidad: any;
    codigo: string;
    considerarEnvioAutomatico: any;
    tipoPersonal: any
}

export interface IAutocompleteCentroCosto {
    id: number;
    nombre: string;
}

export interface IAutocompletePaterno {
    id: number;
    nombreCompleto: string;
}

export interface IAutocompleteEmail {
    id: number;
    nombreCompleto: string;
}