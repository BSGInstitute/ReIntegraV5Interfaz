// export interface ComboContratos {
//   listaAreaTrabajo:    Lista[];
//   listaTipoContrato:   ListaTipoContrato[];
//   listaPuestoTrabajo:  Lista[];
//   listaSede:           Lista[];
//   listaCargo:          Lista[];
//   listaContratoEstado: Lista[];
// }

// export interface Lista {
//   id:     number;
//   nombre: string;
// }

// export interface ListaTipoContrato {
//   id:     number;
//   nombre: string;
//   idpais: number;
// }

export interface ComboContrato {
  listaAreaTrabajo: ListaAreaTrabajo[]
  listaTipoContrato: ListaTipoContrato[]
  listaPuestoTrabajo: ListaPuestoTrabajo[]
  listaSede: ListaSede[]
  listaCargo: ListaCargo[]
  listaContratoEstado: ListaContratoEstado[]
}

export interface ListaAreaTrabajo {
  id: number
  nombre: string
}

export interface ListaTipoContrato {
  id: number
  nombre: string
  idpais: number
}

export interface ListaPuestoTrabajo {
  id: number
  nombre: string
}

export interface ListaSede {
  id: number
  nombre: string
}

export interface ListaCargo {
  id: number
  nombre: string
}

export interface ListaContratoEstado {
  id: number
  nombre: string
}


export interface PersonalAutoComplete {
  id: number
  nombre: string
}

export interface Contrato {
  id?: number
  idPersonal: number
  idPersonal_Jefe?: number
  nombres: string
  apellidos?: string
  numeroDocumento?: string
  nombreDireccion?: string
  idPaisNacimiento?: number
  paisNacimiento?: string
  idCiudad?: number
  ciudad?: string
  idSexo?: number
  sexo?: string
  idEstadoCivil?: number
  estadoCivil?: string
  idTipoEstudio?: number
  tipoEstudio?: string
  idAreaFormacion?: number
  areaFormacion?: string
  idCentroEstudio?: number
  centroEstudio?: string
  idTipoContrato?: number
  tipoContrato?: string
  estadoContrato?: boolean
  fechaInicio?: string
  fechaFin?: string
  remuneracionFija?: number
  idTipoPagoRemuneracion?: number
  tipoPagoRemuneracion?: string
  idEntidadFinanciera_Pago?: number
  entidadFinanciera_Pago?: string
  numeroCuentaPago?: string
  idPuestoTrabajo?: number
  puestoTrabajo?: string
  idSedeTrabajo?: number
  sedeTrabajo?: string
  idPersonalAreaTrabajo?: number
  personalAreaTrabajo?: string
  idCargo?: number
  cargo?: string
  idTipoPerfil?: number
  tipoPerfil?: string
  idContratoEstado?: number
  contratoEstado?: string
  estado: any
}

export interface FormFiltroContrato {
  ListaPersonalAreaTrabajo: number[]
  ListaPuestoTrabajo: number[]
  ListaPersonal: number[]
  ListaSedeTrabajo: number[]
  FechaInicio: Date
  FechaFin: Date
  OpcionFecha: number
}


export interface DataFormulario {
  listaPersonal: ListaPersonal[]
  listaPersonalExperiencia: ListaPersonalExperiencum[]
  listaPersonalFormacion: ListaPersonalFormacion[]
  listaPersonalIdioma: ListaPersonalIdioma[]
}

export interface ListaPersonal {
  id: number
  nombres: string
  apellidos: string
  fechaNacimiento: string
  distritoDireccion: string
  fijoReferencia: string
  movilReferencia: string
  emailReferencia: string
  idTipoDocumento: number
  tipoDocumento: string
  idSistemaPensionario: number
  sistemaPensionario: string
  idEntidadSistemaPensionario: number
  entidadSistemaPensionario: string
  estado: boolean
}

