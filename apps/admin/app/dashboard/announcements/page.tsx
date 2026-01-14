// apps/admin/app/dashboard/announcements/page.tsx

import { Suspense } from "react";
import { requirePermission } from "@ecity/auth";
import { Permission } from "@ecity/types";
import {
  Megaphone,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@ecity/ui";

/**
 * Сторінка модерації оголошень
 * Доступна тільки для модераторів та адміністраторів
 */
export default async function AnnouncementsManagementPage() {
  // 🔒 КРИТИЧНО: Перевірка дозволу на модерацію оголошень
  await requirePermission(Permission.MODERATE_ANNOUNCEMENT);

  // TODO: Отримати оголошення з API
  const announcements = [
    {
      id: "1",
      title: "Продам велосипед",
      category: "Товари",
      author: "Іван Петренко",
      status: "pending",
      created_at: "2024-03-15T10:30:00Z",
      views: 45,
    },
    {
      id: "2",
      title: "Шукаю репетитора з англійської",
      category: "Послуги",
      author: "Марія Коваленко",
      status: "approved",
      created_at: "2024-03-14T14:20:00Z",
      views: 123,
    },
    {
      id: "3",
      title: "Здам квартиру в центрі",
      category: "Нерухомість",
      author: "Олексій Шевченко",
      status: "rejected",
      created_at: "2024-03-13T09:15:00Z",
      views: 67,
    },
  ];

  // Підрахунок статистики
  const stats = {
    pending: announcements.filter((a) => a.status === "pending").length,
    approved: announcements.filter((a) => a.status === "approved").length,
    rejected: announcements.filter((a) => a.status === "rejected").length,
    total: announcements.length,
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Megaphone className="h-8 w-8" />
          Модерація оголошень
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Перегляд, схвалення та відхилення оголошень користувачів
        </p>
      </div>

      {/* Статистичні картки */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">На розгляді</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.pending}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Схвалено</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.approved}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Відхилено</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всього</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Megaphone className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Фільтри та пошук */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Пошук оголошень за назвою, автором..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Всі статуси</option>
              <option value="pending">На розгляді</option>
              <option value="approved">Схвалено</option>
              <option value="rejected">Відхилено</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Фільтри
            </Button>
          </div>
        </div>
      </div>

      {/* Список оголошень */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Suspense
          fallback={<div className="p-8 text-center">Завантаження...</div>}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Оголошення
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категорія
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Автор
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата створення
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Перегляди
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {announcements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {announcement.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {announcement.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {announcement.author}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        announcement.status === "pending"
                          ? "bg-orange-100 text-orange-800"
                          : announcement.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {announcement.status === "pending"
                        ? "На розгляді"
                        : announcement.status === "approved"
                          ? "Схвалено"
                          : "Відхилено"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(announcement.created_at).toLocaleDateString(
                      "uk-UA",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {announcement.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/announcements/${announcement.id}`}
                      className="text-primary hover:text-primary/80 mr-4"
                    >
                      Переглянути
                    </Link>
                    {announcement.status === "pending" && (
                      <>
                        <button className="text-green-600 hover:text-green-900 mr-2">
                          Схвалити
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Відхилити
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Suspense>
      </div>

      {/* Пагінація */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button variant="outline">Попередня</Button>
          <Button variant="outline">Наступна</Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Показано <span className="font-medium">1</span> до{" "}
              <span className="font-medium">{announcements.length}</span> з{" "}
              <span className="font-medium">{stats.total}</span> оголошень
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
