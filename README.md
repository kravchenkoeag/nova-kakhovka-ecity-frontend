# Nova Kakhovka e-City - Frontend

Повний монорепозиторій фронтенду для платформи Nova Kakhovka e-City, що включає адмін панель та користувацький веб-інтерфейс.

## 🏗️ Архітектура

```
nova-kakhovka-ecity-frontend/
├── apps/
│   ├── admin/                  # Адмін панель (модератори)
│   │   ├── app/
│   │   │   ├── (auth)/        # Авторизація
│   │   │   │   └── login/
│   │   │   ├── (dashboard)/   # Основний інтерфейс
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── users/     # Управління користувачами
│   │   │   │   ├── groups/    # Управління групами
│   │   │   │   ├── events/    # Управління подіями
│   │   │   │   ├── announcements/  # Модерація оголошень
│   │   │   │   ├── petitions/ # Петиції
│   │   │   │   ├── polls/     # Опитування
│   │   │   │   ├── city-issues/  # Проблеми міста
│   │   │   │   ├── transport/ # Транспорт
│   │   │   │   └── notifications/  # Сповіщення
│   │   │   └── api/           # API routes (proxy)
│   │   ├── components/        # React компоненти
│   │   ├── lib/               # Утиліти та хелпери
│   │   └── middleware.ts      # Захист маршрутів
│   │
│   └── web/                    # Користувацький інтерфейс
│       ├── app/
│       │   ├── (auth)/
│       │   │   ├── login/
│       │   │   └── register/
│       │   ├── (main)/
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx   # Головна сторінка
│       │   │   ├── profile/   # Профіль користувача
│       │   │   ├── groups/    # Групи та чати
│       │   │   ├── events/    # Події
│       │   │   ├── announcements/  # Оголошення
│       │   │   ├── petitions/ # Петиції
│       │   │   ├── polls/     # Опитування
│       │   │   ├── city-issues/  # Проблеми міста
│       │   │   └── transport/ # Громадський транспорт
│       │   └── api/           # API routes
│       ├── components/
│       ├── lib/
│       └── middleware.ts
│
├── packages/
│   ├── ui/                     # Спільні UI компоненти (shadcn/ui)
│   ├── api-client/             # Типізований API клієнт
│   ├── auth/                   # NextAuth.js конфігурація
│   ├── types/                  # TypeScript типи для всього проєкту
│   ├── websocket/              # WebSocket клієнт для real-time
│   └── config/                 # Спільні конфігурації
│
├── package.json                # Root package.json (Turborepo)
├── turbo.json                  # Turborepo конфігурація
├── pnpm-workspace.yaml         # pnpm workspace конфігурація
└── .gitignore
```

## 🚀 Швидкий старт

### Передумови

**Обов'язкові вимоги:**
- **Node.js** >= 18.0.0 (рекомендовано 20.x LTS)
- **pnpm** >= 8.0.0 (рекомендовано) або npm >= 9.0.0
- **Backend** запущений на `http://localhost:8080`
- **MongoDB** запущений та налаштований
- **Git** для клонування репозиторію

**Перевірка версій:**
```bash
node --version      # повинно бути >= 18.0.0
pnpm --version      # повинно бути >= 8.0.0
```

### Крок 1: Клонування репозиторію

```bash
git clone https://github.com/your-org/nova-kakhovka-ecity-frontend.git
cd nova-kakhovka-ecity-frontend
```

### Крок 2: Встановлення pnpm (якщо потрібно)

**Через npm:**
```bash
npm install -g pnpm
```

**Через Homebrew (macOS):**
```bash
brew install pnpm
```

**Через скрипт (Linux/macOS):**
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Крок 3: Встановлення залежностей

```bash
# Встановити всі залежності для монорепозиторію
pnpm install

# Це встановить залежності для:
# - apps/admin
# - apps/web
# - всіх packages (ui, api-client, auth, types, websocket)
```

### Крок 4: Налаштування змінних оточення

#### 4.1. Адмін панель (`apps/admin/.env.local`)

