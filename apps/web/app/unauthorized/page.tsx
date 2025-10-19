// apps/web/app/unauthorized/page.tsx

import { Button } from "@ecity/ui";
import { AlertTriangle, Home, LogIn } from "lucide-react";
import Link from "next/link";

/**
 * Сторінка для відображення помилки доступу в веб додатку
 */
export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            {/* Іконка помилки */}
            <div className="mx-auto h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>

            {/* Заголовок */}
            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Доступ заборонено
            </h1>

            {/* Опис */}
            <p className="mt-4 text-gray-600">
              У вас немає прав для доступу до цієї сторінки
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Будь ласка, увійдіть з обліковим записом, який має відповідні
              права
            </p>

            {/* Кнопки дій */}
            <div className="mt-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Home className="h-4 w-4 mr-2" />
                    На головну
                  </Button>
                </Link>

                <Link href="/login">
                  <Button className="w-full sm:w-auto">
                    <LogIn className="h-4 w-4 mr-2" />
                    Увійти
                  </Button>
                </Link>
              </div>
            </div>

            {/* Додаткова інформація */}
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Потрібна авторизація</strong> для доступу до цієї
                сторінки
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
