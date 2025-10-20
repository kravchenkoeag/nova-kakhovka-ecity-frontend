// apps/web/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Список публічних маршрутів для веб-додатку
 */
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/about",
  "/rules",
  "/privacy",
  "/terms",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/unauthorized",
];

/**
 * Перевіряє чи шлях є публічним
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  });
}

/**
 * Middleware для веб-додатку
 * Перевіряє базову авторизацію для захищених маршрутів
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Перевіряємо чи це публічний шлях
  if (isPublicPath(pathname)) {
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

    // Додаємо заголовки з інформацією про користувача
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", token.id as string);
    requestHeaders.set("x-user-role", (token.role as string) || "USER");
    requestHeaders.set("x-user-email", token.email as string);

    // Користувач авторизований - дозволяємо доступ
    // Детальна перевірка дозволень відбувається на рівні сторінок
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("[Web Middleware] Error:", error);

    // У разі помилки редіректимо на логін
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    loginUrl.searchParams.set("error", "AuthError");
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
