export interface EstadoMatricula {
  id: number,
  estadoMatricula: string,
  estado: boolean,
  usuarioCreacion: string,
  fechaCreacion: string,
  usuarioModificacion: string,
  fechaModificacion: string|Date,
  activo: boolean
  }
  