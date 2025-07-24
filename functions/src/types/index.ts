export interface Coordinate {
  lng: number;
  lat: number;
}

export interface EventProfile {
  name: string;
  year: string; // number; // actually a string ??
  id: string;
  category: string; // number; // actually a string ??
}

export interface TrackDataPoint {
  datetime: string;
  coordinates: number[];
  point_id: string;
  id: string;
  category: number;
  year: number;
  name: string;
}

export interface InitialEvent extends EventProfile {
  // name: string;
  // year: number;
  // id: string;
  // category: number;
  triggerCategory?: number;
  path: Coordinate[];
  track: TrackDataPoint[];
}

export interface InitialEventFix
  extends Omit<InitialEvent, 'year' | 'category'> {
  year: number;
  category: number;
}

export interface Event {
  profile: EventProfile;
  path: Coordinate[];
  track: TrackDataPoint[];
}

export interface EventYears {
  ts: number[];
  h: number[];
  mh: number[];
}

export interface EventRow {
  basin: string;
  category: number;
  geography: string;
  geometry: string;
  iso_time: string;
  latitude: string | number;
  longitude: string | number;
  name: string;
  nature: string;
  point_id: string;
  season: string;
  sid: string;
  timestamp: any;
  usa_sshs: string;
  usa_status: string;
  year: number;
}
