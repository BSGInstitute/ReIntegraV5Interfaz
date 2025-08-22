export interface CombosConfiguracionPlantilla {
  plantilaCertificadoConstancia: PlantilaCertificadoConstancia[];
  modalidadCurso: Combo[];
  estadoMatricula: Combo[];
  operadorComparacion: Combo[];
  subEstadoMatricula: SubEstadoMatricula[];
  pais: Combo[];
  beneficioDatoAdicional: Combo[];
}
export interface Combo {
  id: number;
  nombre: string;
}
export interface SubEstadoMatricula {
  id: number;
  nombre: string;
  idEstadoMatricula: number;
}
export interface PlantilaCertificadoConstancia {
  id: number;
  nombre: string;
  idPlantillaBase: number;
}