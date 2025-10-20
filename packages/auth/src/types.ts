// packages/auth/src/types.ts

import "next-auth";
import "next-auth/jwt";
import { UserRole, Permission } from "@ecity/types";

// Розширюємо типи NextAuth для наших кастомних полів
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    username: string; // Додано username
    accessToken: string;
    role: UserRole;
    permissions: Permission[];
    // Legacy field for backward compatibility
    isModerator?: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      username: string; // Додано username
      accessToken: string;
      role: UserRole;
      permissions: Permission[];
      // Legacy field for backward compatibility
      isModerator?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken: string;
    username: string; // Додано username
    role: UserRole;
    permissions: Permission[];
    // Legacy field for backward compatibility
    isModerator?: boolean;
  }
}
