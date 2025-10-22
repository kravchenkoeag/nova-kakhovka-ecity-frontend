// apps/web/app/(main)/groups/page.tsx

import { requireAuth } from "@ecity/auth";
import { Button } from "@ecity/ui";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  MessageSquare,
  Lock,
  Globe,
  Filter,
} from "lucide-react";

/**
 * Сторінка списку груп
 * Доступна тільки для авторизованих користувачів
 */
export default async function GroupsPage() {
  // 🔒 КРИТИЧНО: Перевірка авторизації
  await requireAuth();

  // TODO: Отримати список груп з API
  const groups = [
    {
      id: "1",
      name: "Батьки школярів",
      description: "Обговорення шкільних питань та організація заходів",
      type: "education",
      is_public: true,
      members_count: 234,
      messages_count: 1456,
      avatar_url: null,
      last_activity: "2024-03-20T14:30:00Z",
    },
    {
      id: "2",
      name: "Спортивний клуб",
      description: "Організація спортивних заходів та тренувань",
      type: "sport",
      is_public: false,
      members_count: 89,
      messages_count: 567,
      avatar_url: null,
      last_activity: "2024-03-20T10:15:00Z",
    },
    {
      id: "3",
      name: "Сусіди 5-го мікрорайону",
      description: "Обговорення проблем та подій мікрорайону",
      type: "neighborhood",
      is_public: true,
      members_count: 156,
      messages_count: 892,
      avatar_url: null,
      last_activity: "2024-03-19T18:45:00Z",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок та дії */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Групи</h1>
          <p className="mt-2 text-sm text-gray-600">
            Знаходьте та приєднуйтесь до груп за інтересами
          </p>
        </div>
        <Link href="/groups/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Створити групу
          </Button>
        </Link>
      </div>

      {/* Пошук та фільтри */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Пошук груп..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Filter className="h-5 w-5 text-gray-400 self-center" />
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Всі типи</option>
              <option value="neighborhood">Сусідство</option>
              <option value="education">Освіта</option>
              <option value="sport">Спорт</option>
              <option value="hobby">Хобі</option>
            </select>
            <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Всі групи</option>
              <option value="public">Публічні</option>
              <option value="private">Приватні</option>
            </select>
          </div>
        </div>
      </div>

      {/* Швидкі посилання */}
      <div className="mb-6 flex gap-2">
        <Link href="/groups">
          <Button variant="outline" size="sm">
            Всі групи
          </Button>
        </Link>
        <Link href="/groups/my">
          <Button variant="outline" size="sm">
            Мої групи
          </Button>
        </Link>
        <Link href="/groups/recommended">
          <Button variant="outline" size="sm">
            Рекомендовані
          </Button>
        </Link>
      </div>

      {/* Список груп */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Аватар групи */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              {group.avatar_url ? (
                <img
                  src={group.avatar_url}
                  alt={group.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Users className="h-16 w-16 text-white" />
              )}
            </div>

            {/* Інформація про групу */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {group.name}
                </h3>
                <div className="flex-shrink-0 ml-2">
                  {/* ⚠️ ВИПРАВЛЕННЯ TypeScript помилки 2322:
                      Lucide React іконки не підтримують атрибут 'title'.
                      Використовуємо 'aria-label' для accessibility замість 'title'. */}
                  {group.is_public ? (
                    <Globe
                      className="h-5 w-5 text-blue-500"
                      aria-label="Публічна група"
                    />
                  ) : (
                    <Lock
                      className="h-5 w-5 text-gray-500"
                      aria-label="Приватна група"
                    />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {group.description}
              </p>

              {/* Статистика */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{group.members_count} учасників</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{group.messages_count}</span>
                </div>
              </div>

              {/* Кнопка переходу */}
              <Link href={`/groups/${group.id}`}>
                <Button variant="outline" className="w-full">
                  Переглянути групу
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Пагінація */}
      <div className="mt-8 flex justify-center">
        <nav className="flex gap-2">
          <Button variant="outline" disabled>
            Попередня
          </Button>
          <Button variant="outline">1</Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline">Наступна</Button>
        </nav>
      </div>
    </div>
  );
}
