// apps/admin/app/dashboard/polls/page.tsx

import { Suspense } from "react";
import { requirePermission } from "@ecity/auth";
import { Permission } from "@ecity/types";
import {
  BarChart3,
  Search,
  Filter,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@ecity/ui";

/**
 * Сторінка управління опитуваннями
 * Доступна тільки для модераторів та адміністраторів
 */
export default async function PollsManagementPage() {
  // 🔒 КРИТИЧНО: Перевірка дозволу на модерацію опитувань
  await requirePermission(Permission.MODERATE_ANNOUNCEMENT);

  // TODO: Отримати опитування з API
  const polls = [
    {
      id: "1",
      title: "Опитування щодо нового маршруту автобуса",
      category: "transport",
      creator: "Міська рада",
      status: "active",
      total_responses: 234,
      created_at: "2024-03-15T10:30:00Z",
      end_date: "2024-04-15T23:59:59Z",
    },
    {
      id: "2",
      title: "Що вважаєте найбільш важливим для міста?",
      category: "city_planning",
      creator: "Адміністратор",
      status: "draft",
      total_responses: 0,
      created_at: "2024-03-14T14:20:00Z",
      end_date: "2024-05-14T23:59:59Z",
    },
    {
      id: "3",
      title: "Оцінка якості доріг",
      category: "infrastructure",
      creator: "Міська рада",
      status: "completed",
      total_responses: 567,
      created_at: "2024-03-10T09:00:00Z",
      end_date: "2024-03-20T23:59:59Z",
    },
  ];

  // Підрахунок статистики
  const stats = {
    draft: polls.filter((p) => p.status === "draft").length,
    active: polls.filter((p) => p.status === "active").length,
    completed: polls.filter((p) => p.status === "completed").length,
    total: polls.length,
    totalResponses: polls.reduce((sum, p) => sum + p.total_responses, 0),
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return "Чернетка";
      case "active":
        return "Активне";
      case "completed":
        return "Завершене";
      case "cancelled":
        return "Скасоване";
      default:
        return status;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      transport: "Транспорт",
      city_planning: "Планування міста",
      infrastructure: "Інфраструктура",
      social: "Соціальне",
      environment: "Екологія",
      governance: "Управління",
      budget: "Бюджет",
      education: "Освіта",
      healthcare: "Здоров'я",
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Управління опитуваннями
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Створення та модерація опитувань для громадян
          </p>
        </div>
        <Link href="/dashboard/polls/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Створити опитування
          </Button>
        </Link>
      </div>

      {/* Статистичні картки */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Чернетки</p>
              <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
            </div>
            <Clock className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Активні</p>
              <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Завершені</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.completed}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Всього відповідей
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalResponses}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
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
                placeholder="Пошук опитувань за назвою..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Всі статуси</option>
              <option value="draft">Чернетки</option>
              <option value="active">Активні</option>
              <option value="completed">Завершені</option>
              <option value="cancelled">Скасовані</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Фільтри
            </Button>
          </div>
        </div>
      </div>

      {/* Список опитувань */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Suspense
          fallback={<div className="p-8 text-center">Завантаження...</div>}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Опитування
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категорія
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Створив
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Відповіді
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
              {polls.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">Опитування не знайдено</p>
                    <p className="text-sm mt-2">
                      Створіть перше опитування для початку роботи
                    </p>
                  </td>
                </tr>
              ) : (
                polls.map((poll) => (
                  <tr key={poll.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {poll.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getCategoryLabel(poll.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{poll.creator}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                          poll.status
                        )}`}
                      >
                        {getStatusText(poll.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {poll.total_responses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(poll.end_date).toLocaleDateString("uk-UA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/polls/${poll.id}`}
                          className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          Переглянути
                        </Link>
                        {poll.status === "completed" && (
                          <Link
                            href={`/dashboard/polls/${poll.id}/results`}
                            className="text-purple-600 hover:text-purple-900 inline-flex items-center gap-1"
                          >
                            <BarChart3 className="h-4 w-4" />
                            Результати
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Suspense>
      </div>

      {/* Пагінація */}
      {polls.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button variant="outline">Попередня</Button>
            <Button variant="outline">Наступна</Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Показано <span className="font-medium">1</span> до{" "}
                <span className="font-medium">{polls.length}</span> з{" "}
                <span className="font-medium">{stats.total}</span> опитувань
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
      )}
    </div>
  );
}

