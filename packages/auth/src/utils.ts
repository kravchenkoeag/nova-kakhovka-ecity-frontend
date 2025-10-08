// packages/auth/src/utils.ts

import { getServerSession } from 'next-auth';
import { authOptions } from './next-auth.config';

/**
 * Отримати сесію на сервері
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Отримати токен доступу
 */
export async function getAccessToken() {
  const session = await getSession();
  return session?.accessToken;
}

/**
 * Перевірити чи користувач модератор
 */
export async function isModerator() {
  const session = await getSession();
  return session?.user?.is_moderator || false;
}

/**
 * Отримати ID користувача
 */
export async function getUserId() {
  const session = await getSession();
  return session?.user?.id;
}