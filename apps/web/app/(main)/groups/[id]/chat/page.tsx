// apps/web/app/(main)/groups/[id]/chat/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useWebSocket, type WSMessage } from "@ecity/websocket";
import { useAccessToken } from "@ecity/auth";
import { useSession } from "next-auth/react";
import { Button, Input } from "@ecity/ui";
import { Send } from "lucide-react";

/**
 * Сторінка чату групи з WebSocket підтримкою
 * Доступна тільки для авторизованих користувачів - членів групи
 *
 * 🔒 КРИТИЧНО: Перевірка авторизації відбувається через useSession
 * WebSocket автоматично використовує access token для автентифікації
 */
export default function GroupChatPage({ params }: { params: { id: string } }) {
  // 🔒 КРИТИЧНО: Перевірка авторизації через session
  const { data: session } = useSession();
  const token = useAccessToken();

  // WebSocket підключення з автентифікацією
  const { isConnected, messages, sendMessage, sendTyping } = useWebSocket(
    token,
    true
  );

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Автоскрол до останнього повідомлення
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Індикатор набору тексту
  useEffect(() => {
    if (inputValue && !isTyping) {
      setIsTyping(true);
      sendTyping(params.id, true);
    } else if (!inputValue && isTyping) {
      setIsTyping(false);
      sendTyping(params.id, false);
    }
  }, [inputValue, isTyping, params.id, sendTyping]);

  // Відправити повідомлення
  const handleSend = () => {
    if (!inputValue.trim()) return;

    sendMessage(params.id, inputValue.trim());
    setInputValue("");
    setIsTyping(false);
    sendTyping(params.id, false);
  };

  // Enter для відправки, Shift+Enter для нового рядка
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Фільтруємо повідомлення тільки для цієї групи
  const groupMessages = messages.filter(
    (msg: WSMessage) =>
      msg.type === "message" && msg.data.group_id === params.id
  );

  // Якщо не авторизований, показуємо повідомлення
  if (!session) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Авторизація необхідна
          </h2>
          <p className="text-gray-600">
            Будь ласка, увійдіть, щоб використовувати чат
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Заголовок чату */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Чат групи</h1>
            <div className="flex items-center space-x-2 mt-1">
              <div
                className={`h-2 w-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <span className="text-sm text-gray-600">
                {isConnected ? "Підключено" : "Відключено"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Область повідомлень */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {groupMessages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            Немає повідомлень. Почніть спілкування!
          </div>
        ) : (
          groupMessages.map((msg: WSMessage, index: number) => {
            const isOwn = msg.data.user_id === session?.user?.id;
            return (
              <div
                key={index}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn
                      ? "bg-primary text-white"
                      : "bg-white border shadow-sm"
                  }`}
                >
                  {!isOwn && (
                    <p className="text-xs font-semibold mb-1">
                      {msg.data.user_name || "Користувач"}
                    </p>
                  )}
                  <p className="text-sm">{msg.data.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString("uk-UA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле введення повідомлення */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введіть повідомлення..."
            className="flex-1"
            disabled={!isConnected}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || !isConnected}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Натисніть Enter, щоб відправити. Shift+Enter для нового рядка.
        </p>
      </div>
    </div>
  );
}
