// apps/web/app/(main)/groups/[id]/chat/page.tsx

'use client';

import { useWebSocket } from '@ecity/websocket'; // Імпорт хуку для WebSocket 

export default function ChatPage({ params }: { params: { id: string } }) {
  const { isConnected, messages, sendMessage, sendTyping } = useWebSocket(true);

  // Відправити повідомлення
  const handleSend = (content: string) => {
    sendMessage(params.id, content);
  };

  // Typing indicator
  const handleTyping = (isTyping: boolean) => {
    sendTyping(params.id, isTyping);
  };

  return (
    <div>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      {/* Чат UI */}
    </div>
  );
}