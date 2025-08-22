export interface TipoCambioMensual {
    id: number,
    idMoneda: number,
    nombreMoneda: string,
    monedaAdolar: number,
    dolarAmoneda: number,
    mes: number,
    anio: number,
   }

   

   export interface TipoDeCambioFiltro {
    idMoneda: number,
    mes: null|number,
    anio: null|number,
  }

  export interface TipoCambioMensualEnvio {
    id: number,
    monedaAdolar: string,
    dolarAmoneda: string,
    mes: number,
    anio: number,
    idMoneda: number,
  }