// apps/web/components/layout/footer.tsx

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

// Footer для веб-додатку
export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Про проект */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-sm font-bold text-white">NK</span>
              </div>
              <span className="text-xl font-bold text-white">
                Nova Kakhovka e-City
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              Електронна платформа для громади Нової Каховки. Об'єднуємо
              мешканців та створюємо простір для спілкування, вирішення проблем
              та розвитку міста.
            </p>
          </div>

          {/* Швидкі посилання */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Посилання
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-white transition-colors"
                >
                  Про проект
                </Link>
              </li>
              <li>
                <Link
                  href="/rules"
                  className="text-sm hover:text-white transition-colors"
                >
                  Правила
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm hover:text-white transition-colors"
                >
                  Конфіденційність
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm hover:text-white transition-colors"
                >
                  Умови використання
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакти */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Контакти
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>info@nk-ecity.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>+380 XX XXX XX XX</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Нова Каховка, Україна</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-sm text-center text-gray-400">
            © {new Date().getFullYear()} Nova Kakhovka e-City. Всі права
            захищені.
          </p>
        </div>
      </div>
    </footer>
  );
}
