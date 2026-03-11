export interface ObservacionPorEstado {
  id: number;
  descripcion: string;
  idPEspecificoSesionEstado: number;
  estadoCursoNombre?: string;
  orden?: number;
  observaciones?: ObservacionDetalle[];
}

export interface ObservacionDetalle {
  id: number;
  nombre: string;
  idPEspecificoSesionEstadoObservacion?: number;
  orden: number;
}
