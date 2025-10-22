// apps/web/app/(main)/announcements/create/page.tsx

import { requirePermission } from "@ecity/auth";
import { Permission } from "@ecity/types";
import { Button } from "@ecity/ui";
import { Megaphone, Image, DollarSign } from "lucide-react";

/**
 * Сторінка створення оголошення
 * Доступна тільки для користувачів з правом CREATE_ANNOUNCEMENT
 */
export default async function CreateAnnouncementPage() {
  // 🔒 КРИТИЧНО: Перевірка права створення оголошення
  await requirePermission(Permission.CREATE_ANNOUNCEMENT);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Створити оголошення
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Розмістіть оголошення про товари або послуги
        </p>
      </div>

      {/* Форма створення оголошення */}
      <form className="space-y-6">
        {/* Основна інформація */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Основна інформація</h2>

          <div className="space-y-4">
            {/* Заголовок */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок оголошення <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Наприклад: Продам велосипед"
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
                <option value="goods">Товари</option>
                <option value="services">Послуги</option>
                <option value="real_estate">Нерухомість</option>
                <option value="transport">Транспорт</option>
                <option value="work">Робота</option>
                <option value="animals">Тварини</option>
                <option value="other">Інше</option>
              </select>
            </div>

            {/* Тип оголошення */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип оголошення <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Оберіть тип</option>
                <option value="sell">Продам</option>
                <option value="buy">Куплю</option>
                <option value="rent">Здам в оренду</option>
                <option value="rent_need">Орендую</option>
                <option value="free">Віддам безкоштовно</option>
                <option value="exchange">Обмін</option>
              </select>
            </div>

            {/* Опис */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Опис <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={6}
                placeholder="Детальний опис товару або послуги..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Мінімум 20 символів</p>
            </div>
          </div>
        </div>

        {/* Ціна */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Ціна
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ціна
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Валюта
              </label>
              <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="UAH">₴ UAH</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">Ціна договірна</span>
            </label>
          </div>
        </div>

        {/* Контактна інформація */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Контактна інформація</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ім'я контактної особи <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ваше ім'я"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Телефон <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="+380 XX XXX XX XX"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Зображення */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Image className="h-5 w-5" />
            Фотографії
          </h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              id="announcement-images"
            />
            <label
              htmlFor="announcement-images"
              className="cursor-pointer flex flex-col items-center"
            >
              <Image className="h-16 w-16 text-gray-400 mb-3" />
              <span className="text-sm text-gray-600 font-medium">
                Натисніть, щоб завантажити фотографії
              </span>
              <span className="text-xs text-gray-500 mt-2">
                Можна завантажити до 10 фотографій
              </span>
              <span className="text-xs text-gray-500">
                PNG, JPG до 5MB кожна
              </span>
            </label>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p className="font-medium">Поради для якісних фотографій:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-xs">
              <li>Фотографуйте при хорошому освітленні</li>
              <li>Показуйте товар з різних ракурсів</li>
              <li>Використовуйте нейтральний фон</li>
              <li>Перша фотографія буде головною</li>
            </ul>
          </div>
        </div>

        {/* Додаткові налаштування */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Додаткові налаштування</h2>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">
                Показувати номер телефону в оголошенні
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">
                Дозволити коментарі до оголошення
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">
                Отримувати сповіщення про відгуки
              </span>
            </label>
          </div>
        </div>

        {/* Попередження */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Важливо:</strong> Оголошення буде відправлено на модерацію.
            Після схвалення воно з'явиться на сайті протягом 24 годин.
          </p>
        </div>

        {/* Кнопки дій */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline">
            Скасувати
          </Button>
          <Button type="submit" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Опублікувати оголошення
          </Button>
        </div>
      </form>
    </div>
  );
}
