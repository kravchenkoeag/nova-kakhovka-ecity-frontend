// apps/web/hooks/useProfile.ts

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccessToken } from "@ecity/auth";
import { apiClient } from "@/lib/api"; // ✅ ВИПРАВЛЕНО: змінено імпорт з api-client на api
import type { User } from "@ecity/types";

/**
 * Hook для отримання профілю поточного користувача
 * Автоматично синхронізується з токеном авторизації
 */
export function useProfile() {
  const token = useAccessToken();

  return useQuery({
    queryKey: ["profile"],
    queryFn: () => {
      if (!token) throw new Error("No token");
      return apiClient.auth.getProfile(token);
    },
    enabled: !!token, // Запит виконується тільки якщо є токен
  });
}

/**
 * Hook для оновлення профілю користувача
 * Підтримує часткове оновлення (PATCH)
 * Автоматично інвалідує кеш після оновлення
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (data: Partial<User>) => {
      if (!token) throw new Error("No token");
      return apiClient.auth.updateProfile(data, token);
    },
    onSuccess: () => {
      // Оновлюємо кеш профілю після збереження змін
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
