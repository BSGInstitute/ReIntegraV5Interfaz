export interface Alumno {}

export interface AlumnoNuevoContacto {
  id:number,
  nombre1?:string,
  nombre2?:string,
  apellidoMaterno?:string,
  apellidoPaterno?:string,
  telefono?:string,
  celular?:string,
  celular2?:string,
  email1?:string,
  email2?:string,
  idAformacion?:number,
  idAtrabajo?:number,
  idIndustria?:number,
  idCargo?:number,
  idPais?:number,
  idCodigoPais?:number,
  idCiudad?:number,
  idCodigoRegionCiudad?:number,
  estado:boolean,
  usuarioCreacion?:string,
  usuarioModificacion?:string,
  fechaCreacion?:Date,
  fechaModificacion:Date,
  rowVersion: string;
}
