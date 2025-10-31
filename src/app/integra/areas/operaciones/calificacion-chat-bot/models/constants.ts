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

