/**
 * Modelo de obtencion de DocumentoLegal
 */
export interface DocumentoLegal {
  id: number,
  nombre: string,
  descripcion: string,
  idPais: number,
  pais: string,
  url: string,
  area: number,
  areas:number [],
  paises: string,
  paisesBD: [
    {
      id: number,
      idDocumentoLegal: number,
      idPais: number,
      usuarioCreacion: string,
      usuarioModificacion: string,
      fechaCreacion: string | Date,
      fechaModificacion: string | Date
    }
  ],
  roles: string,
  visualizarAgenda: boolean,
  descargarAgenda: boolean,
  usuario: string,
  documentoByte: string
}

/**
 * Modelo de obtencion de combo DocumentoLegal
 */
 export interface DocumentoLegalCombo {
  readonly id: number,
  readonly nombre: string,
}

/**
 * Modelo de envio de DocumentoLegal
 */
export interface DocumentoLegalEnvio {
  id: number,
  nombre: string,
  descripcion: string,
  idPais: number,
  pais: string,
  url: string,
  area: number,
  areas:number [],
  paises: number[],
  roles: string,
  visualizarAgenda: boolean,
  descargarAgenda: boolean,
  usuario: string,
  documentoByte: string
}
