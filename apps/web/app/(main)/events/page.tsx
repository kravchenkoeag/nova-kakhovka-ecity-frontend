// apps/web/app/(main)/events/page.tsx

"use client";

import { useEvents } from "@/hooks/useEvents"; // ✅ Використовуємо виправлений хук
import { Button } from "@ecity/ui";
import { Calendar, MapPin, Users, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

/**
 * Сторінка подій - показує список всіх культурних та соціальних заходів
 */
export default function EventsPage() {
  // Отримуємо події через виправлений хук
  const { data: eventsData, isLoading } = useEvents();

  // Показуємо loader під час завантаження
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const events = eventsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок з кнопкою створення */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Події</h1>
          <p className="mt-2 text-sm text-gray-600">
            Культурні та соціальні заходи в місті
          </p>
        </div>
        <Link href="/events/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Створити подію
          </Button>
        </Link>
      </div>

      {/* Фільтри за категоріями */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm">
          Всі категорії
        </Button>
        <Button variant="outline" size="sm">
          Культурні
        </Button>
        <Button variant="outline" size="sm">
          Освітні
        </Button>
        <Button variant="outline" size="sm">
          Спортивні
        </Button>
        <Button variant="outline" size="sm">
          Соціальні
        </Button>
      </div>

      {/* Список подій у вигляді сітки */}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Немає подій
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Почніть з створення нової події
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {events.map((event: any) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all border overflow-hidden"
            >
              {/* Зображення події */}
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
                    {/* Категорія */}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-2">
                      {event.category}
                    </span>

                    {/* Заголовок */}
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">
                      {event.title}
                    </h3>

                    {/* Опис */}
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* Метаінформація */}
                <div className="mt-4 space-y-2">
                  {/* Дата та час */}
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {format(
                        new Date(event.start_date),
                        "dd MMMM yyyy, HH:mm",
                        {
                          locale: uk,
                        }
                      )}
                    </span>
                  </div>

                  {/* Локація */}
                  {event.location && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  {/* Учасники */}
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
