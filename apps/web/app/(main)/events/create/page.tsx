// apps/web/app/(main)/events/create/page.tsx

import { requirePermission } from "@ecity/auth";
import { Permission } from "@ecity/types";
import { Button } from "@ecity/ui";
import { Calendar, MapPin, Users, Clock, Image } from "lucide-react";

/**
 * Сторінка створення події
 * Доступна тільки для користувачів з правом CREATE_EVENT
 */
export default async function CreateEventPage() {
  // 🔒 КРИТИЧНО: Перевірка права створення події
  await requirePermission(Permission.CREATE_EVENT);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Створити подію</h1>
        <p className="mt-2 text-sm text-gray-600">
          Заповніть форму, щоб створити нову подію для громади
        </p>
      </div>

      {/* Форма створення події */}
      <form className="space-y-6">
        {/* Основна інформація */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Основна інформація</h2>

          <div className="space-y-4">
            {/* Назва події */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Назва події <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="День міста 2024"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Категорія */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категорія <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Оберіть категорію</option>
                <option value="culture">Культура</option>
                <option value="sport">Спорт</option>
                <option value="education">Освіта</option>
                <option value="social">Соціальні</option>
                <option value="entertainment">Розваги</option>
                <option value="other">Інше</option>
              </select>
            </div>

            {/* Опис */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Опис події <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={6}
                placeholder="Детальний опис події, програма заходу..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>
        </div>

        {/* Дата та час */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Дата та час
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Дата початку */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата початку <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Час початку */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Час початку <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Дата закінчення */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата закінчення
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Час закінчення */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Час закінчення
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Локація */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Локація
          </h2>

          <div className="space-y-4">
            {/* Адреса */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Адреса <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Центральна площа, Нова Каховка"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Координати (опціонально) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Широта (latitude)
                </label>
                <input
                  type="number"
                  step="0.000001"
                  placeholder="47.6097"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Довгота (longitude)
                </label>
                <input
                  type="number"
                  step="0.000001"
                  placeholder="33.3806"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Додаткові налаштування */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Додаткові налаштування</h2>

          <div className="space-y-4">
            {/* Максимальна кількість учасників */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Максимальна кількість учасників
              </label>
              <input
                type="number"
                min="1"
                placeholder="Необмежено (залиште порожнім)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Посилання на реєстрацію */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Посилання на реєстрацію
              </label>
              <input
                type="url"
                placeholder="https://example.com/register"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Завантаження зображення */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Image className="h-4 w-4" />
                Зображення події
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="event-image"
                />
                <label
                  htmlFor="event-image"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Image className="h-12 w-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Натисніть, щоб завантажити зображення
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PNG, JPG до 5MB
                  </span>
                </label>
              </div>
            </div>

            {/* Теги */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Теги
              </label>
              <input
                type="text"
                placeholder="день міста, концерт, культура"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Розділіть теги комами
              </p>
            </div>
          </div>
        </div>

        {/* Кнопки дій */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline">
            Скасувати
          </Button>
          <Button type="submit" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Створити подію
          </Button>
        </div>
      </form>
    </div>
  );
}
