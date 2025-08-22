export interface DatosAlumnoWhatsapp {
  obtenerAtributosAlumno?: AlumnoWhatsapp;
  historialAlumno?: HistorialAlumno[];
}

export interface AlumnoWhatsapp {
  id?: number;
  nombre1?: string;
  nombre2?: string;
  celular?: string;
  celular2?: string;
  telefono?: string;
  dni?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  email1?: string;
  email2?: string;
  idIndustria?: number;
  idTamanioEmpresaAgenda?: number;
  idAFormacion?: number;
  idATrabajo?: number;
  idCargo?: number;
  desuscrito?: boolean;
  archivado?: boolean;
}

export interface HistorialAlumno {
  idOportunidad?: number;
  idAlumno?: number;
  celularWhatsApp?: string;
  idCampaniaGeneralDetalleWhatsApp?: number;
  idCentroCosto?: number;
  tipo?: string;
  categoria?: string;
  fechaCreacion?: string;
  chatValido?: string;
  chatInValido?: string;
  chatOportunidad?: string;
}
