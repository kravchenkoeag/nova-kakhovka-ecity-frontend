// packages/auth/src/index.ts

export { authOptions } from "./next-auth.config";
export {
  createAuthMiddleware,
  adminMiddleware,
  webMiddleware,
} from "./middleware";

// Server-side utilities
export { getSession, getAccessToken, isModerator, getUserId } from "./utils";

// Server-side guards
export {
  requireAuth,
  requireRole,
  requirePermission,
  requirePermissions,
  requireAllPermissions,
  checkAuth,
  checkRole,
  checkPermission,
  checkPermissions,
  getCurrentUserRole,
  getCurrentUserPermissions,
} from "./guards";

// Permission utilities
export {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  canAccessRoute,
  isRoleHigherOrEqual,
  canManageUser,
  canPromoteTo,
  canModerateContent,
  getAvailableRoles,
  canCreateContent,
  canEditOwnContent,
  canDeleteOwnContent,
} from "./permissions";

// Client-side hooks
export {
  useAccessToken,
  useIsModerator,
  useUserId,
  useRole,
  usePermissions,
  useHasPermission,
  useHasAnyPermission,
  useHasAllPermissions,
  useHasRole,
  useIsRoleHigherOrEqual,
  useIsAuthenticated,
  useAuthStatus,
} from "./hooks";

// API guards
export {
  withAuth as withApiAuth,
  withRole as withApiRole,
  withPermission as withApiPermission,
  withAnyPermission,
  withAllPermissions,
  getUserFromRequest,
  canManageUser as canManageUserInAPI,
  withUserManagement as withApiUserManagement,
} from "./api-guards";

// Route configuration
export {
  AdminRoutePermissions,
  WebRoutePermissions,
  AdminPanelRoles,
  WebAppRoles,
  PublicRoutes,
  isAdminPublicRoute,
  isWebPublicRoute,
  getAdminRoutePermissions,
  getWebRoutePermissions,
} from "./route-config";

// Protected page components
export {
  ProtectedPage,
  createProtectedPage,
  AdminOnlyPage,
  ModeratorOnlyPage,
  SuperAdminOnlyPage,
  createPermissionBasedPage,
  createMultiplePermissionPage,
} from "./components/ProtectedPage";

// Conditional rendering components
export {
  Can,
  HasPermission,
  HasAnyPermission,
  HasAllPermissions,
  HasRole,
  HasAnyRole,
  IsAuthenticated,
  IsNotAuthenticated,
  CanManageUsers,
  CanModerate,
  CanCreate,
} from "./components/Can";

// Higher-order components
export {
  withAuth,
  withRole,
  withPermission,
  withPermissions,
  withMinimumRole,
  withAuthConditions,
  withAdminOnly,
  withModeratorOnly,
  withSuperAdminOnly,
  withUserManagement,
  withModeration,
  withContentCreation,
} from "./components/withAuth";

// Експортуємо types для TypeScript
export type {} from "./types";
