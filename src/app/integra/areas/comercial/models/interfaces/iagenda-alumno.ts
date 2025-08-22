export interface IAgendaAlumno {}
export interface IInformacionAlumno {
  celular1: string;
  celular1Temp: string;
  celular2: string;
  celular2Temp: string;
  email1: string;
  email2: string;
  telefono1: string;
  telefono2: string;
}

export interface IDocumentoPerOportunidad {
  url: string;
  comentario: string;
  tipo?: number;
}
export interface IDocumentoPerOportunidad {
  id: number;
  campoActualizado: string;
  valorAnterior: string;
  valorNuevo: string;
  usuarioCreacion: string;
  fechaCreacion: string;
}

export interface IComboCiudad {
  id: number;
  codigo: number;
  nombre: string;
  idPais: number;
}
export interface IComboMunicipio{
  id: number;
  nombre: string;
  idCiudad?: number;
}
export interface IComboAsentamiento{
  idAsentamientoMexico: number;
  codigoPostal:string;
  asentamientoMexico:string;
}

export interface IComboCodigoPostal{
  codigoPostal: string,
  idAsentamientoMexico: number,
  asentamientoMexico: string,
  idMunicipioMexico: number,
  municipioMexico: string,
  idCiudad: number,
  nombreCiudad: string,
  idCiudadMexico?:number,
  ciudadMexico?:string,
}
export interface ColorPerfilPrograma
{
  idRegistro: number
  tipoRegistro: string
  colorHex: string
  colorDescripcion: string 
}