
export interface Pais {
  id:number;
  codigoPais:number;
  codigoIso: string;
  nombrePais: string;
  moneda: string;
  zonaHoraria:number;
  estadoPublicacion: number;
  rutaBandera?:string;
  rutaIcono?:string;
}
export interface PaisEnvio {
  id:number;
  codigoPais:number;
  codigoIso: string;
  nombrePais: string;
  moneda: string;
  zonaHoraria:number;
  estadoPublicacion: number,
  rutaBandera?:string;
}
export interface PaisCombo {
    id:number;
    codigoPais:number;
    nombrePais:string;
}
export interface PaisComboZonaHoraria{
  id:number;
  codigoPais:number;
  nombrePais:string;
  zonaHoraria: number;
}

