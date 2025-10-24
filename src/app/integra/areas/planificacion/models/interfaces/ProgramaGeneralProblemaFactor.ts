export interface ProgramaGeneralProblemaFactor {
  id: number;
  nombre: string;
}
 
export interface ProgramaGeneralProblemaFactorDetalle {
  id: number;
  nombre: string;
  titulo: string;
}

export interface ProgramaGeneralProblemaFactorSolucion {
  id: number;
  descripcion: string;
  titulo: string;
  subTitulo: string;
}


export interface ProgramaGeneralProblemaFactorSubSolucion {
  id: number;
  solucion: string;
  Orden?: number;
  Nivel?: number;
}

export interface IProgramaGeneralFactor {
    problemaFactor:         ProgramaGeneralProblemaFactor[];
    problemaFactorDetalle:  ProgramaGeneralProblemaFactorDetalle[];
    problemaFactorSolucion: ProgramaGeneralProblemaFactorSolucion[];
}