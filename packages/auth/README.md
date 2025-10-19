# @ecity/auth - Authentication & Authorization Package

Comprehensive authentication and authorization system for Nova Kakhovka e-City platform with role-based access control, permissions, and protected routes.

## Features

- 🔐 **Role-based Authentication** - USER, MODERATOR, ADMIN, SUPER_ADMIN roles
- 🛡️ **Granular Permissions** - 25+ specific permissions for fine-grained access control
- 🚦 **Server-side Guards** - Protect pages and API routes with server-side validation
- 🎯 **Client-side Hooks** - React hooks for permission checks in components
- 🧩 **Conditional Rendering** - Components for showing/hiding UI based on permissions
- 🔄 **Auto-logout** - Automatic logout on 401 errors with token expiration handling
- 📱 **Next.js Integration** - Built for Next.js 14 with App Router support
- 🔒 **API Protection** - Middleware for protecting Next.js API routes

## Quick Start

### Installation

```bash
pnpm add @ecity/auth
```

### Basic Usage

```typescript
// Server Component - Protect a page
import { requirePermission } from '@gly/auth';
import { Permission } from '@gly/types';

export default async function AdminPage() {
  await requirePermission(Permission.MANAGE_USERS);
  return <div>Admin content</div>;
}
```

```tsx
// Client Component - Conditional rendering
import { Can } from "@gly/auth";
import { Permission } from "@gly/types";

export function DeleteButton() {
  return (
    <Can permission={Permission.MODERATE_ANNOUNCEMENT}>
      <button>Delete</button>
    </Can>
  );
}
```

## Role System

### Roles Hierarchy

```
SUPER_ADMIN (Level 3)
    ↓
ADMIN (Level 2)
    ↓
MODERATOR (Level 1)
    ↓
USER (Level 0)
```

### Role Permissions

Each role inherits permissions from lower roles:

- **USER**: Basic content creation, profile management
- **MODERATOR**: Content moderation, user reports
- **ADMIN**: User management, analytics, transport management
- **SUPER_ADMIN**: System settings, admin management, audit logs

## Server-side Protection

### Page Protection

```typescript
// Require authentication only
import { requireAuth } from '@gly/auth';

export default async function ProfilePage() {
  await requireAuth();
  return <div>Profile content</div>;
}

// Require specific role
import { requireRole } from '@gly/auth';
import { UserRole } from '@gly/types';

export default async function AdminPage() {
  await requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  return <div>Admin content</div>;
}

// Require specific permission
import { requirePermission } from '@gly/auth';
import { Permission } from '@gly/types';

export default async function UserManagementPage() {
  await requirePermission(Permission.MANAGE_USERS);
  return <div>User management</div>;
}
```

### Protected Page Wrapper

```typescript
import { ProtectedPage } from '@gly/auth';
import { Permission } from '@gly/types';

export default function UsersPage() {
  return (
    <ProtectedPage
      requiredPermission={Permission.MANAGE_USERS}
    >
      <div>Users content</div>
    </ProtectedPage>
  );
}
```

### API Route Protection

```typescript
// app/api/users/route.ts
import { withPermission } from "@gly/auth";
import { Permission } from "@gly/types";

async function handler(req: NextRequest) {
  // Your API logic here
  return NextResponse.json({ users: [] });
}

export const GET = withPermission(Permission.MANAGE_USERS, handler);
export const POST = withPermission(Permission.MANAGE_USERS, handler);
```

## Client-side Protection

### React Hooks

```tsx
"use client";
import { useHasPermission, useRole, useIsAuthenticated } from "@gly/auth";
import { Permission, UserRole } from "@gly/types";

export function MyComponent() {
  const canManageUsers = useHasPermission(Permission.MANAGE_USERS);
  const userRole = useRole();
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Role: {userRole}</p>
      {canManageUsers && <button>Manage Users</button>}
    </div>
  );
}
```

### Conditional Rendering Components

```tsx
import { Can, HasPermission, HasRole, IsAuthenticated } from "@gly/auth";
import { Permission, UserRole } from "@gly/types";

export function Dashboard() {
  return (
    <div>
      <IsAuthenticated>
        <h1>Welcome to Dashboard</h1>

        <HasRole role={UserRole.ADMIN}>
          <AdminPanel />
        </HasRole>

        <HasPermission permission={Permission.MANAGE_USERS}>
          <UserManagementButton />
        </HasPermission>

        <Can
          permissions={[
            Permission.CREATE_ANNOUNCEMENT,
            Permission.CREATE_EVENT,
          ]}
          requireAllPermissions={false}
        >
          <CreateContentButton />
        </Can>
      </IsAuthenticated>
    </div>
  );
}
```

