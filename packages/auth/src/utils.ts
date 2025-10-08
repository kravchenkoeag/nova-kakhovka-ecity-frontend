// packages/auth/src/utils.ts

import { getServerSession } from 'next-auth';
import { authOptions } from './next-auth.config';

/**
 * �������� ���� �� ������
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * �������� ����� �������
 */
export async function getAccessToken() {
  const session = await getSession();
  return session?.accessToken;
}

/**
 * ��������� �� ���������� ���������
 */
export async function isModerator() {
  const session = await getSession();
  return session?.user?.is_moderator || false;
}

/**
 * �������� ID �����������
 */
export async function getUserId() {
  const session = await getSession();
  return session?.user?.id;
}