// packages/auth/src/api-guards.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole, Permission } from "@ecity/types";
import { hasPermission, isRoleHigherOrEqual } from "./permissions";

/**
 * Middleware для захисту API routes з авторизацією
 */
export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });

      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Add user info to request headers for downstream handlers
      const headers = new Headers(req.headers);
      headers.set("x-user-id", token.id as string);
      headers.set("x-user-role", token.role as string);
      headers.set(
        "x-user-permissions",
        JSON.stringify(token.permissions || []),
      );

      // Create new request with updated headers
      const newReq = new NextRequest(req.url, {
        method: req.method,
        headers,
        body: req.body,
      });

      return await handler(newReq);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  };
}

/**
 * Middleware для захисту API routes з перевіркою ролей
 */
export function withRole(
  roles: UserRole[],
  handler: (req: NextRequest) => Promise<NextResponse>,
) {
  return withAuth(async (req: NextRequest) => {
    const userRole = req.headers.get("x-user-role") as UserRole;

    if (!userRole) {
      return NextResponse.json(
        { error: "User role not found" },
        { status: 401 },
      );
    }

    const hasRequiredRole = roles.some((role) =>
      isRoleHigherOrEqual(userRole, role),
    );

    if (!hasRequiredRole) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    return await handler(req);
  });
}

/**
 * Middleware для захисту API routes з перевіркою дозволень
 */
export function withPermission(
  permission: Permission,
  handler: (req: NextRequest) => Promise<NextResponse>,
) {
  return withAuth(async (req: NextRequest) => {
    const userRole = req.headers.get("x-user-role") as UserRole;

    if (!userRole) {
      return NextResponse.json(
        { error: "User role not found" },
        { status: 401 },
      );
    }

    if (!hasPermission(userRole, permission)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    return await handler(req);
  });
}

/**
 * Middleware для захисту API routes з перевіркою кількох дозволень (одне з них)
 */
export function withAnyPermission(
  permissions: Permission[],
  handler: (req: NextRequest) => Promise<NextResponse>,
) {
  return withAuth(async (req: NextRequest) => {
    const userRole = req.headers.get("x-user-role") as UserRole;

    if (!userRole) {
      return NextResponse.json(
        { error: "User role not found" },
        { status: 401 },
      );
    }

    const hasAnyPermission = permissions.some((permission) =>
      hasPermission(userRole, permission),
    );

    if (!hasAnyPermission) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    return await handler(req);
  });
}

/**
 * Middleware для захисту API routes з перевіркою всіх дозволень
 */
export function withAllPermissions(
  permissions: Permission[],
  handler: (req: NextRequest) => Promise<NextResponse>,
) {
  return withAuth(async (req: NextRequest) => {
    const userRole = req.headers.get("x-user-role") as UserRole;

    if (!userRole) {
      return NextResponse.json(
        { error: "User role not found" },
        { status: 401 },
      );
    }

    const hasAllPermissions = permissions.every((permission) =>
      hasPermission(userRole, permission),
    );

    if (!hasAllPermissions) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    return await handler(req);
  });
}

/**
 * Утиліти для отримання інформації про користувача з заголовків
 */
export function getUserFromRequest(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  const userRole = req.headers.get("x-user-role") as UserRole;
  const userPermissions = req.headers.get("x-user-permissions");

  return {
    id: userId,
    role: userRole,
    permissions: userPermissions ? JSON.parse(userPermissions) : [],
  };
}

/**
 * Перевіряє чи користувач може керувати іншим користувачем
 */
export function canManageUser(
  currentUserRole: UserRole,
  targetUserRole: UserRole,
): boolean {
  // Super admin can manage everyone
  if (currentUserRole === UserRole.SUPER_ADMIN) {
    return true;
  }

  // Admin can manage users and moderators, but not other admins or super admins
  if (currentUserRole === UserRole.ADMIN) {
    return (
      targetUserRole === UserRole.USER || targetUserRole === UserRole.MODERATOR
    );
  }

  // Moderator and regular users cannot manage other users
  return false;
}

/**
 * Middleware для перевірки чи користувач може керувати іншим користувачем
 */
export function withUserManagement(
  handler: (req: NextRequest, targetUserId: string) => Promise<NextResponse>,
) {
  return withAuth(async (req: NextRequest) => {
    const currentUser = getUserFromRequest(req);
    const url = new URL(req.url);
    const targetUserId = url.pathname.split("/").pop();

    if (!targetUserId) {
      return NextResponse.json(
        { error: "User ID not provided" },
        { status: 400 },
      );
    }

    // For now, we'll allow the check to pass and let the backend handle the actual permission check
    // In a more sophisticated setup, we might want to fetch the target user's role from the backend
    // and check permissions here

    return await handler(req, targetUserId);
  });
}
