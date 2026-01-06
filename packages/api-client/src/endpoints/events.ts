// packages/api-client/src/endpoints/events.ts

import type {
  Event,
  CreateEventRequest,
  PaginatedResponse,
  User,
} from "@ecity/types";
import { ApiClient } from "../client";

interface EventFilters {
  category?: string;
  start_date?: string;
  end_date?: string;
  is_online?: boolean;
  page?: number;
  limit?: number;
}

export class EventsApi {
  constructor(private client: ApiClient) {}

  // Отримати список подій з фільтрами
  async getAll(filters?: EventFilters): Promise<PaginatedResponse<Event>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const query = params.toString();
    return this.client.get<PaginatedResponse<Event>>(
      `/api/v1/events${query ? `?${query}` : ""}`,
    );
  }

  // Отримати подію за ID
  async getById(id: string): Promise<Event> {
    return this.client.get<Event>(`/api/v1/events/${id}`);
  }

  // Створити нову подію
  async create(data: CreateEventRequest, token: string): Promise<Event> {
    return this.client.post<Event>("/api/v1/events", data, token);
  }

  // Оновити подію
  async update(
    id: string,
    data: Partial<CreateEventRequest>,
    token: string,
  ): Promise<{ message: string }> {
    return this.client.put(`/api/v1/events/${id}`, data, token);
  }

  // Видалити подію
  async delete(id: string, token: string): Promise<{ message: string }> {
    return this.client.delete(`/api/v1/events/${id}`, token);
  }

  // Приєднатися до події
  async join(id: string, token: string): Promise<{ message: string }> {
    return this.client.post(`/api/v1/events/${id}/join`, undefined, token);
  }

  // Покинути подію
  async leave(id: string, token: string): Promise<{ message: string }> {
    return this.client.post(`/api/v1/events/${id}/leave`, undefined, token);
  }

  // Отримати учасників події
  async getParticipants(
    id: string,
    token: string,
  ): Promise<{ participants: User[]; count: number }> {
    return this.client.get(`/api/v1/events/${id}/participants`, token);
  }
}
