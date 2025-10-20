// packages/auth/src/config/admin-routes.ts

import { Permission, UserRole } from "@ecity/types";

/**
 * Конфігурація маршрутів адмін панелі з правами доступу
 * Використовується для автоматичної перевірки прав та генерації навігації
 */

export interface RouteConfig {
  path: string;
  label: string;
  icon?: string;
  permission?: Permission;
  role?: UserRole[];
  children?: RouteConfig[];
}

/**
 * Мапінг маршрутів адмін панелі на права доступу
 * Використовується middleware для автоматичної перевірки
 */
export const AdminRoutePermissions: Record<string, Permission | Permission[]> =
  {
    // Dashboard - доступний для всіх модераторів+
    "/dashboard": Permission.MODERATE_ANNOUNCEMENT,

    // Управління користувачами - тільки Admin+
    "/dashboard/users": Permission.MANAGE_USERS,
    "/dashboard/users/[id]": Permission.MANAGE_USERS,
    "/dashboard/users/create": Permission.MANAGE_USERS,

    // Модерація оголошень - Moderator+
    "/dashboard/announcements": Permission.MODERATE_ANNOUNCEMENT,
    "/dashboard/announcements/[id]": Permission.MODERATE_ANNOUNCEMENT,
    "/dashboard/announcements/pending": Permission.MODERATE_ANNOUNCEMENT,

    // Модерація подій - Moderator+
    "/dashboard/events": Permission.MODERATE_EVENT,
    "/dashboard/events/[id]": Permission.MODERATE_EVENT,
    "/dashboard/events/create": Permission.MODERATE_EVENT,
    "/dashboard/events/pending": Permission.MODERATE_EVENT,

    // Модерація груп - Moderator+
    "/dashboard/groups": Permission.MODERATE_GROUP,
    "/dashboard/groups/[id]": Permission.MODERATE_GROUP,
    "/dashboard/groups/reported": Permission.MODERATE_GROUP,

    // Модерація петицій - Moderator+
    "/dashboard/petitions": Permission.MODERATE_ANNOUNCEMENT,
    "/dashboard/petitions/[id]": Permission.MODERATE_ANNOUNCEMENT,
    "/dashboard/petitions/pending": Permission.MODERATE_ANNOUNCEMENT,

    // Проблеми міста - Moderator+
    "/dashboard/city-issues": Permission.MODERATE_CITY_ISSUE,
    "/dashboard/city-issues/[id]": Permission.MODERATE_CITY_ISSUE,
    "/dashboard/city-issues/map": Permission.MODERATE_CITY_ISSUE,

    // Налаштування - тільки Super Admin
    "/dashboard/settings": Permission.MANAGE_SYSTEM_SETTINGS,
  };

/**
 * Конфігурація навігаційного меню
 * Елементи автоматично приховуються якщо у користувача немає прав
 */
export const AdminNavigationConfig: RouteConfig[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    role: [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  },
  {
    path: "/dashboard/users",
    label: "Користувачі",
    icon: "Users",
    permission: Permission.MANAGE_USERS,
  },
  {
    path: "/dashboard/announcements",
    label: "Оголошення",
    icon: "Megaphone",
    permission: Permission.MODERATE_ANNOUNCEMENT,
  },
  {
    path: "/dashboard/events",
    label: "Події",
    icon: "Calendar",
    permission: Permission.MODERATE_EVENT,
  },
  {
    path: "/dashboard/groups",
    label: "Групи",
    icon: "MessageSquare",
    permission: Permission.MODERATE_GROUP,
  },
  {
    path: "/dashboard/petitions",
    label: "Петиції",
    icon: "FileText",
    permission: Permission.MODERATE_ANNOUNCEMENT,
  },
  {
    path: "/dashboard/city-issues",
    label: "Проблеми міста",
    icon: "AlertTriangle",
    permission: Permission.MODERATE_CITY_ISSUE,
  },
  {
    path: "/dashboard/settings",
    label: "Налаштування",
    icon: "Settings",
    permission: Permission.MANAGE_SYSTEM_SETTINGS,
  },
];

/**
 * Допоміжна функція для перевірки доступу до маршруту
 */
export function canAccessRoute(
  route: string,
  userPermissions: Permission[]
): boolean {
  const requiredPermission = AdminRoutePermissions[route];

  if (!requiredPermission) {
    return true; // Маршрут не захищений
  }

  if (Array.isArray(requiredPermission)) {
    // Потрібна хоча б одна з прав
    return requiredPermission.some((p) => userPermissions.includes(p));
  }

  return userPermissions.includes(requiredPermission);
}

/**
 * Отримати доступні маршрути для користувача
 */
export function getAccessibleRoutes(
  userPermissions: Permission[]
): RouteConfig[] {
  return AdminNavigationConfig.filter((route) => {
    if (route.permission) {
      return userPermissions.includes(route.permission);
    }
    return true;
  });
}
