// apps/web/lib/api-client.ts

import { createApiClient } from '@ecity/api-client';

// Ініціалізація API клієнта для веб-додатку
export const apiClient = createApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
);
