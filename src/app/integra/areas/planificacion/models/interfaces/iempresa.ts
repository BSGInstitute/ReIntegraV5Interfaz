export interface IEmpresa {
  ciiu?: number;
  direccion?: string;
  email?: string;
  estado?: boolean;
  fechaCreacion?: Date;
  fechaModificacion?: Date;
  id: number;
  idCiudad?: number;
  idCodigoCiiuIndustria?: number;
  idIndustria?: number;
  idPais?: number;
  idRegion?: number;
  idTamanio?: number;
  idTipoEmpresa?: string;
  idTipoIdentificador?: number;
  nivelFacturacion?: number;
  nombre: string;
  paginaWeb?: string;
  rowVersion?: any;
  ruc?: string;
  telefono?: string;
  trabajadores?: number;
  usuario?: string;
  idMunicipioMexico?:number;
  idAsentamientoMexico?:number;
  idCiudadMexico?:number;
  codigoPostal?:string;
  usuarioCreacion?: string;
  usuarioModificacion?: string;
}

export interface IFormEmpresa {
  razonSocial: string;
  identificadorTributario: string;
  tamanioEmpresa: number;
  email: string;
  codigoCIIU: number;
  tipoEmpresa: string;
  paginaWeb: string;
  direccion: string;
  pais: number;
  region: number;
  ciudad: number;
  tipoIdentificador: number;
  telefono: string;
  nroTrabajadores: number;
  nivelFacturacion: number;
  idMunicipioMexico?:number;
  idAsentamientoMexico?:number;
  idCiudadMexico?:number;
  codigoPostal?:string;
  colonia?:string;
}

export interface IEmpresaCodigoCIIU {
  ciiu: string;
  estado: true;
  fechaCreacion: Date;
  fechaModificacion: Date;
  id: number;
  idIndustria: number;
  nombre: string;
  rowVersion: string;
  usuarioCreacion: string;
  usuarioModificacion: string;
}
