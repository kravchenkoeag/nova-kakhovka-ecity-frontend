// apps/web/app/(main)/profile/page.tsx

import { requireAuth } from "@ecity/auth";
import { Button } from "@ecity/ui";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Settings,
} from "lucide-react";

/**
 * Сторінка профілю користувача
 * Доступна тільки для авторизованих користувачів
 */
export default async function ProfilePage() {
  // 🔒 КРИТИЧНО: Перевірка авторизації
  const session = await requireAuth();

  // TODO: Отримати повну інформацію про користувача з API
  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    phone: "+380 95 123 45 67",
    location: "Нова Каховка",
    bio: "Активний мешканець міста, цікавлюсь громадським життям",
    joined_at: "2024-01-15T10:00:00Z",
    avatar_url: null,
    verified: true,
    stats: {
      groups_joined: 5,
      events_attended: 12,
      announcements_posted: 8,
      petitions_signed: 15,
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Мій профіль</h1>
        <p className="mt-2 text-sm text-gray-600">
          Перегляд та керування вашим обліковим записом
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Основна інформація */}
        <div className="lg:col-span-2 space-y-6">
          {/* Картка профілю */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="px-6 pb-6">
              <div className="flex items-end -mt-16 mb-4">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                <div className="ml-auto flex gap-2">
                  <Link href="/profile/edit">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Редагувати
                    </Button>
                  </Link>
                  <Link href="/profile/settings">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Налаштування
                    </Button>
                  </Link>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h2>
                  {user.verified && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Верифікований
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Роль: <span className="font-medium">{user.role}</span>
                </p>
              </div>

              {user.bio && (
                <div className="mt-4">
                  <p className="text-gray-700">{user.bio}</p>
                </div>
              )}

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-5 w-5 mr-2 text-gray-400" />
                  {user.email}
                </div>
                {user.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-5 w-5 mr-2 text-gray-400" />
                    {user.phone}
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                    {user.location}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-5 w-5 mr-2 text-gray-400" />З нами з{" "}
                  {new Date(user.joined_at).toLocaleDateString("uk-UA", {
                    year: "numeric",
                    month: "long",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Активність */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Моя активність</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">
                  {user.stats.groups_joined}
                </p>
                <p className="text-sm text-gray-600 mt-1">Груп</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">
                  {user.stats.events_attended}
                </p>
                <p className="text-sm text-gray-600 mt-1">Подій</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">
                  {user.stats.announcements_posted}
                </p>
                <p className="text-sm text-gray-600 mt-1">Оголошень</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-red-600">
                  {user.stats.petitions_signed}
                </p>
                <p className="text-sm text-gray-600 mt-1">Петицій</p>
              </div>
            </div>
          </div>

          {/* Недавня активність */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Недавня активність</h3>
            <div className="space-y-4">
              {/* TODO: Отримати недавню активність з API */}
              <p className="text-sm text-gray-500">
                Немає недавньої активності
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Швидкі дії */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Швидкі дії</h3>
            <div className="space-y-2">
              <Link href="/groups/my">
                <Button variant="outline" className="w-full justify-start">
                  Мої групи
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="outline" className="w-full justify-start">
                  Переглянути події
                </Button>
              </Link>
              <Link href="/announcements/create">
                <Button variant="outline" className="w-full justify-start">
                  Створити оголошення
                </Button>
              </Link>
              <Link href="/petitions">
                <Button variant="outline" className="w-full justify-start">
                  Переглянути петиції
                </Button>
              </Link>
            </div>
          </div>

          {/* Налаштування приватності */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Приватність</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Профіль видимий</span>
                <span className="text-green-600 font-medium">Публічний</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email видимий</span>
                <span className="text-gray-600 font-medium">Приватний</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Телефон видимий</span>
                <span className="text-gray-600 font-medium">Приватний</span>
              </div>
            </div>
            <Link href="/profile/settings">
              <Button variant="outline" className="w-full mt-4">
                Налаштувати
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
