import { IComboBase1 } from '@shared/models/interfaces/iglobal';
export interface Pgeneral {
  id: number;
  idPgeneral: number;
  nombre: string;
  pwImgPortada: string;
  pwImgPortadaAlf: string;
  pwImgSecundaria?: string;
  pwImgSecundariaAlf?: string;
  idPartner: number;
  idArea: number;
  idSubArea: number;
  idCategoria: number;
  pwEstado: string;
  pwMostrarBsplay: string;
  pwDuracion: string;
  idBusqueda?: number;
  idChatZopim?: number;
  pgTitulo: string;
  codigo: string;
  urlImagenPortadaFr?: string;
  urlBrochurePrograma: string;
  urlPartner?: string;
  urlVersion?: string;
  pwTituloHtml: string;
  esModulo?: boolean;
  nombreCorto?: string;
  idPagina: number;
  chatActivo: number;
  tutorVirtualActivo: boolean;
  pwDescripcionGeneral: string;
  tieneProyectoDeAplicacion: boolean;
  idTipoPrograma: number;
  codigoPartner: string;
  logoPrograma: string;
  urlLogoPrograma: string;
  fechaInicioAsincronico?: Date | string;
  asignaVenta?: boolean;
  tieneCertificadoModular: boolean;
  certificadoRequierePago: boolean;
  idPgeneralBase?: number;
  idPgeneralPeriodoAsincronico: number;
  creditosTeoricos: number;
  creditosPracticos: number;
  creditosTotales: number;
  horasTeoricas: number;
  horasPracticas: number;
  horasTotales: number;
  idTipoProgramaCarrera: number;
}

export interface CombosModulo {
  areaCapacitacion: AreaCapacitacion[];
  subAreaCapacitacion: SubAreaCapacitacion[];
  parametroSeo: ParametroSeo[];
  partnerPw: IComboBase1[];
  certificadoPartnerComplemento: IComboBase1[];
  expositor: IComboBase1[];
  categoriaPrograma: IComboBase1[];
  visualizacionBsPlay: IComboBase1[];
  titulo: IComboBase1[];
  cargo: IComboBase1[];
  areaFormacion: IComboBase1[];
  areaTrabajo: IComboBase1[];
  industria: IComboBase1[];
  ciudad: IComboBase1[];
  categoriaOrigenConHijos: CategoriaOrigenConHijo[];
  tipoDato: IComboBase1[];
  pGeneral: IComboBase1[];
  perfilContactoProgramaColumna: IComboBase1[];
  modalidadCurso: IComboBase1[];
  paginaWebPw: IComboBase1[];
  versionPrograma: IComboBase1[];
  moduloPrograma: IComboBase1[];
  cicloPrograma: IComboBase1[];
  tipoPrograma: IComboBase1[];
  proveedor: IComboBase1[];
  pGeneralPeriodoAsincronico: PGeneralPeriodoAsincronico[];

}
// export interface VersionPrograma {
//   id: number;
//   nombre: string;
//   // duracion?: number;
// }

export interface CombosModuloMontoPago {
  areaCapacitacion: AreaCapacitacion[];
  subAreaCapacitacion: SubAreaCapacitacion[];
  tipoDescuento: TipoDescuento[];
  pais: Pais[];
  moneda: Moneda[];
  categoriaPrograma: IComboBase1[];
  suscripcionProgramaGeneral: IComboBase1[];
  tipoPago: TipoPago[];
  plataformaPago: IComboBase1[];
}

export interface AreaCapacitacion {
  id: number;
  nombre: string;
  idAreaCapacitacionFacebook?: number;
}

export interface SubAreaCapacitacion {
  id: number;
  nombre: string;
  idAreaCapacitacion: number;
}

export interface TipoDescuento {
  id: number;
  codigo: string;
  descripcion: string;
}

export interface Pais {
  id: number;
  nombre: string;
  moneda: string;
}