Створіть файл `apps/admin/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
BACKEND_URL=http://localhost:8080

# NextAuth Configuration
NEXTAUTH_SECRET=change-this-to-random-string-for-production-admin-panel-32chars
NEXTAUTH_URL=http://localhost:3001

# WebSocket Configuration
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws

# Optional: для production
# NEXTAUTH_URL=https://admin.nova-kakhovka-ecity.com
# NEXT_PUBLIC_API_URL=https://api.nova-kakhovka-ecity.com
# NEXT_PUBLIC_WS_URL=wss://api.nova-kakhovka-ecity.com/ws
```

#### 4.2. Веб-додаток (`apps/web/.env.local`)

Створіть файл `apps/web/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
BACKEND_URL=http://localhost:8080

# NextAuth Configuration
NEXTAUTH_SECRET=change-this-to-random-string-for-production-web-app-32chars
NEXTAUTH_URL=http://localhost:3000

# WebSocket Configuration
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws

# Optional: Google Maps API (для карт)
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

# Optional: Firebase (для push notifications)
# NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

**⚠️ ВАЖЛИВО: Генерація NEXTAUTH_SECRET**

Для production обов'язково згенеруйте надійний секретний ключ:

```bash
# Генерація випадкового ключа
openssl rand -base64 32

# Або через Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Крок 5: Запуск backend (окремо)

**Переконайтесь, що backend запущений:**

```bash
# Якщо backend в окремому репозиторії
cd ../nova-kakhovka-ecity-backend
go run main.go

# Backend повинен бути доступний на http://localhost:8080
```

### Крок 6: Запуск frontend

#### Варіант 1: Запустити всі додатки одночасно

```bash
pnpm dev
```

Це запустить:
- **Адмін панель** на http://localhost:3001
- **Веб-додаток** на http://localhost:3000

#### Варіант 2: Запустити окремо

```bash
# Тільки адмін панель
pnpm dev:admin      # → http://localhost:3001

# Тільки веб-додаток
pnpm dev:web        # → http://localhost:3000
```

### Крок 7: Перший вхід

#### Для адмін панелі (http://localhost:3001/login):
```
Email: moderator@example.com
Password: moderator123
```

#### Для веб-додатку (http://localhost:3000/login):
```
Email: test@example.com
Password: password123
```

**Або створіть новий акаунт:**
- Перейдіть на `/register`
- Заповніть форму реєстрації
- Після реєстрації увійдіть через `/login`

## 📦 Доступні команди

### Розробка

```bash
# Запустити всі додатки в dev режимі
pnpm dev

# Запустити тільки адмін панель
pnpm dev:admin

# Запустити тільки веб-додаток
pnpm dev:web
```

### Білд (Production)

```bash
# Зібрати всі додатки
pnpm build

# Зібрати окремо
pnpm build:admin
pnpm build:web

# Запустити production білд локально
pnpm start:admin      # після pnpm build:admin
pnpm start:web        # після pnpm build:web
```

### Перевірка коду

```bash
# Lint (ESLint)
pnpm lint              # Перевірка всіх додатків
pnpm lint:admin        # Тільки адмін панель
pnpm lint:web          # Тільки веб-додаток

# Type checking (TypeScript)
pnpm type-check        # Перевірка типів у всьому проєкті

# Форматування (Prettier)
pnpm format            # Відформатувати всі файли
pnpm format:check      # Тільки перевірити без змін
```

### Тестування

```bash
# Unit тести (якщо налаштовані)
pnpm test

# E2E тести (якщо налаштовані)
pnpm test:e2e
```

### Очищення

```bash
# Видалити node_modules та lock файли
pnpm clean

# Видалити також .next та dist папки
pnpm clean:all
```

### Інші корисні команди

```bash
# Оновити залежності
pnpm update

# Перевірити застарілі пакети
pnpm outdated

# Додати нову залежність до конкретного додатку
pnpm --filter admin add <package-name>
pnpm --filter web add <package-name>

# Додати в shared package
pnpm --filter @ecity/ui add <package-name>
```

## 🔐 Авторизація та безпека

### Тестові акаунти

**Модератор (адмін панель):**
```
Email: moderator@example.com
Password: moderator123
Роль: MODERATOR
```

