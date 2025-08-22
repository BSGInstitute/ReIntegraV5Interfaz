export interface IComboArea {
  // reptorna un objeto mayuscula
  idGrupoFiltroProgramaCritico: number;
  nombreGrupoFiltroProgramaCritico: string;
}
export interface ICampaniaFacebook {
  idCampaniaFacebook: number
  idGrupoFiltroProgramaCritico: number
  facebookIdConjuntoAnuncio: string
  nombreGrupoFiltroProgramaCritico: string
  facebookNombreCampania: string
  idFacebookConjuntoAnuncio: number
  facebookNombreConjuntoAnuncio: string
  presupuestoDiarioConjuntoAnuncio: number
  idFacebookAnuncio: number
  facebookIdAnuncio: string
  facebookNombreAnuncio: string
  actual: IMetricaIndividual
  sieteDias: IMetricaIndividual
  tresDias: IMetricaIndividual
  unDia: IMetricaIndividual
}
export interface IMetricaIndividual {
  gasto: number
  idFacebookMetrica: number
  impresiones: number
  costoPorMil: number
  cantidadClics: number
  fechaConsulta: string
  impresionesPorClic: number
  moneda: string
  registros: number
  clicPorRegistro: number
  registrosMuyAlta: number
  porcentajeRegistrosMuyAlta: number
  clicsRegistrosMuyAlta: number
  gastoPorRegistrosMuyAlta: number
  rangoA?: number
  rangoB?: number
  rangoC?: number
  cantidad: number
}
