export enum ViewState {
  STUDENTS = 'students',
  CHATS = 'chats',
  EVALUATION = 'evaluation'
}

export enum RatingLevel {
  VERY_LOW = 1,
  LOW = 2,
  MEDIUM = 3,
  HIGH = 4,
  VERY_HIGH = 5
}

export const RATING_LABELS: Record<number, string> = {
  1: 'Muy Malo',
  2: 'Malo',
  3: 'Regular',
  4: 'Bueno',
  5: 'Excelente'
};

export const CRITERIA_LABELS: Record<number, string> = {
  1: 'Muy Bajo',
  2: 'Bajo',
  3: 'Medio',
  4: 'Alto',
  5: 'Muy Alto'
};

export const STATUS_COLORS = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
} as const;

export const RATING_THRESHOLDS = {
  HIGH: 4,
  MEDIUM: 3
} as const;

export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
};

export enum AreaDerivacionCodigo {
  ATENCION_CLIENTE = 1,
  COMERCIAL = 2
}

export const AREA_DERIVACION_LABELS: Record<number, string> = {
  [AreaDerivacionCodigo.ATENCION_CLIENTE]: 'Atención al Cliente',
  [AreaDerivacionCodigo.COMERCIAL]: 'Comercial'
};

export const AREA_DERIVACION_NO_DEFINIDO = 'No Definido';

// Estados de vista
export enum ViewStateExtended {
  STUDENTS = 'students',              // Nivel 1: Lista de alumnos/segmentos
  CHATS = 'chats',                    // Nivel 2: Lista de hilos
  CHAT_MESSAGES = 'chat_messages'     // Nivel 3: Mensajes + Formulario (layout 2 columnas)
}

// Tipo de origen de los hilos
export enum TipoOrigen {
  ALUMNO = 'alumno',
  SEGMENTO = 'segmento'
}

// Tipos de entrada para preguntas de evaluación
export enum TipoEntrada {
  SELECCION_SIMPLE = 'SeleccionSimple',
  SELECCION_MULTIPLE = 'SeleccionMultiple',
  TEXTO_LIBRE = 'TextoLibre',
  RATING = 'Rating',
  SI_NO = 'SiNo',
  ESCALA = 'Escala',
  LISTA = 'Lista',
  FECHA = 'Fecha',
  HORA = 'Hora',
  ARCHIVO = 'Archivo'
}

export const TIPO_ENTRADA_LABELS: Record<string, string> = {
  [TipoEntrada.SELECCION_SIMPLE]: 'Selección única de opciones',
  [TipoEntrada.SELECCION_MULTIPLE]: 'Selección múltiple de opciones',
  [TipoEntrada.TEXTO_LIBRE]: 'Respuesta de texto libre',
  [TipoEntrada.RATING]: 'Escala de valoración',
  [TipoEntrada.SI_NO]: 'Respuesta Sí/No',
  [TipoEntrada.ESCALA]: 'Escala numérica',
  [TipoEntrada.LISTA]: 'Lista desplegable',
  [TipoEntrada.FECHA]: 'Selección de fecha',
  [TipoEntrada.HORA]: 'Selección de hora',
  [TipoEntrada.ARCHIVO]: 'Subida de archivo'
};

