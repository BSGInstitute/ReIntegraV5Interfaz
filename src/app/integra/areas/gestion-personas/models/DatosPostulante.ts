export interface DatosPostulante {
  idPostulante: number;
  nombre: string | null;
  apellidoPaterno: string | null;
  apellidoMaterno: string | null;
  nroDocumento: string | null;
  telefono: string | null;
  celular: string | null;
  email: string | null;
  idTipoDocumento: number | null;
  idPais: number | null;
  idCiudad: number | null;
  idPostulanteProcesoSeleccion: number | null;
  idEstadoProcesoSeleccion: number | null;
  idProcesoSeleccion: number | null;
  procesoSeleccion: string | null;
  fechaRendicionExamen: Date | null;
  fechaEnvioAccesos: Date | null;
  idPostulanteNivelPotencial: number | null;
  idProveedor: number | null;
  idPersonal_OperadorProceso: number | null;
  idConvocatoriaPersonal: number | null;
  idProcesoSeleccionEtapa: number | null;
  idEstadoEtapaProcesoSeleccion: number | null;
  esProcesoAnterior: boolean | null;
  idRespuestas: string | null;
  idSexo: number | null;
  fechaNacimiento: Date | null;
  tieneHijo: boolean | null;
  cantidadHijo: number | null;
  urlPerfilFacebook: string | null;
  urlPerfilLinkedin: string | null;
  codigo: string | null;
  nombreCombocatoria: string | null;
  telefono2: string | null;
  celular2: string | null;
  celular3: string | null;
  email2: string | null;
  email3: string | null;
  edad: number | null;
  idPersonalOperadorProceso: number | null;
  idPaginaReclutadoraPersonal: number | null;
}

export interface IFiltroPostulanteObtener {
  filtro: {
    idPostulante: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    nroDocumento: string;
    telefono: string;
    celular: string;
    email: string;
    idTipoDocumento: number;
    idPais: number;
    idCiudad: number;
    idPostulanteProcesoSeleccion: number;
    idEstadoProcesoSeleccion: number;
    idProcesoSeleccion: number;
    procesoSeleccion: string;
    fechaRendicionExamen: string;
    fechaEnvioAccesos: string;
    idPostulanteNivelPotencial: number;
    idProveedor: number;
    idPersonal_OperadorProceso: number;
    idConvocatoriaPersonal: number;
    idProcesoSeleccionEtapa: number;
    idEstadoEtapaProcesoSeleccion: number;
    esProcesoAnterior: boolean;
    idRespuestas: string;
    idSexo: number;
    fechaNacimiento: string;
    tieneHijo: boolean;
    cantidadHijo: number;
    urlPerfilFacebook: string;
    urlPerfilLinkedin: string;
    codigo: string;
    nombreCombocatoria: string;
    telefono2: string;
    celular2: string;
    celular3: string;
    email2: string;
    email3: string;
    edad: number;
    idPersonalOperadorProceso: number;
    idPaginaReclutadoraPersonal: number;
  };
  filter?: {
    filters: {
      field: string;
      operator: string;
      value: string;
    };
    logic: string;
  };
  paginador: {
    page: number;
    pageSize: number;
    skip: number;
    take: number;
  };
}

export interface ComboPostulante {
  procesoSeleccion: ProcesoSeleccion[];
  procesoSeleccionTotal: ProcesoSeleccionTotal[];
  documento: Documento[];
  pais: Pai[];
  ciudad: Ciudad[];
  sexo: Sexo[];
  estadoProcesoSeleccion: EstadoProcesoSeleccion[];
  //plantillaEmail: PlantillaEmail[];
  //plantillaWhatsApp: PlantillaWhatsApp[];
  listaProveedor: ListaProveedor[];
  listaPersonal: ListaPersonal[];
  listaEtapasProcesoSeleccion: ListaEtapasProcesoSeleccion[];
  listaEstadoEtapas: ListaEstadoEtapa[];
  listaCodigoConvocatoria: ListaCodigoConvocatorum[];
  listaNivelPotencial: ListaNivelPotencial[];
}

export interface ComboPlantillas {
  plantillaEmail: PlantillaEmail[];
  plantillaWhatsApp: PlantillaWhatsApp[];
}

export interface ComboAreaFormacionExperiencia {
  centroEstudio: CentroEstudio[];
  listaEmpresa: ListaEmpresa[];
  cargo: Cargo[];
  industria: Industrum[];
  moneda: Moneda[];
  areaTrabajo: AreaTrabajo[];
  nivel: Nivel[];
  estadoEstudio: EstadoEstudio[];
  areaFormacion: AreaFormacion[];
}

export interface ProcesoSeleccion {
  id: number;
  nombre: string;
  idPuestoTrabajo: number;
  puestoTrabajo: string;
  codigo: string;
  url?: string;
  activo: string;
  idSede: number;
  sede: string;
}

