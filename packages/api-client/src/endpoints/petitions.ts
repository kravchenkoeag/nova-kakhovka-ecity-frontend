// packages/api-client/src/endpoints/petitions.ts

import type { Petition, CreatePetitionRequest, SignPetitionRequest, PaginatedResponse } from '@ecity/types';

interface PetitionFilters {
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export class PetitionsApi {
  constructor(private client: ApiClient) {}

  async getAll(filters?: PetitionFilters): Promise<PaginatedResponse<Petition>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const query = params.toString();
    return this.client.get<PaginatedResponse<Petition>>(
      `/api/v1/petitions${query ? `?${query}` : ''}`
    );
  }

  async getById(id: string): Promise<Petition> {
    return this.client.get<Petition>(`/api/v1/petitions/${id}`);
  }

  async create(data: CreatePetitionRequest, token: string): Promise<Petition> {
    return this.client.post<Petition>('/api/v1/petitions', data, token);
  }

  async sign(id: string, data: SignPetitionRequest, token: string): Promise<{ message: string }> {
    return this.client.post(`/api/v1/petitions/${id}/sign`, data, token);
  }

  async publish(id: string, token: string): Promise<{ message: string }> {
    return this.client.put(`/api/v1/petitions/${id}/publish`, undefined, token);
  }

  async delete(id: string, token: string): Promise<{ message: string }> {
    return this.client.delete(`/api/v1/petitions/${id}`, token);
  }
}
