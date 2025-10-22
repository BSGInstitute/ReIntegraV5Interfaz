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

