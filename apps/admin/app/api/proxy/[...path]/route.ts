// apps/admin/app/api/proxy/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { withApiPermission } from "@ecity/auth";
import { Permission } from "@ecity/types";

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
    // Отримуємо backend URL з environment
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";

    // Будуємо повний шлях до backend API
    const path = params.path.join("/");
    const targetUrl = `${backendUrl}/api/v1/${path}`;

    // Копіюємо query parameters з оригінального запиту
    const url = new URL(targetUrl);
    req.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    // Отримуємо authorization header (встановлений auth middleware)
    const authHeader = req.headers.get("authorization");

    // Готуємо headers для backend запиту
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      // Форвардимо authorization header якщо є
      ...(authHeader && { Authorization: authHeader }),
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
 * 🔒 КРИТИЧНО: Всі HTTP методи захищені дозволом MODERATE_ANNOUNCEMENT
 * Це базовий дозвіл для модераторів. Для більш точного контролю можна
 * додати перевірку конкретних дозволів залежно від endpoint'а
 */

// GET запити - перегляд даних
export const GET = withApiPermission(
  Permission.MODERATE_ANNOUNCEMENT,
  proxyHandler
);

// POST запити - створення нових записів
export const POST = withApiPermission(
  Permission.MODERATE_ANNOUNCEMENT,
  proxyHandler
);

// PUT запити - повне оновлення записів
export const PUT = withApiPermission(
  Permission.MODERATE_ANNOUNCEMENT,
  proxyHandler
);

// PATCH запити - часткове оновлення записів
export const PATCH = withApiPermission(
  Permission.MODERATE_ANNOUNCEMENT,
  proxyHandler
);

// DELETE запити - видалення записів
export const DELETE = withApiPermission(
  Permission.MODERATE_ANNOUNCEMENT,
  proxyHandler
);

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
