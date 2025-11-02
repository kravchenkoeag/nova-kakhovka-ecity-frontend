// apps/web/hooks/usePolls.ts

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccessToken } from "@ecity/auth";
import { apiClient } from "@/lib/api"; // ✅ ВИПРАВЛЕНО: змінено імпорт з api-client на api
import type { SubmitPollResponseRequest } from "@ecity/types";

/**
 * Hook для отримання списку опитувань з пагінацією
 * @param page - номер сторінки (за замовчуванням 1)
 * @param limit - кількість опитувань на сторінці (за замовчуванням 20)
 */
export function usePolls(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["polls", page, limit],
    queryFn: () => apiClient.polls.getAll(page, limit),
  });
}

/**
 * Hook для отримання деталей окремого опитування
 * @param id - ідентифікатор опитування
 */
export function usePoll(id: string) {
  return useQuery({
    queryKey: ["polls", id],
    queryFn: () => apiClient.polls.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook для відправки відповіді на опитування
 * Автоматично оновлює дані опитування після відправки
 */
export function useSubmitPollResponse() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: SubmitPollResponseRequest;
    }) => {
      if (!token) throw new Error("No token");
      return apiClient.polls.submitResponse(id, data, token);
    },
    onSuccess: (_, { id }) => {
      // Оновлюємо дані опитування після відправки відповіді
      queryClient.invalidateQueries({ queryKey: ["polls", id] });
    },
  });
}

/**
 * Hook для отримання результатів опитування
 * Доступно тільки для авторизованих користувачів після голосування
 * @param id - ідентифікатор опитування
 */
export function usePollResults(id: string) {
  const token = useAccessToken();

  return useQuery({
    queryKey: ["polls", id, "results"],
    queryFn: () => {
      if (!token) throw new Error("No token");
      return apiClient.polls.getResults(id, token);
    },
    enabled: !!id && !!token,
  });
}