### Higher-Order Components

```tsx
import { withAuth, withPermission, withRole } from "@gly/auth";
import { Permission, UserRole } from "@gly/types";

// Protect entire component
const ProtectedButton = withPermission(
  Permission.MODERATE_ANNOUNCEMENT,
  ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}>Moderate</button>
  )
);

// Role-based protection
const AdminOnlyComponent = withRole(
  [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  () => <div>Admin only content</div>
);

// Authentication protection
const AuthenticatedComponent = withAuth(
  () => <div>Logged in content</div>,
  <div>Please log in</div>
);
```

## API Client Integration

### Automatic Token Handling

```typescript
import { ApiClient } from "@gly/api-client";
import { useAccessToken } from "@gly/auth";

("use client");
export function useApiClient() {
  const token = useAccessToken();
  const client = new ApiClient(process.env.NEXT_PUBLIC_API_URL!);

  return {
    getUsers: () => client.get("/users", token),
    createUser: (data: any) => client.post("/users", data, token),
  };
}
```

### 401 Auto-logout

The API client automatically handles 401 errors and logs out users:

```typescript
// This will automatically trigger logout on 401
const users = await apiClient.get("/users", token);
```

## Middleware Configuration

### Admin Panel Middleware

```typescript
// apps/admin/middleware.ts
import { adminMiddleware } from "@gly/auth";

export default adminMiddleware;

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### Web App Middleware

```typescript
// apps/web/middleware.ts
import { webMiddleware } from "@gly/auth";

export default webMiddleware;

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

## Permission System

### Available Permissions

#### User Permissions

- `VIEW_PROFILE` - View user profiles
- `EDIT_OWN_PROFILE` - Edit own profile

#### Content Permissions

- `CREATE_ANNOUNCEMENT` - Create announcements
- `EDIT_OWN_ANNOUNCEMENT` - Edit own announcements
- `DELETE_OWN_ANNOUNCEMENT` - Delete own announcements
- `CREATE_EVENT` - Create events
- `EDIT_OWN_EVENT` - Edit own events
- `DELETE_OWN_EVENT` - Delete own events
- `CREATE_PETITION` - Create petitions
- `SIGN_PETITION` - Sign petitions
- `CREATE_POLL` - Create polls
- `VOTE_POLL` - Vote in polls
- `REPORT_CITY_ISSUE` - Report city issues

#### Group Permissions

- `CREATE_GROUP` - Create groups
- `JOIN_GROUP` - Join groups
- `SEND_MESSAGE` - Send messages in groups

#### Moderator Permissions

- `MODERATE_ANNOUNCEMENT` - Moderate announcements
- `MODERATE_EVENT` - Moderate events
- `MODERATE_GROUP` - Moderate groups
- `MODERATE_CITY_ISSUE` - Moderate city issues
- `VIEW_REPORTS` - View user reports

#### Admin Permissions

- `MANAGE_USERS` - Manage users
- `BLOCK_USER` - Block users
- `VERIFY_USER` - Verify users
- `PROMOTE_MODERATOR` - Promote to moderator
- `VIEW_ANALYTICS` - View analytics
- `MANAGE_TRANSPORT` - Manage transport
- `SEND_NOTIFICATIONS` - Send notifications

#### Super Admin Permissions

- `MANAGE_ADMINS` - Manage administrators
- `MANAGE_SYSTEM_SETTINGS` - Manage system settings
- `VIEW_AUDIT_LOGS` - View audit logs
- `MANAGE_ROLES` - Manage user roles

### Permission Utilities

```typescript
import { hasPermission, canManageUser, canPromoteTo } from "@gly/auth";
import { UserRole, Permission } from "@gly/types";

// Check permissions
const canDelete = hasPermission(
  UserRole.MODERATOR,
  Permission.MODERATE_ANNOUNCEMENT
);

// Check user management
const canManage = canManageUser(UserRole.ADMIN, UserRole.USER);

// Check promotion rights
const canPromote = canPromoteTo(UserRole.ADMIN, UserRole.MODERATOR);
```

## Route Configuration

### Admin Routes

```typescript
import { AdminRoutePermissions } from "@gly/auth";

// Routes are automatically protected based on configuration
// /dashboard/users requires MANAGE_USERS permission
// /dashboard/settings requires MANAGE_SYSTEM_SETTINGS permission
```

