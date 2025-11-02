// apps/web/hooks/useCityIssues.ts

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccessToken } from "@ecity/auth";
import { apiClient } from "@/lib/api"; // ✅ ВИПРАВЛЕНО: змінено імпорт з api-client на api
import type {
  CreateCityIssueRequest,
  AddIssueCommentRequest,
} from "@ecity/types";

/**
 * Hook для отримання списку проблем міста з фільтрацією
 * @param filters - опціональні фільтри (категорія, статус, пріоритет тощо)
 */
export function useCityIssues(filters?: any) {
  return useQuery({
    queryKey: ["city-issues", filters],
    queryFn: () => apiClient.cityIssues.getAll(filters),
  });
}

/**
 * Hook для отримання деталей окремої проблеми
 * @param id - ідентифікатор проблеми
 */
export function useCityIssue(id: string) {
  return useQuery({
    queryKey: ["city-issues", id],
    queryFn: () => apiClient.cityIssues.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook для створення повідомлення про проблему
 * Автоматично інвалідує кеш після створення
 */
export function useCreateCityIssue() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (data: CreateCityIssueRequest) => {
      if (!token) throw new Error("No token");
      return apiClient.cityIssues.create(data, token);
    },
    onSuccess: () => {
      // Оновлюємо список проблем після створення
      queryClient.invalidateQueries({ queryKey: ["city-issues"] });
    },
  });
}

/**
 * Hook для голосування за проблему (upvote)
 * Збільшує пріоритет проблеми в системі
 */
export function useUpvoteCityIssue() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error("No token");
      return apiClient.cityIssues.upvote(id, token);
    },
    onSuccess: (_, id) => {
      // Оновлюємо дані конкретної проблеми
      queryClient.invalidateQueries({ queryKey: ["city-issues", id] });
    },
  });
}

/**
 * Hook для додавання коментаря до проблеми
 * Підтримує як звичайні, так і офіційні коментарі (для модераторів)
 */
export function useAddIssueComment() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: AddIssueCommentRequest;
    }) => {
      if (!token) throw new Error("No token");
      return apiClient.cityIssues.addComment(id, data, token);
    },
    onSuccess: (_, { id }) => {
      // Оновлюємо дані проблеми після додавання коментаря
      queryClient.invalidateQueries({ queryKey: ["city-issues", id] });
    },
  });
}

/**
 * Hook для підписки на оновлення проблеми
 * Користувач отримуватиме сповіщення про зміни статусу та нові коментарі
 */
export function useSubscribeCityIssue() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error("No token");
      return apiClient.cityIssues.subscribe(id, token);
    },
    onSuccess: (_, id) => {
      // Оновлюємо дані проблеми після підписки
      queryClient.invalidateQueries({ queryKey: ["city-issues", id] });
    },
  });
}
