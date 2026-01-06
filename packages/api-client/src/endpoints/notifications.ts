// packages/api-client/src/endpoints/notifications.ts

import type { Notification, PaginatedResponse } from "@ecity/types";
import { ApiClient } from "../client";

export class NotificationsApi {
  constructor(private client: ApiClient) {}

  // Отримати всі сповіщення
  async getAll(token: string, unreadOnly = false): Promise<any> {
    const query = unreadOnly ? "?unread_only=true" : "";
    return this.client.get(`/api/v1/notifications${query}`, token);
  }

  // Позначити як прочитане
  async markAsRead(id: string, token: string): Promise<{ message: string }> {
    return this.client.put(
      `/api/v1/notifications/${id}/read`,
      undefined,
      token,
    );
  }

  // Позначити всі як прочитані
  async markAllAsRead(token: string): Promise<{ message: string }> {
    return this.client.put("/api/v1/notifications/read-all", undefined, token);
  }

  // Видалити сповіщення
  async delete(id: string, token: string): Promise<{ message: string }> {
    return this.client.delete(`/api/v1/notifications/${id}`, token);
  }

  // Зареєструвати device token для push notifications
  async registerDeviceToken(
    deviceToken: string,
    platform: "ios" | "android" | "web",
    deviceId: string,
    authToken: string,
  ): Promise<{ message: string }> {
    return this.client.post(
      "/api/v1/device-tokens",
      {
        token: deviceToken,
        platform,
        device_id: deviceId,
      },
      authToken,
    );
  }

  // Відреєструвати device token
  async unregisterDeviceToken(
    deviceToken: string,
    authToken: string,
  ): Promise<{ message: string }> {
    return this.client.delete(`/api/v1/device-tokens/${deviceToken}`, authToken);
  }

  // Отримати налаштування сповіщень
  async getPreferences(authToken: string): Promise<{
    preferences: {
      email: boolean;
      push: boolean;
      sms: boolean;
      in_app: boolean;
      announcements: boolean;
      events: boolean;
      city_issues: boolean;
      polls: boolean;
      petitions: boolean;
    };
  }> {
    return this.client.get("/api/v1/notification-preferences", authToken);
  }

  // Оновити налаштування сповіщень
  async updatePreferences(
    preferences: Partial<{
      email: boolean;
      push: boolean;
      sms: boolean;
      in_app: boolean;
      announcements: boolean;
      events: boolean;
      city_issues: boolean;
      polls: boolean;
      petitions: boolean;
    }>,
    authToken: string,
  ): Promise<{ message: string }> {
    return this.client.put(
      "/api/v1/notification-preferences",
      preferences,
      authToken,
    );
  }

  // Відправити сповіщення (admin)
  async sendNotification(
    data: {
      user_ids: string[];
      title: string;
      body: string;
      type: "message" | "event" | "announcement" | "system" | "emergency";
      data?: Record<string, any>;
    },
    authToken: string,
  ): Promise<{ message: string; user_count: number }> {
    return this.client.post("/api/v1/notifications/send", data, authToken);
  }

  // Відправити екстрене сповіщення (admin)
  async sendEmergencyNotification(
    data: {
      title: string;
      body: string;
      data?: Record<string, any>;
    },
    authToken: string,
  ): Promise<{ message: string }> {
    return this.client.post("/api/v1/notifications/emergency", data, authToken);
  }
}
