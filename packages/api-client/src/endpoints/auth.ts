// packages/api-client/src/endpoints/auth.ts

import type { RegisterRequest, LoginRequest, AuthResponse, User } from '@ecity/types';
import { ApiClient } from '../client';

export class AuthApi {
  constructor(private client: ApiClient) {}

  // Реєстрація нового користувача
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/api/v1/register', data);
  }

  // Вхід користувача
  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/api/v1/login', data);
  }

  // Отримати профіль поточного користувача
  async getProfile(token: string): Promise<User> {
    return this.client.get<User>('/api/v1/profile', token);
  }

  // Оновити профіль користувача
  async updateProfile(data: Partial<User>, token: string): Promise<{ message: string }> {
    return this.client.put('/api/v1/profile', data, token);
  }
}