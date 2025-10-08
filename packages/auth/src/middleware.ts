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

  // ѕерев≥р€Їмо чи це публ≥чний шл€х
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // ќтримуЇмо токен
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // якщо немаЇ токена - ред≥рект на лог≥н
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ѕерев≥р€Їмо права модератора
  if (requireModerator && !token.is_moderator) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

// Middleware дл€ адм≥н панел≥
export async function adminMiddleware(request: NextRequest) {
  return createAuthMiddleware(request, {
    requireModerator: true,
    publicPaths: ['/login', '/api/auth'],
  });
}

// Middleware дл€ користувацького додатку
export async function webMiddleware(request: NextRequest) {
  return createAuthMiddleware(request, {
    requireModerator: false,
    publicPaths: ['/login', '/register', '/api/auth', '/_next', '/favicon.ico'],
  });
}