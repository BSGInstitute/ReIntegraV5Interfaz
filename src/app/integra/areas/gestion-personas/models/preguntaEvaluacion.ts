export interface PreguntaEvaluacion{
  id:number,
  enunciado: string,
  listaExamen:number[],
  idTipoRespuesta: number,
  idPreguntaCategoria:number,
  idPreguntaTipo: number,
  minutosPorPregunta: number,
  respuestaAleatoria: boolean,
  activarFeedBackRespuestaCorrecta: boolean,
  activarFeedBackRespuestaIncorrecta: boolean,
  mostrarFeedbackInmediato: boolean,
  mostrarFeedbackPorPregunta: boolean,
  idTipoRespuestaCalificacion: number,
  factorRespuesta: number,
}
export interface RespuestaPregunta{
    idPregunta:number,
    respuestaCorrecta?: boolean,
    nroOrden: number,
    nroOrdenRespuesta?:number,
    enunciadoRespuesta:string,
    puntaje?: number,
    feedbackPositivo?: string,
    feedbackNegativo?: string,
    mostrarFeedBack?: boolean;
}
export interface RespuestaApi {
  mensaje: string;
  totalImportadas: RespuestaPregunta[]; 
}

export interface examenPregunta{
  listaExamen: number[],
}
export interface intentoPregunta{
    numeroMaximoIntento: number,
    activarFeedbackMaximoIntento: boolean,
    mensajeFeedback: string,
}
export interface ComboTipoPregunta{
        id: number,
        nombre: string,
        tipoRespuesta: string,
        idTipoRespuesta : number
}

export interface ExamenDVTO{
    id: number,
    nombreExamen: string,
}