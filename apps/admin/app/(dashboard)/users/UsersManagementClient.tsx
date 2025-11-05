// File: apps/admin/app/(dashboard)/users/UsersManagementClient.tsx

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Alert,
  AlertDescription,
} from "@ecity/ui";
import {
  Search,
  UserCog,
  Shield,
  Lock,
  Unlock,
  Key,
  MoreVertical,
  Filter,
  RefreshCw,
} from "lucide-react";
import { User, UserRole, UserHelpers, Permission } from "@ecity/types";
import { apiClient } from "@/lib/api";
import type { UsersListResponse, UserStats } from "@ecity/api-client";
import { useHasPermission } from "@ecity/auth";

/**
 * Client Component для управління користувачами
 *
 * 🔒 Захист (триповий підхід):
 * - Server-side: requirePermission() в page.tsx (ОБОВ'ЯЗКОВО!)
 * - Client-side: useHasPermission() для UX (не для безпеки!)
 * - Backend API: перевірка прав на кожному endpoint (остання лінія)
 *
 * Функціонал:
 * - Перегляд списку користувачів з пагінацією
 * - Фільтрація за роллю та статусом
 * - Пошук користувачів за email/ім'ям
 * - Зміна пароля користувача (тільки адміни)
 * - Блокування/розблокування користувачів
 * - Перегляд статистики користувачів
 */