export interface ProcesoSeleccionTotal {
  id: number;
  nombre: string;
  idPuestoTrabajo: number;
  puestoTrabajo: string;
  codigo: string;
  url?: string;
  activo: string;
  idSede: number;
  sede: string;
}

export interface Documento {
  id: number;
  nombre: string;
}

export interface Pai {
  id: number;
  nombre: string;
}

export interface Ciudad {
  id: number;
  codigo: number;
  nombre: string;
  idPais: number;
}

export interface Sexo {
  id: number;
  nombre: string;
}

export interface CentroEstudio {
  id: number;
  nombre: string;
}

export interface ListaEmpresa {
  id: number;
  nombre: string;
}

export interface ComboCentroEstudio {
  id: number;
  nombre: string;
  idPais: number;
  pais: string;
  idCiudad: number;
  ciudad: string;
  idTipoCentroEstudio: number;
  tipoCentroEstudio: string;
}

export interface Cargo {
  id: number;
  nombre: string;
}

export interface Industrum {
  id: number;
  nombre: string;
}

export interface Moneda {
  id: number;
  nombre: string;
  nombreCorto: string;
  nombrePlural: string;
  simbolo: string;
  idPais: number;
}

export interface AreaTrabajo {
  id: number;
  nombre: string;
}

export interface Nivel {
  id: number;
  nombre: string;
}

export interface EstadoEstudio {
  id: number;
  nombre: string;
}

export interface AreaFormacion {
  id: number;
  nombre: string;
}

export interface EstadoProcesoSeleccion {
  id: number;
  nombre: string;
}

export interface PlantillaEmail {
  idPlantilla: string;
  nombrePlantillaBase: string;
}

export interface PlantillaWhatsApp {
  idPlantilla: string;
  nombrePlantillaBase: string;
  descripcion: string;
}

export interface ListaProveedor {
  id: number;
  nombre: string;
}

export interface ListaPersonal {
  id: number;
  nombre: string;
}

export interface ListaEtapasProcesoSeleccion {
  id: number;
  nombre: string;
  idProcesoSeleccion: number;
}

export interface ListaEstadoEtapa {
  id: number;
  nombre: string;
}

export interface ListaCodigoConvocatorum {
  idConvocatoria: number;
  nombreConvocatoria: string;
  idProcesoSeleccion: number;
}

export interface ListaNivelPotencial {
  id: number;
  nombre: string;
}

export interface ListaRespuestaDesaprobatorum {
  idRespuestaDesaprovatoria: number;
  nombre: string;
}

//Formulario
export interface InsertarPostulanteDTO {
  datosPostulanteFormulario: DatosPostulanteFormulario;
  usuario: string;
}

export interface DatosPostulanteFormulario {
  id?: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nroDocumento: string;
  celular?: string;
  email: string;
  idTipoDocumento: number;
  idPais: number;
  idCiudad: number;
  idEstadoProcesoSeleccion: number;
  idProcesoSeleccion: number;
  fechaEnvioAccesos?: string;
  fechaRendicionExamen?: string;
  fechaNacimiento?: string;
  fechaModificacion?: string;
  idPostulanteProcesoSeleccion?: number;
  idPostulanteNivelPotencial?: number;
  idPaginaReclutadoraPersonal?: number;
  idPersonalOperadorProceso?: number;
  idConvocatoriaPersonal?: number;
  idProcesoSeleccionEtapa: number;
  idEstadoEtapaProcesoSeleccion: number;
  urlPerfilFacebook?: string;
  urlPerfilLinkedin?: string;
  listaRespuestaDesaprobatoria?: ListaRespuestaDesaprobatoria[];
  idSexo?: number;
  edad?: number;
  tieneHijo?: boolean;
  cantidadHijo?: number;
}

export interface ListaRespuestaDesaprobatoria {
  idRespuestaDesaprobatoria: number;
  nombre: string;
  id?: number;
}

export interface Mensaje {
  mensaje: string;
  valor: boolean;
}

export interface PostulanteExperiencia {
  id?: number;
  idPostulante?: number;
  idPostulanteExperiencia?: number;
  idEmpresa?: number;
  otraEmpresa?: string;
  idCargo?: number;
  idAreaTrabajo?: number;
  idIndustria?: number;
  fechaInicio?: Date;
  fechaFin?: Date;
  nombreJefe?: string;
  numeroJefe?: string;
  alaActualidad?: boolean;
  esUltimoEmpleo?: boolean;
  salario?: number;
  funcion?: string;
  salarioComision?: number;
  idMoneda?: number;
  tipoActualizacion?: string;
  idMigracion?: number;
}

export interface PostulanteFormacion {
  id?: number;
  idPostulante?: number;
  idPais?: number;
  idCentroEstudio?: number;
  otraInstitucion?: string;
  idTipoEstudio?: number;
  idAreaFormacion?: number;
  otraCarrera?: string;
  idEstadoEstudio?: number;
  fechaInicio?: Date;
  fechaFin?: Date;
  alaActualidad?: boolean;
  idMigracion?: null;
  turnoEstudio?: string;
}

