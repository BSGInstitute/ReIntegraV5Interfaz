export interface IAgendaDatosAlumno {
  alumno?: IAlumnoInformacion;
  probabilidadsueldo?: { descripcion?: string; valor?: number };
  visualizarDatos?: {
    fechaVisibleHasta: Date | String;
    id: number;
    valor: number;
  };
}
export interface IAlumnoAccesos {
  usuario?: string;
  contrasenia?: string;
}
export interface IVersionMatricula {
  id: number;
  idVersion: number;
  version?:string;
}
export interface IVersionDisponible {
  id?: number;
  idVersion?: number;
  nombre?:string;
}
export interface IDatosCobranza {
  id?: number;
  cuotasAtrasadas?: number;
  totalDolares?: number;
  compromisosVencidos?: number;
  fechaUltimoCompromiso?: string;
  proximaFechaVencimiento?: string;
  ultimoCompromisoMontoDolares?: number;
  idCronogramaPagoDetalleFinal?: number;
  estadoCompromiso?: string;
  cuotaPendiente?:number;
}

export interface IMatriculaAlumno {
  estadoFinanciero: string; 
  estadoEvaluacion :string;
  estadoCertificacion: string; 
  nombreProgramaGeneral: string;
  idMatriculaCabecera : number;
  codigoMatricula : string ;
  nroCuota : number;
  nroSubCuota : number;
  version : number;
  tipoCuota : string;
  idCentroCosto : number;
  centroCosto : string ;
  fechaVencimiento : string;
  versionPrograma : string;
 }
export interface IDatosAvanceAOnline {
  fechaMatricula?: string;
  fechaPrimerAcceso?: string;
  fechaUltimoAcceso?: string;
  fechaFinalizacion?: string;
  idPGeneral: number;
  pGeneral?: string;
  idPespecifico?: string;
  pEspecifico?: string;
  idCentroCosto?: string;
  centroCosto?: string;
  porcentaje: number;
  porcentajeProgramado: number;
  esperadoSemanalHoras: number;
  realUltimaSemanaHoras: number;
  realUltimas2SemanasHoras: number;
  realUltimas4SemanasHoras: number;
}
export interface IDatosAvanceOnline {
  fechaMatricula?: string;
  fechaInicio?: string;
  fechaFin?: string;
  sesionesDictadas: number;
  sesionesAsistidasActuales: number;
  tasaAsistencia: number;
  totalClases: number;
  ultimaAsistencia?: string;
  fechaUltimaSesionDictada?:string;
  fechaProximaSesion?: string;
}


export interface IAlumnoInformacion {
  aFormacion?: string;
  aTrabajo?: string;
  apellidoMaterno?: string;
  apellidoPaterno?: string;
  asociado?: boolean;
  cargo?: string;
  celularOriginal?: string;
  celular?: string;
  celular2?: string;
  celularTemp?: string;
  celular2Temp?: string;
  descripcionCargo?: string;
  direccion?: string;
  dni?: string;
  emailOriginal?: string;
  email1?: string;
  email2?: string;
  empresa?: string;
  fechaNacimiento?: Date | string;
  genero?: string;
  horaContacto?: string;
  horaPeru?: string;
  id?: number;
  idAFormacion?: number;
  idATrabajo?: number;
  idCargo?: number;
  idCiudad?: number;
  idCodigoPais?: number;
  idEmpresa?: number;
  idEstadoContactoWhatsApp?: number;
  idEstadoContactoWhatsAppSecundario?: number;
  idIndustria?: number;
  idTiempoExperiencia?: number;
  idTamanioEmpresa?: number;
  tiempoexperiencia?: string;
  tamanioempresa?: string;
  idOportunidad_Inicial?: number;
  idReferido?: number;
  idTipoDocumento?: any;
  industria?: string;
  nombre1?: string;
  nombre2?: string;
  nombreCiudad?: string;
  nombreFamiliar?: string;
  nombrePais?: string;
  nroDocumento?: string;
  parentesco?: string;
  referido?: number;
  rutaBandera?: string;
  telefono?: string;
  telefono2?: string;
  telefonoFamiliar?: string;
  promedioSueldo?: number;
  promedioSueldoDesc?: string;
  municipio?:string;
  idMunicipioMexico?:number;
  estadoLugar?:string;
  codigoPostal?:string;
  colonia?:string;
  idAsentamientoMexico?:number;
  idCiudadMexico?:number;
  curp?:string;
  rfc?:string;
  principalResponsabilidadProfesional?: string;

}
export interface IAlumnoActualizar {
  id: number;
  nombre1: string;
  nombre2?: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  dni?: string;
  email1: string;
  email2?: string;
  celular: string;
  celular2?: string;
  telefono?: string;
  telefono2?: string;
  genero?: string;
  parentesco?: string;
  nombreFamiliar?: string;
  telefonoFamiliar?: string;
  fechaNacimiento?: string;
  direccion?: string;
  idCargo?: number;
  cargo?: string;
  idAtrabajo?: number;
  atrabajo?: string;
  idEmpresa?: number;
  empresa?: string;
  idAformacion?: number;
  aformacion?: string;
  idIndustria?: number;
  industria?: string;
  idCiudad?: number;
  ciudad?: string;
  idCodigoPais?: number;
  idMunicipioMexico?:number;
  municipio?:string;
  estadoLugar?:string;
  codigoPostal?:string;
  colonia?:string;
  idAsentamientoMexico?:number;
  idCiudadMexico?:number;
  curp?:string;
  rfc?:string;
}

