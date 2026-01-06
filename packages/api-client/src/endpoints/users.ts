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

//  Відповідь зі списком користувачів тепер має поле data
export interface UsersListResponse {
  data: User[]; //  основні дані в полі data
  users: User[]; // Legacy підтримка для зворотньої сумісності
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

// Статистика користувачів з правильною структурою
export interface UserStats {
  data: {
    total: number;
    active: number;
    blocked: number;
    admins: number;
    verified_users: number;
    moderators: number;
  };
}

// API для роботи з користувачами (тільки для модераторів/адміністраторів)
export class UsersApi {
  constructor(private client: ApiClient) {}

  //Отримати список всіх користувачів з пагінацією та фільтрацією

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

  //Отримати користувача за ID

  async getById(userId: string): Promise<{ user: User }> {
    return this.client.get<{ user: User }>(`/api/v1/users/${userId}`);
  }

  /**
   * Змінити пароль користувача (тільки для адміністраторів)
   *
   * 🔒 Захист: Server-Side перевірка прав на backend
   */
  async updatePassword(
    userId: string,
    data: UpdatePasswordRequest
  ): Promise<{ message: string }> {
    return this.client.put<{ message: string }>(
      `/api/v1/users/${userId}/password`,
      data
    );
  }

  //  Метод для блокування користувача

  async block(
    userId: string,
    reason?: string
  ): Promise<{ message: string; user_id: string; is_blocked: boolean }> {
    return this.client.put<{
      message: string;
      user_id: string;
      is_blocked: boolean;
    }>(`/api/v1/users/${userId}/block`, {
      is_blocked: true,
      reason,
    });
  }

  // Метод для розблокування користувача

  async unblock(
    userId: string
  ): Promise<{ message: string; user_id: string; is_blocked: boolean }> {
    return this.client.put<{
      message: string;
      user_id: string;
      is_blocked: boolean;
    }>(`/api/v1/users/${userId}/block`, {
      is_blocked: false,
    });
  }

  //@deprecated Використовуйте block() або unblock() замість цього методу

  async blockUser(
    userId: string,
    data: BlockUserRequest
  ): Promise<{ message: string; user_id: string; is_blocked: boolean }> {
    if (data.is_blocked) {
      return this.block(userId, data.reason);
    } else {
      return this.unblock(userId);
    }
  }

  // Отримати статистику користувачів

  async getStats(): Promise<UserStats> {
    return this.client.get<UserStats>("/api/v1/users/stats");
  }
}

// Експорт фабрики для UsersApi
export const createUsersApi = (client: ApiClient) => new UsersApi(client);
