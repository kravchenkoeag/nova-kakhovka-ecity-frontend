// packages/auth/src/permissions.ts

import { UserRole, Permission, RolePermissions } from "@ecity/types";

/**
 * Перевіряє чи має користувач конкретне дозволення
 */
export function hasPermission(
  userRole: UserRole,
  permission: Permission,
): boolean {
  const rolePermissions = RolePermissions[userRole] || [];
  return rolePermissions.includes(permission);
}

/**
 * Перевіряє чи має користувач хоча б одне з дозволень
 */
export function hasAnyPermission(
  userRole: UserRole,
  permissions: Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission));
}

/**
 * Перевіряє чи має користувач всі дозволення
 */
export function hasAllPermissions(
  userRole: UserRole,
  permissions: Permission[],
): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission));
}

/**
 * Отримує всі дозволення для ролі
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return RolePermissions[role] || [];
}

/**
 * Перевіряє чи може користувач з роллю отримати доступ до маршруту
 */
export function canAccessRoute(role: UserRole, routePath: string): boolean {
  // Admin routes require MODERATOR or higher
  if (routePath.startsWith("/dashboard")) {
    return hasPermission(role, Permission.MODERATE_ANNOUNCEMENT);
  }

  // User profile routes require authentication
  if (routePath.startsWith("/profile")) {
    return hasPermission(role, Permission.VIEW_PROFILE);
  }

  // Group chat requires SEND_MESSAGE permission
  if (routePath.includes("/chat")) {
    return hasPermission(role, Permission.SEND_MESSAGE);
  }

  // Default: allow access for authenticated users
  return true;
}

/**
 * Перевіряє чи є роль вищою або рівною за необхідну
 */
export function isRoleHigherOrEqual(
  userRole: UserRole,
  requiredRole: UserRole,
): boolean {
  const roleHierarchy = {
    [UserRole.USER]: 0,
    [UserRole.MODERATOR]: 1,
    [UserRole.ADMIN]: 2,
    [UserRole.SUPER_ADMIN]: 3,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Перевіряє чи може користувач керувати іншим користувачем
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
 * Перевіряє чи може користувач підвищити іншого користувача до ролі
 */
export function canPromoteTo(
  currentUserRole: UserRole,
  targetRole: UserRole,
): boolean {
  // Super admin can promote to any role
  if (currentUserRole === UserRole.SUPER_ADMIN) {
    return true;
  }

  // Admin can only promote to moderator
  if (currentUserRole === UserRole.ADMIN) {
    return targetRole === UserRole.MODERATOR;
  }

  // Others cannot promote
  return false;
}

/**
 * Перевіряє чи може користувач модерувати контент
 */
export function canModerateContent(
  userRole: UserRole,
  contentType: "announcement" | "event" | "group" | "city_issue",
): boolean {
  switch (contentType) {
    case "announcement":
      return hasPermission(userRole, Permission.MODERATE_ANNOUNCEMENT);
    case "event":
      return hasPermission(userRole, Permission.MODERATE_EVENT);
    case "group":
      return hasPermission(userRole, Permission.MODERATE_GROUP);
    case "city_issue":
      return hasPermission(userRole, Permission.MODERATE_CITY_ISSUE);
    default:
      return false;
  }
}

/**
 * Отримує всі доступні ролі для поточного користувача
 */
export function getAvailableRoles(currentUserRole: UserRole): UserRole[] {
  switch (currentUserRole) {
    case UserRole.SUPER_ADMIN:
      return [
        UserRole.USER,
        UserRole.MODERATOR,
        UserRole.ADMIN,
        UserRole.SUPER_ADMIN,
      ];
    case UserRole.ADMIN:
      return [UserRole.USER, UserRole.MODERATOR];
    default:
      return [UserRole.USER];
  }
}

/**
 * Перевіряє чи може користувач створювати контент
 */
export function canCreateContent(
  userRole: UserRole,
  contentType: "announcement" | "event" | "petition" | "poll" | "group",
): boolean {
  switch (contentType) {
    case "announcement":
      return hasPermission(userRole, Permission.CREATE_ANNOUNCEMENT);
    case "event":
      return hasPermission(userRole, Permission.CREATE_EVENT);
    case "petition":
      return hasPermission(userRole, Permission.CREATE_PETITION);
    case "poll":
      return hasPermission(userRole, Permission.CREATE_POLL);
    case "group":
      return hasPermission(userRole, Permission.CREATE_GROUP);
    default:
      return false;
  }
}

/**
 * Перевіряє чи може користувач редагувати власний контент
 */
export function canEditOwnContent(
  userRole: UserRole,
  contentType: "announcement" | "event",
): boolean {
  switch (contentType) {
    case "announcement":
      return hasPermission(userRole, Permission.EDIT_OWN_ANNOUNCEMENT);
    case "event":
      return hasPermission(userRole, Permission.EDIT_OWN_EVENT);
    default:
      return false;
  }
}

/**
 * Перевіряє чи може користувач видаляти власний контент
 */
export function canDeleteOwnContent(
  userRole: UserRole,
  contentType: "announcement" | "event",
): boolean {
  switch (contentType) {
    case "announcement":
      return hasPermission(userRole, Permission.DELETE_OWN_ANNOUNCEMENT);
    case "event":
      return hasPermission(userRole, Permission.DELETE_OWN_EVENT);
    default:
      return false;
  }
}
