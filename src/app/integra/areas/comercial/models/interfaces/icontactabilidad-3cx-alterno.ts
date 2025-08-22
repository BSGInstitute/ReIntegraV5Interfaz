export interface ReportePersonal {
  id: number;
  nombreCompleto: string;
  activo?: boolean;
  estado?: boolean;
  idJefe?: number;
}
export interface PersonalAsignado {
  id: number;
  nombres: string;
  email: string;
  activo: boolean;
  usuario: string;
  tipoPersonal: string;
  nivelVisualizacionAgenda: string;
}
export interface IReporteContactabilidadDataV2 {
  asesorContactabilidad: Array<ReporteContactabilidad>;
  minutosContactabilidad: Array<ReporteContactabilidadMinutos>;
}
export interface ReporteContactabilidad {
  hora: number;
  clave: string;
  valor: number;
  tipo: number;
  totalLlamadas?: number;
  troncal: string;
  sede: string;
  cantidadIntentos?: number;
  cantidadIntentoEjecutadoUno?: number;
  cantidadIntentoEjecutadoDos?: number;
  cantidadIntentoEjecutadoTres?: number;
  cantidadIntentoEjecutadoMasTres?: number;
  cantidadIntentoNoEjecutadoUno?: number;
  cantidadIntentoNoEjecutadoDos?: number;
  cantidadIntentoNoEjecutadoTres?: number;
  cantidadIntentoNoEjecutadoMasTres?: number;
  duracionIntentoEjecutadoUno?: number;
  duracionIntentoEjecutadoDos?: number;
  duracionIntentoEjecutadoTres?: number;
  duracionIntentoEjecutadoMasTres?: number;
  duracionIntentoNoEjecutadoUno?: number;
  duracionIntentoNoEjecutadoDos?: number;
  duracionIntentoNoEjecutadoTres?: number;
  duracionIntentoNoEjecutadoMasTres?: number;
}
export interface ReporteContactabilidadMinutos {
  pais: string;
  troncal: string;
  segundos: number;
  minutos: number;
  decimal: number;
}
export interface ReporteContactabilidadAlterno{
    hora: number
    clave: string
    valorGeneral: number
    valorIntegra: number
    valor3cx: number
    tipo: number
    totalGeneral: number
    totalIntegra: number
    total3cx: number
    totalIntegra3cx: number
    totalSinLlamada: number
    cantidadIntentos: number
    cantidadIntentosIntegra: number
    cantidadIntentos3cx: number
    cantidadIntentoEjecutadoUno: number
    cantidadIntentoEjecutadoUnoIntegra: number
    cantidadIntentoEjecutadoUno3cx: number
    cantidadIntentoEjecutadoDos: number
    cantidadIntentoEjecutadoDosIntegra: number
    cantidadIntentoEjecutadoDos3cx: number
    cantidadIntentoEjecutadoTres: number
    cantidadIntentoEjecutadoTresIntegra: number
    cantidadIntentoEjecutadoTres3cx: number
    cantidadIntentoEjecutadoMasTres: number
    cantidadIntentoEjecutadoMasTresIntegra: number
    cantidadIntentoEjecutadoMasTres3cx: number
    cantidadIntentoNoEjecutadoUno: number
    cantidadIntentoNoEjecutadoUnoIntegra: number
    cantidadIntentoNoEjecutadoUno3cx: number
    cantidadIntentoNoEjecutadoDos: number
    cantidadIntentoNoEjecutadoDosIntegra: number
    cantidadIntentoNoEjecutadoDos3cx: number
    cantidadIntentoNoEjecutadoTres: number
    cantidadIntentoNoEjecutadoTresIntegra: number
    cantidadIntentoNoEjecutadoTres3cx: number
    cantidadIntentoNoEjecutadoMasTres: number
    cantidadIntentoNoEjecutadoMasTresIntegra: number
    cantidadIntentoNoEjecutadoMasTres3cx: number
    duracionIntentoEjecutadoUno: number
    duracionIntentoEjecutadoUnoIntegra: number
    duracionIntentoEjecutadoUno3cx: number
    duracionIntentoEjecutadoDos: number
    duracionIntentoEjecutadoDosIntegra: number
    duracionIntentoEjecutadoDos3cx: number
    duracionIntentoEjecutadoTres: number
    duracionIntentoEjecutadoTresIntegra: number
    duracionIntentoEjecutadoTres3cx: number
    duracionIntentoEjecutadoMasTres: number
    duracionIntentoEjecutadoMasTresIntegra: number
    duracionIntentoEjecutadoMasTres3cx: number
    duracionIntentoNoEjecutadoUno: number
    duracionIntentoNoEjecutadoUnoIntegra: number
    duracionIntentoNoEjecutadoUno3cx: number
    duracionIntentoNoEjecutadoDos: number
    duracionIntentoNoEjecutadoDosIntegra: number
    duracionIntentoNoEjecutadoDos3cx: number
    duracionIntentoNoEjecutadoTres: number
    duracionIntentoNoEjecutadoTresIntegra: number
    duracionIntentoNoEjecutadoTres3cx: number
    duracionIntentoNoEjecutadoMasTres: number
    duracionIntentoNoEjecutadoMasTresIntegra: number
    duracionIntentoNoEjecutadoMasTres3cx: number
}