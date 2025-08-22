export interface ISolicitudOperacionesPendientes {
  Id: number;
  IdOportunidad: number;
  IdTipoSolicitudOperaciones: number;
  TipoSolicitudOperaciones: string;
  FechaSolicitud: Date;
  IdPersonalSolicitante: number;
  PersonalSolicitante: string;
  IdPersonalAprobacion: number;
  PersonalAprobacion: string;
  ValorAnterior: string;
  ValorNuevo: string;
  FechaInicio: string;
  FechaTermino: string;
  Aprobado: boolean;
  EsCancelado: boolean;
  ComentarioSolicitante: string;
  Observacion: string;
  IdUrlBlockStorage?: number | null;
  UrlBlockStorage: string;
  NombreArchivo: string;
  ContentType: string;
  Realizado?: boolean | null;
  ObservacionEncargado: string;
  FechaAprobacion?: Date | null;
  Usuario: string;
  RelacionEstadoSubEstado?: number | null;
}

export interface ISolicitudOperacionesRealizadas {
  Id: number;
  IdOportunidad: number;
  IdTipoSolicitudOperaciones: number;
  TipoSolicitudOperaciones: string;
  FechaSolicitud: Date;
  IdPersonalSolicitante: number;
  PersonalSolicitante: string;
  IdPersonalAprobacion: number;
  PersonalAprobacion: string;
  ValorAnterior: string;
  ValorNuevo: string;
  FechaInicio: string;
  FechaTermino: string;
  Aprobado: boolean;
  EsCancelado: boolean;
  ComentarioSolicitante: string;
  Observacion: string;
  IdUrlBlockStorage?: number | null;
  UrlBlockStorage: string;
  NombreArchivo: string;
  ContentType: string;
  Realizado?: boolean | null;
  ObservacionEncargado: string;
  FechaAprobacion?: Date | null;
  Usuario: string;
  RelacionEstadoSubEstado?: number | null;
}
