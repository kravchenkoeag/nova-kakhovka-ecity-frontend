# План реалізації системи авторизації та permissions

## Аналіз поточного стану

### Що вже реалізовано:

- ✅ NextAuth.js базова конфігурація (`packages/auth/src/next-auth.config.ts`)
- ✅ JWT-based аутентифікація через backend API
- ✅ Базовий middleware для перевірки сесії в обох додатках
- ✅ Hooks для клієнтських компонентів (`useAccessToken`, `useIsModerator`)
- ✅ Server-side utils (`getSession`, `getAccessToken`, `isModerator`)
- ✅ Типізація для NextAuth з полем `isModerator`

### Що потрібно додати:

- ❌ Розширена система ролей (ADMIN, SUPER_ADMIN)
- ❌ Детальна система permissions
- ❌ Server-side auth guards для protected pages
- ❌ API Routes protection (Next.js API routes як проксі)
- ❌ Автоматичний logout при 401
- ❌ HOCs та утиліти для перевірки прав
- ❌ Компоненти для conditional rendering на основі прав

---

## Етап 1: Розширення системи типів та ролей

### 1.1 Створити enum для ролей

**Файл:** `packages/types/src/models/roles.ts`

```typescript
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

export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
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
  ],

  [UserRole.MODERATOR]: [
    ...RolePermissions[UserRole.USER],
    Permission.MODERATE_ANNOUNCEMENT,
    Permission.MODERATE_EVENT,
    Permission.MODERATE_GROUP,
    Permission.MODERATE_CITY_ISSUE,
    Permission.VIEW_REPORTS,
  ],

  [UserRole.ADMIN]: [
    ...RolePermissions[UserRole.MODERATOR],
    Permission.MANAGE_USERS,
    Permission.BLOCK_USER,
    Permission.VERIFY_USER,
    Permission.PROMOTE_MODERATOR,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_TRANSPORT,
    Permission.SEND_NOTIFICATIONS,
  ],

  [UserRole.SUPER_ADMIN]: [
    ...RolePermissions[UserRole.ADMIN],
    Permission.MANAGE_ADMINS,
    Permission.MANAGE_SYSTEM_SETTINGS,
    Permission.VIEW_AUDIT_LOGS,
    Permission.MANAGE_ROLES,
  ],
};
```

### 1.2 Оновити User типи

**Файл:** `packages/types/src/models/user.ts`

Додати поле `role: UserRole` замість булевих прапорців.

### 1.3 Оновити NextAuth типи

**Файл:** `packages/auth/src/types.ts`

Розширити типи для підтримки ролей та permissions.

---

## Етап 2: Створення utilities для permissions

### 2.1 Permission checker utilities

**Файл:** `packages/auth/src/permissions.ts`

```typescript
export function hasPermission(
  userRole: UserRole,
  permission: Permission,
): boolean;
export function hasAnyPermission(
  userRole: UserRole,
  permissions: Permission[],
): boolean;
export function hasAllPermissions(
  userRole: UserRole,
  permissions: Permission[],
): boolean;
export function getRolePermissions(role: UserRole): Permission[];
export function canAccessRoute(role: UserRole, routePath: string): boolean;
```

### 2.2 Server-side auth guards

**Файл:** `packages/auth/src/guards.ts`

```typescript
export async function requireAuth(): Promise<Session>;
export async function requireRole(roles: UserRole[]): Promise<Session>;
export async function requirePermission(
  permission: Permission,
): Promise<Session>;
export async function requirePermissions(
  permissions: Permission[],
): Promise<Session>;
```

### 2.3 Client-side hooks

**Файл:** `packages/auth/src/hooks.ts`

Додати нові hooks:

```typescript
export function useRole(): UserRole | null;
export function usePermissions(): Permission[];
export function useHasPermission(permission: Permission): boolean;
export function useHasRole(roles: UserRole[]): boolean;
```

---

## Етап 3: Middleware та route protection

### 3.1 Оновити middleware для admin

**Файл:** `apps/admin/middleware.ts`

- Перевірка наявності ролі MODERATOR, ADMIN або SUPER_ADMIN
- Редірект на `/unauthorized` для USER
- Маппінг routes до необхідних permissions

### 3.2 Оновити middleware для web

**Файл:** `apps/web/middleware.ts`

- Базова перевірка аутентифікації
- Публічні маршрути без авторизації

### 3.3 Створити конфігурацію protected routes

