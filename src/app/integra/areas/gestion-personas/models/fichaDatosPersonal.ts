import { IComboBase1 } from '@shared/models/interfaces/iglobal';
export interface FichaDatosPersonal {
  id: number;
  nombre: string;
  apellidos: string;
  rol: string;
  email: string;
  activo: boolean;
}
export interface FichaDatosPersonalCombo {
  listaCiudad: CiudadDatosDTO[];
  listaPais: IComboBase1[];
  listaEstadoCivil: IComboBase1[];
  listaSexo: IComboBase1[];
  listaTipoDocumento: IComboBase1[];
  listaSistemaPensionario: EntidadSistemaPensionario[];
  listaEntidad: IComboBase1[];
  listaMotivoCese: IComboBase1[];
  listaEntidadSeguroSalud: IComboBase1[];
  listaCentroEstudio: IComboBase1[];
  listaTipoEstudio: IComboBase1[];
  listaAreaFormacion: IComboBase1[];
  listaEstadoEstudio: IComboBase1[];
  listaNivelEstudio: NivelEstudio[];
  listaIdioma: IComboBase1[];
  listaNivelIdioma: IComboBase1[];
  listaEmpresa: IComboBase1[];
  listaAreaTrabajo: IComboBase1[];
  listaCargo: IComboBase1[];
  listaParentesco: IComboBase1[];
  listaTipoSangre: TipoSangre[];
  listaPuestoTrabajo: IComboBase1[];
  listaSedeTrabajo: IComboBase1[];
  listaPersonalAreaTrabajo: areaTrabajoDTO[];
  listaPersonal: IComboBase1[];
  listaPersonalAsesorAsociado: IComboBase1[];
  listaTipoPagoRemuneracion: IComboBase1[];
  listaEntidadFinanciera: EntidadFinanciera[];
  listaContratoEstado: IComboBase1[];
  listaMotivoInactividad: IComboBase1[];
  listaPuestoTrabajoNivel: IComboBase1[];
  listaCategoriaAsesor: IComboBase1[];
  listaNivelCompetenciaTecnica: IComboBase1[];
}

export interface CiudadDatosDTO {
  id: number;
  idCiudad: number;
  nombre: string;
  idPais: number;
}

export interface EntidadSistemaPensionario {
  id: number;
  nombre: string;
  idSistemaPensionario: number;
}

export interface NivelEstudio {
  id: number;
  nombre: string;
  idTipoFormacion: number;
  tipoFormacion: string;
}
export interface TipoSangre {
  id: number;
  nombre: string;
  tipoSangre: string;
}

export interface CiudadDatos {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
}
export interface areaTrabajoDTO {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
}
export interface EntidadFinanciera {
  id: number;
  descripcion: string;
  nombre: string;
  idMoneda: number;
  moneda: string;
}

export interface FormacionAcademicaDTO {
  idCentroEstudio?: number;
  idEstadoEstudio?: number;
  idPersonalTipoFuncion?: number;
  idAreaFormacion?: number;
  fechaInicio?: Date;
  fechaFin?: Date;
  idPersonalArchivo?: boolean;
  idTipoEstudio?: number;
  alaActualidad?: boolean;
  logro?: string;
  idPersonal?: number;
}

export interface ConocimientoInformaticaDTO {
  idCentroEstudio?: number;
  idNivelCompetenciaTecnica?: number;
  idPersonalArchivo?: number;
  programa?: string;
}

export interface IdiomasDTO {
  idCentroEstudio: number;
  idIdioma: number;
  idNivelIdioma: number;
  idPersonalArchivo: number;
}
export interface CertificacionesDTO {
  idCentroEstudio?: number;
  fechaCertificacion?: number;
  idPersonalArchivo?: number;
  programa?: string;
  institucion?: string;
}
export interface ExperienciaLaboralDTO {
  idEmpresa?: number;
  idAreaTrabajo?: number;
  idCargo?: number;
  fechaIngreso?: Date;
  fechaRetiro?: Date;
  motivoRetiro?: string;
  nombreJefeInmediato?: string;
  telefonoJefeInmediato?: string;
  idPersonalArchivo?: boolean;
  idPersonal?:number;
}

export interface PersonalFamiliarDTO{
  idParentescoPersonal?:number,
  nombres?: string,
  apellidos?: string,
  idSexo?: number,
  fechaNacimiento?: Date,
  idTipoDocumentoPersonal?: number,
  numeroDocumento?: string,
  numeroReferencia?: string,
  derechoHabiente?: boolean,
  esContactoInmediato?: boolean,
  idPersonal?:number
  id?:number
}

