// packages/auth/src/hooks.ts

'use client';

import { useSession } from 'next-auth/react';

// Hook для отримання access token на клієнті
export function useAccessToken() {
  const { data: session } = useSession();
  return session?.user?.accessToken || null;
}

// Hook для перевірки чи користувач модератор
export function useIsModerator() {
  const { data: session } = useSession();
  return session?.user?.isModerator || false;
}

// Hook для отримання ID користувача
export function useUserId() {
  const { data: session } = useSession();
  return session?.user?.id || null;
}