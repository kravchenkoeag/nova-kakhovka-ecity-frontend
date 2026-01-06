// packages/auth/src/components/withAuth.tsx

"use client";

import { ComponentType, ReactNode } from "react";
import { UserRole, Permission } from "@ecity/types";
import {
  useIsAuthenticated,
  useHasPermission,
  useHasAnyPermission,
  useHasAllPermissions,
  useHasRole,
  useIsRoleHigherOrEqual,
  useAuthStatus,
} from "../hooks";

/**
 * Higher-order component that wraps a component with authentication check
 */
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode,
) {
  return function AuthenticatedComponent(props: P) {
    const isAuthenticated = useIsAuthenticated();
    const authStatus = useAuthStatus();

    // Show loading state while checking authentication
    if (authStatus === "loading") {
      return <div>Loading...</div>;
    }

    // Show fallback or nothing if not authenticated
    if (!isAuthenticated) {
      return <>{fallback}</>;
    }

    return <Component {...props} />;
  };
}

/**
 * Higher-order component that wraps a component with role check
 */
export function withRole<P extends object>(
  roles: UserRole | UserRole[],
  Component: ComponentType<P>,
  fallback?: ReactNode,
) {
  return function RoleProtectedComponent(props: P) {
    const roleArray = Array.isArray(roles) ? roles : [roles];
    const hasRole = useHasRole(roleArray);

    if (!hasRole) {
      return <>{fallback}</>;
    }

    return <Component {...props} />;
  };
}

/**
 * Higher-order component that wraps a component with permission check
 */
export function withPermission<P extends object>(
  permission: Permission,
  Component: ComponentType<P>,
  fallback?: ReactNode,
) {
  return function PermissionProtectedComponent(props: P) {
    const hasPermission = useHasPermission(permission);

    if (!hasPermission) {
      return <>{fallback}</>;
    }

    return <Component {...props} />;
  };
}

/**
 * Higher-order component that wraps a component with multiple permissions check
 */
export function withPermissions<P extends object>(
  permissions: Permission[],
  requireAll: boolean = false,
  Component: ComponentType<P>,
  fallback?: ReactNode,
) {
  return function PermissionsProtectedComponent(props: P) {
    const hasPermissions = requireAll
      ? useHasAllPermissions(permissions)
      : useHasAnyPermission(permissions);

    if (!hasPermissions) {
      return <>{fallback}</>;
    }

    return <Component {...props} />;
  };
}

/**
 * Higher-order component that wraps a component with minimum role level check
 */
export function withMinimumRole<P extends object>(
  minimumRole: UserRole,
  Component: ComponentType<P>,
  fallback?: ReactNode,
) {
  return function MinimumRoleProtectedComponent(props: P) {
    const hasMinimumRole = useIsRoleHigherOrEqual(minimumRole);

    if (!hasMinimumRole) {
      return <>{fallback}</>;
    }

    return <Component {...props} />;
  };
}

/**
 * Higher-order component that wraps a component with multiple conditions
 */
export function withAuthConditions<P extends object>(
  conditions: {
    requireAuth?: boolean;
    roles?: UserRole[];
    permissions?: Permission[];
    requireAllPermissions?: boolean;
    minimumRole?: UserRole;
  },
  Component: ComponentType<P>,
  fallback?: ReactNode,
) {
  return function AuthConditionsProtectedComponent(props: P) {
    const {
      requireAuth = true,
      roles,
      permissions,
      requireAllPermissions = false,
      minimumRole,
    } = conditions;

    // Check authentication
    if (requireAuth) {
      const isAuthenticated = useIsAuthenticated();
      if (!isAuthenticated) {
        return <>{fallback}</>;
      }
    }

    // Check roles
    if (roles && roles.length > 0) {
      const hasRole = useHasRole(roles);
      if (!hasRole) {
        return <>{fallback}</>;
      }
    }

    // Check permissions
    if (permissions && permissions.length > 0) {
      const hasPermissions = requireAllPermissions
        ? useHasAllPermissions(permissions)
        : useHasAnyPermission(permissions);
      if (!hasPermissions) {
        return <>{fallback}</>;
      }
    }

    // Check minimum role
    if (minimumRole) {
      const hasMinimumRole = useIsRoleHigherOrEqual(minimumRole);
      if (!hasMinimumRole) {
        return <>{fallback}</>;
      }
    }

    return <Component {...props} />;
  };
}

/**
 * Pre-configured HOCs for common use cases
 */
export const withAdminOnly = <P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode,
) => withMinimumRole(UserRole.ADMIN, Component, fallback);

export const withModeratorOnly = <P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode,
) => withMinimumRole(UserRole.MODERATOR, Component, fallback);

export const withSuperAdminOnly = <P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode,
) => withRole([UserRole.SUPER_ADMIN], Component, fallback);

/**
 * HOC for components that require user management permissions
 */
export const withUserManagement = <P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode,
) => withPermission(Permission.MANAGE_USERS, Component, fallback);

/**
 * HOC for components that require moderation permissions
 */
export const withModeration = <P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode,
) =>
  withPermissions(
    [
      "MODERATE_ANNOUNCEMENT" as Permission,
      "MODERATE_EVENT" as Permission,
      "MODERATE_GROUP" as Permission,
      "MODERATE_CITY_ISSUE" as Permission,
    ],
    false,
    Component,
    fallback,
  );

/**
 * HOC for components that require content creation permissions
 */
export const withContentCreation = <P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode,
) =>
  withPermissions(
    [
      "CREATE_ANNOUNCEMENT" as Permission,
      "CREATE_EVENT" as Permission,
      "CREATE_PETITION" as Permission,
      "CREATE_POLL" as Permission,
    ],
    false,
    Component,
    fallback,
  );