export interface PersonalInformacionMedicaDTO{
  alergia?: string,
  precaucion?: string,
}
export interface PersonalHistorialMedicoDTO{
  enfermedad?: string,
  detalleEnfermedad?: string,
}


export interface ProgramasAsignadosAccesosPortalDTO{
  idPEspecificoPadre?: number,
  nombrePEspecificoPadre: string,
}
export interface CursosAsignadosAccesosPortalDTO{
  idPEspecificoPadre?: number,
  idPEspecifico: number,
  nombrePEspecifico: string,
}

export interface AccesosPortal {
  programasAsignados:ProgramasAsignadosAccesosPortalDTO[],
  cursosAsignados:CursosAsignadosAccesosPortalDTO[]
}


export interface DatosFichaDePersonal {
  datosPersonal:DatosPersonal,
  datosPersonalCese:PersonalCese,
  personalRemuneracion:PersonalRemuneracionDTO[],
  formacion:PersonalFormacion[],
  computo:PersonalInformatica[],
  idioma:PersonalIdioma[],
  certificacion:PersonalCertificacion[],
  experiencia:PersonalExperiencia[],
  datoFamiliar:DatoFamiliarPersonal[],
  informacionMedica:PersonalInformacionMedica[],
  historialMedico:PersonalHistorialMedico[],
  sistemaPensionario:PersonalSistemaPensionario[],
  seguroSalud:PersonalSeguroSalud[],
  datoContratoPersonal:DatoContratoPersonal,
  listaAccesoTemporal:PersonalGrupoAccesoTemporal[],
  listaPuestoTrabajo:PersonalPuestoTrabajo[],
  personalDireccion:PersonalDireccionVista[]
  listaTipoAsesorHistorico:PersonalTipoAsesor[],
  listaJefeInmediatoHistorico:PersonalJefeInmediato[],
  listaPeriodoInactivoHistorico:PersonalTiempoInactivoHistorico[]
  datoPersonalDescanso:PersonalTiempoInactivoHistorico
}


export interface GuardarFichaDatosPersonal{
  personal:PersonalDTOv2,
  personalCese:PersonalCese,
  personalDescanso:PersonalDescanso,
  personalRemuneracion:PersonalRemuneracionV2,
  personalCertificacion:PersonalCertificacion[],
  personalExperiencia:PersonalExperiencia[],
  personalFamiliar:PersonalFamiliarDTO[],
  personalFormacion:PersonalFormacion[],
  personalHistorialMedico:PersonalHistorialMedico[]
  personalIdiomas:PersonalIdioma[]
  personalInformacionMedica:PersonalInformacionMedica[]
  personalInformatica:PersonalInformatica[],
  personalSeguroSalud:PersonalSeguroSaludDTO,
  personalSistemaPensionario:PersonalSistemaPensionarioDTO,
  personalDireccion:PersonalDireccion
}

