// packages/auth/src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function createAuthMiddleware(
  request: NextRequest,
  options: {
    requireModerator?: boolean;
    publicPaths?: string[];
  } = {}
) {
  const { requireModerator = false, publicPaths = [] } = options;

  // Перевіряємо чи це публічний шлях
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Отримуємо токен
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Якщо немає токена - редірект на логін
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Перевіряємо права модератора
  if (requireModerator && !token.is_moderator) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

// Middleware для адмін панелі
export async function adminMiddleware(request: NextRequest) {
  return createAuthMiddleware(request, {
    requireModerator: true,
    publicPaths: ['/login', '/api/auth'],
  });
}

// Middleware для користувацького додатку
export async function webMiddleware(request: NextRequest) {
  return createAuthMiddleware(request, {
    requireModerator: false,
    publicPaths: ['/login', '/register', '/api/auth', '/_next', '/favicon.ico'],
  });
}
