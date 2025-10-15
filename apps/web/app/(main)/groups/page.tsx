// apps/web/app/(main)/groups/page.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccessToken } from '@ecity/auth';
import { apiClient } from '@/lib/api-client';
import { Button } from '@ecity/ui';
import { Plus, Users, Lock, Globe } from 'lucide-react';
import Link from 'next/link';

// Сторінка груп

export default function GroupsPage() {
  const token = useAccessToken();

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: () => apiClient.groups.getPublic(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Групи</h1>
          <p className="mt-2 text-sm text-gray-600">
            Спілкуйтесь з мешканцями за інтересами
          </p>
        </div>
        {token && (
          <Link href="/groups/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Створити групу
            </Button>
          </Link>
        )}
      </div>

      {/* Список груп */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups?.map((group: any) => (
          <Link
            key={group.id}
            href={`/groups/${group.id}`}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all border overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary">
                    {group.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {group.description}
                  </p>
                </div>
                <div className="ml-4">
                  {group.is_public ? (
                    <Globe className="h-5 w-5 text-green-500" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{group.members?.length || 0} учасників</span>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {group.type}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {groups?.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Груп не знайдено</h3>
          <p className="mt-1 text-sm text-gray-500">
            Станьте першим, хто створить групу
          </p>
          {token && (
            <div className="mt-6">
              <Link href="/groups/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Створити групу
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}