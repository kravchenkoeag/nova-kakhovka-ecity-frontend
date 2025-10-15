// apps/admin/lib/api-client.ts

import { createApiClient } from '@ecity/api-client';

/**
 * Ініціалізація API клієнта для адмін панелі
 */
export const apiClient = createApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
);