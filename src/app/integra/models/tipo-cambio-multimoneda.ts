export interface TasaCambioMultimoneda {
   id: number,
   idMoneda: number,
   nombreMoneda: string,
   monedaADolar: number,
   dolarAMoneda: number,
   fecha: string| Date,
   idPeriodo: number,
   nombreUsuario: string
  }
  
  export interface TasaCambioMultimonedaCombo {
    readonly id: number,
    readonly nombre: string
  }
  export interface TasaCambioMultimonedaFiltro {
   idMoneda: number,
   fecha: null|Date
 }
   
  export interface TasaCambioMultimonedaEnvio {
    id: number,
    monedaAdolar: number,
    dolarAmoneda: number,
    fecha: string| Date,
    idMoneda: number,
    idPeriodo: number,
    nombreUsuario: string
  }