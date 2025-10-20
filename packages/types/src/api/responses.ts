// packages/types/src/api/responses.ts

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiError {
  error: string;
  details?: string;
}

export interface SuccessResponse {
  message: string;
}

// Додаткові response типи можна додавати тут
export interface MessageResponse {
  message: string;
  data?: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrorResponse {
  error: string;
  validation_errors: ValidationError[];
}