export interface Moneda {
  id: number;
  nombre: string;
  nombreCorto: string;
  nombrePlural: string;
  simbolo: string;
  idPais: number;
}
export interface TipoPago {
  id: number;
  nombre: string;
  cuotas: number;
}
export interface Modalidad {
  codigo: string;
  id: number;
  nombre: string;
}
export interface ParametroSeo {
  id: number;
  nombre: string;
  numeroCaracteres: number;
}
export interface CategoriaOrigenConHijo {
  categoriaOrigen: IComboBase1;
  subCategoriaFormulario: SubCategoriaFormulario[];
}

export interface SubCategoriaFormulario {
  idSubCategoria: number;
  idTipoFormulario: number;
  nombreTipoFormulario: string;
}

export interface PGeneralPeriodoAsincronico {
  id: number;
  nombre: string;
  periodo: number;
}
export interface CursoRelacionado {
  id: number;
  idRelacionado: number;
  nombre: string;
}

export interface PgeneralProyectoAplicacionAnexo {
  id: number;
  idPgeneral: number;
  nombreArchivo: string;
  rutaArchivo: string;
  esEnlace: boolean;
  soloLectura: boolean;
}
/* #region Interface Detalle Programas*/
export interface DetalleProgramas {
  parametrosSeo: ParametrosSeoPgeneral[];
  // descripcionesGenerales: DescripcionGeneral[];
  // descripcionesAdicionales: AdicionalPGeneral[];
  expositores: number[];
  preRequisitos: number[];
  modalidad: number[];
  proveedor: number[];
  //!No utilizado
  // programaAreasRelacionadas: number[];
  // suscripciones: SuscripcionPgeneral[];
  configuracionBeneficio: ConfiguracionBeneficio[];
  configuracionPlantilla: ConfiguracionPlantilla[];
  configuracionPlantillaConstancia: ConfiguracionPlantilla[];
  montoPago: MontoPago[];
  pgeneralVersionPrograma: PgeneralVersionPrograma[];
  pgeneralCodigoPartner: PgeneralCodigoPartner[];
  pespecificoCodigoPartner: PEspecificoCodigoPartner[];
  pgeneralProyectoAplicacion: PgeneralProyectoAplicacion[];
  pgeneralForoAsignacionProveedor: PGeneralForoAsignacionProveedor[];
  pgeneralFechaInicioOnline?: PgeneralFechaInicioOnline[];
  pgeneralFechaInicioAonline?: PgeneralFechaInicioAonline[];
  pgeneralFechaInicioPresencial?: PgeneralFechaInicioPresencial[];
  cambioPGeneralForoAsignacion?: boolean;
  docentes: number[];
}
export interface PgeneralFechaInicioOnline {
  idProgramaGeneral: number;
  fechaHoraInicio: Date | string;
}
export interface PgeneralFechaInicioAonline {
  idPGeneral: number;
  actulizarFechaInicioAonline: number;
  fechaHoraInicio?: Date | string;
  fechaInicioAsincronico?: Date | string;
}
export interface PgeneralFechaInicioPresencial {
  idPGeneral: number;
  fechaHoraInicio?: Date | string;
}
export interface PgeneralCodigoPartner {
  id: number;
  codigo: string;
  modalidadesCurso: number[];
  versionesPrograma: number[];
  pdu: number;
}
export interface DescripcionGeneral {
  id?: number;
  idPgeneral?: number;
  texto: string;
}
export interface AdicionalPGeneral {
  id: number;
  idPgeneral: number;
  descripcion?: string;
  nombreImagen?: string;
  idTitulo?: number;
  nombreTitulo: string;
}
export interface SuscripcionPgeneral {
  id?: number;
  idPgeneral: number;
  titulo: string;
  descripcion: string;
  ordenBeneficio?: number;
}
export interface ParametrosSeoPgeneral {
  id: number;
  idPgeneral: number;
  nombreParametroSeo: string;
  idParametroSeo: number;
  descripcion: string;
}
export interface ConfiguracionPlantilla {
  id: number;
  idPlantillaFrontal: number;
  idPlantillaPosterior?: number;
  idPlantillaBase: number;
  ultimaFechaRemplazarCertificado?: Date | string;
  remplazarCertificados: boolean;
  detalle: ConfiguracionPlantillaDetalle[];
  nombrePlantillaFrontal: string;
  nombrePlantillaPosterior: string;
}
export interface ConfiguracionPlantillaDetalle {
  id?: number;
  idPgeneralConfiguracionPlantilla: number;
  idModalidadCurso: number;
  idOperadorComparacion?: number;
  notaAprobatoria?: number;
  deudaPendiente: boolean;
  estadosMatricula: number[];
  subEstadosMatricula: number[];
}
export interface ConfiguracionBeneficio {
  id: number;
  idPGeneral: number;
  idBeneficio: number;
  tipoBeneficio: number;
  descripcion: string;
  estadosMatricula: number[]
  subEstadosMatricula: number[]
  paises: number[]
  versiones: number[]
  datosAdicional: number[];
  entrega: number;
  asosiar: boolean;
  deudaPendiente: boolean;
  avanceAcademico: number;
  ordenBeneficio: number;
  datosAdicionales: boolean;
  disabledEditar: boolean
}
export interface PgeneralSubEstadoMatricula {
  id: number;
  idSubEstadoMatricula: number;
  idConfiguracionBeneficioPGneral?: number;
}
export interface PgeneralVersion {
  id: number;
  idConfiguracionBeneficioPgneral: number;
  idVersionPrograma?: number;
  idModalidadCurso?: number;
}
export interface PgeneralPais {
  id: number;
  idPais: number;
  idConfiguracionBeneficioPgneral: number;
}
export interface PgeneralEstadoMatricula {
  id: number;
  idEstadoMatricula: number;
  idConfiguracionBeneficioPGneral?: number;
}
export interface DatoAdicional {
  id: number;
  idConfiguracionBeneficioPgeneral: number;
  idBeneficioDatoAdicional: number;
}
export interface PgeneralVersionPrograma {
  id: number;
  idPgeneral: number;
  idPgeneralVersionPrograma: number;
  idVersionPrograma: number;
  nombreVersion: string;
  duracion: number;
  idModalidadCurso?: number;
  creditoDisponibleTutorVirtual: number;
  cantidadWebinarAsignado: number;
  cantidadMesAccesoAdicionalWebinar: number;
}

