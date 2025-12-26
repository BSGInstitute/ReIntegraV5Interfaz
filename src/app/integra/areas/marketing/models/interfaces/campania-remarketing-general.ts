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
