// packages/types/src/models/event.ts

import type { ObjectId, Location, ContactInfo } from './common';

export interface Event {
  id: ObjectId;
  organizer_id: ObjectId;
  title: string;
  description: string;
  category: 'cultural' | 'educational' | 'social' | 'business' | 'sports' | 'charity' | 'meeting' | 'workshop' | 'conference';
  start_date: string;
  end_date?: string;
  location?: Location;
  address?: string;
  venue?: string;
  is_online: boolean;
  online_url?: string;
  participants: ObjectId[];
  max_participants: number;
  min_age?: number;
  max_age?: number;
  is_public: boolean;
  is_free: boolean;
  price?: number;
  currency?: string;
  requirements?: string;
  prohibited_items: string[];
  contact_info: ContactInfo[];
  images: string[];
  cover_image?: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  is_verified: boolean;
  is_featured: boolean;
  view_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
  tags: string[];
}