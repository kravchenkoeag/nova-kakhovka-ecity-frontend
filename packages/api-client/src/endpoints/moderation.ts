// packages/api-client/src/endpoints/moderation.ts

import { ApiClient } from "../client";

export class ModerationApi {
  constructor(private client: ApiClient) {}

  // Оголошення - Схвалити
  async approveAnnouncement(
    id: string,
    token: string,
  ): Promise<{ message: string }> {
    return this.client.put(`/api/v1/announcements/${id}/approve`, undefined, token);
  }

  // Оголошення - Відхилити
  async rejectAnnouncement(
    id: string,
    reason: string,
    token: string,
  ): Promise<{ message: string }> {
    return this.client.put(`/api/v1/announcements/${id}/reject`, { reason }, token);
  }

  // Отримати очікуючі оголошення
  async getPendingAnnouncements(token: string): Promise<any> {
    return this.client.get("/api/v1/moderation/posts/pending", token);
  }

  // Події - Модерувати
  async moderateEvent(
    id: string,
    action: "approve" | "reject",
    reason?: string,
    token?: string,
  ): Promise<{ message: string; status: string }> {
    return this.client.put(
      `/api/v1/events/${id}/moderate`,
      { action, reason },
      token,
    );
  }

  // Проблеми міста - Оновити статус
  async updateIssueStatus(
    id: string,
    status: "pending" | "reported" | "in_progress" | "resolved" | "rejected",
    note?: string,
    token?: string,
  ): Promise<{ message: string; status: string }> {
    return this.client.put(
      `/api/v1/city-issues/${id}/status`,
      { status, note },
      token,
    );
  }

  // Проблеми міста - Призначити
  async assignIssue(
    id: string,
    assignedToId: string,
    note?: string,
    token?: string,
  ): Promise<{ message: string; assigned_to: string }> {
    return this.client.put(
      `/api/v1/city-issues/${id}/assign`,
      { assigned_to_id: assignedToId, note },
      token,
    );
  }

  // Опитування - Оновити статус
  async updatePollStatus(
    id: string,
    data: any,
    token: string,
  ): Promise<{ message: string }> {
    return this.client.put(`/api/v1/polls/${id}/status`, data, token);
  }

  // Опитування - Примусово видалити
  async forceDeletePoll(
    id: string,
    token: string,
  ): Promise<{ message: string }> {
    return this.client.delete(`/api/v1/polls/${id}/force`, token);
  }

  // Петиції - Оновити статус
  async updatePetitionStatus(
    id: string,
    status?: "open" | "closed" | "under_review" | "approved" | "rejected",
    response?: string,
    token?: string,
  ): Promise<{ message: string }> {
    return this.client.put(
      `/api/v1/petitions/${id}/status`,
      { status, response },
      token,
    );
  }

  // Користувачі - Заблокувати
  async banUser(
    userId: string,
    token: string,
  ): Promise<{ message: string; user_id: string }> {
    return this.client.post(`/api/v1/moderation/users/${userId}/ban`, undefined, token);
  }

  // Користувачі - Розблокувати
  async unbanUser(
    userId: string,
    token: string,
  ): Promise<{ message: string; user_id: string }> {
    return this.client.post(`/api/v1/moderation/users/${userId}/unban`, undefined, token);
  }
}

