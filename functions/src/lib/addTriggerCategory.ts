import { booleanPointInPolygon, circle, point } from '@turf/turf';
import { InitialEventFix } from '../types/index.js';

export function addTriggerCategory(events: InitialEventFix[], locationCoords: number[]) {
  let radius = 150;
  var proxy = circle(locationCoords, radius, { steps: 10, units: 'miles' });

  let result: InitialEventFix[] = [];

  // for event in events
  for (let event of events) {
    let maxCatInCircle = 0;
    // loop through points to get points in radius
    for (let dp of event.track) {
      let pt = point(dp.coordinates);

      if (booleanPointInPolygon(pt, proxy)) {
        if (dp.category > maxCatInCircle) {
          maxCatInCircle = dp.category;
        }
      }
    }
    let newEvent: InitialEventFix = {
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
