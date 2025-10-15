// apps/web/app/(main)/groups/[id]/page.tsx

import { notFound } from 'next/navigation';
import { getAccessToken } from '@ecity/auth';
import { Button } from '@ecity/ui';
import { Users, MessageSquare, Globe, Lock, Settings } from 'lucide-react';
import Link from 'next/link';

// Детальна сторінка групи
export default async function GroupDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const token = await getAccessToken();

  if (!token) {
    notFound();
  }

  // TODO: Отримати дані групи з API
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/v1/groups/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      notFound();
    }

    const group = await response.json();

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Заголовок групи */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {group.is_public ? (
                  <Globe className="h-5 w-5 text-green-500" />
                ) : (
                  <Lock className="h-5 w-5 text-gray-400" />
                )}
                <span className="text-sm text-gray-500">
                  {group.is_public ? 'Публічна група' : 'Приватна група'}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
              <p className="mt-2 text-gray-600">{group.description}</p>
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{group.members?.length || 0} учасників</span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {group.type}
                </span>
              </div>
            </div>

            {/* Кнопки дій */}
            <div className="ml-6 flex space-x-2">
              <Link href={`/groups/${params.id}/chat`}>
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Чат
                </Button>
              </Link>
              {/* TODO: Перевірити чи користувач є адміном */}
              <Button variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основна інформація */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Про групу</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600">
                  {group.description || 'Опис групи відсутній'}
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
              </div>
            </div>

            {/* Недавня активність */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Недавня активність</h2>
              <div className="space-y-4">
                {/* TODO: Список недавніх повідомлень */}
                <p className="text-sm text-gray-500">
                  Немає недавньої активності
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Учасники */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Учасники</h2>
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
                    {group.is_public ? 'Публічна' : 'Приватна'}
                  </span>
                </div>
                {group.max_members && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ліміт учасників</span>
                    <span className="font-medium">{group.max_members}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Авто-приєднання</span>
                  <span className="font-medium">
                    {group.auto_join ? 'Увімкнено' : 'Вимкнено'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching group:', error);
    notFound();
  }
}