import { AlumnoWhatsapp, HistorialAlumno } from './atributos-alumno';

// ---------------------------------------------------------------------------
// Historial de Oportunidades — interfaz para calificacion IA V2
// ---------------------------------------------------------------------------

export interface HistorialOportunidadMasivo {
  idOportunidad: number;
  faseOportunidad: string;  // = fase_cierre en IA
  faseMaxima: string;
  nombrePrograma: string;
  fechaSolicitud: string | null;
  asesor: string;
}

// ---------------------------------------------------------------------------
// Perfil e historial para payload V2 de calificacion
// ---------------------------------------------------------------------------

export interface CalificacionPerfilV2 {
  area_formacion: string;
  cargo_actual: string;
  area_trabajo: string;
  industria: string;
}

export interface CalificacionHistorialV2Item {
  id_oportunidad: string;
  fase_maxima: string;
  fase_cierre: string;
}

export interface PreCargaMasivaRequest {
  idsAlumno: number[];
  celulares?: string[];   // celular con prefijo de país (ej: 5218119932463) — evita reconstrucción desde T_Alumno
  horasAtras: number;
}

export interface LeadPreCargado {
  idAlumno: number;
  celular: string;
  alumno: AlumnoWhatsapp;
  historialOportunidades: HistorialAlumno[];
  mensajes: MensajeChat[];
  cargadoOk: boolean;
  errorCarga?: string;
  idCodigoPais?: number;
}

export interface MensajeChat {
  mensajeHtml: string;       // HTML ya procesado (puede contener img, audio, etc.)
  tipoMensaje: 1 | 2;        // 1 = recibido (cliente), 2 = enviado (bot/personal)
  fechaMensaje: string;
  personalFiltrado: string;
  waType?: string;        // tipo de mensaje: 'text','image','audio','voice','video','document','sticker', etc.
  archivo?: string;       // URL del archivo multimedia
  nombreArchivo?: string; // Nombre del archivo (ej: contrato.pdf)
}

export interface LeadMasivoVM {
  // Datos base (readonly)
  idAlumno: number;
  celular: string;
  celularCompleto: string;   // numero con prefijo de pais (ej: 51999888777). Replica lo que usa el chat unitario.
  nombre: string;
  apellidoPaterno?: string;
  pais: string;
  idPaisEmpresa: number;
  email: string;
  idPersonalAsesor?: number; // idPersonal real del asesor del lead (viene del backend via ChatWhatsAppMarketing.idPersonal)
  // Estado del card
  seleccionado: boolean;
  expandido: boolean;
  excluido: boolean;
  // Datos cargados
  mensajes: MensajeChat[];
  historialOportunidades: HistorialAlumno[];
  // Historial de oportunidades desde SP (para calificacion IA V2)
  historialOportunidadesV2?: HistorialOportunidadMasivo[];
  // Perfil editable (Columna 2)
  cargo: number | null;
  areaFormacion: number | null;
  areaTrabajo: number | null;
  industria: number | null;
  perfilModificado: boolean;
  perfilConfirmado: boolean;
  // Config oportunidad (Columna 3)
  idCentroCosto: number | null;
  centroCostoItems: { id: number; nombre: string }[];   // lista local del combobox por card
  idOrigen: number | null;
  idAsesor: number | null;
  asesorTocadoIndividualmente: boolean;
  horario: string;
  activo: boolean;
  // Badges
  badgeCalificacion: string | null;   // null = no calificado aun
  fechaUltimaCaptura: Date | null;    // null = no capturado aun
  // Estado creacion
  oportunidadCreada: boolean;
  idOportunidadCreada: number | null;
  errorCreacion: string | null;
  // Respuesta individual
  mostrarInputManual: boolean;
  mensajeManual: string;
  idPlantillaIndividual: number | null;
  // Envíos staged — esperan al botón "Enviar seleccionados"
  archivoStagedUrl?: string;       // URL en blob tras subir el archivo
  archivoStagedNombre?: string;    // Nombre del archivo
  archivoStagedTipo?: 'doc' | 'img';
  mensajePendiente?: string;       // Mensaje manual listo para enviar (copia de mensajeManual al confirmar)
  plantillaPendiente?: boolean;    // true si idPlantillaIndividual ya está confirmada para envío
  // Estado extraccion IA
  iaEstado?: 'procesando' | 'completado' | 'error' | 'no_creable';
  iaDatosExtraidos?: any;
  iaCambios?: { campo: string; antes: string | null; despues: string }[];
  iaNombreAceptado?: boolean;
  iaApellidoAceptado?: boolean;
  iaEmailAceptado?: boolean;
  // Estado calificacion IA
  calificacionEstado?: 'procesando' | 'completado' | 'error' | 'no_creable';
  calificacionResultado?: any;
}

