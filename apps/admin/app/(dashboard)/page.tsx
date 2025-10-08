// apps/admin/app/(dashboard)/page.tsx

import { StatsCard } from '@/components/dashboard/stats-card';
import { AnalyticsChart } from '@/components/charts/analytics-chart';
import { getSession } from '@ecity/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // � ��������� ��� ������ ������ �� API
  const stats = {
    totalUsers: 1234,
    activeGroups: 45,
    totalEvents: 89,
    pendingIssues: 23,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          ³����, {session.user.name}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="������ ������������"
          value={stats.totalUsers}
          icon="users"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="������ �����"
          value={stats.activeGroups}
          icon="users"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="��䳿"
          value={stats.totalEvents}
          icon="calendar"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="�������� ���������"
          value={stats.pendingIssues}
          icon="alert"
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      {/* Analytics Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">��������� ������������</h2>
        <AnalyticsChart />
      </div>
    </div>
  );
}
