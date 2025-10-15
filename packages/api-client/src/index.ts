// packages/api-client/src/index.ts

import { ApiClient } from './client';
import { AuthApi } from './endpoints/auth';
import { GroupsApi } from './endpoints/groups';
import { EventsApi } from './endpoints/events';
import { AnnouncementsApi } from './endpoints/announcements';
import { PetitionsApi } from './endpoints/petitions';
import { PollsApi } from './endpoints/polls';
import { CityIssuesApi } from './endpoints/cityIssues';
import { TransportApi } from './endpoints/transport';
import { NotificationsApi } from './endpoints/notifications';

/**
 * Головний клієнт API для Nova Kakhovka e-City
 * Об'єднує всі ендпоінти в один зручний інтерфейс
 */
export class EcityApiClient {
  public auth: AuthApi;
  public groups: GroupsApi;
  public events: EventsApi;
  public announcements: AnnouncementsApi;
  public petitions: PetitionsApi;
  public polls: PollsApi;
  public cityIssues: CityIssuesApi;
  public transport: TransportApi;
  public notifications: NotificationsApi;

  constructor(baseUrl: string) {
    const client = new ApiClient(baseUrl);

    // Ініціалізація всіх API модулів
    this.auth = new AuthApi(client);
    this.groups = new GroupsApi(client);
    this.events = new EventsApi(client);
    this.announcements = new AnnouncementsApi(client);
    this.petitions = new PetitionsApi(client);
    this.polls = new PollsApi(client);
    this.cityIssues = new CityIssuesApi(client);
    this.transport = new TransportApi(client);
    this.notifications = new NotificationsApi(client);
  }
}

/**
 * Фабрика для створення екземпляра API клієнта
 * @param baseUrl - базова URL backend API
 * @returns екземпляр EcityApiClient
 */
export const createApiClient = (baseUrl: string) => {
  return new EcityApiClient(baseUrl);
};

// Експорт всіх модулів
export { ApiClient } from './client';
export * from './endpoints/auth';
export * from './endpoints/groups';
export * from './endpoints/events';
export * from './endpoints/announcements';
export * from './endpoints/petitions';
export * from './endpoints/polls';
export * from './endpoints/cityIssues';
export * from './endpoints/transport';
export * from './endpoints/notifications';