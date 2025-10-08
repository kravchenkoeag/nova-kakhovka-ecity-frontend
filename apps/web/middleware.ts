// apps/web/middleware.ts

import { webMiddleware } from '@ecity/auth';

export { webMiddleware as middleware };

export const config = {
  matcher: [
    '/profile/:path*',
    '/groups/:path*',
    '/events/create',
    '/announcements/create',
    '/petitions/create',
    '/city-issues/report',
  ],
};
