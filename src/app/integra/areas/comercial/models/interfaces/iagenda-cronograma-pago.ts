export interface ICronogramaPago {
  cronograma: ICronograma;
  montoPago: IMontoPagoOportunidad;
  vistaPortalWeb: string;
  estadoMatricula: string;
}
export interface ICronogramaPagoRespuesta {
  cronograma: ICronograma;
  vistaPortalWeb: string;
  idMatriculaCabecera: number;
}
export interface ICronograma {
  codigoMatricula?: string;
  detalle: IDetalleCronograma[];
  esAprobado: boolean;
  formula: number;
  id: number;
  idMoneda: number;
  idMontoPago?: number;
  idOportunidad?: number;
  idPersonal?: number;
  idTipoDescuento?: number;
  matriculaEnProceso: number;
  montosPago?: IMontoPagoCronograma[];
  nombrePlural?: string;
  precio: number;
  precioDescuento: number;
  tipoPersonal?: string;
  tiposDescuento: ITipoDescuentoCronograma[];
}
export interface IEnvioSms {
  idOportunidad: number;
  idAlumno: number;
  usuario: string;
}

export interface ITipoDescuentoCronograma {
  codigo: string;
  cuotasAdicionales: number;
  descripcion: string;
  formula: number;
  fraccionesMatricula: number;
  id: number;
  porcentajeCuotas: number;
  porcentajeGeneral: number;
  porcentajeMatricula: number;
  tipo: string;
}
export interface IMontoPagoCronograma {
  cuotaDoble?: boolean;
  cuotas?: number;
  cuotasAdicionales?: number;
  cuotasTipoPago?: number;
  formula?: number;
  fraccionesMatricula?: number;
  id?: number;
  idMoneda?: number;
  idPais?: number;
  idPrograma?: number;
  idTipoDescuento?: number;
  idTipoPago?: number;
  matricula?: number;
  montoDescontado?: number;
  nombre?: string;
  nombrePlural?: string;
  nroCuotas?: number;
  paquete?: number;
  porcentajeCuotas?: number;
  porcentajeGeneral?: number;
  porcentajeMatricula?: number;
  precio?: number;
  precioLetras?: string;
  primeraCuota?: string;
  vencimiento?: string;
  visibleWeb?: boolean;
}
export interface ITextoBeneficios {
  titulo: string;
  ordenBeneficio: number;
}
export interface IDetalleCronograma {
  id?: number;
  numeroCuota?: number;
  montoCuota?: number;
  fechaPago?: Date | string;
  cuotaDescripcion?: string;
  montoCuotaDescuento?: number;
  pagado?: boolean;
  idMontoPagoCronograma?: number;
  matricula?: boolean;
}
export interface IMontoPagoOportunidad {
  id: number;
  idOportunidad?: number;
  idMontoPago?: number;
  idPersonal?: number;
  precio: number;
  precioDescuento: number;
  idMoneda: number;
  idTipoDescuento?: number;
  esAprobado: number;
  nombrePlural: string;
  formula: number;
  matriculaEnProceso: number;
  codigoMatricula?: string;
}
export interface IPasarelaPago {
  id: number;
  idPais: number;
  idProveedor: number;
  nombre: string;
  prioridad: number;
}
export interface IMetodoPagoMatricula {
  id?: number;
  idMatriculaCabecera: number;
  idMedioPago: number;
  activo: boolean;
  usuario: string;
}
export interface ICodigoMatriculaPespecifico {
  codigoMatricula: string;
  pEspecifico: string;
  versionPrograma: string;
}

export interface ICodigoMatriculaPespecifico {
  datosEstructura: IDatosEstructuraEspecifica[];
  usuario: string;
}
export interface IDatosEstructuraEspecifica {
  id: number;
  idMatriculaCabecera: number;
  idPGeneralPadre: number;
  idPGeneralHijo: number;
  capitulo: IDatosEstructuraEspecificaCapitulo[];
  tarea: IDatosEstructuraEspecificaTarea[];
  encuesta: IDatosEstructuraEspecificaEncuesta[];
}
export interface IDatosEstructuraEspecificaCapitulo {
  id: number;
  numero: number;
  capitulo: string;
  idEstructuraEspecifica: number;
  sesion: IDatosEstructuraEspecificaSesion[];
}
export interface IDatosEstructuraEspecificaSesion {
  id: number;
  idCapitulo: number;
  numero: number;
  sesion: string;
  ordenSesion?: number;
  idEstructuraEspecifica: number;
  subSesion: IDatosEstructuraEspecificaSubSesion[];
}
export interface IDatosEstructuraEspecificaSubSesion {
  id: number;
  idSesion: number;
  numero: number;
  subSesion: string;
  idEstructuraEspecifica: number;
}
export interface IDatosEstructuraEspecificaTarea {
  id: number;
  idEstructuraEspecifica: number;
  nombreTarea: string;
  idTarea: number;
  ordenCapitulo: number;
  idDocumentoSeccionPw: number;
}
export interface IDatosEstructuraEspecificaEncuesta {
  id: number;
  idEstructuraEspecifica: number;
  idEncuesta: number;
  nombreEncuesta: string;
  ordenCapitulo: number;
  idDocumentoSeccionPw: number;
}

