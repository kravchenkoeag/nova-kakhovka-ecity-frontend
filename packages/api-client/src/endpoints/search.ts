// packages/api-client/src/endpoints/search.ts

import type { User, Group, Event } from "@ecity/types";
import { ApiClient } from "../client";

export class SearchApi {
  constructor(private client: ApiClient) {}

  // Пошук користувачів
  async searchUsers(
    query: string,
    limit = 20,
    token?: string,
  ): Promise<{ users: User[]; count: number }> {
    const params = new URLSearchParams();
    params.append("q", query);
    params.append("limit", limit.toString());
    return this.client.get<{ users: User[]; count: number }>(
      `/api/v1/search/users?${params.toString()}`,
      token,
    );
  }

  // Пошук груп
  async searchGroups(
    query?: string,
    type?: string,
    limit = 20,
  ): Promise<{ groups: Group[]; count: number }> {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (type) params.append("type", type);
    params.append("limit", limit.toString());
    return this.client.get<{ groups: Group[]; count: number }>(
      `/api/v1/search/groups?${params.toString()}`,
    );
  }

  // Пошук подій
  async searchEvents(
    query?: string,
    category?: string,
    dateFrom?: string,
    page = 1,
    limit = 20,
  ): Promise<any> {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (category) params.append("category", category);
    if (dateFrom) params.append("date_from", dateFrom);
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    return this.client.get(`/api/v1/search/events?${params.toString()}`);
  }
}

