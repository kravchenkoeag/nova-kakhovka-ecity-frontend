// apps/admin/hooks/useUsers.ts

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccessToken } from '@ecity/auth';
import { apiClient } from '@/lib/api-client';
import type { User } from '@ecity/types';

/ Hook для отримання списку користувачів
export function useUsers() {
  const token = useAccessToken();

  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      if (!token) throw new Error('No token');
      // TODO: Додати ендпоінт в api-client для отримання всіх користувачів
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
    enabled: !!token,
  });
}

// Hook для блокування/розблокування користувача
export function useBlockUser() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: async ({
      userId,
      block,
    }: {
      userId: string;
      block: boolean;
    }) => {
      if (!token) throw new Error('No token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users/${userId}/block`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ is_blocked: block }),
        }
      );
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });