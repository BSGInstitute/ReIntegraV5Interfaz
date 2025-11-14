export interface ResumenMessengerFacebookChat {
  identificadorAmbitoPagina: string;
  idAlumno: number | null;
  NnmbreAlumno: string;
  nombrePagina: string;
  tipoMensaje: string;
  contenido: string | null;
  fechaMensaje: Date;
}

export interface ChatMessengerFacebook {
  tipoMensaje: string;
  contenido?: string | null;
  tipoAdjunto?: string | null;
  urlAdjunto?: string | null;
  fechaEvento: string | null;
  esMensajeSaliente: boolean;
  nombrePagina: string;
  idMessengerConfiguracionPagina: number;
}
