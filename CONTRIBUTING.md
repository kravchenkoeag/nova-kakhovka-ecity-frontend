# 🤝 Contributing to Nova Kakhovka e-City Frontend

Дякуємо за інтерес до проєкту! Ця документація допоможе вам зробити свій внесок.

## 📋 Зміст

- [Кодекс поведінки](#кодекс-поведінки)
- [З чого почати](#з-чого-почати)
- [Workflow розробки](#workflow-розробки)
- [Стандарти коду](#стандарти-коду)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Кодекс поведінки

Ми прагнемо створити дружню та інклюзивну спільноту. Будь ласка:

- ✅ Будьте ввічливими та поважайте інших
- ✅ Конструктивно критикуйте код, а не людей
- ✅ Приймайте зворотній зв'язок
- ❌ Не використовуйте образливу мову
- ❌ Не займайтесь harassment або trolling

## З чого почати

### 1. Знайдіть задачу

- Перегляньте [Issues](https://github.com/your-org/repo/issues)
- Шукайте мітки `good first issue` або `help wanted`
- Або запропонуйте свою ідею в новому Issue

### 2. Налаштуйте середовище

```bash
# Fork репозиторій
# Клонуйте свій fork
git clone https://github.com/YOUR_USERNAME/nova-kakhovka-ecity-frontend.git
cd nova-kakhovka-ecity-frontend

# Додайте upstream remote
git remote add upstream https://github.com/original-org/nova-kakhovka-ecity-frontend.git

# Встановіть залежності
pnpm install

# Скопіюйте .env файли
cp apps/admin/.env.example apps/admin/.env.local
cp apps/web/.env.example apps/web/.env.local

# Запустіть dev сервер
pnpm dev
```

### 3. Створіть гілку

```bash
# Оновіть main
git checkout main
git pull upstream main

# Створіть feature гілку
git checkout -b feature/your-feature-name
# або
git checkout -b fix/your-bug-fix
```

## Workflow розробки

### Структура гілок

- `main` - production-ready код
- `develop` - integration гілка
- `feature/*` - нові фічі
- `fix/*` - виправлення багів
- `refactor/*` - рефакторинг
- `docs/*` - документація

### Naming Conventions

#### Гілки
```
feature/add-petition-form
fix/websocket-reconnection
refactor/api-client-structure
docs/update-readme
```

#### Файли та папки
```typescript
// Components - PascalCase
MyComponent.tsx
UserProfile.tsx

// Утиліти - camelCase
apiClient.ts
formatDate.ts

// Hooks - camelCase з префіксом use
useUser.ts
useWebSocket.ts

// Типи - PascalCase
User.ts
ApiResponse.ts
```

#### Компоненти
```typescript
// ✅ Good
export function UserProfile() { }
export function EventCard() { }

// ❌ Bad
export function userprofile() { }
export function event_card() { }
```

## Стандарти коду

### TypeScript

```typescript
// ✅ Завжди вказуйте типи
function getUserName(user: User): string {
  return `${user.first_name} ${user.last_name}`;
}

// ❌ Уникайте any
function process(data: any) { } // Bad

// ✅ Використовуйте interface для об'єктів
interface UserProps {
  user: User;
  onUpdate: (user: User) => void;
}

// ✅ Експортуйте типи
export type { UserProps };
```

### React Components

```typescript
// ✅ Functional components з TypeScript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ children, onClick, disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// ✅ Використовуйте 'use client' тільки коли потрібно
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  // ...
}
```

### Стилізація

```typescript
// ✅ Використовуйте Tailwind класи
<div className="flex items-center space-x-4">
  <h1 className="text-2xl font-bold">Title</h1>
</div>

// ✅ Використовуйте cn() для умовних класів
import { cn } from '@ecity/ui';

<button
  className={cn(
    'px-4 py-2 rounded',
    isActive && 'bg-blue-500',
    isDisabled && 'opacity-50'
  )}
>
```

### Коментарі

```typescript
/**
 * Отримує користувача за ID
 * @param id - ID користувача
 * @returns Promise з даними користувача
 * @throws Error якщо користувача не знайдено
 */
export async function getUserById(id: string): Promise<User> {
  // Implementation
}

// Поясніть складну логіку
// Обчислюємо відсоток підписів відносно цільової кількості
const progress = (signatures.length / requiredSignatures) * 100;
```

## Commit Guidelines

Використовуємо [Conventional Commits](https://www.conventionalcommits.org/)

### Формат

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - нова функція
- `fix` - виправлення бага
- `docs` - зміни в документації
- `style` - форматування, пропущені крапки з комою тощо
- `refactor` - рефакторинг коду
- `test` - додавання тестів
- `chore` - оновлення build tasks, package manager

### Приклади

```bash
# Feature
feat(auth): add two-factor authentication

# Fix
fix(websocket): resolve reconnection issue on network change

# Docs
docs(readme): update installation instructions

# Refactor
refactor(api-client): simplify error handling logic

# Multiple files
feat(ui): add Dialog and Toast components

Adds new reusable UI components:
- Dialog for modal dialogs
- Toast for notifications

Closes #123
```

### Scope

- `auth` - авторизація
- `ui` - UI компоненти
- `api` - API клієнт
- `admin` - адмін панель
- `web` - веб-додаток
- `ws` - WebSocket
- `types` - TypeScript типи

## Pull Request Process

### 1. Перед створенням PR

```bash
# Оновіть main
git fetch upstream
git merge upstream/main

# Запустіть перевірки
pnpm lint
pnpm type-check
pnpm format

# Переконайтесь що все працює
pnpm dev
```

### 2. Створіть PR

- Дайте зрозумілий заголовок
- Опишіть зміни детально
- Додайте скріншоти (якщо UI зміни)
- Згадайте пов'язані Issues (#123)
- Заповніть чекліст

### PR Template

```markdown
## Опис
Коротко опишіть зміни

## Тип змін
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Як тестувати
1. Перейдіть на сторінку X
2. Натисніть Y
3. Перевірте Z

## Скріншоти
Якщо застосовно

## Чекліст
- [ ] Код відповідає style guidelines
- [ ] Self-review виконано
- [ ] Коментарі додані для складних частин
- [ ] Документація оновлена
- [ ] Lint та type-check пройшли
- [ ] Тестування виконано
```

### 3. Code Review

- Будьте відкриті до feedback
- Відповідайте на коментарі
- Вносьте зміни за потреби
- Оновлюйте PR description якщо потрібно

### 4. Merge

- Дочекайтесь approve від maintainer
- Merge виконає maintainer
- Видаліть feature branch після merge

## Testing

```bash
# Unit тести
pnpm test

# Type checking
pnpm type-check

# Lint
pnpm lint

# Форматування
pnpm format

# Всі перевірки
pnpm lint && pnpm type-check && pnpm test
```

## Корисні команди

```bash
# Розробка
pnpm dev              # Всі додатки
pnpm dev:admin        # Тільки admin
pnpm dev:web          # Тільки web

# Білд
pnpm build
pnpm build:admin
pnpm build:web

# Очищення
pnpm clean            # node_modules
pnpm clean:all        # node_modules + .next

# Додавання залежності
pnpm add <package>                    # До root
pnpm --filter admin add <package>     # До admin
pnpm --filter @ecity/ui add <package> # До UI package
```

## Питання?

- 💬 GitHub Discussions
- 📧 Email: dev@nk-ecity.com
- 💬 Telegram: [@ecity_dev]

## Ліцензія

Роблячи contribution, ви погоджуєтесь що ваш код буде ліцензований під MIT License.

---

Дякуємо за ваш внесок! 🎉