import { onCall } from 'firebase-functions/v2/https';
import { dbPassword } from '../lib/index.js';

export const eventsv2 = onCall({ secrets: [dbPassword] }, async (request) => {
  return (await import('./events.js')).default(request);
});

export const getlasteventdate = onCall(
  { secrets: [dbPassword] },
  async (request) => {
    return (await import('./getLastEventDate.js')).default(request);
  }
);
