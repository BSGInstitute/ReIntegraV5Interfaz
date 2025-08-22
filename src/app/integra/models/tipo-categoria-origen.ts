export interface TipoCategoriaOrigen {
  id: number;
  nombre: string;
  descripcion:  string
  meta: number;
  orden: number;
  oportunidadMaxima: number;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;
}

export interface TipoCategoriaOrigenCombo {
  id: number;
  nombre: string
}
// POST PUT
export interface TipoCategoriaOrigenEnvio {
  id: number;
  fechaCreacion: string;
  fechaModificacion: string;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  nombre: string;
  descripcion: string;
  meta: number;
  orden: number;
  oportunidadMaxima: number
}
