// packages/api-client/src/endpoints/stats.ts

import { ApiClient } from "../client";

export class StatsApi {
  constructor(private client: ApiClient) {}

  // Отримати статистику користувачів
  async getUserStats(token: string): Promise<any> {
    return this.client.get("/api/v1/stats/user", token);
  }

  // Отримати статистику групи
  async getGroupStats(groupId: string, token: string): Promise<any> {
    return this.client.get(`/api/v1/stats/groups/${groupId}`, token);
  }

  // Отримати статистику платформи (moderator/admin)
  async getPlatformStats(token: string): Promise<any> {
    return this.client.get("/api/v1/stats/platform", token);
  }

  // Отримати аналітику користувачів (admin)
  async getUserAnalytics(token: string): Promise<any> {
    return this.client.get("/api/v1/analytics/users", token);
  }

  // Отримати аналітику контенту (admin)
  async getContentAnalytics(token: string): Promise<any> {
    return this.client.get("/api/v1/analytics/content", token);
  }

  // Отримати аналітику опитувань (admin)
  async getPollAnalytics(token: string): Promise<any> {
    return this.client.get("/api/v1/analytics/polls", token);
  }
}

