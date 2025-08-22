import { DecimalPipe } from "@angular/common";

export interface InteraccionChatIntegra {


  idPGeneral: number,
  area: string,
  asesor:string,
  chats: number,
  promedio: number,
  errorSignal: number,
  errorCarga: number,
  errorCrear: number,
  tiempo: number,
  activo?: number,
  nroChatsActivos?: number

}

// POST PUT
export interface InteraccionChatIntegraEnvio {
  idPGeneral: number,
  area: string,
  asesor:string,
  chats: number,
  promedio: number,
  errorSignal: number,
  errorCarga: number,
  errorCrear: number,
  tiempo: number,
  activo: number|null,
  nroChatsActivos: number|null

}
