export interface ProcedenciaFormularioDetalle{
  id: number;
  idProcedenciaFormulario: number;
  idTipoInteraccion:  number;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;
}

export interface ProcedenciaFormularioDetalleCombo {
  id: number;
  nombre: string
}
// POST PUT
export interface ProcedenciaFormularioDetalleEnvio {
  id: number;
  idProcedenciaFormulario: number;
  idTipoInteraccion:  number;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: string;
  fechaModificacion: string;
}
