// apps/web/lib/api-client.ts

import { ApiClient } from "@ecity/api-client";

// Використовуємо proxy для приховування токенів
export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  true // ← useProxy = true
);
