export interface IReporteActividadRealizada {
    codigoFaseFinal: string;
    codigoFaseOrigen: string;
    comentarioActividad: string;
    estadoOcurrencia: string;
    estadosTresCX: string;
    existeLlamadaExitosa: false;
    fechaLlamada?: string;
    fechaProgramada: Date | string;
    fechaReal: Date | string;
    idActividad: number;
    idAlumno: number;
    idFaseOportunidadInicial?: number;
    idOportunidad: number;
    mayorTiempo: number;
    minutosIntervale: number;
    minutosTotalContesto: number;
    minutosTotalIntervaleLlamadas: number;
    minutosTotalPerdido: number;
    minutosTotalTimbrado: number;
    nombreActividadCabecera: string;
    nombreCategoriaOrigen: string;
    nombreCentroCosto: string;
    nombreCompletoAsesor: string;
    nombreCompletoContacto: string;
    nombreGrabacionIntegra: Array<{
      funcion: string;
      nombreGrabacion: string;
    }>;
    nombreGrabacionTresCX?: string;
    nombreGrupo: string;
    nombreOcurrencia: string;
    ocurrenciaPadre: string;
    nombreOrigen: string;
    nombreTipoDato: string;
    probabilidadActual: string;
    tiemposDuracionLlamadas: null;
    tiemposTresCX: string;
    totalAsignacionManual: number;
    totalEjecutadas: number;
    totalNoEjecutadas: number;
  
    colorRow?: string;
    colorTexto?: string;
    minutosReal?: number;
    condigomatricula?: string
  }
  
  export interface IReporteActividadRealizadaFiltro {
    idEstadoOcurrencia?: number;
    idAlumno?: number;
    idAsesor: number;
    idFasesOportunidadOrigen: Array<number>;
    idFasesOportunidadDestino: Array<number>;
    idTipoDato?: number;
    fecha: string;
    idCentroCosto?: number;
    estadoLlamada?: number;
    idTipoCategoriaOrigen?: number;
    idProbabilidadActual?: number;
    horaInicio: number;
    minutosInicio: number;
    horaFin: number;
    minutosFin: number;
    estadoFiltroHora: boolean;
    estadoPersonal?: number;
    idEstadoMatricula?: number;
    idSubestadoMatricula?: number;
  }
  
  export interface IFormFiltro {
    asesor: number;
    estado: any;
    contacto: any;
    estadaPersonal: any;
    faseOrigen: any;
    faseDestino: any;
    centroCosto: string;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    filtroPorHora: boolean;
  }
  
  export interface IComboReporteActividadesRealizadas {
    asesores: Array<IAsesor>;
    asistentesActivos: Array<IAsistentesActivos>;
    asistentesInactivos: Array<IAsistentesInactivos>;
    asistentesTotales: Array<IAsistentesTotales>;
    categoriaOrigen: Array<ICategoriaOrigen>;
    estadoMatricula?: Array<IEstadoMatricula>;
    estadoOcurrencia: Array<IEstadoOcurrencia>;
    faseOportunidad: Array<IFaseOportunidad>;
    probabilidad: Array<IProbabilidad>;
    subEstadoMatricula?: Array<ISubEstadoMatricula>;
    tipoDato: Array<ITipoDato>;
  }
  export interface IAsesor {
    activo: boolean;
    email: string;
    id: number;
    nivelVisualizacionAgenda?: string;
    nombres: string;
    tipoPersonal?: string;
    usuario?: string;
  }
  export interface IAsistentesActivos {
    activo: boolean;
    email: string;
    id: number;
    nivelVisualizacionAgenda?: string;
    nombres: string;
    tipoPersonal?: string;
    usuario?: string;
  }
  export interface IAsistentesInactivos {
    activo: boolean;
    email: string;
    id: number;
    nivelVisualizacionAgenda?: string;
    nombres: string;
    tipoPersonal?: string;
    usuario?: string;
  }
  export interface IAsistentesTotales {
    activo: boolean;
    email: string;
    id: number;
    nivelVisualizacionAgenda?: string;
    nombres: string;
    tipoPersonal?: string;
    usuario?: string;
  }
  export interface ICategoriaOrigen {
    id: number;
    nombre: string;
  }
  export interface IEstadoOcurrencia {
    id: number;
    nombre: string;
  }
  export interface IFaseOportunidad {
    codigo: string;
    id: number;
    nombre: string;
  }
  export interface IProbabilidad {
    id: number;
    nombre: string;
  }
  export interface ITipoDato {
    descripcion: string;
    estado: boolean;
    fechaCreacion: string | Date;
    fechaModificacion: string | Date;
    id: number;
    nombre: string;
    prioridad: number;
    usuarioCreacion: string;
    usuarioModificacion: string;
  }
  
  export interface ISubEstadoMatricula {
    Id: number;
    Nombre: string;
    IdEstadoMatricula: number;
  }
  export interface IEstadoMatricula {
    
    estadoMatricula: string;
    IdEstadoMatricula: number;
  }
  