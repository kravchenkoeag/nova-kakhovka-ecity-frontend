// apps/admin/app/(dashboard)/events/page.tsx

import { Suspense } from "react";
import { requirePermission } from "@ecity/auth";
import { Permission } from "@ecity/types";
import { Calendar, Search, Filter, Plus, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@ecity/ui";

/**
 * Сторінка модерації подій
 * Доступна тільки для модераторів та адміністраторів
 */
export default async function EventsManagementPage() {
  // 🔒 КРИТИЧНО: Перевірка дозволу на модерацію подій
  await requirePermission(Permission.MODERATE_EVENT);

  // TODO: Отримати події з API
  const events = [
    {
      id: "1",
      title: "День міста 2024",
      category: "Культура",
      date: "2024-06-15T10:00:00Z",
      location: "Центральна площа",
      organizer: "Міська рада",
      status: "approved",
      participants: 245,
      created_at: "2024-03-10T12:00:00Z",
    },
    {
      id: "2",
      title: "Спортивний забіг",
      category: "Спорт",
      date: "2024-04-20T08:00:00Z",
      location: "Міський парк",
      organizer: "Спортивний клуб",
      status: "pending",
      participants: 67,
      created_at: "2024-03-15T14:30:00Z",
    },
    {
      id: "3",
      title: "Концерт класичної музики",
      category: "Культура",
      date: "2024-05-10T19:00:00Z",
      location: "Філармонія",
      organizer: "Культурний центр",
      status: "approved",
      participants: 123,
      created_at: "2024-03-12T16:45:00Z",
    },
  ];

  // Підрахунок статистики
  const stats = {
    total: events.length,
    upcoming: events.filter((e) => new Date(e.date) > new Date()).length,
    pending: events.filter((e) => e.status === "pending").length,
    totalParticipants: events.reduce((sum, e) => sum + e.participants, 0),
  };

  return (
    <div className="space-y-6">
      {/* Заголовок та дії */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Модерація подій
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Керування та модерація міських подій та заходів
          </p>
        </div>
        <Link href="/dashboard/events/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Створити подію
          </Button>
        </Link>
      </div>

      {/* Статистичні картки */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всього подій</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Майбутні</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.upcoming}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">На розгляді</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.pending}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Учасників</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.totalParticipants}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
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
                placeholder="Пошук подій за назвою, організатором..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Всі категорії</option>
              <option value="culture">Культура</option>
              <option value="sport">Спорт</option>
              <option value="education">Освіта</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Фільтри
            </Button>
          </div>
        </div>
      </div>

      {/* Список подій */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Suspense
          fallback={<div className="p-8 text-center">Завантаження...</div>}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Подія
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категорія
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата проведення
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Місце
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Організатор
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Учасники
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
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {event.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {event.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(event.date).toLocaleDateString("uk-UA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.organizer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      {event.participants}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.status === "pending"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {event.status === "pending" ? "На розгляді" : "Схвалено"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/events/${event.id}`}
                      className="text-primary hover:text-primary/80 mr-4"
                    >
                      Переглянути
                    </Link>
                    <Link
                      href={`/dashboard/events/${event.id}/edit`}
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
              <span className="font-medium">{events.length}</span> з{" "}
              <span className="font-medium">{stats.total}</span> подій
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
