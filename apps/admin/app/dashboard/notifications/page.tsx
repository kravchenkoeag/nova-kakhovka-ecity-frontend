// apps/admin/app/dashboard/notifications/page.tsx

import { Suspense } from "react";
import { requirePermission } from "@ecity/auth";
import { Permission } from "@ecity/types";
import {
  Bell,
  Search,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Users,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@ecity/ui";

/**
 * Сторінка управління сповіщеннями
 * Доступна тільки для модераторів та адміністраторів
 */
export default async function NotificationsManagementPage() {
  // 🔒 КРИТИЧНО: Перевірка дозволу на відправку сповіщень
  await requirePermission(Permission.SEND_NOTIFICATIONS);

  // TODO: Отримати сповіщення з API
  const notifications = [
    {
      id: "1",
      title: "Оновлення розкладу автобусів",
      message: "З 20 березня змінюється розклад маршруту №12",
      type: "system",
      target: "all_users",
      status: "sent",
      sent_count: 1234,
      created_at: "2024-03-15T10:30:00Z",
      sent_at: "2024-03-15T10:35:00Z",
    },
    {
      id: "2",
      title: "Завершення опитування",
      message: "Опитування 'Що вважаєте найбільш важливим для міста?' завершено",
      type: "poll",
      target: "poll_participants",
      status: "scheduled",
      sent_count: 0,
      created_at: "2024-03-14T14:20:00Z",
      scheduled_for: "2024-03-20T10:00:00Z",
    },
    {
      id: "3",
      title: "Нове оголошення в категорії Нерухомість",
      message: "Перевірте нове оголошення про оренду квартири",
      type: "announcement",
      target: "subscribed_users",
      status: "sent",
      sent_count: 567,
      created_at: "2024-03-13T09:15:00Z",
      sent_at: "2024-03-13T09:20:00Z",
    },
  ];

  // Підрахунок статистики
  const stats = {
    total: notifications.length,
    sent: notifications.filter((n) => n.status === "sent").length,
    scheduled: notifications.filter((n) => n.status === "scheduled").length,
    totalSent: notifications.reduce((sum, n) => sum + n.sent_count, 0),
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      system: "Системне",
      poll: "Опитування",
      announcement: "Оголошення",
      event: "Подія",
      petition: "Петиція",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      system: "bg-blue-100 text-blue-800",
      poll: "bg-purple-100 text-purple-800",
      announcement: "bg-green-100 text-green-800",
      event: "bg-orange-100 text-orange-800",
      petition: "bg-red-100 text-red-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getTargetLabel = (target: string) => {
    const labels: Record<string, string> = {
      all_users: "Всі користувачі",
      poll_participants: "Учасники опитування",
      subscribed_users: "Підписники",
      moderators: "Модератори",
      admins: "Адміністратори",
    };
    return labels[target] || target;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "sent":
        return "Відправлено";
      case "scheduled":
        return "Заплановано";
      case "failed":
        return "Помилка";
      case "draft":
        return "Чернетка";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Управління сповіщеннями
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Відправка та управління сповіщеннями для користувачів
          </p>
        </div>
        <Link href="/dashboard/notifications/send">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Створити сповіщення
          </Button>
        </Link>
      </div>

      {/* Статистичні картки */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всього</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Bell className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Відправлено</p>
              <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Заплановано</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.scheduled}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Всього отримали
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalSent}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
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
                placeholder="Пошук сповіщень за назвою або повідомленням..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Всі типи</option>
              <option value="system">Системні</option>
              <option value="poll">Опитування</option>
              <option value="announcement">Оголошення</option>
              <option value="event">Події</option>
              <option value="petition">Петиції</option>
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Всі статуси</option>
              <option value="sent">Відправлені</option>
              <option value="scheduled">Заплановані</option>
              <option value="failed">Помилки</option>
              <option value="draft">Чернетки</option>
            </select>
          </div>
        </div>
      </div>

      {/* Список сповіщень */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Suspense
          fallback={<div className="p-8 text-center">Завантаження...</div>}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сповіщення
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цільова аудиторія
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Відправлено
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата створення
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">Сповіщення не знайдено</p>
                    <p className="text-sm mt-2">
                      Створіть перше сповіщення для початку роботи
                    </p>
                  </td>
                </tr>
              ) : (
                notifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {notification.message.substring(0, 60)}
                          {notification.message.length > 60 ? "..." : ""}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
                          notification.type
                        )}`}
                      >
                        {getTypeLabel(notification.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getTargetLabel(notification.target)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                          notification.status
                        )}`}
                      >
                        {getStatusText(notification.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {notification.sent_count > 0 ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {notification.sent_count}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(notification.created_at).toLocaleDateString(
                        "uk-UA",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/dashboard/notifications/${notification.id}`}
                        className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Переглянути
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Suspense>
      </div>

      {/* Пагінація */}
      {notifications.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button variant="outline">Попередня</Button>
            <Button variant="outline">Наступна</Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Показано <span className="font-medium">1</span> до{" "}
                <span className="font-medium">{notifications.length}</span> з{" "}
                <span className="font-medium">{stats.total}</span> сповіщень
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

