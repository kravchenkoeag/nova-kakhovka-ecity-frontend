// packages/auth/src/types.ts

import "next-auth";
import "next-auth/jwt";
import { UserRole, Permission } from "@ecity/types";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    username: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number; // Unix timestamp (ms)
    role: UserRole;
    permissions: Permission[];
    isModerator?: boolean;
  }

  interface Session {
    error?: "RefreshTokenExpired" | "RefreshAccessTokenError";
    user: {
      id: string;
      email: string;
      name: string;
      username: string;
      accessToken: string;
      role: UserRole;
      permissions: Permission[];
      isModerator?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number; // Unix timestamp (ms)
    username: string;
    role: UserRole;
    permissions: Permission[];
    isModerator?: boolean;
    error?: "RefreshTokenExpired" | "RefreshAccessTokenError";
  }
}
