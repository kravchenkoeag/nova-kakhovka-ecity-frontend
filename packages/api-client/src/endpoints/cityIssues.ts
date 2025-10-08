// packages/api-client/src/endpoints/cityIssues.ts

import type { CityIssue, CreateCityIssueRequest, AddIssueCommentRequest, PaginatedResponse } from '@ecity/types';

interface CityIssueFilters {
  category?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}

export class CityIssuesApi {
  constructor(private client: ApiClient) {}

  async getAll(filters?: CityIssueFilters): Promise<PaginatedResponse<CityIssue>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, String(value));
      });
    }
    const query = params.toString();
    return this.client.get<PaginatedResponse<CityIssue>>(
      `/api/v1/city-issues${query ? `?${query}` : ''}`
    );
  }

  async getById(id: string): Promise<CityIssue> {
    return this.client.get<CityIssue>(`/api/v1/city-issues/${id}`);
  }

  async create(data: CreateCityIssueRequest, token: string): Promise<CityIssue> {
    return this.client.post<CityIssue>('/api/v1/city-issues', data, token);
  }

  async upvote(id: string, token: string): Promise<{ message: string }> {
    return this.client.post(`/api/v1/city-issues/${id}/upvote`, undefined, token);
  }

  async addComment(
    id: string,
    data: AddIssueCommentRequest,
    token: string
  ): Promise<any> {
    return this.client.post(`/api/v1/city-issues/${id}/comment`, data, token);
  }

  async subscribe(id: string, token: string): Promise<{ message: string }> {
    return this.client.post(`/api/v1/city-issues/${id}/subscribe`, undefined, token);
  }

  async unsubscribe(id: string, token: string): Promise<{ message: string }> {
    return this.client.delete(`/api/v1/city-issues/${id}/subscribe`, token);
  }
}
