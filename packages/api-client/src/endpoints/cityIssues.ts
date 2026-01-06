// packages/api-client/src/endpoints/cityIssues.ts

import type {
  CityIssue,
  CreateCityIssueRequest,
  AddIssueCommentRequest,
  PaginatedResponse,
} from "@ecity/types";
import { ApiClient } from "../client";

interface CityIssueFilters {
  category?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}

export class CityIssuesApi {
  constructor(private client: ApiClient) {}

  // Отримати список проблем міста з фільтрами
  async getAll(
    filters?: CityIssueFilters,
  ): Promise<PaginatedResponse<CityIssue>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const query = params.toString();
    return this.client.get<PaginatedResponse<CityIssue>>(
      `/api/v1/city-issues${query ? `?${query}` : ""}`,
    );
  }

  // Отримати проблему за ID
  async getById(id: string): Promise<CityIssue> {
    return this.client.get<CityIssue>(`/api/v1/city-issues/${id}`);
  }

  // Створити повідомлення про проблему
  async create(
    data: CreateCityIssueRequest,
    token: string,
  ): Promise<CityIssue> {
    return this.client.post<CityIssue>("/api/v1/city-issues", data, token);
  }

  // Оновити проблему міста
  async update(
    id: string,
    data: Partial<CreateCityIssueRequest>,
    token: string,
  ): Promise<{ message: string }> {
    return this.client.put(`/api/v1/city-issues/${id}`, data, token);
  }

  // Проголосувати за проблему (upvote)
  async upvote(id: string, token: string): Promise<{ message: string }> {
    return this.client.post(
      `/api/v1/city-issues/${id}/upvote`,
      undefined,
      token,
    );
  }

  // Додати коментар
  async addComment(
    id: string,
    data: AddIssueCommentRequest,
    token: string,
  ): Promise<any> {
    return this.client.post(`/api/v1/city-issues/${id}/comment`, data, token);
  }

  // Підписатися на оновлення
  async subscribe(id: string, token: string): Promise<{ message: string }> {
    return this.client.post(
      `/api/v1/city-issues/${id}/subscribe`,
      undefined,
      token,
    );
  }

  // Відписатися від оновлень
  async unsubscribe(id: string, token: string): Promise<{ message: string }> {
    return this.client.delete(`/api/v1/city-issues/${id}/subscribe`, token);
  }
}
