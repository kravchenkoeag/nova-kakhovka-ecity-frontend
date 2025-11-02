// apps/web/hooks/useAnnouncements.ts

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccessToken } from "@ecity/auth";
import { apiClient } from "@/lib/api"; // ✅ ВИПРАВЛЕНО: змінено імпорт з api-client на api
import type { CreateAnnouncementRequest } from "@ecity/types";

/**
 * Hook для отримання списку оголошень з фільтрацією
 * @param filters - опціональні фільтри для оголошень
 */
export function useAnnouncements(filters?: any) {
  return useQuery({
    queryKey: ["announcements", filters],
    queryFn: () => apiClient.announcements.getAll(filters),
  });
}

/**
 * Hook для отримання деталей окремого оголошення
 * @param id - ідентифікатор оголошення
 */
export function useAnnouncement(id: string) {
  return useQuery({
    queryKey: ["announcements", id],
    queryFn: () => apiClient.announcements.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook для створення нового оголошення
 * Автоматично інвалідує кеш після створення
 */
export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (data: CreateAnnouncementRequest) => {
      if (!token) throw new Error("No token");
      return apiClient.announcements.create(data, token);
    },
    onSuccess: () => {
      // Оновлюємо кеш оголошень після створення
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}
