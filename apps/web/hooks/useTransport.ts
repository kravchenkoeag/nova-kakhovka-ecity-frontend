// apps/web/hooks/useTransport.ts

'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

// Отримати всі маршрути транспорту
export function useTransportRoutes() {
  return useQuery({
    queryKey: ['transport', 'routes'],
    queryFn: () => apiClient.transport.getRoutes(),
  });
}

// Отримати конкретний маршрут
export function useTransportRoute(id: string) {
  return useQuery({
    queryKey: ['transport', 'routes', id],
    queryFn: () => apiClient.transport.getRoute(id),
    enabled: !!id,
  });
}

// Отримати live відстеження транспорту
export function useLiveTracking(routeId: string, enabled = true) {
  return useQuery({
    queryKey: ['transport', 'live', routeId],
    queryFn: () => apiClient.transport.getLiveTracking(routeId),
    enabled: !!routeId && enabled,
    refetchInterval: 10000, // Оновлювати кожні 10 секунд
  });
}

// Отримати найближчі зупинки
export function useNearbyStops(lat?: number, lng?: number, radius = 1) {
  return useQuery({
    queryKey: ['transport', 'stops', 'nearby', lat, lng, radius],
    queryFn: () => {
      if (!lat || !lng) throw new Error('Location required');
      return apiClient.transport.getNearbyStops(lat, lng, radius);
    },
    enabled: !!lat && !!lng,
  });
}