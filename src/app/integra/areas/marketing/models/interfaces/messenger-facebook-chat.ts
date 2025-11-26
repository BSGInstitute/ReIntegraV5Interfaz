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

export interface EnviarMensajeTextoMessengerFacebook {
  PSID: string;
  IdMessengerConfiguracionPagina?: number | null;
  TipoMensaje: string;
  Contenido?: string | null;
  TipoAdjunto?: string | null;
  URLAdjunto?: string | null;
  MId?: string | null;
  IdAlumno?: number | null;
  IdPersonal?: number | null;
  UsuarioCreacion?: string | null;
}

export interface DatosGeneralesAlumno {
  idAlumno: number;
  email: string;
  oportunidades: OportunidadDatoGeneral[];
  fechaModificacionAlumno: Date;
}
export interface OportunidadDatoGeneral {
  idOportunidad: number;
  fechaModificacionOportunidad: Date;
}