export interface ITipoDescuentoCronograma {
  codigo: string;
  cuotasAdicionales: number;
  descripcion: string;
  formula: number;
  fraccionesMatricula: number;
  id: number;
  porcentajeCuotas: number;
  porcentajeGeneral: number;
  porcentajeMatricula: number;
  tipo: string;
}
export interface IMontoPagoOportunidad {
  id: number;
  idOportunidad?: number;
  idMontoPago?: number;
  idPersonal?: number;
  precio: number;
  precioDescuento: number;
  idMoneda: number;
  idTipoDescuento?: number;
  esAprobado: number;
  nombrePlural: string;
  formula: number;
  matriculaEnProceso: number;
  codigoMatricula?: string;
}
export interface IPasarelaPago {
  id: number;
  idPais: number;
  idProveedor: number;
  nombre: string;
  prioridad: number;
}
export interface ICodigoMatriculaPespecifico {
  codigoMatricula: string;
  pEspecifico: string;
  versionPrograma: string;
}
export interface ICodigoMatriculaPespecifico {
  datosEstructura: IDatosEstructuraEspecifica[];
  usuario: string;
}
export interface IDatosEstructuraEspecifica {
  id: number;
  idMatriculaCabecera: number;
  idPGeneralPadre: number;
  idPGeneralHijo: number;
  capitulo: IDatosEstructuraEspecificaCapitulo[];
  tarea: IDatosEstructuraEspecificaTarea[];
  encuesta: IDatosEstructuraEspecificaEncuesta[];
}
export interface IDatosEstructuraEspecificaCapitulo {
  id: number;
  numero: number;
  capitulo: string;
  idEstructuraEspecifica: number;
  sesion: IDatosEstructuraEspecificaSesion[];
}
export interface IDatosEstructuraEspecificaSesion {
  id: number;
  idCapitulo: number;
  numero: number;
  sesion: string;
  ordenSesion?: number;
  idEstructuraEspecifica: number;
  subSesion: IDatosEstructuraEspecificaSubSesion[];
}
export interface IDatosEstructuraEspecificaSubSesion {
  id: number;
  idSesion: number;
  numero: number;
  subSesion: string;
  idEstructuraEspecifica: number;
}
export interface IDatosEstructuraEspecificaTarea {
  id: number;
  idEstructuraEspecifica: number;
  nombreTarea: string;
  idTarea: number;
  ordenCapitulo: number;
  idDocumentoSeccionPw: number;
}
export interface IDatosEstructuraEspecificaEncuesta {
  id: number;
  idEstructuraEspecifica: number;
  idEncuesta: number;
  nombreEncuesta: string;
  ordenCapitulo: number;
  idDocumentoSeccionPw: number;
}
export interface ICronograPagoEnvio {
  id?: number;
  idOportunidad?: number;
  idMontoPago?: number;
  idPersonal?: number;
  precio?: number;
  precioDescuento?: number;
  idMoneda?: number;
  idTipoDescuento?: number;
  esAprobado?: boolean;
  nombrePlural?: string;
  formula?: number;
  matriculaEnProceso?: number;
  codigoMatricula?: string;
  usuario?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  simboloMoneda?: string;
  codigoBancario?: string;
  idMedioPago?: number;
  listaDetalleCuotas?: IDetalleCronograma[];
}
export interface EliminarCronogramaRespuesta {
  cronograma: ICronograPagoEnvio;
  alumno: any;
  pEspecificoInformacion: PEspecificoInformacion;
}
interface PEspecificoInformacion {
  id: number;
  nombre: string;
  codigo: string;
  idCentroCosto?: number;
  estadoP: string;
  tipo: string;
  categoria: string;
  codigoBanco: string;
  ciudad: string;
  idProgramaGeneral: number;
}
export interface IMedioPagoActivoPasarela {
  idPasarelaPago: number;
  pasarelaNombre: string;
  medioPago: string;
  medioCodigo: string;
  imagen: string;
  idFormaPago: number;
}
export interface IRegistroPreProcesoPago {
  idMatriculaCabecera: number;
  idPasarelaPago: number;
  idAlumno: number;
  idFormaPago: number;
  medioPago: string;
  medioCodigo: string;
  webMoneda?: string;
  listaCuota?: IRegistroPreProcesoPagoCuota[];
}
export interface IProcesoPagoIvr {
 
  IdAlumno: number;
  IdTransaccionAuditoriaPago: number;
  IdPersonal: number;
  Celular: string;
  Anexo: string; 
}
export interface IRegistroPreProcesoPagoCuota {
  idCuota: number;
  nroCuota: number;
  tipoCuota: string;
  cuota: number;
  mora: number;
  moraCalculada: number;
  cuotaTotal: number;
  fechaVencimiento: Date;
  nombre: string;
  gestionCobranza?: number;
} 
export interface IRegistroTransaction {
  IdentificadorTransaccion?: string;
  IdTransaccionAuditoriaPago: number;
  Estado: boolean;
}