export interface DatosPersonal{
  id?:number,
  apellidos?:number,
  nombres?:string,
  idPersonalAreaTrabajo?:number,
  fijoReferencia?:string,
  movilReferencia?:string,
  emailReferencia?:string,
  idPaisNacimiento?:number,
  idCiudad?:number,
  fechaNacimiento?:Date,
  idPaisDireccion?:number,
  idRegionDireccion?:number,
  distritoDireccion?:string,
  nombreDireccion?:string,
  idTipoDocumento?:number,
  numeroDocumento?:string,
  idEstadoCivil?:number,
  idSexo?:number,
  idPuestoTrabajo?:number,
  idSedeTrabajo?:number,
  idSistemaPensionario?:number,
  idEntidadSistemaPensionario?:number,
  codigoAfiliado?:string,
  idEntidadSeguroSalud?:number,
  tipoPersonal?:string,
  email?:string,
  idJefe?:number,
  central?:string,
  anexo3CX?:string,
  urlFirmaCorreos?:string,
  activo?:boolean,
  idTipoSangre?:number,
  esCerrador?:boolean,
  idCerrador?:number,
  idPuestoTrabajoNivel?:number,
  idPersonalArchivo?:number,
  rutaArchivo?:string,
  rutaArchivoHtml?:string,
  esImagen?:boolean,
  idTableroComercialCategoriaAsesor?:number,
}
export interface PersonalCese {
  id:number,
  idMotivoCese:number,
  fechaCese:Date
}
export interface  PersonalRemuneracionDTO{
  id:number,
  idPersonal:number,
  idTipoPagoRemuneracion?:number,
  idEntidadFinanciera?:number,
  numeroCuenta?:string,
  activo:boolean
}
export interface PersonalFormacion{
  id:number,
  alaActualidad?:boolean,
  idAreaFormacion?:number,
  idCentroEstudio?:number,
  idEstadoEstudio?:number,
  idPersonal:number
  idTipoEstudio?:number,
  logro?:string,
  idPersonalArchivo?:number,
  fechaInicio?:Date,
  fechaFin?:Date
}
export interface PersonalInformatica{
  id:number,
  idCentroEstudio:number,
  idNivelEstudio:number,
  idPersonal:number,
  programa:string,
  idPersonalArchivo?:number

}
export interface PersonalIdioma{
  id:number,
  idCentroEstudio:number,
  idIdioma:number,
  idNivelIdioma:number,
  idPersonal:string,
  idPersonalArchivo?:number
}
export interface PersonalCertificacion{
  id:number,
  idPersonal:number,
  idCentroEstudio?:number,
  institucion:string,
  programa:string,
  idPersonalArchivo?:number,
  fechaCertificacion:Date
}
export interface PersonalExperiencia{
  id:number,
  idPersonal:number,
  idCargo:number,
  idEmpresa:number,
  idAreaTrabajo?:number,
  motivoRetiro:string,
  nombreJefeInmediato:string,
  telefonoJefeInmediato:string,
  fechaIngreso:Date,
  fechaRetiro:Date,
  idPersonalArchivo?:number
}
export interface DatoFamiliarPersonal{
  id:number,
  idPersonal?:number,
  idParentescoPersonal?:number,
  idSexo?:number,
  idTipoDocumentoPersonal?:number,
  nombres?:string,
  numeroDocumento:string,
  numeroReferencia?:string,
  apellidos?:string,
  derechoHabiente:boolean,
  esContactoInmediato:boolean,
  fechaNacimiento?:Date,

}
export interface PersonalInformacionMedica
{
  id:number,
  idPersonal:number,
  precaucion:string,
  alergia:string,
}
export interface PersonalHistorialMedico
{
  id:number,
  idPersonal:number,
  enfermedad:string,
  detalleEnfermedad:string,
  periodo:string,
}
export interface PersonalSistemaPensionario
{
  id:number,
  idSistemaPensionario:number,
  idEntidadSistemaPensionario:number,
  codigoAfiliado:string,
  periodo:string,
  esModificado:boolean,
  activo:boolean
}

export interface PersonalSistemaPensionarioDTO
{
  idSistemaPensionario:number,
  idEntidadSistemaPensionario:number,
  codigoAfiliado:string,
  esModificado:boolean,
}
export interface PersonalSeguroSalud{
  id:number,
  idEntidadSeguroSalud:number,
  esModificado:boolean,
  activo:boolean,
}
export interface DatoContratoPersonal{
  id:number,
  idPersonal:number,
  idTipoContrato:number,
  estadoContrato:boolean,
  fechaInicio?:Date,
  fechaFin?:Date,
  remuneracionFija:number,
  idTipoPagoRemuneracion?:number,
  idEntidadFinancieraPago?:number,
  numeroCuentaPago:string,
  idPuestoTrabajo:number,
  idSedeTrabajo:number,
  idPersonalAreaTrabajo:number,
  idCargo:number,
  idTipoPerfil?:number,
  idPersonalJefe?:number,
  idEntidadFinancieraCts?:number,
  numeroCuentaCts?:string,
  esPeridoPrueba?:boolean,
  fechaFinPeriodoPrueba?:Date,
  idContratoEstado?:number,
  urlDocumentoContrato?:string,
}
export interface PersonalGrupoAccesoTemporal
{
  idPersonal:number,
  nombreProgramaPadre:number,
  idPEspecificoPadre:number,
  idPEspecificoHijo:number[],
  avance:number,
  nota:number,
  evaluacionHabilitada:boolean,
  cantidadPreguntaConfigurada:number,
  cantidadCrucigramaConfigurado:number,
  cantidadPreguntaResuelta:number,
  cantidadCrucigramaResuelta:number,
  fechaInicio?:Date,
  fechaFin?:Date,
}
export interface PersonalGrupoAccesoTemporalDTO
{
  idPersonal:number,
  idPEspecificoPadre:number,
  listaPEspecificoHijo:number[],
  fechaFinAnterior?:number,
  fechaInicioAnterior?:number,
  idPEspecificoHijo?:number[],
  evaluacionHabilitada:boolean,
  idPEspecificoPadreAnterior?:number,
  fechaInicio?:Date,
  fechaFin?:Date,
}

export interface PersonalPuestoTrabajo {
  id:number,
  rol:string,
  fechaInicio?:Date,
  fechaFin?:Date,
}

export interface PersonalDireccionVista{
  id:number,
  idPais?:number,
  idCiudad?:number,
  distrito:string,
  tipoVia:string,
  nombreVia:string,
  manzana:string,
  lote?:number,
  tipoZonaUrbana:string,
  nombreZonaUrbana:string,
  activo:number
}


