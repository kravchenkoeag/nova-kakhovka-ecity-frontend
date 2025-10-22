// apps/web/app/(main)/polls/create/page.tsx

import { requirePermission } from "@ecity/auth";
import { Permission } from "@ecity/types";
import { Button } from "@ecity/ui";
import { BarChart3, Plus, Trash2, Calendar } from "lucide-react";

/**
 * Сторінка створення опитування
 * Доступна тільки для користувачів з правом CREATE_POLL
 */
export default async function CreatePollPage() {
  // 🔒 КРИТИЧНО: Перевірка права створення опитування
  await requirePermission(Permission.CREATE_POLL);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Створити опитування
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Дізнайтесь думку громади з важливих питань
        </p>
      </div>

      {/* Форма створення опитування */}
      <form className="space-y-6">
        {/* Основна інформація */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Основна інформація</h2>

          <div className="space-y-4">
            {/* Назва опитування */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Назва опитування <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Питання опитування"
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
                <option value="city_development">Розвиток міста</option>
                <option value="infrastructure">Інфраструктура</option>
                <option value="culture">Культура та спорт</option>
                <option value="ecology">Екологія</option>
                <option value="transport">Транспорт</option>
                <option value="social">Соціальні питання</option>
                <option value="other">Інше</option>
              </select>
            </div>

            {/* Опис */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Опис опитування
              </label>
              <textarea
                rows={4}
                placeholder="Коротко опишіть мету опитування (опціонально)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>
        </div>

        {/* Питання */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Питання</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Додати питання
            </Button>
          </div>

          {/* Питання 1 */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Питання 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Введіть текст питання"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="ml-2 mt-7"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            {/* Тип питання */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип відповіді
              </label>
              <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="single">Одна відповідь (radio)</option>
                <option value="multiple">Декілька відповідей (checkbox)</option>
                <option value="text">Текстова відповідь</option>
                <option value="rating">Оцінка (1-5)</option>
              </select>
            </div>

            {/* Варіанти відповідей */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Варіанти відповідей
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Варіант 1"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button type="button" variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Варіант 2"
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button type="button" variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Додати варіант
                </Button>
              </div>
            </div>

            {/* Обов'язкове питання */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Обов'язкове питання
                </span>
              </label>
            </div>
          </div>

          {/* Інформація про додавання питань */}
          <div className="text-sm text-gray-500 text-center py-4">
            Натисніть "Додати питання", щоб додати більше питань до опитування
          </div>
        </div>

        {/* Налаштування опитування */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">
            Налаштування опитування
          </h2>

          <div className="space-y-4">
            {/* Період проведення */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Дата початку
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Дата завершення
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Додаткові налаштування */}
            <div className="space-y-3 pt-4 border-t">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Дозволити множинні відповіді від одного користувача
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Анонімне опитування (не показувати, хто голосував)
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Показувати результати після голосування
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Публічне опитування (доступне всім без авторизації)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Видимість */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Хто може брати участь?</h2>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="visibility"
                value="all"
                defaultChecked
                className="border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">
                Всі користувачі платформи
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="visibility"
                value="verified"
                className="border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">
                Тільки верифіковані користувачі
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="visibility"
                value="group"
                className="border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">
                Тільки члени певних груп (вкажіть нижче)
              </span>
            </label>
          </div>

          {/* Вибір груп (показується, якщо обрано "group") */}
          <div className="mt-4 hidden">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Оберіть групи
            </label>
            <select
              multiple
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              size={5}
            >
              <option value="1">Батьки школярів</option>
              <option value="2">Спортивний клуб</option>
              <option value="3">Сусіди 5-го мікрорайону</option>
            </select>
          </div>
        </div>

        {/* Попередження */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Підказка:</strong> Після створення опитування ви зможете
            переглянути статистику відповідей в реальному часі та експортувати
            результати.
          </p>
        </div>

        {/* Кнопки дій */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline">
            Зберегти чернетку
          </Button>
          <Button type="button" variant="outline">
            Попередній перегляд
          </Button>
          <Button type="submit" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Опублікувати опитування
          </Button>
        </div>
      </form>
    </div>
  );
}
