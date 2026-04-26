"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@ecity/ui";
import { UserPlus, LogOut, MessageSquare, LogIn } from "lucide-react";
import Link from "next/link";

interface GroupActionsProps {
  groupId: string;
  isMember: boolean;
  isPublic: boolean;
}

export function GroupActions({ groupId, isMember: initialIsMember, isPublic }: GroupActionsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMember, setIsMember] = useState(initialIsMember);
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <Link href={`/login?callbackUrl=/groups/${groupId}`}>
        <Button variant="outline">
          <LogIn className="h-4 w-4 mr-2" />
          Увійти, щоб приєднатися
        </Button>
      </Link>
    );
  }

  async function handleJoin() {
    setLoading(true);
    try {
      const res = await fetch(`/api/proxy/api/v1/groups/${groupId}/join`, { method: "POST" });
      if (res.ok) {
        setIsMember(true);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleLeave() {
    setLoading(true);
    try {
      const res = await fetch(`/api/proxy/api/v1/groups/${groupId}/leave`, { method: "POST" });
      if (res.ok) {
        setIsMember(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (isMember) {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/groups/${groupId}/chat`}>
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            Чат
          </Button>
        </Link>
        <Button variant="outline" onClick={handleLeave} disabled={loading}>
          <LogOut className="h-4 w-4 mr-2" />
          Покинути
        </Button>
      </div>
    );
  }

  if (!isPublic) {
    return (
      <Button variant="outline" disabled>
        Закрита група
      </Button>
    );
  }

  return (
    <Button onClick={handleJoin} disabled={loading}>
      <UserPlus className="h-4 w-4 mr-2" />
      {loading ? "..." : "Вступити"}
    </Button>
  );
}
