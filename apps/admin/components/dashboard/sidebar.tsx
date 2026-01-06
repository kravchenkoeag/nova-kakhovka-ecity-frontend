// apps/admin/components/dashboard/sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@ecity/ui";
import {
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
  LayoutDashboard,
} from "lucide-react";

/**
 * Навігаційні елементи sidebar
 */
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Користувачі", href: "/dashboard/users", icon: Users },
  { name: "Групи", href: "/dashboard/groups", icon: MessageSquare },
  { name: "Події", href: "/dashboard/events", icon: Calendar },
  { name: "Оголошення", href: "/dashboard/announcements", icon: Megaphone },
  { name: "Петиції", href: "/dashboard/petitions", icon: FileText },
  { name: "Опитування", href: "/dashboard/polls", icon: BarChart3 },
  { name: "Проблеми міста", href: "/dashboard/city-issues", icon: AlertCircle },
  { name: "Транспорт", href: "/dashboard/transport", icon: Bus },
  { name: "Сповіщення", href: "/dashboard/notifications", icon: Bell },
];

/** Sidebar для адмін панелі
 * Містить логотип та навігаційне меню */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      {/* Логотип */}
      <div className="flex h-16 items-center justify-center border-b border-gray-800 px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <span className="text-lg font-bold">NK</span>
          </div>
          <span className="text-lg font-semibold">e-City Admin</span>
        </Link>
      </div>

      {/* Навігація */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Налаштування внизу */}
      <div className="border-t border-gray-800 p-3">
        <Link
          href="/dashboard/settings"
          className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span>Налаштування</span>
        </Link>
      </div>
    </div>
  );
}
