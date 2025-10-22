// apps/web/app/(main)/polls/create/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@ecity/ui";
import { BarChart3, Plus, X, Calendar } from "lucide-react";
import Link from "next/link";

/**
 * Сторінка створення нового опитування
 * Дозволяє користувачам створювати опитування для мешканців міста
 */
export default function CreatePollPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    endDate: "",
    allowMultiple: false,
    isAnonymous: true,
  });

  const [options, setOptions] = useState<string[]>(["", ""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валідація опцій
    const validOptions = options.filter((opt) => opt.trim() !== "");
    if (validOptions.length < 2) {
      alert("Додайте принаймні 2 варіанти відповіді");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Надіслати дані на API
      console.log("Creating poll:", { ...formData, options: validOptions });

      // Симуляція запиту
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Перенаправлення на сторінку опитувань
      router.push("/polls");
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Помилка при створенні опитування");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
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
            <Link href="/polls" className="text-gray-500 hover:text-gray-700">
              Опитування
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">Створити опитування</li>
        </ol>
      </nav>

      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Створити опитування
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Дізнайтесь думку мешканців міста з важливих питань
        </p>
      </div>

      {/* Форма створення опитування */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Основна інформація */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Основна інформація
            </h2>

            {/* Назва опитування */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Питання опитування *
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
                placeholder="Наприклад: Який парк потребує реконструкції в першу чергу?"
              />
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
                <option value="transport">Транспорт</option>
                <option value="ecology">Екологія</option>
                <option value="education">Освіта</option>
                <option value="culture">Культура</option>
                <option value="sport">Спорт</option>
                <option value="social">Соціальні питання</option>
                <option value="other">Інше</option>
              </select>
            </div>

            {/* Опис */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Додатковий опис (опціонально)
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Додайте контекст або пояснення до опитування..."
              />
            </div>

            {/* ⚠️ ВИПРАВЛЕННЯ Tailwind CSS конфлікту:
                Видалено конфліктуючі класи 'block' та 'flex'.
                Використовуємо чистий 'flex' для inline layout без конфліктів. */}
            <div className="flex items-center gap-6">
              {/* Дата закінчення */}
              <div className="flex-1">
                <label
                  htmlFor="endDate"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Дата закінчення (опціонально)
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Варіанти відповідей */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Варіанти відповідей
          </h2>

          <div className="space-y-4">
            {options.map((option, index) => (
              <div key={index}>
                {/* ⚠️ ВИПРАВЛЕННЯ Tailwind CSS конфлікту:
                    Видалено конфліктуючі класи 'block' та 'flex'.
                    Використовуємо чистий 'flex' для inline layout без конфліктів. */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 w-8">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    required
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`Варіант ${index + 1}`}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Видалити варіант"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addOption}
            className="mt-4 w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Додати варіант
          </Button>
        </div>

        {/* Налаштування */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Налаштування
          </h2>

          <div className="space-y-4">
            {/* Множинний вибір */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="allowMultiple"
                checked={formData.allowMultiple}
                onChange={(e) =>
                  setFormData({ ...formData, allowMultiple: e.target.checked })
                }
                className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="allowMultiple" className="ml-3">
                <span className="text-sm font-medium text-gray-900">
                  Дозволити вибір декількох варіантів
                </span>
                <p className="text-sm text-gray-500">
                  Користувачі зможуть обрати більше одного варіанту відповіді
                </p>
              </label>
            </div>

            {/* Анонімне голосування */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="isAnonymous"
                checked={formData.isAnonymous}
                onChange={(e) =>
                  setFormData({ ...formData, isAnonymous: e.target.checked })
                }
                className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="isAnonymous" className="ml-3">
                <span className="text-sm font-medium text-gray-900">
                  Анонімне голосування
                </span>
                <p className="text-sm text-gray-500">
                  Результати голосування не будуть пов'язані з конкретними
                  користувачами
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Кнопки дій */}
        <div className="flex justify-end gap-4">
          <Link href="/polls">
            <Button type="button" variant="outline">
              Скасувати
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Створення..." : "Створити опитування"}
          </Button>
        </div>
      </form>
    </div>
  );
}
