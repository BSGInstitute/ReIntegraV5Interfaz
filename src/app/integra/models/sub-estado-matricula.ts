export interface SubEstado {
  id: number,
  nombre: string,
  estado: false,
  idEstadoMatricula: number,
  usuarioCreacion: string,
  fechaCreacion: string | Date,
  usuarioModificacion:string,
  fechaModificacion: string  | Date,
  idOpcionAvanceAcademico: string,
  valorAvanceAcademico1: string,
  valorAvanceAcademico2: string,
  idEstadoPago: string,
  idOpcionNotaPromedio: string,
  valorNotaPromedio1: string,
  valorNotaPromedio2: string,
  tieneDeuda: string,
  proyectoFinal: string,
  requiereVerificacionInformacion: string,
  estadoMatricula: string,
  idAgendaTab: number
  }
  