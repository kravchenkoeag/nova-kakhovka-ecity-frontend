// packages/api-client/src/endpoints/groups.ts

import type { Group, CreateGroupRequest } from "@ecity/types";
import { ApiClient } from "../client";

export class GroupsApi {
  constructor(private client: ApiClient) {}

  // Отримати всі групи користувача
  async getAll(token: string): Promise<Group[]> {
    return this.client.get<Group[]>("/api/v1/groups", token);
  }

  // Отримати публічні групи
  async getPublic(): Promise<Group[]> {
    return this.client.get<Group[]>("/api/v1/groups/public");
  }

  // Отримати групу за ID
  async getById(id: string, token: string): Promise<Group> {
    return this.client.get<Group>(`/api/v1/groups/${id}`, token);
  }

  // Створити нову групу
  async create(data: CreateGroupRequest, token: string): Promise<Group> {
    return this.client.post<Group>("/api/v1/groups", data, token);
  }

  // Приєднатися до групи
  async join(id: string, token: string): Promise<{ message: string }> {
    return this.client.post(`/api/v1/groups/${id}/join`, undefined, token);
  }

  // Покинути групу
  async leave(id: string, token: string): Promise<{ message: string }> {
    return this.client.post(`/api/v1/groups/${id}/leave`, undefined, token);
  }
}
