// apps/web/app/(main)/petitions/create/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreatePetition } from "@/hooks/usePetitions";
import { Button } from "@ecity/ui";
import { FileText, Upload, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { CreatePetitionRequest } from "@ecity/types";

/**
 * Сторінка створення нової петиції
 * Дозволяє користувачам створювати петиції для міської влади
 *
 * Використовує:
 * - useCreatePetition hook для відправки на API
 * - CreatePetitionRequest type для валідації
 */
export default function CreatePetitionPage() {
  const router = useRouter();
  const createPetition = useCreatePetition();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    required_signatures: 100,
    demands: "",
    end_date: "",
    tags: [] as string[],
    attachment_urls: [] as string[],
  });

  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [agreeToRules, setAgreeToRules] = useState(false);

  /**
   * Обробник відправки форми
   * Валідує дані та надсилає на backend через useCreatePetition
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Клієнтська валідація
    if (!formData.title || formData.title.length < 10) {
      setError("Заголовок має містити мінімум 10 символів");
      return;
    }

    if (!formData.description || formData.description.length < 50) {
      setError("Опис має містити мінімум 50 символів");
      return;
    }

    if (!formData.category) {
      setError("Оберіть категорію петиції");
      return;
    }

    if (!formData.demands || formData.demands.length < 20) {
      setError("Вимоги мають містити мінімум 20 символів");
      return;
    }

    if (!formData.end_date) {
      setError("Вкажіть дату завершення збору підписів");
      return;
    }

    // Перевіряємо, що дата в майбутньому (мінімум 24 години)
    const endDate = new Date(formData.end_date);
    const minDate = new Date();
    minDate.setHours(minDate.getHours() + 24);

    if (endDate < minDate) {
      setError("Дата завершення має бути щонайменше через 24 години від зараз");
      return;
    }

    if (!agreeToRules) {
      setError("Необхідно підтвердити згоду з правилами");
      return;
    }

    try {
      // Формуємо дані для відправки
      const petitionData: CreatePetitionRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        required_signatures: formData.required_signatures,
        demands: formData.demands.trim(),
        end_date: new Date(formData.end_date).toISOString(),
        tags: formData.tags,
        attachment_urls: formData.attachment_urls,
      };

      console.log("Submitting petition:", petitionData);

      // Відправляємо на backend через mutation hook
      const result = await createPetition.mutateAsync(petitionData);

      console.log("Petition created successfully:", result);

      // Перенаправляємо на сторінку зі списком петицій
      router.push("/petitions");
    } catch (err: any) {
      console.error("Error creating petition:", err);

      // Обробка помилок від backend
      if (err?.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError("Помилка при створенні петиції. Спробуйте пізніше.");
      }
    }
  };

  /**
   * Додає тег до списку
   */
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, trimmedTag],
      });
      setTagInput("");
    }
  };

  /**
   * Видаляє тег зі списку
   */
  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  /**
   * Обробляє завантаження зображення
   * TODO: Додати реальне завантаження на сервер/CDN
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Перевірка розміру файлу (макс 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Розмір файлу не повинен перевищувати 5MB");
        return;
      }

      // Перевірка типу файлу
      if (!file.type.startsWith("image/")) {
        setError("Можна завантажувати тільки зображення");
        return;
      }

      setImage(file);

      // TODO: Завантажити файл на сервер та отримати URL
      // Тимчасово просто зберігаємо файл локально
      console.log("Image selected:", file.name);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  /**
   * Мінімальна дата для вибору (завтра)
   */
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
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

      {/* Помилка */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Помилка</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Інформаційний блок */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Як працюють петиції?
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Створіть петицію з чіткими вимогами до міської влади</li>
          <li>• Зберіть необхідну кількість підписів (мінімум 100)</li>
          <li>• При досягненні мети петиція буде розглянута офіційно</li>
          <li>• Ви отримаєте офіційну відповідь від міської влади</li>
        </ul>
      </div>

      {/* Форма створення петиції */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Заголовок */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Заголовок петиції *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Наприклад: Ремонт доріг у центрі міста"
            required
            minLength={10}
            maxLength={300}
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.title.length}/300 символів (мінімум 10)
          </p>
        </div>

        {/* Категорія */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Категорія *
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          >
            <option value="">Оберіть категорію</option>
            <option value="infrastructure">Інфраструктура</option>
            <option value="social">Соціальні питання</option>
            <option value="environment">Екологія</option>
            <option value="economy">Економіка</option>
            <option value="governance">Управління містом</option>
            <option value="safety">Безпека</option>
            <option value="transport">Транспорт</option>
            <option value="education">Освіта</option>
            <option value="healthcare">Охорона здоров'я</option>
          </select>
        </div>

        {/* Опис */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Опис проблеми *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Детально опишіть проблему, її актуальність та вплив на життя громади..."
            required
            minLength={50}
            maxLength={5000}
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.description.length}/5000 символів (мінімум 50)
          </p>
        </div>

        {/* Вимоги */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <label
            htmlFor="demands"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Конкретні вимоги *
          </label>
          <textarea
            id="demands"
            value={formData.demands}
            onChange={(e) =>
              setFormData({ ...formData, demands: e.target.value })
            }
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="1. Що саме має бути зроблено?&#10;2. У який термін?&#10;3. Які ресурси потрібні?"
            required
            minLength={20}
            maxLength={2000}
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.demands.length}/2000 символів (мінімум 20)
          </p>
        </div>

        {/* Параметри збору підписів */}
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Параметри збору підписів
          </h3>

          {/* Кількість підписів */}
          <div>
            <label
              htmlFor="required_signatures"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Необхідна кількість підписів *
            </label>
            <input
              type="number"
              id="required_signatures"
              value={formData.required_signatures}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  required_signatures: parseInt(e.target.value) || 100,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              min="100"
              step="100"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Мінімум 100 підписів. Рекомендується: 500-1000 для локальних
              питань
            </p>
          </div>

          {/* Дата завершення */}
          <div>
            <label
              htmlFor="end_date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Дата завершення збору підписів *
            </label>
            <input
              type="date"
              id="end_date"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              min={getMinDate()}
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Мінімум через 24 години від зараз. Рекомендується: 30-90 днів
            </p>
          </div>
        </div>

        {/* Теги */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Теги (необов'язково)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Додайте тег і натисніть Enter"
            />
            <Button type="button" onClick={addTag} variant="outline">
              Додати
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:text-primary-dark"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Зображення */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Зображення (необов'язково)
          </label>
          {image ? (
            <div className="relative inline-block">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="h-48 w-auto rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Завантажте зображення для петиції
              </p>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG до 5MB</p>
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
            <li>
              • Петиція створюється як чернетка і може бути опублікована пізніше
            </li>
          </ul>
          <div className="mt-4 flex items-start">
            <input
              type="checkbox"
              id="agree"
              checked={agreeToRules}
              onChange={(e) => setAgreeToRules(e.target.checked)}
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
            <Button
              type="button"
              variant="outline"
              disabled={createPetition.isPending}
            >
              Скасувати
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={createPetition.isPending || !agreeToRules}
          >
            {createPetition.isPending ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Створення...
              </>
            ) : (
              "Створити петицію"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
