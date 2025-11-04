// packages/api-client/src/endpoints/users.ts

import { ApiClient } from "../client";
import { User } from "@ecity/types";

// Параметри для отримання списку користувачів
export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  is_blocked?: boolean;
}

// Відповідь зі списком користувачів
export interface UsersListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Запит на зміну пароля
export interface UpdatePasswordRequest {
  new_password: string;
}

// Запит на блокування користувача
export interface BlockUserRequest {
  is_blocked: boolean;
  reason?: string;
}

// Статистика користувачів

export interface UserStats {
  total_users: number;
  blocked_users: number;
  verified_users: number;
  moderators: number;
  administrators: number;
  active_users: number;
}

/// API для роботи з користувачами (тільки для модераторів/адміністраторів)
export class UsersApi {
  constructor(private client: ApiClient) {}

  // Отримати список всіх користувачів з пагінацією та фільтрацією

  async getAll(params?: GetUsersParams): Promise<UsersListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.role) queryParams.append("role", params.role);
    if (params?.is_blocked !== undefined) {
      queryParams.append("is_blocked", params.is_blocked.toString());
    }

    const query = queryParams.toString();
    const url = `/api/v1/users${query ? `?${query}` : ""}`;

    return this.client.get<UsersListResponse>(url);
  }

  // Отримати користувача за ID
  async getById(userId: string): Promise<{ user: User }> {
    return this.client.get<{ user: User }>(`/api/v1/users/${userId}`);
  }

  // Змінити пароль користувача (тільки для адміністраторів)
  async updatePassword(
    userId: string,
    data: UpdatePasswordRequest
  ): Promise<{ message: string }> {
    return this.client.put<{ message: string }>(
      `/api/v1/users/${userId}/password`,
      data
    );
  }

  // Заблокувати або розблокувати користувача
  async blockUser(
    userId: string,
    data: BlockUserRequest
  ): Promise<{ message: string; user_id: string; is_blocked: boolean }> {
    return this.client.put<{
      message: string;
      user_id: string;
      is_blocked: boolean;
    }>(`/api/v1/users/${userId}/block`, data);
  }

  // Отримати статистику користувачів
  async getStats(): Promise<UserStats> {
    return this.client.get<UserStats>("/api/v1/users/stats");
  }
}

// Експорт фабрики для UsersApi
export const createUsersApi = (client: ApiClient) => new UsersApi(client);
