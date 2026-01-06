// apps/web/app/(main)/city-issues/page.tsx

"use client";

import { useCityIssues } from "@/hooks/useCityIssues";
import { Button } from "@ecity/ui";
import { MapPin, Plus, AlertCircle, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

/**
 * Сторінка проблем міста - показує список всіх повідомлень про проблеми
 */
export default function CityIssuesPage() {
  // Отримуємо проблеми через хук
  const { data: issuesData, isLoading } = useCityIssues();

  // Показуємо loader під час завантаження
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Backend returns { issues: [], pagination: {} } or { data: [] }
  const issues = issuesData?.data || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      reported: "Повідомлено",
      in_progress: "В роботі",
      resolved: "Вирішено",
      rejected: "Відхилено",
      duplicate: "Дублікат",
    };
    return labels[status] || status;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок з кнопкою створення */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Проблеми міста</h1>
          <p className="mt-2 text-sm text-gray-600">
            Повідомляйте про проблеми інфраструктури та допомагайте робити місто
            кращим
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/city-issues/map">
            <Button variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Карта
            </Button>
          </Link>
          <Link href="/city-issues/report">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Повідомити про проблему
            </Button>
          </Link>
        </div>
      </div>

      {/* Фільтри за категоріями */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm">
          Всі категорії
        </Button>
        <Button variant="outline" size="sm">
          Дороги
        </Button>
        <Button variant="outline" size="sm">
          Освітлення
        </Button>
        <Button variant="outline" size="sm">
          Вода
        </Button>
        <Button variant="outline" size="sm">
          Електрика
        </Button>
        <Button variant="outline" size="sm">
          Сміття
        </Button>
      </div>

      {/* Список проблем */}
      {issues.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Немає проблем
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Почніть з повідомлення про проблему
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue: any) => (
            <Link
              key={issue.id}
              href={`/city-issues/${issue.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all border p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Категорія та статус */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {issue.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      {getStatusIcon(issue.status)}
                      <span>{getStatusLabel(issue.status)}</span>
                    </div>
                    {issue.priority && (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          issue.priority === "critical"
                            ? "bg-red-100 text-red-800"
                            : issue.priority === "high"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {issue.priority}
                      </span>
                    )}
                  </div>

                  {/* Заголовок */}
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-primary">
                    {issue.title}
                  </h3>

                  {/* Опис */}
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {issue.description}
                  </p>

                  {/* Метаінформація */}
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    {issue.address && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{issue.address}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>{issue.upvote_count || 0} підтримок</span>
                    </div>
                    <div className="flex items-center">
                      <span>
                        {format(new Date(issue.created_at), "dd MMMM yyyy", {
                          locale: uk,
                        })}
                      </span>
                    </div>
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
