// apps/web/components/layout/navbar.tsx

'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button, Avatar } from '@ecity/ui';
import { Menu, Bell, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Групи', href: '/groups' },
    { name: 'Події', href: '/events' },
    { name: 'Оголошення', href: '/announcements' },
    { name: 'Петиції', href: '/petitions' },
    { name: 'Опитування', href: '/polls' },
    { name: 'Проблеми міста', href: '/city-issues' },
    { name: 'Транспорт', href: '/transport' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-600">
              Nova Kakhovka
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                </Button>

                <Link href="/profile">
                  <Avatar className="cursor-pointer">
                    {session.user.name?.charAt(0)}
                  </Avatar>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Вийти
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Увійти
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Реєстрація
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}