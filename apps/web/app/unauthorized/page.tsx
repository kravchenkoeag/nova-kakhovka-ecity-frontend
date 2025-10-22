// apps/web/app/unauthorized/page.tsx

import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@ecity/ui";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full text-center p-8 bg-white rounded-xl shadow-lg">
        <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <Lock className="h-8 w-8 text-orange-600" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Недостатньо прав
        </h2>

        <p className="text-gray-600 mb-8">
          У вас немає прав для виконання цієї дії. Зв'яжіться з адміністратором
          для отримання доступу.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/">
            <Button className="w-full">На головну</Button>
          </Link>

          <Link href="/profile">
            <Button variant="outline" className="w-full">
              Мій профіль
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
