export interface IEnvioMaterial{

  idMaterialPespecifico: number
  idMaterialVersion: number
  idMaterialEstado: number
  nombreArchivo: string
  urlArchivo: string
  fechaSubida?: Date
  comentarioSubida: string
  idMigracion?: number
  idFur?: number
  fechaEntrega?: Date
  direccionEntrega: string
  usuarioAprobacion: string
  usuarioSubida: string
  fechaAprobacion?: Date
  idEstadoRegistroMaterial?: number
  usuarioEnvio: string
  fechaEnvio?:Date
  idMaterialTipo: number
  listaMaterialAccion: any[]
  id: number
  fechaCreacion: string
  fechaModificacion: string
  estado: boolean
  usuarioCreacion: string
  usuarioModificacion: string
  rowVersion: string
}
export interface AreaCapacitacion {
  id: number;
  nombre: string;
  idAreaCapacitacionFacebook?: number;
}
export interface SubAreaCapacitacion {
  id: number;
  nombre: string;
  idAreaCapacitacion: number;
}
export interface ProgramaGeneralP {
  id: number;
  nombre: string;
  idSubArea: number;
}
export interface ProgramaEspecifico {
  id: number;
  nombre: string;
  idProgramaGeneral: number;
}