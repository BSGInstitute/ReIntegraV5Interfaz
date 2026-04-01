import { IComboBase1 } from '@shared/models/interfaces/iglobal';

export interface CombosModulo {
  producto: IComboBase1[];
  proveedor: Proveedor[];
  proveedorCurso: IComboBase1[];
  productoPresentacion: IComboBase1[];
  programaGeneral: IComboBase1[];
  centroCosto: IComboBase1[];
  modalidad: IComboBase1[];
  locacionTroncal: LocacionTroncal[];
  ambiente: Ambiente[];
  origen: IComboBase1[];
  locacion: Locacion[];
  expositor: IComboBase1[];
  frecuencia: IComboBase1[];
  estadoPEspecifico: IComboBase1[];
  personalAreaTrabajo: IComboBase1[];
  ciudad: IComboBase1[];
  ciudadBS: IComboBase1[];
  areaCapacitacion: AreaCapacitacion[];
  subAreaCapacitacion: SubAreaCapacitacion[];
  programaGeneralP: ProgramaGeneralP[];
  programaEspecifico: ProgramaEspecifico[];
  programaEspecificoHijos: ProgramaEspecificoHijo[];
  centroCostoP: CentroCostoP[];
  programaEspecificoWebinar: PespecificoWebinar[];
  plantillaCorreo: PlantillaCorreo[];
  plantillaWhatsApp: PlantillaWhatsApp[];
  tiempoFrecuencia: IComboBase1[];
  dias: IComboBase1[];
  periodoLectivo: IComboBase1[];
  ciclo: IComboBase1[];
}
interface PespecificoWebinar {
  id: number;
  nombre: string;
  modalidad: string;
  codigo: string;
}
export interface Proveedor {
  id: number;
  nombre: string;
  simbolo: string;
  nombreMoneda: string;
  precio: number;
  idProducto: number;
  presentacion: string;
  idHistorico: number;
  version: number;
}
export interface LocacionTroncal {
  id: number;
  nombre: string;
  idCiudad: number;
  codigoBS: number;
  denominacionBS: string;
}
export interface Ambiente {
  id: number;
  nombre: string;
  idLocacion: number;
  idCiudad: number;
}
interface Locacion {
  id: number;
  nombre: string;
  idCiudad: number;
}

interface AreaCapacitacion {
  id: number;
  nombre: string;
  idAreaCapacitacionFacebook?: number;
}

export interface SubAreaCapacitacion {
  id: number;
  nombre: string;
  idAreaCapacitacion: number;
}

export interface ProgramaGeneralP {
  id: number;
  nombre: string;
  idSubArea: number;
}

export interface ProgramaEspecifico {
  id: number;
  nombre: string;
  idProgramaGeneral: number;
}

export interface ProgramaEspecificoHijo {
  id: number;
  nombre: string;
  idProgramaGeneral: number;
}

export interface CentroCostoP {
  id: number;
  nombre: string;
  idPEspecifico: number;
}

interface PlantillaCorreo {
  id: string;
  nombre: string;
  idPlantillaBase: any;
  idTipoEnvio: number;
}

