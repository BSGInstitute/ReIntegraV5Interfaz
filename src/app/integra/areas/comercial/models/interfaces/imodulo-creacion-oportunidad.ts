import { IComboBase1 } from '@shared/models/interfaces/iglobal';

export interface IContactoOportunidad {
  paises: Array<IPaisZonaHoraria>;
  ciudades: Array<ICiudadCombo>;
  tipoDatoChats: Array<ITipoDatoCombo>;
  faseOportunidades: Array<IFaseOportunidadCombo>;
  categoriaOrigenes: Array<IComboBase1>;
  cargos: Array<IComboBase1>;
  areasFormacion: Array<IComboBase1>;
  areasTrabajo: Array<IAreaTrabajoCombo>;
  industrias: Array<IComboBase1>;
  origenes: Array<IComboBase1>;
}

export interface IPaisZonaHoraria {
  id: number;
  codigoPais: number;
  nombrePais?: string;
  zonaHoraria: number;
}
export interface ICiudadCombo {
  id: number;
  codigo: number;
  nombre: string;
  idPais: number;
}
export interface ITipoDatoCombo {
  id: number;
  nombre: string;
  modalidad: string;
  codigo: string;
  considerarEnvioAutomatico?: boolean;
  tipoPersonal: string;
}
export interface IFaseOportunidadCombo {
  id: number;
  codigo?: string;
  nombre?: string;
}
export interface CargoCombo {
  id: number;
  nombre?: string;
}
export interface IAreaTrabajoCombo {
  fechaCreacion: string;
  fechaModificacion: string;
  id: number;
  nombre: string;
  usuarioCreacion: string;
  usuarioModificacion: string;
}
export interface IndustriaCombo {
  id: number;
  nombre?: string;
}

export interface IOportunidadRegistro {
  data: Array<{
    id: number;
    nombre1: string;
    nombre2: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email1: string;
    email2: string;
    idCentroCosto?: number;
    nombreCentroCosto: string;
    idPersonal?: number;
    nombrePersonal: string;
    idTipoDato?: number;
    nombreTipoDato: string;
    idFaseOportunidad?: number;
    codigoFase: string;
    codigoFaseMaxima: string;
    idOrigen?: number;
    nombreOrigen: string;
    codigoPais?: number;
    nombrePais: string;
    codigoCiudad?: number;
    nombreCiudad: string;
    horaPeru: string;
    horaContacto: string;
    celular: string;
    telefono: string;
    direccion: string;
    dni: string;
    idEmpresa?: number;
    idCargo?: number;
    idFormacion?: number;
    idTrabajo?: number;
    idIndustria?: number;
    idOportunidad?: number;
    fechaCreacionOportunidad?: string;
    idReferido?: number;
    asociado?: boolean;
    nombreGrupo: string;
    codigoMailing: string;
    nombreCompleto: string;
  }>;
  total: number;
}

export interface IAlumnoInformacionMessenger {
  id: number;
  nombre1: string;
  nombre2: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  direccion: string;
  telefono: string;
  celular: string;
  email1: string;
  email2: string;
  idReferido?: number;
  idCodigoPais?: number;
  idCiudad?: number;
  horaContacto: string;
  horaPeru: string;
  idCargo?: number;
  idAFormacion?: number;
  idATrabajo?: number;
  idIndustria?: number;
  idEmpresa?: number;
  asociado?: boolean;
}

// export interface IRegistroOportunidadAlumno {
//   alumno: IAlumnoFormularioOportunidad;
//   oportunidad: IOportunidadFormulario;
//   usuario: string;
// }

export interface IAlumnoFormularioOportunidad {
  id: number;
  nombre1?: string;
  nombre2?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  dNI?: string;
  direccion?: string;
  telefono?: string;
  celular?: string;
  email1?: string;
  email2?: string;
  idCargo?: number;
  idAFormacion?: number;
  idATrabajo?: number;
  idIndustria?: number;
  idReferido?: number;
  idCodigoPais?: number;
  idCodigoCiudad?: number;
  horaContacto?: string;
  horaPeru?: string;
  telefono2?: string;
  celular2?: string;
  idEmpresa?: number;
  comentario?: string;
}
export interface IFiltroEnvio {
  paginador: any;
  filtro: {
    centrosCosto?: string;
    asesores?: string;
    tiposDato?: string;
    origenes?: string;
    fasesOportunidad?: string;
    contacto?: string;
    fechaInicio?: string;
    fechaFin?: string;
  };
}
export interface IFormFiltro {
  centrosCosto?: Array<number>;
  asesores?: Array<number>;
  tiposDato?: Array<number>;
  origenes: Array<number>;
  fasesOportunidad: Array<number>;
  contacto?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
}
export interface IPaginador {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
  //Adicional
  identificador?: string;
}

export interface IFormRegistroOportunidad {
  nombre1: string;
  nombre2: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email2: string;
  email1: string;
  direccion: string;
  telefono: string;
  celular: string;
  idCargo: number;
  idAFormacion: number;
  idATrabajo: number;
  idIndustria: number;
  idReferido: number;
  idCodigoPais: number;
  idCodigoCiudad: number;
  horaContacto: Date;
  horaPeru: Date;
  idEmpresa: number;
  comentario: string;

  idCentroCosto: number;
  idPersonal_Asignado: number;
  idTipoDato: number;
  idOrigen: number;
  idFaseOportunidad: number;
  codigoMailing: string; //no utilizado

  fechaProgramada: Date; //no utilizado
}

export interface IRegistroOportunidadAlumno {
  alumno: IAlumnoFormularioOportunidad;
  oportunidad: IOportunidadFormulario;
  usuario: string;
}

export interface IAlumnoFormularioOportunidad {
  id: number;
  nombre2?: string;
  nombre1?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  dni?: string;
  direccion?: string;
  telefono?: string;
  celular?: string;
  email1?: string;
  email2?: string;
  idCargo?: number;
  idAFormacion?: number;
  idATrabajo?: number;
  idIndustria?: number;
  idReferido?: number;
  idCodigoPais?: number;
  idCodigoCiudad?: number;
  horaContacto?: string;
  horaPeru?: string;
  telefono2?: string;
  celular2?: string;
  idEmpresa?: number;
  comentario?: string;
  identificadorAmbitoPagina?: string;
}

export interface IOportunidadFormulario {
  id: number;
  idAlumno: number;
  idCentroCosto: number;
  idFaseOportunidad: number;
  idOrigen: number;
  idPersonal_Asignado: number;
  idTipoDato: number;
  ultimoComentario: string;
  fk_id_tipointeraccion: number;
  // ultimaFechaProgramada: string
}

export interface IOportunidadFormularioWhatsapp {
  idAlumno: number;
  idCentroCosto: number;
  idPersonalAsignado: number;
  activo?: boolean;
  idOrigen?: string;
}
