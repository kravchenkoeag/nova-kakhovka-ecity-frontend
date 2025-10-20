// apps/admin/app/(dashboard)/users/page.tsx

import { Suspense } from "react";
import { requirePermission } from "@ecity/auth";
import { Permission } from "@ecity/types";
import { Users, Search, Filter, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@ecity/ui";

/**
 * Сторінка управління користувачами
 * Доступна тільки для адміністраторів з правом MANAGE_USERS
 */
export default async function UsersManagementPage() {
  // 🔒 КРИТИЧНО: Перевірка дозволу на керування користувачами
  await requirePermission(Permission.MANAGE_USERS);

  // TODO: Отримати список користувачів з API
  const users = [
    {
      id: "1",
      name: "Іван Петренко",
      email: "ivan@example.com",
      role: "USER",
      status: "active",
      created_at: "2024-01-15",
    },
    {
      id: "2",
      name: "Марія Коваленко",
      email: "maria@example.com",
      role: "MODERATOR",
      status: "active",
      created_at: "2024-02-10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок та дії */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8" />
            Управління користувачами
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Перегляд, редагування та керування обліковими записами користувачів
          </p>
        </div>
        <Link href="/dashboard/users/create">
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Додати користувача
          </Button>
        </Link>
      </div>

      {/* Фільтри та пошук */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Пошук користувачів за ім'ям, email..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Фільтри
          </Button>
        </div>
      </div>

      {/* Таблиця користувачів */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Suspense
          fallback={<div className="p-8 text-center">Завантаження...</div>}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Користувач
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Роль
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата реєстрації
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "MODERATOR"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status === "active" ? "Активний" : "Заблокований"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString("uk-UA")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      className="text-primary hover:text-primary/80 mr-4"
                    >
                      Переглянути
                    </Link>
                    <Link
                      href={`/dashboard/users/${user.id}/edit`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Редагувати
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Suspense>
      </div>

      {/* Пагінація - TODO */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button variant="outline">Попередня</Button>
          <Button variant="outline">Наступна</Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Показано <span className="font-medium">1</span> до{" "}
              <span className="font-medium">2</span> з{" "}
              <span className="font-medium">2</span> користувачів
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
              <Button variant="outline" size="sm">
                Попередня
              </Button>
              <Button variant="outline" size="sm" className="ml-2">
                Наступна
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
