// apps/admin/app/api/proxy/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { withApiPermission } from "@ecity/auth";
import { Permission } from "@ecity/types";

/**
 * API Proxy для адмін панелі
 * Проксує запити до backend API з авторизацією та дозволеннями
 */
async function proxyHandler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") || "";

  // Get the backend URL from environment
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";

  // Get user token from headers (set by auth middleware)
  const authHeader = req.headers.get("authorization");

  try {
    // Forward the request to the backend
    const backendResponse = await fetch(`${backendUrl}/api/v1/${path}`, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
        // Forward other relevant headers
        "User-Agent": req.headers.get("user-agent") || "",
        Accept: req.headers.get("accept") || "application/json",
      },
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.text()
          : undefined,
    });

    // Forward the response
    const responseData = await backendResponse.text();

    return new NextResponse(responseData, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: {
        "Content-Type":
          backendResponse.headers.get("content-type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Protect all proxy routes with moderator permissions
export const GET = withApiPermission(
  Permission.MODERATE_ANNOUNCEMENT,
  proxyHandler
);
export const POST = withApiPermission(
  Permission.MODERATE_ANNOUNCEMENT,
  proxyHandler
);
export const PUT = withApiPermission(
  Permission.MODERATE_ANNOUNCEMENT,
  proxyHandler
);
export const PATCH = withApiPermission(
  Permission.MODERATE_ANNOUNCEMENT,
  proxyHandler
);
export const DELETE = withApiPermission(
  Permission.MODERATE_ANNOUNCEMENT,
  proxyHandler
);
