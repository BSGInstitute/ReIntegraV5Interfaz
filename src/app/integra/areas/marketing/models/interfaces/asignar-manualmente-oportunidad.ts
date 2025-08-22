export interface IAsignacionManulaFiltro {
  filtroAreaCapacitacion: Array<IFiltroBase>;
  filtroCategoriaOrigen: Array<{
    id: number;
    nombre: string;
  }>;
  filtroCentroCosto: Array<IFiltroBase>;

  filtroFaseOportunidad: Array<{
    id: number;
    nombre: string;
    codigo: string;
  }>;
  filtroOperadorComparacion: Array<IFiltroBase>;

  filtroOrigen: Array<{
    id: number;
    nombre: string;
  }>;

  filtroPais: Array<{
    codigo: number;
    nombre: string;
    zonaHoraria: string;
  }>;
  filtroPersonal: Array<{
    id: number;
    nombre: string;
  }>;
  filtroProbabilidad: Array<{
    id: number;
    nombre: string;
  }>;
  filtroSubAreaCapacitacion: Array<{
    id: number;
    idAreaCapacitacion: number;
    nombre: string;
  }>;

  filtroTipoCategoriaOrigen: Array<IFiltroBase>;

  filtroTipoDato: Array<IFiltroBase>;
  filtroPgeneral: Array<{
    id: number;
    nombre: string;
  }>;
}

export interface IFiltroBase {
  codigo?: number;
  considerarEnvioAutomatico?: string;
  id: number;
  modalidad?: string;
  nombre?: string;
  tipoPersonal?: string;
}

export interface IFiltroEnvio {
  filtroAreaCapacitacion: number[];
  filtroCategoriaOrigen: number[];
  filtroCentroCosto: number[];
  filtroFaseOportunidad: number[];
  filtroOperadorComparacion: number[];
  filtroOrigen: number[];
  filtroPais: number[];
  filtroPersonal: number[];
  filtroProbabilidad: number[];
  filtroSubAreaCapacitacion: number[];
  filtroTipoCategoriaOrigen: number[];
  filtroTipoDato: number[];
}
export interface IFiltroAsgnacionManual {}

export interface IFiltroAreaCapacitacion {
  id: number;
  nombre: string;
  modalidad: string;
  codigo: number;
  considerarEnvioAutomatico: string;
  tipoPersonal: string;
}

export interface IFiltroCategoriaOrigen {
  id: number;
  nombre: string;
}

export interface IFiltroCentroCosto {
  id: number;
  nombre: string;
  modalidad: string;
  codigo: number;
  considerarEnvioAutomatico: string;
  tipoPersonal: string;
}

export interface IFiltroFaseOportunidad {
  id: number;
  nombre: string;
  codigo: string;
}

export interface IFiltroOperadorComparacion {
  id: number;
  nombre: string;
  modalidad: string;
  codigo: number;
  considerarEnvioAutomatico: string;
  tipoPersonal: string;
}
export interface IFiltroTipoDato {
  // pu int Id { get; set; }
  // public string Nombre { get; set; }
  // public string Modalidad { get; set; }
  // public string Codigo { get; set; }
  // public bool? ConsiderarEnvioAutomatico { get; set; }
  // public string TipoPersonal { get; set; }
}
export interface IFiltroaPrograma {
  id: number;
  nombre: string;
}
export interface IAsiganacionManualData {
  id: number;
  total: number;
  idCentroCosto: number;
  centroCosto: string;
  asesor: string;
  idPersonal: number;
  idTipoDato: number;
  idFaseOportunidad: number;
  idOrigen: number;
  idAlumno: number;
  contacto: string;
  email: string;
  fechaRegistroCampania: string;
  categoria: string;
  areaCapacitacion: string;
  subAreaCapacitacion: string;
  nombreGrupo: string;
  areaFormacion: string;
  cargo: string;
  industria: string;
  areaTrabajo: string;
  probabilidadSegundo: string;
  nombreSegundo: string;
  nombreCampania: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  usuarioModificacion: string;
  ultimaFechaProgramada: Date;
  idEstadoOportunidad: number;
  estadoOportunidad: string;
  probabilidadActual: string;
  nroOportunidades: number;
  nroSolicitud: number;
  nroSolicitudPorArea: number;
  nroSolicitudPorSubArea: number;
  nroSolicitudPorProgramaGeneral: number;
  nroSolicitudPorProgramaEspecifico: number;
  diasSinContactoManhana: number;
  diasSinContactoTarde: number;
  nombrePais: string;
}

