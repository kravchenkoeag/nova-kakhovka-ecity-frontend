// apps/web/app/api/proxy/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@ecity/auth";

/**
 * API Proxy для web додатку
 * Проксує запити до backend API з авторизацією
 *
 * 🔒 КРИТИЧНО: Приховує access tokens від client-side коду
 * Всі запити автоматично авторизуються через session
 */

/**
 * Основна функція проксування запитів
 * Обробляє всі HTTP методи та форвардить їх на backend з авторизацією
 */
async function proxyHandler(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Отримуємо сесію — може бути null для гостей
    const session = await getServerSession(authOptions);

    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";

    const path = params.path.join("/");
    const targetUrl = `${backendUrl}/${path}`;

    const url = new URL(targetUrl);
    req.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    // Готуємо headers — Authorization додаємо тільки якщо є сесія
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "User-Agent": req.headers.get("user-agent") || "",
      Accept: req.headers.get("accept") || "application/json",
    };

    if (session?.user?.accessToken) {
      (headers as Record<string, string>)["Authorization"] =
        `Bearer ${session.user.accessToken}`;
    }

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
    console.error("Web API Proxy error:", error);

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
 * HTTP методи для проксування
 * Всі методи автоматично перевіряють авторизацію через session
 *
 * ✅ ВИПРАВЛЕННЯ Next.js 15: params тепер Promise
 * У Next.js 15 params в dynamic routes став Promise<T> замість T
 * Потрібно await params перед передачею в handler
 */

// GET запити - отримання даних
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
