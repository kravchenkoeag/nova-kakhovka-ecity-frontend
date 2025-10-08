// packages/types/src/models/message.ts

export interface MessageReaction {
  user_id: ObjectId;
  reaction: string;
  added_at: string;
}

export interface MessageRead {
  user_id: ObjectId;
  read_at: string;
}

export interface Message {
  id: ObjectId;
  group_id: ObjectId;
  user_id: ObjectId;
  content: string;
  type: 'text' | 'image' | 'video' | 'file' | 'link';
  media_url?: string;
  media_type?: string;
  media_size?: number;
  reply_to_id?: ObjectId;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  reactions?: MessageReaction[];
  read_by?: MessageRead[];
}
