// packages/api-client/src/endpoints/groups.ts

import type { Group, CreateGroupRequest, PaginatedResponse } from '@ecity/types';

export class GroupsApi {
  constructor(private client: ApiClient) {}

  async getAll(token: string): Promise<Group[]> {
    return this.client.get<Group[]>('/api/v1/groups', token);
  }

  async getPublic(): Promise<Group[]> {
    return this.client.get<Group[]>('/api/v1/groups/public');
  }

  async getById(id: string, token: string): Promise<Group> {
    return this.client.get<Group>(`/api/v1/groups/${id}`, token);
  }

  async create(data: CreateGroupRequest, token: string): Promise<Group> {
    return this.client.post<Group>('/api/v1/groups', data, token);
  }

  async join(id: string, token: string): Promise<{ message: string }> {
    return this.client.post(`/api/v1/groups/${id}/join`, undefined, token);
  }

  async leave(id: string, token: string): Promise<{ message: string }> {
    return this.client.post(`/api/v1/groups/${id}/leave`, undefined, token);
  }
}