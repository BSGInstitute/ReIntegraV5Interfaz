export interface IAgendaOperaciones {}
export interface ITabAgendaOperacion {
  tabOperacion: number;
  indexTab: number;
  idTab: number;
  nombreTab: string;
  titleTab: string;
  toggleFiltro: boolean;
  selected: boolean;
  disabled: boolean;
  grid: string;
  prioridad: number;
  visible: boolean;
}
export interface ITabAgendaClasificacionTab {
  id: number;
  codigoMatricula: string;
  agendaTab: string;
  nombreAlumno: string;
  nombreAsignado: string;
}
export interface IParametrosFichaAlumno {
  IdTab: number;
  CodigoAreaTrabajo: string;
  IdAsesor: number;
  IdMatriculaCabecera: number;
}
export interface ITabAgendaClasificacionTabFicha {
  id: number;
  codigoMatricula: string;
  agendaTab: number;
  nombreAlumno: string;
  nombreAsignado: string;
}
export interface ITabAgendaClasificacionTabOut {
  idPersonal: number;
  codigo: string;
}

export interface IAgendaPersonal {
  asignados: Array<IAsignado>;
  datosPersonal: IDatosPersonal;
}

export interface IAsignado {
  activo: boolean;
  email: string;
  id: number;
  nivelVisualizacionAgenda: string;
  nombres: string;
  tipoPersonal: string;
  usuario: string;
}

export interface IDatosPersonal {
  anexo: string;
  anexo3Cx: string;
  areaAbrev: string;
  apellidos: string;
  central: string;
  contrasenaAsterisk: string;
  dominio: string;
  email: string;
  id: number;
  idJefe?: number;
  id3Cx: string;
  nombres: string;
  rol: string;
  tipoPersonal: string;
  password3Cx: string;
  usuarioAsterisk: number;
}

export interface IDatosPersonal {
  anexo: string;
  anexo3Cx: string;
  areaAbrev: string;
  apellidos: string;
  central: string;
  contrasenaAsterisk: string;
  dominio: string;
  email: string;
  id: number;
  idJefe?: number;
  id3Cx: string;
  nombres: string;
  rol: string;
  tipoPersonal: string;
  password3Cx: string;
  usuarioAsterisk: number;
}

export interface IAgendaPersonal {
  asignados: Array<IAsignado>;
  datosPersonal: IDatosPersonal;
}

export interface IAsignado {
  activo: boolean;
  email: string;
  id: number;
  nivelVisualizacionAgenda: string;
  nombres: string;
  tipoPersonal: string;
  usuario: string;
}

export interface IDatosPersonal {
  anexo: string;
  anexo3Cx: string;
  areaAbrev: string;
  apellidos: string;
  central: string;
  contrasenaAsterisk: string;
  dominio: string;
  email: string;
  id: number;
  idJefe?: number;
  id3Cx: string;
  nombres: string;
  rol: string;
  tipoPersonal: string;
  password3Cx: string;
  usuarioAsterisk: number;
}

export interface IDatosPersonal {
  anexo: string;
  anexo3Cx: string;
  areaAbrev: string;
  apellidos: string;
  central: string;
  contrasenaAsterisk: string;
  dominio: string;
  email: string;
  id: number;
  idJefe?: number;
  id3Cx: string;
  nombres: string;
  rol: string;
  tipoPersonal: string;
  password3Cx: string;
  usuarioAsterisk: number;
}


export interface IFiltroEnvioOperaciones {
  idAlumno?: string;
  idAsesor?: string;
  idCentroCosto?: string;
  codigoMatricula?: string;
  nroDocumento?: string;
}


export interface IAddMessage
    {
       id?:string;
       from?:string ;
       value?:string;
       per?:number ;
       nombrepgeneral?:string ;
       codigoAlumno?:string ;
       correo?:string ;
       celular?:string ;
       nombrepgeneralcurso?:string ;
       capitulo?:string;
       sesion?:string ;
       coordinadora?:string ;
       centrocosto?:string ;
       nombreAlumno?:string ;
       idalumno?:number ;
       idMatriculaCabecera?:number;
    }