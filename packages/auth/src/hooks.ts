// packages/auth/src/hooks.ts

'use client';

import { useSession } from 'next-auth/react';

/**
 * Хук для отримання токена
 */
export function useAccessToken() {
  const { data: session } = useSession();
  return session?.accessToken;
}

/**
 * Хук для перевірки ролі модератора
 */
export function useIsModerator() {
  const { data: session } = useSession();
  return session?.user?.is_moderator || false;
}

/**
 * Хук для отримання ID користувача
 */
export function useUserId() {
  const { data: session } = useSession();
  return session?.user?.id;
}