// apps/web/app/(main)/page.tsx

import { Button } from '@ecity/ui';
import Link from 'next/link';
import {
  MessageSquare,
  Calendar,
  Megaphone,
  FileText,
  MapPin,
  Bus,
  Users,
  TrendingUp,
} from 'lucide-react';

/**
 * Головна сторінка веб-додатку
 */
export default function HomePage() {
  const features = [
    {
      name: 'Групи та чати',
      description: 'Спілкуйтесь з мешканцями за інтересами та локацією',
      icon: MessageSquare,
      href: '/groups',
      color: 'bg-blue-500',
    },
    {
      name: 'Події',
      description: 'Дізнавайтесь про культурні та соціальні заходи',
      icon: Calendar,
      href: '/events',
      color: 'bg-purple-500',
    },
    {
      name: 'Оголошення',
      description: 'Розміщуйте та шукайте потрібні послуги',
      icon: Megaphone,
      href: '/announcements',
      color: 'bg-green-500',
    },
    {
      name: 'Петиції',
      description: 'Впливайте на рішення міської влади',
      icon: FileText,
      href: '/petitions',
      color: 'bg-red-500',
    },
    {
      name: 'Проблеми міста',
      description: 'Повідомляйте про проблеми інфраструктури',
      icon: MapPin,
      href: '/city-issues',
      color: 'bg-orange-500',
    },
    {
      name: 'Транспорт',
      description: 'Відстежуйте громадський транспорт онлайн',
      icon: Bus,
      href: '/transport',
      color: 'bg-indigo-500',
    },
  ];

  const stats = [
    { label: 'Активних користувачів', value: '1,248', icon: Users },
    { label: 'Створено груп', value: '45', icon: MessageSquare },
    { label: 'Заплановано подій', value: '23', icon: Calendar },
    { label: 'Вирішено проблем', value: '156', icon: TrendingUp },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              Nova Kakhovka e-City
            </h1>
            <p className="mt-6 text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto">
              Електронна платформа для громади. 
              Об'єднуємо мешканців, вирішуємо проблеми разом.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Приєднатися
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Дізнатись більше
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Можливості платформи
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Все необхідне для активної участі в житті міста
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.name}
                href={feature.href}
                className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className={`inline-flex p-3 rounded-lg ${feature.color}`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Готові приєднатися?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Приєднуйтесь до нашої спільноти та робіть місто кращим разом з нами
            </p>
            <div className="mt-8">
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-blue-50"
                >
                  Зареєструватися зараз
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}