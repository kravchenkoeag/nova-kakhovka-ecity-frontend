// packages/types/src/api/responses.ts

export interface AuthResponse {
  token: string;
  user: User;
}

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
