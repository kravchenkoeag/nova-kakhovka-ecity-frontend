// apps/web/hooks/useNotifications.ts

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccessToken } from '@ecity/auth';
import { apiClient } from '@/lib/api-client';

// Отримати всі сповіщення
export function useNotifications(unreadOnly = false) {
  const token = useAccessToken();

  return useQuery({
    queryKey: ['notifications', unreadOnly],
    queryFn: () => {
      if (!token) throw new Error('No token');
      return apiClient.notifications.getAll(token, unreadOnly);
    },
    enabled: !!token,
  });
}

// Позначити як прочитане
export function useMarkAsRead() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('No token');
      return apiClient.notifications.markAsRead(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Позначити всі як прочитані
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: () => {
      if (!token) throw new Error('No token');
      return apiClient.notifications.markAllAsRead(token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

// Видалити сповіщення
export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (id: string) => {
      if (!token) throw new Error('No token');
      return apiClient.notifications.delete(id, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}