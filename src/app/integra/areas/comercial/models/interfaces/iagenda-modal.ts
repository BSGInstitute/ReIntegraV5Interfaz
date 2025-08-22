export interface IAgendaModal {}
export interface ITiempoCapacitacion {
  lista: boolean;
  listaValidacion: boolean;
  record: number;
  recordValidado: number;
  records: { id: number; nombre: string }[];
}

export interface IPrerequisitoBeneficioCompetidor {
  beneficios: IBeneficioCompetidor[];
  competidores: { id: number; nombre: string }[];
  oportunidadCompetidor: IOportunidadCompetidor;
  prerequisitosEspecificos: IPreRequisitoOportunidad[];
  prerequisitosGenerales: IPreRequisitoOportunidad[];
}
export interface IBeneficioCompetidor {
  argumentos: {
    id: number;
    idPGeneral: number;
    nombre: string;
  }[];
  completado: string;
  id: number;
  nombre: string;
  respuesta: number;
  checked: boolean;
}
export interface IOportunidadCompetidor {
  completado: string;
  id: number;
  idOportunidad: number;
  otroBeneficio: string;
  respuesta: number;
}
export interface IPreRequisitoOportunidad {
  completado: string;
  idPrerequisito: number;
  prNombre: string;
  respuesta: number;
}
export interface IProblemaDetalle {
  argumentos: IArgumentoDetalle[];
  completado: string;
  idProblema: number;
  nombreProblema: string;
  respuesta: number;
  class?: string;
}
export interface IProblemaDetalleNuevaAgenda {
  argumentos: IArgumentoDetalleNuevaAgenda[];
  completado: string;
  idProblema: number;
  nombreProblema: string;
  respuesta: number;
  class?: string;
}
export interface IPresentacionArgumentoDetalle {
  argumentos: IArgumentoDetalle[];
  completado: string;
  idPresentacionArgumento: number;
  nombrePresentacionArgumento: string;
  respuesta: number;
  class?: string;
}
export interface IArgumentoDetallePresentacionArgumento {
  detalle: string;
  id: number;
  idProgramaGeneralPresentacionArgumento: number;
  solucion: string;
}
export interface IPresentacionArgumentoDetalleSolucion {
  detalle: string;
  id: number;
  idProgramaGeneralPresentacionArgumento: number;
  solucion: string;

}
export interface IProblemaDetalleSolucion {
  detalle: string;
  id: number;
  idProgramaGeneralProblema: number;
  solucion: string;
  solucionado: boolean;
  seleccionado: boolean;
}
export interface IArgumentoDetalle {
  detalle: string;
  id: number;
  idProgramaGeneralProblema: number;
  seleccionado: boolean;
  solucion: string;
  solucionado: boolean;
  flagSolucionado?: boolean;
  flagSeleccionado?: boolean;
}
export interface IArgumentoDetalleNuevaAgenda {
  detalle: string;
  id: number;
  idProgramaGeneralProblema: number;
  checkValor: boolean;
  cabecera: string;
  caso: string;
  flagCheckValor?: boolean;
}

export interface ICompetidorOportunidad {
  categoria: string;
  contenidoCompetidorVentajaDesventaja: string;
  costoNeto: number;
  duracionCronologica: number;
  empresa: string;
  id: number;
  idCompetidorVentajaDesventaja: number;
  idOportunidad: number;
  moneda: string;
  nombre: string;
  precio: number;
  regionCiudad: string;
  tipoCompetidorVentajaDesventaja: number;
}

export interface IMotivacionRespuestaEnvio{
  id?: number;
  idOportunidad: number;
  IdProgramaGeneralMotivacion: number;
  respuesta: number;
}
export interface IPublicoObjetivoRespuestaEnvio{
  id?: number;
  idOportunidad: number;
  idDocumentoSeccionPw: number;
  nivelCumplimiento: number;
}
export interface ICertificacionRespuestaEnvio{
  id?: number;
  idOportunidad: number;
  idProgramaGeneralCertificacion: number;
  respuesta: number;
}
export interface IPrerequisitoRespuestaEnvio{
   id?: number;
   idOportunidad: number;
   idProgramaGeneralPrerequisito: number;
   respuesta: number;
}
export interface IBeneficioRespuestaEnvio{
   id?: number;
   idOportunidad: number;
   IdProgramaGeneralBeneficio: number;
   respuesta: number;
}
export interface IProblemaDetalleSolucionRespuesta{
   id: number
   idOportunidad: number
   idProgramaGeneralProblemaDetalleSolucion: number
   esSeleccionado: boolean
   esSolucionado: boolean
}export interface IProblemaDetalleSolucionRespuestaNuevaAgenda{
  id: number
  idOportunidad: number
  idProgramaGeneralProblemaDetalleSolucion: number
  esCheckValor: boolean
}
export interface CorreoInteraccionV2 {
  id: number
  fechaCreacion: string
  categoria: string
  asunto: string
  correoReceptor: string
  correoRemitente: string
  idAlumno: number
  idPersonal: number
  messageId: string
  ultimaInteraccion: string
}