export interface PgeneralProyectoAplicacion {
  id: number;
  modalidades: number[];
  proveedores: number[];
}

export interface PGeneralProyectoAplicacionModalidad {
  id: number;
  idPgeneralProyectoAplicacion: number;
  idModalidadCurso: number;
}

export interface PGeneralProyectoAplicacionProveedor {
  id: number;
  idPgeneralProyectoAplicacion: number;
  idProveedor: number;
}

export interface PGeneralForoAsignacionProveedor {
  idModalidadCurso: number;
  proveedores: number[];
}
/* #endregion Interface Detalle Programas*/


export interface PgeneralModalidad {
  id?: number;
  idPgeneral: number;
  idModalidadCurso: number;
}
/* #region DetalleMontoPago*/
export interface DetalleMontoPago {
  suscripciones: IComboBase1[];
  tipoCategoria: IComboBase1[];
  montoPagos: MontoPago[];
}
export interface MontoPago {
  id: number;
  precio: number;
  precioLetras: string;
  idMoneda: number;
  matricula: number;
  cuotas: number;
  nroCuotas: number;
  idTipoDescuento: number;
  idPrograma: number;
  idTipoPago: number;
  idPais: number;
  vencimiento: string;
  primeraCuota: string;
  cuotaDoble: boolean;
  descripcion: string;
  visibleWeb: boolean;
  paquete: number;
  porDefecto: boolean;
  montoDescontado: number;
  plataformasPagos: number[];
  suscripcionesPagos: number[];
}
/* #endregion DetalleMontoPago */
/* #region CombosPlantilla */
export interface CombosConfiguracionPlantilla {
  plantilaCertificadoConstancia: PlantilaCertificadoConstancum[];
  modalidadCurso: IComboBase1[];
  estadoMatricula: IComboBase1[];
  operadorComparacion: IComboBase1[];
  subEstadoMatricula: SubEstadoMatricula[];
  pais: IComboBase1[];
  beneficioDatoAdicional: IComboBase1[];
}
export interface PlantilaCertificadoConstancum {
  id: number;
  nombre: string;
  idPlantillaBase: number;
}
export interface SubEstadoMatricula {
  id: number;
  nombre: string;
  idEstadoMatricula: number;
}
/* #endregion CombosPlantilla*/
export interface EsquemaAsociado {
  id: number;
  idEsquemaEvaluacion: number;
  idPgeneral: number;
  fechaInicio?: string | Date;
  fechaFin: string | Date;
  esquemaPredeterminado: boolean;
  esquema: string;
  listadoModalidad: number[];
  modalidadMostrar: string;
  listadoProveedor: number[];
}

