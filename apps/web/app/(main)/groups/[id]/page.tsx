// apps/web/app/(main)/groups/[id]/page.tsx

import { requireAuth } from "@ecity/auth";
import { Button } from "@ecity/ui";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Settings,
  UserPlus,
  LogOut,
  Globe,
  Lock,
} from "lucide-react";

/**
 * Сторінка деталей групи
 * Доступна тільки для авторизованих користувачів
 */
export default async function GroupPage({
  params,
}: {
  params: { id: string };
}) {
  // 🔒 КРИТИЧНО: Перевірка авторизації
  const session = await requireAuth();

  // TODO: Отримати інформацію про групу з API
  const group = {
    id: params.id,
    name: "Батьки школярів",
    description:
      "Група для обговорення шкільних питань, організації заходів та спілкування батьків учнів місцевих шкіл.",
    type: "education",
    is_public: true,
    members_count: 234,
    messages_count: 1456,
    avatar_url: null,
    created_at: "2024-01-15T10:00:00Z",
    location_filter: "Нова Каховка",
    interest_filter: ["Освіта", "Діти", "Батьки"],
    members: ["user1", "user2", "user3"], // IDs
    admins: ["user1"], // IDs
    is_member: false, // Чи користувач є членом групи
    is_admin: false, // Чи користувач є адміном
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок групи */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
        {/* Обкладинка */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
          {group.avatar_url ? (
            <img
              src={group.avatar_url}
              alt={group.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Users className="h-24 w-24 text-white" />
          )}
        </div>

        {/* Інформація групи */}
        <div className="px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {group.name}
                </h1>
                <div>
                  {group.is_public ? (
                    <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <Globe className="h-4 w-4 mr-1" />
                      Публічна
                    </div>
                  ) : (
                    <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      <Lock className="h-4 w-4 mr-1" />
                      Приватна
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  {group.members_count} учасників
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  {group.messages_count} повідомлень
                </div>
              </div>
            </div>

            {/* Дії */}
            <div className="flex items-center gap-2 ml-4">
              {group.is_member ? (
                <>
                  <Link href={`/groups/${group.id}/chat`}>
                    <Button className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Відкрити чат
                    </Button>
                  </Link>
                  {group.is_admin && (
                    <Link href={`/groups/${group.id}/settings`}>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        Налаштування
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Покинути
                  </Button>
                </>
              ) : (
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Приєднатися
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Контент групи */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основна інформація */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Про групу</h2>
            <div className="prose max-w-none">
              <p className="text-gray-600">
                {group.description || "Опис групи відсутній"}
              </p>
            </div>

            {/* Додаткова інформація */}
            <div className="mt-6 space-y-3">
              {group.location_filter && (
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Локація:
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    {group.location_filter}
                  </span>
                </div>
              )}
              {group.interest_filter && group.interest_filter.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Інтереси:
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.interest_filter.map((interest: string) => (
                      <span
                        key={interest}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Створена:
                </span>
                <span className="ml-2 text-sm text-gray-600">
                  {new Date(group.created_at).toLocaleDateString("uk-UA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Недавня активність */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Недавня активність</h2>
            <div className="space-y-4">
              {/* TODO: Список недавніх повідомлень з API */}
              <p className="text-sm text-gray-500">
                Немає недавньої активності
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar - Учасники */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">
              Учасники ({group.members_count})
            </h2>
            <div className="space-y-3">
              {group.members && group.members.length > 0 ? (
                group.members.slice(0, 10).map((memberId: string) => (
                  <div key={memberId} className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Користувач {memberId.slice(0, 8)}
                      </p>
                      {/* TODO: Отримати інфо про користувача */}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Немає учасників</p>
              )}
              {group.members && group.members.length > 10 && (
                <button className="text-sm text-primary hover:text-primary/80 font-medium">
                  Показати всіх ({group.members.length})
                </button>
              )}
            </div>
          </div>

          {/* Адміністратори */}
          {group.admins && group.admins.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Адміністратори</h2>
              <div className="space-y-3">
                {group.admins.map((adminId: string) => (
                  <div key={adminId} className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Адмін {adminId.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Налаштування групи */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Налаштування</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Тип групи</span>
                <span className="font-medium">{group.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Публічність</span>
                <span className="font-medium">
                  {group.is_public ? "Публічна" : "Приватна"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Учасників</span>
                <span className="font-medium">{group.members_count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
