// packages/types/src/models/user.ts
import type { ObjectId, Location } from "./common";
import type { UserRole } from "./roles";

export interface UserStatus {
  message: string;
  is_visible: boolean;
  updated_at: string;
}

export interface BusinessInfo {
  name: string;
  description: string;
  services: string[];
  category: string;
}

export interface User {
  id: ObjectId;
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  profession?: string;
  profile_pic?: string;
  current_location?: Location;
  registered_address?: string;
  is_address_visible: boolean;
  interests: string[];
  status: UserStatus;
  business_info?: BusinessInfo;
  groups: ObjectId[];
  is_verified: boolean;
  is_blocked: boolean;
  role: UserRole; // New role field replacing is_moderator
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  email_verified_at?: string;
  phone_verified_at?: string;
}

// Legacy interface for backward compatibility during migration
export interface UserLegacy {
  id: ObjectId;
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  profession?: string;
  profile_pic?: string;
  current_location?: Location;
  registered_address?: string;
  is_address_visible: boolean;
  interests: string[];
  status: UserStatus;
  business_info?: BusinessInfo;
  groups: ObjectId[];
  is_verified: boolean;
  is_moderator: boolean; // Keep for backward compatibility
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  email_verified_at?: string;
  phone_verified_at?: string;
}
