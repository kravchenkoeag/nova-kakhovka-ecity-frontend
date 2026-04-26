// apps/web/app/(main)/events/page.tsx
// Server Component — дані завантажуються на сервері

import { getServerSession } from "next-auth";
import { authOptions } from "@ecity/auth";
import { Button } from "@ecity/ui";
import { Calendar, MapPin, Users, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

async function getEvents() {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
  try {
    const res = await fetch(`${backendUrl}/api/v1/events`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const [events, session] = await Promise.all([
    getEvents(),
    getServerSession(authOptions),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Події</h1>
          <p className="mt-2 text-sm text-gray-600">
            Культурні та соціальні заходи в місті
          </p>
        </div>
        {session && (
          <Link href="/events/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Створити подію
            </Button>
          </Link>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm">Всі категорії</Button>
        <Button variant="outline" size="sm">Культурні</Button>
        <Button variant="outline" size="sm">Освітні</Button>
        <Button variant="outline" size="sm">Спортивні</Button>
        <Button variant="outline" size="sm">Соціальні</Button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Немає подій</h3>
          <p className="mt-1 text-sm text-gray-500">Почніть з створення нової події</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {events.map((event: any) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all border overflow-hidden"
            >
              {event.cover_image && (
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={event.cover_image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-2">
                      {event.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {format(new Date(event.start_date), "dd MMMM yyyy, HH:mm", { locale: uk })}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{event.participants_count || 0} учасників</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
