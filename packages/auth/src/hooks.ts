// packages/auth/src/hooks.ts

'use client';

import { useSession } from 'next-auth/react';

/**
 * ��� ��� ��������� ������
 */
export function useAccessToken() {
  const { data: session } = useSession();
  return session?.accessToken;
}

/**
 * ��� ��� �������� ��� ����������
 */
export function useIsModerator() {
  const { data: session } = useSession();
  return session?.user?.is_moderator || false;
}

/**
 * ��� ��� ��������� ID �����������
 */
export function useUserId() {
  const { data: session } = useSession();
  return session?.user?.id;
}