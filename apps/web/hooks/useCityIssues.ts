// apps/web/hooks/useCityIssues.ts

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccessToken } from '@ecity/auth';
import { apiClient } from '@/lib/api-client';
import type { CreateCityIssueRequest, AddIssueCommentRequest } from '@ecity/types';

// Отримати список проблем міста
export function useCityIssues(filters?: any) {
  return useQuery({
    queryKey: ['city-issues', filters],
    queryFn: () => apiClient.cityIssues.getAll(filters),
  });
}

// Отримати проблему за ID
export function useCityIssue(id: string) {
  return useQuery({
    queryKey: ['city-issues', id],
    queryFn: () => apiClient.cityIssues.getById(id),
    enabled: !!id,
  });
}

// Створити повідомлення про проблему
export function useCreateCityIssue() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (data: CreateCityIssueRequest) => {
      if (!token) throw new Error('No token');
      return apiClient.cityIssues.create(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['city-issues'] });
    },
  });
}

// Проголосувати за проблему (upvote)
export function useUpvoteCityIssue() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('No token');
      return apiClient.cityIssues.upvote(id, token);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['city-issues', id] });
    },
  });
}

// Додати коментар
export function useAddIssueComment() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddIssueCommentRequest }) => {
      if (!token) throw new Error('No token');
      return apiClient.cityIssues.addComment(id, data, token);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['city-issues', id] });
    },
  });
}

// Підписатися на оновлення проблеми
export function useSubscribeCityIssue() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('No token');
      return apiClient.cityIssues.subscribe(id, token);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['city-issues', id] });
    },
  });
}