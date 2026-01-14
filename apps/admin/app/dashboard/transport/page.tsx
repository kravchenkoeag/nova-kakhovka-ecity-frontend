// apps/admin/app/dashboard/transport/page.tsx

import { Suspense } from "react";
import { requirePermission } from "@ecity/auth";
import { Permission } from "@ecity/types";
import {
  Bus,
  Search,
  Route,
  MapPin,
  Clock,
  TrendingUp,
  Eye,
  Plus,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@ecity/ui";

/**
 * Сторінка управління транспортом
 * Доступна тільки для модераторів та адміністраторів
 */
export default async function TransportManagementPage() {
  // 🔒 КРИТИЧНО: Перевірка дозволу на управління транспортом
  await requirePermission(Permission.MANAGE_TRANSPORT);

  // TODO: Отримати дані з API
  const routes = [
    {
      id: "1",
      number: "12",
      type: "bus",
      name: "Вокзал - Центр",
      status: "active",
      vehicles_count: 8,
      stops_count: 24,
      last_update: "2024-03-15T14:30:00Z",
    },
    {
      id: "2",
      number: "5",
      type: "trolleybus",
      name: "Мікрорайон - Площа",
      status: "active",
      vehicles_count: 6,
      stops_count: 18,
      last_update: "2024-03-15T14:25:00Z",
    },
    {
      id: "3",
      number: "3",
      type: "tram",
      name: "Північ - Південь",
      status: "maintenance",
      vehicles_count: 4,
      stops_count: 15,
      last_update: "2024-03-15T12:00:00Z",
    },
  ];

  // Підрахунок статистики
  const stats = {
    totalRoutes: routes.length,
    activeRoutes: routes.filter((r) => r.status === "active").length,
    totalVehicles: routes.reduce((sum, r) => sum + r.vehicles_count, 0),
    totalStops: routes.reduce((sum, r) => sum + r.stops_count, 0),
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      bus: "Автобус",
      trolleybus: "Тролейбус",
      tram: "Трамвай",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      bus: "bg-blue-100 text-blue-800",
      trolleybus: "bg-green-100 text-green-800",
      tram: "bg-purple-100 text-purple-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Активний";
      case "maintenance":
        return "На обслуговуванні";
      case "inactive":
        return "Неактивний";
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
            <Bus className="h-8 w-8" />
            Управління транспортом
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Керування маршрутами та транспортними засобами
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/transport/routes/create">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Додати маршрут
            </Button>
          </Link>
          <Link href="/dashboard/transport/live">
            <Button className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Live відстеження
            </Button>
          </Link>
        </div>
      </div>

      {/* Статистичні картки */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всього маршрутів</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalRoutes}
              </p>
            </div>
            <Route className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Активні маршрути</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.activeRoutes}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Транспортних засобів
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalVehicles}
              </p>
            </div>
            <Bus className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Зупинок</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalStops}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Швидкі дії */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/transport/routes">
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Route className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Всі маршрути
                </h3>
                <p className="text-sm text-gray-600">
                  Перегляд та редагування маршрутів
                </p>
              </div>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/transport/vehicles">
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Bus className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Транспортні засоби
                </h3>
                <p className="text-sm text-gray-600">
                  Управління транспортними засобами
                </p>
              </div>
            </div>
          </div>
        </Link>
        <Link href="/dashboard/transport/live">
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Live відстеження
                </h3>
                <p className="text-sm text-gray-600">
                  Моніторинг транспорту в реальному часі
                </p>
              </div>
            </div>
          </div>
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
                placeholder="Пошук маршрутів за номером або назвою..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Всі типи</option>
              <option value="bus">Автобус</option>
              <option value="trolleybus">Тролейбус</option>
              <option value="tram">Трамвай</option>
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Всі статуси</option>
              <option value="active">Активні</option>
              <option value="maintenance">На обслуговуванні</option>
              <option value="inactive">Неактивні</option>
            </select>
          </div>
        </div>
      </div>

      {/* Список маршрутів */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Suspense
          fallback={<div className="p-8 text-center">Завантаження...</div>}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Маршрут
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Транспортних засобів
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Зупинок
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Оновлено
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routes.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <Bus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">Маршрути не знайдено</p>
                    <p className="text-sm mt-2">
                      Створіть перший маршрут для початку роботи
                    </p>
                  </td>
                </tr>
              ) : (
                routes.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          №{route.number}
                        </div>
                        <div className="text-sm text-gray-500">{route.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
                          route.type
                        )}`}
                      >
                        {getTypeLabel(route.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                          route.status
                        )}`}
                      >
                        {getStatusText(route.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {route.vehicles_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {route.stops_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(route.last_update).toLocaleTimeString("uk-UA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/dashboard/transport/routes/${route.id}`}
                        className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Деталі
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Suspense>
      </div>
    </div>
  );
}

