
// export interface IListarReclamos
// {
//   listaReclamo:listareclamos[]
// }
export interface IListarReclamos {

  id:number ;
  idReclamoEstado:number ;
  idMatricula:number ;
  codigoMatricula:string ;
  dNI:string ;
  nombreAlumno:string ;
  personalAsignado:string ;
  descripcion:string ;
  origen:string ;
  idOrigen:number ;
  centroCosto:string ;
  estadoMatricula:string ;
  reclamoEstado:string ;
  idEstadoReclamo:number ;
  fechaUltimaLlamada?:Date ;
  fechaUltimoCorreo?:Date ;
  fechaUltimoWapp?:Date ;
  fechaCreacion?:Date ;
  idTipoReclamoAlumno:number ;
  fechaModificacion?:Date ;
  tipoReclamoAlumno:string ;
}
