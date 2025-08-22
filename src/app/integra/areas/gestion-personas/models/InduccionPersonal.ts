export interface ComboInduccionPersonal {
  listaAreas:    ListaAreas[];
  listaSedes:    ListaSedes[];
  listaProcesos: ListaProcesos[];
}

export interface ListaAreas {
  id:     number;
  nombre: string;
}
export interface ListaSedes {
  id:     number;
  nombre: string;
}
export interface ListaProcesos {
  id:     number;
  nombre: string;
}


export interface ReporteInduccionPersonal {
  fechaIncoorporacion: Date;
  fechaRealizado:      Date;
  idSede:              number;
  nombreSede:          string;
  idArea:              number;
  nombreArea:          string;
  idPuestoTrabajo:     number;
  nombrePuestoTrabajo: string;
  idProcesoSeleccion:  number;
  nroDocumento:        string;
  idPostulante:        number;
  nombrePostulante:    string;
  idCursoCalificacion: IDCursoCalificacion[];
  promedioGeneral:     number;
}

export interface IDCursoCalificacion {
  ordenFilaSesion: number;
  calificacion:    number;
}

export interface FormFiltroInduccion {
  IdArea : number;
  IdSede : number;
  IdProcesoSeleccion : number;
  FechaInicio: Date;
  FechaFin: Date;
}
