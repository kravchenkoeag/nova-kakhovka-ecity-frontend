// apps/web/app/(main)/announcements/page.tsx

"use client";

import { useAnnouncements } from "@/hooks/useAnnouncements"; // ✅ Використовуємо виправлений хук
import { Button } from "@ecity/ui";
import { Megaphone, Plus, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

/**
 * Сторінка оголошень - показує список всіх оголошень з можливістю фільтрації
 */
export default function AnnouncementsPage() {
  // Отримуємо оголошення через виправлений хук
  const { data: announcementsData, isLoading } = useAnnouncements();

  // Показуємо loader під час завантаження
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
      {/* Заголовок з кнопкою створення */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Оголошення</h1>
          <p className="mt-2 text-sm text-gray-600">
            Офіційні оголошення від міської влади та організацій
          </p>
        </div>
        <Link href="/announcements/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Додати оголошення
          </Button>
        </Link>
      </div>

      {/* Фільтри за категоріями */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm">
          Всі категорії
        </Button>
        <Button variant="outline" size="sm">
          Офіційні
        </Button>
        <Button variant="outline" size="sm">
          Новини
        </Button>
        <Button variant="outline" size="sm">
          Попередження
        </Button>
        <Button variant="outline" size="sm">
          Інше
        </Button>
      </div>

      {/* Список оголошень */}
      {announcements.length === 0 ? (
        <div className="text-center py-12">
          <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Немає оголошень
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Почніть з створення нового оголошення
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement: any) => (
            <Link
              key={announcement.id}
              href={`/announcements/${announcement.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all border p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Категорія */}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                    {announcement.category}
                  </span>

                  {/* Заголовок */}
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-primary">
                    {announcement.title}
                  </h3>

                  {/* Опис */}
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {announcement.content}
                  </p>

                  {/* Метаінформація */}
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {format(
                        new Date(announcement.created_at),
                        "dd MMMM yyyy, HH:mm",
                        {
                          locale: uk,
                        }
                      )}
                    </span>
                  </div>
                </div>

                {/* Іконка для важливих оголошень */}
                {announcement.is_important && (
                  <div className="ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Важливо
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
