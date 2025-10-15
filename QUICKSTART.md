# 🚀 Швидкий старт - Nova Kakhovka e-City Frontend

## Передумови

Переконайтесь, що у вас встановлено:

- **Node.js** >= 18.0.0 (рекомендовано 20.x LTS)
- **pnpm** >= 8.0.0
- **Git**

```bash
# Перевірка версій
node --version    # має бути >= 18.0.0
pnpm --version    # має бути >= 8.0.0
```

## Крок 1: Клонування репозиторію

```bash
git clone https://github.com/your-org/nova-kakhovka-ecity-frontend.git
cd nova-kakhovka-ecity-frontend
```

## Крок 2: Встановлення pnpm (якщо потрібно)

```bash
# Через npm
npm install -g pnpm

# Або через Homebrew (macOS)
brew install pnpm

# Або через скрипт (Linux/macOS)
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## Крок 3: Встановлення залежностей

```bash
pnpm install
```

Це встановить залежності для:
- apps/admin
- apps/web
- всіх packages (ui, api-client, auth, types)

## Крок 4: Налаштування змінних оточення

### Адмін панель

```bash
# Скопіюйте приклад
cp apps/admin/.env.example apps/admin/.env.local

# Відредагуйте apps/admin/.env.local
```

Мінімальна конфігурація:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
BACKEND_URL=http://localhost:8080
NEXTAUTH_SECRET=your-secret-key-here-min-32-chars
NEXTAUTH_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```

### Веб-додаток

```bash
# Скопіюйте приклад
cp apps/web/.env.example apps/web/.env.local

# Відредагуйте apps/web/.env.local
```

Мінімальна конфігурація:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
BACKEND_URL=http://localhost:8080
NEXTAUTH_SECRET=your-secret-key-here-min-32-chars
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```

### Генерація NEXTAUTH_SECRET

```bash
# Використайте один з цих методів
openssl rand -base64 32

# Або через Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Крок 5: Запуск Backend

Переконайтесь, що backend запущений на `http://localhost:8080`

```bash
# В окремому терміналі
cd ../nova-kakhovka-ecity-backend
go run main.go
```

## Крок 6: Запуск Frontend

### Варіант 1: Запустити всі додатки

```bash
pnpm dev
```

Це запустить:
- Адмін панель: http://localhost:3001
- Веб-додаток: http://localhost:3000

### Варіант 2: Запустити окремо

```bash
# Тільки адмін панель
pnpm dev:admin

# Тільки веб-додаток
pnpm dev:web
```

## Крок 7: Перевірка роботи

### Адмін панель (http://localhost:3001/login)

Тестовий акаунт модератора:
```
Email: moderator@example.com
Password: moderator123
```

### Веб-додаток (http://localhost:3000)

Перейдіть на `/register` для створення нового акаунту або використайте:
```
Email: test@example.com
Password: password123
```

## 🔧 Корисні команди

```bash
# Розробка
pnpm dev              # Всі додатки
pnpm dev:admin        # Тільки admin
pnpm dev:web          # Тільки web

# Білд
pnpm build            # Всі додатки
pnpm build:admin      # Тільки admin
pnpm build:web        # Тільки web

# Запуск production білду
pnpm start:admin      # Після build:admin
pnpm start:web        # Після build:web

# Перевірка коду
pnpm lint             # ESLint
pnpm type-check       # TypeScript
pnpm format           # Prettier форматування

# Очищення
pnpm clean            # Видалити node_modules
pnpm clean:all        # Видалити все включно з .next
```

## ❗ Troubleshooting

### Port already in use

```bash
# Знайти процес
lsof -i :3000    # або :3001

# Вбити процес
kill -9 <PID>
```

### Module not found

```bash
pnpm clean
pnpm install
```

### Backend connection refused

1. Перевірте чи запущений backend
2. Перевірте URL в .env.local файлах
3. Перевірте чи немає CORS помилок в DevTools

### NextAuth session не працює

```bash
# Перегенеруйте NEXTAUTH_SECRET
openssl rand -base64 32

# Очистіть cookies браузера
# Перезапустіть dev сервер
```

## 📚 Наступні кроки

- Прочитайте повний [README.md](./README.md)
- Перегляньте структуру проєкту
- Ознайомтесь з API документацією
- Додайте нові функції

## 🆘 Потрібна допомога?

- [GitHub Issues](https://github.com/your-org/nova-kakhovka-ecity-frontend/issues)
- [Документація](./docs/)
- Email: support@nk-ecity.com