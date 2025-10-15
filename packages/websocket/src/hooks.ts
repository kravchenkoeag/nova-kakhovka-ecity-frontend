// packages/websocket/src/hooks.ts

'use client';

import { useEffect, useState, useCallback } from 'react';
import { WebSocketClient, type WSMessage } from './client';
import { useAccessToken } from '@ecity/auth';

// React Hook для WebSocket з'єднання

export function useWebSocket(enabled = true) {
  const token = useAccessToken();
  const [client, setClient] = useState<WebSocketClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WSMessage[]>([]);

  useEffect(() => {
    if (!enabled || !token) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';

    const wsClient = new WebSocketClient({
      url: wsUrl,
      token,
      onConnect: () => setIsConnected(true),
      onDisconnect: () => setIsConnected(false),
      onMessage: (message) => {
        setMessages((prev) => [...prev, message]);
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
      },
    });

    wsClient.connect();
    setClient(wsClient);

    return () => {
      wsClient.disconnect();
    };
  }, [token, enabled]);

  const sendMessage = useCallback(
    (groupId: string, content: string) => {
      client?.sendMessage(groupId, content);
    },
    [client]
  );

  const sendTyping = useCallback(
    (groupId: string, isTyping: boolean) => {
      client?.sendTyping(groupId, isTyping);
    },
    [client]
  );

  return {
    isConnected,
    messages,
    sendMessage,
    sendTyping,
    client,
  };
}
