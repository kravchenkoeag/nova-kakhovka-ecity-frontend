// apps/admin/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isAdminPublicRoute, AdminPanelRoles } from "@ecity/auth";

/**
 * Middleware для адмін-панелі
 * Перевіряє авторизацію та ролі для доступу до адмін панелі
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Перевіряємо чи це публічний шлях
  if (isAdminPublicRoute(pathname)) {
    return NextResponse.next();
  }

  try {
    // Отримуємо токен NextAuth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Якщо немає токена - редірект на сторінку логіну
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Перевіряємо роль користувача
    const userRole = token.role as string;

    if (!userRole || !AdminPanelRoles.includes(userRole as any)) {
      // Користувач не має права доступу до адмін панелі
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Користувач має відповідну роль - дозволяємо доступ
    return NextResponse.next();
  } catch (error) {
    console.error("Admin middleware error:", error);

    // У разі помилки редіректимо на логін
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

/**
 * Конфігурація matcher
 * Визначає на яких шляхах запускається middleware
 */
export const config = {
  matcher: [
    /*
     * Застосовувати middleware до всіх шляхів крім:
     * - api/auth (NextAuth API routes)
     * - _next/static (статичні файли)
     * - _next/image (оптимізовані зображення)
     * - favicon.ico (іконка сайту)
     * - файли зображень (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
