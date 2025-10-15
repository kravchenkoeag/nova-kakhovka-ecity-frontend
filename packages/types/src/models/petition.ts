// packages/types/src/models/petition.ts
import type { ObjectId } from './common';
export interface PetitionSignature {
  user_id: ObjectId;
  full_name: string;
  diia_key_id?: string;
  is_verified: boolean;
  signed_at: string;
  comment?: string;
}

export interface OfficialResponse {
  responder_id: ObjectId;
  responder_name: string;
  position: string;
  response: string;
  decision: 'accepted' | 'rejected' | 'partially_accepted';
  action_plan?: string;
  responded_at: string;
  documents: string[];
}

export interface Petition {
  id: ObjectId;
  author_id: ObjectId;
  title: string;
  description: string;
  category: 'infrastructure' | 'social' | 'environment' | 'economy' | 'governance' | 'safety' | 'transport' | 'education' | 'healthcare';
  required_signatures: number;
  demands: string;
  signatures: PetitionSignature[];
  signature_count: number;
  status: 'draft' | 'active' | 'completed' | 'expired' | 'under_review' | 'accepted' | 'rejected';
  is_verified: boolean;
  moderator_note?: string;
  official_response?: OfficialResponse;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  tags: string[];
  view_count: number;
  share_count: number;
  attachment_urls: string[];
}