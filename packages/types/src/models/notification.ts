// packages/types/src/models/notification.ts

export interface Notification {
  id: ObjectId;
  user_id: ObjectId;
  title: string;
  body: string;
  type: 'message' | 'event' | 'announcement' | 'system' | 'emergency';
  related_id?: ObjectId;
  data?: Record<string, any>;
  is_read: boolean;
  is_sent: boolean;
  created_at: string;
  read_at?: string;
}
