// apps/web/hooks/usePetitions.ts

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccessToken } from '@ecity/auth';
import { apiClient } from '@/lib/api-client';
import type { CreatePetitionRequest, SignPetitionRequest } from '@ecity/types';

// Отримати список петицій
export function usePetitions(filters?: any) {
  return useQuery({
    queryKey: ['petitions', filters],
    queryFn: () => apiClient.petitions.getAll(filters),
  });
}

// Отримати петицію за ID
export function usePetition(id: string) {
  return useQuery({
    queryKey: ['petitions', id],
    queryFn: () => apiClient.petitions.getById(id),
    enabled: !!id,
  });
}

// Створити петицію
export function useCreatePetition() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (data: CreatePetitionRequest) => {
      if (!token) throw new Error('No token');
      return apiClient.petitions.create(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['petitions'] });
    },
  });
}

// Підписати петицію
export function useSignPetition() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SignPetitionRequest }) => {
      if (!token) throw new Error('No token');
      return apiClient.petitions.sign(id, data, token);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['petitions', id] });
      queryClient.invalidateQueries({ queryKey: ['petitions'] });
    },
  });
}