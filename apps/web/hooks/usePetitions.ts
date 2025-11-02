// apps/web/hooks/usePetitions.ts

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccessToken } from "@ecity/auth";
import { apiClient } from "@/lib/api"; // ✅ ВИПРАВЛЕНО: змінено імпорт з api-client на api
import type { CreatePetitionRequest } from "@ecity/types";

/**
 * Hook для отримання списку петицій з фільтрацією
 * @param filters - опціональні фільтри (category, status, page, limit)
 */
export function usePetitions(filters?: {
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["petitions", filters],
    queryFn: () => apiClient.petitions.getAll(filters),
  });
}

/**
 * Hook для отримання деталей окремої петиції
 * @param id - ідентифікатор петиції
 */
export function usePetition(id: string) {
  return useQuery({
    queryKey: ["petitions", id],
    queryFn: () => apiClient.petitions.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook для створення нової петиції
 * Автоматично інвалідує кеш після створення
 */
export function useCreatePetition() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (data: CreatePetitionRequest) => {
      if (!token) throw new Error("No token");
      return apiClient.petitions.create(data, token);
    },
    onSuccess: () => {
      // Оновлюємо список петицій після створення
      queryClient.invalidateQueries({ queryKey: ["petitions"] });
    },
  });
}

/**
 * Hook для підписання петиції
 * Збільшує лічильник підписів та додає користувача до списку підписантів
 */
export function useSignPetition() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: ({ petitionId, data }: { petitionId: string; data?: any }) => {
      if (!token) throw new Error("No token");
      return apiClient.petitions.sign(petitionId, data || {}, token);
    },
    onSuccess: (_, { petitionId }) => {
      // Оновлюємо дані конкретної петиції
      queryClient.invalidateQueries({ queryKey: ["petitions", petitionId] });
      // Оновлюємо загальний список петицій
      queryClient.invalidateQueries({ queryKey: ["petitions"] });
    },
  });
}
