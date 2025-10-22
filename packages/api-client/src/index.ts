// packages/api-client/src/index.ts

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
export const createApiClient = (baseUrl: string, useProxy = false) => {
  return new EcityApiClient(baseUrl, useProxy);
};

// Експорт всіх модулів
export { ApiClient } from "./client";
export * from "./endpoints/auth";
export * from "./endpoints/groups";
export * from "./endpoints/events";
export * from "./endpoints/announcements";
export * from "./endpoints/petitions";
export * from "./endpoints/polls";
export * from "./endpoints/cityIssues";
export * from "./endpoints/transport";
export * from "./endpoints/notifications";