export interface IFiltroEnvioObtener {
  filtro: {
    area: string;
    asesores: string;
    categorias: string;
    centrosCosto: string;
    contacto: string;
    email: string;
    fasesOportunidad: string;
    fechaFin: string;
    fechaInicio: string;
    fechaProgramacionFin: string;
    fechaProgramacionInicio: string;
    idOperadorComparacionNroOportunidades?: number;
    idOperadorComparacionNroSolicitud?: number;
    idOperadorComparacionNroSolicitudPorArea?: number;
    idOperadorComparacionNroSolicitudPorProgramaEspecifico?: number;
    idOperadorComparacionNroSolicitudPorProgramaGeneral?: number;
    idOperadorComparacionNroSolicitudPorSubArea?: number;
    nroOportunidades?: number;
    nroSolicitud?: number;
    nroSolicitudPorArea?: number;
    nroSolicitudPorProgramaEspecifico?: number;
    nroSolicitudPorProgramaGeneral?: number;
    nroSolicitudPorSubArea?: number;
    pais: string;
    probabilidad: string;
    programa: string;
    subArea: string;
    tipoCategoriaOrigen: string;
    tiposDato: string;
    usuarioModificacion: string;
    ventaCruzada: string;
  };
  filter?: {
    filters: {
      field: string;
      operator: string;
      value: string;
    };
    logic: string;
  };
  paginador: {
    page: number;
    pageSize: number;
    skip: number;
    take: number;
  };
}

export interface IFormFiltro {
  asesores: number[];
  centroCosto: number[];
  tipoDato: number[];
  programa: number[];
  area: number[];
  subArea: number[];
  faseOportunidad: any[];
  fechaInicio: Date;
  fechaFin: Date;
  categoriaDato: number[];
  filtroContacto: string;
  probabilidadActual: number[];
  filtroUsuario: number;
  filtroEmail: string;
  fechaProgramada?: Date;
  grupo: number[];
  pais: number[];
  ventaCruzada: string;
  solicitudInformacion: number;
  solicitudArea: number;
  fechaProgramacionInicio?: Date;
  fechaProgramacionFin?: Date;
  nroSolicitudInformacion?: number;
  nroSolicitudArea?: number;
  nroOportunidades?:number;


  idOperadorComparacionNroOportunidades?: number;
  nroSolicitud?: number;
  idOperadorComparacionNroSolicitud?:number;
  nroSolicitudPorArea?:number;
  idOperadorComparacionNroSolicitudPorArea?:number;
  nroSolicitudPorSubArea?: number;
  idOperadorComparacionNroSolicitudPorSubArea?:number;
  nroSolicitudPorProgramaGeneral?:number;
  idOperadorComparacionNroSolicitudPorProgramaGeneral?:number;
  nroSolicitudPorProgramaEspecifico?:number;
  idOperadorComparacionNroSolicitudPorProgramaEspecifico?:number;

}

export interface IFormAsignarAsesor {
  centroCosto: number[];
  asesor: number[];
  fechaProgramada: Date;
  segunMejorPro: boolean;
  idOportunidades: '';
}

export interface IFormAsiganarAsesorObtner {
  idAsesor: string;
  fechaProgramada: Date;
  idCentroCosto: string;
  segunMejorPro: boolean;
}
