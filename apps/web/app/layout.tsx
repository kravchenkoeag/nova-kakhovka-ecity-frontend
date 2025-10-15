// apps/web/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Nova Kakhovka e-City',
  description: 'Електронна платформа для громади Нової Каховки',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}