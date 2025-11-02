// apps/web/hooks/useGroups.ts

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccessToken } from "@ecity/auth";
import { apiClient } from "@/lib/api"; // ✅ ВИПРАВЛЕНО: змінено імпорт з api-client на api
import type { CreateGroupRequest } from "@ecity/types";

/**
 * Hook для отримання всіх груп користувача
 * Повертає як приватні, так і публічні групи, до яких приєднався користувач
 */
export function useGroups() {
  const token = useAccessToken();

  return useQuery({
    queryKey: ["groups"],
    queryFn: () => {
      if (!token) throw new Error("No token");
      return apiClient.groups.getAll(token);
    },
    enabled: !!token,
  });
}

/**
 * Hook для отримання деталей окремої групи
 * @param id - ідентифікатор групи
 */
export function useGroup(id: string) {
  const token = useAccessToken();

  return useQuery({
    queryKey: ["groups", id],
    queryFn: () => {
      if (!token) throw new Error("No token");
      return apiClient.groups.getById(id, token);
    },
    enabled: !!id && !!token,
  });
}

/**
 * Hook для створення нової групи
 * Автоматично інвалідує кеш після створення
 */
export function useCreateGroup() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (data: CreateGroupRequest) => {
      if (!token) throw new Error("No token");
      return apiClient.groups.create(data, token);
    },
    onSuccess: () => {
      // Оновлюємо список груп після створення
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

/**
 * Hook для приєднання до групи
 * Доступно для публічних груп або за запрошенням для приватних
 */
export function useJoinGroup() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (groupId: string) => {
      if (!token) throw new Error("No token");
      return apiClient.groups.join(groupId, token);
    },
    onSuccess: (_, groupId) => {
      // Оновлюємо дані конкретної групи
      queryClient.invalidateQueries({ queryKey: ["groups", groupId] });
      // Оновлюємо загальний список груп
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

/**
 * Hook для виходу з групи
 * Користувач більше не отримуватиме сповіщення та не матиме доступу до контенту
 */
export function useLeaveGroup() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (groupId: string) => {
      if (!token) throw new Error("No token");
      return apiClient.groups.leave(groupId, token);
    },
    onSuccess: (_, groupId) => {
      // Оновлюємо дані конкретної групи
      queryClient.invalidateQueries({ queryKey: ["groups", groupId] });
      // Оновлюємо загальний список груп
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
