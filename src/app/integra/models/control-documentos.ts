export interface ControlDocumentos{
  idAsesor : number
  idCoordinador : number
  idPEspecifico :number
  idAlumno :number
  idMatriculaCabecera : number 
  estado : number
}


export interface ControlDocEnviar{
  idControlDocAlumno: number,
  idCriterioCalificacion: number,
  quienEntrego: string,
  fechaEntregaDocumento: string,
  observaciones: string,
  idMatriculaCabecera: number,
  nombreUsuario: string
}

export interface ControlEstado{
  idControlDoc: number,
  idMatriculaCabecera: number,
  estadoDocumento: boolean,
  idCriterioDoc: number,
  nombreUsuario: string,
  recepcionado:boolean
}