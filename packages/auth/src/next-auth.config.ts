// packages/auth/src/next-auth.config.ts

import type { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

// ���������� ���� NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      is_moderator: boolean;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    is_moderator: boolean;
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    is_moderator: boolean;
    accessToken: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const response = await fetch(
            `${process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL}/api/v1/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Invalid credentials');
          }

          const data = await response.json();

          if (!data.token || !data.user) {
            throw new Error('Invalid response from server');
          }

          // ��������� ��'��� �����������
          return {
            id: data.user.id,
            email: data.user.email,
            name: `${data.user.first_name} ${data.user.last_name}`,
            is_moderator: data.user.is_moderator || false,
            token: data.token,
          } as NextAuthUser;
        } catch (error) {
          console.error('Auth error:', error);
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('Authentication failed');
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // ��� ������� ���� �������� ��� ����������� � �����
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.is_moderator = user.is_moderator;
        token.accessToken = user.token;
      }

      // ��� �������� ���
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      // ������ ��� � ������ � ����
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.is_moderator = token.is_moderator as boolean;
        session.accessToken = token.accessToken as string;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // ��������������� ���� �����
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },

  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 ������
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === 'development',
};