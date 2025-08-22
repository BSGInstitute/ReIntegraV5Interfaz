export interface SemaforoFinanciero {
  id: number;
  idPais: number;
  activo: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  usuario: string;
  detalle: Array<SemaforoFinancieroDetalle>;
}

export interface SemaforoFinancieroDetalle {
  id: number;
  idSemaforoFinanciero: number;
  nombre: string;
  mensaje: string;
  color: string;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  rowVersion: any;
  estado: boolean;
}
export interface ISemaforoSentinelAlumno {
  mensaje: string;
  color: string;
}
export interface IDatosSentinelAlumno {
  dni?: string;
  idSentinel?: number;
  tipoDocumento?: string;
  idAlumno?: number;
  nombre?: string;
  nombreAlterno?: string;
  apellidoPaterno?: null;
  apellidoMaterno?: null;
  sexo?: string;
  edad?: null;
  fechaNacimiento?: Date;
  ubigeo?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  rangosueldo?: null;
  rucEmpresa?: null;
  nombreEmpresa?: null;
  cargo?: null;
  ciiu?: string;
  actividadEconomica?: string;
  direccion?: string;
  semaforoActual?: string;
  semaforoPrevio?: string;
  fechaUltimaActualizacion?: string;
  lineaCredito?: ILineaCredito[];
  lineaDeuda?: ILineaDeuda[];
  lineaDeudaVencida?: ILineaDeuda[];
  sentinelValidado: boolean;
}

export interface ILineaCredito {
  id: number;
  idSentinel: number;
  tipoDocumento: string;
  numeroDocumento: string;
  cnsEntNomRazLn: string;
  tipoCuenta: string;
  lineaCredito: number;
  lineaCreditoNoUtil: number;
  lineaUtil: number;
}

export interface ILineaDeuda {
  tipoDocCPT?: string;
  nombreRazonSocial: string;
  calificacion?: string;
  montoDeuda: number;
  diasVencidos: number;
}
export interface IMoneda {
  valor: string;
}

