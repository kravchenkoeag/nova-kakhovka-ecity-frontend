// apps/web/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isWebPublicRoute } from "@ecity/auth";

/**
 * Middleware для веб-додатку
 * Перевіряє базову авторизацію для захищених маршрутів
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Перевіряємо чи це публічний шлях
  if (isWebPublicRoute(pathname)) {
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

    // Користувач авторизований - дозволяємо доступ
    // Детальна перевірка дозволень відбувається на рівні сторінок
    return NextResponse.next();
  } catch (error) {
    console.error("Web middleware error:", error);

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
