export interface FurPorAprobar{
  id: number,
  codigo:string,
  centroCosto: string,
  programa: string,
  razonSocial:string,
  producto: string,
  idMoneda_Proveedor: number,
  descripcion: string,
  cantidad: number,
  precioUnitarioMonedaOrigen: number,
  precioUnitarioDolares: number,
  precioTotalMonedaOrigen: number,
  precioTotalDolares: number,
  observaciones: string,
  idMonedaPagoReal: number,
  monedaPagoReal: string,
  idPersonalAreaTrabajo: number,
  fechaLimite: string|Date,
  furTipoPedido:string,
  usuarioSolicitud: string
}

export interface ParametrosAprobarFUR{
  idArea: number,
  codigo: string,
  idRol: number,
  tipo: number
}

export interface AprobarObservarFUR{
  ids:number [],
  usuario: string,
  idRol: number,
  checkedIsFurGeneral: number,
  isAprobar: boolean,
  observacion: string
}