**Файл:** `packages/auth/src/route-config.ts`

```typescript
export const AdminRoutePermissions: Record<string, Permission[]>;
export const WebRoutePermissions: Record<string, Permission[]>;
```

---

## Етап 4: API Routes Protection

### 4.1 Створити API middleware utilities

**Файл:** `packages/auth/src/api-guards.ts`

```typescript
export function withAuth(handler: NextApiHandler): NextApiHandler;
export function withRole(
  roles: UserRole[],
  handler: NextApiHandler,
): NextApiHandler;
export function withPermission(
  permission: Permission,
  handler: NextApiHandler,
): NextApiHandler;
```

### 4.2 Створити базовий API client wrapper

**Файл:** `packages/api-client/src/auth-client.ts`

- Автоматична передача токенів
- Обробка 401 помилок з автоматичним logout
- Retry logic для expired tokens

### 4.3 Створити приклади API routes

**Адмін панель:** `apps/admin/app/api/proxy/[...path]/route.ts`

**Веб додаток:** `apps/web/app/api/proxy/[...path]/route.ts`

Proxy routes з захистом та передачею токенів до backend.

---

## Етап 5: Protected Pages (Server Components)

### 5.1 Створити wrapper компоненти

**Файл:** `packages/auth/src/components/ProtectedPage.tsx`

```typescript
export async function ProtectedPage({
  children,
  requiredRole,
  requiredPermissions,
}: ProtectedPageProps);
```

### 5.2 Додати auth checks до існуючих pages

**Admin pages потребують оновлення:**

- `apps/admin/app/(dashboard)/page.tsx` - перевірка MODERATOR+
- `apps/admin/app/(dashboard)/users/page.tsx` - MANAGE_USERS permission
- `apps/admin/app/(dashboard)/settings/page.tsx` - ADMIN+

**Web pages потребують оновлення:**

- `apps/web/app/(main)/profile/page.tsx` - requireAuth
- `apps/web/app/(main)/groups/[id]/chat/page.tsx` - SEND_MESSAGE permission

### 5.3 Створити unauthorized page

**Файли:**

- `apps/admin/app/unauthorized/page.tsx`
- `apps/web/app/unauthorized/page.tsx`

---

## Етап 6: Client Components та Conditional Rendering

### 6.1 Створити HOC для client components

**Файл:** `packages/auth/src/components/withAuth.tsx`

```typescript
export function withAuth<P>(Component: ComponentType<P>): ComponentType<P>;
export function withRole<P>(
  roles: UserRole[],
  Component: ComponentType<P>,
): ComponentType<P>;
export function withPermission<P>(
  permission: Permission,
  Component: ComponentType<P>,
): ComponentType<P>;
```

### 6.2 Створити компоненти для conditional rendering

**Файл:** `packages/auth/src/components/Can.tsx`

```typescript
<Can permission={Permission.MANAGE_USERS}>
  <AdminButton />
</Can>

<HasRole roles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
  <AdminPanel />
</HasRole>
```

### 6.3 Створити permission-based UI components

**Файл:** `packages/ui/src/components/ProtectedButton.tsx`

Кнопки, які автоматично приховуються при відсутності прав.

---

## Етап 7: Error Handling та 401 Auto-Logout

### 7.1 Створити error interceptor

**Файл:** `packages/api-client/src/interceptors.ts`

- Перехоплення 401 помилок
- Автоматичний виклик `signOut()` з NextAuth
- Редірект на `/login` з `callbackUrl`

### 7.2 Оновити ApiClient

**Файл:** `packages/api-client/src/client.ts`

Додати обробку 401 в метод `request()`.

### 7.3 Створити ErrorBoundary з auth handling

**Файл:** `packages/auth/src/components/AuthErrorBoundary.tsx`

Client-side error boundary для обробки auth помилок.

---

## Етап 8: Оновлення NextAuth конфігурації

### 8.1 Оновити authorize callback

**Файл:** `packages/auth/src/next-auth.config.ts`

- Отримувати роль з backend response
- Зберігати роль в JWT токені
- Маппінг backend ролей на frontend enum

### 8.2 Оновити JWT callback

Додати поле `role` до токена.

### 8.3 Оновити session callback

Передавати роль в session object.

---

## Етап 9: Тестування та документація

### 9.1 Створити приклади використання

**Файл:** `packages/auth/README.md`

Документація з прикладами для:

- Server Components protection
- Client Components protection
- API routes protection
- Permission checks
- Role-based access

