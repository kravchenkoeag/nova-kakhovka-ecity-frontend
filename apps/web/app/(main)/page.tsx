// apps/web/app/(main)/page.tsx

import Link from 'next/link';
import { Button, Card } from '@ecity/ui';
import { 
  MessageSquare, 
  Calendar, 
  Megaphone, 
  FileText, 
  BarChart3, 
  AlertCircle 
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: MessageSquare,
      title: '����� �� ����',
      description: '���������� � ���������� ������ ������',
      href: '/groups',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Calendar,
      title: '��䳿',
      description: 'ĳ���������� ��� ��䳿 � ���',
      href: '/events',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Megaphone,
      title: '����������',
      description: '��������� �� ������������ ����������',
      href: '/announcements',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: FileText,
      title: '�������',
      description: '��������� �� ��������� �������',
      href: '/petitions',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: BarChart3,
      title: '����������',
      description: '����� ������ � ����������� ����',
      href: '/polls',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      icon: AlertCircle,
      title: '�������� ����',
      description: '����������� ��� �������� � ���',
      href: '/city-issues',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Nova Kakhovka e-City
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              ������� ��������� ��� ���������� ����� � ������ ���. 
              ����������, ����� ������ � ���� ������� �� ��������� �� �������� ����.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  ����������
                </Button>
              </Link>
              <Link href="/events">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  ĳ������� �����
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ��������� ���������
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ���, �� ������� ��� ������� ����� � ���� ����, � ������ ����
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.href} href={feature.href}>
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ����� ������?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            ����������� �� ���� �������� �� ����� ���� ������ ����� � ����
          </p>
          <Link href="/register">
            <Button size="lg">
              �������������� �����������
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