export interface DetalleCriterioEvaluacion {
  id: number
  idCriterioEvaluacion: number
  nombreCriterioEvaluacion: string
  nombre: string
  urlArchivoInstrucciones?: string
  idProveedor?: number
}

export interface AsociarTagPrograma {
  id: number
  idPgeneral: number
  nombre: string
  pwImgPortada: any
  pwImgPortadaAlf: any
  pwImgSecundaria: any
  pwImgSecundariaAlf: any
  idPartner: number
  idArea: number
  idSubArea: number
  idCategoria: number
  pwEstado: any
  pwMostrarBsplay: any
  pwDuracion: any
  idBusqueda: number
  idChatZopim: any
  pgTitulo: any
  codigo: string
  urlImagenPortadaFr: string
  urlBrochurePrograma: string
  urlPartner: string
  urlVersion: string
  pwTituloHtml: any
  esModulo: any
  nombreCorto: any
  idPagina: number
  chatActivo: number
}
//CRITERIOS DE EVALUACION

export interface EsquemaEvaluacionDetalleCompuesto {
  id: number;
  idEsquemaEvaluacion: number;
  idCriterioEvaluacion: number;
  nombreCriterioEvaluacion: string;
  ponderacion: number;
}
export interface EsquemaEvaluacionPgeneralDetalleCompuesto {
  id?: number;
  idCriterioEvaluacion: number;
  nombre: string;
  urlArchivoInstrucciones: string;
  idProveedor?: number;
  nombreCriterioEvaluacion?: string; //!No se envia al registrar
}
export interface DetalleEsquemaAsignado {
  idCriterioEvaluacion: number;
  detalle: EsquemaEvaluacionPgeneralDetalleCompuesto[]
  nombreCriterioEvaluacion?: string
}
export interface EsquemaEvaluacionRegistrarAsignacion {
  id: number;
  idEsquemaEvaluacion: number;
  idModalidad: number[];
  idProveedor: number[];
  idPGeneral: number;
  fechaInicio: string;
  fechaFin?: string;
  esquemaPredeterminado: boolean;
  listadoDetalleAsignacion: EsquemaEvaluacionPgeneralDetalleCompuesto[];
}
export interface PgeneralCriterioEvaluacionHijo {
  id: number;
  idPgeneral: number;
  considerarNota: boolean;
  porcentaje: number;
  idModalidadCurso: number;
  idTipoPromedio: number;
}

export interface PGeneralCriterioEvaluacion {
  id: number;
  idPgeneral: number;
  idModalidadCurso: number;
  nombre?: string;
  porcentaje: number;
  idCriterioEvaluacion: number;
  idTipoPromedio: number;
}
export interface PGeneralCursoCriterioHijo {
  id: number;
  idProgramaGeneralHijo: number;
  nombre: string;
  considerarNota: boolean;
  idPGeneral_Padre: number;
  porcentaje: number;
  idModalidadCurso: number;
  idCriterioEvaluacion: number;
  esCurso: number;
}
export interface PlantillaDocumentoAsociado {
  idDocumentos: number;
  nombre: string;
  idPlantillaPW: number;
  estadoFlujo: number;
  asignado: boolean;
  idPGeneralDocumento: number;
}
export interface PlantillaDocumentoNoAsociado {
  idDocumentos: number;
  nombre: string;
  idPlantillaPW: number;
  estadoFlujo: number;
  asignado: boolean;
}
export interface PgeneralEnvio {
  [x: string]: {};
  pgeneral: Pgeneral
  detallesProgramaGeneral: DetalleProgramas
  fechaAsincronicaNueva: number
}

