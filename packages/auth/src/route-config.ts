// packages/auth/src/route-config.ts

import { Permission, UserRole } from "@ecity/types";

/**
 * Конфігурація дозволень для маршрутів адмін панелі
 */
export const AdminRoutePermissions: Record<string, Permission[]> = {
  // Dashboard
  "/dashboard": [Permission.MODERATE_ANNOUNCEMENT], // MODERATOR+ required

  // Users management
  "/dashboard/users": [Permission.MANAGE_USERS],
  "/dashboard/users/[id]": [Permission.MANAGE_USERS],

  // Groups management
  "/dashboard/groups": [Permission.MODERATE_GROUP],
  "/dashboard/groups/[id]": [Permission.MODERATE_GROUP],

  // Events management
  "/dashboard/events": [Permission.MODERATE_EVENT],
  "/dashboard/events/[id]": [Permission.MODERATE_EVENT],
  "/dashboard/events/create": [Permission.MODERATE_EVENT],

  // Announcements management
  "/dashboard/announcements": [Permission.MODERATE_ANNOUNCEMENT],
  "/dashboard/announcements/[id]": [Permission.MODERATE_ANNOUNCEMENT],
  "/dashboard/announcements/pending": [Permission.MODERATE_ANNOUNCEMENT],

  // Petitions management
  "/dashboard/petitions": [Permission.MODERATE_ANNOUNCEMENT], // Using general moderation
  "/dashboard/petitions/[id]": [Permission.MODERATE_ANNOUNCEMENT],

  // Polls management
  "/dashboard/polls": [Permission.MODERATE_ANNOUNCEMENT],
  "/dashboard/polls/[id]": [Permission.MODERATE_ANNOUNCEMENT],
  "/dashboard/polls/create": [Permission.MODERATE_ANNOUNCEMENT],
  "/dashboard/polls/[id]/results": [Permission.MODERATE_ANNOUNCEMENT],

  // City issues management
  "/dashboard/city-issues": [Permission.MODERATE_CITY_ISSUE],
  "/dashboard/city-issues/[id]": [Permission.MODERATE_CITY_ISSUE],
  "/dashboard/city-issues/map": [Permission.MODERATE_CITY_ISSUE],

  // Transport management
  "/dashboard/transport": [Permission.MANAGE_TRANSPORT],
  "/dashboard/transport/live": [Permission.MANAGE_TRANSPORT],
  "/dashboard/transport/routes": [Permission.MANAGE_TRANSPORT],
  "/dashboard/transport/routes/create": [Permission.MANAGE_TRANSPORT],
  "/dashboard/transport/vehicles": [Permission.MANAGE_TRANSPORT],

  // Notifications
  "/dashboard/notifications": [Permission.SEND_NOTIFICATIONS],
  "/dashboard/notifications/send": [Permission.SEND_NOTIFICATIONS],

  // Settings (Admin only)
  "/dashboard/settings": [Permission.MANAGE_SYSTEM_SETTINGS],
};

/**
 * Конфігурація дозволень для маршрутів веб додатку
 */
export const WebRoutePermissions: Record<string, Permission[]> = {
  // Profile
  "/profile": [Permission.VIEW_PROFILE],
  "/profile/edit": [Permission.EDIT_OWN_PROFILE],

  // Groups
  "/groups": [Permission.JOIN_GROUP],
  "/groups/[id]": [Permission.JOIN_GROUP],
  "/groups/[id]/chat": [Permission.SEND_MESSAGE],

  // Events
  "/events": [Permission.CREATE_EVENT], // Can view if can create
  "/events/[id]": [Permission.CREATE_EVENT],
  "/events/create": [Permission.CREATE_EVENT],

  // Announcements
  "/announcements": [Permission.CREATE_ANNOUNCEMENT],
  "/announcements/[id]": [Permission.CREATE_ANNOUNCEMENT],
  "/announcements/create": [Permission.CREATE_ANNOUNCEMENT],

  // Petitions
  "/petitions": [Permission.CREATE_PETITION],
  "/petitions/[id]": [Permission.CREATE_PETITION],
  "/petitions/create": [Permission.CREATE_PETITION],

  // Polls
  "/polls": [Permission.CREATE_POLL],
  "/polls/[id]": [Permission.CREATE_POLL],

  // City issues
  "/city-issues": [Permission.REPORT_CITY_ISSUE],
  "/city-issues/[id]": [Permission.REPORT_CITY_ISSUE],
  "/city-issues/report": [Permission.REPORT_CITY_ISSUE],
  "/city-issues/map": [Permission.REPORT_CITY_ISSUE],

  // Transport
  "/transport": [Permission.VIEW_PROFILE], // Public transport info
  "/transport/live": [Permission.VIEW_PROFILE],
  "/transport/routes": [Permission.VIEW_PROFILE],
  "/transport/routes/create": [Permission.MANAGE_TRANSPORT], // Admin only
};

/**
 * Ролі, які можуть отримати доступ до адмін панелі
 */
export const AdminPanelRoles: UserRole[] = [
  UserRole.MODERATOR,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

/**
 * Ролі, які можуть отримати доступ до веб додатку
 */
export const WebAppRoles: UserRole[] = [
  UserRole.USER,
  UserRole.MODERATOR,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

/**
 * Публічні маршрути, які не потребують авторизації
 */
export const PublicRoutes = {
  admin: ["/login", "/api/auth", "/_next", "/favicon.ico"],
  web: ["/", "/login", "/register", "/api/auth", "/_next", "/favicon.ico"],
};

/**
 * Перевіряє чи маршрут є публічним для адмін панелі
 */
export function isAdminPublicRoute(pathname: string): boolean {
  return PublicRoutes.admin.some((route) => pathname.startsWith(route));
}

/**
 * Перевіряє чи маршрут є публічним для веб додатку
 */
export function isWebPublicRoute(pathname: string): boolean {
  return PublicRoutes.web.some((route) => pathname.startsWith(route));
}

/**
 * Отримує необхідні дозволення для маршруту адмін панелі
 */
export function getAdminRoutePermissions(pathname: string): Permission[] {
  // Exact match first
  if (AdminRoutePermissions[pathname]) {
    return AdminRoutePermissions[pathname];
  }

  // Check for dynamic routes (e.g., /dashboard/users/[id])
  for (const [route, permissions] of Object.entries(AdminRoutePermissions)) {
    if (route.includes("[") && route.includes("]")) {
      // Convert dynamic route to regex pattern
      const pattern = route.replace(/\[.*?\]/g, "[^/]+");
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(pathname)) {
        return permissions;
      }
    }
  }

  // Default: require moderator permissions for any admin route
  return [Permission.MODERATE_ANNOUNCEMENT];
}

/**
 * Отримує необхідні дозволення для маршруту веб додатку
 */
export function getWebRoutePermissions(pathname: string): Permission[] {
  // Exact match first
  if (WebRoutePermissions[pathname]) {
    return WebRoutePermissions[pathname];
  }

  // Check for dynamic routes
  for (const [route, permissions] of Object.entries(WebRoutePermissions)) {
    if (route.includes("[") && route.includes("]")) {
      const pattern = route.replace(/\[.*?\]/g, "[^/]+");
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(pathname)) {
        return permissions;
      }
    }
  }

  // Default: require basic user permissions
  return [Permission.VIEW_PROFILE];
}
