// apps/web/app/(main)/petitions/create/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@ecity/ui";
import { FileText, Target, Upload, X } from "lucide-react";
import Link from "next/link";

/**
 * Сторінка створення нової петиції
 * Дозволяє користувачам створювати петиції для міської влади
 */
export default function CreatePetitionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    goal: "1000",
    image: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Надіслати дані на API
      console.log("Creating petition:", formData);

      // Симуляція запиту
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Перенаправлення на сторінку петицій
      router.push("/petitions");
    } catch (error) {
      console.error("Error creating petition:", error);
      alert("Помилка при створенні петиції");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Хлібні крихти */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Головна
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link
              href="/petitions"
              className="text-gray-500 hover:text-gray-700"
            >
              Петиції
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">Створити петицію</li>
        </ol>
      </nav>

      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Створити петицію
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Звертайтесь до міської влади з важливими питаннями
        </p>
      </div>

      {/* Інформаційний блок */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Як працюють петиції?
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Створіть петицію з чітким описом проблеми або пропозиції</li>
          <li>• Зберіть необхідну кількість підписів від мешканців міста</li>
          <li>
            • Після досягнення цілі петиція буде розглянута міською владою
          </li>
          <li>• Ви отримаєте офіційну відповідь протягом 30 днів</li>
        </ul>
      </div>

      {/* Форма створення петиції */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Основна інформація */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Основна інформація
            </h2>

            {/* Назва петиції */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Назва петиції *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Наприклад: Встановлення дитячого майданчика в парку"
              />
              <p className="mt-1 text-sm text-gray-500">
                Коротко та зрозуміло сформулюйте вашу пропозицію
              </p>
            </div>

            {/* Категорія */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Категорія *
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Оберіть категорію</option>
                <option value="infrastructure">Інфраструктура</option>
                <option value="ecology">Екологія</option>
                <option value="education">Освіта</option>
                <option value="healthcare">Охорона здоров'я</option>
                <option value="culture">Культура</option>
                <option value="sport">Спорт</option>
                <option value="social">Соціальні питання</option>
                <option value="other">Інше</option>
              </select>
            </div>

            {/* ⚠️ ВИПРАВЛЕННЯ Tailwind CSS конфлікту:
                Видалено конфліктуючі класи 'block' та 'flex'.
                Використовуємо чистий 'flex' для inline layout без конфліктів. */}
            <div className="flex items-center gap-6">
              {/* Ціль підписів */}
              <div className="flex-1">
                <label
                  htmlFor="goal"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Ціль підписів *
                </label>
                <select
                  id="goal"
                  required
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="500">500 підписів</option>
                  <option value="1000">1000 підписів</option>
                  <option value="2000">2000 підписів</option>
                  <option value="5000">5000 підписів</option>
                </select>
              </div>
            </div>

            {/* Детальний опис */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Детальний опис *
              </label>
              <textarea
                id="description"
                required
                rows={10}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Детально опишіть проблему або пропозицію. Поясніть чому це важливо для міста, які переваги це принесе, які кроки необхідні для реалізації..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Мінімум 200 символів. Чим детальніше ви опишете проблему, тим
                більше шансів отримати підтримку.
              </p>
            </div>
          </div>
        </div>

        {/* Додаткова інформація */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Додаткова інформація
          </h2>

          {/* ⚠️ ВИПРАВЛЕННЯ Tailwind CSS конфлікту:
              Видалено конфліктуючі класи 'block' та 'flex'.
              Використовуємо чистий 'flex' для inline layout без конфліктів. */}
          <div className="flex items-center gap-6 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Термін збору підписів
              </label>
              <p className="text-sm text-gray-600">
                Петиція буде активна протягом 90 днів з моменту публікації
              </p>
            </div>
          </div>

          {/* Зображення */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Зображення (опціонально)
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Додайте фото проблеми або візуалізацію пропозиції
            </p>
            {formData.image ? (
              <div className="relative inline-block">
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="h-48 w-auto rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Натисніть або перетягніть зображення
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="mt-4 inline-block cursor-pointer"
                >
                  <Button type="button" variant="outline">
                    Вибрати файл
                  </Button>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Правила */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            Важливо знати
          </h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>• Петиція має стосуватися питань місцевого значення</li>
            <li>
              • Забороняються образи, заклики до насильства та дискримінація
            </li>
            <li>
              • Адміністрація залишає за собою право відхилити петиції, що
              порушують правила
            </li>
            <li>
              • Автор петиції несе відповідальність за достовірність викладеної
              інформації
            </li>
          </ul>
          <div className="mt-4 flex items-start">
            <input
              type="checkbox"
              id="agree"
              required
              className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="agree" className="ml-2 text-sm text-yellow-900">
              Я підтверджую, що ознайомився з правилами створення петицій та
              зобов'язуюсь їх дотримуватись *
            </label>
          </div>
        </div>

        {/* Кнопки дій */}
        <div className="flex justify-end gap-4">
          <Link href="/petitions">
            <Button type="button" variant="outline">
              Скасувати
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Створення..." : "Створити петицію"}
          </Button>
        </div>
      </form>
    </div>
  );
}
