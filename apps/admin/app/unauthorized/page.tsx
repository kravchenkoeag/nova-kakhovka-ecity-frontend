// apps/admin/app/unauthorized/page.tsx

import { Button } from "@ecity/ui";
import { AlertTriangle, Home, LogIn } from "lucide-react";
import Link from "next/link";

/**
 * Сторінка для відображення помилки доступу в адмін панелі
 */
export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          {/* Іконка помилки */}
          <div className="mx-auto h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>

          {/* Заголовок */}
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            Доступ заборонено
          </h1>

          {/* Опис */}
          <p className="mt-4 text-lg text-gray-600">
            У вас немає прав для доступу до цієї сторінки
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Зверніться до адміністратора для отримання відповідних прав
          </p>

          {/* Кнопки дій */}
          <div className="mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Home className="h-4 w-4 mr-2" />
                  На головну
                </Button>
              </Link>

              <Link href="/login">
                <Button className="w-full sm:w-auto">
                  <LogIn className="h-4 w-4 mr-2" />
                  Увійти як інший користувач
                </Button>
              </Link>
            </div>
          </div>

          {/* Додаткова інформація */}
          <div className="mt-8 p-4 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Потрібні права:</strong> Модератор, Адміністратор або
              Супер Адміністратор
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
