export interface CampaniaRemarketingGeneral {
  idRemarketingCampaniaGeneral: number;
  nombre: string;
  fechaEnvioProgramada: Date;
  envioConfigurado: string;
  medioEnvio: string;
  estadoEnvio: string;
  usuarioCreacion: string;
  fechaCreacion: Date;
  identificadorLlamadaIA: string;
}

export interface DetallesCampania {
  totalMensajes: number;
  enviados: number;
  abiertos: number;
  rebotados: number;
  estadoAlumnos: {
    idAlumno: number;
    estadoEnvio: string;
    abierto: boolean;
    rebotado: boolean;
    razonRechazo?: string;
    fechaEnvio: Date;
  }[];
}

export interface CombosConfiguracionCampaniaDTO {
  medioEnvio: ElementoConfiguracionCampania[];
  tipoMensaje: ElementoConfiguracionCampania[];
  logicaEnvio: ElementoConfiguracionCampania[];
  categoriaArgumento: ElementoConfiguracionCampania[];
  prioridadesUnicas: number[];
}

export interface ElementoConfiguracionCampania {
  id: number;
  nombre: string;
}

export interface SegmentoCreado {
  id: number;
  nombre: string;
  filtroEjecutado: boolean;
}

export interface CampaniaRemarketingGeneralEditar {
  id: number;
  nombre: string;
  idFiltroSegmento: number;
  tipoMensaje: number;
  logicaEnvio: number;
  remitenteCorreo: string;
  remitenteNombre: string;
  asunto: string;
  envioConfigurado: string;
  fechaEnvioProgramada: Date;
  mediosEnvio: number[];
  categoriaArgumento: number;
  prioridades: number[];
  identificadorLlamadaIA: string;
}

export interface EstadoEjecucionLlamadaIA {
  id_llamada: string;
  total: number;
  pendientes: number;
  finalizados: number;
  en_proceso: number;
  error: string[];
  mensajesGenerados?: MensajeGeneradoIA[];
}

export interface MensajeGeneradoIA {
  identificador_llamada: string;
  fecha_generacion: Date | string;
  id_alumno: number;
  canal: string;
  contenido: string;
  argumentos?: RespuestaArgumentoIA[];
}

export interface RespuestaArgumentoIA {
  numero_argumento: number;
  nombre_argumento: string;
  score_argumento: number;
}

