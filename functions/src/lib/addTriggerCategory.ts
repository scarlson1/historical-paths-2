import { booleanPointInPolygon, circle, point } from '@turf/turf';
import type { InitialEventFix } from '../types/index.js';

export function addTriggerCategory(events: InitialEventFix[], locationCoords: number[]) {
  const radius = 150;
  const proxy = circle(locationCoords, radius, { steps: 10, units: 'miles' });

  const result: InitialEventFix[] = [];

  // for event in events
  for (const event of events) {
    let maxCatInCircle = 0;
    // loop through points to get points in radius
    for (const dp of event.track) {
      const pt = point(dp.coordinates);

      if (booleanPointInPolygon(pt, proxy)) {
        if (dp.category > maxCatInCircle) {
          maxCatInCircle = dp.category;
        }
      }
    }
    const newEvent: InitialEventFix = {
      name: event.name,
      year: event.year,
      id: event.id,
      category: event.category,
      triggerCategory: maxCatInCircle,
      path: event.path,
      track: event.track,
    };
    result.push(newEvent);
  }

  return result;
}
