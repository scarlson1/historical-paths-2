// TODO: move to query ??

import type { EventYears, InitialEventFix } from '../types/index.js';

export function formatEventsSummary(events: InitialEventFix[]) {
  const obj: EventYears = {
    ts: [],
    h: [],
    mh: [],
  };

  for (const event of events) {
    const cat = typeof event.category === 'string' ? parseInt(event.category) : event.category;
    switch (cat) {
      case 0:
        obj.ts.push(event.year);
        break;
      case 1:
      case 2:
        obj.h.push(event.year);
        break;
      case 3:
      case 4:
      case 5:
        obj.mh.push(event.year);
        break;
      default:
      // console.log('did not find category match in stats function');
    }
  }

  return obj;
}
