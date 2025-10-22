// apps/web/app/(main)/city-issues/report/page.tsx

import { requirePermission } from "@ecity/auth";
import { Permission } from "@ecity/types";
import { Button } from "@ecity/ui";
import { MapPin, Camera, AlertCircle } from "lucide-react";

/**
 * Сторінка повідомлення про проблему міста
 * Доступна тільки для користувачів з правом REPORT_CITY_ISSUE
 */
export default async function ReportCityIssuePage() {
  // 🔒 КРИТИЧНО: Перевірка права повідомлення про проблеми міста
  await requirePermission(Permission.REPORT_CITY_ISSUE);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Повідомити про проблему
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Допоможіть зробити наше місто кращим - повідомте про проблеми
          інфраструктури
        </p>
      </div>

      {/* Інформаційний блок */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Що можна повідомляти?
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Ями на дорогах та пошкоджене дорожнє покриття</li>
          <li>Несправне освітлення вулиць</li>
          <li>Переповнені сміттєві баки</li>
          <li>Пошкоджені зупинки та лавки</li>
          <li>Проблеми з благоустроєм</li>
          <li>Аварійні дерева та зелені насадження</li>
        </ul>
      </div>

      {/* Форма повідомлення */}
      <form className="space-y-6">
        {/* Основна інформація */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Опис проблеми</h2>

          <div className="space-y-4">
            {/* Заголовок */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Коротко опишіть проблему"
                maxLength={100}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Наприклад: "Яма на дорозі на вул. Шевченка"
              </p>
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
                <option value="roads">Дороги</option>
                <option value="lighting">Освітлення</option>
                <option value="sanitation">Санітарія та прибирання</option>
                <option value="greenery">Зелені насадження</option>
                <option value="improvement">Благоустрій</option>
                <option value="transport">Громадський транспорт</option>
                <option value="infrastructure">Інфраструктура</option>
                <option value="other">Інше</option>
              </select>
            </div>

            {/* Пріоритет */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пріоритет <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Оберіть пріоритет</option>
                <option value="low">
                  Низький - некритично, можна вирішити пізніше
                </option>
                <option value="medium">Середній - потребує уваги</option>
                <option value="high">
                  Високий - потребує термінового вирішення
                </option>
              </select>
            </div>

            {/* Детальний опис */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Детальний опис <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={6}
                placeholder="Опишіть проблему детальніше. Коли ви її помітили? Які можуть бути наслідки?"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Чим детальніше ви опишете проблему, тим швидше її зможуть
                вирішити
              </p>
            </div>
          </div>
        </div>

        {/* Локація */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Місцезнаходження
          </h2>

          <div className="space-y-4">
            {/* Адреса */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Адреса або місце <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="вул. Шевченка, 45 або біля Центрального парку"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Координати */}
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

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                📍 Підказка: Ви можете визначити координати автоматично
              </p>
              <Button type="button" variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                Використати мою локацію
              </Button>
            </div>

            {/* Карта (заглушка) */}
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Тут буде інтерактивна карта для вибору місця
              </p>
            </div>
          </div>
        </div>

        {/* Фотографії */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Фотографії проблеми
          </h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              className="hidden"
              id="issue-photos"
            />
            <label
              htmlFor="issue-photos"
              className="cursor-pointer flex flex-col items-center"
            >
              <Camera className="h-16 w-16 text-gray-400 mb-3" />
              <span className="text-sm text-gray-600 font-medium">
                Натисніть, щоб зробити фото або завантажити з галереї
              </span>
              <span className="text-xs text-gray-500 mt-2">
                Можна завантажити до 5 фотографій
              </span>
              <span className="text-xs text-gray-500">
                PNG, JPG до 10MB кожна
              </span>
            </label>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p className="font-medium">Поради для якісних фотографій:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-xs">
              <li>Зробіть фото проблеми з кількох ракурсів</li>
              <li>Покажіть масштаб проблеми</li>
              <li>
                Захопіть орієнтири (будинки, вивіски) для легшої ідентифікації
              </li>
              <li>Фотографуйте при денному світлі для кращої якості</li>
            </ul>
          </div>
        </div>

        {/* Контактна інформація */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Контактна інформація</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ваше ім'я
              </label>
              <input
                type="text"
                placeholder="Ім'я та прізвище"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Телефон для зв'язку
              </label>
              <input
                type="tel"
                placeholder="+380 XX XXX XX XX"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Не обов'язково, але може прискорити вирішення проблеми
              </p>
            </div>

            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Отримувати оновлення про статус проблеми
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Попередження */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Важливо:</strong> Повідомлення буде відправлено
            відповідальному відділу. Ви отримаєте номер звернення та зможете
            відстежувати статус вирішення проблеми.
          </p>
        </div>

        {/* Кнопки дій */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline">
            Скасувати
          </Button>
          <Button type="submit" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Відправити повідомлення
          </Button>
        </div>
      </form>
    </div>
  );
}
