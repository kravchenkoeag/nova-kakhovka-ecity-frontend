// packages/types/src/models/announcement.ts

import type { ObjectId, Location, ContactInfo } from "./common";

export interface Announcement {
  id: ObjectId;
  author_id: ObjectId;
  title: string;
  description: string;
  category: "work" | "help" | "services" | "housing" | "transport";
  location?: Location;
  address?: string;
  employment?: "once" | "permanent" | "partial";
  contact_info: ContactInfo[];
  media_files: string[];
  is_active: boolean;
  is_moderated: boolean;
  is_blocked: boolean;
  views: number;
  contacts: number;
  created_at: string;
  updated_at: string;
  expires_at: string;
}