**Звичайний користувач:**
```
Email: test@example.com
Password: password123
Роль: USER
```

### Створення нового акаунта

1. **Веб-додаток** - перейдіть на http://localhost:3000/register
2. Заповніть форму:
   - Ім'я користувача (username)
   - Email
   - Пароль (мінімум 8 символів)
   - Телефон (опційно)
3. Після реєстрації увійдіть через `/login`

### Як працює авторизація

- **NextAuth.js** для управління сесіями
- **JWT токени** зберігаються в httpOnly cookies
- **Middleware** перевіряє авторизацію на server-side
- **Protected routes** автоматично редиректять на `/login`
- **API routes** використовують proxy для приховування токенів

### Захищені маршрути

```typescript
// Автоматично захищені маршрути:
// Admin: /dashboard/*
// Web: /profile, /groups, /events тощо

// middleware.ts приклад:
export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"]
}
```

## 🛠️ Технології

### Core Technologies

- **[Next.js 14](https://nextjs.org/)** - React фреймворк з App Router
  - Server Components
  - API Routes
  - Middleware
  - Image Optimization
- **[TypeScript 5](https://www.typescriptlang.org/)** - Типізація
- **[Turborepo](https://turbo.build/)** - Монорепозиторій
- **[pnpm](https://pnpm.io/)** - Швидкий пакетний менеджер

### UI/UX Libraries

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Компоненти на базі Radix UI
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI примітиви
- **[Lucide React](https://lucide.dev/)** - Іконки
- **[Recharts](https://recharts.org/)** - Графіки для адмін панелі
- **[Leaflet](https://leafletjs.com/)** - Інтерактивні карти
- **[React Leaflet](https://react-leaflet.js.org/)** - React wrapper для Leaflet

### State Management & Data Fetching

- **[TanStack Query (React Query)](https://tanstack.com/query)** - Кешування даних
  - Автоматичне оновлення
  - Оптимістичні оновлення
  - Pagination та infinite scroll
- **[Zustand](https://github.com/pmndrs/zustand)** - Легкий state management
- **[NextAuth.js](https://next-auth.js.org/)** - Авторизація

### Forms & Validation

- **[React Hook Form](https://react-hook-form.com/)** - Керування формами
- **[Zod](https://zod.dev/)** - Schema валідація
- **[date-fns](https://date-fns.org/)** - Робота з датами

### Real-time & API

- **[WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)** - Real-time комунікація
- **[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)** - HTTP запити
- Custom API Client з типізацією

### Development Tools

- **[ESLint](https://eslint.org/)** - Linting
- **[Prettier](https://prettier.io/)** - Форматування коду
- **[Husky](https://typicode.github.io/husky/)** - Git hooks (опційно)

## 📁 Детальна структура проєкту

### apps/admin - Адмін панель

```
apps/admin/
├── app/
│   ├── (auth)/                      # Роути без layout
│   │   └── login/
│   │       ├── page.tsx             # Сторінка логіну
│   │       └── layout.tsx           # Мінімальний layout
│   │
│   ├── (dashboard)/                 # Роути з dashboard layout
│   │   ├── layout.tsx               # Sidebar + Header
│   │   ├── page.tsx                 # Dashboard home
│   │   │
│   │   ├── users/                   # Управління користувачами
│   │   │   ├── page.tsx             # Список користувачів
│   │   │   ├── [id]/                # Деталі користувача
│   │   │   │   ├── page.tsx
│   │   │   │   └── edit/page.tsx
│   │   │   └── components/          # Локальні компоненти
│   │   │
│   │   ├── groups/                  # Управління групами
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── create/page.tsx
│   │   │
│   │   ├── events/                  # Події
│   │   ├── announcements/           # Оголошення
│   │   ├── petitions/               # Петиції
│   │   ├── polls/                   # Опитування
│   │   ├── city-issues/             # Проблеми міста
│   │   ├── transport/               # Транспорт
│   │   └── notifications/           # Сповіщення
│   │
│   └── api/                         # API Routes
│       ├── auth/[...nextauth]/      # NextAuth
│       └── proxy/                   # Backend proxy
│
├── components/                      # React компоненти
│   ├── ui/                          # shadcn/ui компоненти
│   ├── layout/                      # Layout компоненти
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── dashboard/                   # Dashboard компоненти
│   │   ├── StatsCard.tsx
│   │   ├── RecentActivity.tsx
│   │   └── Charts.tsx
│   └── shared/                      # Спільні компоненти
│
├── lib/                             # Утиліти
│   ├── api.ts                       # API клієнт
│   ├── auth.ts                      # Auth конфігурація
│   ├── utils.ts                     # Допоміжні функції
│   └── constants.ts                 # Константи
│
├── hooks/                           # Custom hooks
│   ├── useAuth.ts
│   ├── useUsers.ts
│   └── useWebSocket.ts
│
├── types/                           # Локальні типи
├── styles/                          # Глобальні стилі
│   └── globals.css
├── public/                          # Статичні файли
├── middleware.ts                    # Route protection
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### apps/web - Користувацький інтерфейс

```
apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── (main)/
│   │   ├── layout.tsx               # Header + Footer
│   │   ├── page.tsx                 # Головна сторінка
│   │   │
│   │   ├── profile/                 # Профіль
│   │   │   ├── page.tsx
│   │   │   ├── edit/page.tsx
│   │   │   └── settings/page.tsx
│   │   │
│   │   ├── groups/                  # Групи та чати
│   │   │   ├── page.tsx             # Список груп
│   │   │   ├── [id]/                # Деталі групи
│   │   │   │   ├── page.tsx
│   │   │   │   └── chat/page.tsx    # WebSocket чат
│   │   │   └── my/page.tsx          # Мої групи
│   │   │
│   │   ├── events/                  # Події
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── calendar/page.tsx
│   │   │
│   │   ├── announcements/           # Оголошення
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── create/page.tsx
│   │   │
│   │   ├── petitions/               # Петиції
│   │   ├── polls/                   # Опитування
│   │   ├── city-issues/             # Проблеми міста
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   ├── create/page.tsx
│   │   │   └── map/page.tsx         # Карта проблем
│   │   │
│   │   └── transport/               # Транспорт
│   │       ├── page.tsx
│   │       └── map/page.tsx         # Карта транспорту
│   │
│   └── api/
│       └── auth/[...nextauth]/
│
├── components/                      # Аналогічно admin
├── lib/
├── hooks/
├── types/
├── styles/
├── public/
├── middleware.ts
└── package.json
```

### packages/ - Спільні пакети

```
packages/
├── ui/                              # Спільні UI компоненти
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── api-client/                      # Типізований API клієнт
│   ├── src/
│   │   ├── client.ts                # Базовий клієнт
│   │   ├── users.ts                 # Users API
│   │   ├── groups.ts                # Groups API
│   │   ├── events.ts                # Events API
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── auth/                            # NextAuth конфігурація
│   ├── src/
│   │   ├── config.ts
│   │   ├── providers.ts
│   │   └── index.ts
│   └── package.json
│
├── types/                           # Спільні TypeScript типи
│   ├── src/
│   │   ├── user.ts
│   │   ├── group.ts
│   │   ├── event.ts
│   │   ├── api.ts
│   │   └── index.ts
│   └── package.json
│
├── websocket/                       # WebSocket клієнт
│   ├── src/
│   │   ├── client.ts
│   │   ├── hooks.ts
│   │   └── index.ts
│   └── package.json
│
└── config/                          # Спільні конфігурації
    ├── eslint-config/
    ├── typescript-config/
    └── tailwind-config/
```

## 🌐 API Endpoints (Backend)

### Авторизація
- `POST /api/register` - Реєстрація
- `POST /api/login` - Логін
- `POST /api/logout` - Вихід
- `GET /api/me` - Поточний користувач

### Користувачі
- `GET /api/users` - Список користувачів
- `GET /api/users/:id` - Деталі користувача
- `PUT /api/users/:id` - Оновлення профілю
- `DELETE /api/users/:id` - Видалення (admin)

### Групи
- `GET /api/groups` - Список груп
- `POST /api/groups` - Створити групу
- `GET /api/groups/:id` - Деталі групи
- `PUT /api/groups/:id` - Оновити групу
- `DELETE /api/groups/:id` - Видалити групу
- `POST /api/groups/:id/join` - Приєднатися
- `POST /api/groups/:id/leave` - Покинути

### Події
- `GET /api/events` - Список подій
- `POST /api/events` - Створити подію
- `GET /api/events/:id` - Деталі події
- `PUT /api/events/:id` - Оновити подію
- `DELETE /api/events/:id` - Видалити подію

### Оголошення
- `GET /api/announcements` - Список оголошень
- `POST /api/announcements` - Створити оголошення
- `GET /api/announcements/:id` - Деталі оголошення
- `PUT /api/announcements/:id` - Оновити
- `DELETE /api/announcements/:id` - Видалити

### Петиції
- `GET /api/petitions` - Список петицій
- `POST /api/petitions` - Створити петицію
- `GET /api/petitions/:id` - Деталі петиції
- `POST /api/petitions/:id/sign` - Підписати петицію

### Опитування
- `GET /api/polls` - Список опитувань
- `POST /api/polls` - Створити опитування
- `GET /api/polls/:id` - Деталі опитування
- `POST /api/polls/:id/vote` - Проголосувати

### Проблеми міста
- `GET /api/city-issues` - Список проблем
- `POST /api/city-issues` - Повідомити проблему
- `GET /api/city-issues/:id` - Деталі проблеми
- `PUT /api/city-issues/:id/status` - Оновити статус (admin)

### Транспорт
- `GET /api/transport/routes` - Маршрути транспорту
- `GET /api/transport/live` - Поточне місцезнаходження

### WebSocket
- `ws://localhost:8080/ws` - Real-time чат та сповіщення

## 🚦 Поради щодо розробки

### Вибір IDE

**VS Code** (рекомендовано):
- Легкий та швидкий
- Чудова підтримка TypeScript
- Великий вибір розширень
- Безкоштовний

**Рекомендовані розширення:**
```
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Path Intellisense
```

**WebStorm:**
- Потужніший з коробки
- Краща рефакторинг підтримка
- Вбудований термінал та Git
- Платний (безкоштовний для студентів)

### Best Practices

1. **Використовуйте TypeScript типи:**
```typescript
import type { User } from '@ecity/types'

const user: User = await fetchUser(id)
```

2. **Server Components за замовчуванням:**
```typescript
// app/page.tsx - Server Component
export default async function Page() {
  const data = await fetchData() // виконується на сервері
  return <div>{data}</div>
}
```

3. **'use client' тільки коли потрібно:**
```typescript
'use client' // для useState, useEffect, event handlers

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

4. **React Query для даних:**
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
})
```

## 🐛 Troubleshooting

### Проблема: Port already in use

```bash
# Знайти процес на порту 3000 або 3001
lsof -i :3000

# Вбити процес
kill -9 <PID>

# Або змінити порт в package.json
"dev": "next dev -p 3002"
```

### Проблема: Module not found

```bash
# Очистити кеш та переінсталювати
pnpm clean
pnpm install

# Або
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Проблема: Backend connection refused

Переконайтесь що:
1. Backend запущений на правильному порту
2. MongoDB запущений
3. Змінні оточення правильні
4. Немає CORS помилок (перевірте в DevTools)

### Проблема: NextAuth session не працює

```bash
# Перевірте NEXTAUTH_SECRET
echo $NEXTAUTH_SECRET

# Згенеруйте новий
openssl rand -base64 32

# Очистити cookies та спробувати знову
```

## 📚 Додаткові ресурси

### Документація
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [NextAuth.js](https://next-auth.js.org/)

### Корисні посилання
- [Turborepo Handbook](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [React Hook Form](https://react-hook-form.com/get-started)
- [Zod Validation](https://zod.dev/)

## 🔄 Workflow розробки

### 1. Створення нової фічі

```bash
# Створити нову гілку
git checkout -b feature/new-feature-name

# Розробка з hot reload
pnpm dev

# Коміт змін
git add .
git commit -m "feat: add new feature"

# Push
git push origin feature/new-feature-name
```

### 2. Додавання нового компонента

```bash
# Якщо компонент специфічний для додатку
apps/web/components/MyComponent.tsx

# Якщо компонент спільний
packages/ui/components/MyComponent.tsx
```

### 3. Додавання нового API endpoint

```typescript
// packages/api-client/src/myEndpoint.ts
import { apiClient } from './client'
import type { MyData } from '@ecity/types'

export async function getMyData(): Promise<MyData[]> {
  const response = await apiClient.get('/api/my-data')
  return response.data
}

// Використання в компоненті
import { useQuery } from '@tanstack/react-query'
import { getMyData } from '@ecity/api-client'

export function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['myData'],
    queryFn: getMyData,
  })
  
  if (isLoading) return <div>Loading...</div>
  return <div>{JSON.stringify(data)}</div>
}
```

### 4. Додавання нового типу

```typescript
// packages/types/src/myType.ts
export interface MyData {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

// packages/types/src/index.ts
export * from './myType'
```

## 🚀 Deployment

### Vercel (рекомендовано для Next.js)

**Автоматичний deployment:**

1. Підключіть GitHub репозиторій до Vercel
2. Налаштуйте Root Directory для кожного додатку:
   - Admin: `apps/admin`
   - Web: `apps/web`
3. Додайте змінні оточення в Vercel Dashboard
4. Deploy автоматично при push до main

**Вручну через CLI:**

```bash
# Встановити Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy admin
cd apps/admin
vercel --prod

# Deploy web
cd apps/web
vercel --prod
```

### Docker

**Створити Dockerfile для admin:**

```dockerfile
# apps/admin/Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/admin/package.json ./apps/admin/
COPY packages ./packages
RUN pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build:admin

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/apps/admin/.next ./apps/admin/.next
COPY --from=builder /app/apps/admin/public ./apps/admin/public
COPY --from=builder /app/apps/admin/package.json ./apps/admin/
EXPOSE 3001
CMD ["pnpm", "--filter", "admin", "start"]
```

**Docker Compose:**

```yaml
# docker-compose.yml
version: '3.8'

services:
  admin:
    build:
      context: .
      dockerfile: apps/admin/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8080
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=https://admin.yourdomain.com
    depends_on:
      - backend

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8080
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=https://yourdomain.com
    depends_on:
      - backend

  backend:
    image: your-backend-image:latest
    ports:
      - "8080:8080"
    environment:
      - MONGO_URI=${MONGO_URI}
    depends_on:
      - mongodb

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

**Запуск через Docker:**

```bash
# Build
docker-compose build

# Run
docker-compose up -d

# Logs
docker-compose logs -f

# Stop
docker-compose down
```

### AWS / VPS

**Nginx конфігурація:**

```nginx
# /etc/nginx/sites-available/ecity

# Admin панель
server {
    listen 80;
    server_name admin.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Веб-додаток
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# WebSocket
server {
    listen 80;
    server_name ws.yourdomain.com;

    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

**PM2 для запуску додатків:**

```bash
# Встановити PM2
npm install -g pm2

# Запустити додатки
pm2 start pnpm --name "ecity-admin" -- --filter admin start
pm2 start pnpm --name "ecity-web" -- --filter web start

# Зберегти конфігурацію
pm2 save

# Автозапуск при перезавантаженні
pm2 startup
```

## 🔒 Безпека

### Checklist перед production

- [ ] Змінити всі `NEXTAUTH_SECRET` на випадкові значення
- [ ] Використовувати HTTPS (SSL сертифікати)
- [ ] Налаштувати CORS правильно
- [ ] Увімкнути Rate Limiting на backend
- [ ] Валідувати всі user inputs (Zod)
- [ ] Санітизувати HTML контент
- [ ] Використовувати CSP (Content Security Policy)
- [ ] Налаштувати proper error handling (не показувати stack traces)
- [ ] Увімкнути audit logging
- [ ] Регулярні бекапи MongoDB
- [ ] Monitoring та alerting
- [ ] DDoS protection (Cloudflare)

### Environment Variables Security

**НІКОЛИ не коммітьте:**
- `.env.local`
- `.env.production.local`
- Будь-які файли з паролями/ключами

**Використовуйте:**
- `.env.example` - шаблон без реальних значень
- Secret management (Vercel Secrets, AWS Secrets Manager)
- Environment-specific конфіги

```bash
# .env.example
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXTAUTH_SECRET=change-me-in-production
NEXTAUTH_URL=http://localhost:3000
```

## 📊 Моніторинг та аналітика

### Налаштування Sentry (Error Tracking)

```bash
# Встановити Sentry
pnpm add @sentry/nextjs --filter admin
pnpm add @sentry/nextjs --filter web
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```

### Google Analytics

```typescript
// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}
```

## 🧪 Тестування

### Unit Tests (Jest + React Testing Library)

```bash
# Встановити залежності
pnpm add -D jest @testing-library/react @testing-library/jest-dom
```

```typescript
// components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### E2E Tests (Playwright)

```bash
# Встановити Playwright
pnpm add -D @playwright/test
```

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('should login successfully', async ({ page }) => {
  await page.goto('http://localhost:3000/login')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('http://localhost:3000/profile')
})
```

## 🎨 Стилізація та теми

### Tailwind конфігурація

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... інші відтінки
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### Dark Mode

```typescript
// components/ThemeProvider.tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system">
      {children}
    </NextThemesProvider>
  )
}
```

## 📝 Git Workflow

### Naming Conventions

**Branches:**
- `feature/` - нові фічі
- `bugfix/` - виправлення багів
- `hotfix/` - критичні виправлення
- `refactor/` - рефакторинг
- `docs/` - документація

**Commits:**
```bash
feat: add user profile page
fix: resolve login redirect issue
refactor: improve API client structure
docs: update README with deployment instructions
style: format code with prettier
test: add unit tests for Button component
chore: update dependencies
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
```

## 🤝 Contributing

### Як зробити внесок

1. Fork репозиторій
2. Створіть feature branch (`git checkout -b feature/AmazingFeature`)
3. Зробіть commit (`git commit -m 'feat: add amazing feature'`)
4. Push до branch (`git push origin feature/AmazingFeature`)
5. Відкрийте Pull Request

### Code Style

Проєкт використовує:
- **ESLint** для JavaScript/TypeScript linting
- **Prettier** для форматування коду
- **TypeScript strict mode**

```bash
# Перевірити код перед commit
pnpm lint
pnpm type-check
pnpm format:check
```

## 📞 Підтримка

### Де отримати допомогу

- **GitHub Issues** - для багів та feature requests
- **GitHub Discussions** - для питань та обговорень
- **Email** - support@nova-kakhovka-ecity.com
- **Telegram** - [@ecity_support](https://t.me/ecity_support)

### Звітування про баги

Використовуйте [GitHub Issues](https://github.com/your-org/nova-kakhovka-ecity-frontend/issues) та включіть:

1. Опис проблеми
2. Кроки для відтворення
3. Очікувана та фактична поведінка
4. Скріншоти (якщо потрібно)
5. Версія браузера та OS
6. Console errors (якщо є)

## 📜 Ліцензія

Цей проєкт ліцензований під MIT License - дивіться файл [LICENSE](LICENSE) для деталей.

## 👥 Автори

- **Nova Kakhovka Development Team** - *Initial work*

## 🙏 Подяки

- [Next.js Team](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [shadcn](https://twitter.com/shadcn) за shadcn/ui
- [TanStack](https://tanstack.com/) за React Query
- Усім контриб'юторам проєкту

---

**Зроблено з ❤️ для громади Nova Kakhovka**

## 📅 Changelog

### [Unreleased]
- Початкова версія frontend
- Базова адмін панель
- Користувацький веб-інтерфейс
- NextAuth авторизація
- Real-time чат через WebSocket

### Заплановані фічі
- [ ] Push notifications через Firebase
- [ ] Покращена карта транспорту
- [ ] Інтеграція з міськими службами
- [ ] Мобільна версія (PWA)
- [ ] Темна тема
- [ ] Мультимовність (UK/RU/EN)
- [ ] Accessibility покращення
- [ ] Performance оптимізації

---

**Останнє оновлення:** Січень 2025