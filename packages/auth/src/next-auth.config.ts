// packages/auth/src/next-auth.config.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRole, Permission, RolePermissions } from "@ecity/types";
import "./types";

const ACCESS_TOKEN_MARGIN_MS = 5 * 60 * 1000; // оновлюємо за 5 хв до закінчення

function mapBackendRoleToFrontend(backendRole: string): UserRole {
  const roleMap: Record<string, UserRole> = {
    USER: UserRole.USER, MODERATOR: UserRole.MODERATOR,
    ADMIN: UserRole.ADMIN, SUPER_ADMIN: UserRole.SUPER_ADMIN,
    SUPERADMIN: UserRole.SUPER_ADMIN,
    user: UserRole.USER, moderator: UserRole.MODERATOR,
    admin: UserRole.ADMIN, super_admin: UserRole.SUPER_ADMIN,
    superadmin: UserRole.SUPER_ADMIN,
    User: UserRole.USER, Moderator: UserRole.MODERATOR,
    Admin: UserRole.ADMIN, SuperAdmin: UserRole.SUPER_ADMIN,
  };
  return roleMap[backendRole] || UserRole.USER;
}

async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  accessTokenExpires: number;
  error?: never;
} | { error: "RefreshTokenExpired" | "RefreshAccessTokenError" }> {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/v1/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );

    if (response.status === 401) {
      return { error: "RefreshTokenExpired" };
    }

    if (!response.ok) {
      return { error: "RefreshAccessTokenError" };
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + (data.expires_in ?? 3600) * 1000,
    };
  } catch {
    return { error: "RefreshAccessTokenError" };
  }
}

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
            `${process.env.BACKEND_URL}/api/v1/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            const error = await response.json().catch(() => ({
              error: "Невірний email або пароль",
            }));
            // Пробрасуємо структуровані помилки для обробки в UI
            if (error.code === "ACCOUNT_LOCKED" || error.code === "USER_BLOCKED") {
              throw new Error(JSON.stringify(error));
            }
            throw new Error(error.error || "Невірний email або пароль");
          }

          const data = await response.json();

          if (!data.user || !data.access_token) {
            throw new Error("Невірна відповідь від сервера");
          }

          const role = mapBackendRoleToFrontend(
            data.user.role || (data.user.is_moderator ? "MODERATOR" : "USER")
          );
          const permissions = RolePermissions[role] || [];

          return {
            id: data.user.id,
            email: data.user.email,
            name:
              `${data.user.first_name || ""} ${data.user.last_name || ""}`.trim() ||
              data.user.email,
            username: data.user.email,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            accessTokenExpires: Date.now() + (data.expires_in ?? 3600) * 1000,
            role,
            permissions,
            isModerator: data.user.is_moderator || false,
          };
        } catch (error) {
          console.error("[NextAuth] Authorization error:", error);
          if (error instanceof Error) throw error;
          throw new Error("Помилка авторизації. Спробуйте пізніше.");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Перший логін
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires;
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
        token.username = user.username;
        token.isModerator = user.isModerator;
        delete token.error;
        return token;
      }

      // Оновлення сесії вручну
      if (trigger === "update" && session?.user) {
        if (session.user.name) token.name = session.user.name;
        if (session.user.email) token.email = session.user.email;
      }

      // Якщо access token ще дійсний — повертаємо без змін
      if (Date.now() < (token.accessTokenExpires ?? 0) - ACCESS_TOKEN_MARGIN_MS) {
        return token;
      }

      // Access token закінчується — оновлюємо через refresh token
      if (!token.refreshToken) {
        return { ...token, error: "RefreshTokenExpired" as const };
      }

      const refreshed = await refreshAccessToken(token.refreshToken);
      if ("error" in refreshed) {
        return { ...token, error: refreshed.error };
      }

      return {
        ...token,
        accessToken: refreshed.accessToken,
        accessTokenExpires: refreshed.accessTokenExpires,
        error: undefined,
      };
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.accessToken = token.accessToken;
        session.user.role = token.role;
        session.user.permissions = token.permissions;
        session.user.username = token.username;
        session.user.isModerator = token.isModerator;
      }
      if (token.error) {
        session.error = token.error;
      }
      return session;
    },
  },

  events: {
    // Відкликаємо refresh token на backend при виході
    async signOut({ token }) {
      if (token?.refreshToken) {
        try {
          await fetch(`${process.env.BACKEND_URL}/api/v1/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: token.refreshToken }),
          });
        } catch {
          // Не блокуємо logout якщо backend недоступний
        }
      }
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 днів — відповідає TTL refresh token
    updateAge: 60 * 60,        // перевіряємо щогодини
  },

  secret: process.env.NEXTAUTH_SECRET,

  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
