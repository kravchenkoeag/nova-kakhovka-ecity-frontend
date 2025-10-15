// apps/admin/app/(dashboard)/page.tsx

import { Suspense } from 'react';
import { Users, MessageSquare, Calendar, Megaphone } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/stats-card';
import { AnalyticsChart } from '@/components/charts/analytics-chart';
import { getSession } from '@ecity/auth';
import { redirect } from 'next/navigation';

// Головна сторінка dashboard - показує статистику та активність
export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // TODO: Отримати дані з API замість hardcoded
  const stats = {
    users: { total: 1248, trend: { value: 12, isPositive: true } },
    groups: { total: 45, trend: { value: 5, isPositive: true } },
    events: { total: 23, trend: { value: 3, isPositive: false } },
    announcements: { total: 156, trend: { value: 8, isPositive: true } },
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Вітаємо, {session.user.name}! Огляд основних показників платформи
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Користувачі"
          value={stats.users.total}
          description="Всього зареєстрованих"
          icon={Users}
          trend={stats.users.trend}
        />
        <StatsCard
          title="Групи"
          value={stats.groups.total}
          description="Активні групи"
          icon={MessageSquare}
          trend={stats.groups.trend}
        />
        <StatsCard
          title="Події"
          value={stats.events.total}
          description="Заплановані події"
          icon={Calendar}
          trend={stats.events.trend}
        />
        <StatsCard
          title="Оголошення"
          value={stats.announcements.total}
          description="Активні оголошення"
          icon={Megaphone}
          trend={stats.announcements.trend}
        />
      </div>

      {/* Графік активності */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Активність користувачів</h2>
       <AnalyticsChart />
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-sm text-gray-500">
            Графік буде тут (використати Recharts)
          </p>
        </div>
      </div>

      {/* Недавня активність та сповіщення */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Недавня активність</h2>
          <div className="space-y-4">
            {/* TODO: Список недавньої активності з API */}
            <p className="text-sm text-gray-500">
              Завантаження активності...
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">
            Непрочитані сповіщення
          </h2>
          <div className="space-y-4">
            {/* TODO: Список сповіщень з API */}
            <p className="text-sm text-gray-500">
              Немає нових сповіщень
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}