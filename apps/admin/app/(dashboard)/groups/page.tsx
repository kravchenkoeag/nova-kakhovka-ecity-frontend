// apps/admin/app/(dashboard)/groups/page.tsx

import { Suspense } from "react";
import { requirePermission } from "@ecity/auth";
import { Permission } from "@ecity/types";
import {
  Users,
  Search,
  Filter,
  MessageSquare,
  Lock,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@ecity/ui";

/**
 * Сторінка модерації груп
 * Доступна тільки для модераторів та адміністраторів
 */
export default async function GroupsManagementPage() {
  // 🔒 КРИТИЧНО: Перевірка дозволу на модерацію груп
  await requirePermission(Permission.MODERATE_GROUP);

  // TODO: Отримати групи з API
  const groups = [
    {
      id: "1",
      name: "Батьки школярів",
      description: "Обговорення шкільних питань",
      type: "education",
      is_public: true,
      members_count: 234,
      messages_count: 1456,
      admin: "Олена Іванова",
      created_at: "2024-01-15T10:00:00Z",
      status: "active",
    },
    {
      id: "2",
      name: "Спортивний клуб",
      description: "Організація спортивних заходів",
      type: "sport",
      is_public: false,
      members_count: 89,
      messages_count: 567,
      admin: "Петро Сидоренко",
      created_at: "2024-02-10T14:30:00Z",
      status: "active",
    },
    {
      id: "3",
      name: "Сусіди 5-го мікрорайону",
      description: "Обговорення проблем мікрорайону",
      type: "neighborhood",
      is_public: true,
      members_count: 156,
      messages_count: 892,
      admin: "Марія Коваленко",
      created_at: "2024-01-20T09:15:00Z",
      status: "under_review",
    },
  ];

  // Підрахунок статистики
  const stats = {
    total: groups.length,
    public: groups.filter((g) => g.is_public).length,
    private: groups.filter((g) => !g.is_public).length,
    totalMembers: groups.reduce((sum, g) => sum + g.members_count, 0),
    totalMessages: groups.reduce((sum, g) => sum + g.messages_count, 0),
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-8 w-8" />
          Модерація груп
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Керування та модерація громадських груп та чатів
        </p>
      </div>

      {/* Статистичні картки */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всього груп</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Публічні</p>
              <p className="text-2xl font-bold text-blue-600">{stats.public}</p>
            </div>
            <Globe className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Приватні</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.private}
              </p>
            </div>
            <Lock className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Учасників</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.totalMembers}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Повідомлень</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.totalMessages}
              </p>
            </div>
            <MessageSquare className="h-8 w-8 text-orange-600" />
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
                placeholder="Пошук груп за назвою, описом..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Всі типи</option>
              <option value="neighborhood">Сусідство</option>
              <option value="education">Освіта</option>
              <option value="sport">Спорт</option>
              <option value="hobby">Хобі</option>
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Всі статуси</option>
              <option value="active">Активні</option>
              <option value="under_review">На розгляді</option>
              <option value="blocked">Заблоковані</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Фільтри
            </Button>
          </div>
        </div>
      </div>

      {/* Список груп */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Suspense
          fallback={<div className="p-8 text-center">Завантаження...</div>}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Група
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Видимість
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Адміністратор
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Учасники
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Повідомлення
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groups.map((group) => (
                <tr key={group.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {group.name}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {group.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {group.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      {group.is_public ? (
                        <>
                          <Globe className="h-4 w-4 mr-1 text-blue-500" />
                          Публічна
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-1 text-gray-500" />
                          Приватна
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {group.admin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      {group.members_count}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1 text-gray-400" />
                      {group.messages_count}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        group.status === "active"
                          ? "bg-green-100 text-green-800"
                          : group.status === "under_review"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {group.status === "active"
                        ? "Активна"
                        : group.status === "under_review"
                          ? "На розгляді"
                          : "Заблокована"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/groups/${group.id}`}
                      className="text-primary hover:text-primary/80 mr-4"
                    >
                      Переглянути
                    </Link>
                    <Link
                      href={`/dashboard/groups/${group.id}/edit`}
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
              <span className="font-medium">{groups.length}</span> з{" "}
              <span className="font-medium">{stats.total}</span> груп
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
