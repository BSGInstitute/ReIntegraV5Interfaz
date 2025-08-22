export interface RegistroArchivoStorage {
  id: number;
  idUrlSubContenedor: number;
  nombreArchivo: string;
  ruta: string;
  estado: boolean;
  idMigracion: number;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;
}
export interface RegistroArchivoStorageCombo {
  id: number;
  nombreArchivo: string;
}
// POST PUT
export interface RegistroArchivoStorageEnvio {
  id: number;
  idUrlSubContenedor: number;
  nombreArchivo: string;
  ruta: string;
  estado: boolean;
  idMigracion: number;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;
}
export interface RegistroArchivoStorageTodo {
  id: number;
  contenedor: string;
  nombreArchivo: string;
  idUrlBlockStorage: number;
  ruta: string;
  usuarioModificacion: string;
  fechaModificacion: Date | string;
}
export interface RegistroArchivoCombo {
  listadoContenedores: {
    idContenedor: number;
    contenedor: string;
    aplicaSubcontenedores: boolean;
    aplicaSubidaMultiple: boolean;
    aplicaValidacion: boolean;
  }[];
  listadoSubContenedores: {
    idSubcontenedor: number;
    subcontenedor: string;
    idContenedor: number;
  }[];
  listadoTipoSubContenedores: {
    id: number;
    idContenedor: number;
    idUrlSubContenedor: number;
    tipo: string;
    ruta: string;
  }[];
}
export interface RegistroArchivoStoragePermisos {
  // id:number;
  // contenedor:string;
  // nombreArchivo:string;
  // IdUrlBlockStorage:number;
  // ruta:string;
  // usuarioModificacion: string;
  // fechaModificacion: Date | string;
  id: number;
  archivos: string; //file
  idUrlSubContenedor: number;
  nombreArchivo: string;
  nombreUsuario: string;
  rutaCompleta: string;
  rutaBlob: string;
  archivoBol: any[]; //file
  archivoCol: any[]; //file
  archivoInt: any[]; //file
  archivoPeLima: any[]; //file
  archivoPeAqp: any[]; //file
}
export interface RegistroArchivoStoragePermisosEnvio {
  // id:number;
  // contenedor:string;
  // nombreArchivo:string;
  // IdUrlBlockStorage:number;
  // ruta:string;
  // usuarioModificacion: string;
  // fechaModificacion: Date | string;
  id: number;
  archivos: string; //file
  idUrlSubContenedor: number;
  nombreArchivo: string;
  nombreUsuario: string;
  rutaCompleta: string;
  rutaBlob: string;
  archivoBol: any[]; //file
  archivoCol: any[]; //file
  archivoInt: any[]; //file
  archivoPeLima: any[]; //file
  archivoPeAqp: any[]; //file
}
