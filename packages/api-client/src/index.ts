// File: packages/api-client/src/index.ts
// Повна версія з EcityApiClient класом та createApiClient функцією

import { ApiClient } from "./client";
import { AuthApi } from "./endpoints/auth";
import { GroupsApi } from "./endpoints/groups";
import { EventsApi } from "./endpoints/events";
import { AnnouncementsApi } from "./endpoints/announcements";
import { PetitionsApi } from "./endpoints/petitions";
import { PollsApi } from "./endpoints/polls";
import { CityIssuesApi } from "./endpoints/cityIssues";
import { TransportApi } from "./endpoints/transport";
import { NotificationsApi } from "./endpoints/notifications";
import { UsersApi } from "./endpoints/users"; // NEW

/**
 * Головний клієнт API для Nova Kakhovka e-City
 * Об'єднує всі ендпоінти в один зручний інтерфейс
 *
 * Підтримує два режими:
 * 1. Direct mode - прямі запити до backend
 * 2. Proxy mode - запити через Next.js API proxy (рекомендовано)
 */
export class EcityApiClient {
  private client: ApiClient;

  public auth: AuthApi;
  public groups: GroupsApi;
  public events: EventsApi;
  public announcements: AnnouncementsApi;
  public petitions: PetitionsApi;
  public polls: PollsApi;
  public cityIssues: CityIssuesApi;
  public transport: TransportApi;
  public notifications: NotificationsApi;
  public users: UsersApi; // NEW

  /**
   * @param baseUrl - базова URL backend API
   * @param useProxy - чи використовувати Next.js proxy (рекомендовано для production)
   */
  constructor(baseUrl: string, useProxy = false) {
    this.client = new ApiClient(baseUrl, useProxy);

    // Ініціалізація всіх API модулів
    this.auth = new AuthApi(this.client);
    this.groups = new GroupsApi(this.client);
    this.events = new EventsApi(this.client);
    this.announcements = new AnnouncementsApi(this.client);
    this.petitions = new PetitionsApi(this.client);
    this.polls = new PollsApi(this.client);
    this.cityIssues = new CityIssuesApi(this.client);
    this.transport = new TransportApi(this.client);
    this.notifications = new NotificationsApi(this.client);
    this.users = new UsersApi(this.client); // NEW
  }

  /**
   * Перемикання режиму proxy
   */
  setProxyMode(useProxy: boolean): void {
    this.client.setProxyMode(useProxy);
  }

  /**
   * Перевірка чи використовується proxy
   */
  isProxyMode(): boolean {
    return this.client.isProxyMode();
  }
}

/**
 * Фабрика для створення екземпляра API клієнта
 *
 * @param baseUrl - базова URL backend API
 * @param useProxy - чи використовувати Next.js proxy
 * @returns екземпляр EcityApiClient
 *
 * @example
 * // Для admin панелі (з proxy)
 * const apiClient = createApiClient('http://localhost:8080', true);
 *
 * @example
 * // Для web додатку (з proxy)
 * const apiClient = createApiClient('http://localhost:8080', true);
 *
 * @example
 * // Для прямих запитів (development)
 * const apiClient = createApiClient('http://localhost:8080', false);
 */
export const createApiClient = (
  baseUrl: string,
  useProxy = false,
): EcityApiClient => {
  return new EcityApiClient(baseUrl, useProxy);
};

// Експорт основних класів
export { ApiClient };

// Експорт окремих API класів
export { AuthApi } from "./endpoints/auth";
export { GroupsApi } from "./endpoints/groups";
export { EventsApi } from "./endpoints/events";
export { AnnouncementsApi } from "./endpoints/announcements";
export { PetitionsApi } from "./endpoints/petitions";
export { PollsApi } from "./endpoints/polls";
export { CityIssuesApi } from "./endpoints/cityIssues";
export { TransportApi } from "./endpoints/transport";
export { NotificationsApi } from "./endpoints/notifications";
export { UsersApi } from "./endpoints/users"; // NEW

// Експорт типів з endpoints
export type * from "./endpoints/auth";
export type * from "./endpoints/groups";
export type * from "./endpoints/events";
export type * from "./endpoints/announcements";
export type * from "./endpoints/petitions";
export type * from "./endpoints/polls";
export type * from "./endpoints/cityIssues";
export type * from "./endpoints/transport";
export type * from "./endpoints/notifications";
export type * from "./endpoints/users"; // NEW
