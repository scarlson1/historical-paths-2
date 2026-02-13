import type { GeoPoint } from 'firebase-admin/firestore';
import { isFinite } from 'lodash-es';
import { verify } from './validate.js';

// if using zod:
// export const Coords = z.object({
//   latitude: z.number().min(-90, 'invalid latitude').max(90, 'invalid latitude'),
//   longitude: z.number().min(-180, 'invalid longitude').max(180, 'invalid longitude'),
// });
// export type Coords = z.infer<typeof Coords>;
export type Nullable<T> = { [K in keyof T]: T[K] | null };

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function betweenRange(value: number, n1: number, n2: number) {
  return n1 <= value && n2 >= value;
}

export const isValidCoords = (
  val: GeoPoint | Nullable<Coordinates> | null | undefined
): val is Coordinates | GeoPoint => {
  if (!val) return false;
  const { latitude, longitude } = val;

  return isLongitude(longitude) && isLatitude(latitude);
};

export const isLongitude = (lon: unknown) =>
  !!(isFinite(lon) && betweenRange(lon as number, -180, 180));

export const isLatitude = (lat: unknown) =>
  !!(isFinite(lat) && betweenRange(lat as number, -90, 90));

export function validateCoords(coords?: any): asserts coords is GeoPoint {
  verify(coords, 'coordinates required');
  const { latitude, longitude } = coords;
  verify(latitude && longitude && isValidCoords(coords), 'coordinates required');
}
