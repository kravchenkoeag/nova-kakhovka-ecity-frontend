// apps/admin/app/(dashboard)/users/UsersManagementClient.tsx

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
import type {
  UsersListResponse,
  UserStats,
  UpdatePasswordRequest,
} from "@ecity/api-client";
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
  // ✅ ВИПРАВЛЕНО: Використовуємо правильний Permission.USERS_MANAGE
  const canManageUsers = useHasPermission(Permission.USERS_MANAGE);

  /**
   * Завантажити список користувачів
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
      if (statusFilter !== "all") {
        params.is_blocked = statusFilter === "blocked";
      }

      // ✅ ВИПРАВЛЕНО: Використання правильної структури відповіді
      const response = await apiClient.users.getAll(params);

      // ✅ ВИПРАВЛЕНО: Доступ до users через response.data
      setUsers(response.data || response.users || []);
      setTotalPages(Math.ceil(response.total / (params.limit || 20)));
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Помилка завантаження користувачів");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Завантажити статистику користувачів
   */
  const fetchStats = async () => {
    try {
      // ✅ ВИПРАВЛЕНО: Використання правильної структури UserStats
      const data = await apiClient.users.getStats();
      setStats(data);
    } catch (err: any) {
      console.error("Error fetching stats:", err);
    }
  };

  /**
   * Змінити пароль користувача
   */
  const handleChangePassword = async () => {
    if (!selectedUser || !newPassword) return;

    try {
      setActionLoading(true);

      // ✅ ВИПРАВЛЕНО: Передаємо об'єкт UpdatePasswordRequest
      const passwordRequest: UpdatePasswordRequest = {
        new_password: newPassword,
      };

      await apiClient.users.updatePassword(selectedUser.id, passwordRequest);

      setShowPasswordDialog(false);
      setNewPassword("");
      setSelectedUser(null);

      alert("Пароль успішно змінено");
    } catch (err: any) {
      console.error("Error changing password:", err);
      alert(err.message || "Помилка зміни пароля");
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Заблокувати/розблокувати користувача
   */
  const handleToggleBlock = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);

      // ✅ ВИПРАВЛЕНО: Використання is_blocked замість isBlocked
      if (selectedUser.is_blocked) {
        // ✅ ВИПРАВЛЕНО: Використання методу unblock
        await apiClient.users.unblock(selectedUser.id);
      } else {
        // ✅ ВИПРАВЛЕНО: Використання методу block
        await apiClient.users.block(selectedUser.id, blockReason);
      }

      setShowBlockDialog(false);
      setBlockReason("");
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      console.error("Error toggling block:", err);
      alert(err.message || "Помилка зміни статусу блокування");
    } finally {
      setActionLoading(false);
    }
  };

  // Завантаження даних при монтуванні та зміні фільтрів
  useEffect(() => {
    if (canManageUsers) {
      fetchUsers();
      fetchStats();
    }
  }, [page, searchQuery, roleFilter, statusFilter, canManageUsers]);

  // Якщо немає прав доступу
  if (!canManageUsers) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          У вас немає прав для управління користувачами
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Всього користувачів
              </CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {/* ✅ ВИПРАВЛЕНО: Доступ через stats.data.total */}
              <div className="text-2xl font-bold">{stats.data.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активних</CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              {/* ✅ ВИПРАВЛЕНО: Доступ через stats.data.active */}
              <div className="text-2xl font-bold">{stats.data.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Заблоковано</CardTitle>
              <Lock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              {/* ✅ ВИПРАВЛЕНО: Доступ через stats.data.blocked */}
              <div className="text-2xl font-bold">{stats.data.blocked}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Адміністраторів
              </CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              {/* ✅ ВИПРАВЛЕНО: Доступ через stats.data.admins */}
              <div className="text-2xl font-bold">{stats.data.admins}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Фільтри та пошук</CardTitle>
          <CardDescription>
            Знайдіть користувачів за різними критеріями
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Пошук за email або ім'ям..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Role Filter */}
            <Select
              value={roleFilter}
              onValueChange={(value) => {
                setRoleFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Всі ролі</SelectItem>
                <SelectItem value={UserRole.USER}>Користувач</SelectItem>
                <SelectItem value={UserRole.MODERATOR}>Модератор</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Адміністратор</SelectItem>
                <SelectItem value={UserRole.SUPER_ADMIN}>
                  Супер-адмін
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
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

          <div className="mt-4 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("all");
                setStatusFilter("all");
                setPage(1);
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              Скинути фільтри
            </Button>
            <Button variant="outline" size="sm" onClick={fetchUsers}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Оновити
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список користувачів</CardTitle>
          <CardDescription>
            {/* ✅ ВИПРАВЛЕНО: Доступ через stats?.data.total */}
            Всього користувачів: {stats?.data.total || 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Користувачів не знайдено
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {/* ✅ ВИПРАВЛЕНО: використання UserHelpers.getFullName */}
                      <span className="text-lg font-semibold">
                        {UserHelpers.getInitials(user)}
                      </span>
                    </div>

                    {/* User Info */}
                    <div>
                      {/* ✅ ВИПРАВЛЕНО: використання UserHelpers.getFullName замість user.name */}
                      <div className="font-medium">
                        {UserHelpers.getFullName(user)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* User Status and Actions */}
                  <div className="flex items-center gap-3">
                    {/* Role Badge */}
                    <Badge
                      variant={
                        user.role === UserRole.SUPER_ADMIN ||
                        user.role === UserRole.ADMIN
                          ? "default"
                          : "secondary"
                      }
                    >
                      {getRoleLabel(user.role)}
                    </Badge>

                    {/* Block Status */}
                    {/* ✅ ВИПРАВЛЕНО: використання is_blocked замість isBlocked */}
                    {user.is_blocked && (
                      <Badge variant="destructive">
                        <Lock className="mr-1 h-3 w-3" />
                        Заблоковано
                      </Badge>
                    )}

                    {/* Created Date */}
                    <span className="text-sm text-muted-foreground">
                      {/* ✅ ВИПРАВЛЕНО: використання created_at замість createdAt */}
                      {new Date(user.created_at).toLocaleDateString("uk-UA")}
                    </span>

                    {/* Actions Dropdown */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowPasswordDialog(true);
                        }}
                      >
                        <Key className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowBlockDialog(true);
                        }}
                      >
                        {/* ✅ ВИПРАВЛЕНО: використання is_blocked */}
                        {user.is_blocked ? (
                          <Unlock className="h-4 w-4" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Попередня
              </Button>
              <span className="text-sm text-muted-foreground">
                Сторінка {page} з {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Наступна
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Змінити пароль</DialogTitle>
            <DialogDescription>
              {/* ✅ ВИПРАВЛЕНО: використання UserHelpers.getFullName */}
              Введіть новий пароль для користувача{" "}
              {selectedUser && UserHelpers.getFullName(selectedUser)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Input
              type="password"
              placeholder="Новий пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
            />
            <p className="text-sm text-muted-foreground">
              Пароль має містити мінімум 8 символів
            </p>
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
              onClick={handleChangePassword}
              disabled={!newPassword || newPassword.length < 8 || actionLoading}
            >
              {actionLoading ? "Збереження..." : "Змінити пароль"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block/Unblock Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {/* ✅ ВИПРАВЛЕНО: використання is_blocked */}
              {selectedUser?.is_blocked
                ? "Розблокувати користувача"
                : "Заблокувати користувача"}
            </DialogTitle>
            <DialogDescription>
              {/* ✅ ВИПРАВЛЕНО: використання is_blocked */}
              {selectedUser?.is_blocked ? (
                <>
                  {/* ✅ ВИПРАВЛЕНО: використання UserHelpers.getFullName */}
                  Розблокувати користувача{" "}
                  {selectedUser && UserHelpers.getFullName(selectedUser)}?
                </>
              ) : (
                <>
                  {/* ✅ ВИПРАВЛЕНО: використання UserHelpers.getFullName */}
                  Заблокувати користувача{" "}
                  {selectedUser && UserHelpers.getFullName(selectedUser)}?
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* ✅ ВИПРАВЛЕНО: використання is_blocked */}
          {!selectedUser?.is_blocked && (
            <div className="space-y-4 py-4">
              <Input
                placeholder="Причина блокування (необов'язково)"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
              />
            </div>
          )}

          {/* ✅ ВИПРАВЛЕНО: Показати інформацію про блокування якщо користувач заблокований */}
          {/* ✅ ВИПРАВЛЕНО: використання is_blocked, block_reason, blocked_at */}
          {selectedUser?.is_blocked && selectedUser.block_reason && (
            <Alert>
              <AlertDescription>
                Причина блокування: {selectedUser.block_reason}
                {selectedUser.blocked_at && (
                  <>
                    <br />
                    Заблоковано:{" "}
                    {new Date(selectedUser.blocked_at).toLocaleString("uk-UA")}
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

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
              variant={
                /* ✅ ВИПРАВЛЕНО: використання is_blocked */
                selectedUser?.is_blocked ? "default" : "destructive"
              }
              onClick={handleToggleBlock}
              disabled={actionLoading}
            >
              {actionLoading
                ? "Збереження..."
                : /* ✅ ВИПРАВЛЕНО: використання is_blocked */
                  selectedUser?.is_blocked
                  ? "Розблокувати"
                  : "Заблокувати"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
//Отримати локалізовану назву ролі
function getRoleLabel(role: UserRole): string {
  switch (role) {
    case UserRole.USER:
      return "Користувач";
    case UserRole.MODERATOR:
      return "Модератор";
    case UserRole.ADMIN:
      return "Адміністратор";
    case UserRole.SUPER_ADMIN:
      return "Супер-адмін";
    default:
      return "Невідома роль";
  }
}
