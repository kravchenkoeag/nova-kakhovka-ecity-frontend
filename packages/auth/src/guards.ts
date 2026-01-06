// packages/auth/src/guards.ts

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./next-auth.config";
import { UserRole, Permission } from "@ecity/types";
import { hasPermission, isRoleHigherOrEqual } from "./permissions";

/**
 * Вимагає авторизації користувача
 * Редіректить на login якщо не авторизований
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return session;
}

/**
 * Вимагає конкретну роль або вищу
 * Редіректить на unauthorized якщо роль недостатня
 */
export async function requireRole(roles: UserRole[]) {
  const session = await requireAuth();

  if (!session.user.role) {
    redirect("/unauthorized");
  }

  const hasRequiredRole = roles.some((role) =>
    isRoleHigherOrEqual(session.user.role, role),
  );

  if (!hasRequiredRole) {
    redirect("/unauthorized");
  }

  return session;
}

/**
 * Вимагає конкретне дозволення
 * Редіректить на unauthorized якщо дозволення немає
 */
export async function requirePermission(permission: Permission) {
  const session = await requireAuth();

  if (!session.user.role) {
    redirect("/unauthorized");
  }

  if (!hasPermission(session.user.role, permission)) {
    redirect("/unauthorized");
  }

  return session;
}

/**
 * Вимагає одне з дозволень
 * Редіректить на unauthorized якщо жодного дозволення немає
 */
export async function requirePermissions(permissions: Permission[]) {
  const session = await requireAuth();

  if (!session.user.role) {
    redirect("/unauthorized");
  }

  const hasAnyPermission = permissions.some((permission) =>
    hasPermission(session.user.role, permission),
  );

  if (!hasAnyPermission) {
    redirect("/unauthorized");
  }

  return session;
}

/**
 * Вимагає всі дозволення
 * Редіректить на unauthorized якщо не всі дозволення є
 */
export async function requireAllPermissions(permissions: Permission[]) {
  const session = await requireAuth();

  if (!session.user.role) {
    redirect("/unauthorized");
  }

  const hasAllPermissions = permissions.every((permission) =>
    hasPermission(session.user.role, permission),
  );

  if (!hasAllPermissions) {
    redirect("/unauthorized");
  }

  return session;
}

/**
 * Перевіряє чи користувач авторизований (без редіректу)
 * Повертає session або null
 */
export async function checkAuth() {
  return await getServerSession(authOptions);
}

/**
 * Перевіряє чи користувач має роль (без редіректу)
 * Повертає session або null
 */
export async function checkRole(roles: UserRole[]) {
  const session = await checkAuth();

  if (!session || !session.user.role) {
    return null;
  }

  const hasRequiredRole = roles.some((role) =>
    isRoleHigherOrEqual(session.user.role, role),
  );

  return hasRequiredRole ? session : null;
}

/**
 * Перевіряє чи користувач має дозволення (без редіректу)
 * Повертає session або null
 */
export async function checkPermission(permission: Permission) {
  const session = await checkAuth();

  if (!session || !session.user.role) {
    return null;
  }

  if (!hasPermission(session.user.role, permission)) {
    return null;
  }

  return session;
}

/**
 * Перевіряє чи користувач має одне з дозволень (без редіректу)
 * Повертає session або null
 */
export async function checkPermissions(permissions: Permission[]) {
  const session = await checkAuth();

  if (!session || !session.user.role) {
    return null;
  }

  const hasAnyPermission = permissions.some((permission) =>
    hasPermission(session.user.role, permission),
  );

  return hasAnyPermission ? session : null;
}

/**
 * Отримує поточну роль користувача (без редіректу)
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const session = await checkAuth();
  return session?.user?.role || null;
}

/**
 * Отримує поточні дозволення користувача (без редіректу)
 */
export async function getCurrentUserPermissions(): Promise<Permission[]> {
  const session = await checkAuth();
  return session?.user?.permissions || [];
}
