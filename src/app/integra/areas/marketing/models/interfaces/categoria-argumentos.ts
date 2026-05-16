/** DTO de listado de programas generales activos (pla.T_PGeneral). */
export interface ProgramaGeneralListado {
  id: number;
  nombre: string;
}

export interface ProgramaGeneral {
  id: number;
  nombre: string;
}

export interface CategoriaArgumento {
  id: number;
  nombre: string;
  usuarioModificacion: string;
  fechaModificacion: Date;
}

export interface ProgramaConfiguradoDetalle {
  id: number;
  idProgramaGeneral: number;
  nombrePrograma: string;
  categoriasArgumento: CategoriaArgumentoPorPrograma[];
}
export interface CategoriaArgumentoPorPrograma {
  id: number;
  nombre: string;
  argumentos: Argumento[];
}
export interface Argumento {
  id: number;
  nombre: string;
  descripcion: string;
  prioridad: number;
}
