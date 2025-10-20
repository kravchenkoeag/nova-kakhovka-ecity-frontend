// apps/admin/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole } from "@ecity/types";

/**
 * Список публічних маршрутів для адмін панелі
 */
const PUBLIC_PATHS = [
  "/login",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/unauthorized",
];

/**
 * Ролі які мають доступ до адмін панелі
 */
const ADMIN_ROLES = [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN];

/**
 * Перевіряє чи шлях є публічним
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

/**
 * Middleware для адмін-панелі
 * Перевіряє авторизацію та ролі для доступу до адмін панелі
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

    // Перевіряємо роль користувача
    const userRole = token.role as string;

    // Підтримка legacy is_moderator поля
    const isModerator = token.is_moderator as boolean;

    // Перевіряємо чи користувач має права доступу
    const hasAccess =
      ADMIN_ROLES.includes(userRole as UserRole) || isModerator === true;

    if (!hasAccess) {
      // Користувач не має права доступу до адмін панелі
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Додаємо заголовки з інформацією про користувача для downstream handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", token.id as string);
    requestHeaders.set("x-user-role", userRole);
    requestHeaders.set("x-user-email", token.email as string);

    // Користувач має відповідну роль - дозволяємо доступ
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("[Admin Middleware] Error:", error);

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
