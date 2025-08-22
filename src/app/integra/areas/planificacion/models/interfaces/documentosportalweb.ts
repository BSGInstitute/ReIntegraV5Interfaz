import { KendoGrid } from "@shared/models/kendo-grid";

export interface IDocumentosPortaWeb {
    id: number;
    nombre: string;
    idPlantillaPw: number;
    estadoFlujo: number;
    asignado?: boolean;
}
export interface SeccionPlantillaPw {
    id: number;
    nombre: string;
    descripcion: string;
    contenido: string;
    idPlantillaPw: number;
    idPlantilla: number;
    idSeccionMaestraPw: number;
    visibleWeb: boolean;
    zonaWeb: number;
    ordenEeb: number;
    idSeccionTipoDetallePw?: number
    titulo: string;
    posicion: number;
    tipo: number;
    idSeccionTipoContenido: number;
    nombreSeccionTipoContenido: string;
    listaSubSeccionesPw?: ListaSubSeccionesPw[];
    //Otros
    idGrid: string;
    grid: KendoGrid;
    piePagina: string;
    cabecera: string;
}
export interface ListaSubSeccionesPw {
    field: string;
    idSeccionTipoDetallePw: number;
    nombreSubSeccion?: string;
    idSubSeccionTipoContenido: number;
    contenidoSubSeccion: any;
    numeroFila: number;
}
export interface DocumentoSeccionPw {
    id: number;
    titulo: string;
    cabecera: string;
    piePagina: string;
    visibleWeb: boolean;
    zonaWeb: number;
    ordenEeb: number;
    contenido: string;
    idPlantillaPW: number;
    posicion: number;
    tipo: number;
    idDocumentoPW: number;
    idSeccionPW: number;
    idSeccionTipoContenido: number;
    columnasDocumento: ColumnasReporte[];
    listaSubSeccionesPw: SubSeccionTipoDetallePw[];
    listaData: any;
}
export interface SubSeccionTipoDetallePw {
    idSeccionTipoDetallePw: number;
    nombreSubSeccion?: string;
    idSubSeccionTipoContenido: number;
    contenidoSubSeccion: string;
    numeroFila: number;
}
export interface ColumnasReporte {
    field: string;
    title: string;
}
export interface SeccionPwFiltroPlantillaPw {
    id: number
    contenido: string
    titulo: string
    cabecera: string
    piePagina: string
    idPlantillaPw: number
    idPlantilla: number
    posicion: number
    tipo: number
    idSeccionMaestroPw: number
    zonaWeb: number
    visibleWeb: boolean
    ordenEeb: number
    idSeccionTipoDetallePw?: number
    idSeccionPW: number
    idSeccionTipoContenido?: number
    listaGridListaSecciones?: ListaGridListaSecciones[]
    //Extra
    nombre?: string
    descripcion?: string
    idSubSeccionTipoContenido?: number
    nombreSeccionTipoContenido?: string
    nombreSubSeccion?: string
}
export interface ListaGridListaSecciones {
    clave: string;
    valor: string;
    numeroFila?: number;
}
export interface EnvioDocumento {
    objetoDocumento: IDocumentosPortaWeb
    lista: SeccionPwFiltroPlantillaPw[]
    listaIntroduccionBeneficios : Array<VersionDocumentoBeneficio>
}
export interface DocumentoPw {
    nombre: string
    idPlantillaPw: number
    estadoFlujo: number
    asignado: boolean
    pGeneralDocumentoPws: any
    documentoSeccionPws: DocumentoSeccionPw[]
    bandejaPendientePws: any[]
    id: number
    fechaCreacion: string
    fechaModificacion: string
    estado: boolean
    usuarioCreacion: string
    usuarioModificacion: string
    rowVersion: string
  }
  
  export interface DocumentoSeccionPw {
    titulo: string
    contenido: string
    idPlantillaPw: number
    posicion: number
    tipo: number
    idDocumentoPw: number
    idSeccionPw: number
    visibleWeb: boolean
    zonaWeb: number
    ordenWeb: number
    idSeccionTipoDetallePw: any
    numeroFila: any
    cabecera: string
    piePagina: string
    id: number
    fechaCreacion: string
    fechaModificacion: string
    estado: boolean
    usuarioCreacion: string
    usuarioModificacion: string
    rowVersion: string
  }


  export interface VersionDocumentoBeneficio {
    IdVersionPrograma:number
    
    introduccion:string
  }