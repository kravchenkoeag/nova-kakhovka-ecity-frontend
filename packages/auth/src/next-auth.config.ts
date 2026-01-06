// packages/auth/src/next-auth.config.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRole, Permission, RolePermissions } from "@ecity/types";

// Імпортуємо типи для розширення NextAuth
import "./types";

/**
 * Мапить backend роль до frontend UserRole enum
 * Підтримує різні формати backend ролей
 */
function mapBackendRoleToFrontend(backendRole: string): UserRole {
  const roleMap: Record<string, UserRole> = {
    // Uppercase варіанти
    USER: UserRole.USER,
    MODERATOR: UserRole.MODERATOR,
    ADMIN: UserRole.ADMIN,
    SUPER_ADMIN: UserRole.SUPER_ADMIN,
    SUPERADMIN: UserRole.SUPER_ADMIN,

    // Lowercase варіанти
    user: UserRole.USER,
    moderator: UserRole.MODERATOR,
    admin: UserRole.ADMIN,
    super_admin: UserRole.SUPER_ADMIN,
    superadmin: UserRole.SUPER_ADMIN,

    // Pascal/Camel case варіанти
    User: UserRole.USER,
    Moderator: UserRole.MODERATOR,
    Admin: UserRole.ADMIN,
    SuperAdmin: UserRole.SUPER_ADMIN,
  };

  return roleMap[backendRole] || UserRole.USER;
}

/**
 * Базова конфігурація NextAuth для обох додатків (admin та web)
 *
 * ВАЖЛИВО: Ця конфігурація повинна працювати в Node.js runtime,
 * а НЕ в Edge Runtime, тому всі залежності додані до
 * serverComponentsExternalPackages в next.config.js
 */
export const authOptions: NextAuthOptions = {
  // ✅ Debug mode - показує детальні логи в консолі
  // Автоматично вмикається в development режимі
  debug: process.env.NODE_ENV === "development",

  // Провайдери авторизації
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Валідація credentials
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email та пароль обов'язкові");
        }

        try {
          // ✅ ВИПРАВЛЕНО: Правильний URL - /api/v1/login (БЕЗ /auth/)
          // Backend endpoint: POST /api/v1/login
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
            },
          );

          // Обробка помилок від backend
          if (!response.ok) {
            const error = await response.json().catch(() => ({
              error: "Невірний email або пароль",
            }));
            throw new Error(error.error || "Невірний email або пароль");
          }

          const data = await response.json();

          // Валідація відповіді backend
          if (!data.user || !data.token) {
            throw new Error("Невірна відповідь від сервера");
          }

          // Map backend role to frontend role
          const role = mapBackendRoleToFrontend(
            data.user.role || (data.user.is_moderator ? "MODERATOR" : "USER"),
          );

          // Get permissions for the role
          const permissions = RolePermissions[role] || [];

          // Повертаємо об'єкт користувача для NextAuth
          return {
            id: data.user.id,
            email: data.user.email,
            name:
              `${data.user.first_name || ""} ${data.user.last_name || ""}`.trim() ||
              data.user.email,
            username: data.user.email,
            accessToken: data.token,
            role: role,
            permissions: permissions,
            // Legacy field for backward compatibility
            isModerator: data.user.is_moderator || false,
          };
        } catch (error) {
          console.error("[NextAuth] Authorization error:", error);

          // Перевіряємо чи це наша помилка або мережева
          if (error instanceof Error) {
            throw error;
          }

          // Загальна помилка
          throw new Error("Помилка авторизації. Спробуйте пізніше.");
        }
      },
    }),
  ],

  // Callbacks для обробки JWT та session
  callbacks: {
    /**
     * JWT callback - викликається коли створюється або оновлюється JWT token
     */
    async jwt({ token, user, trigger, session }) {
      // При першому логіні (user exists)
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
        token.username = user.username;
        // Legacy field
        token.isModerator = user.isModerator;
      }

      // При оновленні сесії
      if (trigger === "update" && session) {
        // Можна оновити дані в токені
        if (session.user) {
          token.name = session.user.name;
          token.email = session.user.email;
        }
      }

      return token;
    },

    /**
     * Session callback - викликається коли отримується session
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.accessToken = token.accessToken as string;
        session.user.role = token.role as UserRole;
        session.user.permissions = token.permissions as Permission[];
        session.user.username = token.username as string;
        // Legacy field
        session.user.isModerator = token.isModerator as boolean;
      }
      return session;
    },
  },

  // Сторінки авторизації
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },

  // Конфігурація сесії
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 днів
    updateAge: 24 * 60 * 60, // Оновлювати кожні 24 години
  },

  // Secret key для підпису JWT
  secret: process.env.NEXTAUTH_SECRET,

  // Додаткові налаштування
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