export default function UsersManagementClient() {
  const { data: session } = useSession();

  // Дані
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Фільтри та пагінація
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Модальні вікна
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // 🔒 Client-side перевірка прав (тільки для UX, не для безпеки!)
  const canManageUsers = useHasPermission(Permission.USERS_MANAGE);

  // Завантаження користувачів при зміні фільтрів або сторінки
  useEffect(() => {
    loadUsers();
  }, [page, searchQuery, roleFilter, statusFilter]);

  // Завантаження статистики при монтуванні компонента
  useEffect(() => {
    loadStats();
  }, []);

  /**
   * Завантаження списку користувачів з фільтрами
   */
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page,
        limit: 10,
      };

      if (searchQuery) params.search = searchQuery;
      if (roleFilter !== "all") params.role = roleFilter;
      if (statusFilter !== "all") params.isBlocked = statusFilter === "blocked";

      const response = await apiClient.users.getAll(params);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Помилка завантаження користувачів");
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Завантаження статистики користувачів
   */
  const loadStats = async () => {
    try {
      const response = await apiClient.users.getStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  /**
   * Зміна пароля користувача (тільки для адмінів)
   */
  const handlePasswordChange = async () => {
    if (!selectedUser || !newPassword) return;

    try {
      setActionLoading(true);
      await apiClient.users.updatePassword(selectedUser.id, newPassword);

      // Закриваємо діалог та очищуємо форму
      setShowPasswordDialog(false);
      setNewPassword("");
      setSelectedUser(null);

      alert("Пароль успішно змінено");
    } catch (err) {
      alert("Помилка зміни пароля");
      console.error("Password change error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Блокування/розблокування користувача
   */
  const handleBlock = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);

      if (selectedUser.isBlocked) {
        // Розблокування користувача
        await apiClient.users.unblock(selectedUser.id);
      } else {
        // Блокування користувача з причиною
        await apiClient.users.block(selectedUser.id, blockReason);
      }

      // Закриваємо діалог та очищуємо форму
      setShowBlockDialog(false);
      setBlockReason("");
      setSelectedUser(null);

      // Перезавантажуємо список користувачів
      loadUsers();

      alert(
        selectedUser.isBlocked
          ? "Користувача розблоковано"
          : "Користувача заблоковано"
      );
    } catch (err) {
      alert("Помилка операції");
      console.error("Block/unblock error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Управління користувачами</h1>
          <p className="text-gray-600 mt-1">
            Перегляд та управління акаунтами користувачів
          </p>
        </div>
        <Button onClick={loadUsers} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Оновити
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Всього користувачів
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Активних
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.active}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Заблокованих
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.blocked}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Адміністраторів
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.admins}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Фільтри та пошук */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Фільтри
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Пошук */}
            <div>
              <Input
                placeholder="Пошук за email або ім'ям..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Фільтр за роллю */}
            <div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі ролі</SelectItem>
                  <SelectItem value="user">Користувачі</SelectItem>
                  <SelectItem value="moderator">Модератори</SelectItem>
                  <SelectItem value="admin">Адміністратори</SelectItem>
                  <SelectItem value="superadmin">Суперадміни</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Фільтр за статусом */}
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Оберіть статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі статуси</SelectItem>
                  <SelectItem value="active">Активні</SelectItem>
                  <SelectItem value="blocked">Заблоковані</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Таблиця користувачів */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Список користувачів ({users.length})
          </CardTitle>
          <CardDescription>
            Сторінка {page} з {totalPages} • Відображено {users.length} з{" "}
            {stats?.total || 0} користувачів
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              <p className="mt-2 text-gray-600">Завантаження...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Користувачів не знайдено</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">
                      Користувач
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Роль</th>
                    <th className="text-left py-3 px-4 font-medium">Статус</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Дата реєстрації
                    </th>
                    <th className="text-right py-3 px-4 font-medium">Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id.slice(0, 8)}...
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            UserHelpers.isAdmin(user)
                              ? "default"
                              : UserHelpers.canModerate(user)
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {user.isBlocked ? (
                          <Badge variant="destructive">
                            <Lock className="w-3 h-3 mr-1" />
                            Заблокований
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-600"
                          >
                            <Unlock className="w-3 h-3 mr-1" />
                            Активний
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString("uk-UA")}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          {/* Зміна пароля - тільки якщо є права */}
                          {canManageUsers && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowPasswordDialog(true);
                              }}
                              title="Змінити пароль"
                            >
                              <Key className="w-4 h-4" />
                            </Button>
                          )}

                          {/* Блокування/розблокування - якщо є права */}
                          {canManageUsers && (
                            <Button
                              size="sm"
                              variant={
                                user.isBlocked ? "default" : "destructive"
                              }
                              onClick={() => {
                                setSelectedUser(user);
                                setShowBlockDialog(true);
                              }}
                              title={
                                user.isBlocked
                                  ? "Розблокувати користувача"
                                  : "Заблокувати користувача"
                              }
                            >
                              {user.isBlocked ? (
                                <Unlock className="w-4 h-4" />
                              ) : (
                                <Lock className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Пагінація */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Попередня
              </Button>
              <div className="flex items-center px-4">
                Сторінка {page} з {totalPages}
              </div>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Наступна
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Діалог зміни пароля */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Зміна пароля</DialogTitle>
            <DialogDescription>
              {selectedUser
                ? `Зміна пароля для користувача: ${selectedUser.email}`
                : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label
                htmlFor="new-password"
                className="text-sm font-medium block mb-2"
              >
                Новий пароль
              </label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Введіть новий пароль (мінімум 8 символів)"
                autoComplete="new-password"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false);
                setNewPassword("");
                setSelectedUser(null);
              }}
            >
              Скасувати
            </Button>
            <Button
              onClick={handlePasswordChange}
              disabled={actionLoading || !newPassword || newPassword.length < 8}
            >
              {actionLoading ? "Зміна..." : "Змінити пароль"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Діалог блокування/розблокування */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.isBlocked
                ? "Розблокування користувача"
                : "Блокування користувача"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser
                ? `Користувач: ${selectedUser.email} (${selectedUser.role})`
                : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Якщо блокуємо - запитуємо причину */}
            {!selectedUser?.isBlocked && (
              <div>
                <label
                  htmlFor="block-reason"
                  className="text-sm font-medium block mb-2"
                >
                  Причина блокування *
                </label>
                <Input
                  id="block-reason"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Вкажіть причину блокування"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Користувач побачить цю причину при спробі входу
                </p>
              </div>
            )}

            {/* Якщо розблоковуємо - показуємо попередню причину */}
            {selectedUser?.isBlocked && selectedUser.blockReason && (
              <Alert>
                <AlertDescription>
                  <p className="font-medium mb-1">
                    Попередня причина блокування:
                  </p>
                  <p className="text-sm">{selectedUser.blockReason}</p>
                  {selectedUser.blockedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Заблоковано:{" "}
                      {new Date(selectedUser.blockedAt).toLocaleString("uk-UA")}
                    </p>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBlockDialog(false);
                setBlockReason("");
                setSelectedUser(null);
              }}
            >
              Скасувати
            </Button>
            <Button
              onClick={handleBlock}
              disabled={
                actionLoading || (!selectedUser?.isBlocked && !blockReason)
              }
              variant={selectedUser?.isBlocked ? "default" : "destructive"}
            >
              {actionLoading
                ? "Обробка..."
                : selectedUser?.isBlocked
                  ? "Розблокувати"
                  : "Заблокувати"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
