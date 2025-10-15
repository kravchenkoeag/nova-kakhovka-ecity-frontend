// packages/api-client/src/endpoints/announcements.ts

import type { Announcement, CreateAnnouncementRequest, PaginatedResponse } from '@ecity/types';
import { ApiClient } from '../client';

interface AnnouncementFilters {
  category?: string;
  employment?: string;
  page?: number;
  limit?: number;
}

export class AnnouncementsApi {
  constructor(private client: ApiClient) {}

  // Отримати список оголошень з фільтрами
  async getAll(filters?: AnnouncementFilters): Promise<PaginatedResponse<Announcement>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const query = params.toString();
    return this.client.get<PaginatedResponse<Announcement>>(
      `/api/v1/announcements${query ? `?${query}` : ''}`
    );
  }

  // Отримати оголошення за ID
  async getById(id: string): Promise<Announcement> {
    return this.client.get<Announcement>(`/api/v1/announcements/${id}`);
  }

  // Створити нове оголошення
  async create(data: CreateAnnouncementRequest, token: string): Promise<Announcement> {
    return this.client.post<Announcement>('/api/v1/announcements', data, token);
  }

  // Оновити оголошення
  async update(
    id: string,
    data: Partial<CreateAnnouncementRequest>,
    token: string
  ): Promise<{ message: string }> {
    return this.client.put(`/api/v1/announcements/${id}`, data, token);
  }

  // Видалити оголошення
  async delete(id: string, token: string): Promise<{ message: string }> {
    return this.client.delete(`/api/v1/announcements/${id}`, token);
  }

  // Зв'язатися з власником
  async contactOwner(id: string, token: string): Promise<{ message: string }> {
    return this.client.post(`/api/v1/announcements/${id}/contact`, undefined, token);
  }
}