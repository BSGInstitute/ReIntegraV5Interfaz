import { NumberSymbol } from "@angular/common";

export interface nivelDeSegmentacion {
    value: string;
    viewValue: string;
  }
  

  export interface tiempo {
    value: string;
    viewValue: string;
  }
  

  export interface programasFiltro{
    id:number,
    idCampaniaGeneralDetalle:number,
    idPgeneral:number,
    nombreProgramaGeneral: string,
    orden:number
}

export interface responsables{
    idPersonal:number,
    id:number,
    idCampaniaGeneralDetalle:number,
    idResponsable:number,
    dia1:number,
    dia2:number,
    dia3:number,
    dia4:number,
    dia5:number,
    total:number,
    estado: boolean,
    usuarioCreacion: string,
    usuarioModificacion: string,
    fechaCreacion: string,
    fechaModificacion: string
}

export interface ProridadesTotal{
id:number,
nombre: string,
idCampaniaGeneral:number,
prioridad:number,
asunto: string,
idPersonal:number,
idCentroCosto:number,
cantidadContactosMailing:number,
cantidadContactosWhatsapp:number,
cantidadSubidosMailChimp:number,
enEjecucion: boolean,
noIncluyeWhatsaap: boolean,
idConjuntoAnuncio:number,
programasFiltro:Array<programasFiltro>,
responsables:Array<responsables>,
areas: Array<any>,
subAreas: Array<any>
urlFormulario: string
}

export interface Filtrado{
  idCampaniaGeneral:number,
  idFiltroSegmento:number,
  usuario:string
}


export interface Filtrado2{
  idCampaniaGeneral:number,
  cantidadDeDias:number,
  usuario:string
}

export interface FiltradoWhats{
  idCampaniaGeneral:number,
  usuario:string
}

export interface ProcesarListasWhatsAppEnvioAutomatico{
  id: number,
  idConjuntoListaDetalle: number,
  nombre: string,
  descripcion: string,
  idPlantilla: number,
  idPersonal: number,
  idConjuntoLista: number,
  programaPrincipal: Array<programaPrincipal>,
  programaSecundario: Array<programaSecundario>
}

export interface programaPrincipal {
  id: number,
      fechaCreacion: Date,
      fechaModificacion:Date,
      estado: boolean,
      usuarioCreacion: string,
      usuarioModificacion: string,
      rowVersion: string,
      idWhatsAppConfiguracionEnvio: number,
      idPgeneral: number,
      idTipoEnvioPrograma: number

}

export interface programaSecundario{
  id: number,
  fechaCreacion:Date,
  fechaModificacion: Date,
  estado: boolean,
  usuarioCreacion: string,
  usuarioModificacion: string,
  rowVersion: string,
  idWhatsAppConfiguracionEnvio: number,
  idPgeneral: number,
  idTipoEnvioPrograma: number
}

export interface PreProcesamientoJson{
  IdCampaniaGeneralDetalle:number,
  Usuario: string,
  ListaResponsableReal: Array<ListaResponsableReal>
}

export interface ListaResponsableReal{
  IdResponsable:number,
  Total:number,
}