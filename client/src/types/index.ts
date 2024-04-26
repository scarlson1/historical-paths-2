import { Position } from 'deck.gl';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface EventYears {
  ts: number[];
  h: number[];
  mh: number[];
}

export interface EventProfile {
  name: string;
  year: number; // actually a string ??
  id: string;
  category: number; // actually a string ??
}

export interface AbbrCoord {
  lng: number;
  lat: number;
}

export interface TrackDataPoint {
  datetime: string;
  coordinates: Position; // number[];
  point_id: string;
  id: string;
  category: number; // actually a string ??
  year: number; // actually a string ??
  name: string;
}

export interface InitialEvent extends EventProfile {
  // name: string;
  // year: number;
  // id: string;
  // category: number;
  triggerCategory?: number;
  path: Position[]; //AbbrCoord[];
  track: TrackDataPoint[];
}

// TODO: narrow down event types
export interface EventSummary extends EventProfile {
  path: Position[];
}

export interface Event {
  profile: EventProfile;
  path: AbbrCoord[];
  track: TrackDataPoint[];
}
