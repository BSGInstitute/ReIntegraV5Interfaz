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


export interface ProblemaDetalleEditDTO {
  id: number;
  idPGeneral: number;
  IdProgramaGeneralProblemaFactor: number;
  IdProgramaGeneralProblemaFactorDetalle: number | null;
  AplicaTituloDetalle: boolean;
  AplicaNombreDetalle: boolean;
  AplicaPieDePagina: boolean;
  IdProgramaGeneralProblemaFactorSolucion: number | null;
  AplicaDescripcionSolucion: boolean;
  AplicaTituloSolucion: boolean;
  AplicaSubTituloSolucion: boolean;
  soluciones?: { IdProgramaGeneralProblemaFactorSubSolucion: number }[];
  SubSoluciones?: { IdProgramaGeneralProblemaFactorSubSolucion: number }[];
}