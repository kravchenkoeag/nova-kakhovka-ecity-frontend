// apps/web/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Маршрути, що завжди потребують авторизації (навіть якщо починаються з публічного префіксу).
 * Перевіряються ДО PUBLIC_PATHS.
 */
const AUTH_REQUIRED_PATHS = [
  "/events/create",
  "/announcements/create",
  "/petitions/create",
  "/city-issues/report",
  "/polls/create",
  "/profile",
  "/groups",
  "/notifications",
];

/**
 * Публічні маршрути — доступні без авторизації.
 * Секції перегляду (події, петиції тощо) публічні, бо гість може читати.
 * Дії (створення, підпис, заявка) захищені через AUTH_REQUIRED_PATHS вище.
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
  // Публічні секції перегляду
  "/events",
  "/announcements",
  "/petitions",
  "/city-issues",
  "/transport",
  "/polls",
];

/** Перевіряє чи шлях потребує авторизації (пріоритет над PUBLIC_PATHS) */
function requiresAuth(pathname: string): boolean {
  return AUTH_REQUIRED_PATHS.some((path) => pathname.startsWith(path));
}

/** Перевіряє чи шлях є публічним */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  });
}

/** Додає заголовки користувача до запиту */
function withUserHeaders(request: NextRequest, token: any): NextResponse {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", token.id as string);
  requestHeaders.set("x-user-role", (token.role as string) || "USER");
  requestHeaders.set("x-user-email", token.email as string);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

/**
 * Middleware для веб-додатку.
 * Логіка доступу:
 *   1. AUTH_REQUIRED_PATHS → обов'язкова авторизація
 *   2. PUBLIC_PATHS → вільний доступ (перегляд без входу)
 *   3. Решта → обов'язкова авторизація
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Шляхи, що завжди потребують авторизації
  if (requiresAuth(pathname)) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      return withUserHeaders(request, token);
    } catch (error) {
      console.error("[Web Middleware] Auth check error:", error);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      loginUrl.searchParams.set("error", "AuthError");
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Публічні шляхи — дозволяємо без перевірки
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // 3. Решта маршрутів — потребують авторизації
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return withUserHeaders(request, token);
  } catch (error) {
    console.error("[Web Middleware] Error:", error);
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
