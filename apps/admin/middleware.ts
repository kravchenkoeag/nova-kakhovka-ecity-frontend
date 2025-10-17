// apps/admin/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware для адмін-панелі
 * Перевіряє авторизацію адміністраторів без використання Edge Runtime
 * для уникнення проблем з openid-client
 *
 * ВАЖЛИВО: Це базова перевірка наявності токена.
 * Перевірка прав модератора відбувається на рівні API та сторінок
 */
export function middleware(request: NextRequest) {
  // Список публічних шляхів, що не потребують авторизації
  const publicPaths = ["/login", "/api/auth", "/_next", "/favicon.ico"];

  // Перевіряємо чи це публічний шлях
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Дозволяємо доступ до публічних шляхів
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Перевіряємо наявність токена NextAuth в cookies
  // NextAuth зберігає токен в одному з цих cookies
  const token =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");

  // Якщо немає токена - редірект на сторінку логіну
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    // Зберігаємо URL для повернення після логіну
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Користувач авторизований - дозволяємо доступ
  // Перевірка прав модератора відбувається на рівні компонентів та API
  return NextResponse.next();
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
