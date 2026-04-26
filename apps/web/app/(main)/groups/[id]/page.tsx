// apps/web/app/(main)/groups/[id]/page.tsx
// Server Component — публічні групи відкриті для читання без авторизації

import { getServerSession } from "next-auth";
import { authOptions } from "@ecity/auth";
import { notFound } from "next/navigation";
import { Users, Globe, Lock, MessageSquare, Calendar } from "lucide-react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { GroupActions } from "./GroupActions";
import { MessageForm } from "./MessageForm";

async function getGroup(id: string): Promise<{ data: any; status: number } | null> {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
  try {
    const res = await fetch(`${backendUrl}/api/v1/groups/${id}`, {
      next: { revalidate: 30 },
    });
    if (res.status === 404) return null;
    if (!res.ok) return { data: null, status: res.status };
    return { data: await res.json(), status: 200 };
  } catch {
    return null;
  }
}

async function getMessages(id: string) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
  try {
    const res = await fetch(`${backendUrl}/api/v1/groups/${id}/messages`, {
      next: { revalidate: 10 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

const GROUP_TYPE_LABELS: Record<string, string> = {
  country: "Країна",
  region: "Регіон",
  city: "Місто",
  interest: "За інтересами",
};

export default async function GroupPage({
  params,
}: {
  params: { id: string };
}) {
  const [groupResult, messages, session] = await Promise.all([
    getGroup(params.id),
    getMessages(params.id),
    getServerSession(authOptions),
  ]);

  if (!groupResult) notFound();

  // Приватна група — доступ закрито
  if (!groupResult.data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Lock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Закрита група</h1>
        <p className="text-gray-600 mb-6">
          Ця група є приватною. Щоб переглянути її вміст, потрібно бути учасником.
        </p>
        {!session && (
          <div className="flex justify-center gap-3">
            <a
              href={`/login?callbackUrl=/groups/${params.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              Увійти
            </a>
            <a
              href={`/register?callbackUrl=/groups/${params.id}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              Зареєструватись
            </a>
          </div>
        )}
      </div>
    );
  }

  const group = groupResult.data;

  const userIdStr = session?.user?.id;
  const isMember =
    userIdStr && Array.isArray(group.members)
      ? group.members.some((m: string) => m === userIdStr)
      : false;
  const isAdmin =
    userIdStr && Array.isArray(group.admins)
      ? group.admins.some((a: string) => a === userIdStr)
      : false;

  const memberCount = group.member_count ?? group.members?.length ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок групи */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
          <Users className="h-24 w-24 text-white opacity-80" />
        </div>

        <div className="px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    group.is_public
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {group.is_public ? (
                    <Globe className="h-4 w-4 mr-1" />
                  ) : (
                    <Lock className="h-4 w-4 mr-1" />
                  )}
                  {group.is_public ? "Публічна" : "Приватна"}
                </span>
                {group.type && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {GROUP_TYPE_LABELS[group.type] ?? group.type}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {memberCount} учасників
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {messages.length} повідомлень
                </div>
                {group.created_at && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Створена{" "}
                    {format(new Date(group.created_at), "dd MMMM yyyy", { locale: uk })}
                  </div>
                )}
              </div>
            </div>

            <GroupActions
              groupId={params.id}
              isMember={!!isMember}
              isPublic={group.is_public}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Повідомлення */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border flex flex-col">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Повідомлення</h2>
            </div>

            {/* Список повідомлень */}
            <div className="flex-1 px-6 py-4 space-y-4 min-h-[300px] max-h-[500px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="mx-auto h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">Поки що немає повідомлень</p>
                </div>
              ) : (
                (messages as any[]).map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                      <Users className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {msg.user_name || "Учасник"}
                        </span>
                        {msg.created_at && (
                          <span className="text-xs text-gray-400">
                            {format(new Date(msg.created_at), "dd MMM, HH:mm", { locale: uk })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-0.5">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Форма відправки — клієнтський компонент */}
            <MessageForm
              groupId={params.id}
              isMember={!!isMember}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Опис */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-3">Про групу</h2>
            <p className="text-sm text-gray-600">
              {group.description || "Опис групи відсутній"}
            </p>
            {group.location_filter && (
              <div className="mt-4">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Локація
                </span>
                <p className="mt-1 text-sm text-gray-700">{group.location_filter}</p>
              </div>
            )}
            {Array.isArray(group.interest_filter) && group.interest_filter.length > 0 && (
              <div className="mt-4">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Теги
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {group.interest_filter.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Підказка для гостя */}
          {!session && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium mb-1">
                Хочете брати участь?
              </p>
              <p className="text-sm text-blue-600 mb-3">
                Зареєструйтесь, щоб вступити в групу і надсилати повідомлення
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={`/register?callbackUrl=/groups/${params.id}`}
                  className="block w-full text-center bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Зареєструватись
                </a>
                <a
                  href={`/login?callbackUrl=/groups/${params.id}`}
                  className="block w-full text-center border border-blue-300 text-blue-700 text-sm font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Увійти
                </a>
              </div>
            </div>
          )}

          {/* Статистика */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-3">Інформація</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Тип</span>
                <span className="font-medium">
                  {GROUP_TYPE_LABELS[group.type] ?? group.type ?? "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Учасників</span>
                <span className="font-medium">{memberCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Доступ</span>
                <span className="font-medium">
                  {group.is_public ? "Відкрита" : "Закрита"}
                </span>
              </div>
              {isAdmin && (
                <div className="pt-3 border-t">
                  <a
                    href={`/groups/${params.id}/settings`}
                    className="text-sm text-primary hover:underline"
                  >
                    Налаштування групи
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
