// apps/admin/components/dashboard/header.tsx

'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button, Avatar } from '@ecity/ui';
import { LogOut, Bell } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex-1" />

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        {/* User menu */}
        <div className="flex items-center gap-3">
          <Avatar>
            {session?.user?.name?.charAt(0) || 'A'}
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{session?.user?.name}</p>
            <p className="text-xs text-gray-500">{session?.user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
