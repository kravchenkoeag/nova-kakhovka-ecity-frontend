// packages/types/src/api/requests.ts

import type { Location, ContactInfo } from "../models/common";
import type { TransportSchedule } from "../models/transport";

// Group requests
export interface CreateGroupRequest {
  name: string;
  description?: string;
  type: "country" | "region" | "city" | "interest";
  location_filter?: string;
  interest_filter?: string[];
  is_public: boolean;
  auto_join?: boolean;
  max_members?: number;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  is_public?: boolean;
  max_members?: number;
}

// Event requests
export interface CreateEventRequest {
  title: string;
  description: string;
  category: string;
  start_date: string;
  end_date?: string;
  location?: Location;
  address?: string;
  venue?: string;
  is_online: boolean;
  online_url?: string;
  is_public: boolean;
  is_free: boolean;
  price?: number;
  max_participants?: number;
  contact_info?: ContactInfo[];
  tags?: string[];
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
  location?: Location;
  address?: string;
  venue?: string;
  is_online?: boolean;
  online_url?: string;
  is_public?: boolean;
  is_free?: boolean;
  price?: number;
  max_participants?: number;
  contact_info?: ContactInfo[];
  tags?: string[];
}

// Announcement requests
export interface CreateAnnouncementRequest {
  title: string;
  description: string;
  category: string;
  location?: Location;
  address?: string;
  employment?: string;
  contact_info: ContactInfo[];
  media_files?: string[];
  expires_at?: string;
}

export interface UpdateAnnouncementRequest {
  title?: string;
  description?: string;
  category?: string;
  location?: Location;
  address?: string;
  employment?: string;
  contact_info?: ContactInfo[];
  media_files?: string[];
  expires_at?: string;
}

// Petition requests
export interface CreatePetitionRequest {
  title: string;
  description: string;
  category: string;
  required_signatures: number;
  demands: string;
  end_date: string;
  tags?: string[];
  attachment_urls?: string[];
}

export interface UpdatePetitionRequest {
  title?: string;
  description?: string;
  category?: string;
  required_signatures?: number;
  demands?: string;
  end_date?: string;
  tags?: string[];
  attachment_urls?: string[];
}

export interface SignPetitionRequest {
  comment?: string;
  diia_key_id?: string;
}

// Poll requests
export interface CreatePollRequest {
  title: string;
  description: string;
  category: string;
  questions: Array<{
    text: string;
    type: string;
    options?: Array<{ text: string; image?: string }>;
    is_required: boolean;
    min_rating?: number;
    max_rating?: number;
    max_length?: number;
  }>;
  allow_multiple: boolean;
  is_anonymous: boolean;
  is_public: boolean;
  start_date: string;
  end_date: string;
  tags?: string[];
}

export interface UpdatePollRequest {
  title?: string;
  description?: string;
  category?: string;
  questions?: Array<{
    text: string;
    type: string;
    options?: Array<{ text: string; image?: string }>;
    is_required: boolean;
    min_rating?: number;
    max_rating?: number;
    max_length?: number;
  }>;
  allow_multiple?: boolean;
  is_anonymous?: boolean;
  is_public?: boolean;
  start_date?: string;
  end_date?: string;
  tags?: string[];
}

export interface SubmitPollResponseRequest {
  answers: Array<{
    question_id: string;
    option_ids?: string[];
    text_answer?: string;
    number_answer?: number;
    bool_answer?: boolean;
  }>;
}

// City Issue requests
export interface CreateCityIssueRequest {
  title: string;
  description: string;
  category: string;
  priority?: string;
  location: Location;
  address: string;
  photos?: string[];
  videos?: string[];
}

export interface UpdateCityIssueRequest {
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  status?: string;
  assigned_department?: string;
  photos?: string[];
  videos?: string[];
}

export interface AddIssueCommentRequest {
  content: string;
}

// Transport requests
export interface CreateRouteRequest {
  route_number: string;
  route_name: string;
  transport_type: string;
  stops: Array<{
    name: string;
    location: Location;
    stop_order?: number;
    has_shelter?: boolean;
    has_bench?: boolean;
    is_accessible?: boolean;
    travel_time_from_start?: number;
  }>;
  schedule: TransportSchedule;
  first_departure: string;
  last_departure: string;
  fare: number;
  is_accessible?: boolean;
  has_wifi?: boolean;
  has_ac?: boolean;
}

export interface UpdateRouteRequest {
  route_number?: string;
  route_name?: string;
  transport_type?: string;
  stops?: Array<{
    name: string;
    location: Location;
    stop_order?: number;
    has_shelter?: boolean;
    has_bench?: boolean;
    is_accessible?: boolean;
    travel_time_from_start?: number;
  }>;
  schedule?: TransportSchedule;
  first_departure?: string;
  last_departure?: string;
  fare?: number;
  is_accessible?: boolean;
  has_wifi?: boolean;
  has_ac?: boolean;
}

// Message requests
export interface SendMessageRequest {
  content: string;
  type?: "text" | "image" | "video" | "file" | "link";
  media_url?: string;
  reply_to_id?: string;
}

export interface UpdateMessageRequest {
  content: string;
}

// User update requests
export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  profession?: string;
  profile_pic?: string;
  registered_address?: string;
  is_address_visible?: boolean;
  interests?: string[];
}

export interface UpdateUserStatusRequest {
  message: string;
  is_visible: boolean;
}

export interface UpdateBusinessInfoRequest {
  name: string;
  description: string;
  services: string[];
  category: string;
}

// Search and filter requests
export interface SearchRequest {
  query: string;
  type?:
    | "users"
    | "groups"
    | "events"
    | "announcements"
    | "petitions"
    | "polls"
    | "issues";
  filters?: Record<string, any>;
  page?: number;
  limit?: number;
}

export interface PaginationRequest {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}
