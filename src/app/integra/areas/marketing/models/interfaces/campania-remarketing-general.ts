export interface CampaniaRemarketingGeneral {
  id: number;
  nombreCampania: string;
  tipoCampania: string;
  usuarioCreacion: string;
  fechaEnvio: Date;
  cantidad: number;
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
