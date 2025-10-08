// apps/admin/components/dashboard/sidebar.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@ecity/ui';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  Megaphone,
  FileText,
  BarChart3,
  AlertCircle,
  Bus,
  Bell,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Користувачі', href: '/dashboard/users', icon: Users },
  { name: 'Групи', href: '/dashboard/groups', icon: MessageSquare },
  { name: 'Події', href: '/dashboard/events', icon: Calendar },
  { name: 'Оголошення', href: '/dashboard/announcements', icon: Megaphone },
  { name: 'Петиції', href: '/dashboard/petitions', icon: FileText },
  { name: 'Опитування', href: '/dashboard/polls', icon: BarChart3 },
  { name: 'Проблеми міста', href: '/dashboard/city-issues', icon: AlertCircle },
  { name: 'Транспорт', href: '/dashboard/transport', icon: Bus },
  { name: 'Сповіщення', href: '/dashboard/notifications', icon: Bell },
  { name: 'Налаштування', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">
            Nova Kakhovka
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}