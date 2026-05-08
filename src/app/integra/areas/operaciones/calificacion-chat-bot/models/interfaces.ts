export interface Student {
  id: string;
  name: string;
  isRegistered: boolean;
  totalChats: number;
  averageRating: number;
}

export interface Chat {
  id: string;
  studentId: string;
  studentName: string;
  content: string;
  createdAt: Date;
  isRated: boolean;
}

export interface EvaluationCriteria {
  clarity: number;
  relevance: number;
  completeness: number;
  accuracy: number;
}

export interface Evaluation {
  chatId: string;
  studentId: string;
  rating: number;
  comments: string;
  criteria: EvaluationCriteria;
}

export interface FilterOptions {
  isRegistered?: boolean;
  isRated?: boolean;
  searchTerm?: string;
}

export interface RatingStatus {
  label: string;
  color: string;
}

// DTOs from backend
export interface ChatbotHiloChatPorAlumnoDTO {
  idChatbotPortalHiloChat: number;
  idAlumno?: number;
  nombreAlumno: string;
  email?: string;
  idMatriculaCabecera?: number;
  codigoMatricula: string;
  idEstado_matricula?: number;
  estadoMatricula: string;
  idSubEstadoMatricula?: number;
  codigoAreaDerivacion?: number;
  cerrado: boolean;
  derivado: boolean;
  derivacionCerrado?: boolean;
  subEstadoMatricula: string;
  fechaCreacion: Date;
  idFormularioAplicadoChatbot?: number;  // ID del formulario aplicado para verificación (deprecated)
  esCalificadoFormulario: boolean;  // Flag que indica si el hilo ya fue calificado
  idOrigen?: number;   // 1 = Portal Web, 2 = WhatsApp
  origen?: string;     // 'Portal Web' | 'WhatsApp'
}

export interface ChatbotHiloChatPorSegmentoDTO {
  id: number;
  idContactoPortalSegmento: string;
  codigoAreaDerivacion?: number;
  cerrado: boolean;
  derivado: boolean;
  derivacionCerrado?: boolean;
  fechaCreacion: Date;
  idFormularioAplicadoChatbot?: number;  // ID del formulario aplicado para verificación (deprecated)
  esCalificadoFormulario: boolean;
  fechaCalificacion?: Date | null;
}

// Agrupación de estudiantes
export interface AlumnoAgrupado {
  idAlumno?: number;
  nombreAlumno: string;
  email?: string;
  codigoMatricula: string;
  estadoMatricula: string;
  codigoAreaDerivacion?: number;
  derivado: boolean;
  totalChats: number;
  fechaCreacion: Date;
  hilos: ChatbotHiloChatPorAlumnoDTO[];
}

// Agrupación de no alumnos
export interface NoAlumnoAgrupado {
  idContactoPortalSegmento: string;
  codigoAreaDerivacion?: number;
  derivado: boolean;
  totalChats: number;
  fechaCreacion: Date;
  hilos: ChatbotHiloChatPorSegmentoDTO[];
}

// DTO de Mensajes del Chat
export interface ChatbotMensajeDTO {
  idChatbotPortalHiloChat: number;
  idAlumno?: number;
  esUsuario: boolean;
  contenido: string;
  idContactoPortalSegmento: string;
  fechaCreacion?: Date;
  esBot?: number; // 1 = bot, 0 = asesor humano
  personal?: string; // Nombre del asesor humano que respondió
  waType?: string | null; // Tipo de mensaje WhatsApp ('hsm' = template pre-aprobado)
}

export interface ChatbotWhatsAppMensajeDTO {
  idHiloChatWhatsApp: number;
  idAlumno?: number;
  esUsuario: boolean;
  contenido: string;
  tipoMensaje: string | null;
  waFile?: string | null;
  waMimeType?: string | null;
  waFileName?: string | null;
  waCaption?: string | null;
  fechaCreacion?: Date;
  esBot?: number; // 1 = bot, 0 = asesor humano
  personal?: string; // Nombre del asesor humano que respondió
  waType?: string | null; // Tipo de mensaje WhatsApp ('hsm' = template pre-aprobado)
}

