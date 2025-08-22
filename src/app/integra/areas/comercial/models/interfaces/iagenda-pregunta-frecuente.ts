export interface IAgendaPreguntaFrecuente {
  data: IDataPreguntaFrecuente[];
  modeloCertificado: any[];
}

export interface IDataPreguntaFrecuente {
  idPrograma: number;
  idSeccion: number;
  nombre: string;
  contenido: {
    pregunta: string;
    respuesta: string;
  }[];
}
