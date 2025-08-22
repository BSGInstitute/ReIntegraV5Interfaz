export interface Sender{

    id:number;
    codigo:number;
    nombre: string;
    longCelular: number;
    longTelefono:string;
    longCelularAlterno: string;
    nombrePais: string;
    idPais:number;

}

export interface SenderCambiar{
    id:number;
    codigo:number;
    nombre:string;
    longCelular: number;
    longTelefono:string;
    longCelularAlterno: string;
    nombrePais: string;
}

  
export interface ComboSender {
      id:number;
      codigo:number;
      nombre:string;
      idPais:number;
  
}

export interface SenderEnvio{
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


export interface SenderPorPais{
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
