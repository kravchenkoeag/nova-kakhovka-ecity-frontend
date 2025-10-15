// apps/web/hooks/usePolls.ts

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccessToken } from '@ecity/auth';
import { apiClient } from '@/lib/api-client';
import type { SubmitPollResponseRequest } from '@ecity/types';

// Отримати список опитувань
export function usePolls(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['polls', page, limit],
    queryFn: () => apiClient.polls.getAll(page, limit),
  });
}

// Отримати опитування за ID
export function usePoll(id: string) {
  return useQuery({
    queryKey: ['polls', id],
    queryFn: () => apiClient.polls.getById(id),
    enabled: !!id,
  });
}

// Відправити відповідь на опитування
export function useSubmitPollResponse() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubmitPollResponseRequest }) => {
      if (!token) throw new Error('No token');
      return apiClient.polls.submitResponse(id, data, token);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['polls', id] });
    },
  });
}

// Отримати результати опитування
export function usePollResults(id: string) {
  const token = useAccessToken();

  return useQuery({
    queryKey: ['polls', id, 'results'],
    queryFn: () => {
      if (!token) throw new Error('No token');
      return apiClient.polls.getResults(id, token);
    },
    enabled: !!id && !!token,
  });
}