export interface PersonalTipoAsesor{
  id:number,
  idCerrador?:number,
  asesorAsociado:string,
  esCerrador?:boolean,
  fechaInicio?:Date,
  fechaFin?:Date,
}

export interface PersonalJefeInmediato{
  id:number,
  idJefe?:number,
  datosJefe:string,
  fechaInicio?:Date,
  fechaFin?:Date,
}

export interface PersonalTiempoInactivoHistorico
{
  id:number,
  idMotivoInactividad?:number,
  motivoInactividad:string,
  fechaInicio?:Date,
  fechaFin?:Date,
  estado:boolean
}


export interface PersonalDescanso{
  fechaInicioDescanso:Date,
  fechaFinDescanso:Date,
  idMotivoInactividad?:number,
  esModificado:boolean
}
export interface  PersonalRemuneracion{
  idTipoPagoRemuneracion?:number
  idEntidadFinanciera?:number
  numeroCuenta?:string
  esModificado:boolean
  activo:boolean
}
export interface  PersonalRemuneracionV2{
  idTipoPagoRemuneracion?:number
  idEntidadFinanciera?:number
  numeroCuenta?:string
  esModificado:boolean
}
export interface  PersonalDireccion{
  idPais? : number
  idCiudad? : number
  distrito? : string
  lote? : number
  manzana? : string
  nombreVia? : string
  nombreZonaUrbana? : string
  idZonaUrbana? : number
  idTipoViaUrbana? : number
  tipoVia? : string
  tipoZonaUrbana? : string
  esModificado : boolean
}


export interface PersonalSeguroSaludDTO{
  idEntidadSeguroSalud:number,
  esModificado:boolean,
}

export interface PersonalDTOv2
{
  id: number;
  apellidos: string;
  distritoDireccion?: string;
  emailReferencia?: string;
  fechaNacimiento?: Date;
  idCiudadNacimiento?: number;
  idCiudadReferencia?: number;
  idEstadocivil?: number;
  idPaisNacimiento?: number;
  idPaisReferencia?: number;
  idSexo?: number;
  idTipoDocumento?: number;
  nombreDireccion?: string;
  nombres: string;
  numeroDocumento?: string;
  telefonoFijo?: string;
  telefonoMovil?: string;
  manzana?:string;
  lote?:string;
  email?: string;
  idJefe?: number;
  tipoPersonal?: string;
  central?: string;
  anexo3CX?: string;
  urlFirmaCorreos?: string;
  activo: boolean;

  area?: string;
  areaAbrev?: string;
  idPuestoTrabajo?: number;
  idSede?: number;
  idTipoSangre?: number;
  esCerrador?: boolean;
  idAsesorAsociado?: number;
  idPuestoTrabajoNivel?: number;
  idPersonalArchivo?: number;
  idPersonalAreaTrabajo?: number;
  idTableroComercialCategoriaAsesor?: number;
  idArea?:number
}



export interface TipoSangreDTO
{
  id:number;
  nombre:string;
  tipoSangre:string;
}

export interface DescargarArchivoDTO
{
  esImagen:boolean;
  respuesta:boolean;
  rutaArchivo:string;
  mensaje:string;
  datos:PersonalArchivoDTO;
}


export interface ArchivoDTO{
  respuesta:boolean;
  datos:PersonalArchivoDTO;
  html:string;
  Mensaje:string;
}
export interface PersonalArchivoDTO{
  id:number;
  nombreArchivo:number;
  rutaArchivo:string;
  mimeType:string;
  esImagen:boolean;
}


export interface EliminarAccesosDto{
  idPersonal:number;
  idPEspecificoPadre:number;
  fechaFin:Date;
  fechaInicio:Date;
}


export interface HorarioDTO {
  id: number;
  idPersonal?: number;
  activo: boolean;
  lunes1?: string;
  lunes2?: string;
  lunes3?: string;
  lunes4?: string;
  martes1?: string;
  martes2?: string;
  martes3?: string;
  martes4?: string;
  miercoles1?: string;
  miercoles2?: string;
  miercoles3?: string;
  miercoles4?: string;
  jueves1?: string;
  jueves2?: string;
  jueves3?: string;
  jueves4?: string;
  viernes1?: string;
  viernes2?: string;
  viernes3?: string;
  viernes4?: string;
  sabado1?: string;
  sabado2?: string;
  sabado3?: string;
  sabado4?: string;
  domingo1?: string;
  domingo2?: string;
  domingo3?: string;
  domingo4?: string;
  usuario: string;
}