export interface Ciudad{

    id:number;
    codigo:number;
    nombre: string;
    longCelular: number;
    longTelefono:string;
    longCelularAlterno: string;
    nombrePais: string;
    idPais:number;

}

export interface CiudadCambiar{
    id:number;
    codigo:number;
    nombre:string;
    longCelular: number;
    longTelefono:string;
    longCelularAlterno: string;
    nombrePais: string;
}

  
export interface ComboCiudad {
      id:number;
      codigo:number;
      nombre:string;
      idPais:number;
  
}

export interface CiudadEnvio{
    id:number;
    codigo:number;
    nombre: string;
    longCelular: number;
    longTelefono:string;
    longCelularAlterno: string;
    nombrePais: string;
    idPais: number;
    usuario:string;
}


export interface CiudadPorPais{
    id:number;
    codigo:number;
    nombre: string;
    longCelular: number;
    longTelefono:string;
    longCelularAlterno: string;
    nombrePais: string;
    idPais: number,
    usuario:string;
}
