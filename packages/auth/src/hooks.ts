// packages/auth/src/hooks.ts

"use client";

import { useSession } from "next-auth/react";
import { UserRole, Permission } from "@ecity/types";
import { hasPermission, isRoleHigherOrEqual } from "./permissions";

// Hook для отримання access token на клієнті
export function useAccessToken() {
  const { data: session } = useSession();
  return session?.user?.accessToken || null;
}

// Hook для отримання поточної ролі користувача
export function useRole(): UserRole | null {
  const { data: session } = useSession();
  return session?.user?.role || null;
}

// Hook для отримання всіх дозволень користувача
export function usePermissions(): Permission[] {
  const { data: session } = useSession();
  return session?.user?.permissions || [];
}

// Hook для перевірки чи користувач має конкретне дозволення
export function useHasPermission(permission: Permission): boolean {
  const { data: session } = useSession();
  if (!session?.user?.role) return false;
  return hasPermission(session.user.role, permission);
}

// Hook для перевірки чи користувач має одне з дозволень
export function useHasAnyPermission(permissions: Permission[]): boolean {
  const { data: session } = useSession();
  if (!session?.user?.role) return false;
  return permissions.some((permission) =>
    hasPermission(session.user.role, permission)
  );
}

// Hook для перевірки чи користувач має всі дозволення
export function useHasAllPermissions(permissions: Permission[]): boolean {
  const { data: session } = useSession();
  if (!session?.user?.role) return false;
  return permissions.every((permission) =>
    hasPermission(session.user.role, permission)
  );
}

// Hook для перевірки чи користувач має конкретну роль
export function useHasRole(roles: UserRole[]): boolean {
  const { data: session } = useSession();
  if (!session?.user?.role) return false;
  return roles.some((role) => isRoleHigherOrEqual(session.user.role, role));
}

// Hook для перевірки чи користувач має роль вищу або рівну за необхідну
export function useIsRoleHigherOrEqual(requiredRole: UserRole): boolean {
  const { data: session } = useSession();
  if (!session?.user?.role) return false;
  return isRoleHigherOrEqual(session.user.role, requiredRole);
}

// Hook для перевірки чи користувач модератор (legacy)
export function useIsModerator() {
  const { data: session } = useSession();
  return session?.user?.isModerator || false;
}

// Hook для отримання ID користувача
export function useUserId() {
  const { data: session } = useSession();
  return session?.user?.id || null;
}

// Hook для перевірки чи користувач авторизований
export function useIsAuthenticated(): boolean {
  const { data: session, status } = useSession();
  return status === "authenticated" && !!session;
}

// Hook для перевірки статусу завантаження сесії
export function useAuthStatus() {
  const { status } = useSession();
  return status;
}
