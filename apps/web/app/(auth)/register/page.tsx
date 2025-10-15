// apps/web/app/(auth)/register/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label } from '@ecity/ui';
import { AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

// Сторінка реєстрації
export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Валідація
    if (formData.password !== formData.confirmPassword) {
      setError('Паролі не співпадають');
      return;
    }

    if (formData.password.length < 8) {
      setError('Пароль має містити мінімум 8 символів');
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.auth.register({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone || undefined,
      });

      // Успішна реєстрація - редірект на логін
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Виникла помилка при реєстрації');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-white">NK</span>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Реєстрація
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Створіть свій акаунт в e-City
            </p>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">Ім'я *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="last_name">Прізвище *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Телефон (опційно)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1"
                placeholder="+380"
              />
            </div>

            <div>
              <Label htmlFor="password">Пароль *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
                placeholder="Мінімум 8 символів"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Підтвердіть пароль *</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Реєстрація...' : 'Зареєструватися'}
            </Button>
          </form>

          {/* Логін */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Вже є акаунт?{' '}
              <Link
                href="/login"
                className="font-medium text-primary hover:text-primary/80"
              >
                Увійти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}