interface PlantillaWhatsApp {
  id: string;
  nombre: string;
  idPlantillaBase: any;
  idTipoEnvio: number;
}
export interface PEspecificoPadreIndividual {
  id: number;
  nombre: string;
  codigoBanco: string;
  codigo: string;
  idCentroCosto: number;
  estadoP: string;
  tipo: string;
  idProgramaGeneral: number;
  ciudad: string;
  estadoPId: number;
  tipoId: number;
  origenPrograma?: number;
  idCiudad: number;
  duracion?: string;
  actualizacionAutomatica?: string;
  idCursoMoodle?: number;
  cursoIndividual?: boolean;
  idExpositor_Referencia?: number;
  idAmbiente?: number;
  tipoAmbiente?: string;
  idTipoProgramaCarrera?: number;
  urlDocumentoCronograma?: string;
  urlDocumentoCronogramaM?: string;
  urlDocumentoCronogramaB?: string;
  urlDocumentoCronogramaI?: string;
  urlDocumentoCronogramaGrupos?: string;
  urlDocumentoCronogramaGruposM?: string;
  urlDocumentoCronogramaGruposB?: string;
  urlDocumentoCronogramaGruposI?: string;
  tipoSesion: string;
  idCursoMoodlePrueba?: number;
  tipoProgramaGeneral?: string;
  resumenClaseActivo?: boolean;
  tutorVirtualActivo?: boolean;
}
export interface InformacionPespecificoHijo {
  id: number;
  nombre: string;
  duracion: number;
  idCiudad?: number;
  tipoAmbiente: string;
  idAmbiente?: number;
  idExpositor_Referencia?: number;
  idProgramaGeneral?: number;
  fechaHoraInicio?: Date;
  idCentroCosto: number;
  idProveedor?: number;
  idPeriodoLectivo?: number;
  idCiclo?: number;
  idEstadoPEspecifico?: number;
  idModalidadCurso?: number;
  idCursoMoodle?: number;
  idCursoMoodlePrueba?: number;
  codigo: string;
  grupos: IComboBase1[];
  gruposEdicion: IComboBase1[];
  /* nuevas propiedades*/
  // estadoPEspecifico?: string;
  // modalidadCurso?: string;
  // proveedor?: string;
  // ambiente?: string;
  // ciudad?: string;
}
export interface DocenteAmbientePespecifico {
  id: number;
  idExpositor_Referencia?: number;
  idProveedor?: number;
  duracion: string;
  idAmbiente?: number;
  idPeriodoLectivo?: number;
  idCiclo?: number;
  idEstadoPEspecifico?: number;
  idModalidadCurso?: number;
  idCursoMoodle?: number;
  idCursoMoodlePrueba?: number;
}
export interface CruceSesionPEspecifico {
  id: number;
  idPEspecifico: number;
  curso: string;
  nombreCentroCosto: string;
  ambiente: string;
  expositor: string;
  proveedor: string;
  duracion: number;
  fechaHoraInicio: Date;
  fechaFin: Date;
  idAmbiente?: number;
  idExpositor?: number;
  idProveedor?: number;
}

export interface ParametrosInsertaFrecuencia {
  listaDetalles: PespecificoFrecuenciaDetalle[];
  listaDetallesWebinar: PespecificoFrecuenciaDetalle[];
  idPespecifico: number;
  fechaInicio: string;
  fechaFin?: string;
  idFrecuencia: number;
  fechaInicioWebinar?: string;
  idFrecuenciaWebinar: number;
  listaPEspecificos: number[];
  idTiempoFrecuencia?: number;
  valorTiempoFrecuencia?: number;
  idTiempoFrecuenciaCorreoConfirmacion?: number;
  valorFrecuenciaCorreoConfirmacion?: number;
  idTiempoFrecuenciaCorreo?: number;
  valorFrecuenciaCorreo?: number;
  idTiempoFrecuenciaWhatsapp?: number;
  valorFrecuenciaWhatsapp?: number;
  idPlantillaFrecuenciaCorreo?: number;
  idPlantillaFrecuenciaWhatsapp?: number;
  idPlantillaCorreoConfirmacion?: number;
  idTiempoFrecuenciaCorreoDocente?: number;
  valorFrecuenciaDocente?: number;
  idPlantillaDocente?: number;
  checkTiempoFrecuencia?: boolean;
  checkEnvioCorreo?: boolean;
  checkEnvioWhatsApp?: boolean;
  checkEnvioCorreoConfirmacion?: boolean;
  checkEnvioCorreoDocente?: boolean;
}
export interface PespecificoFrecuenciaDetalle {
  id?: number;
  idPespecificoFrecuencia?: number;
  diaSemana: number;
  horaDia: string;
  duracion: number;
}

export interface ConfigurarWebinar {
  codigo: string;
  id: number;
  idOperadorComparacionAvance: number;
  idOperadorComparacionPromedio: number;
  idPespecifico: number;
  idPespecificoPadre: number;
  modalidad: string;
  valorAvance: number;
  valorAvanceOpc: number;
  valorPromedio: number;
  valorPromedioOpc: number;
}

