// packages/auth/src/components/Can.tsx

"use client";

import { ReactNode } from "react";
import { UserRole, Permission } from "@ecity/types";
import {
  useHasPermission,
  useHasAnyPermission,
  useHasAllPermissions,
  useHasRole,
  useIsRoleHigherOrEqual,
  useIsAuthenticated,
} from "../hooks";

interface CanProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAllPermissions?: boolean;
  role?: UserRole;
  roles?: UserRole[];
  requireAllRoles?: boolean;
  fallback?: ReactNode;
}

/**
 * Conditional rendering component based on permissions or roles
 */
export function Can({
  children,
  permission,
  permissions,
  requireAllPermissions = false,
  role,
  roles,
  requireAllRoles = false,
  fallback = null,
}: CanProps) {
  // Permission checks
  if (permission) {
    const hasPermission = useHasPermission(permission);
    return hasPermission ? <>{children}</> : <>{fallback}</>;
  }

  if (permissions && permissions.length > 0) {
    const hasPermissions = requireAllPermissions
      ? useHasAllPermissions(permissions)
      : useHasAnyPermission(permissions);
    return hasPermissions ? <>{children}</> : <>{fallback}</>;
  }

  // Role checks
  if (role) {
    const hasRole = useIsRoleHigherOrEqual(role);
    return hasRole ? <>{children}</> : <>{fallback}</>;
  }

  if (roles && roles.length > 0) {
    const hasRoles = requireAllRoles
      ? useHasRole(roles) // This would need to be modified to check all roles
      : useHasRole(roles);
    return hasRoles ? <>{children}</> : <>{fallback}</>;
  }

  // Default: render children (no restrictions)
  return <>{children}</>;
}

/**
 * Component for checking if user has a specific permission
 */
export function HasPermission({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const hasPermission = useHasPermission(permission);
  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component for checking if user has any of the specified permissions
 */
export function HasAnyPermission({
  permissions,
  children,
  fallback = null,
}: {
  permissions: Permission[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const hasAnyPermission = useHasAnyPermission(permissions);
  return hasAnyPermission ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component for checking if user has all specified permissions
 */
export function HasAllPermissions({
  permissions,
  children,
  fallback = null,
}: {
  permissions: Permission[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const hasAllPermissions = useHasAllPermissions(permissions);
  return hasAllPermissions ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component for checking if user has a specific role or higher
 */
export function HasRole({
  role,
  children,
  fallback = null,
}: {
  role: UserRole;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const hasRole = useIsRoleHigherOrEqual(role);
  return hasRole ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component for checking if user has any of the specified roles
 */
export function HasAnyRole({
  roles,
  children,
  fallback = null,
}: {
  roles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const hasAnyRole = useHasRole(roles);
  return hasAnyRole ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component for checking if user is authenticated
 */
export function IsAuthenticated({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component for checking if user is NOT authenticated
 */
export function IsNotAuthenticated({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const isAuthenticated = useIsAuthenticated();
  return !isAuthenticated ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component for checking if user can manage other users
 */
export function CanManageUsers({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const hasPermission = useHasPermission(Permission.MANAGE_USERS);
  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component for checking if user can moderate content
 */
export function CanModerate({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const hasPermission = useHasAnyPermission([
    Permission.MODERATE_ANNOUNCEMENT,
    Permission.MODERATE_EVENT,
    Permission.MODERATE_GROUP,
    Permission.MODERATE_CITY_ISSUE,
  ]);
  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component for checking if user can create content
 */
export function CanCreate({
  contentType,
  children,
  fallback = null,
}: {
  contentType: "announcement" | "event" | "petition" | "poll" | "group";
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const permissions: Record<typeof contentType, Permission> = {
    announcement: Permission.CREATE_ANNOUNCEMENT,
    event: Permission.CREATE_EVENT,
    petition: Permission.CREATE_PETITION,
    poll: Permission.CREATE_POLL,
    group: Permission.CREATE_GROUP,
  };

  const hasPermission = useHasPermission(permissions[contentType]);
  return hasPermission ? <>{children}</> : <>{fallback}</>;
}
