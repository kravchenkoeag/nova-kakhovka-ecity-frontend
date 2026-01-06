// packages/auth/src/components/ProtectedPage.tsx

import { ReactNode } from "react";
import { UserRole, Permission } from "@ecity/types";
import {
  requireAuth,
  requireRole,
  requirePermission,
  requirePermissions,
} from "../guards";

interface ProtectedPageProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  requiredPermissions?: Permission | Permission[];
  requireAllPermissions?: boolean;
  fallback?: ReactNode;
}

/**
 * Wrapper component for protecting pages with authentication and authorization
 * This is a Server Component wrapper that can be used in page.tsx files
 */
export async function ProtectedPage({
  children,
  requiredRole,
  requiredPermissions,
  requireAllPermissions = false,
  fallback = null,
}: ProtectedPageProps) {
  try {
    // Always require authentication
    await requireAuth();

    // Check role if specified
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      await requireRole(roles);
    }

    // Check permissions if specified
    if (requiredPermissions) {
      const permissions = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      if (requireAllPermissions) {
        await requirePermissions(permissions);
      } else {
        await requirePermissions(permissions);
      }
    }

    // If all checks pass, render children
    return <>{children}</>;
  } catch (error) {
    // If any check fails, the guards will redirect
    // This fallback should rarely be reached
    return <>{fallback}</>;
  }
}

/**
 * Higher-order function to create protected page components
 */
export function createProtectedPage(
  requiredRole?: UserRole | UserRole[],
  requiredPermissions?: Permission | Permission[],
  requireAllPermissions?: boolean,
) {
  return function ProtectedPageWrapper({ children }: { children: ReactNode }) {
    return (
      <ProtectedPage
        requiredRole={requiredRole}
        requiredPermissions={requiredPermissions}
        requireAllPermissions={requireAllPermissions}
      >
        {children}
      </ProtectedPage>
    );
  };
}

/**
 * Pre-configured protected page components for common use cases
 */
export const AdminOnlyPage = createProtectedPage([
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
]);
export const ModeratorOnlyPage = createProtectedPage([
  UserRole.MODERATOR,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
]);
export const SuperAdminOnlyPage = createProtectedPage([UserRole.SUPER_ADMIN]);

/**
 * Permission-based protected page components
 */
export function createPermissionBasedPage(permission: Permission) {
  return createProtectedPage(undefined, permission);
}

export function createMultiplePermissionPage(
  permissions: Permission[],
  requireAll = false,
) {
  return createProtectedPage(undefined, permissions, requireAll);
}
