export interface Moneda {

  id: number,
  nombre: string,
  nombreCorto: string,
  nombrePlural: string,
  simbolo: string,
  codigo: string,
  idPais: number,
  digitoFinanzas: number,
  validaProcesoSeleccion: boolean,
  visualizarTableroComercial: null,
  visualizarFinanzas: boolean,
  porcentajeMora: number,
  usuarioCreacion: string,
  usuarioModificacion: string,
  fechaCreacion: Date | string,
  fechaModificacion: Date | string

}


export interface MonedaCombo {
    id: number;
    nombre: string;
    nombreCorto: string;
    nombrePlural: string;
    simbolo: string;
}

export interface MonedaEnvio{
  id: number,
  fechaCreacion: string,
  fechaModificacion: string,
  estado: boolean,
  usuarioCreacion: string,
  usuarioModificacion: string,
  nombre: string,
  nombreCorto: string,
  nombrePlural: string,
  simbolo: string,
  codigo: string,
  idPais: number,
  digitoFinanzas: number,
  validaProcesoSeleccion: boolean,
  visualizarTableroComercial: boolean,
  visualizarFinanzas: boolean,
  porcentajeMora: number
}
