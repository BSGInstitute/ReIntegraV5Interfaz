export interface TipoInteraccion{
  id: number;
  nombre: string;
  canal:  string;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;
}

export interface TipoInteraccionCombo {
  readonly id: number;
  readonly nombre: string
}
// POST PUT
export interface TipoInteraccionEnvio {
  id: number;
  nombre: string;
  canal:  string;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;

}
