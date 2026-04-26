// packages/api-client/src/endpoints/auth.ts

import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  User,
} from "@ecity/types";
import { ApiClient } from "../client";

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SessionInfo {
  id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  last_used_at: string | null;
  expires_at: string;
}

export class AuthApi {
  constructor(private client: ApiClient) {}

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.client.post<AuthResponse>("/api/v1/auth/register", data);
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.client.post<AuthResponse>("/api/v1/auth/login", data);
  }

  async getProfile(token: string): Promise<User> {
    return this.client.get<User>("/api/v1/auth/profile", token);
  }

  async updateProfile(
    data: Partial<User>,
    token: string
  ): Promise<{ message: string }> {
    return this.client.put("/api/v1/auth/profile", data, token);
  }

  async changePassword(
    data: { old_password: string; new_password: string },
    token: string
  ): Promise<{ message: string }> {
    return this.client.put("/api/v1/auth/password", data, token);
  }

  // Відкликає конкретний refresh token на backend
  async logout(refreshToken: string): Promise<void> {
    await this.client.post("/api/v1/auth/logout", {
      refresh_token: refreshToken,
    });
  }

  // Відкликає всі сесії + інвалідує всі access токени (token_version++)
  async logoutAll(token: string): Promise<void> {
    await this.client.post("/api/v1/auth/logout-all", undefined, token);
  }

  // Оновлює access token через refresh token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    return this.client.post<RefreshTokenResponse>("/api/v1/auth/refresh", {
      refresh_token: refreshToken,
    });
  }

  // Отримати активні сесії поточного користувача
  async getSessions(token: string): Promise<{ sessions: SessionInfo[]; total: number }> {
    return this.client.get("/api/v1/auth/sessions", token);
  }

  // Відкликати конкретну сесію
  async revokeSession(
    sessionId: string,
    token: string
  ): Promise<{ message: string }> {
    return this.client.delete(`/api/v1/auth/sessions/${sessionId}`, token);
  }

  // Відкликати всі інші сесії (крім поточної)
  async revokeOtherSessions(
    currentToken: string,
    accessToken: string
  ): Promise<{ message: string }> {
    return this.client.delete("/api/v1/auth/sessions", accessToken);
  }
}
