export interface FormularioRespuesta{

  id:number;
  nombre:string;
  codigo:string;
  idPgeneral:number;
  programaGeneral:string;
  usuarioModificacion: string;
  fechaModificacion: Date | string;

}

export interface FormularioRespuestaCombo {
 id: number;
 nombre: string
}
// POST PUT
export interface FormularioRespuestaEnvio  {
  id:number;
  nombre:string;
  codigo:string;
  idPgeneral:number;
  programaGeneral:string;
  usuarioModificacion: string;
  fechaModificacion: Date | string;
}