### Web Routes

```typescript
import { WebRoutePermissions } from "@gly/auth";

// Routes are automatically protected based on configuration
// /profile requires VIEW_PROFILE permission
// /groups/[id]/chat requires SEND_MESSAGE permission
```

## Error Handling

### Unauthorized Access

When users don't have required permissions, they're redirected to `/unauthorized` page with appropriate messaging.

### Token Expiration

401 errors automatically trigger logout and redirect to login page with callback URL.

### Error Boundaries

```tsx
import { AuthErrorBoundary } from "@gly/auth";

export function App() {
  return (
    <AuthErrorBoundary>
      <YourApp />
    </AuthErrorBoundary>
  );
}
```

## Best Practices

### 1. Server-side Protection First

Always protect sensitive pages and API routes on the server side:

```typescript
// ✅ Good - Server-side protection
export default async function SensitivePage() {
  await requirePermission(Permission.MANAGE_USERS);
  return <SensitiveContent />;
}

// ❌ Bad - Client-side only
export function SensitivePage() {
  const canAccess = useHasPermission(Permission.MANAGE_USERS);
  if (!canAccess) return <div>Access denied</div>;
  return <SensitiveContent />;
}
```

### 2. Use Conditional Rendering for UX

Use client-side components for better user experience:

```tsx
// ✅ Good - Hide/show based on permissions
<HasPermission permission={Permission.MANAGE_USERS}>
  <AdminButton />
</HasPermission>

// ❌ Bad - Show button then disable
<button disabled={!canManageUsers}>Admin Action</button>
```

### 3. Consistent Permission Checking

Use the same permission checks on both client and server:

```typescript
// Server-side
await requirePermission(Permission.MANAGE_USERS);

// Client-side
const canManage = useHasPermission(Permission.MANAGE_USERS);
```

### 4. Role Hierarchy

Leverage role hierarchy for cleaner code:

```typescript
// ✅ Good - Use role hierarchy
await requireRole([UserRole.ADMIN]); // Admins and Super Admins

// ❌ Avoid - List all roles
await requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
```

## Migration Guide

### From Legacy is_moderator System

The new system is backward compatible. Legacy `is_moderator` field is still supported:

```typescript
// Old way (still works)
const isModerator = useIsModerator();

// New way (recommended)
const role = useRole();
const isModerator =
  role === UserRole.MODERATOR ||
  role === UserRole.ADMIN ||
  role === UserRole.SUPER_ADMIN;
```

### Updating Existing Components

```typescript
// Before
if (user.is_moderator) {
  // Show admin content
}

// After
<HasRole role={UserRole.MODERATOR}>
  {/* Show admin content */}
</HasRole>
```

## Troubleshooting

### Common Issues

1. **"Cannot read property 'role' of undefined"**
   - Ensure user is authenticated before checking role
   - Use `useIsAuthenticated()` to check auth status

2. **Permissions not working**
   - Verify backend returns correct role in login response
   - Check NextAuth configuration includes role mapping

3. **Middleware redirects not working**
   - Ensure middleware is properly configured in `middleware.ts`
   - Check matcher patterns in config

4. **API routes returning 401**
   - Verify token is being passed correctly
   - Check API guard configuration

### Debug Mode

Enable debug mode in development:

```typescript
// next-auth.config.ts
export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  // ... rest of config
};
```

## API Reference

### Server-side Guards

- `requireAuth()` - Require authentication
- `requireRole(roles)` - Require specific roles
- `requirePermission(permission)` - Require specific permission
- `requirePermissions(permissions)` - Require any of the permissions
- `requireAllPermissions(permissions)` - Require all permissions

### Client-side Hooks

- `useRole()` - Get current user role
- `usePermissions()` - Get current user permissions
- `useHasPermission(permission)` - Check specific permission
- `useHasRole(roles)` - Check specific roles
- `useIsAuthenticated()` - Check authentication status

### Components

- `Can` - Conditional rendering based on permissions/roles
- `HasPermission` - Show/hide based on permission
- `HasRole` - Show/hide based on role
- `IsAuthenticated` - Show/hide based on auth status

### HOCs

- `withAuth(Component)` - Wrap component with auth check
- `withRole(roles, Component)` - Wrap component with role check
- `withPermission(permission, Component)` - Wrap component with permission check

## Contributing

1. Follow the existing code patterns
2. Add tests for new features
3. Update documentation
4. Ensure backward compatibility

## License

MIT License - see LICENSE file for details.
