export interface CampaniaGeneralEnvio {
  id: number;
  nombre: string;
  idCategoriaOrigen?: number;
  nroMaximoSegmentos: number;
  cantidadPeriodoSinCorreo: number;
  idProbabilidadRegistroPw: number;
  idFiltroSegmento: number;
  idTipoAsociacion: number;
  idNivelSegmentacion: number;
  idCategoriaObjetoFiltro:number;
  incluyeWhatsapp: boolean;
}

export interface CampaniaTotalEnvio {
  id: number;
  nombre: string;
  idCategoriaOrigen: number;
  fechaEnvio: string;
  idNivelSegmentacion: number;
  idCategoriaObjetoFiltro:number;
  nivelSegmentacion: string;
  idHoraEnvio_Mailing: number;
  idTipoAsociacion: number;
  idProbabilidadRegistroPw: number;
  nroMaximoSegmentos: number;
  cantidadPeriodoSinCorreo: number;
  idTiempoFrecuencia: number;
  idFiltroSegmento: number;
  idPlantilla_Mailing: number;
  idRemitenteMailing: number;
  incluyeWhatsapp: boolean;
  enEjecucion: boolean;
  fechaInicioEnvioWhatsapp: string;
  fechaFinEnvioWhatsapp: string;
  numeroMinutosPrimerEnvio: number;
  idHoraEnvio_Whatsapp: number;
  diasSinWhatsapp: number;
  idPlantilla_Whatsapp: number;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: string;
  fechaModificacion: string;
  listaPrioridades: Array<any>;
  estado:boolean;
}

export interface ActualizarCampania {
  cantidadPeriodoSinCorreo: number;
  diasSinWhatsapp: null;
  enEjecucion: null;
  fechaCreacion: string;
  fechaEnvio: null;
  fechaFinEnvioWhatsap: null;
  fechaInicioEnvioWhatsapp: null;
  fechaModificacion: string;
  id: number;
  idCategoriaOrigen: number;
  idFiltroSegmento: number;
  idHoraEnvio_Mailing: number;
  idHoraEnvio_Whatsapp: null;
  idNivelSegmentacion: null;
  idPlantilla_Mailing: number;
  idPlantilla_Whatsapp: null;
  idProbabilidadRegistroPw: number;
  idRemitenteMailing: number;
  idTiempoFrecuencia: number;
  idTipoAsociacion: number;
  incluyeWhatsapp: null;
  listaPrioridades: null;
  nivelSegmentacion: null;
  nombre: string;
  nroMaximoSegmentos: number;
  numeroMinutosPrimerEnvio: null;
  usuarioCreacion: string;
  usuarioModificacion: string;
}
