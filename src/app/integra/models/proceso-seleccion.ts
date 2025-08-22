export interface ExamenAsignadoEtapa {
  Id: number;
  Nombre: string;
  IdProcesoSeleccion: number;
  NroOrden: number;
}

export interface ConfigurarProcesoSeleccion {
  id: number;
  nombre: string;
  idPuestoTrabajo: number;
  puestoTrabajo: string;
  idSede: number;
  sede: string;
  codigo: string;
  url: string;
  activo: boolean;
  fechaInicioProceso: Date | null;
  fechaFinProceso: Date | null;
}

export interface EvaluacionAsignadoProcesos {
  Id: number;
  IdProcesoSeleccion: number;
  IdEvaluacion: number;
  NroOrden: number;
  Nombre: string;
  EsCalificadoPorPostulante?: boolean;
  IdProcesoSeleccionEtapa?: number;
}
export interface ProcesoSeleccionAgrupadoInsertarModificarDTO {
  configuracionProcesoSeleccion: ConfigurarProcesoSeleccion;
  listaEtapas: ExamenAsignadoEtapa[];
  listaEvaluaciones: EvaluacionAsignadoProcesos[];
  listaEvaluacionesEvaluador: EvaluacionAsignadoProcesos[];

}
