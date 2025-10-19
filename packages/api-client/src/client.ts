// packages/api-client/src/client.ts

import type { ApiError } from "@ecity/types";
import { handleFetchError, isUnauthorizedError } from "./interceptors";

interface RequestConfig extends RequestInit {
  token?: string;
}

// Базовий клієнт для взаємодії з backend API
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  // Виконує HTTP запит до API
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { token, ...fetchConfig } = config;

    // Створюємо об'єкт headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(config.headers as Record<string, string>),
    };

    // Додаємо токен авторизації якщо він переданий
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchConfig,
        headers,
      });

      // Обробка помилок HTTP
      if (!response.ok) {
        // Special handling for 401 errors
        if (response.status === 401) {
          await handleFetchError(response);
        }

        const error: ApiError = await response.json().catch(() => ({
          error: `HTTP Error ${response.status}`,
        }));
        throw new Error(error.error || `Request failed: ${response.status}`);
      }

      // Парсимо JSON відповідь
      return response.json();
    } catch (error) {
      console.error("API Request Error:", error);

      // Handle 401 errors specifically
      if (isUnauthorizedError(error)) {
        // The error will be handled by the interceptor
        throw error;
      }

      throw error;
    }
  }

  // GET запит
  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", token });
  }

  // POST запит
  async post<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      token,
    });
  }

  // PUT запит
  async put<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      token,
    });
  }

  // DELETE запит
  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", token });
  }

  // PATCH запит
  async patch<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      token,
    });
  }
}
