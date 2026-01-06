// packages/api-client/src/endpoints/transport.ts

import type {
  TransportRoute,
  TransportVehicle,
  CreateRouteRequest,
} from "@ecity/types";
import { ApiClient } from "../client";

export class TransportApi {
  constructor(private client: ApiClient) {}

  // Отримати список маршрутів транспорту
  async getRoutes(): Promise<TransportRoute[]> {
    return this.client.get<TransportRoute[]>("/api/v1/transport/routes");
  }

  // Отримати маршрут за ID
  async getRoute(id: string): Promise<TransportRoute> {
    return this.client.get<TransportRoute>(`/api/v1/transport/routes/${id}`);
  }

  // Отримати live відстеження транспорту
  async getLiveTracking(routeId: string): Promise<{ live_vehicles: any[] }> {
    return this.client.get(`/api/v1/transport/live?route_id=${routeId}`);
  }

  // Отримати найближчі зупинки
  async getNearbyStops(lat: number, lng: number, radius = 1): Promise<any> {
    return this.client.get(
      `/api/v1/transport/stops/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
    );
  }

  // Отримати прибуття на зупинку
  async getArrivals(
    stop: string,
    route?: string,
    limit = 10,
  ): Promise<any> {
    const params = new URLSearchParams();
    params.append("stop", stop);
    if (route) params.append("route", route);
    params.append("limit", limit.toString());
    return this.client.get(`/api/v1/transport/arrivals?${params.toString()}`);
  }

  // Створити маршрут (admin)
  async createRoute(
    data: CreateRouteRequest,
    token: string,
  ): Promise<TransportRoute> {
    return this.client.post<TransportRoute>(
      "/api/v1/transport/routes",
      data,
      token,
    );
  }

  // Оновити маршрут (admin)
  async updateRoute(
    id: string,
    data: Partial<CreateRouteRequest>,
    token: string,
  ): Promise<TransportRoute> {
    return this.client.put<TransportRoute>(
      `/api/v1/transport/routes/${id}`,
      data,
      token,
    );
  }

  // Видалити маршрут (admin)
  async deleteRoute(
    id: string,
    token: string,
  ): Promise<{ message: string }> {
    return this.client.delete(`/api/v1/transport/routes/${id}`, token);
  }

  // Отримати список транспортних засобів (admin)
  async getVehicles(
    routeId?: string,
    token?: string,
  ): Promise<TransportVehicle[]> {
    const query = routeId ? `?route_id=${routeId}` : "";
    return this.client.get<TransportVehicle[]>(
      `/api/v1/transport/vehicles${query}`,
      token,
    );
  }

  // Створити транспортний засіб (admin)
  async createVehicle(
    data: any,
    token: string,
  ): Promise<TransportVehicle> {
    return this.client.post<TransportVehicle>(
      "/api/v1/transport/vehicles",
      data,
      token,
    );
  }

  // Оновити транспортний засіб (admin)
  async updateVehicle(
    id: string,
    data: Partial<any>,
    token: string,
  ): Promise<TransportVehicle> {
    return this.client.put<TransportVehicle>(
      `/api/v1/transport/vehicles/${id}`,
      data,
      token,
    );
  }

  // Видалити транспортний засіб (admin)
  async deleteVehicle(
    id: string,
    token: string,
  ): Promise<{ message: string }> {
    return this.client.delete(`/api/v1/transport/vehicles/${id}`, token);
  }

  // Оновити локацію транспортного засобу (admin/driver)
  async updateVehicleLocation(
    id: string,
    data: {
      location: { type: string; coordinates: [number, number] };
      speed?: number;
      heading?: number;
    },
    token: string,
  ): Promise<{ message: string }> {
    return this.client.put(
      `/api/v1/transport/vehicles/${id}/location`,
      data,
      token,
    );
  }
}
