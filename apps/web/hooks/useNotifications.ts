// apps/web/hooks/useNotifications.ts

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccessToken } from "@ecity/auth";
import { apiClient } from "@/lib/api"; // ✅ ВИПРАВЛЕНО: змінено імпорт з api-client на api

/**
 * Hook для отримання сповіщень користувача
 * Підтримує фільтрацію за статусом прочитаності
 * @param page - номер сторінки (за замовчуванням 1)
 * @param limit - кількість сповіщень на сторінці (за замовчуванням 20)
 */
export function useNotifications(unreadOnly = false) {
  const token = useAccessToken();

  return useQuery({
    queryKey: ["notifications", unreadOnly],
    queryFn: () => {
      if (!token) throw new Error("No token");
      return apiClient.notifications.getAll(token, unreadOnly);
    },
    enabled: !!token,
  });
}

/**
 * Hook для позначення сповіщення як прочитане
 * Автоматично оновлює список сповіщень
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (notificationId: string) => {
      if (!token) throw new Error("No token");
      return apiClient.notifications.markAsRead(notificationId, token);
    },
    onSuccess: () => {
      // Оновлюємо список сповіщень після позначення як прочитане
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/**
 * Hook для позначення всіх сповіщень як прочитані
 * Корисно для кнопки "Прочитати все"
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: () => {
      if (!token) throw new Error("No token");
      return apiClient.notifications.markAllAsRead(token);
    },
    onSuccess: () => {
      // Оновлюємо список сповіщень після позначення всіх як прочитані
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/**
 * Hook для видалення сповіщення
 * Автоматично оновлює список після видалення
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (notificationId: string) => {
      if (!token) throw new Error("No token");
      return apiClient.notifications.delete(notificationId, token);
    },
    onSuccess: () => {
      // Оновлюємо список сповіщень після видалення
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
