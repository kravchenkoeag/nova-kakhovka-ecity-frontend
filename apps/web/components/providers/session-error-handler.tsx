"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

/**
 * Автоматично виходить з системи якщо refresh token протермінувався.
 * Монтується один раз у корневому layout всередині SessionProvider.
 */
export function SessionErrorHandler() {
  const { data: session } = useSession();

  useEffect(() => {
    if (
      session?.error === "RefreshTokenExpired" ||
      session?.error === "RefreshAccessTokenError"
    ) {
      signOut({ callbackUrl: "/login?reason=session_expired" });
    }
  }, [session?.error]);

  return null;
}
