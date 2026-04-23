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
  esCalificadoFormulario: boolean;  // Flag que indica si el hilo ya fue calificado
}

// Agrupación de estudiantes
export interface AlumnoAgrupado {
  idAlumno?: number;
  nombreAlumno: string;
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

// DTO para enviar la evaluación completa (estructura real del backend)
export interface InsertarRespuestaEvaluacionCompletaRequestDTO {
  idChatbotPortalHiloChat: number;
  idVersionFormularioEvaluacionChatbot: number;
  usuarioCreacion: string;
  idSolicitudProblema?: number; // ID del problema elegido de la cascada Tipo Solicitud -> Categoría -> Problema
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
}

