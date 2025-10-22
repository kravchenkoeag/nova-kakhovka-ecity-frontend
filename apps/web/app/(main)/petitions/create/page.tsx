// apps/web/app/(main)/petitions/create/page.tsx

import { requirePermission } from "@ecity/auth";
import { Permission } from "@ecity/types";
import { Button } from "@ecity/ui";
import { FileText, Users, Calendar } from "lucide-react";

/**
 * Сторінка створення петиції
 * Доступна тільки для користувачів з правом CREATE_PETITION
 */
export default async function CreatePetitionPage() {
  // 🔒 КРИТИЧНО: Перевірка права створення петиції
  await requirePermission(Permission.CREATE_PETITION);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Створити петицію</h1>
        <p className="mt-2 text-sm text-gray-600">
          Запропонуйте ініціативу для розгляду міською владою
        </p>
      </div>

      {/* Інформаційний блок */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          Як працюють електронні петиції?
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>
            Петиція повинна набрати мінімальну кількість підписів (зазвичай
            1000)
          </li>
          <li>Термін збору підписів - 3 місяці з моменту публікації</li>
          <li>Після досягнення цілі петиція розглядається міською радою</li>
          <li>Ви отримаєте офіційну відповідь протягом 30 днів</li>
        </ul>
      </div>

      {/* Форма створення петиції */}
      <form className="space-y-6">
        {/* Основна інформація */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Основна інформація</h2>

          <div className="space-y-4">
            {/* Заголовок петиції */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок петиції <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Короткий та зрозумілий заголовок"
                maxLength={200}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Максимум 200 символів. Буде відображатись у списку петицій.
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
                <option value="infrastructure">Інфраструктура</option>
                <option value="improvement">Благоустрій</option>
                <option value="transport">Транспорт</option>
                <option value="healthcare">Охорона здоров'я</option>
                <option value="education">Освіта</option>
                <option value="culture">Культура та спорт</option>
                <option value="ecology">Екологія</option>
                <option value="social">Соціальні питання</option>
                <option value="other">Інше</option>
              </select>
            </div>

            {/* Опис петиції */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Детальний опис <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={10}
                placeholder="Опишіть проблему та запропонуйте шляхи її вирішення..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Мінімум 300 символів. Чим детальніше ви опишете проблему та
                рішення, тим більше шансів на успіх.
              </p>
            </div>

            {/* Очікуваний результат */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Очікуваний результат <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Що саме повинно бути зроблено? Які конкретні дії ви очікуєте від влади?"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>
        </div>

        {/* Налаштування петиції */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Налаштування петиції</h2>

          <div className="space-y-4">
            {/* Ціль по підписах */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Ціль по кількості підписів{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Оберіть ціль</option>
                <option value="1000">
                  1,000 підписів (стандарт для міста)
                </option>
                <option value="1500">1,500 підписів</option>
                <option value="2000">2,000 підписів</option>
                <option value="3000">3,000 підписів</option>
                <option value="5000">5,000 підписів</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Мінімальна кількість підписів для розгляду петиції міською
                радою.
              </p>
            </div>

            {/* Термін збору підписів */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Термін збору підписів
              </label>
              <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="90">3 місяці (стандарт)</option>
                <option value="60">2 місяці</option>
                <option value="30">1 місяць</option>
              </select>
            </div>
          </div>
        </div>

        {/* Автор петиції */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Інформація про автора</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ім'я та прізвище <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ваше повне ім'я"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email для зв'язку <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="email@example.com"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                На цей email прийде підтвердження та всі оновлення по петиції.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Телефон (опціонально)
              </label>
              <input
                type="tel"
                placeholder="+380 XX XXX XX XX"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Згода з правилами */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="space-y-3">
            <label className="flex items-start">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-3 text-sm text-gray-700">
                Я підтверджую, що вся інформація в петиції є достовірною{" "}
                <span className="text-red-500">*</span>
              </span>
            </label>

            <label className="flex items-start">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-3 text-sm text-gray-700">
                Я ознайомився з{" "}
                <a href="/terms" className="text-primary hover:underline">
                  правилами створення петицій
                </a>{" "}
                та{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  політикою конфіденційності
                </a>{" "}
                <span className="text-red-500">*</span>
              </span>
            </label>

            <label className="flex items-start">
              <input
                type="checkbox"
                className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-3 text-sm text-gray-700">
                Я хочу отримувати email-оповіщення про стан петиції
              </span>
            </label>
          </div>
        </div>

        {/* Попередження */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Увага:</strong> Петиція буде відправлена на модерацію. Після
            схвалення вона з'явиться на сайті та почнеться збір підписів. Будь
            ласка, перевірте всю інформацію перед відправкою.
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
            <FileText className="h-4 w-4" />
            Відправити на модерацію
          </Button>
        </div>
      </form>
    </div>
  );
}
