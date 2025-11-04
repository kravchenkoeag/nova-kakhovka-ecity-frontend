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
import { User, UserRole, UserHelpers } from "@ecity/types";
import { apiClient } from "@/lib/api";
import { UsersListResponse, UserStats } from "@ecity/api-client";
import { useHasPermission } from "@ecity/auth";
import { Permission } from "@ecity/types";

/**
 * Client Component для управління користувачами
 *
 * 🔒 Захист:
 * - Server-side: requirePermission() в page.tsx (ОБОВ'ЯЗКОВО!)
 * - Client-side: useHasPermission() для UX (не для безпеки!)
 * - Backend API: перевірка прав на кожному endpoint
 */
export default function UsersManagementClient() {
  const { data: session } = useSession();
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

  // 🔒 Client-side перевірка прав (тільки для UX!)
  // НЕ для безпеки - безпека на server-side та backend!
  const canChangePassword = useHasPermission(Permission.MANAGE_USERS);
  const canBlockUsers = useHasPermission(Permission.BLOCK_USER);

  /**
   * Завантаження списку користувачів
   */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page,
        limit: 20,
      };

      if (searchQuery) params.search = searchQuery;
      if (roleFilter !== "all") params.role = roleFilter;
      if (statusFilter === "blocked") params.is_blocked = true;
      if (statusFilter === "active") params.is_blocked = false;

      const response: UsersListResponse = await apiClient.users.getAll(params);

      setUsers(response.users);
      setTotalPages(response.total_pages);
    } catch (err: any) {
      setError(err.message || "Помилка завантаження користувачів");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Завантаження статистики
   */
  const fetchStats = async () => {
    try {
      const statsData = await apiClient.users.getStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  /**
   * Зміна пароля користувача
   */
  const handleChangePassword = async () => {
    if (!selectedUser || !newPassword || newPassword.length < 6) {
      alert("Пароль повинен містити мінімум 6 символів");
      return;
    }

    try {
      setActionLoading(true);
      await apiClient.users.updatePassword(selectedUser.id, {
        new_password: newPassword,
      });

      alert("Пароль успішно змінено!");
      setShowPasswordDialog(false);
      setNewPassword("");
      setSelectedUser(null);
    } catch (err: any) {
      alert(err.message || "Помилка зміни пароля");
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Блокування/розблокування користувача
   */
  const handleBlockUser = async () => {
    if (!selectedUser) return;

    const isBlocking = !selectedUser.is_blocked;

    if (isBlocking && !blockReason) {
      alert("Вкажіть причину блокування");
      return;
    }

    try {
      setActionLoading(true);
      await apiClient.users.blockUser(selectedUser.id, {
        is_blocked: isBlocking,
        reason: isBlocking ? blockReason : undefined,
      });

      alert(
        isBlocking ? "Користувача заблоковано" : "Користувача розблоковано"
      );

      setShowBlockDialog(false);
      setBlockReason("");
      setSelectedUser(null);
      fetchUsers(); // Перезавантажуємо список
      fetchStats(); // Оновлюємо статистику
    } catch (err: any) {
      alert(err.message || "Помилка зміни статусу");
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Ініціалізація
   */
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [page, roleFilter, statusFilter]);

  /**
   * Пошук з затримкою
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchUsers();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold">Управління користувачами</h1>
        <p className="text-gray-600 mt-1">
          Перегляд та керування користувачами платформи
        </p>
      </div>

      {/* Статистика */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Всього
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Активних
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.active_users}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Заблоковано
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.blocked_users}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Верифіковано
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.verified_users}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Модераторів
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.moderators}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Адмінів
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.administrators}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Фільтри */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Фільтри та пошук
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Пошук */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Пошук за ім'ям, email або телефоном..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Фільтр за роллю */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі ролі</SelectItem>
                <SelectItem value="USER">Користувачі</SelectItem>
                <SelectItem value="MODERATOR">Модератори</SelectItem>
                <SelectItem value="ADMIN">Адміністратори</SelectItem>
                <SelectItem value="SUPER_ADMIN">Супер Адмін</SelectItem>
              </SelectContent>
            </Select>

            {/* Фільтр за статусом */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі статуси</SelectItem>
                <SelectItem value="active">Активні</SelectItem>
                <SelectItem value="blocked">Заблоковані</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Знайдено: {users.length} користувачів
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchUsers();
                fetchStats();
              }}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Оновити
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Помилка */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Таблиця користувачів */}
      <Card>
        <CardHeader>
          <CardTitle>Список користувачів</CardTitle>
          <CardDescription>
            Сторінка {page} з {totalPages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Користувачів не знайдено
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-3 font-semibold">Користувач</th>
                    <th className="pb-3 font-semibold">Email / Телефон</th>
                    <th className="pb-3 font-semibold">Роль</th>
                    <th className="pb-3 font-semibold">Статус</th>
                    <th className="pb-3 font-semibold">Дата реєстрації</th>
                    <th className="pb-3 font-semibold text-right">Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                            {UserHelpers.getInitials(user)}
                          </div>
                          <div>
                            <div className="font-medium">
                              {UserHelpers.getFullName(user)}
                            </div>
                            {user.last_login_at && (
                              <div className="text-xs text-gray-500">
                                Остан вхід:{" "}
                                {new Date(user.last_login_at).toLocaleString(
                                  "uk-UA"
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="text-sm">
                          <div>{user.email}</div>
                          {user.phone && (
                            <div className="text-gray-500">{user.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge
                          variant="secondary"
                          className={`
                            ${user.role === "USER" && "bg-gray-100 text-gray-800"}
                            ${user.role === "MODERATOR" && "bg-blue-100 text-blue-800"}
                            ${user.role === "ADMIN" && "bg-purple-100 text-purple-800"}
                            ${user.role === "SUPER_ADMIN" && "bg-red-100 text-red-800"}
                          `}
                        >
                          {UserHelpers.getRoleLabel(user.role as UserRole)}
                        </Badge>
                      </td>
                      <td className="py-4">
                        {user.is_blocked ? (
                          <div>
                            <Badge variant="destructive" className="mb-1">
                              Заблоковано
                            </Badge>
                            {user.block_reason && (
                              <div className="text-xs text-gray-500">
                                {user.block_reason}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Badge
                            variant="success"
                            className="bg-green-100 text-green-800"
                          >
                            Активний
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString("uk-UA")}
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          {/* Зміна пароля (тільки для адмінів) */}
                          {canChangePassword && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowPasswordDialog(true);
                              }}
                              title="Змінити пароль"
                            >
                              <Key className="h-4 w-4" />
                            </Button>
                          )}

                          {/* Блокування/розблокування */}
                          {canBlockUsers &&
                            user.role !== "ADMIN" &&
                            user.role !== "SUPER_ADMIN" && (
                              <Button
                                variant={
                                  user.is_blocked ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowBlockDialog(true);
                                }}
                                title={
                                  user.is_blocked
                                    ? "Розблокувати"
                                    : "Заблокувати"
                                }
                              >
                                {user.is_blocked ? (
                                  <Unlock className="h-4 w-4" />
                                ) : (
                                  <Lock className="h-4 w-4" />
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
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                Попередня
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      onClick={() => setPage(pageNum)}
                      disabled={loading}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalPages > 5 && <span>...</span>}
              </div>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
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
            <DialogTitle>Змінити пароль користувача</DialogTitle>
            <DialogDescription>
              {selectedUser &&
                `Змініть пароль для ${UserHelpers.getFullName(selectedUser)}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Новий пароль</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Мінімум 6 символів"
                minLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false);
                setNewPassword("");
              }}
              disabled={actionLoading}
            >
              Скасувати
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={actionLoading || newPassword.length < 6}
            >
              {actionLoading ? "Збереження..." : "Змінити пароль"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Діалог блокування/розблокування */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.is_blocked ? "Розблокувати" : "Заблокувати"}{" "}
              користувача
            </DialogTitle>
            <DialogDescription>
              {selectedUser &&
                (selectedUser.is_blocked
                  ? `Розблокувати ${UserHelpers.getFullName(selectedUser)}?`
                  : `Заблокувати ${UserHelpers.getFullName(selectedUser)}?`)}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && !selectedUser.is_blocked && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Причина блокування *
                </label>
                <Input
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Вкажіть причину блокування"
                  maxLength={500}
                />
              </div>
              <Alert>
                <AlertDescription>
                  Після блокування користувач не зможе увійти в систему і
                  побачить повідомлення з проханням звернутися до модератора.
                </AlertDescription>
              </Alert>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBlockDialog(false);
                setBlockReason("");
              }}
              disabled={actionLoading}
            >
              Скасувати
            </Button>
            <Button
              variant={selectedUser?.is_blocked ? "default" : "destructive"}
              onClick={handleBlockUser}
              disabled={actionLoading}
            >
              {actionLoading
                ? "Збереження..."
                : selectedUser?.is_blocked
                  ? "Розблокувати"
                  : "Заблокувати"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