export interface CronogramaGrupo {
  id: number;
  fechaHoraInicio: Date;
  fechaHoraFin?: Date;
  duracion: number;
  duracionTotal: string;
  curso: string;
  idExpositor?: number;
  idProveedor?: number;
  // proveedor?: string;
  idAmbiente?: number;
  // ambiente?: string;
  idCiudad?: number;
  // ciudad?: string;
  pEspecificoHijoId: number;
  tipo: string;
  idModalidadCurso: number;
  // modalidad?: string;
  comentario: string;
  esSesionInicio: boolean;
  idCentroCosto: number;
  grupo: number;
  grupoSesion?: number;
  tieneFur?: number;
  mostrarPortalWeb?: boolean;
  color?: string;
  idCiclo?: number;
  idPeriodoLectivo?: number;
  idEstadoCurso?: number;
  idObservacion?: number;
  idPEspecificoSesionEstado?: number;
  idPEspecificoSesionEstadoObservacionDetalle?: number;
  reprogramacion:boolean;
}

export interface ProgramaEspecificoFUR {
  id: number;
  codigo: string;
  proveedor: string;
  producto: string;
  centroCosto: string;
  unidades: string;
  descripcion: string;
  ciudad: string;
  idProveedor: number;
  idProducto: number;
  idCentroCosto: number;
  idPersonalAreaTrabajo: number;
  idCiudad: number;
  idEmpresa?: number;
}
export interface DatosConfiguracionProgramasWebex {
  idPEspecifico: number;
  idTiempoFrecuencia: number;
  valor: number;
  idTiempoFrecuenciaCorreo: number;
  valorFrecuenciaCorreo: number;
  idPlantillaFrecuenciaCorreo: number;
  idTiempoFrecuenciaWhatsapp: number;
  valorFrecuenciaWhatsapp: number;
  idPlantillaFrecuenciaWhatsapp: number;
  idTiempoFrecuenciaCorreoConfirmacion: number;
  valorFrecuenciaCorreoConfirmacion: number;
  idPlantillaCorreoConfirmacion: number;
  idTiempoFrecuenciaCorreoDocente: number;
  valorFrecuenciaDocente: number;
  idPlantillaDocente: number;
  fechaInicio: Date;
  fechaFin?: Date;
  idFrecuencia: number;
}
export interface InformacionCronogramaSesiones {
  id: number;
  fechaHoraInicio: string;
  idExpositor?: number;
  idProveedor?: number;
  idAmbiente?: number;
  idModalidadCurso?: number;
  grupoSesion?: number;
  aplicarCambios: boolean;
  mostrarPortalWeb?: boolean;
  idEstadoCurso?: number;
  idObservacion?: number;
}

export interface PEspecificoPadreFrecuencia {
  id: number;
  idFrecuencia: number;
  idPespecifico: number;
  idTiempoFrecuencia: number;
  nota: string;
  sesiones: PEspecificoPadreFrecuenciaSesion[];
}

export interface PEspecificoPadreFrecuenciaSesion {
  id: number;
  idPespecificoPadreFrecuencia: number;
  sesion: number;
  idDiaSemana: number;
  nombre?: string;
  horaInicio: Date | string;
  horaFin: Date | string;
  duracion: number;
  delete: boolean;
}

export interface CentroCostoGenerado {
  centroCosto: CentroCosto;
  codigo: string;
  nombreProgramaEspecifico: string;
  nombreProgramaGeneral: string;
  codigoBanco: string;
}

export interface CentroCosto {
  id: number;
  idArea?: number;
  idSubArea?: number;
  idPgeneral: string;
  nombre: string;
  codigo: string;
  idAreaCc?: string;
  ismtotales?: number;
  icpftotales?: number;
}

export interface RegistroProgramaEspecifico {
  id: number;
  nombre: string;
  codigo: string;
  idCentroCosto?: number;
  estadoP: string;
  tipo: string;
  idProgramageneral?: number;
  ciudad: string;
  urlDocumentoCronograma: string;
  cursoIndividual?: boolean;
}
export interface FiltroInsertarPEspecifico {
  pespecifico: Pespecifico;
  centroCosto?: CentroCosto;
  idCiudad: number;
  idPespecificoAdicional?: number;
}

