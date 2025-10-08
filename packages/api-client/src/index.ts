// packages/api-client/src/index.ts

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

// Singleton instance
export const createApiClient = (baseUrl: string) => {
  return new EcityApiClient(baseUrl);
};

export * from './endpoints/auth';
export * from './endpoints/groups';
export * from './endpoints/events';
export * from './endpoints/announcements';
export * from './endpoints/petitions';
export * from './endpoints/polls';
export * from './endpoints/cityIssues';
export * from './endpoints/transport';
export * from './endpoints/notifications';