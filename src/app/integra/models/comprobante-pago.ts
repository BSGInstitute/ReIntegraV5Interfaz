
export interface ComprobantePago {
  id: number,
  idProveedor: number,
  ruc:string,
  proveedor: string,
  serie: string,
  numero: string,
  idSunatDocumento: number,
  sunatDocumento: string,
  comprobante: string,
  montoBruto:number,
  idMoneda: number,
  fechaEmision: string|Date
}

export interface ComprobantePagoEnvio{
  id: number,
  idSunatDocumento: number,
  idPais: number,
  idEmpresa:number,
  idCiudad:number,
  idProveedor: number,
  serieComprobante: string,
  numeroComprobante: string,
  idMoneda: number,
  montoBruto: number,
  montoInafecto: number,
  porcentajeIgv: number,
  montoIgv: number,
  ajusteMontoBruto: number,
  montoNeto: number,
  otraTazaContribucion: number,
  fechaEmision: string|Date,
  fechaProgramacion:  string|Date,
  idTipoImpuesto: number,
  idRetencion: number,
  idDetraccion: number,
  usuario: string
}

export interface DocumentoSunatCombo{
  readonly id: number,
  readonly nombre: string
}

export interface ComprobantPagoNoAsociado{
  id: number,
  idSede:number|null,
  comprobante:string,
  idProveedor: number,
  razonSocial: string,
  idPais: number,
  nombrePais: string,
  idSunatDocumento: number,
  nombreDocumento: string,
  serie:string,
  nroComprobante: string,
  fechaEmision: string|Date,
  fechaProgramacion: string|Date,
  idMoneda: number,
  moneda: string,
  montoInafecto: number,
  montoBruto: number,
  otraTazaContribucion: number,
  montoNeto: number,
  ajusteMontoBruto: number,
  idTipoImpuesto: number,
  montoIgv: number,
  idRetencion: number,
  valorRetencion: number,
  idDetraccion: number,
  valorDetraccion: number
}

export interface ComprobantePorFur{
   id :number,
   proveedor:string,
   idAsociacion :number,
   nombreAsociacion:string,
   idMoneda :number,
   montoAsociado :number,
   montoAmortizar :number,
}

export interface ComprobanteAsociadoFur{
  id: number,
  idDocumentoPago: number,
  nombreDocumento: string,
  serieComprobante: string,
  numeroComprobante: string,
  monto: number,
  idMoneda: number,
  nombreMoneda: string,
  fechaEmision: string,
  fechaProgramacion: string,
  idPais:number,
  nombrePais: string,
  idIgv: number,
  valorIGV: number,
  idRetencion: number,
  valorRetencion: number,
  idDetraccion: number,
  valorDetraccion: number,
  idProveedor: number,
  nombreProveedor: string,
  codigoFur: string,
  montoAfecto: number,
  montoInafecto: number,
  otraTazaContribucion: number,
  ajusteMontoBruto: number
}


