"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@ecity/ui";
import { Send, LogIn } from "lucide-react";
import Link from "next/link";

interface MessageFormProps {
  groupId: string;
  isMember: boolean;
  onMessageSent?: () => void;
}

export function MessageForm({ groupId, isMember, onMessageSent }: MessageFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Гість — CTA для входу
  if (!session) {
    return (
      <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-between gap-4">
        <p className="text-sm text-gray-600">
          Щоб надіслати повідомлення, потрібно увійти
        </p>
        <Link href={`/login?callbackUrl=/groups/${groupId}`}>
          <Button size="sm">
            <LogIn className="h-4 w-4 mr-2" />
            Увійти
          </Button>
        </Link>
      </div>
    );
  }

  // Авторизований, але не учасник
  if (!isMember) {
    return (
      <div className="border-t bg-gray-50 px-6 py-4 text-center">
        <p className="text-sm text-gray-600">
          Вступіть у групу, щоб надіслати повідомлення
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || sending) return;

    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/proxy/api/v1/groups/${groupId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), type: "text" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Помилка надсилання");
      }
      setContent("");
      onMessageSent?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white px-6 py-4">
      {error && (
        <p className="text-xs text-red-600 mb-2">{error}</p>
      )}
      <div className="flex gap-3">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Написати повідомлення..."
          maxLength={1000}
          className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button type="submit" disabled={sending || !content.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
