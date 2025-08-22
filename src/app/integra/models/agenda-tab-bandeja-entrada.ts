
export interface AgendaTabFiltroKendo{
     page : number,
     pageSize : number,
     skip : number,
     take : number,
     idAsesor : number,
     folder : string ,
     tipoCorreos : string ,
     filtroKendo : AgendaTabCorreoRecibidoEnvioFiltroKendo
}
export interface AgendaTabCorreoRecibidoEnvioFiltroKendo{
  filters : AgendaTabCorreoRecibidoEnvioFiltro[]
  logic : string 
}
export interface AgendaTabCorreoRecibidoEnvioFiltro{
    operator : string ,
    field : string ,
    value : string 
}

export interface AgendaTabFiltroKendoRecibido{
   listaCorreos : AgendaTablistaCorreoRecibido[],
   totalEnviados : number
  
}
export interface AgendaTablistaCorreoRecibido{

  id : number,
  asunto : string ,
  fecha :  string ,
  remitente : string,
  destinatarios :  string ,
  from :  boolean ,
  seen : boolean,
  conCopia : string
}

export interface GetInformacionGmailEnvio {
  IdCorreo : number,
  IdAsesor : number,
  Folder : string
}

export interface GetInformacionGmailRespuesta{

  archivosAdjuntos: ArchivosAdjuntos,
  emailBody: string
}

export interface ArchivosAdjuntos{
  id:number,
  idCorreo: number,
  nombreArchivo:string,
  urlArchivoRepositorio: string
}

export interface ComboPlantillaMailing{
  data: data;
}

export interface data {
  idPlantilla: number,
  nombre:string,
  valor: string
}

