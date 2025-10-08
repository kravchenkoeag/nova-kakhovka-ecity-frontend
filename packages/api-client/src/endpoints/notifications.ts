// packages/api-client/src/endpoints/notifications.ts

import type { Notification, PaginatedResponse } from '@ecity/types';

export class NotificationsApi {
  constructor(private client: ApiClient) {}

  async getAll(token: string, unreadOnly = false): Promise<any> {
    const query = unreadOnly ? '?unread_only=true' : '';
    return this.client.get(`/api/v1/notifications${query}`, token);
  }

  async markAsRead(id: string, token: string): Promise<{ message: string }> {
    return this.client.put(`/api/v1/notifications/${id}/read`, undefined, token);
  }

  async markAllAsRead(token: string): Promise<{ message: string }> {
    return this.client.put('/api/v1/notifications/read-all', undefined, token);
  }

  async delete(id: string, token: string): Promise<{ message: string }> {
    return this.client.delete(`/api/v1/notifications/${id}`, token);
  }

  async registerDeviceToken(
    fcmToken: string,
    platform: string,
    token: string
  ): Promise<{ message: string }> {
    return this.client.post(
      '/api/v1/notifications/register-token',
      { fcm_token: fcmToken, platform },
      token
    );
  }
}