export interface PostulantesInscritos {
  idPostulante: number;
  nombrePostulante: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nroDocumento: string;
  email: string;
  idProcesoSeleccion: number;
  procesoSeleccion: string;
  fechaProcesoSeleccion: string;
  nombrePersonal: string;
}


export interface ExamenesPostulante {
  IdPostulante: number,
  IdProcesoSeleccion: number
}

export interface ExamenGroup {
  idEvaluacion: number;
  nombreEvaluacion: string
  listaExamenes: ListaExamenes[]
}

export interface ListaExamenes{
  idExamen : number;
  nombreExamen : string;
  estadoExamen : boolean
}
