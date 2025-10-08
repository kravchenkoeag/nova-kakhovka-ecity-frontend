// packages/types/src/models/cityIssue.ts

export interface IssueComment {
  id: ObjectId;
  author_id: ObjectId;
  content: string;
  is_official: boolean;
  created_at: string;
  updated_at: string;
}

export interface CityIssue {
  id: ObjectId;
  reporter_id: ObjectId;
  title: string;
  description: string;
  category: 'road' | 'lighting' | 'water' | 'electricity' | 'waste' | 'transport' | 'building' | 'safety' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  location: Location;
  address: string;
  photos: string[];
  videos: string[];
  status: 'reported' | 'in_progress' | 'resolved' | 'rejected' | 'duplicate';
  assigned_to?: ObjectId;
  assigned_dept?: string;
  resolution?: string;
  resolution_note?: string;
  upvotes: ObjectId[];
  comments: IssueComment[];
  subscribers: ObjectId[];
  is_verified: boolean;
  is_public: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  duplicate_of?: ObjectId;
}