// packages/api-client/src/client.ts

import type { ApiError } from "@ecity/types";
import { handleFetchError, isUnauthorizedError } from "./interceptors";

interface RequestConfig extends RequestInit {
  token?: string;
}

/**
 * Базовий клієнт для взаємодії з backend API
 *
 * Підтримує два режими роботи:
 * 1. Direct mode - прямі запити до backend (за замовчуванням)
 * 2. Proxy mode - запити через Next.js API proxy (безпечніше для токенів)
 */
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  private useProxy: boolean;

  /**
   * @param baseUrl - базова URL backend API
   * @param useProxy - чи використовувати Next.js proxy замість прямих запитів
   */
  constructor(baseUrl: string, useProxy = false) {
    this.baseUrl = baseUrl;
    this.useProxy = useProxy;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  /**
   * Виконує HTTP запит до API
   *
   * 🔒 КРИТИЧНО: При використанні proxy режиму токени не передаються в headers
   * натомість Next.js автоматично додає їх на server-side
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<T> {
    const { token, ...fetchConfig } = config;

    // Proxy потрібний тільки для автентифікованих запитів:
    // - Приховує access token від браузера
    // - Для публічних GET (без токена) — прямий запит до бекенду, щоб уникнути
    //   накладних витрат від getServerSession() на кожен запит
    const needsProxy = this.useProxy && (config.method !== "GET" || !!token);

    const url = needsProxy
      ? `/api/proxy${endpoint}` // Автентифіковані запити — через Next.js proxy
      : `${this.baseUrl}${endpoint}`; // Публічні GET — прямо до backend

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(config.headers as Record<string, string>),
    };

    // Токен додаємо тільки в direct-mode (не proxy)
    if (token && !needsProxy) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers,
      });

      // Обробка помилок HTTP
      if (!response.ok) {
        // Спеціальна обробка 401 помилок (неавторизований доступ)
        if (response.status === 401) {
          await handleFetchError(response);
        }

        // Парсимо помилку з відповіді
        const error: ApiError = await response.json().catch(() => ({
          error: `HTTP Error ${response.status}`,
        }));
        throw new Error(error.error || `Request failed: ${response.status}`);
      }

      // Парсимо JSON відповідь
      return response.json();
    } catch (error) {
      console.error("API Request Error:", error);

      // Обробка 401 помилок через interceptor
      if (isUnauthorizedError(error)) {
        // Помилка буде оброблена interceptor'ом (автоматичний logout)
        throw error;
      }

      throw error;
    }
  }

  //GET запит - отримання даних
  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", token });
  }

  //POST запит - створення нових записів
  async post<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      token,
    });
  }

  //PUT запит - повне оновлення записів
  async put<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      token,
    });
  }

  //DELETE запит - видалення записів
  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", token });
  }

  //PATCH запит - часткове оновлення записів
  async patch<T>(endpoint: string, data?: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      token,
    });
  }

  /**
   * Перемикання режиму proxy
   * @param useProxy - чи використовувати proxy
   */
  setProxyMode(useProxy: boolean): void {
    this.useProxy = useProxy;
  }

  //Отримання поточного режиму
  isProxyMode(): boolean {
    return this.useProxy;
  }
}
