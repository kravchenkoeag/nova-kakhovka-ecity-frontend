// packages/auth/src/next-auth.config.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRole, Permission, RolePermissions } from "@ecity/types";

// Базова конфігурація NextAuth для обох додатків (admin та web)
export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email та пароль обов'язкові");
        }

        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/v1/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Невірний email або пароль");
          }

          const data = await response.json();

          // Map backend role to frontend role
          const role = mapBackendRoleToFrontend(
            data.user.role || (data.user.is_moderator ? "MODERATOR" : "USER")
          );

          // Get permissions for the role
          const permissions = RolePermissions[role] || [];

          return {
            id: data.user.id,
            email: data.user.email,
            name: `${data.user.first_name} ${data.user.last_name}`,
            accessToken: data.token,
            role: role,
            permissions: permissions,
            // Legacy field for backward compatibility
            isModerator: data.user.is_moderator || false,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
        // Legacy field for backward compatibility
        token.isModerator = user.isModerator;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.accessToken = token.accessToken as string;
        session.user.role = token.role as UserRole;
        session.user.permissions = token.permissions as Permission[];
        // Legacy field for backward compatibility
        session.user.isModerator = token.isModerator as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 днів
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Maps backend role strings to frontend UserRole enum
 */
function mapBackendRoleToFrontend(backendRole: string): UserRole {
  const roleMap: Record<string, UserRole> = {
    USER: UserRole.USER,
    MODERATOR: UserRole.MODERATOR,
    ADMIN: UserRole.ADMIN,
    SUPER_ADMIN: UserRole.SUPER_ADMIN,
    // Legacy support
    user: UserRole.USER,
    moderator: UserRole.MODERATOR,
    admin: UserRole.ADMIN,
    super_admin: UserRole.SUPER_ADMIN,
  };

  return roleMap[backendRole] || UserRole.USER;
}
