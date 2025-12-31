export interface CampaniaRemarketingGeneral {
  id: number;
  nombre: string;
  fechaEnvioProgramada: Date;
  envioConfigurado: string;
  medioEnvio: string;
  usuarioCreacion: string;
  fechaCreacion: Date;
}

export interface DetallesCampania {
  programados: number;
  aperturas: number;
  clicks: number;
  rebotados: number;
  alumnosContactados: {
    idAlumno: number;
    estadoEnvio: string;
    nombreAlumno: string;
    apertura: boolean;
    click: boolean;
  }[];
}

export interface CombosConfiguracionCampaniaDTO {
  medioEnvio: ElementoConfiguracionCampania[];
  tipoMensaje: ElementoConfiguracionCampania[];
  logicaEnvio: ElementoConfiguracionCampania[];
  argumento: ElementoConfiguracionCampania[];
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

export interface ResultadoGeneracionTexto {
  id: number;
  idAlumno: number;
  nombreAlumno: string;
  pais: string;
  contenidoGenerado: string;
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
  argumentos: number[];
}
