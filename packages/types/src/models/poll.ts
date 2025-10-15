// packages/types/src/models/poll.ts
import type { ObjectId } from './common';
export interface PollOption {
  id: ObjectId;
  text: string;
  image?: string;
}

export interface PollQuestion {
  id: ObjectId;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'rating' | 'text' | 'scale' | 'yes_no';
  options: PollOption[];
  is_required: boolean;
  min_rating?: number;
  max_rating?: number;
  max_length?: number;
}

export interface PollAnswer {
  question_id: ObjectId;
  option_ids?: ObjectId[];
  text_answer?: string;
  number_answer?: number;
  bool_answer?: boolean;
}

export interface PollResponse {
  id: ObjectId;
  user_id: ObjectId;
  answers: PollAnswer[];
  submitted_at: string;
  user_agent?: string;
  ip_address?: string;
}

export interface OptionResult {
  option_id: ObjectId;
  option_text: string;
  count: number;
  percentage: number;
}

export interface QuestionResult {
  question_id: ObjectId;
  question_text: string;
  question_type: string;
  option_results?: OptionResult[];
  text_answers?: string[];
  average_rating?: number;
  total_answers: number;
  yes_count?: number;
  no_count?: number;
  min_value?: number;
  max_value?: number;
  median_value?: number;
}

export interface PollResults {
  question_results: QuestionResult[];
  updated_at: string;
}

export interface AgeRestriction {
  min_age: number;
  max_age: number;
}

export interface Poll {
  id: ObjectId;
  creator_id: ObjectId;
  title: string;
  description: string;
  category: 'city_planning' | 'transport' | 'infrastructure' | 'social' | 'environment' | 'governance' | 'budget' | 'education' | 'healthcare';
  questions: PollQuestion[];
  allow_multiple: boolean;
  is_anonymous: boolean;
  is_public: boolean;
  target_groups: ObjectId[];
  age_restriction?: AgeRestriction;
  location_required: boolean;
  start_date: string;
  end_date: string;
  total_responses: number;
  responses: PollResponse[];
  results: PollResults;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  is_verified: boolean;
  moderator_note?: string;
  view_count: number;
  share_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  published_at?: string;
}