export interface ListaPersonalExperiencum {
  id: number
  idPersonal: number
  idEmpresa: number
  empresa: string
  idAreaTrabajo: number
  areaTrabajo: string
  idCargo: number
  cargo: string
  fechaIngreso: string
  fechaRetiro: string
  motivoRetiro: string
  nombreJefeInmediato: string
  telefonoJefeInmediato: string
  estado: boolean
}

export interface ListaPersonalFormacion {
  id: number
  idPersonal: number
  idCentroEstudio: number
  centroEstudio: string
  idTipoEstudio: number
  tipoEstudio: string
  idAreaFormacion: number
  areaFormacion: string
  fechaInicio: string
  fechaFin: string
  alaActualidad: boolean
  idEstadoEstudio: number
  estadoEstudio: string
  logro: string
  estado: boolean
}

export interface ListaPersonalIdioma {
  id: number
  idPersonal: number
  idIdioma: number
  idioma: string
  idNivelIdioma: number
  nivelIdioma: string
  idCentroEstudio: number
  centroEstudio: string
  estado: boolean
}

export interface ContratoHistorico {
  id: number
  idPersonal: number
  nombres: string
  apellidos: any
  idTipoContrato: any
  tipoContrato: string
  estadoContrato: boolean
  fechaInicio: string
  fechaFin?: string
  remuneracionFija: number
  idPuestoTrabajo: any
  puestoTrabajo?: string
  idSedeTrabajo: any
  sedeTrabajo: string
  idPersonalAreaTrabajo: any
  personalAreaTrabajo?: string
  idCargo: any
  cargo: string
  idContratoEstado: any
  contratoEstado: any
  estado: boolean
  listaRemuneracionVariable: ListaRemuneracionVariable[]
}

export interface ListaRemuneracionVariable {
  monto?: number
  concepto?: string
  tipoRemuneracionVariable: any
}

export interface RemuneracionVariableDisplay {
  ptRemuneracion: PtRemuneracion
  listaPTRemuneracionVariable: ListaPtremuneracionVariable[]
}

export interface PtRemuneracion {
  id: number
  idPuestoTrabajo: number
  puestoTrabajo: any
  idPersonalAreaTrabajo: number
  personalAreaTrabajo: any
  idPais: number
  pais: any
  idCategoria: number
  categoria: any
  usuario: any
  listaPuestoTrabajoRemuneracionDetalle: any
}

export interface ListaPtremuneracionVariable {
  id: number
  idPuestoTrabajoRemuneracion: number
  idRemuneracion: any
  idTipoRemuneracion: any
  idClaseRemuneracion: any
  idPeriodoRemuneracion: any
  tasa: any
  monto: any
  idMoneda: any
  porcentajeTasa: number
  descripcionEquipo: string
  tieneCondicion: boolean
  idDescripcionMonetaria: any
  valorMinimo: any
  valorMaximo: any
  idMonedaValorVariable: any
  ingresoMensual: number
  estado: boolean
  usuarioCreacion: string
  usuarioModificacion: string
  fechaCreacion: string
  fechaModificacion: string
}


export interface FormDatosContrato {
  nombrePersonal : string
  AreaTrabajo : string
  tipoContrato: string
  puestoTrabajo: string
}

export interface FormularioDatosContrato {
  idPersonal: number
  nombreCompleto: string
  idSexo: number
  sexo: string
  fechaNacimiento: string
  idTipoDocumento: number
  numeroDocumento?: string
  nombreTipoDocumento?: string
  idPaisDireccion?: number
  nombrePais?: string
  idCiudad: number
  nombreCiudad: string
  nombreDireccion: string
  distritoDireccion: string
  emailreferencia: string
  movilReferencia: string
  idSistemaPensionario: number
  sistemaPensionario: string
  idEntidadSistemaPensionario: number
  entidadSistemaPensionario: string
  estado: boolean
}

