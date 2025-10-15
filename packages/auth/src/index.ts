// packages/auth/src/index.ts

export { authOptions } from './next-auth.config';
export {
  createAuthMiddleware,
  adminMiddleware,
  webMiddleware,
} from './middleware';
export {
  getSession,
  getAccessToken,
  isModerator,
  getUserId,
} from './utils';
export {
  useAccessToken,
  useIsModerator,
  useUserId,
} from './hooks';

// Експортуємо types для TypeScript
export type {} from './types';