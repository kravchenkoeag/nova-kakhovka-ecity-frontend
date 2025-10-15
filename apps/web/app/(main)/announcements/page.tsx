// apps/web/app/(main)/announcements/page.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button } from '@ecity/ui';
import { Megaphone, MapPin, Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { uk } from 'date-fns/locale';

// Сторінка оголошень

export default function AnnouncementsPage() {
  const { data: announcementsData, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => apiClient.announcements.getAll({ page: 1, limit: 20 }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const announcements = announcementsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Оголошення</h1>
          <p className="mt-2 text-sm text-gray-600">
            Знайдіть потрібні послуги або розмістіть своє оголошення
          </p>
        </div>
        <Link href="/announcements/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Створити оголошення
          </Button>
        </Link>
      </div>

      {/* Фільтри */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm">Всі категорії</Button>
        <Button variant="outline" size="sm">Робота</Button>
        <Button variant="outline" size="sm">Послуги</Button>
        <Button variant="outline" size="sm">Житло</Button>
        <Button variant="outline" size="sm">Транспорт</Button>
        <Button variant="outline" size="sm">Допомога</Button>
      </div>

      {/* Список оголошень */}
      <div className="grid grid-cols-1 gap-4">
        {announcements.map((announcement: any) => (
          <Link
            key={announcement.id}
            href={`/announcements/${announcement.id}`}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all border p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {announcement.category}
                  </span>
                  {announcement.employment && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {announcement.employment}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">
                  {announcement.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {announcement.description}
                </p>

                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                  {announcement.address && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{announcement.address}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{announcement.views} переглядів</span>
                  </div>
                  <span>
                    {formatDistanceToNow(new Date(announcement.created_at), {
                      addSuffix: true,
                      locale: uk,
                    })}
                  </span>
                </div>
              </div>

              {announcement.media_files?.[0] && (
                <div className="ml-6 flex-shrink-0">
                  <img
                    src={announcement.media_files[0]}
                    alt={announcement.title}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {announcements.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Оголошень не знайдено
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Станьте першим, хто створить оголошення
          </p>
          <div className="mt-6">
            <Link href="/announcements/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Створити оголошення
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}