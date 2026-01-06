// packages/auth/src/utils.ts

import { getServerSession } from "next-auth";
import { authOptions } from "./next-auth.config";

// Отримує сесію на сервері (Server Components)
export async function getSession() {
  return await getServerSession(authOptions);
}

// Отримує access token поточного користувача
export async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session?.user?.accessToken || null;
}

// Перевіряє чи користувач модератор
export async function isModerator(): Promise<boolean> {
  const session = await getSession();
  return session?.user?.isModerator || false;
}

// Отримує ID поточного користувача
export async function getUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.user?.id || null;
}
