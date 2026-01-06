// packages/types/src/models/roles.ts

export enum UserRole {
  USER = "USER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum Permission {
  // User permissions
  VIEW_PROFILE = "view:profile",
  EDIT_OWN_PROFILE = "edit:own_profile",

  // Content permissions
  CREATE_ANNOUNCEMENT = "create:announcement",
  EDIT_OWN_ANNOUNCEMENT = "edit:own_announcement",
  DELETE_OWN_ANNOUNCEMENT = "delete:own_announcement",

  CREATE_EVENT = "create:event",
  EDIT_OWN_EVENT = "edit:own_event",
  DELETE_OWN_EVENT = "delete:own_event",

  CREATE_PETITION = "create:petition",
  SIGN_PETITION = "sign:petition",

  CREATE_POLL = "create:poll",
  VOTE_POLL = "vote:poll",

  REPORT_CITY_ISSUE = "report:city_issue",

  // Group permissions
  CREATE_GROUP = "create:group",
  JOIN_GROUP = "join:group",
  SEND_MESSAGE = "send:message",

  // Moderator permissions
  MODERATE_ANNOUNCEMENT = "moderate:announcement",
  MODERATE_EVENT = "moderate:event",
  MODERATE_GROUP = "moderate:group",
  MODERATE_CITY_ISSUE = "moderate:city_issue",
  VIEW_REPORTS = "view:reports",

  // Admin permissions
  MANAGE_USERS = "manage:users",
  USERS_MANAGE = "users:manage",

  BLOCK_USER = "block:user",
  VERIFY_USER = "verify:user",
  PROMOTE_MODERATOR = "promote:moderator",

  VIEW_ANALYTICS = "view:analytics",
  MANAGE_TRANSPORT = "manage:transport",
  SEND_NOTIFICATIONS = "send:notifications",

  // Super Admin permissions
  MANAGE_ADMINS = "manage:admins",
  MANAGE_SYSTEM_SETTINGS = "manage:system_settings",
  VIEW_AUDIT_LOGS = "view:audit_logs",
  MANAGE_ROLES = "manage:roles",
}

// Define base permissions for each role level
const USER_PERMISSIONS: Permission[] = [
  Permission.VIEW_PROFILE,
  Permission.EDIT_OWN_PROFILE,
  Permission.CREATE_ANNOUNCEMENT,
  Permission.EDIT_OWN_ANNOUNCEMENT,
  Permission.DELETE_OWN_ANNOUNCEMENT,
  Permission.CREATE_EVENT,
  Permission.EDIT_OWN_EVENT,
  Permission.DELETE_OWN_EVENT,
  Permission.CREATE_PETITION,
  Permission.SIGN_PETITION,
  Permission.CREATE_POLL,
  Permission.VOTE_POLL,
  Permission.REPORT_CITY_ISSUE,
  Permission.CREATE_GROUP,
  Permission.JOIN_GROUP,
  Permission.SEND_MESSAGE,
];

const MODERATOR_PERMISSIONS: Permission[] = [
  Permission.MODERATE_ANNOUNCEMENT,
  Permission.MODERATE_EVENT,
  Permission.MODERATE_GROUP,
  Permission.MODERATE_CITY_ISSUE,
  Permission.VIEW_REPORTS,
];

const ADMIN_PERMISSIONS: Permission[] = [
  Permission.MANAGE_USERS,
  Permission.USERS_MANAGE, // ✅ ДОДАНО
  Permission.BLOCK_USER,
  Permission.VERIFY_USER,
  Permission.PROMOTE_MODERATOR,
  Permission.VIEW_ANALYTICS,
  Permission.MANAGE_TRANSPORT,
  Permission.SEND_NOTIFICATIONS,
];

const SUPER_ADMIN_PERMISSIONS: Permission[] = [
  Permission.MANAGE_ADMINS,
  Permission.MANAGE_SYSTEM_SETTINGS,
  Permission.VIEW_AUDIT_LOGS,
  Permission.MANAGE_ROLES,
];

// Combine permissions hierarchically
export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.USER]: USER_PERMISSIONS,
  [UserRole.MODERATOR]: [...USER_PERMISSIONS, ...MODERATOR_PERMISSIONS],
  [UserRole.ADMIN]: [
    ...USER_PERMISSIONS,
    ...MODERATOR_PERMISSIONS,
    ...ADMIN_PERMISSIONS,
  ],
  [UserRole.SUPER_ADMIN]: [
    ...USER_PERMISSIONS,
    ...MODERATOR_PERMISSIONS,
    ...ADMIN_PERMISSIONS,
    ...SUPER_ADMIN_PERMISSIONS,
  ],
};

// Перевіряє чи має користувач конкретне дозволення
export function hasPermission(
  userRole: UserRole,
  permission: Permission
): boolean {
  const rolePermissions = RolePermissions[userRole] || [];
  return rolePermissions.includes(permission);
}

//Перевіряє чи має користувач хоча б одне з дозволень
export function hasAnyPermission(
  userRole: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission));
}

// Перевіряє чи має користувач всі дозволення
export function hasAllPermissions(
  userRole: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission));
}

// Отримати числовий рівень ролі для порівняння
export function getRoleLevel(role: UserRole): number {
  const levels = {
    [UserRole.USER]: 0,
    [UserRole.MODERATOR]: 1,
    [UserRole.ADMIN]: 2,
    [UserRole.SUPER_ADMIN]: 3,
  };
  return levels[role];
}

//Перевіряє чи роль вища або рівна за необхідну
export function isRoleHigherOrEqual(
  userRole: UserRole,
  requiredRole: UserRole
): boolean {
  return getRoleLevel(userRole) >= getRoleLevel(requiredRole);
}

/**
 * Перевіряє чи може користувач підвищити роль іншого користувача
 * Правила:
 * - Тільки ADMIN та SUPER_ADMIN можуть підвищувати ролі
 * - SUPER_ADMIN може підвищити до будь-якої ролі
 * - ADMIN може підвищити тільки до MODERATOR
 */
export function canElevateTo(
  userRole: UserRole,
  targetRole: UserRole
): boolean {
  // Тільки адміни та супер-адміни можуть підвищувати ролі
  if (userRole !== UserRole.ADMIN && userRole !== UserRole.SUPER_ADMIN) {
    return false;
  }

  // Супер-адмін може підвищити до будь-якої ролі
  if (userRole === UserRole.SUPER_ADMIN) {
    return true;
  }

  // Звичайний адмін може підвищити тільки до модератора
  return targetRole === UserRole.MODERATOR;
}
