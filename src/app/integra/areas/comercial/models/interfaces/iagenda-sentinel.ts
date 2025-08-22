export interface IAgendaSentinel {}

export interface IDetalleSentinel {
  datosGenerales: IDatosGenerales[];
  datosVencidas: IDatosVencidas[];
  deuda: IDeuda[];
  dniRuc: IDniRuc[];
  lineaCredito: ILineaCredito[];
  posicionHistoria: IPosicionHistoria[];
}
export interface IDatosGenerales {
  actividadEconomica: string;
  actividadEconomica2: string;
  actividadEconomica3: string;
  actvidadComercioExterior: string;
  asiento: string;
  ciiu: string;
  ciiu2: string;
  ciiu3: string;
  codigoActividadComerExt: string;
  codigoCondicionContribuyente: string;
  codigoDependencia: string;
  codigoEstadoContribuyente: string;
  codigoTipoContribuyente: string;
  condicionContribuyente: string;
  departamento: string;
  dependencia: string;
  digito: string;
  digitoAnterior: string;
  direccion: string;
  distrito: string;
  dni: string;
  estadoContribuyente: string;
  fechaActividad: Date;
  fechaBaja: Date;
  fechaConstitucion: Date;
  fechaCreacion: Date;
  fechaModificacion: Date;
  fechaNacimiento?: Date;
  folio: string;
  id: number;
  idSentinel: number;
  nombreComercial: string;
  partidaReg: string;
  patron: string;
  provincia: string;
  razonSocial: string;
  referencia: string;
  ruc: string;
  sexo: string;
  tipoContribuyente: string;
  tomo: string;
  ubigeo: string;
  usuarioCreacion: string;
  usuarioModificacion: string;
}
export interface IDeuda {
  calificacion: string;
  diasVencidos: number;
  fechaCreacion: Date;
  fechaModificacion: Date;
  fechaReporte: Date;
  id: number;
  idSentinel: number;
  montoDeuda: number;
  nombreRazonSocial: string;
  nroDoc: string;
  tipoDoc: string;
  usuarioCreacion: string;
  usuarioModificacion: string;
}

export interface IDniRuc {
  calificativo: string;
  condicionDomicilio: string;
  cuentasTarjetas: string;
  deudaCastigada: string;
  deudaDirecta: string;
  deudaImpagable: string;
  deudaIndirecta: string;
  deudaLaboral: string;
  deudaProtestos: string;
  deudaSbs: string;
  deudaTotal: string;
  deudaTributaria: string;
  documento: string;
  documento2: string;
  estadoDomicilio: string;
  fechaCreacion: Date;
  fechaInicioActividad: Date;
  fechaModificacion: Date;
  fechaProceso: Date;
  id: number;
  idSentinel: number;
  lineaCreditoNoUtilizada: string;
  nroBancos: string;
  peorCalificacion: string;
  porcentajeCalificacionNormal: string;
  razonSocial: string;
  reporteNegativo: string;
  score: string;
  semaforos: string;
  semanaActual: string;
  semanaPeorMejor: string;
  semanaPrevio: string;
  tipoActividad: string;
  tipoDocumento: string;
  totalRiesgo: string;
  usuarioCreacion: string;
  usuarioModificacion: string;
  veces24m: string;
  vencidoBanco: string;
}
export interface ILineaCredito {
  cnsEntNomRazLn: string;
  id: number;
  idSentinel: number;
  lineaCredito: number;
  lineaCreditoNoUtil: number;
  lineaUtil: number;
  numeroDocumento: string;
  tipoCuenta: string;
  tipoDocumento: string;
}
export interface IPosicionHistoria {
  afp: number;
  codigoVariacion: number;
  cuentaCorriente: number;
  descripcionSemaforo: string;
  descripcionVariacion: string;
  deudaCastigada: number;
  deudaDirecta: number;
  deudaIndirecta: number;
  deudaTotal: number;
  deudaTributaria: number;
  docImpuesto: number;
  fechaCreacion: Date;
  fechaModificacion: Date;
  fechaProceso: Date;
  id: number;
  idSentinel: number;
  lineaCreditoNoUtilizada: number;
  montoSbs: number;
  numeroDocumento: string;
  numeroEntidades: number;
  peorCalificacion: number;
  peroCalificacionDescripcion: string;
  porcentajeCalificacion: number;
  progresoRegistro: number;
  reporteNegativo: number;
  score: number;
  semanaActual: string;
  tarjetaCredito: number;
  tipoDocumento: string;
  usuarioCreacion: string;
  usuarioModificacion: string;
}
export interface IDatosVencidas {
  cantidad?: number;
  cantidadDocs?: number;
  diasVencidos?: number;
  entidad?: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  fuente?: string;
  id: number;
  idSentinel?: number;
  monto?: number;
  nroDocumento?: string;
  tipoDocumento?: string;
  usuarioCreacion: string;
  usuarioModificacion: string;
}
export interface ISentinelEstado {
  rpta: boolean;
  idSentinel: number;
  estado: boolean;
}
export interface INuevosDatosPerfilAlumno{
  idAlumno:number;
  idNuevo:number;
}
export interface INuevosDatosPerfilAlumnoResponsabilidad{
  idAlumno:number;
  descripcion:string;
}
export interface DataCredito {
  informacion: DataCreditoInformacion;
  tarjeta: TarjetaCredito[];
  credito: CreditoVigente[];
}
export interface DataCreditoInformacion {
  fechaUltimaActualizacion: Date;
  dni: string;
  nombreAlterno: string;
}
export interface TarjetaCredito {
  cnsEntNomRazLn: string;
  lineaCredito: number;
  lineaCreditoNoUtil: number;
  lineaUtil: number;
}
export interface CreditoVigente {
  nombreRazonSocial: string;
  montoDeuda: number;
  diasVencidos: number;
}
