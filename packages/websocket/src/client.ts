// packages/websocket/src/client.ts

import type { Message } from '@ecity/types';

// Типи WebSocket повідомлень
export type WSMessageType = 
  | 'message'
  | 'typing'
  | 'user_joined'
  | 'user_left'
  | 'notification';

export interface WSMessage {
  type: WSMessageType;
  data: any;
  timestamp: string;
}

// Конфігурація WebSocket клієнта

interface WebSocketConfig {
  url: string;
  token: string;
  onMessage?: (message: WSMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

// WebSocket клієнт для real-time комунікації

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isManualClose = false;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      ...config,
    };
  }

 // Підключення до WebSocket сервера
  
  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isManualClose = false;
    const wsUrl = `${this.config.url}?token=${this.config.token}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.config.onConnect?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          this.config.onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.config.onError?.(error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.config.onDisconnect?.();

        if (!this.isManualClose) {
          this.reconnect();
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.reconnect();
    }
  }

  // Відправка повідомлення

  send(type: WSMessageType, data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: WSMessage = {
        type,
        data,
        timestamp: new Date().toISOString(),
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  // Відправка чат повідомлення
   
  sendMessage(groupId: string, content: string) {
    this.send('message', { group_id: groupId, content });
  }

  // Індикатор набору тексту
  
  sendTyping(groupId: string, isTyping: boolean) {
    this.send('typing', { group_id: groupId, is_typing: isTyping });
  }

  // Автоматичне перепідключення
  
  private reconnect() {
    if (
      this.reconnectAttempts >= (this.config.maxReconnectAttempts || 5) ||
      this.isManualClose
    ) {
      console.log('Max reconnect attempts reached or manual close');
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `Reconnecting... (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`
    );

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, this.config.reconnectInterval || 3000);
  }

  // Закриття з'єднання
  
  disconnect() {
    this.isManualClose = true;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    this.ws?.close();
    this.ws = null;
  }

  // Перевірка стану з'єднання
  
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
