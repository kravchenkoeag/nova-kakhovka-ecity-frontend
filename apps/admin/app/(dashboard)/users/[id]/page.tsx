// apps/admin/app/(dashboard)/users/[id]/page.tsx

import { notFound } from "next/navigation";
import { requirePermission, getAccessToken } from "@ecity/auth";
import { Permission } from "@ecity/types";
import { Button } from "@ecity/ui";
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react";
import Link from "next/link";

// Детальна інформація про користувача
export default async function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Require user management permission
  await requirePermission(Permission.MANAGE_USERS);

  const token = await getAccessToken();

  if (!token) {
    return notFound();
  }

  // TODO: Отримати дані користувача з API
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/v1/admin/users/${params.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return notFound();
  }

  const user = await response.json();

  return (
    <div className="space-y-6">
      {/* Назад */}
      <Link href="/dashboard/users">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад до списку
        </Button>
      </Link>

      {/* Заголовок */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-medium">
            {user.first_name?.[0]}
            {user.last_name?.[0]}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-sm text-gray-600 mt-1">ID: {user.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Редагувати</Button>
          <Button variant={user.is_blocked ? "default" : "destructive"}>
            {user.is_blocked ? "Розблокувати" : "Заблокувати"}
          </Button>
        </div>
      </div>

      {/* Інформація */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основна інформація */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Основна інформація</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Телефон</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
              )}
              {user.registered_address && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Адреса</p>
                    <p className="font-medium">{user.registered_address}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Дата реєстрації</p>
                  <p className="font-medium">
                    {new Date(user.created_at).toLocaleDateString("uk-UA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Інтереси */}
          {user.interests?.length > 0 && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Інтереси</h2>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest: string) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Статистика */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Статистика</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Групи</p>
                <p className="text-2xl font-bold">{user.groups?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Створено оголошень</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Створено подій</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Статус</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Верифікований</span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.is_verified
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.is_verified ? "Так" : "Ні"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Модератор</span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.is_moderator
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.is_moderator ? "Так" : "Ні"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Заблокований</span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.is_blocked
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {user.is_blocked ? "Так" : "Ні"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