export interface ComboContratoGeneracion {
  comboPais: ComboPaisContrato[]
  comboCiudad: ComboCiudadContrato[]
  comboTipoDocumento: ComboTipoDocumento[]
  comboMoneda: ComboMoneda[]
  comboRemuneracionTipo: ComboRemuneracionTipo[]
  comboPlantillaContrato: ComboPlantillaContrato[]
  comboFuncionPuesto: ComboFuncionPuesto[]
}

export interface ComboPaisContrato {
  id: number
  nombre: string
}

export interface ComboCiudadContrato {
  id: number
  codigo: number
  nombre: string
  idPais: number
}

export interface ComboTipoDocumento {
  id: number
  nombre: string
}
export interface ComboMoneda {
  id: number
  nombre: string
  nombreCorto: string
  nombrePlural: string
  simbolo: string
  idPais: number
}

export interface ComboRemuneracionTipo {
  id: number
  nombre: string
}

export interface ComboPlantillaContrato {
  idPlantillaBase: number
  nombrePlantillaBase: string
  descripcionPlantillaBase: string
  idPlantilla: number
  nombrePlantilla: string
  idPlantillaClaveValor: number
  clavePlatilla: string
  valorPlantilla: string
  etiquetasPlantilla: string
  listaEtiquetas: string[]
  idTipoContrato: number
  idContratoPlantilla: number
}
export interface ComboFuncionPuesto {
  funcionNumeroOrden: number
  nombreFuncion: string
  idPuestoTrabajoFuncion: number
  idPerfilPuestoTrabajo: number
  versionPuestoTrabajo: number
  idPuestoTrabajo: number
  nombrePuestoTrabajo: string
}


export interface ComboDatosRemuneracionVariable {
  idPuestoTrabajoRemuneracionDetalle: number
  idPuestoTrabajoRemuneracion: number
  idPuestoTrabajo: number
  idRemuneracionTipo: number
  nombrePuestoTrabajo: string
  tieneCondicion: boolean
  esTasa: boolean
  rangoValorMinimo: number
  rangoValorMaximo: number
  idMonedaMontoFijo: number
  idMonedaRango: number
}

export interface RemuneracionVariableForm {
  Id: number
  IdPuestoTrabajoRemuneracion: number
  IdRemuneracionTipo: number
  TipoRemuneracionVariable: number
  Concepto: string
  ValorMinimo: number
  ValorMaximo: number
  Monto: number
}

export interface FormularioRemplazo {
  IdPersonal: number
  NombreCompleto: string
  IdPersonalAreaTrabajo: number
  IdTipoContrato: number
  IdPuestoTrabajo: number
  IdCargo: number
  FechaInicio: string
  FechaFin: string
  IdSedeTrabajo: number
  IdContratoEstado: number
  MontoRemuneracion: number
  DireccionCompleta: string
  IdPais: any
  IdCiudad: any
  IdDocumento: number
  NumeroDocumento: string
  ListaResponsabilidades: number[]
  ControlResponsabilidadPuesto: boolean
  Tratamiento: Tratamiento
  TiempoPrueba: number
  TipoTiempoPrueba: TipoTiempoPrueba
  CorreoPersonal: string
  MontoRemuneracionText: string
}

export interface Tratamiento {
  id: number
  nombre: string
}

export interface TipoTiempoPrueba {
  id: number
  nombre: string
}


export interface RemuneracionVariableRequest {
  Id: number;
  IdPuestoTrabajoRemuneracion: number;
  TipoRemuneracionVariable: string;
  Concepto: string;
  ValorMinimo: number;
  ValorMaximo: number;
  Monto: number;
}

export interface ContratoRequest {
  IdPersonalAreaTrabajo: number;
  IdTipoContrato: number;
  IdPuestoTrabajo: number;
  FechaInicio: string;
  FechaFin: string;
  RemuneracionFija: number;
  IdSedeTrabajo: number;
  IdCargo: number;
  IdContratoEstado: number;
  ListaRemuneracionVariable: RemuneracionVariableRequest[];
  Id: number;
  IdPersonal: number;
  Usuario: string;
}

