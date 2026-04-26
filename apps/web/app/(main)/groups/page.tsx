// apps/web/app/(main)/groups/page.tsx
// Server Component — гості можуть читати, реєстрація потрібна для дій

import { getServerSession } from "next-auth";
import { authOptions } from "@ecity/auth";
import { Button } from "@ecity/ui";
import Link from "next/link";
import { Users, MessageSquare, Plus, Globe, Lock } from "lucide-react";

async function getPublicGroups() {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
  try {
    const res = await fetch(`${backendUrl}/api/v1/groups/public`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data ?? []);
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

export default async function GroupsPage() {
  const [groups, session] = await Promise.all([
    getPublicGroups(),
    getServerSession(authOptions),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Групи</h1>
          <p className="mt-2 text-sm text-gray-600">
            Знаходьте та приєднуйтесь до груп за інтересами
          </p>
        </div>
        {session ? (
          <Link href="/groups/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Створити групу
            </Button>
          </Link>
        ) : (
          <Link href="/login?callbackUrl=/groups/create">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Створити групу
            </Button>
          </Link>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm">Всі типи</Button>
        <Button variant="outline" size="sm">Країна</Button>
        <Button variant="outline" size="sm">Регіон</Button>
        <Button variant="outline" size="sm">Місто</Button>
        <Button variant="outline" size="sm">За інтересами</Button>
      </div>

      {!session && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-blue-700">
            Щоб вступити в групу або надіслати повідомлення — увійдіть або зареєструйтесь
          </p>
          <div className="flex gap-2 ml-4">
            <Link href="/login">
              <Button size="sm" variant="outline">Увійти</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Реєстрація</Button>
            </Link>
          </div>
        </div>
      )}

      {groups.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Немає груп</h3>
          <p className="mt-1 text-sm text-gray-500">Поки що публічних груп немає</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(groups as any[]).map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="group bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <Users className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary line-clamp-1">
                    {group.name}
                  </h3>
                  <div className="flex-shrink-0 ml-2">
                    {group.is_public ? (
                      <Globe className="h-5 w-5 text-blue-500" aria-label="Публічна" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-400" aria-label="Приватна" />
                    )}
                  </div>
                </div>

                {group.type && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-2">
                    {GROUP_TYPE_LABELS[group.type] ?? group.type}
                  </span>
                )}

                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {group.description || "Опис відсутній"}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{group.member_count ?? (group.members?.length ?? 0)} учасників</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>Переглянути</span>
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
