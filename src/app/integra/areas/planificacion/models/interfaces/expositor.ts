import { IComboBase1 } from '@shared/models/interfaces/iglobal';

export interface Expositor {
  id: number;
  idTipoDocumento: number;
  nroDocumento: string;
  primerNombre: string;
  segundoNombre?: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento?: string;
  idPaisProcedencia?: number;
  idCiudadProcedencia?: number;
  idReferidoPor?: number;
  telfCelular1: string;
  telfCelular2?: string;
  telfCelular3?: string;
  email1: string;
  email2?: string;
  email3?: string;
  domicilio?: string;
  idPaisDomicilio?: number;
  idCiudadDomicilio?: number;
  lugarTrabajo?: string;
  idPaisLugarTrabajo?: number;
  idCiudadLugarTrabajo?: number;
  asistenteNombre?: string;
  asistenteTelefono?: string;
  asistenteCelular?: string;
  hojaVidaResumidaPerfil: string;
  hojaVidaResumidaSpeech: string;
  formacionAcademica?: string;
  experienciaProfesional?: string;
  publicaciones?: string;
  premiosDistinciones?: string;
  otraInformacion?: string;
  esPersonaValida?: boolean;
  idPersonalAsignado?: number;
  fotoDocente?: string;
  urlFotoDocente?: string;
  //Propiedas solo vistas
  paisProcedencia?: string;
  ciudadProcedencia?: string;
  tipoDocumento?:string;
}
export interface CombosModulo {
  tipoDocumentos: TipoDocumento[];
  coordinadores: IComboBase1[];
  paises: IComboBase1[];
  ciudades: Ciudades[];
  expositores: IComboBase1[];
}
export interface TipoDocumento {
  id: number;
  clave: number;
  descripcion: string;
}
export interface Ciudades {
  id: number;
  codigo: number;
  nombre: string;
  idPais: number;
  longCelular: number;
  longTelefono: number;
  longCelularAlterno?: number;
}
