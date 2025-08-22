export interface WordsToFind {
  name: string;
}
export interface PaisesGoogleId{
  nombre:string;
  id:number;
}
export interface AdwordsReporte{
  ListaPalabras: ListaPalabra[];
  Paises: number[];
  TipoPalabra: string;
  IdIdioma: string;
  FechaInicio: Date;
  FechaFin: Date;
  Usuario: string;
}
export interface ListaPalabra {
  CadenaTexto: string;
  TipoTexto: number;
}
