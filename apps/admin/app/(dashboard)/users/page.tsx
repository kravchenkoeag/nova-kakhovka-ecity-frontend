// apps/admin/app/(dashboard)/users/page.tsx

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@ecity/auth";
import { Permission } from "@ecity/types";
import UsersManagementClient from "./UsersManagementClient";

/*
 * 1️⃣ Server-Side: Перевірка прав ДО рендерингу сторінки (ЦЕЙ ФАЙЛ)
 * 2️⃣ Client-Side: useHasPermission() в UsersManagementClient для UX (не для безпеки)
 * 3️⃣ Backend API: Перевірка прав на кожному endpoint
 */
export default async function UsersPage() {
  // 🔒 Server-Side перевірка авторизації
  const session = await getServerSession(authOptions);

  // Перевірка чи користувач авторизований
  if (!session || !session.user) {
    redirect("/login");
  }

  const hasPermission = session.user.permissions?.includes(
    Permission.USERS_MANAGE
  );

  // Перевірка чи користувач має право управляти користувачами
  if (!hasPermission) {
    redirect("/unauthorized");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Управління користувачами
          </h1>
          <p className="text-muted-foreground mt-2">
            Перегляд, редагування та управління користувачами платформи
          </p>
        </div>
      </div>

      {/* Client Component з логікою управління */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        }
      >
        <UsersManagementClient />
      </Suspense>
    </div>
  );
}

// Metadata для сторінки
export const metadata = {
  title: "Управління користувачами",
  description: "Адміністрування користувачів платформи",
};
