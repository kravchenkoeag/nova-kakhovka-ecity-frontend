// apps/web/hooks/useEvents.ts

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccessToken } from "@ecity/auth";
import { apiClient } from "@/lib/api"; // ✅ ВИПРАВЛЕНО: змінено імпорт з api-client на api
import type { CreateEventRequest } from "@ecity/types";

/**
 * Hook для отримання списку подій з фільтрацією
 * @param filters - опціональні фільтри для подій
 */
export function useEvents(filters?: any) {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: () => apiClient.events.getAll(filters),
  });
}

/**
 * Hook для отримання деталей окремої події
 * @param id - ідентифікатор події
 */
export function useEvent(id: string) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => apiClient.events.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook для створення нової події
 * Автоматично інвалідує кеш після створення
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (data: CreateEventRequest) => {
      if (!token) throw new Error("No token");
      return apiClient.events.create(data, token);
    },
    onSuccess: () => {
      // Оновлюємо кеш подій після створення
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

/**
 * Hook для приєднання до події
 * Автоматично оновлює дані події та список подій
 */
export function useJoinEvent() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (eventId: string) => {
      if (!token) throw new Error("No token");
      return apiClient.events.join(eventId, token);
    },
    onSuccess: (_, eventId) => {
      // Оновлюємо дані конкретної події
      queryClient.invalidateQueries({ queryKey: ["events", eventId] });
      // Оновлюємо загальний список подій
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
