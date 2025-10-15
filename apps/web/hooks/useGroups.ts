// apps/web/hooks/useGroups.ts

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccessToken } from '@ecity/auth';
import { apiClient } from '@/lib/api-client';
import type { CreateGroupRequest } from '@ecity/types';

// Hook для отримання публічних груп

export function usePublicGroups() {
  return useQuery({
    queryKey: ['groups', 'public'],
    queryFn: () => apiClient.groups.getPublic(),
  });
}

// Hook для отримання моїх груп

export function useMyGroups() {
  const token = useAccessToken();

  return useQuery({
    queryKey: ['groups', 'my'],
    queryFn: () => {
      if (!token) throw new Error('No token');
      return apiClient.groups.getAll(token);
    },
    enabled: !!token,
  });
}

// Hook для отримання деталей групи
 
export function useGroup(id: string) {
  const token = useAccessToken();

  return useQuery({
    queryKey: ['groups', id],
    queryFn: () => {
      if (!token) throw new Error('No token');
      return apiClient.groups.getById(id, token);
    },
    enabled: !!id && !!token,
  });
}

// Hook для створення групи

export function useCreateGroup() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (data: CreateGroupRequest) => {
      if (!token) throw new Error('No token');
      return apiClient.groups.create(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

// Hook для приєднання до групи

export function useJoinGroup() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (groupId: string) => {
      if (!token) throw new Error('No token');
      return apiClient.groups.join(groupId, token);
    },
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: ['groups', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}