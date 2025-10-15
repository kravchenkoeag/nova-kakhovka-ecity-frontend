// packages/types/src/api/requests.ts

import type { Location, ContactInfo } from '../models/common';
import type { TransportSchedule } from '../models/transport';

// Auth requests
export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Group requests
export interface CreateGroupRequest {
  name: string;
  description?: string;
  type: 'country' | 'region' | 'city' | 'interest';
  location_filter?: string;
  interest_filter?: string[];
  is_public: boolean;
  auto_join?: boolean;
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