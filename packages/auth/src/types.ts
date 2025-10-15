// packages/auth/src/types.ts

import 'next-auth';
import 'next-auth/jwt';

// Розширюємо типи NextAuth для наших кастомних полів
declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    accessToken: string;
    isModerator: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      accessToken: string;
      isModerator: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    accessToken: string;
    isModerator: boolean;
  }
}