// packages/api-client/src/endpoints/auth.ts

import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  User,
} from '@ecity/types';

export class AuthApi {
  constructor(private client: ApiClient) {}

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/api/v1/register', data);
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/api/v1/login', data);
  }

  async getProfile(token: string): Promise<User> {
    return this.client.get<User>('/api/v1/profile', token);
  }

  async updateProfile(data: Partial<User>, token: string): Promise<{ message: string }> {
    return this.client.put('/api/v1/profile', data, token);
  }
}