export interface ResultadoImportacion {
  listaPostulante: ListaPostulante[];
  listaPostulanteRepetido: ListaPostulante[];
  nregistrosNuevo: number;
  nregistrosRepetido: number;
}

export interface ListaPostulante {
  id: number | null;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  idTipoDocumento: number;
  nroDocumento: string;
  celular: string;
  email: string;
  idPais: number;
  idCiudad: number;
  origen: string;
  idEstadoEtapaProcesoSeleccion: number | null;
  idPostulanteNivelPotencial: number | null;
  listaRespuestaDesaprobatoria: number | null;
}

export interface HistorialPostulante {
  id: number;
  idPostulante: number;
  clave: string;
  valor: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}

export interface HistorialPostulanteFormacion {
  id: number;
  idPostulante: number;
  pais: null | string;
  centroEstudio: null | string;
  otraInstitucion: string;
  tipoEstudio: null | string;
  estadoEstudio: null | string;
  areaFormacion: null | string;
  otraCarrera: string;
  fechaInicio: string;
  fechaFin: string;
  alaActualidad: string;
  turnoEstudio: string;
  tipoActualizacion: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}

export interface HistorialPostulanteExperiencia {
  id: number;
  idPostulante: number;
  empresa: string | null;
  otraEmpresa: string | string;
  cargo: string;
  areaTrabajo: string;
  industria: string | string;
  esUltimoEmpleo: string;
  salario: string;
  salarioComision: string;
  moneda: string;
  fechaInicio: string;
  fechaFin: string;
  alaActualidad: string;
  nombreJefe: string | null;
  numeroJefe: string | null;
  funcion: string | null;
  tipoActualizacion: string;
  fechaModificacion: string;
  usuarioModificacion: string;
}

export interface ComparacionProcesosSeleccion {
  idProcesoSeleccionEtapaDestino: number;
  nombreProcesoSeleccionEtapaDestino: string;
  idProcesoSeleccionEtapaOrigen: number;
  nombreProcesoSeleccionEtapaOrigen: string;
  esEtapaAprobada: boolean;
  convalida: number;
}

export interface WhatsAppUltimoMensajesPostulante {
  numero: string;
  mensaje: string;
  idPersonal: number;
  idPais: number;
  idPostulante: number;
  fechaCreacion: Date;
  nombrePostulante: string;
}

export interface DPPlantillaInformacion {
  contenido: string;
  descripcion: string;
  id: number;
  nombre: string;
  tipoPlantilla: number;
  nombreAlterno: string;
  htmlPrevisualizacion: string;
}

export interface Plantilla {
  descripcion: string;
  plantilla: string;
  listaEtiquetas: ListaEtiqueta[];
}

export interface ListaEtiqueta {
  codigo: string;
  texto: string;
}

export interface MensajeTextoPostulante {
  WaTo: string;
  WaBody: string;
  IdPais: number;
  IdPostulante: number;
  Usuario: string;
}

export interface MensajePlantillaPostulante {
  WaTo: string;
  WaCaption: string;
  WaBody: string;
  WaTypeMensaje: number;
  IdPlantilla: number;
  IdPais: number;
  IdPostulante: number;
  IdPersonal: number;
  DatosPlantillaWhatsApp: {
    codigo: string;
    texto: string;
  }[];
}

export interface MensajesWhatsappPostulante {
  numero: string;
  tipo: number;
  idPais?: number;
  mensaje: string;
  idPersonal: number;
  idPostulante: number;
  registro?: number;
  fechaCreacion: Date;
  nombrePersonal?: string;
  areaPersonal?: string;
  estadoMensaje?: any;
}

export interface MensajeGenericoPostulante {
  WaTo: string;
  WaBody: string;
  IdPais: number;
  IdPostulante: number;
  IdPersonal: number;
  WaCaption: string;
  WaTypeMensaje: number;
  IdPlantilla: number;
  Usuario: string;
  DatosPlantillaWhatsApp: {
    codigo: string;
    texto: string;
  }[];
}

export interface WhatsAppHistorialPostulanteMensajes {
  numero: string;
  tipo: number;
  mensaje: string;
  idPersonal: number;
  idPostulante: number;
  idPais: number;
  registro?: number;
  fechaCreacion: Date;
  nombrePersonal: string;
  estadoMensaje: number | null;
  fechaEstado: Date | null;
}

export interface InformacionMensajeWhatsappPostulante {
  numero: string;
  idPostulante: string;
  mensaje: string;
  per: number;
}

export interface ChatAbierto {
  numero: string;
  idPostulante: number;
  chatAbierto: boolean;
}

export interface WhatsAppMensajeArchivoPostulante {
  waTo: string;
  waType: string;
  waLink: string;
  waFileName: string;
  idPais: number;
  idPostulante: number;
  idPersonal: number;
}

export interface DatosPostulanteNotificacion {
  nombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  nroDocumento: string
  telefono?: string
  celular: string
}
