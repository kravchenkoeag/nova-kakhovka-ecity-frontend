// apps/admin/app/page.tsx

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@ecity/auth";

/**
 * Root page - redirects authenticated users to dashboard
 * Unauthenticated users will be redirected by middleware to /login
 */
export default async function RootPage() {
  const session = await getServerSession(authOptions);

  // If user is authenticated, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  // If not authenticated, middleware will handle redirect to /login
  // But we'll redirect here as well to be safe
  redirect("/login");
}

