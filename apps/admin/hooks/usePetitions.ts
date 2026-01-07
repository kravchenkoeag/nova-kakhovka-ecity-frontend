// apps/admin/hooks/usePetitions.ts

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccessToken } from "@ecity/auth";
import { apiClient } from "@/lib/api";
import type { CreatePetitionRequest } from "@ecity/types";

/**
 * Hook для отримання списку петицій з фільтрацією (для адміністратора)
 * Включає draft петиції, які не показуються звичайним користувачам
 */
export function usePetitions(filters?: {
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["admin-petitions", filters],
    queryFn: () => apiClient.petitions.getAll(filters),
  });
}

/**
 * Hook для отримання деталей окремої петиції
 */
export function usePetition(id: string) {
  return useQuery({
    queryKey: ["admin-petitions", id],
    queryFn: () => apiClient.petitions.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook для публікації петиції (draft → active)
 * Доступний тільки для модераторів
 */
export function usePublishPetition() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: async (petitionId: string) => {
      if (!token) throw new Error("No token");

      const response = await fetch(
        `/api/proxy/api/v1/petitions/${petitionId}/publish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to publish petition");
      }

      return response.json();
    },
    onSuccess: () => {
      // Оновлюємо список петицій
      queryClient.invalidateQueries({ queryKey: ["admin-petitions"] });
    },
  });
}

/**
 * Hook для зміни статусу петиції
 * Доступний тільки для модераторів
 */
export function useUpdatePetitionStatus() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: async ({
      petitionId,
      status,
    }: {
      petitionId: string;
      status: string;
    }) => {
      if (!token) throw new Error("No token");

      const response = await fetch(
        `/api/proxy/api/v1/petitions/${petitionId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update status");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-petitions"] });
    },
  });
}

/**
 * Hook для додавання офіційної відповіді на петицію
 * Доступний тільки для модераторів
 */
export function useAddOfficialResponse() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: async ({
      petitionId,
      data,
    }: {
      petitionId: string;
      data: {
        response: string;
        decision: "accepted" | "rejected" | "partially_accepted";
        action_plan?: string;
        documents?: string[];
      };
    }) => {
      if (!token) throw new Error("No token");

      const response = await fetch(
        `/api/proxy/api/v1/petitions/${petitionId}/response`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add response");
      }

      return response.json();
    },
    onSuccess: (_, { petitionId }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-petitions", petitionId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-petitions"] });
    },
  });
}

/**
 * Hook для створення нової петиції (адмін)
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
      queryClient.invalidateQueries({ queryKey: ["admin-petitions"] });
    },
  });
}

/**
 * Hook для видалення петиції
 * Доступний тільки для автора або модератора
 */
export function useDeletePetition() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: async (petitionId: string) => {
      if (!token) throw new Error("No token");
      return apiClient.petitions.delete(petitionId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-petitions"] });
    },
  });
}