// DTOs del Formulario de Evaluación
export interface TipoEntradaDTO {
  id: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export interface VersionFormularioDTO {
  id: number;
  nombre: string;
  descripcion: string;
  origen: string;
  version: number;
  estado: boolean;
  idMedioComunicacion?: number;
}

export interface RespuestaEvaluacionDTO {
  id: number;
  respuesta: string;
  orden: number;
  estado: boolean;
  idPreguntaEvaluacionChatbot: number;
  idTipoEntradaEvaluacionChatbot: number;
}

export interface PreguntaEvaluacion2DTO {
  id: number;
  nombre: string;
  orden: number;
  estado: boolean;
  idVersionFormularioEvaluacionChatbot: number;
  idTipoEntradaEvaluacionChatbot: number;
  tipoEntrada: string;
  esRequerido: boolean;  // true = obligatoria, false = opcional
  respuestas: RespuestaEvaluacionDTO[];
}

// DTO para enviar la evaluación completa — Portal Web
export interface InsertarRespuestaEvaluacionCompletaRequestDTO {
  idChatbotPortalHiloChat: number;
  idVersionFormularioEvaluacionChatbot: number;
  usuarioCreacion: string;
  idSolicitudProblema?: number;
  respuestasSeleccionadas: RespuestaSeleccionadaDTO[];
  respuestasTexto: RespuestaTextoDTO[];
  problemasIdentificados: ProblemaIdentificadoDTO[];
  idMedioComunicacion: number;
  idOriginal: number;
}

// DTO para enviar la evaluación completa — WhatsApp (usa idMedioComunicacion + idOriginal en lugar de idChatbotPortalHiloChat)
export interface InsertarRespuestaEvaluacionCompletaWhatsappRequestDTO {
  idMedioComunicacion: number;
  idOriginal: number;
  idVersionFormularioEvaluacionChatbot: number;
  usuarioCreacion: string;
  idSolicitudProblema?: number;
  respuestasSeleccionadas: RespuestaSeleccionadaDTO[];
  respuestasTexto: RespuestaTextoDTO[];
  problemasIdentificados: ProblemaIdentificadoDTO[];
}

export interface RespuestaSeleccionadaDTO {
  idRespuestaEvaluacionChatbot: number;
}

export interface RespuestaTextoDTO {
  idPreguntaEvaluacionChatbot: number;
  respuestaTexto: string;
}

export interface ProblemaIdentificadoDTO {
  idRespuestaEvaluacionChatbot: number;
}

// Paginación server-side — hilos por alumno
export interface PagedResponse<T> {
  items:      T[];
  totalCount: number;
  pageNumber: number;
  pageSize:   number;
  totalPages: number;
}

export interface HiloChatPaginadoDTO {
  idHilo:            number;
  fechaCreacion:     Date;
  origen:            string;   // 'Portal Web' | 'WhatsApp'
  idOrigen:          number;   // 5 = Portal | 1 = WhatsApp
  esCalificado:      boolean;
  fechaCalificacion: Date | null;
  ultimoMensaje?:    string;
  totalMensajes?:    number;
}

export interface AlumnoListadoDTO {
  idAlumno: number;
  nombreAlumno: string;
  email: string;
  codigoMatricula: string;
  estadoMatricula: string;
  codigoAreaDerivacion?: number;
  derivado: boolean;
  totalChats: number;
  pendientesCalificacion: number;
  fechaUltimoChat: Date;
}

export interface SegmentoListadoDTO {
  idContactoPortalSegmento: string;
  codigoAreaDerivacion?:    number;
  derivado:                 boolean;
  totalChats:               number;
  pendientesCalificacion:   number;
  fechaUltimoChat:          Date;
}

// DTO de solicitudes vinculadas a un hilo de chat
export interface SolicitudPorHiloDTO {
  idChatbotAlumnoSolicitud: number;
  fechaVinculacion:         Date;
  estadoSolicitud:          string;
  detalleSolicitud:         string;
  comentarioSolucion?:      string;
  fechaSolicitud:           Date;
}

// DTO de respuesta de evaluación ya aplicada
export interface RespuestaUsuarioPorFormularioAplicadoDTO {
  idPregunta: number;
  nombrePregunta: string;
  ordenPregunta: number;
  tipoEntradaNombre: string;
  idRespuestaEvaluacion: number | null;
  respuestaPredefinida: string | null;
  ordenRespuesta: number | null;
  respuestaCliente: string | null;
  esTextoLibre: boolean;
  esProblemaIdentificado: boolean;
  fechaCreacion: Date;
  idSolicitudProblema?: number | null;  // del T_FormularioAplicado — para reconstruir cascada
}

