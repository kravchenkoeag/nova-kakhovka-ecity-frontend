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
              ������� ��������� ��� ���������� ����� � ���
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">������</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/groups" className="hover:text-white">�����</Link></li>
              <li><Link href="/events" className="hover:text-white">��䳿</Link></li>
              <li><Link href="/announcements" className="hover:text-white">����������</Link></li>
              <li><Link href="/petitions" className="hover:text-white">�������</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">��������</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">��� ���</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white">��������</Link></li>
              <li><Link href="/support" className="hover:text-white">ϳ�������</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">������� ����������</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white">����� ������������</Link></li>
              <li><Link href="/privacy" className="hover:text-white">������� ���������������</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Nova Kakhovka e-City. �� ����� �������.</p>
        </div>
      </div>
    </footer>
  );
}