export interface Pespecifico {
  id: number;
  nombre: string;
  codigo?: string;
  idCentroCosto?: number;
  frecuencia?: string;
  estadoP: string;
  tipo: string;
  tipoAmbiente?: string;
  categoria?: string;
  idProgramaGeneral?: number;
  ciudad: string;
  fechaInicio?: Date;
  fechaTermino?: Date;
  fechaInicioV?: string;
  fechaTerminoV?: string;
  codigoBanco?: string;
  fechaInicioP?: string;
  fechaTerminoP?: string;
  frecuenciaId?: number;
  estadoPid?: number;
  tipoId?: number;
  categoriaId?: number;
  origenPrograma?: number;
  idCiudad?: number;
  coordinadoraAcademica?: string;
  coordinadoraCobranza?: string;
  duracion?: string;
  idTipoProgramaCarrera?: number;
  actualizacionAutomatica?: string;
  idCursoMoodle?: number;
  cursoIndividual?: boolean;
  idSesionInicio?: number;
  idExpositorReferencia?: number;
  idAmbiente?: number;
  urlDocumentoCronograma?: string;
  idEstadoPespecifico?: number;
  urlDocumentoCronogramaGrupos?: string;
  idTroncalPartner?: number;
  idCursoMoodlePrueba?: number;
  idCursoRa?: number;
  idProveedor?: number;
  idProveedorCalificaProyecto?: number;
  observacionCursoFinalizado?: string;
  idCiclo? :number;
  idPeriodoLectivo?: number;
  resumenClaseActivo?: boolean;
  tutorVirtualActivo?: boolean;
}
export interface GenerarPDFEnvio {
  idPespecifico: number;
  cursoIndividual: boolean;
  cursoNombre: string;
  grupo: number;
  sesion: PespecificoSesionCompuesto[];
}
export interface PespecificoSesionCompuesto {
  id: number;
  idPespecifico?: number;
  pEspecificoHijoId?: number;
  fechaHoraInicio: Date | string;
  duracion?: number;
  duracionTotal?: number;
  idExpositor?: number;
  idProveedor?: number;
  idCiudad?: number;
  comentario: string;
  curso: string;
  tipo: string;
  modalidadSesion: string;
  sesionAutoGenerada?: boolean;
  idAmbiente?: number;
  predeterminado?: boolean;
  esSesionInicial?: boolean;
  cruce?: boolean;
  mostrarPDF?: boolean;
}
export interface PEspecificoConsumo {
  idCentroCosto: number;
  idPespecificoSesion: number;
  idPespecifico: number;
  idHistoricoProductoProveedor: number;
  idProducto: number;
  idProveedor: number;
  cantidad: number;
  factor: string;
  semana: number;
  areaTrabajo: number;
  fechaHoraInicio: Date | string;
  ciudad: number;
  idEmpresa: number;
}
export interface EmpresaAutorizadaCombo {
  readonly id: number;
  readonly razonSocial: string;
  readonly ruc: string;
  readonly direccion: string;
  readonly central: string;
}
export interface InformacionPespecificoSesion {
  id: number;
  idPespecifico: number;
  fechaHoraInicio: Date | string;
  duracion: number;
  idExpositor?: number;
  comentario: string;
  sesionAutoGenerada: boolean;
  idAmbiente?: number;
  predeterminado?: boolean;
  grupo: number;
  grupoSesion?: number;
  idPEspecificoSesionEstado?: number;
  reprogramacion?: boolean;
}
export interface ReprogramarSesion {
  idPespecifico: number;
  fechaHoraInicio: Date | string;
  duracion: number;
  idExpositor?: number;
  idAmbiente?: number;
  comentario: string;
  grupo: number;
  grupoSesion: number;
  idModalidadCurso?: number;
}
export interface FiltroSesionEspecial {
  pEspecificoPadreId: number;
  nombre: string;
  fecha: Date | string;
  duracion: number;
  grupo: number;
}
export interface FurPrograma{
   idPespecifico: number;
   idHistoricoProductoProveedor: number;
   idProducto: number;
   idProveedor: number;
   cantidad: number;
   factor: string;
   areaTrabajo: number;
   ciudad: number;
   idEmpresa: number;
}
export interface FurProgramaFiltro{
   id: number;
   idProducto: number;
   idProveedor: number;
   factor?: string;
   cantidad: number;
   areaTrabajo: number;
   semana: number;
   ciudad: number;
   idEmpresa:number;
}
