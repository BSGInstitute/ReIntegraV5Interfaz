export interface ISolicitudCambio {
  cambios: string;
  codigoMatricula: string;
  fecha: Date | string;
  idMatriculaCabecera: number;
  idsCambios: string;
  nombreSolicitante: string;
  observacion: string;
  version: number;
  listaCambios?: string[]
}
