// apps/admin/app/dashboard/petitions/page.tsx

"use client";

import { useState } from "react";
import { usePetitions } from "@/hooks/usePetitions";
import {
  usePublishPetition,
  useUpdatePetitionStatus,
} from "@/hooks/usePetitions";
import { Button } from "@ecity/ui";
import {
  FileText,
  Search,
  Filter,
  TrendingUp,
  CheckCircle,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import type { Petition } from "@ecity/types";

/**
 * Сторінка модерації петицій
 * Доступна тільки для модераторів та адміністраторів
 *
 * Функціонал:
 * - Перегляд всіх петицій (включно з draft)
 * - Публікація draft петицій
 * - Зміна статусів петицій
 * - Додавання офіційних відповідей
 * - Фільтрація та пошук
 */
export default function PetitionsManagementPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Отримуємо всі петиції (включно з draft для модераторів)
  const {
    data: petitionsData,
    isLoading,
    refetch,
  } = usePetitions({
    status: filterStatus === "all" ? undefined : filterStatus,
  });

  const publishPetition = usePublishPetition();
  const updateStatus = useUpdatePetitionStatus();

  // Backend повертає { data: [], pagination: {} }
  const petitions: Petition[] = petitionsData?.data || [];
  const pagination = petitionsData?.pagination;

  /**
   * Публікує draft петицію (draft → active)
   */
  const handlePublish = async (petitionId: string) => {
    if (!confirm("Ви впевнені, що хочете опублікувати цю петицію?")) {
      return;
    }

    try {
      await publishPetition.mutateAsync(petitionId);
      alert("Петицію успішно опубліковано!");
      refetch();
    } catch (error: any) {
      alert(`Помилка: ${error?.response?.data?.error || error.message}`);
    }
  };

  /**
   * Змінює статус петиції
   */
  const handleStatusChange = async (petitionId: string, newStatus: string) => {
    if (!confirm(`Змінити статус петиції на "${newStatus}"?`)) {
      return;
    }

    try {
      await updateStatus.mutateAsync({ petitionId, status: newStatus });
      alert("Статус успішно змінено!");
      refetch();
    } catch (error: any) {
      alert(`Помилка: ${error?.response?.data?.error || error.message}`);
    }
  };

  /**
   * Фільтрує петиції за пошуковим запитом
   */
  const filteredPetitions = petitions.filter((petition) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      petition.title.toLowerCase().includes(query) ||
      petition.description.toLowerCase().includes(query) ||
      petition.category.toLowerCase().includes(query)
    );
  });

  // Підрахунок статистики
  const stats = {
    total: petitions.length,
    draft: petitions.filter((p) => p.status === "draft").length,
    active: petitions.filter((p) => p.status === "active").length,
    completed: petitions.filter((p) => p.status === "completed").length,
    totalSignatures: petitions.reduce((sum, p) => sum + p.signature_count, 0),
  };

  /**
   * Отримує колір badge для статусу
   */
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  /**
   * Отримує текст статусу українською
   */
  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return "Чернетка";
      case "active":
        return "Активна";
      case "completed":
        return "Завершена";
      case "expired":
        return "Прострочена";
      case "under_review":
        return "На розгляді";
      case "accepted":
        return "Прийнята";
      case "rejected":
        return "Відхилена";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Модерація петицій
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Керування електронними петиціями та ініціативами громадян
        </p>
      </div>

      {/* Статистичні картки */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Всього петицій
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Чернетки</p>
              <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-gray-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Активні</p>
              <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Всього підписів
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.totalSignatures}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Фільтри та пошук */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Пошук */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Пошук петицій..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Фільтр за статусом */}
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Всі статуси</option>
              <option value="draft">Чернетки</option>
              <option value="active">Активні</option>
              <option value="completed">Завершені</option>
              <option value="expired">Прострочені</option>
              <option value="under_review">На розгляді</option>
              <option value="accepted">Прийняті</option>
              <option value="rejected">Відхилені</option>
            </select>
          </div>
        </div>
      </div>

      {/* Таблиця петицій */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Петиція
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категорія
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Прогрес
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дедлайн
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPetitions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">Петиції не знайдено</p>
                    <p className="text-sm mt-2">
                      Спробуйте змінити фільтри або пошуковий запит
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPetitions.map((petition) => {
                  const progress = Math.round(
                    (petition.signature_count / petition.required_signatures) *
                      100
                  );

                  return (
                    <tr key={petition.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {petition.title}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {petition.signature_count} /{" "}
                              {petition.required_signatures} підписів
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {petition.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-32">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  progress >= 100
                                    ? "bg-green-600"
                                    : progress >= 75
                                      ? "bg-blue-600"
                                      : progress >= 50
                                        ? "bg-yellow-600"
                                        : "bg-orange-600"
                                }`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {progress}%
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                            petition.status
                          )}`}
                        >
                          {getStatusText(petition.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(petition.end_date), "dd MMM yyyy", {
                          locale: uk,
                        })}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {/* Кнопка перегляду */}
                          <Link
                            href={`/dashboard/petitions/${petition.id}`}
                            className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            Переглянути
                          </Link>

                          {/* Кнопка публікації для draft */}
                          {petition.status === "draft" && (
                            <button
                              onClick={() => handlePublish(petition.id)}
                              disabled={publishPetition.isPending}
                              className="text-green-600 hover:text-green-900 inline-flex items-center gap-1 disabled:opacity-50"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Опублікувати
                            </button>
                          )}

                          {/* Кнопки зміни статусу */}
                          {petition.status === "completed" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusChange(petition.id, "accepted")
                                }
                                disabled={updateStatus.isPending}
                                className="text-green-600 hover:text-green-900 inline-flex items-center gap-1 disabled:opacity-50"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Прийняти
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(petition.id, "rejected")
                                }
                                disabled={updateStatus.isPending}
                                className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 disabled:opacity-50"
                              >
                                <XCircle className="h-4 w-4" />
                                Відхилити
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Пагінація */}
      {pagination && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button variant="outline">Попередня</Button>
            <Button variant="outline">Наступна</Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Показано <span className="font-medium">1</span> до{" "}
                <span className="font-medium">{filteredPetitions.length}</span>{" "}
                з <span className="font-medium">{pagination.total}</span>{" "}
                петицій
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <Button variant="outline" size="sm">
                  Попередня
                </Button>
                <Button variant="outline" size="sm" className="ml-2">
                  Наступна
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
