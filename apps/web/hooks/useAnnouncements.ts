// apps/web/hooks/useAnnouncements.ts

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccessToken } from '@ecity/auth';
import { apiClient } from '@/lib/api-client';
import type { CreateAnnouncementRequest } from '@ecity/types';

// Hook для отримання оголошень
export function useAnnouncements(filters?: any) {
  return useQuery({
    queryKey: ['announcements', filters],
    queryFn: () => apiClient.announcements.getAll(filters),
  });
}

// Hook для отримання деталей оголошення
export function useAnnouncement(id: string) {
  return useQuery({
    queryKey: ['announcements', id],
    queryFn: () => apiClient.announcements.getById(id),
    enabled: !!id,
  });
}

// Hook для створення оголошення
export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (data: CreateAnnouncementRequest) => {
      if (!token) throw new Error('No token');
      return apiClient.announcements.create(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}
