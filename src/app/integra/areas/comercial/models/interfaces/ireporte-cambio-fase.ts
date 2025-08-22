export interface IReporteCambioFase {
  controlCambiodeFase: Array<IControlCambioFase>;
  reporteCambiosDeFaseOportunidad: Array<IReporteCambioFaseOportunidad>;
  reporteCambiosDeFaseOportunidadConLlamada: Array<IReporteCambioFaseOportunidad>;
  reporteCambiosDeFaseOportunidadSinLlamada: Array<IReporteCambioFaseOportunidad>;
  reporteControlRN1yRN2: Array<IReporteCambioFaseOportunidad>;
  reporteMetasObtenerTotalIS: number;
}
export interface IReporteCambioFaseV2 {
  actividadVencidaporTab: Array<IActividadVencidaPorTab>;
  controlCambiodeFase?: Array<IControlCambioFase>;
  ejecutadasSinCambiodeFase?: Array<IEjecutadaSinCambioFase>;
  reporteCalidadProcesamiento?: Array<IReporteCalidadProcesamiento>;
  reporteCambiosDeFaseOportunidad?: Array<IReporteCambioFaseOportunidad>;
  reporteCambiosDeFaseOportunidadConLlamada?: Array<IReporteCambioFaseOportunidad>;
  reporteCambiosDeFaseOportunidadSinLlamada?: Array<IReporteCambioFaseOportunidad>;
  reporteControlBICYE?: Array<IReporteCambioFaseOportunidad>;
  reporteControlRN1yRN2?: Array<IReporteCambioFaseOportunidad>;
  reporteMetasObtenerTotalIS: number;
  reporteTasaContacto?: IReporteTasaContacto;
  reporteTasaContactoRn2?: IReporteTasaContacto;
  reporteTasaContactoConySinLlamada?: IReporteTasaContactoConySinLlamada;
  reporteTasaContactoConySinLlamadaRn2?: IReporteTasaContactoConySinLlamada;
  reporteTasaDeCambio: {
    reporteTasaDeCambioMensual: Array<IReporteTasaCambio>;
    reporteTasaDeCambioSemanal: Array<IReporteTasaCambio>;
  };
}

export interface IActividadVencidaPorTab {
  detalle: Array<{ dia: string; estado: string; total: string }>;
  dia: string;
}
export interface ReporteV2Integra{
  ejecutadasSinCambiodeFase?: Array<IEjecutadaSinCambioFase>;
  actividadVencidaporTab: Array<IActividadVencidaPorTab>;
  reporteTasaDeCambio: {
    reporteTasaDeCambioMensual: Array<IReporteTasaCambio>;
    reporteTasaDeCambioSemanal: Array<IReporteTasaCambio>;
  };
}
// ReporteCambioDeFaseDataDTO
// ReporteCambioDeFaseDataDTO
export interface IReporteV2IntegraCambioFase {
  
  controlCambiodeFase?: Array<IControlCambioFase>;
  ejecutadasSinCambiodeFase?: Array<IEjecutadaSinCambioFase>;
  reporteCalidadProcesamiento?: Array<IReporteCalidadProcesamiento>;
  reporteCambiosDeFaseOportunidad?: Array<IReporteCambioFaseOportunidad>;
  reporteCambiosDeFaseOportunidadConLlamada?: Array<IReporteCambioFaseOportunidad>;
  reporteCambiosDeFaseOportunidadSinLlamada?: Array<IReporteCambioFaseOportunidad>;
  reporteControlBICYE?: Array<IReporteCambioFaseOportunidad>;
  reporteControlRN1yRN2?: Array<IReporteCambioFaseOportunidad>;
  reporteMetasObtenerTotalIS: number;
  reporteTasaContacto?: IReporteTasaContacto;
  reporteTasaContactoConySinLlamada?: IReporteTasaContactoConySinLlamada;
  reporteTasaContactoConySinLlamadaRn2?: IReporteTasaContactoConySinLlamada;
  reporteTasaContactoRn2?: IReporteTasaContacto;
  reporteTasaDeCambio: {
    reporteTasaDeCambioMensual: Array<IReporteTasaCambio>;
    reporteTasaDeCambioSemanal: Array<IReporteTasaCambio>;
  };
}

export interface IReporteCalidadProcesamientoCambioFase {
  conteoDatosFase: Array<{
    fase: string;
    inicio: number;
    momento: number;
  }>;
  diferenciaLlamadasBloque: Array<{
    valuecantidad: number;
    descripcion: string;
  }>;
  // reporteCalidadProcesamiento: Array<ICalidadProcesamiento>;
  reporteCalidadProcesamiento: Array<ICalidadProcesamientoAlterno>;
  fechaConteoInicio?: Date;
  fechaConteoMomento?: Date;
}

