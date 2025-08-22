export interface EsquemaEvaluacion {
    id: number;
    idFormaCalculoEvaluacion: number;
    nombre:string;
    idModalidadCurso:number;
    EsquemaEvaluacionDetalles ?:EsquemaEvaluacionDetalle[];
  }

export interface EsquemaEvaluacionDetalle{
  id:number;
  idCriterioEvaluacion:number;
  idEsquemaEvaluacion:number
  ponderacion:string;
}
export interface ListaEsquemaDetalle {
  EsquemaEvaluacionDetalles:EsquemaEvaluacionDetalle[];
}

export interface FormaCalculoEvaluacion{
  id: number;
  nombre:string;
  esSuma:boolean;
  esPromedio:boolean;
}
export interface ModalidadCurso
{
  id:number;
  nombre:string
}

