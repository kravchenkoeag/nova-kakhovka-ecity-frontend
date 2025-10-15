// apps/web/hooks/useEvents.ts

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccessToken } from '@ecity/auth';
import { apiClient } from '@/lib/api-client';
import type { CreateEventRequest } from '@ecity/types';

// Hook для отримання списку подій
export function useEvents(filters?: any) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: () => apiClient.events.getAll(filters),
  });
}

// Hook для отримання деталей події
export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => apiClient.events.getById(id),
    enabled: !!id,
  });
}

// Hook для створення події
export function useCreateEvent() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (data: CreateEventRequest) => {
      if (!token) throw new Error('No token');
      return apiClient.events.create(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// Hook для приєднання до події
export function useJoinEvent() {
  const queryClient = useQueryClient();
  const token = useAccessToken();

  return useMutation({
    mutationFn: (eventId: string) => {
      if (!token) throw new Error('No token');
      return apiClient.events.join(eventId, token);
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}