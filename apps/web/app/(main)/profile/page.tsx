// apps/web/app/(main)/profile/page.tsx

import { getSession } from '@ecity/auth';
import { redirect } from 'next/navigation';
import { Button } from '@ecity/ui';
import { Mail, Phone, MapPin, Calendar, Edit } from 'lucide-react';
import Link from 'next/link';

// Сторінка профілю користувача

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // TODO: Отримати повні дані користувача з API
  const user = session.user;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold">
              {user.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <Link href="/profile/edit">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Редагувати
            </Button>
          </Link>
        </div>
      </div>

      {/* Інформація */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Контактна інформація</h2>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <span>{user.email}</span>
            </div>
            {/* TODO: Додати phone, address з API */}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Статистика</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Мої групи</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Створено подій</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Оголошення</span>
              <span className="font-semibold">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}