export interface IDatosAlumno {
  idClasificacionPersona: number;
  id: number;
  nombre1: string;
  nombre2: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  dni: string;
  direccion?: any;
  fechaNacimiento: Date;
  telefono: string;
  celularOriginal?:string;
  emailOriginal?:string;
  celular: string;
  email1: string;
  email2: string;
  genero?: any;
  parentesco?: any;
  nombreFamiliar?: any;
  telefonoFamiliar?: any;
  empresa?: any;
  idCargo: number;
  cargo: string;
  idAFormacion: number;
  aFormacion: string;
  idATrabajo: number;
  aTrabajo: string;
  idIndustria: number;
  industria: string;
  idTiempoExperiencia?: number;
  idTamanioEmpresa?: number;
  tiempoExperiencia?: string;
  tamanioEmpresa?: string;
  principalResponsabilidadProfesional?: string;
  idReferido?: any;
  referido?: any;
  idCodigoPais: number;
  nombrePais: string;
  idCiudad: number;
  nombreCiudad: string;
  horaContacto?: any;
  horaPeru?: any;
  telefono2?: any;
  celular2?: any;
  idEmpresa?: any;
  idEstadoContactoWhatsApp: number;
  idEstadoContactoWhatsAppSecundario?: any;
  idOportunidad_Inicial?: any;
  idTipoDocumento?: any;
  nroDocumento?: any;
  descripcionCargo?: any;
  asociado?: any;
  rutaBandera: string;
  codigoMatricula?: string;
}
export interface ICodigoMatricula{
  codigoMatricula: string
}
export interface IOportunidadCompetidor {
  id: number;
  idOportunidad: number;
  otroBeneficio: string;
  respuesta: number;
  completado: string;
  calidadBO?: any;
}

export interface IListaPreGeneral {
  idPrerequisito: number;
  prNombre: string;
  respuesta: number;
  completado: string;
}

export interface IArgumento {
  id: string;
  idProgramaGeneralBeneficio: string;
  idPGeneral: string;
  nombre: string;
  preNombre?: any;
}

export interface IListaBeneficio {
  idBeneficio: number;
  nombrePrerequisito: string;
  respuesta: number;
  completado: string;
  argumentos: IArgumento[];
}

export interface IProgramaGeneralPreBen {
  oportunidadCompetidor: IOportunidadCompetidor;
  listaPreGeneral: IListaPreGeneral[];
  listaPreEspecifico: {
     idPrerequisito: number
     pRNombre: string;
     respuesta: number
     completado: string;

  }[];
  listaBeneficios: IListaBeneficio[];
  listaCompetidores: {id: number, nombre: string}[];
}

export interface IPreEspecifico{
   idPrerequisito: number;
   pRNombre: string ;
   respuesta: number;
   completado: string
}
export interface IListaProblemaCliente {
  idProblema: number;
  nombreProblema: string;
  idCausa: number;
  nombreCausa: string;
  idSolucion: number;
  nombreSolucion: string;
  descripcionSolucion: string;
  seleccionado: string;
  solucionado: string;
  otroProblema?: any;
}

export interface IOportunidadComplementos {
  probabilidadActual: string;
  codigoFase: string;
  categoriaOrigen: string;
  centroCosto: string;
  idPersonalAsignado: number;
  idCentroCosto: number;
  estadoMatricula?: any;
  celular: number
  subEstadoMatricula?: any;
}

export interface IProbabilidadsueldo {
  valor?: any;
  descripcion: string;
}

export interface IInformacionOportunidadFicha {
  listaOportunidadVentaCruzada: IOportunidadVentaCruzada[];
  datosAlumno: IDatosAlumno;
  programaGeneralPreBen: IProgramaGeneralPreBen;
  listaProblemaCliente: IListaProblemaCliente[];
  oportunidadComplementos: IOportunidadComplementos;
  probabilidadsueldo: IProbabilidadsueldo;
  idFaseOportunidad: any;
  idActividadDetalle: any;
  nombresPersonal: any;
  apellidosPersonal: any;
}

export interface IOportunidadVentaCruzada{
    idOportunidad: number;
    programa: string;
    probabilidad: string;
    precio: string;
    matricula: string;
    comision: string;
    contado: string;
    orden: number;
    costo: number;
}

export interface IInteraccionAlumno {
  idOportunidad: number;
  faseOportunidad: string;
  fechaCreacion: Date;
  centroCosto: string;
  tipoDato: string;
  categoriaOrigen: string;
}
