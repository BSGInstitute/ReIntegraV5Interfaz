import { IComboBase1 } from "@shared/models/interfaces/iglobal"

export interface MaterialPEspecifico {
  idMaterialPEspecifico: number
  idMaterialPEspecificoDetalle: number
  idPEspecificoPadreIndividual: number
  nombrePEspecificoPadreIndividual: string
  idPEspecifico: number
  nombrePEspecifico: string
  fechaInicioCurso: string
  grupo: number
  grupoEdicion: number
  grupoEdicionOrden: number
  idMaterialTipo: number
  nombreMaterialTipo: string
  idMaterialVersion: number
  nombreMaterialVersion: string
  idMaterialEstado: number
  nombreMaterialEstado: string
  nombreArchivo: string
  urlArchivo: string
  usuarioSubida: string
  fechaSubida: string
  comentarioSubida: string
  usuarioAprobacion: any
  fechaAprobacion: any
  listaMaterialAccion: any[]
  esPrimerMaterial: boolean
  grupoEdicionTieneFurAsociado: boolean
  enviadoAProveedorImpresion: boolean
  debeEnviarAProveedorImpresion: boolean
  todasVersionesMaterialGrupoEdicionAprobadas: boolean
  tieneFurAsociado: boolean
  esMaterialEnviado: boolean
  debeEnviarAAlumnos: boolean
  usuarioEnvio: any
  fechaEnvio: any
}
export interface CombosModulo {
  listaArea: AreaCapacitacion[]
  listaSubArea: SubAreaCapacitacion[]
  listaProgramaGeneral: ProgramaGeneralP[]
  listaProgramaEspecifico: ProgramaEspecifico[]
  listaPEspecificoCurso: ProgramaEspecificoCurso[]
  listaGrupo: IComboBase1[]
  listaEstadoPEspecifico: IComboBase1[]
  listaCiudadBS: IComboBase1[]
  listaModalidad: IComboBase1[]
  listaMaterialEstado: IComboBase1[]
  
  listaProducto: IComboBase1[]
  listaProveedor: Proveedor[]
  listaProductoPresentacion: IComboBase1[]
  listaExpositor: IComboBase1[]
  listaMaterialVersion: IComboBase1[]
  listaMaterialTipo: IComboBase1[]
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
export interface Proveedor {
  id: number;
  nombre: string;
  simbolo: string;
  nombreMoneda: string;
  precio: number;
  idProducto: number;
  presentacion: string;
  idHistorico: number;
  version: number;
}
export interface AreaCapacitacion {
  id: number;
  nombre: string;
  idAreaCapacitacionFacebook?: number;
}
export interface ProgramaEspecificoCurso {
  id: number;
  nombre: string;
  idPEspecificoPadre: number;
}
export interface ProgramaEspecifico {
  id: number;
  nombre: string;
  idProgramaGeneral: number;
}
