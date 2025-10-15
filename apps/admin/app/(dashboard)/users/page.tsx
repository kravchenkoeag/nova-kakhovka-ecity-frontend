// apps/admin/app/(dashboard)/users/page.tsx

'use client';

import { useState } from 'react';
import { useUsers, useBlockUser } from '@/hooks/useUsers';
import { Button } from '@ecity/ui';
import { Search, UserX, UserCheck } from 'lucide-react';
import Link from 'next/link';

// Сторінка управління користувачами
export default function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const blockUser = useBlockUser();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users?.data?.filter((user: any) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBlockToggle = async (userId: string, currentlyBlocked: boolean) => {
    try {
      await blockUser.mutateAsync({ userId, block: !currentlyBlocked });
    } catch (error) {
      console.error('Error toggling user block:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок та пошук */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Користувачі</h1>
          <p className="mt-2 text-sm text-gray-600">
            Управління користувачами платформи
          </p>
        </div>
      </div>

      {/* Пошук */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук за email або ім'ям..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Таблиця користувачів */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Користувач
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Телефон
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата реєстрації
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дії
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers?.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </div>
                      {user.is_moderator && (
                        <div className="text-xs text-blue-600">Модератор</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.phone || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_blocked
                        ? 'bg-red-100 text-red-800'
                        : user.is_verified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {user.is_blocked
                      ? 'Заблокований'
                      : user.is_verified
                      ? 'Верифікований'
                      : 'Активний'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString('uk-UA')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link href={`/dashboard/users/${user.id}`}>
                      <Button variant="ghost" size="sm">
                        Переглянути
                      </Button>
                    </Link>
                    <Button
                      variant={user.is_blocked ? 'default' : 'destructive'}
                      size="sm"
                      onClick={() => handleBlockToggle(user.id, user.is_blocked)}
                      disabled={blockUser.isPending}
                    >
                      {user.is_blocked ? (
                        <>
                          <UserCheck className="h-4 w-4 mr-1" />
                          Розблокувати
                        </>
                      ) : (
                        <>
                          <UserX className="h-4 w-4 mr-1" />
                          Заблокувати
                        </>
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Користувачів не знайдено</p>
          </div>
        )}
      </div>
    </div>
  );
}