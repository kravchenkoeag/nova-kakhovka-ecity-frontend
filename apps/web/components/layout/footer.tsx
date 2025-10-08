// apps/web/components/layout/footer.tsx

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              Nova Kakhovka e-City
            </h3>
            <p className="text-sm">
              Цифрова платформа для покращення життя в місті
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Розділи</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/groups" className="hover:text-white">Групи</Link></li>
              <li><Link href="/events" className="hover:text-white">Події</Link></li>
              <li><Link href="/announcements" className="hover:text-white">Оголошення</Link></li>
              <li><Link href="/petitions" className="hover:text-white">Петиції</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Допомога</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">Про нас</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white">Контакти</Link></li>
              <li><Link href="/support" className="hover:text-white">Підтримка</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Правова інформація</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white">Умови використання</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Політика конфіденційності</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Nova Kakhovka e-City. Всі права захищені.</p>
        </div>
      </div>
    </footer>
  );
}
