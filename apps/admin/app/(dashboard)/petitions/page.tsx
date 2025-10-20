// apps/admin/app/(dashboard)/petitions/page.tsx

import { Suspense } from "react";
import { requirePermission } from "@ecity/auth";
import { Permission } from "@ecity/types";
import { FileText, Search, Filter, TrendingUp, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@ecity/ui";

/**
 * Сторінка модерації петицій
 * Доступна тільки для модераторів та адміністраторів
 */
export default async function PetitionsManagementPage() {
  // 🔒 КРИТИЧНО: Перевірка дозволу на модерацію петицій
  // Використовуємо загальний дозвіл на модерацію оголошень
  await requirePermission(Permission.MODERATE_ANNOUNCEMENT);

  // TODO: Отримати петиції з API
  const petitions = [
    {
      id: "1",
      title: "Встановлення дитячого майданчика в парку",
      category: "Благоустрій",
      author: "Олена Мельник",
      signatures: 1247,
      goal: 1500,
      status: "active",
      created_at: "2024-02-10T10:00:00Z",
      deadline: "2024-05-10T23:59:59Z",
    },
    {
      id: "2",
      title: "Ремонт дороги на вулиці Центральна",
      category: "Інфраструктура",
      author: "Петро Коваль",
      signatures: 892,
      goal: 1000,
      status: "pending",
      created_at: "2024-03-01T14:30:00Z",
      deadline: "2024-06-01T23:59:59Z",
    },
    {
      id: "3",
      title: "Відкриття нового медичного центру",
      category: "Охорона здоров'я",
      author: "Марія Іванова",
      signatures: 2341,
      goal: 2000,
      status: "achieved",
      created_at: "2024-01-15T09:00:00Z",
      deadline: "2024-04-15T23:59:59Z",
    },
  ];

  // Підрахунок статистики
  const stats = {
    total: petitions.length,
    active: petitions.filter((p) => p.status === "active").length,
    achieved: petitions.filter((p) => p.status === "achieved").length,
    totalSignatures: petitions.reduce((sum, p) => sum + p.signatures, 0),
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Модерація петицій
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Керування електронними петиціями та ініціативами громадян
        </p>
      </div>

      {/* Статистичні картки */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Досягли мети</p>
              <p className="text-2xl font-bold text-green-600">{stats.achieved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всього підписів</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalSignatures}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
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
                placeholder="Пошук петицій за назвою, автором..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Всі категорії</option>
              <option value="infrastructure">Інфраструктура</option>
              <option value="improvement">Благоустрій</option>
              <option value="healthcare">Охорона здоров'я</option>
              <option value="education">Освіта</option>
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Всі статуси</option>
              <option value="active">Активні</option>
              <option value="pending">На розгляді</option>
              <option value="achieved">Досягли мети</option>
              <option value="rejected">Відхилені</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Фільтри
            </Button>
          </div>
        </div>
      </div>

      {/* Список петицій */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Suspense fallback={<div className="p-8 text-center">Завантаження...</div>}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Петиція
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категорія
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Автор
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Прогрес
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дедлайн
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {petitions.map((petition) => {
                const progress = Math.round((petition.signatures / petition.goal) * 100);
                return (
                  <tr key={petition.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {petition.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {petition.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {petition.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>{petition.signatures}</span>
                          <span>{petition.goal}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              progress >= 100
                                ? "bg-green-600"
                                : progress >= 75
                                ? "bg-blue-600"
                                : progress >= 50
                                ? "bg-yellow-600"
                                : "bg-orange-600"
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{progress}%</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          petition.status === "active"
                            ? "bg-blue-100 text-blue-800"
                            : petition.status === "pending"
                            ? "bg-orange-100 text-orange-800"
                            : petition.status === "achieved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {petition.status === "active"
                          ? "Активна"
                          : petition.status === "pending"
                          ? "На розгляді"
                          : petition.status === "achieved"
                          ? "Досягла мети"
                          : "Відхилена"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(petition.deadline).toLocaleDateString("uk-UA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/dashboard/petitions/${petition.id}`}
                        className="text-primary hover:text-primary/80 mr-4"
                      >
                        Переглянути
                      </Link>
                      {petition.status === "pending" && (
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
                );
              })}
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
              <span className="font-medium">{petitions.length}</span> з{" "}
              <span className="font-medium">{stats.total}</span> петицій
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всього петицій</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Активні</p>
              <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">