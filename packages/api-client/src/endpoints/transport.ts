// packages/api-client/src/endpoints/transport.ts

import type { TransportRoute, TransportVehicle, CreateRouteRequest } from '@ecity/types';

export class TransportApi {
  constructor(private client: ApiClient) {}

  async getRoutes(): Promise<TransportRoute[]> {
    return this.client.get<TransportRoute[]>('/api/v1/transport/routes');
  }

  async getRoute(id: string): Promise<TransportRoute> {
    return this.client.get<TransportRoute>(`/api/v1/transport/routes/${id}`);
  }

  async getLiveTracking(routeId: string): Promise<{ live_vehicles: any[] }> {
    return this.client.get(`/api/v1/transport/live?route_id=${routeId}`);
  }

  async getNearbyStops(lat: number, lng: number, radius = 1): Promise<any> {
    return this.client.get(
      `/api/v1/transport/stops/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    );
  }

  // Admin only
  async createRoute(data: CreateRouteRequest, token: string): Promise<TransportRoute> {
    return this.client.post<TransportRoute>('/api/v1/admin/transport/routes', data, token);
  }

  async getVehicles(routeId?: string, token?: string): Promise<TransportVehicle[]> {
    const query = routeId ? `?route_id=${routeId}` : '';
    return this.client.get<TransportVehicle[]>(
      `/api/v1/admin/transport/vehicles${query}`,
      token
    );
  }
}
