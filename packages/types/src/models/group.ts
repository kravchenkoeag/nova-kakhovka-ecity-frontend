// packages/types/src/models/group.ts
import type { ObjectId } from "./common";

export interface Group {
  id: ObjectId;
  name: string;
  description: string;
  type: "country" | "region" | "city" | "interest";
  location_filter?: string;
  interest_filter: string[];
  members: ObjectId[];
  admins: ObjectId[];
  moderators: ObjectId[];
  is_public: boolean;
  auto_join: boolean;
  max_members: number;
  created_at: string;
  updated_at: string;
  created_by: ObjectId;
}
