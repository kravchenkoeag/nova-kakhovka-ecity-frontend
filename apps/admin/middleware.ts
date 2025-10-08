// apps/admin/middleware.ts

import { adminMiddleware } from '@ecity/auth';

export { adminMiddleware as middleware };

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/protected/:path*',
  ],
};