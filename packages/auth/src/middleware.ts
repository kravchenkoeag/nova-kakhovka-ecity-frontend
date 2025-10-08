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

  // ���������� �� �� �������� ����
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // �������� �����
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // ���� ���� ������ - ������� �� ����
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ���������� ����� ����������
  if (requireModerator && !token.is_moderator) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

// Middleware ��� ���� �����
export async function adminMiddleware(request: NextRequest) {
  return createAuthMiddleware(request, {
    requireModerator: true,
    publicPaths: ['/login', '/api/auth'],
  });
}

// Middleware ��� ��������������� �������
export async function webMiddleware(request: NextRequest) {
  return createAuthMiddleware(request, {
    requireModerator: false,
    publicPaths: ['/login', '/register', '/api/auth', '/_next', '/favicon.ico'],
  });
}