// packages/types/src/auth.ts

import { User } from "./models/user";

/**
 * Request для реєстрації користувача
 * ВАЖЛИВО: Має співпадати з backend RegisterRequest
 */
export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string; // ← snake_case як на backend!
  last_name: string; // ← snake_case як на backend!
  phone?: string;
}

/**
 * Request для логіну
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Response від auth endpoints
 */
export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Payload для JWT токена
 */
export interface JWTPayload {
  user_id: string;
  email: string;
  role: string;
  is_moderator: boolean;
  exp: number;
  iat: number;
}
