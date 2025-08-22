export interface RemitentesMailing {
  id: number;
  nombre: string;
  descripcion:  string;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;
}
export interface RemitentesMailingAsesores {
  idRemitenteMailing: number;
  idPersonal: number;
  NombreCompleto:  string;
  correoElectronico: string;
  estado: boolean;
}
