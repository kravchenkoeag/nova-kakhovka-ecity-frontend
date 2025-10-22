// apps/web/lib/api.ts
import { createApiClient } from "@ecity/api-client";

/**
 * API клієнт для web додатку
 *
 * Використовує proxy режим для:
 * - Приховування токенів від client-side
 * - Автоматичної авторизації через session
 */
export const apiClient = createApiClient(
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080",
  true // ✅ Proxy mode для безпеки
);

// Експорт типу для використання в інших файлах
export type ApiClient = typeof apiClient;

// Для development можна перемикати режим
if (process.env.NODE_ENV === "development") {
  // apiClient.setProxyMode(false); // Uncomment для direct mode
}
