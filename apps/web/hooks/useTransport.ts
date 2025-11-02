// apps/web/hooks/useTransport.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api"; // ✅ ВИПРАВЛЕНО: змінено імпорт з api-client на api

/**
 * Hooks для роботи з громадським транспортом
 * Публічні endpoints, не вимагають авторизації
 */

/**
 * Hook для отримання списку маршрутів громадського транспорту
 * Публічний endpoint, не вимагає авторизації
 */
export function useRoutes() {
  return useQuery({
    queryKey: ["transport", "routes"],
    queryFn: () => apiClient.transport.getRoutes(),
  });
}

/**
 * Hook для отримання деталей конкретного маршруту
 * Включає інформацію про зупинки, розклад та поточні автобуси
 * @param routeId - ідентифікатор маршруту
 */
export function useRoute(routeId: string) {
  return useQuery({
    queryKey: ["transport", "routes", routeId],
    queryFn: () => apiClient.transport.getRoute(routeId), // ✅ ВИПРАВЛЕНО: getRoute замість getRouteById
    enabled: !!routeId,
  });
}

/**
 * Hook для отримання live відстеження транспорту на маршруті
 * Показує поточне положення автобусів/тролейбусів в реальному часі
 * @param routeId - ідентифікатор маршруту
 */
export function useLiveTracking(routeId: string) {
  return useQuery({
    queryKey: ["transport", "routes", routeId, "live"],
    queryFn: () => {
      if (!routeId) throw new Error("No route ID");
      return apiClient.transport.getLiveTracking(routeId);
    },
    enabled: !!routeId,
    refetchInterval: 10000, // Оновлювати кожні 10 секунд для актуальних даних
  });
}

/**
 * Hook для отримання найближчих зупинок
 * @param lat - широта
 * @param lng - довгота
 * @param radius - радіус пошуку в км (за замовчуванням 1 км)
 */
export function useNearbyStops(lat?: number, lng?: number, radius = 1) {
  return useQuery({
    queryKey: ["transport", "stops", "nearby", lat, lng, radius],
    queryFn: () => {
      if (!lat || !lng) throw new Error("Coordinates required");
      return apiClient.transport.getNearbyStops(lat, lng, radius);
    },
    enabled: !!lat && !!lng,
  });
}
