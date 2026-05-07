export interface ChatWhatsAppMarketing {
  celular: string;
  mensaje: string;
  alumno: string;
  idAlumno: number;
  asesor: string;
  idPersonal: number;
  tipo: number;
  proceso: string;
  tab: number;
  tiempo: string;
  fecha: string;
  pais: string;
  idPaisEmpresa?: number;
  numeroWhatsApp?: string;
  rango?: string | null;
  estadoInteraccion?: string | null;
  requiereDerivacion?: boolean | null;
  mensajeParaAsesor?: string | null;
  tipoMensajeDetectado?: string | null;
}

export interface ChatWhatsAppMarketingPorCelular {
  idAlumnoUM: number;
  celularUM: string;
  celularUMEncriptado: string;
  emailUM: string;
  emailUMEncriptado: string;
  idPaisEmpresa: number;
  listaAlumnosPorCelular: ListaAlumnosPorCelular[];
  mensajePorCelular: MensajePorCelular[];
  rango?: string | null;
  idPersonal?: number | null;
}

export interface ListaAlumnosPorCelular {
  idAlumno: number;
  email: string;
  fechaCreacion: string;
}

export interface MensajePorCelular {
  estatus: number;
  tipo: number;
  idAlumnoCelular: number;
  celular: string;
  alumno: string;
  mensaje: string;
  personal: string;
  fechaMensaje: string;
}
