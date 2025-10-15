// apps/admin/app/(auth)/login/page.tsx

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Label } from '@ecity/ui';
import { AlertCircle } from 'lucide-react';

/**
 * Сторінка логіну для модераторів
 */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Невірний email або пароль');
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError('Сталася помилка. Спробуйте ще раз.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Логотип та заголовок */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-lg bg-blue-500 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">NK</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Nova Kakhovka e-City
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Вхід для модераторів
          </p>
        </div>

        {/* Форма логіну */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email адреса</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="moderator@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Вхід...' : 'Увійти'}
          </Button>
        </form>

        {/* Тестові креденшали для розробки */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-md">
            <p className="text-xs text-yellow-800 font-medium">
              Тестові креденшали:
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Email: moderator@example.com
            </p>
            <p className="text-xs text-yellow-700">
              Password: moderator123
            </p>
          </div>
        )}
      </div>
    </div>
  );
}