export interface ResultadoCreacion {
  idAlumno: number;
  nombre: string;
  exito: boolean;
  idOportunidad?: number;
  error?: string;
}

export type BadgeCalificacion =
  | 'Creable Organico'
  | 'Creable Filtrado'
  | 'Creable Regular'
  | 'No Creable - Spam'
  | 'No Creable - Sin interes'
  | 'No Creable - Duplicado'
  | 'Requiere Revision';

// ---------------------------------------------------------------------------
// Extraccion IA
// ---------------------------------------------------------------------------

export interface ExtraccionMensaje {
  role: 'lead' | 'agent';
  content: string;
  timestamp?: string;
}

export interface ExtraccionLeadPayload {
  conv_id: string;        // "+" + lead.celular
  agent_id: string;       // lead.idAsesor.toString()
  channel: 'whatsapp';
  pais: string;           // derivado del idPaisEmpresa (51="PE", 52="MX", 57="CO", 54="AR")
  chat_datetime: string;  // timestamp del primer mensaje (ISO 8601)
  messages: ExtraccionMensaje[];
}

export interface ExtraccionBatchRequest {
  tenant_id: string;           // "BSG_PERU" estatico
  conversations: ExtraccionLeadPayload[];  // era leads
}

export interface ExtraccionBatchStatus {
  call_id: string;
  status: string;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

export interface ExtraccionResultadoLead {
  conv_id: string;
  status: 'completed' | 'failed' | 'NO_CREABLE';
  datos_extraidos?: {
    nombre?: string;
    apellido?: string;
    email?: string;
    programa_interes?: string;
    [key: string]: any;
  };
}

export interface ExtraccionBatchResultados {
  call_id: string;
  resultados: ExtraccionResultadoLead[];
}

// ---------------------------------------------------------------------------
// Calificacion IA
// ---------------------------------------------------------------------------

export interface CalificacionLeadPayload {
  identificador_lead: string;  // "+" + lead.celular
  agent_id: string;            // lead.idAsesor.toString()
  origen: 'whatsapp';
  perfil: {
    cargo: number | null;
    area_formacion: number | null;
    area_trabajo: number | null;
    industria: number | null;
  };
  historial: CalificacionHistorialItem[];
  mensajes: ExtraccionMensaje[];  // misma interface que extraccion
}

export interface CalificacionHistorialItem {
  id_oportunidad?: number;
  tipo?: string;
  categoria?: string;
  fecha_creacion?: string;
  chat_valido?: string;
  chat_invalido?: string;
  chat_oportunidad?: string;
}

export interface CalificacionLlamadaRequest {
  tenant_id: string;
  oportunidades: CalificacionLeadPayload[];  // era llamadas
}

export interface CalificacionLlamadaStatus {
  llamada_id: string;
  status: string;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

export interface CalificacionResultadoLead {
  identificador_lead: string;
  status: 'completed' | 'failed' | 'NO_CREABLE';
  calificacion?: {
    probabilidad?: string;   // 'Alta' | 'Media' | 'Baja'
    motivo?: string;
    [key: string]: any;
  };
}

export interface CalificacionLlamadaResultados {
  llamada_id: string;
  resultados: CalificacionResultadoLead[];
}
