export interface ProcedenciaFormulario{
  id?: number;
  nombre: string;
  descripcion:  string;
  estado?: boolean;
  usuarioCreacion?: string;
  usuarioModificacion?: string;
  fechaCreacion?: Date | string;
  fechaModificacion?: Date | string;
}

export interface ProcedenciaFormularioCombo {
  id: number;
  nombre: string
}
// POST PUT
export interface ProcedenciaFormularioEnvio {
  id: number;
  nombre: string;
  descripcion:  string;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: string;
  fechaModificacion: string;
}
