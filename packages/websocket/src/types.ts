// packages/websocket/src/types.ts

// Типи для чат повідомлень
export interface ChatMessage {
  id: string;
  group_id: string;
  user_id: string;
  user_name: string;
  content: string;
  timestamp: string;
}

// Типи для typing індикатора
export interface TypingIndicator {
  group_id: string;
  user_id: string;
  user_name: string;
  is_typing: boolean;
}

// Типи для user joined/left
export interface UserPresence {
  group_id: string;
  user_id: string;
  user_name: string;
  action: "joined" | "left";
}

// Типи для notifications
export interface WSNotification {
  id: string;
  type: "message" | "event" | "announcement" | "system";
  title: string;
  body: string;
  timestamp: string;
}