### 9.2 Оновити існуючі компоненти

Додати auth guards до критичних компонентів:

- Header/Sidebar в admin (показувати тільки доступні пункти меню)
- Navbar в web (conditional rendering кнопок)
- Forms (disable submit для users без прав)

### 9.3 Додати unit tests

**Файли:**

- `packages/auth/src/__tests__/permissions.test.ts`
- `packages/auth/src/__tests__/guards.test.ts`

---

## Етап 10: Інтеграція з backend

### 10.1 Переконатися в сумісності

- Backend повертає роль в `/api/v1/login` response
- Backend підтримує роль в User model
- Backend API перевіряє роль та права

### 10.2 Створити mock backend responses (для розробки)

**Файл:** `apps/admin/lib/mock-auth.ts`

Для тестування без запущеного backend.

---

## Ключові файли для створення/оновлення

### Нові файли (створити):

1. `packages/types/src/models/roles.ts` - Enum ролей та permissions
2. `packages/auth/src/permissions.ts` - Permission utilities
3. `packages/auth/src/guards.ts` - Server-side guards
4. `packages/auth/src/api-guards.ts` - API middleware
5. `packages/auth/src/route-config.ts` - Route permissions config
6. `packages/auth/src/components/ProtectedPage.tsx` - Protected page wrapper
7. `packages/auth/src/components/Can.tsx` - Conditional rendering
8. `packages/auth/src/components/withAuth.tsx` - HOCs
9. `packages/api-client/src/interceptors.ts` - 401 interceptor
10. `apps/admin/app/api/proxy/[...path]/route.ts` - Admin API proxy
11. `apps/web/app/api/proxy/[...path]/route.ts` - Web API proxy
12. `apps/admin/app/unauthorized/page.tsx` - Unauthorized page
13. `apps/web/app/unauthorized/page.tsx` - Unauthorized page

### Файли для оновлення:

1. `packages/types/src/models/user.ts` - Додати role field
2. `packages/auth/src/types.ts` - Розширити NextAuth типи
3. `packages/auth/src/next-auth.config.ts` - Додати роль в JWT
4. `packages/auth/src/hooks.ts` - Нові hooks для permissions
5. `packages/auth/src/utils.ts` - Нові server utilities
6. `packages/auth/src/index.ts` - Експорти
7. `packages/api-client/src/client.ts` - 401 handling
8. `apps/admin/middleware.ts` - Role-based protection
9. `apps/web/middleware.ts` - Auth protection
10. `apps/admin/app/(dashboard)/layout.tsx` - Permission-based menu
11. Всі існуючі protected pages - Додати auth guards

---

## Порядок реалізації (пріоритет)

1. **Високий пріоритет** (критично для безпеки):
   - Етап 1: Система типів та ролей
   - Етап 2: Permission utilities
   - Етап 3: Middleware protection
   - Етап 7: 401 Auto-logout

2. **Середній пріоритет** (функціональність):
   - Етап 4: API Routes protection
   - Етап 5: Protected Pages
   - Етап 8: NextAuth конфігурація

3. **Низький пріоритет** (UX покращення):
   - Етап 6: Conditional rendering
   - Етап 9: Тестування та документація
   - Етап 10: Backend інтеграція

---

## Приклади використання після реалізації

### Server Component Protection

```typescript
// apps/admin/app/(dashboard)/users/page.tsx
import { requirePermission } from "@ecity/auth";
import { Permission } from "@ecity/types";

export default async function UsersPage() {
  await requirePermission(Permission.MANAGE_USERS);
  // Render protected content
}
```

### API Route Protection

```typescript
// apps/admin/app/api/users/route.ts
import { withPermission } from "@ecity/auth";
import { Permission } from "@ecity/types";

export const GET = withPermission(Permission.MANAGE_USERS, async (req) => {
  // Protected API logic
});
```

### Client Component Permission Check

```typescript
'use client';
import { useHasPermission } from '@ecity/auth';
import { Permission } from '@ecity/types';

export function DeleteButton() {
  const canDelete = useHasPermission(Permission.MODERATE_ANNOUNCEMENT);

  if (!canDelete) return null;

  return <Button>Delete</Button>;
}
```

### Conditional Rendering

```tsx
import { Can } from "@ecity/auth";
import { Permission } from "@ecity/types";

<Can permission={Permission.MANAGE_USERS}>
  <Link href="/admin/users">Manage Users</Link>
</Can>;
```
