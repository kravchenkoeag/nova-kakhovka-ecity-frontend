// packages/api-client/src/interceptors.ts

import { signOut } from "next-auth/react";

/**
 * Обробляє помилки API запитів
 * Автоматично виконує logout при 401 помилці
 */
export function handleApiError(error: any, context?: string): never {
  console.error(`API Error${context ? ` in ${context}` : ""}:`, error);

  // Check if it's a 401 Unauthorized error
  if (error?.status === 401 || error?.response?.status === 401) {
    console.warn("Unauthorized access detected, signing out user");

    // Sign out the user
    signOut({
      callbackUrl: "/login",
      redirect: true,
    });

    throw new Error("Session expired. Please log in again.");
  }

  // Check for other HTTP errors
  if (error?.status || error?.response?.status) {
    const status = error.status || error.response.status;
    const message =
      error.message || error.response?.data?.error || `HTTP ${status} Error`;
    throw new Error(message);
  }

  // Generic error
  throw new Error(error?.message || "An unexpected error occurred");
}

/**
 * Перевіряє чи є помилка 401 Unauthorized
 */
export function isUnauthorizedError(error: any): boolean {
  return error?.status === 401 || error?.response?.status === 401;
}

/**
 * Перевіряє чи є помилка мережі
 */
export function isNetworkError(error: any): boolean {
  return (
    !error?.status &&
    !error?.response?.status &&
    error?.message?.includes("fetch")
  );
}

/**
 * Отримує статус код помилки
 */
export function getErrorStatus(error: any): number | null {
  return error?.status || error?.response?.status || null;
}

/**
 * Отримує повідомлення про помилку
 */
export function getErrorMessage(error: any): string {
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return "An unexpected error occurred";
}

/**
 * Створює обробник помилок для конкретного контексту
 */
export function createErrorHandler(context: string) {
  return (error: any) => handleApiError(error, context);
}

/**
 * Обробляє помилки fetch API
 */
export async function handleFetchError(response: Response): Promise<never> {
  let errorData;

  try {
    errorData = await response.json();
  } catch {
    errorData = { error: `HTTP ${response.status} Error` };
  }

  const error = {
    status: response.status,
    message: errorData.error || `HTTP ${response.status} Error`,
    response: { data: errorData },
  };

  return handleApiError(error);
}

/**
 * Retry logic для запитів з помилками
 */
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      // Don't retry on 401 (unauthorized) errors
      if (isUnauthorizedError(error)) {
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries - 1) {
        break;
      }

      // Wait before retrying
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, attempt))
      );
    }
  }

  throw lastError;
}
