// packages/api-client/src/endpoints/petitions.ts

import type {
  Petition,
  CreatePetitionRequest,
  SignPetitionRequest,
  PaginatedResponse,
} from "@ecity/types";
import { ApiClient } from "../client";

interface PetitionFilters {
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export class PetitionsApi {
  constructor(private client: ApiClient) {}

  // Отримати список петицій з фільтрами
  async getAll(
    filters?: PetitionFilters,
  ): Promise<PaginatedResponse<Petition>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const query = params.toString();
    return this.client.get<PaginatedResponse<Petition>>(
      `/api/v1/petitions${query ? `?${query}` : ""}`,
    );
  }

  // Отримати петицію за ID
  async getById(id: string): Promise<Petition> {
    return this.client.get<Petition>(`/api/v1/petitions/${id}`);
  }

  // Створити нову петицію
  async create(data: CreatePetitionRequest, token: string): Promise<Petition> {
    return this.client.post<Petition>("/api/v1/petitions", data, token);
  }

  // Підписати петицію
  async sign(
    id: string,
    data: SignPetitionRequest,
    token: string,
  ): Promise<{ message: string }> {
    return this.client.post(`/api/v1/petitions/${id}/sign`, data, token);
  }

  // Опублікувати петицію (admin)
  async publish(id: string, token: string): Promise<{ message: string }> {
    return this.client.put(`/api/v1/petitions/${id}/publish`, undefined, token);
  }

  // Видалити петицію (admin)
  async delete(id: string, token: string): Promise<{ message: string }> {
    return this.client.delete(`/api/v1/petitions/${id}`, token);
  }
}
