export interface ConfiguracionPlantilla {
  id: number;
  idPlantillaFrontal: number;
  idPlantillaPosterior?: number;
  idPlantillaBase: number;
  ultimaFechaRemplazarCertificado?: Date | string;
  remplazarCertificados: boolean;
  detalle: ConfiguracionPlantillaDetalle[];
  nombrePlantillaFrontal: string;
  nombrePlantillaPosterior: string;
}
export interface ConfiguracionPlantillaDetalle {
  id?: number;
  idPgeneralConfiguracionPlantilla: number;
  idModalidadCurso: number;
  idOperadorComparacion?: number;
  notaAprobatoria?: number;
  deudaPendiente: boolean;
  estadosMatricula: number[];
  subEstadosMatricula: number[];
}
