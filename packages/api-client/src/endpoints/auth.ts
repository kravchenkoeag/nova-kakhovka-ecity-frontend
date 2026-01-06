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
   * Endpoint: POST /api/v1/auth/register
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.client.post<AuthResponse>("/api/v1/auth/register", data);
  }

  /**
   * Вхід користувача
   * Endpoint: POST /api/v1/auth/login
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.client.post<AuthResponse>("/api/v1/auth/login", data);
  }

  /**
   * Отримати профіль поточного користувача
   * Endpoint: GET /api/v1/auth/profile
   */
  async getProfile(token: string): Promise<User> {
    return this.client.get<User>("/api/v1/auth/profile", token);
  }

  /**
   * Оновити профіль користувача
   * Endpoint: PUT /api/v1/auth/profile
   */
  async updateProfile(
    data: Partial<User>,
    token: string
  ): Promise<{ message: string }> {
    return this.client.put("/api/v1/auth/profile", data, token);
  }

  /**
   * Змінити пароль користувача
   * Endpoint: PUT /api/v1/auth/password
   */
  async changePassword(
    data: { old_password: string; new_password: string },
    token: string
  ): Promise<{ message: string }> {
    return this.client.put("/api/v1/auth/password", data, token);
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
