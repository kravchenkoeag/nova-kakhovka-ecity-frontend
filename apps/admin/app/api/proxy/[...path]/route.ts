// apps/admin/app/api/proxy/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole, Permission } from "@ecity/types";
import { hasPermission } from "@ecity/auth";

/**
 * API Proxy для адмін панелі
 * Проксує запити до backend API з авторизацією та дозволеннями
 *
 * 🔒 КРИТИЧНО: Всі запити через proxy захищені перевіркою дозволів
 * Токени приховані від client-side коду для додаткової безпеки
 */

/**
 * Основна функція проксування запитів
 * Обробляє всі HTTP методи та форвардить їх на backend
 */
async function proxyHandler(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // 🔒 КРИТИЧНО: Перевіряємо авторизацію та дозволення
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Перевіряємо роль користувача
    const userRole = token.role as UserRole;
    if (!userRole) {
      return NextResponse.json(
        { error: "User role not found" },
        { status: 401 }
      );
    }

    // Перевіряємо дозволення модератора
    if (!hasPermission(userRole, Permission.MODERATE_ANNOUNCEMENT)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Отримуємо backend URL з environment
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";

    // Будуємо повний шлях до backend API
    const path = params.path.join("/");
    const targetUrl = `${backendUrl}/${path}`;

    // Копіюємо query parameters з оригінального запиту
    const url = new URL(targetUrl);
    req.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    // Готуємо headers для backend запиту
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      // 🔒 КРИТИЧНО: Використовуємо accessToken з token
      Authorization: `Bearer ${token.accessToken}`,
      // Форвардимо інші важливі headers
      "User-Agent": req.headers.get("user-agent") || "",
      Accept: req.headers.get("accept") || "application/json",
    };

    // Готуємо body для POST/PUT/PATCH запитів
    let body: string | undefined = undefined;
    if (
      req.method !== "GET" &&
      req.method !== "HEAD" &&
      req.method !== "DELETE"
    ) {
      body = await req.text();
    }

    // Виконуємо запит до backend
    const backendResponse = await fetch(url.toString(), {
      method: req.method,
      headers,
      body,
      // Встановлюємо timeout для запобігання зависання
      signal: AbortSignal.timeout(30000), // 30 секунд
    });

    // Отримуємо відповідь від backend
    const responseData = await backendResponse.text();

    // Форвардимо відповідь клієнту з оригінальним статусом
    return new NextResponse(responseData, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: {
        "Content-Type":
          backendResponse.headers.get("content-type") || "application/json",
        // Додаємо CORS headers якщо потрібно
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Admin API Proxy error:", error);

    // Детальніше логування помилок
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return new NextResponse(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * 🔒 КРИТИЧНО: Всі HTTP методи захищені перевіркою дозволів
 * ✅ ВИПРАВЛЕННЯ Next.js 15: params тепер Promise
 *
 * Замість використання withApiPermission, обробляємо авторизацію
 * безпосередньо в proxyHandler для підтримки context з params
 */

// GET запити - перегляд даних
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params; // ✅ await params
  return proxyHandler(req, { params });
}

// POST запити - створення нових записів
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params; // ✅ await params
  return proxyHandler(req, { params });
}

// PUT запити - повне оновлення записів
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params; // ✅ await params
  return proxyHandler(req, { params });
}

// PATCH запити - часткове оновлення записів
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params; // ✅ await params
  return proxyHandler(req, { params });
}

// DELETE запити - видалення записів
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params; // ✅ await params
  return proxyHandler(req, { params });
}

// OPTIONS запити - для CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
