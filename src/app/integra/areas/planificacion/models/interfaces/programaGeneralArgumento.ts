export interface CompuestoArgumentoModalidadAlternoDTO {
  idArgumento: number;
  idPGeneral: number;
  nombreArgumento: string;
  descripcion: string;
  esVisibleAgenda: boolean;
  ArgumentoDetalle: ArgumentoDetalleSolucionAlternoDTO[];
  modalidades: ModalidadCursoAlternoDTO[];
}

export interface ModalidadCursoProblemaDTO {
  id: number | null;
  nombre: string | null;
  idModalidad: number;
}
export interface ArgumentoDetalleSolucionAlternoDTO {
  idPresentacionArgumento: number;
  idPGeneral: number;
  nombrePresentacionArgumento: string;
  descripcionPresentacionArgumento:string;
  esVisibleAgenda: boolean;
  presentacionArgumento: ProgramaGeneralProblemaArgumentoDetalleMotivacionDTO[] | null;
  modalidades: ModalidadCursoProblemaDTO[] | null;
}
export interface ArgumentoDetalleSolucionAlternoDTO {
  id: number | null;
  detalle: string;
  solucion: string;
}

export interface ProgramaGeneralProblemaArgumentoDetalleMotivacionDTO {
  id: number | null;
  detalle: string | null;
  motivacion: number | null;
}



export interface ModalidadCursoAlternoDTO {
  id: number | null;
  nombre: string | null;
  idModalidadCurso: number;
}