export interface ICalidadProcesamiento {
  datosAsesor: string;
  fecha: Date | string;
  nombreFase: string;
  promedioBeneficios: number;
  promedioCompetidores: number;
  promedioHistorialFinanciero: number;
  promedioPEspecifico: number;
  promedioPGeneral: number;
  promedioPerfil: number;
  promedioProblemaSeleccionados: number;
  promedioProblemaSolucionados: number;
  registros: number;
}

export interface ICalidadProcesamientoAlterno {
    datosAsesor: string;
    nombreFase: string;
    registros?: number;
    promedioPerfil: number;
    promedioDNI: number;
    promedioSentinel: number;
    promedioPGeneralMotivacion: number;
    promedioPublicoObjetivo: number;
    promedioPrerequisitoPrograma: number;
    promedioRequisitoCertificacion: number;
    promedioBeneficios: number;
    promedioInicioPrograma: number;
    promedioCompetidores: number;
    promedioProblemaSeleccionados: number;
    promedioProblemaSolucionados: number;
    promedioHistorialFinanciero: number;
}

export interface IReporteTasaCambio {
  descuento: number;
  descuentoPromedio: number;
  estadoAsesor: boolean;
  iR_IM: number;
  idAsesor: number;
  idCodigoPais: number;
  ingresoMes: number;
  ingresoMeta: number;
  ingresoReal: number;
  meta: number;
  nombres: string;
  oportunidadesOCAnyIS: number;
  oportunidadesOCTotal: number;
  pP_IM_USD: number;
  pP_OC_USD: number;
  porcentajeIngresoMes: number;
  precioListaFinal: number;
  precioPromedio: number;
  precioSinDesc: number;
  tcMeta: number;
  tcReal: number;
  tcReal_TCMeta: number;
}
export class ReporteTasaCambio implements IReporteTasaCambio{
  descuento: number = 0;
  descuentoPromedio: number = 0;
  estadoAsesor: boolean = true;
  iR_IM: number = 0;
  idAsesor: number = 0;
  idCodigoPais: number = 0;
  ingresoMes: number = 0;
  ingresoMeta: number = 0;
  ingresoReal: number = 0;
  meta: number = 0;
  nombres: string = '';
  oportunidadesOCAnyIS: number = 0;
  oportunidadesOCTotal: number = 0;
  pP_IM_USD: number = 0;
  pP_OC_USD: number = 0;
  porcentajeIngresoMes: number = 0;
  precioListaFinal: number = 0;
  precioPromedio: number = 0;
  precioSinDesc: number = 0;
  tcMeta: number = 0;
  tcReal: number = 0;
  tcReal_TCMeta: number = 0;
}
export interface IControlCambioFase {
  actividadesEjecutadas: number;
  actividadesProgramadasAutomaticas: number;
  actividadesProgramadasManuales: number;
  actividadesTotales: number;
  contactabilidad: number;
  faseOrigen: string;
  idFaseOrigen: number;
  minPromedioEjecutadas: number;
  minPromedioprogramadasmanuales: number;
  numIntentoLlamadasPromedio: number;
  orden: number;
  programadasEjecutadasSinLlamada: number;
  totalTimbradoAutomatica?: number;
}
export interface IEjecutadaSinCambioFase {
  cuatro: number;
  // diaActual?: number;
  dos: number;
  // duracionContesto?: number;
  // duracionLlamadaultimaActividad?: number;
  faseOrigen: string;
  idFaseOrigen: number;
  masDeCuatro: number;
  orden: number;
  tiempoTotal: number;
  tres: number;
  uno: number;
}
export interface IReporteCalidadProcesamiento {
  datosAsesor: string;
  fecha: Date;
  nombreFase: string;
  promedioBeneficios: number;
  promedioCompetidores: number;
  promedioHistorialFinanciero: number;
  promedioPerfil: number;
  promedioPEspecifico: number;
  promedioPGeneral: number;
  promedioProblemaSeleccionados: number;
  promedioProblemaSolucionados: number;
  registros?: number;
}
export interface IReporteCalidadProcesamiento {
  faseDestino: string;
  faseOrigen: string;
  indicadorLanzamiento: number;
  metaLanzamiento: number;
  numero: number;
  numeroRegistros: number;
  tipoDato: string;
}
export interface IReporteCambioFaseOportunidad {
  faseDestino: string;
  faseOrigen: string;
  indicadorLanzamiento: number;
  metaLanzamiento: number;
  numero?: number;
  numeroRegistros: number;
  tipoDato: string;
}
export interface IReporteTasaContacto {
  totalLlamadas: number;
  totalLlamadasEjecutadas: number;
  totalLlamadasEjecutadasConLlamada: number;
} 
export interface IReporteTasaContactoConySinLlamada {
  cambiosFaseConLlamada: number;
  cambiosFaseTotal: number;
  cambiosFaseSinLlamada: number;
  cambiosFaseOCconLlamada: number;
  cambiosFaseOCsinLlamada: number;
}
export interface IReporteTasaContactoAmbos{
  reporteTasaContacto :IReporteTasaContacto,
  reporteTasaContactoConySinLlamada:IReporteTasaContactoConySinLlamada
}
export interface IComboReporteCambioFase {
  centroCostos: Array<{ id: number; nombre: string }>;
  asesores: Array<IComboAsesor>;
}
export interface IComboAsesor {
  activo?: boolean;
  estado?: boolean;
  id: number;
  idJefe?: number;
  nombreCompleto: string;
}
export interface IFormFiltro {
  asesores: Array<number>;
  centroCosto: Array<number>;
  estadoPersonal: boolean;
  fechaInicio: Date;
  fechaFin: Date;
  acumulado: boolean;
}
export class ControlCambioFase implements IControlCambioFase {
  actividadesEjecutadas: number = 0;
  actividadesProgramadasAutomaticas: number = 0;
  actividadesProgramadasManuales: number = 0;
  actividadesTotales: number = 0;
  contactabilidad: number = 0;
  faseOrigen: string = '';
  idFaseOrigen: number = 0;
  minPromedioEjecutadas: number = 0;
  minPromedioprogramadasmanuales: number = 0;
  numIntentoLlamadasPromedio: number = 0;
  orden: number = 0;
  programadasEjecutadasSinLlamada: number = 0;
  totalTimbradoAutomatica: number = 0;
}

