export interface FormularioSolicitud {


  id:number,
  idFormularioRespuesta:number,
  nombre:string ,
  codigo:string ,
  nombreCampania:string ,
  idCampania:number,
  proveedor:string ,
  idFormularioSolicitudTextoBoton:number,
  tipoSegmento:number,
  codigoSegmento:string ,
  tipoEvento:number,
  //UrlbotonInvitacionPagina:string ,
  usuario:string ,

}
export interface campoContacto{
  Id:number,
  Nombre:string ,
  NroVisitas:number,
  Siempre:boolean,
  Inteligente:boolean,
  Probabilidad:boolean,
}

// POST PUT
export interface FormularioSolicitudEnvio {
  id: number;
  idFormularioRespuesta: number;
  //formularioRespuesta: string;
  nombre: string;
  codigo: string;
  nombreCampania: string;
  idCampania: number;
  proveedor: string;
  idFormularioSolicitudTextoBoton: number;
  tipoSegmento: number;
  codigoSegmento: number;
  tipoEvento: number;


}
