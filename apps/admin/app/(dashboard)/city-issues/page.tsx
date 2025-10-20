// apps/admin/app/(dashboard)/city-issues/page.tsx

import { Suspense } from "react";
import { requirePermission } from "@ecity/auth";
import { Permission } from "@ecity/types";
import {
  MapPin,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@ecity/ui";

/**
 * Сторінка управління проблемами міста
 * Доступна тільки для модераторів та адміністраторів
 */
export default async function CityIssuesManagementPage() {
  // 🔒 КРИТИЧНО: Перевірка дозволу на перегляд та модерацію проблем міста
  await requirePermission(Permission.MODERATE_CITY_ISSUE);

  // TODO: Отримати проблеми з API
  const issues = [
    {
      id: "1",
      title: "Яма на дорозі на вул. Шевченка",
      category: "Дороги",
      priority: "high",
      status: "in_progress",
      reporter: "Іван Петренко",
      address: "вул. Шевченка, 45",
      created_at: "2024-03-10T14:30:00Z",
      assigned_to: "Комунальний відділ",
      votes: 23,
    },
    {
      id: "2",
      title: "Не працює освітлення у парку",
      category: "Освітлення",
      priority: "medium",
      status: "new",
      reporter: "Марія Коваленко",
      address: "Центральний парк",
      created_at: "2024-03-15T09:20:00Z",
      assigned_to: null,
      votes: 15,
    },
    {
      id: "3",
      title: "Переповнений сміттєвий бак",
      category: "Санітарія",
      priority: "high",
      status: "resolved",
      reporter: "Петро Сидоренко",
      address: "вул. Гагаріна, 12",
      created_at: "2024-03-08T11:45:00Z",
      assigned_to: "Служба санітарії",
      votes: 18,
    },
    {
      id: "4",
      title: "Зламана дитяча гойдалка",
      category: "Благоустрій",
      priority: "low",
      status: "rejected",
      reporter: "Олена Іванова",
      address: "Дитячий майданчик №5",
      created_at: "2024-03-12T16:10:00Z",
      assigned_to: null,
      votes: 7,
    },
  ];

  // Підрахунок статистики
  const stats = {
    total: issues.length,
    new: issues.filter((i) => i.status === "new").length,
    in_progress: issues.filter((i) => i.status === "in_progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
    rejected: issues.filter((i) => i.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Заголовок та дії */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="h-8 w-8" />
            Проблеми міста
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Керування повідомленнями про проблеми інфраструктури та благоустрою
          </p>
        </div>
        <Link href="/dashboard/city-issues/map">
          <Button variant="outline" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Переглянути на карті
          </Button>
        </Link>
      </div>

      {/* Статистичні картки */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всього</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MapPin className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Нові</p>
              <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">В роботі</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.in_progress}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Вирішені</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.resolved}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Відхилені</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
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
                placeholder="Пошук проблем за назвою, адресою..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Всі категорії</option>
              <option value="roads">Дороги</option>
              <option value="lighting">Освітлення</option>
              <option value="sanitation">Санітарія</option>
              <option value="improvement">Благоустрій</option>
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Всі статуси</option>
              <option value="new">Нові</option>
              <option value="in_progress">В роботі</option>
              <option value="resolved">Вирішені</option>
              <option value="rejected">Відхилені</option>
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Всі пріоритети</option>
              <option value="high">Високий</option>
              <option value="medium">Середній</option>
              <option value="low">Низький</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Фільтри
            </Button>
          </div>
        </div>
      </div>

      {/* Список проблем */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Suspense
          fallback={<div className="p-8 text-center">Завантаження...</div>}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Проблема
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категорія
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пріоритет
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Адреса
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Призначено
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Голоси
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {issue.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      Повідомив: {issue.reporter}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {issue.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        issue.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : issue.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {issue.priority === "high"
                        ? "Високий"
                        : issue.priority === "medium"
                          ? "Середній"
                          : "Низький"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {issue.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {issue.assigned_to || (
                      <span className="text-gray-400 italic">
                        Не призначено
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        issue.status === "new"
                          ? "bg-blue-100 text-blue-800"
                          : issue.status === "in_progress"
                            ? "bg-orange-100 text-orange-800"
                            : issue.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {issue.status === "new"
                        ? "Нова"
                        : issue.status === "in_progress"
                          ? "В роботі"
                          : issue.status === "resolved"
                            ? "Вирішена"
                            : "Відхилена"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {issue.votes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/city-issues/${issue.id}`}
                      className="text-primary hover:text-primary/80 mr-4"
                    >
                      Переглянути
                    </Link>
                    <Link
                      href={`/dashboard/city-issues/${issue.id}/edit`}
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
              <span className="font-medium">{issues.length}</span> з{" "}
              <span className="font-medium">{stats.total}</span> проблем
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
