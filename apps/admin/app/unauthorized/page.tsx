// apps/admin/app/unauthorized/page.tsx

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@ecity/ui";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center p-8">
        <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Доступ заборонено
        </h2>

        <p className="text-gray-600 mb-4">
          У вас немає прав для доступу до цієї сторінки.
        </p>

        <p className="text-sm text-gray-500 mb-8">
          Для доступу до адмін-панелі потрібна роль <strong>Модератора</strong>,
          <strong> Адміністратора</strong> або{" "}
          <strong>Супер-Адміністратора</strong>.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/dashboard">
            <Button className="w-full">Повернутись на головну</Button>
          </Link>

          <Link href="/login">
            <Button variant="outline" className="w-full">
              Увійти іншим акаунтом
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
