// apps/web/app/(main)/transport/page.tsx
// Server Component — дані завантажуються на сервері

import { Button } from "@ecity/ui";
import { Bus, MapPin, Route, ArrowRight } from "lucide-react";
import Link from "next/link";

async function getRoutes() {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
  try {
    const res = await fetch(`${backendUrl}/api/v1/transport/routes`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
  } catch {
    return [];
  }
}

function getTypeLabel(type: string) {
  const labels: Record<string, string> = {
    bus: "Автобус",
    trolleybus: "Тролейбус",
    tram: "Трамвай",
  };
  return labels[type] || type;
}

function getTypeColor(type: string) {
  const colors: Record<string, string> = {
    bus: "bg-blue-100 text-blue-800",
    trolleybus: "bg-green-100 text-green-800",
    tram: "bg-purple-100 text-purple-800",
  };
  return colors[type] || "bg-gray-100 text-gray-800";
}

export default async function TransportPage() {
  const routesList = await getRoutes();

  const routesByType = (routesList as any[]).reduce(
    (acc: Record<string, any[]>, route: any) => {
      const type = route.type || "bus";
      if (!acc[type]) acc[type] = [];
      acc[type].push(route);
      return acc;
    },
    {},
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Громадський транспорт</h1>
        <p className="mt-2 text-sm text-gray-600">
          Відстежуйте маршрути та розклад громадського транспорту
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link href="/transport/live">
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Live відстеження</h3>
                <p className="text-sm text-gray-600">Поточне місцезнаходження транспорту</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
            </div>
          </div>
        </Link>
        <Link href="/city-issues/map">
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Карта зупинок</h3>
                <p className="text-sm text-gray-600">Знайдіть найближчі зупинки</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 ml-auto" />
            </div>
          </div>
        </Link>
      </div>

      {Object.keys(routesByType).length === 0 ? (
        <div className="text-center py-12">
          <Bus className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Немає маршрутів</h3>
          <p className="mt-1 text-sm text-gray-500">Маршрути будуть доступні найближчим часом</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(routesByType).map(([type, typeRoutes]) => (
            <div key={type}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {getTypeLabel(type)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(typeRoutes as any[]).map((route: any) => (
                  <Link
                    key={route.id}
                    href={`/transport/routes/${route.id}`}
                    className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all border p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getTypeColor(type)}`}
                          >
                            {route.number || route.route_number}
                          </span>
                          {route.is_active === false && (
                            <span className="text-xs text-gray-500">Неактивний</span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-primary">
                          {route.name ||
                            route.route_name ||
                            `Маршрут ${route.number || route.route_number}`}
                        </h3>
                        {route.description && (
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {route.description}
                          </p>
                        )}
                        {route.stops && (
                          <div className="mt-4 flex items-center text-sm text-gray-500">
                            <Route className="h-4 w-4 mr-2" />
                            <span>{route.stops.length} зупинок</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
