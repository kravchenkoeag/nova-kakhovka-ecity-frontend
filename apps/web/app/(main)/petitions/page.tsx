// apps/web/app/(main)/petitions/page.tsx

"use client";

import { usePetitions } from "@/hooks/usePetitions";
import { Button } from "@ecity/ui";
import { FileText, Plus, Target, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

/**
 * Сторінка петицій - показує список всіх петицій з можливістю фільтрації
 */
export default function PetitionsPage() {
  // Отримуємо петиції через хук
  const { data: petitionsData, isLoading } = usePetitions();

  // Показуємо loader під час завантаження
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Backend returns { petitions: [], pagination: {} } or { data: [] }
  const petitions = petitionsData?.petitions || petitionsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок з кнопкою створення */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Петиції</h1>
          <p className="mt-2 text-sm text-gray-600">
            Впливайте на рішення міської влади через петиції
          </p>
        </div>
        <Link href="/petitions/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Створити петицію
          </Button>
        </Link>
      </div>

      {/* Фільтри за категоріями */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm">
          Всі категорії
        </Button>
        <Button variant="outline" size="sm">
          Інфраструктура
        </Button>
        <Button variant="outline" size="sm">
          Соціальні
        </Button>
        <Button variant="outline" size="sm">
          Екологія
        </Button>
        <Button variant="outline" size="sm">
          Транспорт
        </Button>
      </div>

      {/* Список петицій */}
      {petitions.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Немає петицій
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Почніть з створення нової петиції
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {petitions.map((petition: any) => (
            <Link
              key={petition.id}
              href={`/petitions/${petition.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all border p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Категорія */}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-2">
                    {petition.category}
                  </span>

                  {/* Заголовок */}
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-primary">
                    {petition.title}
                  </h3>

                  {/* Опис */}
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {petition.description}
                  </p>

                  {/* Прогрес підписів */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>
                          {petition.signature_count || 0} /{" "}
                          {petition.required_signatures || 1000} підписів
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Target className="h-4 w-4 mr-2" />
                        <span>
                          {petition.status === "active"
                            ? "Активна"
                            : petition.status === "completed"
                              ? "Завершена"
                              : petition.status}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            ((petition.signature_count || 0) /
                              (petition.required_signatures || 1000)) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Метаінформація */}
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {format(new Date(petition.created_at), "dd MMMM yyyy", {
                        locale: uk,
                      })}
                    </span>
                    {petition.end_date && (
                      <>
                        <span className="mx-2">-</span>
                        <span>
                          До{" "}
                          {format(new Date(petition.end_date), "dd MMMM yyyy", {
                            locale: uk,
                          })}
                        </span>
                      </>
                    )}
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
