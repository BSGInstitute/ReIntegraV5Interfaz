export interface ITipoCategoriaOrigen {
  descripcion:  string
  estado: boolean;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;
  id: number;
  meta: number;
  nombre: string;
  oportunidadMaxima: number;
  orden: number;
  usuarioCreacion: string;
  usuarioModificacion: string;
}