/*#region CONFIGURACION CLIENTE*/
export interface BeneficioPreRequisitoDTO {
  beneficios: CompuestoBeneficioModalidadAlternoDTO[];
  preRequisitos: CompuestoPreRequisitoModalidadDTO[];
  motivaciones: CompuestoMotivacionModalidadAlternoDTO[];
  certificaciones: CompuestoCertificacionModalidadDTO[];
  problemas: CompuestoProblemaModalidadAlternoDTO[];
  modelos: CompuestoProblemaModeloCertificadoDTO[];
  argumentos: CompuestoPresentacionArgumentoModalidadAlternoDTO[];
}
export interface CompuestoBeneficioModalidadAlternoDTO {
  idBeneficio: number;
  idPGeneral: number;
  nombreBeneficio: string;
  beneficiosArgumentos: ComboDTO[];
  modalidades: ModalidadCursoAlternoDTO[];
}
export interface ComboDTO {
  id: number;
  nombre: string;
}
export interface ModalidadCursoAlternoDTO {
  id: number | null;
  nombre: string | null;
  idModalidadCurso: number;
}
export interface CompuestoPreRequisitoModalidadDTO {
  idPreRequisito: number;
  idPGeneral: number;
  nombrePreRequisito: string;
  orden: number;
  tipo: number;
  modalidades: ModalidadCursoProblemaDTO[];
}
export interface ModalidadCursoProblemaDTO {
  id: number | null;
  nombre: string | null;
  idModalidad: number;
}
export interface CompuestoMotivacionModalidadAlternoDTO {
  idMotivacion: number;
  idPGeneral: number;
  nombreMotivacion: string;
  motivacionesArgumentos: ComboDTO[];
  modalidades: ModalidadCursoAlternoDTO[];
}
export interface CompuestoCertificacionModalidadDTO {
  idCertificacion: number;
  idPGeneral: number;
  nombreCertificacion: string;
  certificacionesArgumentos: ComboDTO[];
  modalidades: ModalidadCursoAlternoDTO[];
}
export interface CompuestoProblemaModalidadAlternoDTO {
  idProblema: number;
  idPGeneral: number;
  nombreProblema: string;
  esVisibleAgenda: boolean;
  problemasArgumentos: ProblemaDetalleSolucionAlternoDTO[];
  modalidades: ModalidadCursoAlternoDTO[];
}
export interface CompuestoProblemaModeloCertificadoDTO {
  idModeloCertificado: number;
  idPGeneral: number;
  nombreModeloCertificado: string;
  urlModeloCertificado: string;
  modalidades: ModalidadCursoAlternoDTO[];
}
export interface CompuestoModeloCertificadoModalidadDTO {
  idModeloCertificado: number;
  idPGeneral: number;
  nombreModeloCertificado: string;
  modalidades: string;
  urlAnterior: string;
  files: File;
}

export interface ProblemaDetalleSolucionAlternoDTO {
  id: number | null;
  detalle: string;
  solucion: string;
}

export interface CompuestoPreRequisitoModalidadAlternaDTO {
  idPreRequisito: number;
  idPGeneral: number;
  nombrePreRequisito: string | null;
  orden: number;
  tipo: number;
  modalidades: ModalidadCursoProblemaDTO[];
}