export class CalidadProcesamiento implements ICalidadProcesamiento {
  datosAsesor: string= '';
  fecha: Date | string = '0001-01-01T00:00:00';
  nombreFase: string;
  promedioBeneficios: number = 0;
  promedioCompetidores: number = 0;
  promedioHistorialFinanciero: number = 0;
  promedioPEspecifico: number = 0;
  promedioPGeneral: number = 0;
  promedioPerfil: number = 0;
  promedioProblemaSeleccionados: number = 0;
  promedioProblemaSolucionados: number = 0;
  registros: number = 0;
}

export class CalidadProcesamientoAlterno implements ICalidadProcesamientoAlterno {
  datosAsesor: string = '';
  nombreFase: string = '';
  registros?: number = 0;
  promedioPerfil: number = 0;
  promedioDNI: number = 0;
  promedioSentinel: number = 0;
  promedioPGeneralMotivacion: number = 0;
  promedioPublicoObjetivo: number = 0;
  promedioPrerequisitoPrograma: number = 0;
  promedioRequisitoCertificacion: number = 0;
  promedioBeneficios: number = 0;
  promedioInicioPrograma: number = 0;
  promedioCompetidores: number = 0;
  promedioProblemaSeleccionados: number = 0;
  promedioProblemaSolucionados: number = 0;
  promedioHistorialFinanciero: number = 0;
}

export interface IReporteLlamadaActividad {
  // reporteLlamadaReprogramacionCambioFase: ILlamadaObservada[]
  reporteActividadEjecutadaLlamadaObservada: ILlamadaObservada[]
  acumuladoTiempoContactoEfectivo: IAcumuladoTiempoContactoEfectivo[]
  acumuladoLlamadasReprogramadasManualmente: ILlamadaObservada[]
  actividadEjecutadaFaseActual: IActividadEjecutadaFaseActual[]
}

export interface ILlamadaObservada {
  caso: string
  faseOportunidad: string
  cantidad: number
}

export interface IAcumuladoTiempoContactoEfectivo {
  faseOportunidad: string
  tiempoContacto: string
  total: number
}

export interface IActividadEjecutadaFaseActual {
  faseOportunidad: string
  caso: string
  cantidad: number
  promedioLlamada: number
}

//Conteo Datos Fase
export interface ConteoDatosFasePais {
  idPais: number
  pais: string
  fechaInicio: string | Date;
  fechaMomento: string
  conteoDatosFase: ConteoDatosFase[]
}

export interface ConteoDatosFase {
  fase: string
  inicio: number
  momento: number
}

export interface ItemConteoFasePais{
    fase: string;
    inicioPeru: number;
    momentoPeru: number;
    inicioColombia: number;
    momentoColombia: number;
    inicioMexico: number;
    momentoMexico: number;
    inicioChile: number;
    momentoChile: number;
    inicioOtros: number;
    momentoOtros: number;
    inicioTotal: number;
    momentoTotal: number;
}