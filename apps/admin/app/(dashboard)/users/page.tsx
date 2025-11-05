// File: apps/admin/app/(dashboard)/users/page.tsx

import { requirePermission } from "@ecity/auth";
import { Permission } from "@ecity/types";
import UsersManagementClient from "./UsersManagementClient";

/**
 * Server Component - сторінка управління користувачами
 *
 * 🔒 ОБОВ'ЯЗКОВА Server-Side захист!
 * Перевіряє права доступу ДО рендерингу сторінки
 *
 * Архітектура захисту (3 рівні):
 * 1. Server-Side (тут) - requirePermission() перевіряє права ДО рендерингу
 * 2. Client-Side (UsersManagementClient) - useHasPermission() для UX
 * 3. Backend API - перевірка прав на кожному endpoint
 */
export default async function UsersManagementPage() {
  // 🔒 КРИТИЧНО: Server-side перевірка прав!
  // Якщо немає прав - користувач НЕ побачить сторінку взагалі
  // await - ОБОВ'ЯЗКОВО, бо requirePermission асинхронна функція
  await requirePermission(Permission.USERS_MANAGE);

  // Якщо права є - рендеримо Client Component з усією логікою управління
  return <UsersManagementClient />;
}