export interface CompuestoBeneficioModalidadDTO {
  idBeneficio: number;
  idPGeneral: number;
  nombreBeneficio: string;
  beneficiosArgumentos: ComboDTO[];
  modalidades: ModalidadCursoProblemaDTO[];
}
export interface CompuestoMotivacionModalidadDTO {
  idMotivacion: number;
  idPGeneral: number;
  nombreMotivacion: string;
  motivacionesArgumentos: ComboDTO[];
  modalidades: ModalidadCursoProblemaDTO[];
}
export interface CompuestoProblemaModeloCertificadoDTO {
  idModeloCertificado: number;
  idPGeneral: number;
  nombreModeloCertificado: string;
  urlModeloCertificado: string;
  modalidades: ModalidadCursoAlternoDTO[];
}
export interface CompuestoProblemaModalidadDTO {
  idProblema: number;
  idPGeneral: number;
  nombreProblema: string | null;
  esVisibleAgenda: boolean;
  problemasArgumentos: ProgramaGeneralProblemaArgumentoDetalleSolucionDTO[] | null;
  modalidades: ModalidadCursoProblemaDTO[] | null;
}
export interface ProgramaGeneralProblemaArgumentoDetalleSolucionDTO {
  id: number | null;
  detalle: string | null;
  solucion: string | null;
}
/*#endregion*/
export interface FormDatosWeb {
  tipoProgramaCarrera: number;
  horasTeoria: number;
  horasPractica: number;
  horasTotal: number;
  preRequisitos: number[];
  creditosTeoricos: number;
  creditosPracticos: number;
  creditosTotales: number;
  duracion: string;
  mostrarBsPlay: string;
  versiones: number[];
  expositores: number[];
  urlBrochure: string;
  publicacionWeb: number;
  onlineAsincronica: number;
  onlineSincronica: string;
  presencial: string;
  // areasRelacion: null,
}
export interface FormConfiguracionBase {
  nombrePrograma: string;
  area: number;
  partner: number;
  codigoRegistroPartner: string;
  esChatActivo: boolean;
  esTutorVirtualActivo: boolean;
  tieneProyectoAplicacionPractica: boolean;
  fotoPrograma: any;
  urlFoto: string;
  otorgarCertificadoModular: boolean;
  categoria: number;
  subArea: number;
  centroCostos: string;
  tipoPrograma: number;
  modalidades: number[];
  requierePagoCertificado: boolean;
  proveedores: number[];
  docentes: number[]
}
export interface FormParametroSeo {
  parametrosSeo: ParametrosSeoPgeneral[];
  imgPortada: string;
  url: string;
  imgPortadaAlt: string;
  nombreWebHTML: string;
  descripcionGeneral: string;
}


//ProgramaGeneralPresentacionArgumento
export interface CompuestoPresentacionArgumentoModalidadAlternoDTO {
  idPresentacionArgumento: number;
  idPGeneral: number;
  nombrePresentacionArgumento: string;
  esVisibleAgenda: boolean;
  problemasArgumentosPresentacionArgumento: PresentacionArgumentoDetalleSolucionAlternoDTO[];
  modalidades: ModalidadCursoAlternoDTO[];
}
export interface CompuestoPresentacionArgumentoModalidadDTO {
  idPresentacionArgumento: number;
  idPGeneral: number;
  nombrePresentacionArgumento: string;
  descripcionPresentacionArgumento: string;
  esVisibleAgenda: boolean;
  presentacionArgumento: ProgramaGeneralProblemaArgumentoDetalleSolucionDTO[] | null;
  modalidades: ModalidadCursoProblemaDTO[] | null;
}
export interface PresentacionArgumentoDetalleSolucionAlternoDTO {
  id: number | null;
  detalle: string;
  solucion: string;
}

export interface PEspecificoComboPartner {
  id: number;
  nombre: string;
  idPGeneral: number;
  fechaInicio: Date;
}
export interface PEspecificoCodigoPartner {
  id?: number;
  idPespecifico?: number;
  codigo?: string;
  pdu?: number;
  fechaInicio?: Date;
}


export interface PEspecificoByPGeneral {
  idPEspecifico: number;
  nombrePEspecifico: string;
  idPGeneral: number;
}



export interface PGeneralArgumentoMotivacion {
  id: number;
  nombre: string;
}