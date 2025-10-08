// apps/web/app/(main)/events/page.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import { createApiClient } from '@ecity/api-client';
import { Card, Button, Badge } from '@ecity/ui';
import { Calendar, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_URL!);

export default function EventsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => apiClient.events.getAll(),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-40 bg-gray-200 rounded mb-4" />
              <div className="h-6 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Події</h1>
          <p className="text-gray-600 mt-1">
            Знайдіть цікаві події у вашому місті
          </p>
        </div>
        <Link href="/events/create">
          <Button>Створити подію</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.events?.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
              {event.cover_image && (
                <div className="h-48 bg-gray-200">
                  <img
                    src={event.cover_image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge>{event.category}</Badge>
                  {event.is_free && (
                    <Badge variant="success">Безкоштовно</Badge>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {event.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(event.start_date), 'd MMMM, HH:mm', { locale: uk })}
                    </span>
                  </div>
                  
                  {event.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{event.address}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {event.participants.length}
                      {event.max_participants > 0 && ` / ${event.max_participants}`} учасників
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}