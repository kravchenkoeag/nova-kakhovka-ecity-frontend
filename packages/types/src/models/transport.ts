// packages/types/src/models/transport.ts

import type { ObjectId, Location } from './common';

export interface TransportStop {
  id: ObjectId;
  name: string;
  location: Location;
  stop_order: number;
  has_shelter: boolean;
  has_bench: boolean;
  is_accessible: boolean;
  travel_time_from_start: number;
}

export interface ScheduleInterval {
  start_time: string;
  end_time: string;
  interval: number;
}

export interface TransportSchedule {
  weekdays: ScheduleInterval[];
  saturday: ScheduleInterval[];
  sunday: ScheduleInterval[];
  holidays: ScheduleInterval[];
}

export interface TransportRoute {
  id: ObjectId;
  route_number: string;
  route_name: string;
  transport_type: 'bus' | 'trolley' | 'minibus' | 'taxi';
  stops: TransportStop[];
  path_coords: Location[];
  total_distance: number;
  schedule: TransportSchedule;
  first_departure: string;
  last_departure: string;
  fare: number;
  is_accessible: boolean;
  has_wifi: boolean;
  has_ac: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: ObjectId;
}

export interface TransportVehicle {
  id: ObjectId;
  vehicle_number: string;
  route_id: ObjectId;
  transport_type: 'bus' | 'trolley' | 'minibus' | 'taxi';
  model?: string;
  capacity: number;
  is_accessible: boolean;
  has_wifi: boolean;
  has_ac: boolean;
  current_location?: Location;
  current_stop_id?: ObjectId;
  direction?: 'forward' | 'backward';
  speed?: number;
  last_update?: string;
  status: 'active' | 'maintenance' | 'out_of_service';
  is_tracked: boolean;
  driver_id?: ObjectId;
  created_at: string;
  updated_at: string;
}
