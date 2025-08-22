export interface ChatWhatsAppMarketing {
  celular: string;
  celularEncriptado: string;
  mensaje: string;
  alumno: string;
  idAlumno: number;
  asesor: string;
  idPersonal: number;
  tipo: number;
  categoría: number;
  proceso: string;
  tab: number;
  tiempo: string;
  fecha: string;
  pais: string;
}

export interface ChatWhatsAppMarketingPorCelular {
  idAlumnoUM: number
  celularUM: string
  celularUMEncriptado: string
  emailUM: string
  emailUMEncriptado: string
  idPaisEmpresa: number
  listaAlumnosPorCelular: ListaAlumnosPorCelular[]
  mensajePorCelular: MensajePorCelular[]
}

export interface ListaAlumnosPorCelular {
  idAlumno: number
  email: string
  fechaCreacion: string
}

export interface MensajePorCelular {
  estatus: number
  tipo: number
  idAlumnoCelular: number
  celular: string
  alumno: string
  mensaje: string
  personal: string
  fechaMensaje: string
}
