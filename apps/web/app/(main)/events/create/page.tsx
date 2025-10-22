// apps/web/app/(main)/events/create/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@ecity/ui";
import { Calendar, MapPin, Users, Upload, X } from "lucide-react";
import Link from "next/link";

/**
 * Сторінка створення нової події
 * Дозволяє користувачам створювати події для міста
 */
export default function CreateEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    address: "",
    max_participants: "",
    image: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Надіслати дані на API
      console.log("Creating event:", formData);

      // Симуляція запиту
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Перенаправлення на сторінку подій
      router.push("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Помилка при створенні події");
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
            <Link href="/events" className="text-gray-500 hover:text-gray-700">
              Події
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">Створити подію</li>
        </ol>
      </nav>

      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="h-8 w-8" />
          Створити подію
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Організуйте захід для мешканців міста
        </p>
      </div>

      {/* Форма створення події */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Основна інформація */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Основна інформація
            </h2>

            {/* Назва події */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Назва події *
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
                placeholder="Наприклад: Фестиваль міста 2024"
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
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Опис події *
              </label>
              <textarea
                id="description"
                required
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Детально опишіть вашу подію, програму заходу, що потрібно мати з собою..."
              />
            </div>

            {/* ⚠️ ВИПРАВЛЕННЯ Tailwind CSS конфлікту:
                Видалено конфліктуючі класи 'block' та 'flex'.
                Використовуємо 'grid' для адаптивного layout без конфліктів. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Дата */}
              <div>
                <label
                  htmlFor="date"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Дата проведення *
                </label>
                <input
                  type="date"
                  id="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Час */}
              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Час початку *
                </label>
                <input
                  type="time"
                  id="time"
                  required
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Місце проведення */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Місце проведення
          </h2>

          {/* ⚠️ ВИПРАВЛЕННЯ Tailwind CSS конфлікту:
              Видалено конфліктуючі класи 'block' та 'flex'.
              Використовуємо 'grid' для адаптивного layout без конфліктів. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Назва локації */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Назва місця *
              </label>
              <input
                type="text"
                id="location"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Наприклад: Центральний парк"
              />
            </div>

            {/* Адреса */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Адреса *
              </label>
              <input
                type="text"
                id="address"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Наприклад: вул. Центральна, 1"
              />
            </div>
          </div>
        </div>

        {/* Додаткова інформація */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Додаткова інформація
          </h2>

          {/* Максимальна кількість учасників */}
          <div className="mb-6">
            <label
              htmlFor="max_participants"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Максимальна кількість учасників
            </label>
            <input
              type="number"
              id="max_participants"
              min="1"
              value={formData.max_participants}
              onChange={(e) =>
                setFormData({ ...formData, max_participants: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Залиште порожнім для необмеженої кількості"
            />
          </div>

          {/* Зображення */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Зображення події
            </label>
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

        {/* Кнопки дій */}
        <div className="flex justify-end gap-4">
          <Link href="/events">
            <Button type="button" variant="outline">
              Скасувати
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Створення..." : "Створити подію"}
          </Button>
        </div>
      </form>
    </div>
  );
}
