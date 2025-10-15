// apps/web/app/(main)/events/page.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button } from '@ecity/ui';
import { Calendar, MapPin, Users, Plus } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

// Сторінка подій

export default function EventsPage() {
  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => apiClient.events.getAll({ page: 1, limit: 20 }),
  });

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
      {/* Заголовок */}
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

      {/* Фільтри */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm">Всі категорії</Button>
        <Button variant="outline" size="sm">Культурні</Button>
        <Button variant="outline" size="sm">Освітні</Button>
        <Button variant="outline" size="sm">Спортивні</Button>
        <Button variant="outline" size="sm">Соціальні</Button>
      </div>

      {/* Список подій */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {events.map((event: any) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all border overflow-hidden"
          >
            {/* Зображення */}
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
                    {format(new Date(event.start_date), 'dd MMMM yyyy, HH:mm', {
                      locale: uk,
                    })}
                  </span>
                </div>
                {event.address && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="truncate">{event.address}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  <span>
                    {event.participants?.length || 0} учасників
                    {event.max_participants && ` / ${event.max_participants}`}
                  </span>
                </div>
              </div>

              {!event.is_free && event.price && (
                <div className="mt-4 pt-4 border-t">
                  <span className="text-lg font-semibold text-primary">
                    {event.price} {event.currency || 'грн'}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Подій не знайдено
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Станьте першим, хто створить подію
          </p>
          <div className="mt-6">
            <Link href="/events/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Створити подію
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
