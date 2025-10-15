// apps/web/hooks/useProfile.ts

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccessToken } from '@ecity/auth';
import { apiClient } from '@/lib/api-client';
import type { User } from '@ecity/types';

// Отримати профіль поточного користувача
export function useProfile() {
  const token = useAccessToken();

  return useQuery({
    queryKey: ['profile'],
    queryFn: () => {
      if (!token) throw new Error('No token');
      return apiClient.auth.getProfile(token);
    },
    enabled: !!token,
  });
}

// Оновити профіль
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (data: Partial<User>) => {
      if (!token) throw new Error('No token');
      return apiClient.auth.updateProfile(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}