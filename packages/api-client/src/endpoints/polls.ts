// packages/api-client/src/endpoints/polls.ts

import type { Poll, CreatePollRequest, SubmitPollResponseRequest, PaginatedResponse } from '@ecity/types';
import { ApiClient } from '../client';

export class PollsApi {
  constructor(private client: ApiClient) {}

  // Отримати список опитувань
  async getAll(page = 1, limit = 20): Promise<PaginatedResponse<Poll>> {
    return this.client.get<PaginatedResponse<Poll>>(
      `/api/v1/polls?page=${page}&limit=${limit}`
    );
  }

  // Отримати опитування за ID
  async getById(id: string): Promise<Poll> {
    return this.client.get<Poll>(`/api/v1/polls/${id}`);
  }

  // Відправити відповідь на опитування
  async submitResponse(
    id: string,
    data: SubmitPollResponseRequest,
    token: string
  ): Promise<{ message: string; response_id: string }> {
    return this.client.post(`/api/v1/polls/${id}/respond`, data, token);
  }

  // Отримати результати опитування
  async getResults(id: string, token: string): Promise<any> {
    return this.client.get(`/api/v1/polls/${id}/results`, token);
  }

  // Створити опитування (admin)
  async create(data: CreatePollRequest, token: string): Promise<Poll> {
    return this.client.post<Poll>('/api/v1/admin/polls', data, token);
  }

  // Опублікувати опитування (admin)
  async publish(id: string, token: string): Promise<{ message: string }> {
    return this.client.put(`/api/v1/admin/polls/${id}/publish`, undefined, token);
  }

  // Закрити опитування (admin)
  async close(id: string, token: string): Promise<{ message: string }> {
    return this.client.put(`/api/v1/admin/polls/${id}/close`, undefined, token);
  }
}