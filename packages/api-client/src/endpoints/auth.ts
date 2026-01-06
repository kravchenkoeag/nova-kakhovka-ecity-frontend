// packages/api-client/src/endpoints/auth.ts

import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  User,
} from "@ecity/types";
import { ApiClient } from "../client";

export class AuthApi {
  constructor(private client: ApiClient) {}

  /**
   * Реєстрація нового користувача
   * Endpoint: POST /api/v1/register
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    // ВАЖЛИВО: Backend очікує /api/v1/register (БЕЗ /auth/)
    return this.client.post<AuthResponse>("/api/v1/register", data);
  }

  /**
   * Вхід користувача
   * Endpoint: POST /api/v1/login
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    // ВАЖЛИВО: Backend очікує /api/v1/login (БЕЗ /auth/)
    return this.client.post<AuthResponse>("/api/v1/login", data);
  }

  /**
   * Отримати профіль поточного користувача
   * Endpoint: GET /api/v1/profile
   */
  async getProfile(token: string): Promise<User> {
    return this.client.get<User>("/api/v1/profile", token);
  }

  /**
   * Оновити профіль користувача
   * Endpoint: PUT /api/v1/profile
   */
  async updateProfile(
    data: Partial<User>,
    token: string,
  ): Promise<{ message: string }> {
    return this.client.put("/api/v1/profile", data, token);
  }

  /**
   * Logout (client-side only - видалити токен)
   */
  async logout(): Promise<void> {
    // Backend не має logout endpoint (JWT stateless)
    // Видалення токена відбувається на client-side через NextAuth
    return Promise.resolve();
  }
}
